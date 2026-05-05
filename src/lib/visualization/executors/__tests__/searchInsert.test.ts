import { describe, it, expect } from 'vitest'
import { executeSearchInsert, getSearchInsertDefaultInput } from '../searchInsert'

describe('searchInsert executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getSearchInsertDefaultInput()
    const snapshots = executeSearchInsert(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure in each snapshot', () => {
    const input = { nums: [1, 3, 5, 6], target: 5 }
    const snapshots = executeSearchInsert(input)

    snapshots.forEach((snapshot) => {
      expect(snapshot).toHaveProperty('step')
      expect(snapshot).toHaveProperty('description')
      expect(snapshot).toHaveProperty('codeLine')
      expect(snapshot).toHaveProperty('data')
      expect(snapshot.data).toHaveProperty('elements')
      expect(snapshot.data).toHaveProperty('elementStates')
      expect(snapshot.data).toHaveProperty('pointers')
    })
  })

  it('should find existing target', () => {
    const input = { nums: [1, 3, 5, 6], target: 5 }
    const snapshots = executeSearchInsert(input)

    const foundSnapshot = snapshots.find(s => s.description.includes('已存在'))
    expect(foundSnapshot).toBeDefined()
  })

  it('should find insert position for non-existing target', () => {
    const input = { nums: [1, 3, 5, 6], target: 2 }
    const snapshots = executeSearchInsert(input)

    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('插入')
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeSearchInsert({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
  })

  it('should handle target smaller than all elements', () => {
    const input = { nums: [1, 3, 5, 6], target: 0 }
    const snapshots = executeSearchInsert(input)

    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('插入')
  })

  it('should handle target larger than all elements', () => {
    const input = { nums: [1, 3, 5, 6], target: 100 }
    const snapshots = executeSearchInsert(input)

    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('插入')
  })

  it('should include step numbers', () => {
    const input = getSearchInsertDefaultInput()
    const snapshots = executeSearchInsert(input)

    snapshots.forEach((snapshot, index) => {
      expect(snapshot.step).toBe(index)
    })
  })
})
