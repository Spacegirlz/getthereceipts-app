const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialize Stripe and Supabase inside function
  // Note: VITE_ prefix is for client-side only, server-side uses different env vars
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, // Support both naming conventions
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY // Support both naming conventions
  );
  
  // Validate required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY is missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  
  if (!process.env.SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
    console.error('❌ Supabase URL is missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  
  if (!process.env.SUPABASE_SERVICE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Supabase Service Key is missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }

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
    
    // Get actual subscription period end from Stripe (more accurate than calculating)
    let subscriptionDetails = null;
    if (subscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        subscriptionDetails = {
          subscriptionId,
          expiresAt: new Date(subscription.current_period_end * 1000)
        };
        console.log(`📅 Subscription expires: ${subscriptionDetails.expiresAt.toISOString()}`);
      } catch (error) {
        console.error('❌ Error fetching subscription details:', error);
        // Continue without subscription details - will use calculated expiration
      }
    }
    
    await handlePaymentSuccess(userEmail, amountPaid, 'subscription', invoice, subscriptionDetails);
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
  async function handlePaymentSuccess(userEmail, amountPaid, mode, paymentObject, subscriptionDetails = null) {
    // Get current user data FIRST (needed for Emergency Pack logic)
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('credits_remaining, subscription_status')
      .eq('email', userEmail)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching user:', fetchError);
      return;
    }
    
    // Determine credits and subscription type based on amount
    let creditsToAdd = 0;
    let subscriptionType = 'free';
    let expiresAt = null;
    
    if (amountPaid === 0.99) {
      // Emergency Pack x 5 - $0.99
      console.log('🆘 Processing Emergency Pack x 5 ($0.99)');
      creditsToAdd = 5;
      subscriptionType = currentUser?.subscription_status || 'free'; // Keep current status, just add credits
    } else if (amountPaid === 1.99) {
      // Emergency Pack x 10 - $1.99
      console.log('🆘 Processing Emergency Pack x 10 ($1.99)');
      creditsToAdd = 10;
      subscriptionType = currentUser?.subscription_status || 'free'; // Keep current status, just add credits
    } else if (amountPaid === 4.99) {
      // Monthly Premium ($4.99) → premium unlimited
      console.log('🆕 Mapping $4.99 monthly to premium');
      creditsToAdd = -1;
      subscriptionType = 'premium';
      // Use Stripe's actual subscription period end if available, otherwise calculate
      expiresAt = subscriptionDetails?.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (amountPaid === 29.99) {
      creditsToAdd = -1; // Unlimited for yearly
      subscriptionType = 'yearly'; // Yearly subscription
      // Use Stripe's actual subscription period end if available, otherwise calculate
      expiresAt = subscriptionDetails?.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    } else {
      console.log(`⚠️ Unknown one-time payment amount: $${amountPaid} - no plan change applied`);
      creditsToAdd = 0;
      subscriptionType = currentUser?.subscription_status || 'free';
      // No expiration for unknown payments
    }
    
    console.log(`🎯 Processing ${userEmail}: ${creditsToAdd === -1 ? 'unlimited' : creditsToAdd} credits, subscription: ${subscriptionType}, expires: ${expiresAt?.toISOString()}`);
    
    // Calculate new credits
    let newCredits;
    if (creditsToAdd === -1) {
      newCredits = -1; // Unlimited for subscriptions
    } else {
      newCredits = (currentUser.credits_remaining || 0) + creditsToAdd; // Add to existing
    }
    
    // Build update object with expiration tracking
    const updateData = {
      credits_remaining: newCredits,
      subscription_status: subscriptionType,
      last_free_receipt_date: new Date().toISOString().split('T')[0]
    };
    
    // Add expiration date if subscription has one
    if (expiresAt) {
      updateData.subscription_expires_at = expiresAt.toISOString();
    }
    
    // Update user subscription and credits
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('email', userEmail);
      
    if (error) {
      console.error('❌ Error updating user:', error);
    } else {
      console.log(`✅ Successfully updated ${userEmail}: ${newCredits === -1 ? 'unlimited' : newCredits} credits, subscription: ${subscriptionType}${expiresAt ? `, expires: ${expiresAt.toISOString()}` : ''}`);
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