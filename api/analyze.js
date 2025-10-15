export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;
    
    if (!message || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('🔍 API Route: Starting analysis for message:', message.substring(0, 100));
    
    // Import the analysis function dynamically
    const { generateAlignedResults } = await import('../src/lib/analysis/advancedAnalysis.js');
    
    const result = await generateAlignedResults(message, context);
    
    console.log('✅ API Route: Analysis complete');
    
    res.status(200).json(result);
  } catch (error) {
    console.error('❌ API Route Error:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error.message 
    });
  }
}