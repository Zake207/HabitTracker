import { describe, expect, it } from 'vitest'
import * as service from '../src/logic/HabitTrackerService'

describe('HabitTrackerService', () => {
  it('loads its exported API', () => {
    expect(service).toBeDefined()
    expect(Object.keys(service).length).toBeGreaterThan(0)
  })
})
