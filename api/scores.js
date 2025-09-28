// api/scores.js - Simple version using JSONBin
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY || '$2a$10$Eh4t5JEkHp8EYKuLOkRhF.hNbzUhcZLR6Hn7zlmOhP8MzQvFn1vca'
const BIN_ID = process.env.BIN_ID || '6746c8e5e41b4d34e45b5a23'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

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

    if (!playerName || score === undefined || !timeSurvived || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Generate unique game ID
    const gameId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36)

    // Get existing scores
    let existingScores = []
    try {
      const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': JSONBIN_API_KEY
        }
      })
      if (getResponse.ok) {
        const data = await getResponse.json()
        existingScores = Array.isArray(data.record) ? data.record : []
      }
    } catch (error) {
      console.log('Could not fetch existing scores, starting fresh')
    }

    // Add new score
    const newScore = {
      gameId,
      playerName: playerName.trim(),
      score: parseInt(score),
      timeSurvived,
      timeInSeconds: parseInt(timeInSeconds) || 0,
      difficulty,
      wordsTyped: parseInt(wordsTyped) || 0,
      accuracy: parseInt(accuracy) || 100,
      createdAt: new Date().toISOString()
    }

    existingScores.push(newScore)

    // Keep only the latest 1000 scores to avoid hitting storage limits
    if (existingScores.length > 1000) {
      existingScores = existingScores.slice(-1000)
    }

    // Save back to JSONBin
    const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(existingScores)
    })

    if (!updateResponse.ok) {
      throw new Error('Failed to save to storage')
    }

    const baseUrl = req.headers.host?.includes('localhost') 
      ? `http://${req.headers.host}`
      : `https://${req.headers.host}`
    
    const shareUrl = `${baseUrl}?highlight=${gameId}`

    res.status(201).json({
      success: true,
      gameId,
      shareUrl,
      message: 'Score saved successfully'
    })

  } catch (error) {
    console.error('Error saving score:', error)
    res.status(500).json({ error: 'Failed to save score' })
  }
}