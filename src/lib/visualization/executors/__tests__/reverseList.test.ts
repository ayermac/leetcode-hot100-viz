import { describe, it, expect } from 'vitest'
import { executeReverseList, getReverseListDefaultInput } from '../reverseList'

describe('reverseList executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getReverseListDefaultInput()
    const snapshots = executeReverseList(input)

    expect(snapshots.length).toBeGreaterThan(0)
    expect(snapshots[0].description).toContain('开始反转链表')
  })

  it('should have correct data structure', () => {
    const snapshots = executeReverseList({ values: [1, 2, 3] })

    snapshots.forEach((snapshot) => {
      expect(snapshot).toHaveProperty('step')
      expect(snapshot).toHaveProperty('description')
      expect(snapshot).toHaveProperty('codeLine')
      expect(snapshot).toHaveProperty('data')
      expect(snapshot.data).toHaveProperty('nodes')
      expect(snapshot.data).toHaveProperty('nodeStates')
      expect(snapshot.data).toHaveProperty('pointers')
    })
  })

  it('should reverse the list', () => {
    const snapshots = executeReverseList({ values: [1, 2, 3] })
    const lastSnapshot = snapshots[snapshots.length - 1]

    const nodes = lastSnapshot.data.nodes
    // After reversal: 3 -> 2 -> 1
    expect(nodes[0].value).toBe(1)
    expect(nodes[0].nextIndex).toBe(null)
    expect(nodes[2].nextIndex).toBe(1)
  })

  it('should handle single element list', () => {
    const snapshots = executeReverseList({ values: [1] })
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should handle empty list', () => {
    const snapshots = executeReverseList({ values: [] })
    expect(snapshots.length).toBeGreaterThan(0)
    expect(snapshots[snapshots.length - 1].description).toContain('空')
  })
})
