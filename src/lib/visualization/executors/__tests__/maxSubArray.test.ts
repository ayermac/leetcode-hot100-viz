import { describe, it, expect } from 'vitest'
import { executeMaxSubArray, getMaxSubArrayDefaultInput } from '../maxSubArray'

describe('maxSubArray executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getMaxSubArrayDefaultInput()
    const snapshots = executeMaxSubArray(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure in each snapshot', () => {
    const input = { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }
    const snapshots = executeMaxSubArray(input)

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

  it('should find correct max subarray sum', () => {
    const input = { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }
    const snapshots = executeMaxSubArray(input)

    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('最大子数组和')
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeMaxSubArray({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
  })

  it('should handle all negative numbers', () => {
    const input = { nums: [-5, -3, -1, -2] }
    const snapshots = executeMaxSubArray(input)

    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('最大子数组和')
  })

  it('should handle single element array', () => {
    const input = { nums: [5] }
    const snapshots = executeMaxSubArray(input)

    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should include step numbers', () => {
    const input = getMaxSubArrayDefaultInput()
    const snapshots = executeMaxSubArray(input)

    snapshots.forEach((snapshot, index) => {
      expect(snapshot.step).toBe(index)
    })
  })
})
