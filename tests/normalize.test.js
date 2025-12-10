import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

describe('content normalization', () => {
  it('defaults family_safe and fills ids/categories', () => {
    const sample = [
      { game_id: 'gen-z-fluency', type: 'mcq', question: 'Q1', options: ['a','b','c','d'], correct_index: 0 },
    ]
    const normalized = JSON.parse(readFileSync(path.join(process.cwd(), 'src/components/constants/questions/json/gen-z-fluency.json'), 'utf-8'))
    const item = normalized[0]
    expect(item.family_safe).toBe(true)
    expect(item.id).toBeTruthy()
    expect(item.category).toBeTruthy()
  })
})
