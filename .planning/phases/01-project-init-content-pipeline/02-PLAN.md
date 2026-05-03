# PLAN: P1-02 内容解析管道

---
id: 02
wave: 2
depends_on: [01]
files_modified:
  - leetcode-hot100-viz/scripts/parse-content.ts
  - leetcode-hot100-viz/scripts/category-mapping.ts
  - leetcode-hot100-viz/src/lib/data/types.ts
  - leetcode-hot100-viz/src/lib/data/loader.ts
  - leetcode-hot100-viz/data/categories.json
  - leetcode-hot100-viz/data/problems.json
  - leetcode-hot100-viz/package.json
autonomous: true
requirements: [STRUCT-01, STRUCT-02]
must_haves:
  goal: "Create script to parse 17 category directories of markdown files into structured JSON data"
  truths:
    - "Markdown files are in parent repo directories (2-哈希/ through 17-技巧/)"
    - "File naming: {序号}-{题目编号}-{题目名}.md (e.g., 1-0001-两数之和.md)"
    - "Directory naming: {序号}-{中文名} (e.g., 2-哈希)"
    - "Content sections: 生活场景, 问题描述, 暴力解法/优化解法, 代码块 (go, python, java)"
    - "Difficulty defaults to 'unknown' (not in markdown)"
---

<objective>
Create a content parsing pipeline that reads markdown files from the 17 category directories, extracts structured data (title, problem ID, code blocks, descriptions), and generates JSON files for the Next.js application to consume.
</objective>

<verification>
- [ ] `pnpm parse` command executes successfully
- [ ] `data/categories.json` contains exactly 16 categories
- [ ] `data/problems.json` contains all problems from all categories
- [ ] Each problem has at least one Go code block
- [ ] Category mapping correctly converts directory names to slugs (e.g., "2-哈希" → "hash")
- [ ] Problem IDs are extracted correctly (e.g., "1-0001-两数之和.md" → id: "0001")
</verification>

<tasks>
<task id="1">
<name>Create TypeScript type definitions for data models</name>
<read_first>
- .planning/research/ARCHITECTURE.md (lines 269-319 for Category and Problem schemas)
- .planning/phases/01-project-init-content-pipeline/01-CONTEXT.md (for D-05, D-06, D-07 decisions)
</read_first>
<action>
Create file `leetcode-hot100-viz/src/lib/data/types.ts` with:
```typescript
export interface Category {
  id: string;           // "hash", "two-pointers", "linked-list"
  name: string;         // "哈希", "双指针", "链表"
  slug: string;         // URL-friendly: "hash"
  order: number;        // Display order: 2
  problemCount: number;
  description: string;
  icon: string;         // Lucide icon name
}

export interface Problem {
  id: string;           // "0001", "0206"
  title: string;        // "两数之和"
  leetcodeId: number;   // 1, 206
  difficulty: 'easy' | 'medium' | 'hard' | 'unknown';
  categoryId: string;
  order: number;        // Order within category
  slug: string;         // URL-friendly title
  description: string;
  lifeScenario: string; // Life analogy section
  solutions: Solution[];
}

export interface Solution {
  title: string;        // "暴力解法", "优化解法"
  explanation: string;
  codeBlocks: CodeBlock[];
}

export interface CodeBlock {
  language: 'go' | 'python' | 'java';
  code: string;
}

export interface ParsedContent {
  categories: Category[];
  problems: Problem[];
}
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/lib/data/types.ts` exists
- File exports Category, Problem, Solution, CodeBlock, ParsedContent interfaces
- All TypeScript types compile without errors
</acceptance_criteria>
</task>

<task id="2">
<name>Create category directory to ID mapping</name>
<read_first>
- .planning/phases/01-project-init-content-pipeline/01-CONTEXT.md (for D-08 decision)
- 2-哈希/, 3-双指针/, 7-链表/ (example directory names)
</read_first>
<action>
Create file `leetcode-hot100-viz/scripts/category-mapping.ts` with complete mapping:
```typescript
export const CATEGORY_MAPPING: Record<string, { id: string; name: string; icon: string }> = {
  '2-哈希': { id: 'hash', name: '哈希', icon: 'Hash' },
  '3-双指针': { id: 'two-pointers', name: '双指针', icon: 'GitBranch' },
  '4-滑动窗口': { id: 'sliding-window', name: '滑动窗口', icon: 'Scan' },
  '5-普通数组': { id: 'array', name: '普通数组', icon: 'Brackets' },
  '6-矩阵': { id: 'matrix', name: '矩阵', icon: 'Grid3x3' },
  '7-链表': { id: 'linked-list', name: '链表', icon: 'Link2' },
  '8-二叉树': { id: 'binary-tree', name: '二叉树', icon: 'BinaryTree' },
  '9-图论': { id: 'graph', name: '图论', icon: 'Network' },
  '10-回溯': { id: 'backtracking', name: '回溯', icon: 'RotateCcw' },
  '11-二分查找': { id: 'binary-search', name: '二分查找', icon: 'Search' },
  '12-栈': { id: 'stack', name: '栈', icon: 'Layers' },
  '13-堆': { id: 'heap', name: '堆', icon: 'Triangle' },
  '14-贪心算法': { id: 'greedy', name: '贪心算法', icon: 'Target' },
  '15-动态规划': { id: 'dynamic-programming', name: '动态规划', icon: 'Table' },
  '16-多维动态规划': { id: 'multi-dp', name: '多维动态规划', icon: 'Table2' },
  '17-技巧': { id: 'tricks', name: '技巧', icon: 'Lightbulb' },
};
```
Note: Directory "1-目录" is a table of contents, NOT a problem category. Skip it during parsing.
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/scripts/category-mapping.ts` exists
- Exports CATEGORY_MAPPING with 16 entries (excluding "1-目录")
- Each entry has id, name, and icon fields
- Icon names match Lucide React icon components
</acceptance_criteria>
</task>

<task id="3">
<name>Create main parsing script</name>
<read_first>
- 2-哈希/1-0001-两数之和.md (sample markdown structure)
- 7-链表/2-0206-反转链表.md (sample markdown structure)
- leetcode-hot100-viz/src/lib/data/types.ts (type definitions)
</read_first>
<action>
Create file `leetcode-hot100-viz/scripts/parse-content.ts` that:
1. Reads all directories matching pattern `{数字}-{中文名}/` in parent directory
2. Skips "1-目录/" (table of contents)
3. For each markdown file in category directories:
   - Extracts problem ID from filename: `1-0001-两数之和.md` → id: "0001", leetcodeId: 1
   - Extracts title from first H1 heading
   - Extracts sections by H2 headings: "生活场景", "问题描述", "暴力解法", "优化解法"
   - Extracts code blocks with language identifiers (```go, ```python, ```java)
4. Generates `data/categories.json` with all 16 categories
5. Generates `data/problems.json` with all problems

Key regex patterns:
- Filename: `/^(\d+)-(\d+)-(.+)\.md$/` → order, leetcodeId, title
- Code block: `/```(\w+)\n([\s\S]*?)```/g`
- H2 section: `/## (.+)\n([\s\S]*?)(?=## |$)/g`
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/scripts/parse-content.ts` exists
- Script imports types from `../src/lib/data/types`
- Script imports CATEGORY_MAPPING from `./category-mapping`
- Script uses Node.js fs module to read files
- Script handles file reading errors gracefully
</acceptance_criteria>
</task>

<task id="4">
<name>Implement markdown section parser</name>
<read_first>
- 2-哈希/1-0001-两数之和.md (lines 1-145 for section structure)
- leetcode-hot100-viz/scripts/parse-content.ts (main script to add functions)
</read_first>
<action>
Add the following parsing functions to `parse-content.ts`:

```typescript
function extractTitle(content: string): string {
  const match = content.match(/^# (.+)$/m);
  return match ? match[1].trim() : '';
}

function extractLifeScenario(content: string): string {
  const match = content.match(/## 生活中的算法\n([\s\S]*?)(?=\n## |$)/);
  return match ? match[1].trim() : '';
}

function extractDescription(content: string): string {
  const match = content.match(/## 问题描述\n([\s\S]*?)(?=\n## |$)/);
  return match ? match[1].trim() : '';
}

function extractSolutions(content: string): Solution[] {
  const solutions: Solution[] = [];
  // Match "最直观的解法" or "暴力解法" section
  const bruteMatch = content.match(/## (?:最直观的解法|暴力解法)\n([\s\S]*?)(?=\n## |$)/);
  if (bruteMatch) {
    solutions.push({
      title: '暴力解法',
      explanation: bruteMatch[1].replace(/```[\s\S]*?```/g, '').trim(),
      codeBlocks: extractCodeBlocks(bruteMatch[1])
    });
  }
  // Match "优化解法" section
  const optimizedMatch = content.match(/## 优化解法\n([\s\S]*?)(?=\n## |$)/);
  if (optimizedMatch) {
    solutions.push({
      title: '优化解法',
      explanation: optimizedMatch[1].replace(/```[\s\S]*?```/g, '').trim(),
      codeBlocks: extractCodeBlocks(optimizedMatch[1])
    });
  }
  return solutions;
}

function extractCodeBlocks(content: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const regex = /```(\w+)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const lang = match[1] as 'go' | 'python' | 'java';
    if (['go', 'python', 'java'].includes(lang)) {
      blocks.push({ language: lang, code: match[2].trim() });
    }
  }
  return blocks;
}
```
</action>
<acceptance_criteria>
- Function extractTitle returns string from H1 heading
- Function extractDescription returns content after "## 问题描述"
- Function extractSolutions returns array with at least one solution
- Function extractCodeBlocks returns all code blocks with correct language
</acceptance_criteria>
</task>

<task id="5">
<name>Implement file walker and category parser</name>
<read_first>
- leetcode-hot100-viz/scripts/parse-content.ts (current state)
- leetcode-hot100-viz/scripts/category-mapping.ts (mapping reference)
</read_first>
<action>
Add the following functions to `parse-content.ts`:

```typescript
import * as fs from 'fs';
import * as path from 'path';

const CONTENT_DIR = path.resolve(__dirname, '../../../'); // Parent repo root
const OUTPUT_DIR = path.resolve(__dirname, '../data');

function parseProblem(filePath: string, categoryId: string, order: number): Problem | null {
  const filename = path.basename(filePath);
  const nameMatch = filename.match(/^(\d+)-(\d+)-(.+)\.md$/);
  if (!nameMatch) return null;

  const [, fileOrder, leetcodeId, titleFromFilename] = nameMatch;
  const content = fs.readFileSync(filePath, 'utf-8');

  return {
    id: leetcodeId.padStart(4, '0'),
    title: extractTitle(content) || titleFromFilename,
    leetcodeId: parseInt(leetcodeId, 10),
    difficulty: 'unknown', // Per D-06
    categoryId,
    order: parseInt(fileOrder, 10),
    slug: slugify(titleFromFilename),
    description: extractDescription(content),
    lifeScenario: extractLifeScenario(content),
    solutions: extractSolutions(content)
  };
}

function slugify(text: string): string {
  return text
    .replace(/[^\w一-龥]+/g, '-')
    .toLowerCase();
}

function parseCategory(dirPath: string): { category: Category; problems: Problem[] } | null {
  const dirName = path.basename(dirPath);
  const mapping = CATEGORY_MAPPING[dirName];
  if (!mapping) return null;

  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.md'))
    .sort();

  const problems: Problem[] = [];
  files.forEach((file, index) => {
    const problem = parseProblem(
      path.join(dirPath, file),
      mapping.id,
      index + 1
    );
    if (problem) problems.push(problem);
  });

  return {
    category: {
      id: mapping.id,
      name: mapping.name,
      slug: mapping.id,
      order: parseInt(dirName.split('-')[0], 10),
      problemCount: problems.length,
      description: `${mapping.name}相关算法题目`,
      icon: mapping.icon
    },
    problems
  };
}
```
</action>
<acceptance_criteria>
- Function parseProblem extracts correct problem ID from filename
- Function parseCategory returns category with correct problem count
- Slug generation removes special characters
- Order is extracted from filename prefix
</acceptance_criteria>
</task>

<task id="6">
<name>Implement main execution and JSON output</name>
<read_first>
- leetcode-hot100-viz/scripts/parse-content.ts (current state)
- leetcode-hot100-viz/src/lib/data/types.ts (ParsedContent interface)
</read_first>
<action>
Add main execution block to `parse-content.ts`:

```typescript
function main() {
  console.log('Starting content parsing...');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all category directories
  const dirs = fs.readdirSync(CONTENT_DIR)
    .filter(d => {
      const stat = fs.statSync(path.join(CONTENT_DIR, d));
      return stat.isDirectory() && /^\d+-/.test(d) && d !== '1-目录';
    })
    .sort();

  const categories: Category[] = [];
  const allProblems: Problem[] = [];

  // Parse each category
  for (const dir of dirs) {
    const result = parseCategory(path.join(CONTENT_DIR, dir));
    if (result) {
      categories.push(result.category);
      allProblems.push(...result.problems);
      console.log(`Parsed ${result.category.name}: ${result.problems.length} problems`);
    }
  }

  // Write output files
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'problems.json'),
    JSON.stringify(allProblems, null, 2),
    'utf-8'
  );

  console.log(`\nParsing complete!`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Total problems: ${allProblems.length}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main();
```
</action>
<acceptance_criteria>
- Script creates data/ directory if not exists
- Script writes categories.json with 16 categories
- Script writes problems.json with all problems
- Console output shows parsing progress and summary
</acceptance_criteria>
</task>

<task id="7">
<name>Add parse script to package.json</name>
<read_first>
- leetcode-hot100-viz/package.json (current scripts section)
</read_first>
<action>
Add the following to `package.json` scripts section:
```json
{
  "scripts": {
    "parse": "ts-node scripts/parse-content.ts"
  }
}
```
Also install ts-node as dev dependency: `pnpm add -D ts-node`
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/package.json` contains `"parse": "ts-node scripts/parse-content.ts"` in scripts
- ts-node is in devDependencies
- Command `pnpm parse` can be executed
</acceptance_criteria>
</task>

<task id="8">
<name>Create data loader utility</name>
<read_first>
- leetcode-hot100-viz/src/lib/data/types.ts (type definitions)
- leetcode-hot100-viz/data/categories.json (generated data)
- leetcode-hot100-viz/data/problems.json (generated data)
</read_first>
<action>
Create file `leetcode-hot100-viz/src/lib/data/loader.ts`:

```typescript
import { Category, Problem } from './types';
import categoriesData from '../../data/categories.json';
import problemsData from '../../data/problems.json';

export function getCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCategoryById(id: string): Category | undefined {
  return getCategories().find(c => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find(c => c.slug === slug);
}

export function getProblems(): Problem[] {
  return problemsData as Problem[];
}

export function getProblemById(id: string): Problem | undefined {
  return getProblems().find(p => p.id === id);
}

export function getProblemsByCategory(categoryId: string): Problem[] {
  return getProblems().filter(p => p.categoryId === categoryId);
}
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/lib/data/loader.ts` exists
- Exports all data accessor functions
- TypeScript imports resolve correctly
</acceptance_criteria>
</task>

<task id="9">
<name>Run parsing script and verify output</name>
<read_first>
- leetcode-hot100-viz/scripts/parse-content.ts (parsing script)
- leetcode-hot100-viz/data/ (output directory)
</read_first>
<action>
Execute `pnpm parse` and verify:
1. Script runs without errors
2. `data/categories.json` has exactly 16 categories
3. `data/problems.json` has ~100 problems (exact count depends on content)
4. Each problem has valid id, title, categoryId
5. At least 80% of problems have Go code blocks
</action>
<acceptance_criteria>
- Command `cd leetcode-hot100-viz && pnpm parse` exits with code 0
- File `leetcode-hot100-viz/data/categories.json` exists with 16 entries
- File `leetcode-hot100-viz/data/problems.json` exists with problem count > 50
- JSON files are valid (can be parsed by JSON.parse)
- Each problem has `id`, `title`, `categoryId` fields
</acceptance_criteria>
</task>
</tasks>
