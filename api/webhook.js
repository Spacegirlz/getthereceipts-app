const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialize Stripe and Supabase inside function
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`🎣 Webhook received: ${event.type}`);

  // Handle successful checkout (one-time payments and subscription setup)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userEmail = session.customer_details?.email;
    const amountPaid = session.amount_total / 100; // Convert cents to dollars
    const mode = session.mode; // 'payment' for one-time, 'subscription' for recurring
    
    console.log(`💳 Payment completed: ${userEmail} paid $${amountPaid} (mode: ${mode})`);
    
    if (!userEmail) {
      console.error('❌ No email in session');
      return res.status(200).json({ received: true });
    }
    
    await handlePaymentSuccess(userEmail, amountPaid, mode, session);
  }

  // Handle subscription invoice payments (monthly/yearly renewals)
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object;
    const userEmail = invoice.customer_email;
    const amountPaid = invoice.amount_paid / 100; // Convert cents to dollars
    const subscriptionId = invoice.subscription;
    
    console.log(`💳 Subscription payment: ${userEmail} paid $${amountPaid} (subscription: ${subscriptionId})`);
    
    if (!userEmail) {
      console.error('❌ No email in invoice');
      return res.status(200).json({ received: true });
    }
    
    await handlePaymentSuccess(userEmail, amountPaid, 'subscription', invoice);
  }

  // Handle subscription cancellations
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    
    console.log(`🚫 Subscription cancelled: ${subscription.id} for customer ${customerId}`);
    
    // Get customer email from Stripe
    const customer = await stripe.customers.retrieve(customerId);
    const userEmail = customer.email;
    
    if (userEmail) {
      await handleSubscriptionDowngrade(userEmail, 'cancelled');
    }
  }

  // Handle failed subscription payments
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    const userEmail = invoice.customer_email;
    const attemptCount = invoice.attempt_count;
    
    console.log(`❌ Payment failed: ${userEmail}, attempt ${attemptCount}`);
    
    if (userEmail) {
      // After multiple failed attempts, downgrade to free
      if (attemptCount >= 3) {
        console.log(`🔄 Max payment attempts reached, downgrading ${userEmail} to free`);
        await handleSubscriptionDowngrade(userEmail, 'payment_failed');
      }
    }
  }

  // Handle subscription updates/downgrades
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const status = subscription.status;
    
    console.log(`📝 Subscription updated: ${subscription.id}, status: ${status}`);
    
    // Get customer email
    const customer = await stripe.customers.retrieve(customerId);
    const userEmail = customer.email;
    
    if (userEmail && (status === 'canceled' || status === 'unpaid' || status === 'past_due')) {
      await handleSubscriptionDowngrade(userEmail, status);
    }
  }

  // Shared subscription downgrade function
  async function handleSubscriptionDowngrade(userEmail, reason) {
    console.log(`⬇️ Downgrading ${userEmail} to free tier (reason: ${reason})`);
    
    // Get current user data
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching user for downgrade:', fetchError);
      return;
    }
    
    // Downgrade to free tier with 1 daily credit
    const { error } = await supabase
      .from('users')
      .update({ 
        credits_remaining: 1, // Reset to 1 free daily credit
        subscription_status: 'free',
        last_free_receipt_date: new Date().toISOString().split('T')[0]
      })
      .eq('email', userEmail);
      
    if (error) {
      console.error('❌ Error downgrading user:', error);
    } else {
      console.log(`✅ Successfully downgraded ${userEmail} to free tier (1 daily credit)`);
    }
  }

  // Shared payment processing function
  async function handlePaymentSuccess(userEmail, amountPaid, mode, paymentObject) {
    // Determine credits and subscription type based on amount
    let creditsToAdd = 0;
    let subscriptionType = 'free';
    
    if (amountPaid === 1.99) {
      creditsToAdd = 5; // Emergency Pack
      subscriptionType = 'free'; // Stays free, just adds credits
    } else if (amountPaid === 6.99) {
      creditsToAdd = -1; // Unlimited for monthly premium
      subscriptionType = 'premium'; // Monthly subscription
    } else if (amountPaid === 29.99) {
      creditsToAdd = -1; // Unlimited for yearly
      subscriptionType = 'yearly'; // Yearly subscription
    } else {
      console.log(`⚠️ Unknown payment amount: $${amountPaid} - treating as emergency pack`);
      creditsToAdd = 5;
      subscriptionType = 'free';
    }
    
    console.log(`🎯 Processing ${userEmail}: ${creditsToAdd === -1 ? 'unlimited' : creditsToAdd} credits, subscription: ${subscriptionType}`);
    
    // Get current user data
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('credits_remaining, subscription_status')
      .eq('email', userEmail)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching user:', fetchError);
      return;
    }
    
    // Calculate new credits
    let newCredits;
    if (creditsToAdd === -1) {
      newCredits = -1; // Unlimited for subscriptions
    } else {
      newCredits = (currentUser.credits_remaining || 0) + creditsToAdd; // Add to existing
    }
    
    // Update user subscription and credits
    const { data, error } = await supabase
      .from('users')
      .update({ 
        credits_remaining: newCredits,
        subscription_status: subscriptionType,
        last_free_receipt_date: new Date().toISOString().split('T')[0]
      })
      .eq('email', userEmail);
      
    if (error) {
      console.error('❌ Error updating user:', error);
    } else {
      console.log(`✅ Successfully updated ${userEmail}: ${newCredits === -1 ? 'unlimited' : newCredits} credits, subscription: ${subscriptionType}`);
    }
  }

  res.status(200).json({ received: true });
}

// Webhook configuration for Vercel
module.exports.config = {
  api: {
    bodyParser: false, // Disable bodyParser for Stripe webhooks (need raw body)
  },
};