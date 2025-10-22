import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, messages, temperature, max_tokens, presence_penalty, frequency_penalty, response_format } = req.body;

    if (!model || !messages) {
      return res.status(400).json({ error: 'Missing required fields: model and messages' });
    }

    // Get API key from Authorization header or environment variable
    const authHeader = req.headers.authorization;
    let apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    if (!apiKey) {
      return res.status(401).json({ error: 'No API key provided' });
    }

    // Create OpenAI instance with the provided API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1000,
      presence_penalty: presence_penalty || 0,
      frequency_penalty: frequency_penalty || 0,
      ...(response_format && { response_format })
    });

    return res.json(completion);

  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
