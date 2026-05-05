import { describe, it, expect } from 'vitest'
import { executeMergeTwoLists, getMergeTwoListsDefaultInput } from '../mergeTwoLists'

describe('mergeTwoLists executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getMergeTwoListsDefaultInput()
    const snapshots = executeMergeTwoLists(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct linked list data structure in each snapshot', () => {
    const input = { list1: [1, 2, 4], list2: [1, 3, 4] }
    const snapshots = executeMergeTwoLists(input)

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

  it('should merge two sorted lists', () => {
    const input = { list1: [1, 2, 4], list2: [1, 3, 4] }
    const snapshots = executeMergeTwoLists(input)

    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('合并完成')
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeMergeTwoLists({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
  })

  it('should handle empty list1', () => {
    const input = { list1: [], list2: [1, 2, 3] }
    const snapshots = executeMergeTwoLists(input)

    expect(snapshots.length).toBeGreaterThan(0)
    const emptySnapshot = snapshots.find(s => s.description.includes('List1 为空'))
    expect(emptySnapshot).toBeDefined()
  })

  it('should handle empty list2', () => {
    const input = { list1: [1, 2, 3], list2: [] }
    const snapshots = executeMergeTwoLists(input)

    expect(snapshots.length).toBeGreaterThan(0)
    const emptySnapshot = snapshots.find(s => s.description.includes('List2 为空'))
    expect(emptySnapshot).toBeDefined()
  })

  it('should handle both empty lists', () => {
    const input = { list1: [], list2: [] }
    const snapshots = executeMergeTwoLists(input)

    expect(snapshots.length).toBeGreaterThan(0)
    const emptySnapshot = snapshots.find(s => s.description.includes('空'))
    expect(emptySnapshot).toBeDefined()
  })

  it('should include step numbers', () => {
    const input = getMergeTwoListsDefaultInput()
    const snapshots = executeMergeTwoLists(input)

    snapshots.forEach((snapshot, index) => {
      expect(snapshot.step).toBe(index)
    })
  })
})
