import { describe, it, expect } from 'vitest'
import { executeMoveZeroes, getMoveZeroesDefaultInput } from '../moveZeroes'

describe('moveZeroes executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getMoveZeroesDefaultInput()
    const snapshots = executeMoveZeroes(input)

    expect(snapshots.length).toBeGreaterThan(0)
    expect(snapshots[0].description).toContain('开始移动零')
  })

  it('should have correct data structure', () => {
    const snapshots = executeMoveZeroes([0, 1, 0, 3, 12])

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

  it('should move zeros to the end', () => {
    const snapshots = executeMoveZeroes([0, 1, 0, 3, 12])
    const lastSnapshot = snapshots[snapshots.length - 1]

    const elements = lastSnapshot.data.elements as number[]
    expect(elements.filter(n => n === 0)).toHaveLength(2)
    // Check zeros are at the end
    const firstZeroIndex = elements.findIndex(n => n === 0)
    if (firstZeroIndex !== -1) {
      expect(elements.slice(firstZeroIndex).every(n => n === 0)).toBe(true)
    }
  })

  it('should handle array with no zeros', () => {
    const snapshots = executeMoveZeroes([1, 2, 3])
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should handle empty array', () => {
    const snapshots = executeMoveZeroes([])
    expect(snapshots.length).toBeGreaterThan(0)
  })
})
