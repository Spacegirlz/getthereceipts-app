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

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userEmail = session.customer_details?.email;
    const amountPaid = session.amount_total / 100; // Convert cents to dollars
    
    console.log(`💳 Payment completed: ${userEmail} paid $${amountPaid}`);
    
    if (!userEmail) {
      console.error('❌ No email in session');
      return res.status(200).json({ received: true });
    }
    
    // Determine credits based on amount
    let creditsToAdd = 0;
    let subscriptionType = 'free';
    
    if (amountPaid === 1.99) {
      creditsToAdd = 5; // Emergency Pack
      subscriptionType = 'free';
    } else if (amountPaid === 6.99) {
      creditsToAdd = 30; // Monthly
      subscriptionType = 'premium';
    } else if (amountPaid === 29.99) {
      creditsToAdd = 999999; // Yearly founder
      subscriptionType = 'yearly';
    }
    
    console.log(`🎯 Adding ${creditsToAdd} credits to ${userEmail}`);
    
    // Get current credits first
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('credits_remaining')
      .eq('email', userEmail)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching user:', fetchError);
      return res.status(200).json({ received: true });
    }
    
    // Add to existing credits (don't overwrite)
    const newCredits = (currentUser.credits_remaining || 0) + creditsToAdd;
    
    // Update user credits
    const { data, error } = await supabase
      .from('users')
      .update({ 
        credits_remaining: newCredits,
        subscription_status: subscriptionType
      })
      .eq('email', userEmail);
      
    if (error) {
      console.error('❌ Error updating user:', error);
    } else {
      console.log(`✅ Successfully added ${creditsToAdd} credits to ${userEmail} (total: ${newCredits})`);
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