import { describe, it, expect } from 'vitest'
import { executeTwoSum, getTwoSumDefaultInput } from '../twoSum'

describe('twoSum executor', () => {
  it('should find correct indices for default input', () => {
    const input = getTwoSumDefaultInput()
    const snapshots = executeTwoSum(input)

    expect(snapshots.length).toBeGreaterThan(0)

    // Last snapshot should have result
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('找到答案')
  })

  it('should generate at least initial and final snapshots', () => {
    const input = { nums: [2, 7, 11, 15], target: 9 }
    const snapshots = executeTwoSum(input)

    expect(snapshots.length).toBeGreaterThanOrEqual(2)

    // First snapshot should be initial state
    expect(snapshots[0].description).toContain('开始在数组')

    // Last snapshot should have result
    expect(snapshots[snapshots.length - 1].description).toContain('找到答案')
  })

  it('should have correct data structure in each snapshot', () => {
    const input = { nums: [2, 7, 11, 15], target: 9 }
    const snapshots = executeTwoSum(input)

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

  it('should handle no solution case', () => {
    const input = { nums: [1, 2, 3, 4], target: 100 }
    const snapshots = executeTwoSum(input)

    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('未找到')
  })

  it('should step through array correctly', () => {
    const input = { nums: [2, 7, 11, 15], target: 9 }
    const snapshots = executeTwoSum(input)

    // Should have initial snapshot + at least one step checking element
    expect(snapshots.length).toBeGreaterThanOrEqual(3)

    // Check that i=0 is checked (nums[0] = 2)
    const checkSnapshot = snapshots.find(s =>
      s.description.includes('nums[0]') && s.description.includes('2')
    )
    expect(checkSnapshot).toBeDefined()
  })

  it('should include step numbers', () => {
    const input = { nums: [2, 7, 11, 15], target: 9 }
    const snapshots = executeTwoSum(input)

    snapshots.forEach((snapshot, index) => {
      expect(snapshot.step).toBe(index)
    })
  })
})
