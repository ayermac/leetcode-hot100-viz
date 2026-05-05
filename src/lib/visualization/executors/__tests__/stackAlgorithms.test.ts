import { describe, it, expect } from 'vitest'
import { 
  executeValidParentheses, 
  getValidParenthesesDefaultInput,
  executeDailyTemperatures,
  getDailyTemperaturesDefaultInput
} from '../stackAlgorithms'

describe('Valid Parentheses executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getValidParenthesesDefaultInput()
    const snapshots = executeValidParentheses(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getValidParenthesesDefaultInput()
    const snapshots = executeValidParentheses(input)
    snapshots.forEach((snapshot) => {
      expect(snapshot).toHaveProperty('step')
      expect(snapshot).toHaveProperty('description')
      expect(snapshot).toHaveProperty('codeLine')
      expect(snapshot).toHaveProperty('data')
      expect(snapshot.data).toHaveProperty('elements')
      expect(snapshot.data).toHaveProperty('elementStates')
      expect(snapshot.data).toHaveProperty('topPointer')
    })
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeValidParentheses({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.elements).toEqual([])
  })

  it('should validate correct parentheses', () => {
    const input = { s: '()[]{}' }
    const snapshots = executeValidParentheses(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('验证通过')
  })

  it('should detect mismatched parentheses', () => {
    const input = { s: '(]' }
    const snapshots = executeValidParentheses(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('不匹配')
  })

  it('should detect unbalanced parentheses', () => {
    const input = { s: '([' }
    const snapshots = executeValidParentheses(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('验证失败')
  })

  it('should handle closing bracket with empty stack', () => {
    const input = { s: ')' }
    const snapshots = executeValidParentheses(input)
    const errorSnapshot = snapshots.find(s => s.description.includes('错误'))
    expect(errorSnapshot).toBeDefined()
  })

  it('should handle empty string', () => {
    const input = { s: '' }
    const snapshots = executeValidParentheses(input)
    expect(snapshots.length).toBeGreaterThan(0)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('验证通过')
  })

  it('should handle nested parentheses', () => {
    const input = { s: '([{}])' }
    const snapshots = executeValidParentheses(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('验证通过')
  })

  it('should track stack operations', () => {
    const input = { s: '()' }
    const snapshots = executeValidParentheses(input)
    const pushSnapshots = snapshots.filter(s => s.description.includes('压入'))
    const popSnapshots = snapshots.filter(s => s.description.includes('弹出'))
    expect(pushSnapshots.length).toBeGreaterThan(0)
    expect(popSnapshots.length).toBeGreaterThan(0)
  })
})

describe('Daily Temperatures executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getDailyTemperaturesDefaultInput()
    const snapshots = executeDailyTemperatures(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getDailyTemperaturesDefaultInput()
    const snapshots = executeDailyTemperatures(input)
    snapshots.forEach((snapshot) => {
      expect(snapshot).toHaveProperty('step')
      expect(snapshot).toHaveProperty('description')
      expect(snapshot).toHaveProperty('codeLine')
      expect(snapshot).toHaveProperty('data')
      expect(snapshot.data).toHaveProperty('elements')
      expect(snapshot.data).toHaveProperty('elementStates')
      expect(snapshot.data).toHaveProperty('topPointer')
    })
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeDailyTemperatures({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.elements).toEqual([])
  })

  it('should calculate correct result', () => {
    const input = { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }
    const snapshots = executeDailyTemperatures(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
    expect(lastSnapshot.description).toContain('1, 1, 4, 2, 1, 1, 0, 0')
  })

  it('should handle single temperature', () => {
    const input = { temperatures: [70] }
    const snapshots = executeDailyTemperatures(input)
    expect(snapshots.length).toBeGreaterThan(0)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('0')
  })

  it('should handle decreasing temperatures', () => {
    const input = { temperatures: [75, 74, 73, 72, 71] }
    const snapshots = executeDailyTemperatures(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('0, 0, 0, 0, 0')
  })

  it('should handle increasing temperatures', () => {
    const input = { temperatures: [71, 72, 73, 74, 75] }
    const snapshots = executeDailyTemperatures(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('1, 1, 1, 1, 0')
  })

  it('should handle empty array', () => {
    const input = { temperatures: [] }
    const snapshots = executeDailyTemperatures(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should show stack operations', () => {
    const input = { temperatures: [73, 74, 75] }
    const snapshots = executeDailyTemperatures(input)
    const pushSnapshots = snapshots.filter(s => s.description.includes('压入栈'))
    expect(pushSnapshots.length).toBeGreaterThan(0)
  })
})
