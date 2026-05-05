import { describe, it, expect } from 'vitest'
import { executeInorderTraversal, getInorderTraversalDefaultInput } from '../binaryTreeTraversal'

describe('Inorder Traversal executor', () => {
  it('should generate snapshots for default input', () => {
    const input = getInorderTraversalDefaultInput()
    const snapshots = executeInorderTraversal(input)
    expect(snapshots.length).toBeGreaterThan(0)
  })

  it('should have correct data structure', () => {
    const input = getInorderTraversalDefaultInput()
    const snapshots = executeInorderTraversal(input)
    snapshots.forEach((snapshot) => {
      expect(snapshot).toHaveProperty('step')
      expect(snapshot).toHaveProperty('description')
      expect(snapshot).toHaveProperty('codeLine')
      expect(snapshot).toHaveProperty('data')
      expect(snapshot.data).toHaveProperty('nodes')
      expect(snapshot.data).toHaveProperty('nodeStates')
      expect(snapshot.data).toHaveProperty('highlightedPath')
      expect(snapshot.data).toHaveProperty('currentRoot')
    })
  })

  it('should return error snapshot for invalid input', () => {
    const snapshots = executeInorderTraversal({ invalid: 'input' })
    expect(snapshots[0].description).toContain('验证失败')
    expect(snapshots[0].data.nodes).toEqual([])
  })

  it('should perform correct inorder traversal', () => {
    const input = { values: [1, 2, 3, 4, 5, 6, 7] }
    const snapshots = executeInorderTraversal(input)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('遍历完成')
    expect(lastSnapshot.description).toContain('4, 2, 5, 1, 6, 3, 7')
  })

  it('should handle single node tree', () => {
    const input = { values: [1] }
    const snapshots = executeInorderTraversal(input)
    expect(snapshots.length).toBeGreaterThan(0)
    expect(snapshots[0].data.nodes.length).toBe(1)
  })

  it('should handle tree with null values', () => {
    const input = { values: [1, null, 2, null, null, 3] }
    const snapshots = executeInorderTraversal(input)
    expect(snapshots.length).toBeGreaterThan(0)
    const lastSnapshot = snapshots[snapshots.length - 1]
    expect(lastSnapshot.description).toContain('遍历完成')
  })

  it('should handle empty tree', () => {
    const input = { values: [] }
    const snapshots = executeInorderTraversal(input)
    expect(snapshots.length).toBeGreaterThan(0)
    expect(snapshots[0].data.nodes).toEqual([])
  })

  it('should mark visited nodes as sorted', () => {
    const input = { values: [1, 2, 3] }
    const snapshots = executeInorderTraversal(input)
    const sortedSnapshots = snapshots.filter(s => 
      Array.from(s.data.nodeStates.values()).some(state => state === 'sorted')
    )
    expect(sortedSnapshots.length).toBeGreaterThan(0)
  })
})
