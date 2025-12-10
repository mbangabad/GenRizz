#!/usr/bin/env node
/**
 * Export JSX question arrays to JSON files for validation and downstream use.
 */

import fs from 'fs'
import path from 'path'

const QUESTIONS_DIR = path.join(process.cwd(), 'src/components/constants/questions')
const OUTPUT_DIR = path.join(QUESTIONS_DIR, 'json')

const stripComments = (code) => {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '')
}

const extractArray = (txt) => {
  const start = txt.indexOf('[')
  const end = txt.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return null
  const snippet = stripComments(txt.slice(start, end + 1))
  try {
    const parsed = Function(`"use strict"; return (${snippet});`)()
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

const main = () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.jsx') || f.endsWith('.js'))
  let exported = 0
  for (const file of files) {
    const full = path.join(QUESTIONS_DIR, file)
    const txt = fs.readFileSync(full, 'utf8')
    const arr = extractArray(txt)
    if (!arr) continue
    const outPath = path.join(OUTPUT_DIR, `${path.parse(file).name}.json`)
    fs.writeFileSync(outPath, JSON.stringify(arr, null, 2))
    exported++
  }
  console.log(`Exported ${exported} catalogs to ${OUTPUT_DIR}`)
}

main()
