import { describe, it, expect } from 'vitest'
import { executeRemoveNthFromEnd, getRemoveNthFromEndDefaultInput } from '../removeNthFromEnd'

describe('removeNthFromEnd executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getRemoveNthFromEndDefaultInput()
    const snapshots = executeRemoveNthFromEnd(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct linked list data structure in each snapshot', () => {
    const input = { values: [1, 2, 3, 4, 5], n: 2 }
    const snapshots = executeRemoveNthFromEnd(input)

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

  it('should remove nth node from end', () => {
    const input = { values: [1, 2, 3, 4, 5], n: 2 }
    const snapshots = executeRemoveNthFromEnd(input)

    const deleteSnapshot = snapshots.find(s => s.description.includes('删除'))
    expect(deleteSnapshot).toBeDefined()
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeRemoveNthFromEnd({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
  })

  it('should handle empty list', () => {
    const input = { values: [], n: 1 }
    const snapshots = executeRemoveNthFromEnd(input)

    expect(snapshots.length).toBeGreaterThan(0)
    const emptySnapshot = snapshots.find(s => s.description.includes('空'))
    expect(emptySnapshot).toBeDefined()
  })

  it('should handle removing head node', () => {
    const input = { values: [1, 2, 3], n: 3 }
    const snapshots = executeRemoveNthFromEnd(input)

    const headDeleteSnapshot = snapshots.find(s => s.description.includes('头节点'))
    expect(headDeleteSnapshot).toBeDefined()
  })

  it('should include step numbers', () => {
    const input = getRemoveNthFromEndDefaultInput()
    const snapshots = executeRemoveNthFromEnd(input)

    snapshots.forEach((snapshot, index) => {
      expect(snapshot.step).toBe(index)
    })
  })
})
