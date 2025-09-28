// api/scores.js - Fixed version
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST requests for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      debug: `Received ${req.method}, expected POST`
    })
  }

  try {
    console.log('Processing score save request')
    console.log('Request body:', req.body)

    // Validate environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials')
      return res.status(500).json({ 
        error: 'Server configuration error',
        debug: 'Missing Supabase environment variables'
      })
    }

    const {
      playerName,
      score,
      timeSurvived,
      timeInSeconds,
      difficulty,
      wordsTyped,
      accuracy
    } = req.body

    // Validate required fields
    if (!playerName || score === undefined || score === null || !timeSurvived || !difficulty) {
      console.log('Validation failed - missing fields:', { 
        hasPlayerName: !!playerName, 
        hasScore: score !== undefined && score !== null, 
        hasTimeSurvived: !!timeSurvived, 
        hasDifficulty: !!difficulty 
      })
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['playerName', 'score', 'timeSurvived', 'difficulty']
      })
    }

    // Validate field lengths and values
    if (playerName.length > 50) {
      return res.status(400).json({ error: 'Player name too long (max 50 characters)' })
    }

    if (score < 0 || (timeInSeconds && timeInSeconds < 0)) {
      return res.status(400).json({ error: 'Score and time must be non-negative' })
    }

    if (!['easy', 'challenge'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' })
    }

    // Generate unique game ID
    const gameId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36)

    const scoreData = {
      game_id: gameId,
      player_name: playerName.trim(),
      score: parseInt(score, 10),
      time_survived: timeSurvived,
      time_in_seconds: parseInt(timeInSeconds, 10) || 0,
      difficulty: difficulty,
      words_typed: parseInt(wordsTyped, 10) || 0,
      accuracy: parseInt(accuracy, 10) || 100,
      created_at: new Date().toISOString()
    }

    console.log('Inserting score data:', scoreData)

    // Insert into database
    const { data, error } = await supabase
      .from('scores')
      .insert([scoreData])
      .select()

    if (error) {
      console.error('Database insertion error:', error)
      return res.status(500).json({ 
        error: 'Failed to save score to database',
        debug: error.message,
        hint: error.hint || 'Check if the scores table exists and has proper permissions'
      })
    }

    console.log('Score saved successfully:', data)

    // Create share URL
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers.host
    const shareUrl = `${protocol}://${host}?highlight=${gameId}`

    const response = {
      success: true,
      gameId: gameId,
      shareUrl: shareUrl,
      message: 'Score saved successfully',
      data: data[0]
    }

    return res.status(201).json(response)

  } catch (error) {
    console.error('Unexpected error in scores API:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      debug: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}