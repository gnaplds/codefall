// api/test.js - Test endpoint to verify API is working
export default async function handler(req, res) {
  console.log('Test endpoint accessed')
  
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const testData = {
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      host: req.headers.host
    },
    requestInfo: {
      method: req.method,
      url: req.url,
      headers: Object.keys(req.headers)
    }
  }

  // Test Supabase connection if credentials exist
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
      
      // Try a simple query to test connection
      const { data, error } = await supabase
        .from('scores')
        .select('count')
        .limit(1)

      testData.database = {
        connection: 'successful',
        error: error?.message || null,
        hasData: !!data
      }
    } catch (error) {
      testData.database = {
        connection: 'failed',
        error: error.message
      }
    }
  } else {
    testData.database = {
      connection: 'not configured',
      error: 'Missing environment variables'
    }
  }

  res.status(200).json(testData)
}