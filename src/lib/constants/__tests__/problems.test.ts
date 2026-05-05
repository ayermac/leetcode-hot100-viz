import { describe, it, expect } from 'vitest'
import {
  isVisualizationSupported,
  hasRichContent,
  getLeetCodeNumber,
  fromLeetCodeNumber,
  PROBLEM_IDS,
} from '../problems'

describe('problems constants', () => {
  describe('isVisualizationSupported', () => {
    it('should return true for valid problem IDs', () => {
      expect(isVisualizationSupported('0001')).toBe(true)
      expect(isVisualizationSupported('0015')).toBe(true)
      expect(isVisualizationSupported('0053')).toBe(true)
    })

    it('should return false for invalid problem IDs', () => {
      expect(isVisualizationSupported('invalid')).toBe(false)
      expect(isVisualizationSupported('9999')).toBe(false)
    })

    it('should return true for all defined PROBLEM_IDS', () => {
      Object.values(PROBLEM_IDS).forEach(id => {
        expect(isVisualizationSupported(id)).toBe(true)
      })
    })
  })

  describe('hasRichContent', () => {
    it('should return true for TWO_SUM', () => {
      expect(hasRichContent(PROBLEM_IDS.TWO_SUM)).toBe(true)
    })

    it('should return false for problems without rich content', () => {
      expect(hasRichContent(PROBLEM_IDS.THREE_SUM)).toBe(false)
      expect(hasRichContent(PROBLEM_IDS.FIND_MIN)).toBe(false)
    })

    it('should return false for invalid problem IDs', () => {
      expect(hasRichContent('invalid')).toBe(false)
    })
  })

  describe('getLeetCodeNumber', () => {
    it('should extract correct number from problem ID', () => {
      expect(getLeetCodeNumber(PROBLEM_IDS.TWO_SUM)).toBe(1)
      expect(getLeetCodeNumber(PROBLEM_IDS.THREE_SUM)).toBe(15)
      expect(getLeetCodeNumber(PROBLEM_IDS.MAX_SUBARRAY)).toBe(53)
    })

    it('should handle leading zeros', () => {
      expect(getLeetCodeNumber('0001')).toBe(1)
      expect(getLeetCodeNumber('0035')).toBe(35)
    })
  })

  describe('fromLeetCodeNumber', () => {
    it('should create correct problem ID from number', () => {
      expect(fromLeetCodeNumber(1)).toBe('0001')
      expect(fromLeetCodeNumber(15)).toBe('0015')
      expect(fromLeetCodeNumber(53)).toBe('0053')
    })

    it('should pad numbers to 4 digits', () => {
      expect(fromLeetCodeNumber(739)).toBe('0739')
      expect(fromLeetCodeNumber(994)).toBe('0994')
    })
  })

  describe('PROBLEM_IDS', () => {
    it('should have all required problem IDs', () => {
      expect(PROBLEM_IDS.TWO_SUM).toBeDefined()
      expect(PROBLEM_IDS.MOVE_ZEROES).toBeDefined()
      expect(PROBLEM_IDS.CONTAINER_WITH_WATER).toBeDefined()
      expect(PROBLEM_IDS.THREE_SUM).toBeDefined()
      expect(PROBLEM_IDS.FIND_MIN).toBeDefined()
      expect(PROBLEM_IDS.SEARCH_INSERT).toBeDefined()
      expect(PROBLEM_IDS.MAX_SUBARRAY).toBeDefined()
      expect(PROBLEM_IDS.REVERSE_LIST).toBeDefined()
      expect(PROBLEM_IDS.HAS_CYCLE).toBeDefined()
      expect(PROBLEM_IDS.MERGE_TWO_LISTS).toBeDefined()
      expect(PROBLEM_IDS.REMOVE_NTH_FROM_END).toBeDefined()
    })

    it('should have consistent format (4 digits)', () => {
      Object.values(PROBLEM_IDS).forEach(id => {
        expect(id).toMatch(/^\d{4}$/)
      })
    })
  })
})
