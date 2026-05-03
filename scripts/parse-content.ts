import * as fs from 'fs';
import * as path from 'path';
import { Category, Problem, Solution, CodeBlock } from '../src/lib/data/types';
import { CATEGORY_MAPPING } from './category-mapping';

// Resolve the content directory relative to this script file
// Scripts are in leetcode-hot100-viz/scripts/
// Content directories are now in docs/original-content/
const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..'); // leetcode-hot100-viz/
const CONTENT_DIR = path.resolve(PROJECT_ROOT, 'docs/original-content');
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, 'data');

function extractTitle(content: string): string {
  // Match first H1 heading, strip any emoji or special characters
  const match = content.match(/^# (.+)$/m);
  if (!match) return '';
  const title = match[1].trim();
  // Remove common prefixes and strip emojis
  return title
    .replace(/^【[^】]+】\s*/, '')
    .replace(/[｜|].*$/, '')  // Remove subtitle after |
    .trim();
}

function extractLifeScenario(content: string): string {
  // Match "生活中的算法" or sections starting with life analogies (emoji headers)
  const patterns = [
    /## 生活中的算法\n([\s\S]*?)(?=\n## |$)/,
    /## 🧩.*?\n([\s\S]*?)(?=\n## |$)/,
    /## 💡 问题的本质\n([\s\S]*?)(?=\n## |$)/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
}

function extractDescription(content: string): string {
  // Match "问题描述" or problem description sections
  const patterns = [
    /## 问题描述\n([\s\S]*?)(?=\n## |$)/,
    /## 💡 问题的本质\n([\s\S]*?)(?=\n## |$)/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
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

function extractSolutions(content: string): Solution[] {
  const solutions: Solution[] = [];

  // Match various solution section patterns
  // Pattern 1: "最直观的解法" or "暴力解法" or "⚡ 代码实现" with solution type
  const brutePatterns = [
    /## (?:最直观的解法|暴力解法)[：:\n]([\s\S]*?)(?=\n## |$)/,
    /## ⚡ 代码实现[：:\n]([\s\S]*?)(?=\n## |$)/,
  ];

  for (const pattern of brutePatterns) {
    const match = content.match(pattern);
    if (match) {
      const codeBlocks = extractCodeBlocks(match[1]);
      if (codeBlocks.length > 0) {
        solutions.push({
          title: '暴力解法',
          explanation: match[1].replace(/```[\s\S]*?```/g, '').trim(),
          codeBlocks
        });
        break;
      }
    }
  }

  // Pattern 2: "优化解法" section
  const optimizedMatch = content.match(/## 优化解法[：:\n]([\s\S]*?)(?=\n## |$)/);
  if (optimizedMatch) {
    const codeBlocks = extractCodeBlocks(optimizedMatch[1]);
    if (codeBlocks.length > 0) {
      solutions.push({
        title: '优化解法',
        explanation: optimizedMatch[1].replace(/```[\s\S]*?```/g, '').trim(),
        codeBlocks
      });
    }
  }

  // If no solutions found, try to extract all code blocks from the document
  if (solutions.length === 0) {
    const allCodeBlocks = extractCodeBlocks(content);
    if (allCodeBlocks.length > 0) {
      solutions.push({
        title: '题解',
        explanation: '',
        codeBlocks: allCodeBlocks
      });
    }
  }

  return solutions;
}

function slugify(text: string): string {
  return text
    .replace(/[^\w一-龥]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
}

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
    difficulty: 'unknown', // Per D-06: difficulty not in markdown
    categoryId,
    order: parseInt(fileOrder, 10),
    slug: slugify(titleFromFilename),
    description: extractDescription(content),
    lifeScenario: extractLifeScenario(content),
    solutions: extractSolutions(content)
  };
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

function main() {
  console.log('Starting content parsing...');
  console.log(`Content directory: ${CONTENT_DIR}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);

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

  console.log(`Found ${dirs.length} category directories:`, dirs);

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
