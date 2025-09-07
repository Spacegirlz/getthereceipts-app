const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Determine mode based on price ID
    const isSubscription = priceId.includes('1RzgEZG71EqeOEZejcCAFxQs') || priceId.includes('1RzgBYG71EqeOEZer7ojcw0R');
    const mode = isSubscription ? 'subscription' : 'payment';

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      mode: mode,
      success_url: `${req.headers.origin || 'https://www.getthereceipts.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://www.getthereceipts.com'}/pricing`,
      metadata: {
        userId: userId || ''
      }
    };

    // Add customer email if user is provided
    if (userId) {
      sessionConfig.customer_email = userId; // Assuming userId is email for now
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({ sessionId: session.id });

  } catch (error) {
    console.error('Stripe checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};