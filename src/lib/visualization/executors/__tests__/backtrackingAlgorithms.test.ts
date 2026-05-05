import { describe, it, expect } from 'vitest'
import { 
  executePermute, 
  getPermuteDefaultInput,
  executeSubsets,
  getSubsetsDefaultInput,
  executeLetterCombinations,
  getLetterCombinationsDefaultInput
} from '../backtrackingAlgorithms'

describe('Permute executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getPermuteDefaultInput()
    const snapshots = executePermute(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getPermuteDefaultInput()
    const snapshots = executePermute(input)
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

  it('should return error snapshot for invalid input', () => {
    const snapshots = executePermute({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.elements).toEqual([])
  })

  it('should generate correct number of permutations', () => {
    const input = { nums: [1, 2, 3] }
    const snapshots = executePermute(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
    expect(lastSnapshot.description).toContain('6') // 3! = 6
  })

  it('should handle single element', () => {
    const input = { nums: [1] }
    const snapshots = executePermute(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('1')
  })

  it('should handle two elements', () => {
    const input = { nums: [1, 2] }
    const snapshots = executePermute(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('2') // 2! = 2
  })

  it('should show backtrack operations', () => {
    const input = { nums: [1, 2] }
    const snapshots = executePermute(input)
    const backtrackSnapshots = snapshots.filter(s => s.description.includes('回溯'))
    expect(backtrackSnapshots.length).toBeGreaterThan(0)
  })

  it('should show selection operations', () => {
    const input = { nums: [1, 2] }
    const snapshots = executePermute(input)
    const selectSnapshots = snapshots.filter(s => s.description.includes('选择'))
    expect(selectSnapshots.length).toBeGreaterThan(0)
  })
})

describe('Subsets executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getSubsetsDefaultInput()
    const snapshots = executeSubsets(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getSubsetsDefaultInput()
    const snapshots = executeSubsets(input)
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

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeSubsets({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.elements).toEqual([])
  })

  it('should generate correct number of subsets', () => {
    const input = { nums: [1, 2, 3] }
    const snapshots = executeSubsets(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
    expect(lastSnapshot.description).toContain('8') // 2^3 = 8
  })

  it('should handle single element', () => {
    const input = { nums: [1] }
    const snapshots = executeSubsets(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('2') // 2^1 = 2
  })

  it('should show subset collection', () => {
    const input = { nums: [1, 2] }
    const snapshots = executeSubsets(input)
    const collectSnapshots = snapshots.filter(s => s.description.includes('收集子集'))
    expect(collectSnapshots.length).toBeGreaterThan(0)
  })

  it('should show backtrack operations', () => {
    const input = { nums: [1, 2] }
    const snapshots = executeSubsets(input)
    const backtrackSnapshots = snapshots.filter(s => s.description.includes('回溯'))
    expect(backtrackSnapshots.length).toBeGreaterThan(0)
  })

  it('should reject empty array', () => {
    const input = { nums: [] }
    const snapshots = executeSubsets(input)
    expect(snapshots[0].description).toContain('验证失败')
  })
})

describe('Letter Combinations executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getLetterCombinationsDefaultInput()
    const snapshots = executeLetterCombinations(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getLetterCombinationsDefaultInput()
    const snapshots = executeLetterCombinations(input)
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

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeLetterCombinations({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.elements).toEqual([])
  })

  it('should generate correct number of combinations', () => {
    const input = { digits: '23' }
    const snapshots = executeLetterCombinations(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
    expect(lastSnapshot.description).toContain('9') // 3 * 3 = 9
  })

  it('should handle empty digits', () => {
    const input = { digits: '' }
    const snapshots = executeLetterCombinations(input)
    expect(snapshots[0].description).toContain('空')
  })

  it('should handle single digit', () => {
    const input = { digits: '2' }
    const snapshots = executeLetterCombinations(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('3') // 'abc' has 3 letters
  })

  it('should handle digit 7 which has 4 letters', () => {
    const input = { digits: '7' }
    const snapshots = executeLetterCombinations(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('4') // 'pqrs' has 4 letters
  })

  it('should handle digit 9 which has 4 letters', () => {
    const input = { digits: '9' }
    const snapshots = executeLetterCombinations(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('4') // 'wxyz' has 4 letters
  })

  it('should show letter selection', () => {
    const input = { digits: '23' }
    const snapshots = executeLetterCombinations(input)
    const selectSnapshots = snapshots.filter(s => s.description.includes('选择字母'))
    expect(selectSnapshots.length).toBeGreaterThan(0)
  })

  it('should show found combinations', () => {
    const input = { digits: '23' }
    const snapshots = executeLetterCombinations(input)
    const foundSnapshots = snapshots.filter(s => s.description.includes('找到组合'))
    expect(foundSnapshots.length).toBeGreaterThan(0)
  })
})
