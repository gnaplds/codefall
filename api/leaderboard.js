// api/leaderboard.js
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { difficulty } = req.query
    const limit = parseInt(req.query.limit) || 50

    let query = supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit)

    // Filter by difficulty if specified
    if (difficulty && difficulty !== 'all') {
      query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to load leaderboard' })
    }

    // Format the response to match what the frontend expects
    const formattedScores = data.map(score => ({
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

    res.status(200).json({
      success: true,
      scores: formattedScores,
      count: formattedScores.length
    })

  } catch (error) {
    console.error('Error loading leaderboard:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}