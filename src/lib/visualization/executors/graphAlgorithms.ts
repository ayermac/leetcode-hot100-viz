import { AnimationSnapshot, ElementState, MatrixSnapshot } from '../types';
import { generatorToSnapshots } from './utils';

interface NumIslandsInput {
  grid: number[][];
}

function* numIslandsGenerator(
  grid: number[][]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  if (grid.length === 0 || grid[0].length === 0) {
    yield {
      description: `空网格`,
      codeLine: 0,
      data: {
        grid: [],
        cellStates: new Map(),
        highlightedCells: [],
        currentCell: null,
      } as MatrixSnapshot,
    };
    return;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set<string>();
  let islandCount = 0;

  // Initial state
  yield {
    description: `开始计算岛屿数量，网格大小: ${rows} × ${cols}`,
    codeLine: 1,
    data: {
      grid: grid.map(row => [...row]),
      cellStates: new Map(),
      highlightedCells: [],
      currentCell: null,
    } as MatrixSnapshot,
  };

  function* dfs(r: number, c: number): Generator<Omit<AnimationSnapshot, 'step'>> {
    const key = `${r},${c}`;

    if (
      r < 0 || r >= rows ||
      c < 0 || c >= cols ||
      grid[r][c] === 0 ||
      visited.has(key)
    ) {
      return;
    }

    visited.add(key);

    // Mark cell as part of current island
    const islandStates = new Map<string, ElementState>();
    visited.forEach(v => {
      islandStates.set(v, 'sorted');
    });
    islandStates.set(key, 'highlighted');

    yield {
      description: `访问岛屿单元格 (${r}, ${c})`,
      codeLine: 10,
      data: {
        grid: grid.map(row => [...row]),
        cellStates: islandStates,
        highlightedCells: Array.from(visited),
        currentCell: { row: r, col: c },
      } as MatrixSnapshot,
    };

    // Explore all 4 directions
    const directions = [
      [-1, 0], // up
      [1, 0],  // down
      [0, -1], // left
      [0, 1],  // right
    ];

    for (const [dr, dc] of directions) {
      yield* dfs(r + dr, c + dc);
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const key = `${i},${j}`;

      // Show current cell being checked
      const checkStates = new Map<string, ElementState>();
      visited.forEach(v => {
        checkStates.set(v, 'sorted');
      });

      yield {
        description: `检查单元格 (${i}, ${j})，值 = ${grid[i][j]}`,
        codeLine: 5,
        data: {
          grid: grid.map(row => [...row]),
          cellStates: checkStates,
          highlightedCells: Array.from(visited),
          currentCell: { row: i, col: j },
        } as MatrixSnapshot,
      };

      if (grid[i][j] === 1 && !visited.has(key)) {
        islandCount++;

        yield {
          description: `发现新岛屿！开始 DFS，当前岛屿数: ${islandCount}`,
          codeLine: 8,
          data: {
            grid: grid.map(row => [...row]),
            cellStates: checkStates,
            highlightedCells: Array.from(visited),
            currentCell: { row: i, col: j },
          } as MatrixSnapshot,
        };

        yield* dfs(i, j);

        // Show completed island
        const completedStates = new Map<string, ElementState>();
        visited.forEach(v => {
          completedStates.set(v, 'sorted');
        });

        yield {
          description: `岛屿探索完成，岛屿数: ${islandCount}`,
          codeLine: 15,
          data: {
            grid: grid.map(row => [...row]),
            cellStates: completedStates,
            highlightedCells: Array.from(visited),
            currentCell: null,
          } as MatrixSnapshot,
        };
      }
    }
  }

  // Final state
  const finalStates = new Map<string, ElementState>();
  visited.forEach(v => {
    finalStates.set(v, 'sorted');
  });

  yield {
    description: `完成！共有 ${islandCount} 个岛屿`,
    codeLine: 0,
    data: {
      grid: grid.map(row => [...row]),
      cellStates: finalStates,
      highlightedCells: Array.from(visited),
      currentCell: null,
    } as MatrixSnapshot,
  };
}

export function executeNumIslands(input: NumIslandsInput): AnimationSnapshot[] {
  return generatorToSnapshots(numIslandsGenerator(input.grid));
}

export function getNumIslandsDefaultInput(): NumIslandsInput {
  return {
    grid: [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1],
    ],
  };
}

// Rotting Oranges (LeetCode 994) - BFS
interface OrangesRottingInput {
  grid: number[][];
}

function* orangesRottingGenerator(
  grid: number[][]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  if (grid.length === 0 || grid[0].length === 0) {
    yield {
      description: `空网格`,
      codeLine: 0,
      data: {
        grid: [],
        cellStates: new Map(),
        highlightedCells: [],
        currentCell: null,
      } as MatrixSnapshot,
    };
    return;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  const queue: [number, number][] = [];
  let freshCount = 0;
  let minutes = 0;

  // Find all rotten oranges and count fresh ones
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 2) {
        queue.push([i, j]);
      } else if (grid[i][j] === 1) {
        freshCount++;
      }
    }
  }

  // Initial state
  const initialStates = new Map<string, ElementState>();
  queue.forEach(([r, c]) => {
    initialStates.set(`${r},${c}`, 'swapping');
  });

  yield {
    description: `开始腐烂橙子模拟，新鲜橙子: ${freshCount}，初始腐烂橙子: ${queue.length}`,
    codeLine: 1,
    data: {
      grid: grid.map(row => [...row]),
      cellStates: initialStates,
      highlightedCells: [],
      currentCell: null,
    } as MatrixSnapshot,
  };

  if (freshCount === 0) {
    yield {
      description: `没有新鲜橙子，用时 0 分钟`,
      codeLine: 0,
      data: {
        grid: grid.map(row => [...row]),
        cellStates: new Map(),
        highlightedCells: [],
        currentCell: null,
      } as MatrixSnapshot,
    };
    return;
  }

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (queue.length > 0) {
    const size = queue.length;
    let rotted = false;

    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift()!;

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (
          nr >= 0 && nr < rows &&
          nc >= 0 && nc < cols &&
          grid[nr][nc] === 1
        ) {
          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
          rotted = true;

          // Show newly rotten orange
          const rotStates = new Map<string, ElementState>();
          queue.forEach(([qr, qc]) => {
            rotStates.set(`${qr},${qc}`, 'swapping');
          });
          rotStates.set(`${nr},${nc}`, 'highlighted');

          yield {
            description: `第 ${minutes + 1} 分钟: 橙子 (${nr}, ${nc}) 腐烂，剩余新鲜: ${freshCount}`,
            codeLine: 10,
            data: {
              grid: grid.map(row => [...row]),
              cellStates: rotStates,
              highlightedCells: [],
              currentCell: { row: nr, col: nc },
            } as MatrixSnapshot,
          };
        }
      }
    }

    if (rotted) {
      minutes++;
    }
  }

  // Final state
  if (freshCount === 0) {
    const finalStates = new Map<string, ElementState>();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] === 2) {
          finalStates.set(`${i},${j}`, 'sorted');
        }
      }
    }

    yield {
      description: `完成！所有橙子腐烂，用时 ${minutes} 分钟`,
      codeLine: 0,
      data: {
        grid: grid.map(row => [...row]),
        cellStates: finalStates,
        highlightedCells: [],
        currentCell: null,
      } as MatrixSnapshot,
    };
  } else {
    yield {
      description: `无法腐烂所有橙子，剩余新鲜橙子: ${freshCount}`,
      codeLine: 0,
      data: {
        grid: grid.map(row => [...row]),
        cellStates: new Map(),
        highlightedCells: [],
        currentCell: null,
      } as MatrixSnapshot,
    };
  }
}

export function executeOrangesRotting(input: OrangesRottingInput): AnimationSnapshot[] {
  // Deep copy grid to avoid mutation
  const gridCopy = input.grid.map(row => [...row]);
  return generatorToSnapshots(orangesRottingGenerator(gridCopy));
}

export function getOrangesRottingDefaultInput(): OrangesRottingInput {
  return {
    grid: [
      [2, 1, 1],
      [1, 1, 0],
      [0, 1, 1],
    ],
  };
}
