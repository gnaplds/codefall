// api/leaderboard.js - Fixed version
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      debug: `Received ${req.method}, expected GET`
    })
  }

  try {
    console.log('Loading leaderboard...')
    console.log('Query parameters:', req.query)

    // Validate environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials')
      return res.status(500).json({ 
        error: 'Server configuration error',
        debug: 'Missing Supabase environment variables'
      })
    }

    const { difficulty } = req.query
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100) // Cap at 100

    console.log('Fetching scores with params:', { difficulty, limit })

    // Build query
    let query = supabase
      .from('scores')
      .select(`
        game_id,
        player_name,
        score,
        time_survived,
        time_in_seconds,
        difficulty,
        words_typed,
        accuracy,
        created_at
      `)
      .order('score', { ascending: false })
      .limit(limit)

    // Filter by difficulty if specified
    if (difficulty && difficulty !== 'all') {
      if (!['easy', 'challenge'].includes(difficulty)) {
        return res.status(400).json({ error: 'Invalid difficulty filter' })
      }
      query = query.eq('difficulty', difficulty)
    }

    console.log('Executing database query...')
    const { data, error } = await query

    if (error) {
      console.error('Database query error:', error)
      return res.status(500).json({ 
        error: 'Failed to load leaderboard',
        debug: error.message,
        hint: error.hint || 'Check if the scores table exists and has proper permissions'
      })
    }

    console.log(`Successfully retrieved ${data?.length || 0} scores`)

    // Format the response data
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
      count: formattedScores.length,
      filter: difficulty || 'all',
      limit: limit
    }

    console.log('Sending leaderboard response with', formattedScores.length, 'scores')
    return res.status(200).json(response)

  } catch (error) {
    console.error('Unexpected error in leaderboard API:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      debug: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}