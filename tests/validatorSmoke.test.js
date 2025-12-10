import { describe, it, expect, vi } from 'vitest'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

describe('validator smoke', () => {
  it('runs validate-questions script without error', () => {
    const script = path.join(process.cwd(), 'scripts', 'validate-questions.js')
    const result = spawnSync('node', [script], { encoding: 'utf-8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Validation OK')
  })
})
