#!/usr/bin/env node
/**
 * Normalize exported JSON question catalogs:
 * - ensure id
 * - ensure category (via lookup)
 * - ensure difficulty (default 1 if missing)
 */

import fs from 'fs'
import path from 'path'

const JSON_DIR = path.join(process.cwd(), 'src/components/constants/questions/json')

// Map game_id -> category
const CATEGORY_MAP = {
  // Generational
  'gen-z-fluency': 'generational',
  'boomer-era': 'generational',
  'millennial-nostalgia': 'generational',
  'gen-x-wisdom': 'generational',
  'gen-alpha': 'generational',
  'analog-life': 'generational',
  'nineties-music': 'generational',
  'y2k-culture': 'generational',
  'tiktok-natives': 'generational',
  'revenge-of-boomers': 'generational',
  'generation-gap': 'generational',
  'emoji-detective': 'generational',
  // Daily/connection/timeline
  'link-up': 'daily',
  'timeline': 'daily',
  // Social
  'social-iq': 'social',
  'family-bridge': 'social',
  'social-awareness': 'social',
  'red-flag-detector': 'social',
  'communication-styles': 'social',
  'text-interpretation': 'social',
  'dating-decoder': 'social',
  'vibe-check': 'social',
  'swipe-questions': 'social',
  'social-intelligence': 'social',
  // Personality
  'mental-age': 'personality',
  'generation-quiz': 'personality',
  // Humor
  'boomer-humor': 'humor',
  'vintage-comedy': 'humor',
  'dad-jokes': 'humor',
}

const normalize = (arr, filename) => {
  return arr.map((q, idx) => {
    const id = q.id || `${q.game_id || 'unknown'}-${idx + 1}`
    const category = q.category || CATEGORY_MAP[q.game_id] || 'generational'
    const difficulty = typeof q.difficulty === 'number' ? q.difficulty : 1
    const family_safe = typeof q.family_safe === 'boolean' ? q.family_safe : true
    return { ...q, id, category, difficulty, family_safe }
  })
}

const main = () => {
  if (!fs.existsSync(JSON_DIR)) {
    console.error('JSON directory not found:', JSON_DIR)
    process.exit(1)
  }
  const files = fs.readdirSync(JSON_DIR).filter(f => f.endsWith('.json'))
  let updated = 0
  for (const file of files) {
    const full = path.join(JSON_DIR, file)
    const data = JSON.parse(fs.readFileSync(full, 'utf8'))
    if (!Array.isArray(data)) continue
    const normalized = normalize(data, file)
    fs.writeFileSync(full, JSON.stringify(normalized, null, 2))
    updated++
  }
  console.log(`Normalized ${updated} catalogs in ${JSON_DIR}`)
}

main()
