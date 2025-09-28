// api/leaderboard.js - Debug Version
export default async function handler(req, res) {
  console.log('Leaderboard API endpoint hit:', req.method, req.url)
  console.log('Query params:', req.query)
  console.log('Environment check:', {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY
  })

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled')
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check if environment variables are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('Missing environment variables')
      return res.status(500).json({ 
        error: 'Server configuration error',
        debug: 'Missing Supabase credentials'
      })
    }

    // Try to import Supabase
    let supabase
    try {
      const { createClient } = await import('@supabase/supabase-js')
      supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
      console.log('Supabase client created successfully')
    } catch (importError) {
      console.error('Failed to import Supabase:', importError)
      return res.status(500).json({ 
        error: 'Server dependency error',
        debug: 'Supabase import failed'
      })
    }

    const { difficulty } = req.query
    const limit = parseInt(req.query.limit) || 50

    console.log('Query parameters:', { difficulty, limit })

    let query = supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit)

    // Filter by difficulty if specified
    if (difficulty && difficulty !== 'all') {
      query = query.eq('difficulty', difficulty)
      console.log('Filtering by difficulty:', difficulty)
    }

    console.log('Executing database query...')
    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ 
        error: 'Failed to load leaderboard',
        debug: error.message 
      })
    }

    console.log(`Retrieved ${data?.length || 0} scores from database`)

    // Format the response to match what the frontend expects
    const formattedScores = (data || []).map(score => ({
      gameId: score.game_id,
      playerName: score.player_name,
      score: score.score,
      timeSurvived: score.time_survived,
      timeInSeconds: score.time_in_seconds,
      difficulty: score.difficulty,
      wordsTyped: score.words_typed,
      accuracy: score.accuracy,
      createdAt: score.created_at
    }))

    const response = {
      success: true,
      scores: formattedScores,
      count: formattedScores.length
    }

    console.log('Sending response with', formattedScores.length, 'scores')
    res.status(200).json(response)

  } catch (error) {
    console.error('Unexpected error in leaderboard:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      debug: error.message
    })
  }
}