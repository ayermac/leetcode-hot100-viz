import { describe, it, expect } from 'vitest'
import { 
  executeNumIslands, 
  getNumIslandsDefaultInput,
  executeOrangesRotting,
  getOrangesRottingDefaultInput
} from '../graphAlgorithms'

describe('Num Islands executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getNumIslandsDefaultInput()
    const snapshots = executeNumIslands(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getNumIslandsDefaultInput()
    const snapshots = executeNumIslands(input)
    snapshots.forEach((snapshot) => {
      expect(snapshot).toHaveProperty('step')
      expect(snapshot).toHaveProperty('description')
      expect(snapshot).toHaveProperty('codeLine')
      expect(snapshot).toHaveProperty('data')
      expect(snapshot.data).toHaveProperty('grid')
      expect(snapshot.data).toHaveProperty('cellStates')
      expect(snapshot.data).toHaveProperty('highlightedCells')
      expect(snapshot.data).toHaveProperty('currentCell')
    })
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeNumIslands({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.grid).toEqual([])
  })

  it('should count islands correctly', () => {
    const input = {
      grid: [
        ['1', '1', '0', '0', '0'],
        ['1', '1', '0', '0', '0'],
        ['0', '0', '1', '0', '0'],
        ['0', '0', '0', '1', '1'],
      ]
    }
    const snapshots = executeNumIslands(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
    expect(lastSnapshot.description).toContain('3')
  })

  it('should handle grid with no islands', () => {
    const input = {
      grid: [
        ['0', '0', '0'],
        ['0', '0', '0'],
      ]
    }
    const snapshots = executeNumIslands(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('0')
  })

  it('should handle single cell island', () => {
    const input = { grid: [['1']] }
    const snapshots = executeNumIslands(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('1')
  })

  it('should handle single cell water', () => {
    const input = { grid: [['0']] }
    const snapshots = executeNumIslands(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('0')
  })

  it('should mark visited cells as sorted', () => {
    const input = {
      grid: [
        ['1', '1'],
        ['0', '0'],
      ]
    }
    const snapshots = executeNumIslands(input)
    const sortedSnapshots = snapshots.filter(s => 
      Array.from(s.data.cellStates.values()).some(state => state === 'sorted')
    )
    expect(sortedSnapshots.length).toBeGreaterThan(0)
  })

  it('should reject empty grid', () => {
    const input = { grid: [] }
    const snapshots = executeNumIslands(input)
    expect(snapshots[0].description).toContain('验证失败')
  })
})

describe('Oranges Rotting executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getOrangesRottingDefaultInput()
    const snapshots = executeOrangesRotting(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getOrangesRottingDefaultInput()
    const snapshots = executeOrangesRotting(input)
    snapshots.forEach((snapshot) => {
      expect(snapshot).toHaveProperty('step')
      expect(snapshot).toHaveProperty('description')
      expect(snapshot).toHaveProperty('codeLine')
      expect(snapshot).toHaveProperty('data')
      expect(snapshot.data).toHaveProperty('grid')
      expect(snapshot.data).toHaveProperty('cellStates')
      expect(snapshot.data).toHaveProperty('highlightedCells')
      expect(snapshot.data).toHaveProperty('currentCell')
    })
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeOrangesRotting({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.grid).toEqual([])
  })

  it('should calculate correct minutes', () => {
    const input = {
      grid: [
        ['2', '1', '1'],
        ['1', '1', '0'],
        ['0', '1', '1'],
      ]
    }
    const snapshots = executeOrangesRotting(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
    expect(lastSnapshot.description).toContain('4')
  })

  it('should handle grid with no fresh oranges', () => {
    const input = {
      grid: [
        ['2', '0'],
        ['0', '2'],
      ]
    }
    const snapshots = executeOrangesRotting(input)
    expect(snapshots.length).toBeGreaterThan(0)
    const noFreshSnapshot = snapshots.find(s => s.description.includes('没有新鲜橙子'))
    expect(noFreshSnapshot).toBeDefined()
  })

  it('should handle impossible case', () => {
    const input = {
      grid: [
        ['2', '1', '1'],
        ['0', '1', '1'],
        ['1', '0', '1'],
      ]
    }
    const snapshots = executeOrangesRotting(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('无法腐烂')
  })

  it('should handle single cell with rotten orange', () => {
    const input = { grid: [['2']] }
    const snapshots = executeOrangesRotting(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should handle single cell with fresh orange', () => {
    const input = { grid: [['1']] }
    const snapshots = executeOrangesRotting(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('无法腐烂')
  })

  it('should show rotting process', () => {
    const input = {
      grid: [
        ['2', '1'],
        ['1', '1'],
      ]
    }
    const snapshots = executeOrangesRotting(input)
    const rottingSnapshots = snapshots.filter(s => s.description.includes('腐烂'))
    expect(rottingSnapshots.length).toBeGreaterThan(0)
  })

  it('should reject empty grid', () => {
    const input = { grid: [] }
    const snapshots = executeOrangesRotting(input)
    expect(snapshots[0].description).toContain('验证失败')
  })
})
