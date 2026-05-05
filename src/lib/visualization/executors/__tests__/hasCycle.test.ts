import { describe, it, expect } from 'vitest'
import { executeHasCycle, getHasCycleDefaultInput } from '../hasCycle'

describe('hasCycle executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getHasCycleDefaultInput()
    const snapshots = executeHasCycle(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct linked list data structure in each snapshot', () => {
    const input = { values: [3, 2, 0, 4, 2] }
    const snapshots = executeHasCycle(input)

    snapshots.forEach((snapshot) => {
      expect(snapshot).toHaveProperty('step')
      expect(snapshot).toHaveProperty('description')
      expect(snapshot).toHaveProperty('codeLine')
      expect(snapshot).toHaveProperty('data')
      expect(snapshot.data).toHaveProperty('nodes')
      expect(snapshot.data).toHaveProperty('nodeStates')
      expect(snapshot.data).toHaveProperty('pointers')
      expect(snapshot.data).toHaveProperty('cycleEntryIndex')
    })
  })

  it('should detect cycle in linked list', () => {
    const input = { values: [3, 2, 0, 4, 2] }
    const snapshots = executeHasCycle(input)

    const cycleSnapshot = snapshots.find(s => s.description.includes('有环'))
    expect(cycleSnapshot).toBeDefined()
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeHasCycle({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
  })

  it('should handle empty list', () => {
    const input = { values: [] }
    const snapshots = executeHasCycle(input)

    expect(snapshots.length).toBeGreaterThan(0)
    const noCycleSnapshot = snapshots.find(s => s.description.includes('无环'))
    expect(noCycleSnapshot).toBeDefined()
  })

  it('should handle list without cycle', () => {
    const input = { values: [1, 2, 3, 4] }
    const snapshots = executeHasCycle(input)

    const noCycleSnapshot = snapshots.find(s => s.description.includes('无环'))
    expect(noCycleSnapshot).toBeDefined()
  })

  it('should include step numbers', () => {
    const input = getHasCycleDefaultInput()
    const snapshots = executeHasCycle(input)

    snapshots.forEach((snapshot, index) => {
      expect(snapshot.step).toBe(index)
    })
  })
})
