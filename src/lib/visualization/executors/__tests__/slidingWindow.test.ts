import { describe, it, expect } from 'vitest'
import { 
  executeLengthOfLongestSubstring, 
  getLengthOfLongestSubstringDefaultInput,
  executeMinWindow,
  getMinWindowDefaultInput
} from '../slidingWindow'

describe('Length of Longest Substring executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getLengthOfLongestSubstringDefaultInput()
    const snapshots = executeLengthOfLongestSubstring(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getLengthOfLongestSubstringDefaultInput()
    const snapshots = executeLengthOfLongestSubstring(input)
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
    const snapshots = executeLengthOfLongestSubstring({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.elements).toEqual([])
  })

  it('should find correct longest substring length', () => {
    const input = { s: 'abcabcbb' }
    const snapshots = executeLengthOfLongestSubstring(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
    expect(lastSnapshot.description).toContain('3')
  })

  it('should handle string with all same characters', () => {
    const input = { s: 'aaaa' }
    const snapshots = executeLengthOfLongestSubstring(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('1')
  })

  it('should handle single character string', () => {
    const input = { s: 'a' }
    const snapshots = executeLengthOfLongestSubstring(input)
    expect(snapshots.length).toBeGreaterThan(0)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('1')
  })

  it('should have left and right pointers', () => {
    const input = { s: 'abc' }
    const snapshots = executeLengthOfLongestSubstring(input)
    const pointerSnapshots = snapshots.filter(s => s.data.pointers.length > 0)
    expect(pointerSnapshots.length).toBeGreaterThan(0)
    pointerSnapshots.forEach(s => {
      const pointerNames = s.data.pointers.map(p => p.name)
      expect(pointerNames).toContain('left')
      expect(pointerNames).toContain('right')
    })
  })
})

describe('Min Window executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getMinWindowDefaultInput()
    const snapshots = executeMinWindow(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getMinWindowDefaultInput()
    const snapshots = executeMinWindow(input)
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
    const snapshots = executeMinWindow({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.elements).toEqual([])
  })

  it('should find correct minimum window', () => {
    const input = { s: 'ADOBECODEBANC', t: 'ABC' }
    const snapshots = executeMinWindow(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
    expect(lastSnapshot.description).toContain('BANC')
    expect(lastSnapshot.description).toContain('4')
  })

  it('should handle s shorter than t', () => {
    const input = { s: 'AB', t: 'ABC' }
    const snapshots = executeMinWindow(input)
    expect(snapshots.length).toBeGreaterThan(0)
    expect(snapshots[0].description).toContain('无法找到')
  })

  it('should handle no valid window', () => {
    const input = { s: 'ABC', t: 'D' }
    const snapshots = executeMinWindow(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('未找到')
  })

  it('should have left and right pointers', () => {
    const input = { s: 'ADOBEC', t: 'ABC' }
    const snapshots = executeMinWindow(input)
    const pointerSnapshots = snapshots.filter(s => s.data.pointers.length > 0)
    expect(pointerSnapshots.length).toBeGreaterThan(0)
  })
})
