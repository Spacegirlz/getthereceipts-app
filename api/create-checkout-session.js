const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📥 Checkout session request:', {
      method: req.method,
      body: req.body,
      headers: req.headers['content-type']
    });

    const { priceId, userId, referralId } = req.body || {};

    console.log('🔍 Extracted data:', { priceId, userId, referralId });

    if (!priceId) {
      console.error('❌ Missing priceId in request body:', req.body);
      return res.status(400).json({ 
        error: 'Price ID is required',
        received: { priceId, userId, body: req.body }
      });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not found in environment variables');
      return res.status(500).json({ error: 'Stripe configuration error' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Validate price exists and determine mode
    let mode = 'payment';
    try {
      console.log(`🔍 Validating price: ${priceId}`);
      const price = await stripe.prices.retrieve(priceId);
      // Use Stripe API to determine if it's a subscription
      mode = price.recurring ? 'subscription' : 'payment';
      console.log(`✅ Price validated: ${priceId} - ${price.unit_amount/100} ${price.currency}, mode: ${mode}`);
    } catch (priceError) {
      console.error('❌ Price validation error:', priceError);
      console.error('Price validation error details:', {
        priceId,
        errorType: priceError.type,
        errorCode: priceError.code,
        errorMessage: priceError.message
      });
      return res.status(400).json({ 
        error: 'Invalid price ID',
        priceId,
        details: priceError.message,
        type: priceError.type
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
      client_reference_id: referralId || undefined,
      metadata: {
        userId: userId || '',
        referral: referralId || undefined
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