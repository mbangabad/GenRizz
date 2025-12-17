#!/usr/bin/env node
/**
 * Question catalog validator: checks schema, option counts, difficulty bounds,
 * banned words, and duplicate prompts. Fails with non-zero exit on violations.
 */

import fs from 'fs'
import path from 'path'
import { HARD_BANNED_DEFAULT, SOFT_BANNED_DEFAULT, DEFAULT_WHITELIST } from '../src/config/contentSafety.js'

const QUESTIONS_DIR = path.join(process.cwd(), 'src/components/constants/questions')
const JSON_DIR = path.join(QUESTIONS_DIR, 'json')
const WHITELIST_FILE = path.join(process.cwd(), 'src/config/bannedWhitelist.json')
const SUMMARY_OUT = path.join(process.cwd(), 'tmp', 'content-validation-summary.json')
const MAX_PROMPT_LEN = 500
const DIFFICULTY_MIN = 1
const DIFFICULTY_MAX = 20

/** @type {Record<string, number>} */
const optionCountsByType = {
  mcq: 4,
  scenario: undefined,
  opinion: undefined,
  ordering: undefined,
  connection: undefined,
  'emoji-decode': 4,
}

const errors = []
const warnings = []

const readWhitelist = () => {
  if (!fs.existsSync(WHITELIST_FILE)) return [...DEFAULT_WHITELIST]
  try {
    const parsed = JSON.parse(fs.readFileSync(WHITELIST_FILE, 'utf8'))
    if (Array.isArray(parsed)) return [...DEFAULT_WHITELIST, ...parsed]
    warnings.push('Whitelist file found but is not an array; ignoring.')
    return [...DEFAULT_WHITELIST]
  } catch (e) {
    warnings.push(`Whitelist file unreadable: ${e.message}`)
    return [...DEFAULT_WHITELIST]
  }
}

const stripComments = (code) => {
  // Remove // and /* */ comments for safer eval
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '')
}

const extractJsonArray = (txt) => {
  // Attempt to locate an array literal in the file (best-effort for JSX question exports)
  const start = txt.indexOf('[')
  const end = txt.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return null
  const snippet = stripComments(txt.slice(start, end + 1))
  try {
    const parsed = Function(`"use strict"; return (${snippet});`)()
    return Array.isArray(parsed) ? parsed : null
  } catch (e) {
    return null
  }
}

const readJsonCatalogs = () => {
  const jsonFiles = fs.readdirSync(JSON_DIR).filter(f => f.endsWith('.json'))
  let all = []
  for (const file of jsonFiles) {
    const full = path.join(JSON_DIR, file)
    try {
      const data = JSON.parse(fs.readFileSync(full, 'utf8'))
      if (Array.isArray(data)) {
        all = all.concat(data.map(q => ({ ...q, __file: path.join('json', file) })))
      } else {
        warnings.push(`Skipped non-array JSON catalog: ${file}`)
      }
    } catch (e) {
      errors.push(`Failed to parse JSON catalog ${file}: ${e.message}`)
    }
  }
  return all
}

const readLegacyQuestions = () => {
  const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.jsx') || f.endsWith('.js'))
  let all = []
  for (const file of files) {
    const full = path.join(QUESTIONS_DIR, file)
    const txt = fs.readFileSync(full, 'utf8')
    const extracted = extractJsonArray(txt)
    if (extracted && Array.isArray(extracted)) {
      all = all.concat(extracted.map(q => ({ ...q, __file: file })))
    } else {
      warnings.push(`Skipped validation for non-JSON question file: ${file}`)
    }
  }
  return all
}

const readQuestions = () => {
  const hasJson = fs.existsSync(JSON_DIR) && fs.readdirSync(JSON_DIR).some(f => f.endsWith('.json'))
  if (hasJson) {
    return readJsonCatalogs()
  }
  warnings.push('No JSON catalogs found; falling back to legacy JSX parsing.')
  return readLegacyQuestions()
}

const WHITELIST = new Set(readWhitelist().map(t => t.toLowerCase()))
const HARD_BANNED = new Set(HARD_BANNED_DEFAULT.map(t => t.toLowerCase()))
const SOFT_BANNED = new Set(SOFT_BANNED_DEFAULT.map(t => t.toLowerCase()))

const hasBanned = (prompt, where) => {
  if (!prompt) return false
  const lower = prompt.toLowerCase()
  let hardHit = false
  HARD_BANNED.forEach((b) => {
    if (lower.includes(b) && !WHITELIST.has(b)) {
      errors.push(`${where} contains hard-banned content "${b}"`)
      hardHit = true
    }
  })
  SOFT_BANNED.forEach((b) => {
    if (lower.includes(b) && !WHITELIST.has(b)) {
      warnings.push(`${where} contains sensitive term "${b}"`)
    }
  })
  return hardHit
}

const validateQuestion = (q) => {
  const where = `${q.__file || 'unknown'}:${q.id || 'no-id'}`
  const prompt = q.prompt || q.question
  if (!q.id) warnings.push(`${where} missing id (will need auto-id downstream)`)
  if (!q.game_id) errors.push(`${where} missing game_id`)
  if (!q.category) warnings.push(`${where} missing category (derive later)`)
  if (!q.type) errors.push(`${where} missing type`)
  if (typeof q.difficulty !== 'number' || q.difficulty < DIFFICULTY_MIN || q.difficulty > DIFFICULTY_MAX) {
    errors.push(`${where} invalid difficulty ${q.difficulty}`)
  }
  if (!prompt || prompt.length > MAX_PROMPT_LEN) {
    errors.push(`${where} invalid prompt length`)
  }
  hasBanned(prompt, where)
  const expectedOptions = optionCountsByType[q.type]
  if (expectedOptions !== undefined) {
    if (!Array.isArray(q.options) || q.options.length !== expectedOptions) {
      errors.push(`${where} expected ${expectedOptions} options for type ${q.type}`)
    }
  }
  if (q.type === 'mcq' && typeof q.correct_index !== 'number') {
    errors.push(`${where} missing correct_index for mcq`)
  }
}

const normalizeOptions = (opts = []) =>
  Array.isArray(opts) ? opts.map((o) => String(o).trim().toLowerCase()).join('|') : ''

const findDuplicates = (questions) => {
  const seen = new Map()
  for (const q of questions) {
    const prompt = (q.prompt || q.question || '').trim().toLowerCase()
    if (!prompt) continue
    const key = [prompt, q.type || 'unknown', normalizeOptions(q.options || [])].join('::')
    const loc = `${q.__file || q.id || 'unknown'} (game: ${q.game_id || 'none'})`
    if (seen.has(key)) {
      errors.push(`Duplicate question detected between ${seen.get(key)} and ${loc}`)
    } else {
      seen.set(key, loc)
    }
  }
}

const requireFamilySafe = process.env.REQUIRE_FAMILY_SAFE !== 'false'

const main = () => {
  const questions = readQuestions()
  if (questions.length === 0) {
    warnings.push('No JSON question catalogs found; add .json catalogs for full validation.')
  }
  if (WHITELIST.size > 0) {
    console.log(`Whitelist applied (${WHITELIST.size} terms):`, Array.from(WHITELIST).join(', '))
  }
  questions.forEach(validateQuestion)
  findDuplicates(questions)

  if (requireFamilySafe) {
    questions.forEach((q) => {
      if (typeof q.family_safe !== 'boolean') {
        warnings.push(`${q.__file || q.id} missing family_safe (defaulting to true downstream)`)
      }
    })
  }

  const summary = {
    checked: questions.length,
    warnings: warnings.length,
    errors: errors.length,
    timestamp: new Date().toISOString(),
  }
  try {
    fs.mkdirSync(path.dirname(SUMMARY_OUT), { recursive: true })
    fs.writeFileSync(SUMMARY_OUT, JSON.stringify(summary, null, 2))
  } catch (e) {
    console.warn('WARN: Could not write summary file:', e.message)
  }

  warnings.forEach(w => console.warn('WARN:', w))
  if (errors.length) {
    console.error('ERRORS:', errors.length)
    errors.forEach(e => console.error('ERR:', e))
    process.exit(1)
  }
  console.log(`Validation OK. Checked ${questions.length} questions.`)
}

main()
