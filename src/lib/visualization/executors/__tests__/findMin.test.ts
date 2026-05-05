import { describe, it, expect } from 'vitest'
import { executeFindMin, getFindMinDefaultInput } from '../findMin'

describe('findMin executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getFindMinDefaultInput()
    const snapshots = executeFindMin(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure in each snapshot', () => {
    const input = { nums: [4, 5, 6, 7, 0, 1, 2] }
    const snapshots = executeFindMin(input)

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

  it('should find correct minimum in rotated array', () => {
    const input = { nums: [4, 5, 6, 7, 0, 1, 2] }
    const snapshots = executeFindMin(input)

    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('最小值')
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeFindMin({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
  })

  it('should handle non-rotated array', () => {
    const input = { nums: [1, 2, 3, 4, 5] }
    const snapshots = executeFindMin(input)

    expect(snapshots.length).toBeGreaterThan(0)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('最小值')
  })

  it('should handle single element array', () => {
    const input = { nums: [1] }
    const snapshots = executeFindMin(input)

    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should include step numbers', () => {
    const input = getFindMinDefaultInput()
    const snapshots = executeFindMin(input)

    snapshots.forEach((snapshot, index) => {
      expect(snapshot.step).toBe(index)
    })
  })
})
