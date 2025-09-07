const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  console.log('Function invoked, method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request body:', req.body);
    const { priceId, userId } = req.body || {};
    console.log('Parsed data:', { priceId, userId });

    if (!priceId) {
      console.log('No priceId provided');
      return res.status(400).json({ error: 'Price ID is required' });
    }

    console.log('Checking environment variables...');
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
    console.log('Has STRIPE_SECRET_KEY:', hasStripeKey);
    
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not found in environment variables');
      return res.status(500).json({ error: 'Stripe configuration error' });
    }

    console.log('Initializing Stripe...');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('Stripe initialized successfully');

    // Determine mode based on price ID
    const isSubscription = priceId.includes('1RzgEZG71EqeOEZejcCAFxQs') || priceId.includes('1RzgBYG71EqeOEZer7ojcw0R');
    const mode = isSubscription ? 'subscription' : 'payment';
    
    console.log('Price ID analysis:', { priceId, isSubscription, mode });

    // Validate price exists
    try {
      await stripe.prices.retrieve(priceId);
    } catch (priceError) {
      console.error('Price validation error:', priceError);
      return res.status(400).json({ 
        error: 'Invalid price ID',
        details: priceError.message 
      });
    }

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
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param
    });
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
};