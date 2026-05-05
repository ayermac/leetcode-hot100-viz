import { describe, it, expect } from 'vitest'
import { 
  executeFindKthLargest, 
  getFindKthLargestDefaultInput,
  executeTopKFrequent,
  getTopKFrequentDefaultInput
} from '../heapAlgorithms'

describe('Find Kth Largest executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getFindKthLargestDefaultInput()
    const snapshots = executeFindKthLargest(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getFindKthLargestDefaultInput()
    const snapshots = executeFindKthLargest(input)
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
    const snapshots = executeFindKthLargest({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.elements).toEqual([])
  })

  it('should find correct kth largest element', () => {
    const input = { nums: [3, 2, 1, 5, 6, 4], k: 2 }
    const snapshots = executeFindKthLargest(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
    expect(lastSnapshot.description).toContain('5')
  })

  it('should find 1st largest element', () => {
    const input = { nums: [3, 2, 1], k: 1 }
    const snapshots = executeFindKthLargest(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('3')
  })

  it('should find last largest element', () => {
    const input = { nums: [3, 2, 1], k: 3 }
    const snapshots = executeFindKthLargest(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('1')
  })

  it('should handle single element', () => {
    const input = { nums: [5], k: 1 }
    const snapshots = executeFindKthLargest(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('5')
  })

  it('should show heapify operations', () => {
    const input = { nums: [3, 2, 1], k: 2 }
    const snapshots = executeFindKthLargest(input)
    const heapifySnapshots = snapshots.filter(s => s.description.includes('堆化'))
    expect(heapifySnapshots.length).toBeGreaterThan(0)
  })

  it('should show heap building', () => {
    const input = { nums: [3, 2, 1], k: 2 }
    const snapshots = executeFindKthLargest(input)
    const buildSnapshots = snapshots.filter(s => s.description.includes('构建'))
    expect(buildSnapshots.length).toBeGreaterThan(0)
  })

  it('should show extraction process', () => {
    const input = { nums: [3, 2, 1, 5, 6, 4], k: 2 }
    const snapshots = executeFindKthLargest(input)
    const extractSnapshots = snapshots.filter(s => s.description.includes('提取'))
    expect(extractSnapshots.length).toBeGreaterThan(0)
  })
})

describe('Top K Frequent executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getTopKFrequentDefaultInput()
    const snapshots = executeTopKFrequent(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getTopKFrequentDefaultInput()
    const snapshots = executeTopKFrequent(input)
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
    const snapshots = executeTopKFrequent({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.elements).toEqual([])
  })

  it('should find top k frequent elements', () => {
    const input = { nums: [1, 1, 1, 2, 2, 3], k: 2 }
    const snapshots = executeTopKFrequent(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
    expect(lastSnapshot.description).toContain('1')
    expect(lastSnapshot.description).toContain('2')
  })

  it('should handle k equals number of unique elements', () => {
    const input = { nums: [1, 2, 3], k: 3 }
    const snapshots = executeTopKFrequent(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
  })

  it('should handle single element', () => {
    const input = { nums: [1], k: 1 }
    const snapshots = executeTopKFrequent(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('1')
  })

  it('should show frequency counting', () => {
    const input = { nums: [1, 1, 2], k: 1 }
    const snapshots = executeTopKFrequent(input)
    const freqSnapshots = snapshots.filter(s => s.description.includes('频率'))
    expect(freqSnapshots.length).toBeGreaterThan(0)
  })

  it('should show heap operations', () => {
    const input = { nums: [1, 1, 2, 2, 3], k: 2 }
    const snapshots = executeTopKFrequent(input)
    const heapSnapshots = snapshots.filter(s => 
      s.description.includes('堆化') || s.description.includes('添加') || s.description.includes('替换')
    )
    expect(heapSnapshots.length).toBeGreaterThan(0)
  })

  it('should handle all same elements', () => {
    const input = { nums: [1, 1, 1, 1], k: 1 }
    const snapshots = executeTopKFrequent(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('1')
  })

  it('should handle elements with same frequency', () => {
    const input = { nums: [1, 2, 3], k: 2 }
    const snapshots = executeTopKFrequent(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('完成')
  })
})
