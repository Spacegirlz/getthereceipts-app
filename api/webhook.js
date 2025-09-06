import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // For webhook verification, we need the raw body
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } else {
      // If no webhook secret is configured, parse the event directly (less secure)
      event = JSON.parse(body);
      console.warn('No webhook secret configured - using direct parsing');
    }
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionUpdate(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);

  const customerEmail = session.customer_details?.email;
  if (!customerEmail) {
    console.error('No customer email in session:', session.id);
    return;
  }

  // Get user ID by email
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', customerEmail)
    .single();

  if (userError) {
    console.error('Error finding user:', userError);
    return;
  }

  const userId = userData.id;

  if (session.mode === 'payment') {
    // One-time payment (Emergency Pack)
    await supabase.rpc('add_emergency_credits', {
      user_uuid: userId
    });
    console.log(`Added emergency credits for user ${userId}`);
  } else if (session.mode === 'subscription') {
    // Subscription payment
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const priceId = subscription.items.data[0]?.price.id;
    
    let subscriptionStatus = 'premium';
    if (priceId === 'price_1RzgBYG71EqeOEZer7ojcw0R') {
      subscriptionStatus = 'founder'; // OG Founders Club
    }

    await supabase.rpc('update_subscription_status', {
      user_uuid: userId,
      new_status: subscriptionStatus,
      stripe_sub_id: session.subscription
    });
    console.log(`Updated subscription status to ${subscriptionStatus} for user ${userId}`);
  }

  // Log the event
  await supabase
    .from('subscription_events')
    .insert({
      user_id: userId,
      event_type: 'checkout_completed',
      subscription_data: {
        session_id: session.id,
        mode: session.mode,
        amount_total: session.amount_total
      }
    });
}

async function handleSubscriptionUpdate(subscription) {
  console.log('Subscription updated:', subscription.id);

  const customer = await stripe.customers.retrieve(subscription.customer);
  const customerEmail = customer.email;

  if (!customerEmail) {
    console.error('No customer email for subscription:', subscription.id);
    return;
  }

  // Get user ID by email
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', customerEmail)
    .single();

  if (userError) {
    console.error('Error finding user:', userError);
    return;
  }

  const userId = userData.id;
  let status = 'free';

  if (subscription.status === 'active') {
    const priceId = subscription.items.data[0]?.price.id;
    if (priceId === 'price_1RzgBYG71EqeOEZer7ojcw0R') {
      status = 'founder'; // OG Founders Club
    } else {
      status = 'premium';
    }
  }

  await supabase.rpc('update_subscription_status', {
    user_uuid: userId,
    new_status: status,
    stripe_sub_id: subscription.id
  });

  // Log the event
  await supabase
    .from('subscription_events')
    .insert({
      user_id: userId,
      event_type: 'subscription_updated',
      subscription_data: {
        subscription_id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      }
    });
}

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded:', invoice.id);
  // Additional logging or processing if needed
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed:', invoice.id);

  const customer = await stripe.customers.retrieve(invoice.customer);
  const customerEmail = customer.email;

  if (!customerEmail) {
    console.error('No customer email for failed payment:', invoice.id);
    return;
  }

  // Could notify user of payment failure or downgrade subscription
  console.log(`Payment failed for customer: ${customerEmail}`);
}

// Configure the request body parser for Stripe webhooks
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};