// ENHANCED WEBHOOK WITH SUBSCRIPTION SAFEGUARDS
// Replace your existing api/webhook.js with this enhanced version

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
    const amountPaid = session.amount_total / 100;
    const mode = session.mode;
    
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
    const amountPaid = invoice.amount_paid / 100;
    const subscriptionId = invoice.subscription;
    
    console.log(`💳 Subscription payment: ${userEmail} paid $${amountPaid} (subscription: ${subscriptionId})`);
    
    if (!userEmail) {
      console.error('❌ No email in invoice');
      return res.status(200).json({ received: true });
    }
    
    // 🛡️ ENHANCED: Get subscription details for expiration tracking
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      
      console.log(`📅 Subscription expires: ${currentPeriodEnd.toISOString()}`);
      
      await handlePaymentSuccess(userEmail, amountPaid, 'subscription', invoice, {
        subscriptionId,
        expiresAt: currentPeriodEnd
      });
    } catch (error) {
      console.error('❌ Error fetching subscription details:', error);
      await handlePaymentSuccess(userEmail, amountPaid, 'subscription', invoice);
    }
  }

  // Handle subscription cancellations
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    
    console.log(`🚫 Subscription cancelled: ${subscription.id} for customer ${customerId}`);
    
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
      // 🛡️ ENHANCED: Add grace period for first 2 failures
      if (attemptCount === 1 || attemptCount === 2) {
        console.log(`⏰ Adding grace period for ${userEmail} (attempt ${attemptCount})`);
        await addGracePeriod(userEmail, 3); // 3 days grace period
      } else if (attemptCount >= 3) {
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
    
    const customer = await stripe.customers.retrieve(customerId);
    const userEmail = customer.email;
    
    if (userEmail && (status === 'canceled' || status === 'unpaid' || status === 'past_due')) {
      await handleSubscriptionDowngrade(userEmail, status);
    }
  }

  // 🛡️ ENHANCED: Shared subscription downgrade function
  async function handleSubscriptionDowngrade(userEmail, reason) {
    console.log(`⬇️ Downgrading ${userEmail} to free tier (reason: ${reason})`);
    
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
        credits_remaining: 1,
        subscription_status: 'free',
        subscription_expires_at: null, // Clear expiration
        last_free_receipt_date: new Date().toISOString().split('T')[0]
      })
      .eq('email', userEmail);
      
    if (error) {
      console.error('❌ Error downgrading user:', error);
    } else {
      console.log(`✅ Successfully downgraded ${userEmail} to free tier (1 daily credit)`);
      
      // Log the event
      await supabase
        .from('subscription_events')
        .insert({
          user_id: currentUser.id,
          event_type: 'downgraded',
          event_data: { reason, from: currentUser.subscription_status }
        });
    }
  }

  // 🛡️ ENHANCED: Add grace period function
  async function addGracePeriod(userEmail, days) {
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
    
    if (user && !error) {
      const { error: updateError } = await supabase.rpc('add_grace_period', {
        user_uuid: user.id,
        days: days
      });
      
      if (updateError) {
        console.error('❌ Error adding grace period:', updateError);
      } else {
        console.log(`✅ Added ${days} days grace period for ${userEmail}`);
      }
    }
  }

  // 🛡️ ENHANCED: Shared payment processing function with expiration tracking
  async function handlePaymentSuccess(userEmail, amountPaid, mode, paymentObject, subscriptionDetails = null) {
    let creditsToAdd = 0;
    let subscriptionType = 'free';
    let expiresAt = null;
    
    if (amountPaid === 1.99) {
      creditsToAdd = 5; // Emergency Pack
      subscriptionType = 'free';
    } else if (amountPaid === 6.99) {
      creditsToAdd = -1; // Unlimited for monthly premium
      subscriptionType = 'premium';
      // Set expiration to 1 month from now
      expiresAt = subscriptionDetails?.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (amountPaid === 29.99) {
      creditsToAdd = -1; // Unlimited for yearly
      subscriptionType = 'yearly';
      // Set expiration to 1 year from now
      expiresAt = subscriptionDetails?.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    } else {
      console.log(`⚠️ Unknown payment amount: $${amountPaid} - treating as emergency pack`);
      creditsToAdd = 5;
      subscriptionType = 'free';
    }
    
    console.log(`🎯 Processing ${userEmail}: ${creditsToAdd === -1 ? 'unlimited' : creditsToAdd} credits, subscription: ${subscriptionType}, expires: ${expiresAt}`);
    
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('credits_remaining, subscription_status, id')
      .eq('email', userEmail)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching user:', fetchError);
      return;
    }
    
    let newCredits;
    if (creditsToAdd === -1) {
      newCredits = -1; // Unlimited for subscriptions
    } else {
      newCredits = (currentUser.credits_remaining || 0) + creditsToAdd;
    }
    
    // 🛡️ ENHANCED: Update with expiration tracking
    const updateData = { 
      credits_remaining: newCredits,
      subscription_status: subscriptionType,
      last_free_receipt_date: new Date().toISOString().split('T')[0],
      last_payment_date: new Date().toISOString()
    };
    
    if (expiresAt) {
      updateData.subscription_expires_at = expiresAt.toISOString();
    }
    
    if (subscriptionDetails?.subscriptionId) {
      updateData.stripe_subscription_id = subscriptionDetails.subscriptionId;
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('email', userEmail);
      
    if (error) {
      console.error('❌ Error updating user:', error);
    } else {
      console.log(`✅ Successfully updated ${userEmail}: ${newCredits === -1 ? 'unlimited' : newCredits} credits, expires: ${expiresAt}`);
      
      // Log the event
      await supabase
        .from('subscription_events')
        .insert({
          user_id: currentUser.id,
          event_type: 'payment_success',
          event_data: { 
            amount: amountPaid, 
            subscription_type: subscriptionType,
            expires_at: expiresAt?.toISOString()
          }
        });
    }
  }

  res.status(200).json({ received: true });
};
