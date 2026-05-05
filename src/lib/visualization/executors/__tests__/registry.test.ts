import { describe, it, expect } from 'vitest'
import { getExecutor, hasExecutor } from '../registry'
import { PROBLEM_IDS } from '@/lib/constants/problems'

describe('executor registry', () => {
  describe('getExecutor', () => {
    it('should return executor for valid problem ID', () => {
      const executor = getExecutor(PROBLEM_IDS.TWO_SUM)
      expect(executor).toBeDefined()
      expect(typeof executor).toBe('function')
    })

    it('should return executor for three sum', () => {
      const executor = getExecutor(PROBLEM_IDS.THREE_SUM)
      expect(executor).toBeDefined()
      expect(typeof executor).toBe('function')
    })

    it('should return executor for find min', () => {
      const executor = getExecutor(PROBLEM_IDS.FIND_MIN)
      expect(executor).toBeDefined()
      expect(typeof executor).toBe('function')
    })

    it('should return undefined for invalid problem ID', () => {
      const executor = getExecutor('invalid-id')
      expect(executor).toBeUndefined()
    })
  })

  describe('hasExecutor', () => {
    it('should return true for valid problem ID', () => {
      expect(hasExecutor(PROBLEM_IDS.TWO_SUM)).toBe(true)
    })

    it('should return true for all registered problem IDs', () => {
      const validIds = [
        PROBLEM_IDS.TWO_SUM,
        PROBLEM_IDS.MOVE_ZEROES,
        PROBLEM_IDS.CONTAINER_WITH_WATER,
        PROBLEM_IDS.THREE_SUM,
        PROBLEM_IDS.FIND_MIN,
        PROBLEM_IDS.SEARCH_INSERT,
        PROBLEM_IDS.MAX_SUBARRAY,
        PROBLEM_IDS.REVERSE_LIST,
        PROBLEM_IDS.HAS_CYCLE,
        PROBLEM_IDS.MERGE_TWO_LISTS,
        PROBLEM_IDS.REMOVE_NTH_FROM_END,
      ]

      validIds.forEach(id => {
        expect(hasExecutor(id)).toBe(true)
      })
    })

    it('should return false for invalid problem ID', () => {
      expect(hasExecutor('invalid-id')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(hasExecutor('')).toBe(false)
    })
  })
})
