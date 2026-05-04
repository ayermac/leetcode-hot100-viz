import { AnimationSnapshot, TreeNodeRef, BinaryTreeSnapshot, ElementState } from '../types';
import { generatorToSnapshots } from './utils';

interface InorderTraversalInput {
  values: (number | null)[];  // Array representation of binary tree (null for missing nodes)
}

// Build tree nodes from array representation
function buildTreeNodes(values: (number | null)[]): TreeNodeRef[] {
  const nodes: TreeNodeRef[] = [];

  for (let i = 0; i < values.length; i++) {
    if (values[i] === null) {
      nodes.push({ value: 0, leftIndex: null, rightIndex: null }); // Placeholder
      continue;
    }

    const leftIndex = 2 * i + 1 < values.length && values[2 * i + 1] !== null ? 2 * i + 1 : null;
    const rightIndex = 2 * i + 2 < values.length && values[2 * i + 2] !== null ? 2 * i + 2 : null;

    nodes.push({
      value: values[i] as number,
      leftIndex,
      rightIndex,
    });
  }

  return nodes;
}

function* inorderTraversalGenerator(
  values: (number | null)[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const nodes = buildTreeNodes(values);
  const validIndices = values.map((v, i) => v !== null ? i : -1).filter(i => i >= 0);

  // Initial state
  yield {
    description: '开始中序遍历（左 → 根 → 右）',
    codeLine: 1,
    data: {
      nodes,
      nodeStates: new Map<number, ElementState>(),
      highlightedPath: [],
      currentRoot: null,
    } as BinaryTreeSnapshot,
  };

  const result: number[] = [];
  const visited = new Set<number>();

  function* traverse(nodeIndex: number | null, path: number[]): Generator<Omit<AnimationSnapshot, 'step'>> {
    if (nodeIndex === null || nodeIndex >= nodes.length || values[nodeIndex] === null) {
      return;
    }

    // Going left
    const newPath = [...path, nodeIndex];
    yield {
      description: `访问节点 ${nodes[nodeIndex].value}，先遍历左子树`,
      codeLine: 5,
      data: {
        nodes,
        nodeStates: new Map([[nodeIndex, 'comparing']]),
        highlightedPath: newPath,
        currentRoot: nodeIndex,
      } as BinaryTreeSnapshot,
    };

    // Traverse left
    yield* traverse(nodes[nodeIndex].leftIndex, newPath);

    // Visit node (inorder position)
    visited.add(nodeIndex);
    result.push(nodes[nodeIndex].value);
    yield {
      description: `访问节点 ${nodes[nodeIndex].value}，加入结果: [${result.join(', ')}]`,
      codeLine: 8,
      data: {
        nodes,
        nodeStates: new Map([[nodeIndex, 'sorted']]),
        highlightedPath: newPath,
        currentRoot: nodeIndex,
      } as BinaryTreeSnapshot,
    };

    // Traverse right
    yield* traverse(nodes[nodeIndex].rightIndex, newPath);
  }

  // Start from root (index 0)
  yield* traverse(0, []);

  // Final state
  const finalStates = new Map<number, ElementState>();
  validIndices.forEach(i => finalStates.set(i, 'sorted'));

  yield {
    description: `遍历完成！结果: [${result.join(', ')}]`,
    codeLine: 0,
    data: {
      nodes,
      nodeStates: finalStates,
      highlightedPath: [],
      currentRoot: null,
    } as BinaryTreeSnapshot,
  };
}

export function executeInorderTraversal(input: InorderTraversalInput): AnimationSnapshot[] {
  return generatorToSnapshots(inorderTraversalGenerator(input.values));
}

export function getInorderTraversalDefaultInput(): InorderTraversalInput {
  return {
    values: [1, 2, 3, 4, 5, 6, 7],  // Complete binary tree
  };
}
