import { describe, it, expect } from 'vitest'
import { executeThreeSum, getThreeSumDefaultInput } from '../threeSum'

describe('threeSum executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getThreeSumDefaultInput()
    const snapshots = executeThreeSum(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure in each snapshot', () => {
    const input = { nums: [-1, 0, 1, 2, -1, -4] }
    const snapshots = executeThreeSum(input)

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

  it('should find correct triplets for valid input', () => {
    const input = { nums: [-1, 0, 1, 2, -1, -4] }
    const snapshots = executeThreeSum(input)

    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('找到')
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeThreeSum({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
  })

  it('should handle input with no valid triplets', () => {
    const input = { nums: [1, 2, 3] }
    const snapshots = executeThreeSum(input)

    expect(snapshots.length).toBeGreaterThan(0)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('找到')
  })

  it('should include step numbers', () => {
    const input = getThreeSumDefaultInput()
    const snapshots = executeThreeSum(input)

    snapshots.forEach((snapshot, index) => {
      expect(snapshot.step).toBe(index)
    })
  })

  it('should reject array with less than 3 elements', () => {
    const snapshots = executeThreeSum({ nums: [1, 2] })
    expect(snapshots[0].description).toContain('验证失败')
  })
})
