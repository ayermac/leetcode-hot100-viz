import { describe, it, expect } from 'vitest'
import { validateInput, twoSumInputSchema, threeSumInputSchema } from '../validation'

describe('validation utilities', () => {
  describe('validateInput', () => {
    it('should validate correct input successfully', () => {
      const input = { nums: [2, 7, 11, 15], target: 9 }
      const result = validateInput(twoSumInputSchema, input)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.nums).toEqual([2, 7, 11, 15])
        expect(result.data.target).toBe(9)
      }
    })

    it('should return error for invalid input', () => {
      const input = { invalid: 'input' }
      const result = validateInput(twoSumInputSchema, input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeDefined()
        expect(result.error).toContain('nums')
      }
    })

    it('should return error for missing required fields', () => {
      const input = { nums: [1, 2, 3] }
      const result = validateInput(twoSumInputSchema, input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('target')
      }
    })

    it('should validate array minimum length', () => {
      const input = { nums: [] }
      const result = validateInput(twoSumInputSchema, input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('at least one element')
      }
    })

    it('should validate three sum minimum array length', () => {
      const input = { nums: [1, 2] }
      const result = validateInput(threeSumInputSchema, input)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('at least 3 elements')
      }
    })

    it('should validate number types', () => {
      const input = { nums: [1, 'not a number' as unknown as number], target: 9 }
      const result = validateInput(twoSumInputSchema, input)

      expect(result.success).toBe(false)
    })
  })
})
