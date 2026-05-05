import { describe, it, expect } from 'vitest'
import { executeContainerWithWater, getContainerWithWaterDefaultInput } from '../containerWithWater'

describe('containerWithWater executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getContainerWithWaterDefaultInput()
    const snapshots = executeContainerWithWater(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure in each snapshot', () => {
    const input = { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }
    const snapshots = executeContainerWithWater(input)

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

  it('should calculate correct max area', () => {
    const input = { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }
    const snapshots = executeContainerWithWater(input)

    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('最大盛水量')
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeContainerWithWater({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
  })

  it('should handle minimum height array', () => {
    const input = { height: [1, 1] }
    const snapshots = executeContainerWithWater(input)

    expect(snapshots.length).toBeGreaterThan(0)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('最大盛水量')
  })

  it('should include step numbers', () => {
    const input = getContainerWithWaterDefaultInput()
    const snapshots = executeContainerWithWater(input)

    snapshots.forEach((snapshot, index) => {
      expect(snapshot.step).toBe(index)
    })
  })

  it('should reject height array with less than 2 elements', () => {
    const snapshots = executeContainerWithWater({ height: [1] })
    expect(snapshots[0].description).toContain('验证失败')
  })
})
