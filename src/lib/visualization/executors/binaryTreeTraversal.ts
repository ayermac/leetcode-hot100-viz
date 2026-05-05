import { AnimationSnapshot, TreeNodeRef, BinaryTreeSnapshot, ElementState } from '../types';
import { generatorToSnapshots } from './utils';
import { inorderTraversalInputSchema, validateInput } from './validation';

function buildTreeNodes(values: (number | null)[]): TreeNodeRef[] {
  const nodes: TreeNodeRef[] = [];

  for (let i = 0; i < values.length; i++) {
    if (values[i] === null) {
      nodes.push({ value: 0, leftIndex: null, rightIndex: null });
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

    yield* traverse(nodes[nodeIndex].leftIndex, newPath);

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

    yield* traverse(nodes[nodeIndex].rightIndex, newPath);
  }

  yield* traverse(0, []);

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

export function executeInorderTraversal(input: unknown): AnimationSnapshot[] {
  const validation = validateInput(inorderTraversalInputSchema, input);
  if (!validation.success) {
    return [{
      step: 0,
      description: `输入验证失败: ${validation.error}`,
      codeLine: 0,
      data: {
        nodes: [],
        nodeStates: new Map(),
        highlightedPath: [],
        currentRoot: null,
      },
    }];
  }
  return generatorToSnapshots(inorderTraversalGenerator(validation.data.values));
}

export function getInorderTraversalDefaultInput() {
  return {
    values: [1, 2, 3, 4, 5, 6, 7],
  };
}
