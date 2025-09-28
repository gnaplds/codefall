// api/scores.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      playerName,
      score,
      timeSurvived,
      timeInSeconds,
      difficulty,
      wordsTyped,
      accuracy
    } = req.body

    // Validate input
    if (!playerName || !score || !timeSurvived || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (playerName.length > 50) {
      return res.status(400).json({ error: 'Player name too long' })
    }

    if (score < 0 || timeInSeconds < 0) {
      return res.status(400).json({ error: 'Invalid score or time' })
    }

    // Generate unique game ID
    const gameId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36)

    // Insert score into database
    const { data, error } = await supabase
      .from('scores')
      .insert([
        {
          game_id: gameId,
          player_name: playerName.trim(),
          score: parseInt(score),
          time_survived: timeSurvived,
          time_in_seconds: parseInt(timeInSeconds) || 0,
          difficulty: difficulty,
          words_typed: parseInt(wordsTyped) || 0,
          accuracy: parseInt(accuracy) || 100,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to save score' })
    }

    // Create share URL
    const baseUrl = req.headers.host?.includes('localhost') 
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`
    
    const shareUrl = `${baseUrl}?highlight=${gameId}`

    res.status(201).json({
      success: true,
      gameId: gameId,
      shareUrl: shareUrl,
      message: 'Score saved successfully'
    })

  } catch (error) {
    console.error('Error saving score:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}