import * as fs from 'fs';
import * as path from 'path';
import { Category, Problem, Solution, CodeBlock } from '../src/lib/data/types';
import { CATEGORY_MAPPING } from './category-mapping';

// Resolve the content directory relative to this script file
const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const CONTENT_DIR = path.resolve(PROJECT_ROOT, 'docs/original-content');
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, 'data');

function extractTitle(content: string): string {
  const match = content.match(/^# (.+)$/m);
  if (!match) return '';
  const title = match[1].trim();
  return title
    .replace(/^【[^】]+】\s*/, '')
    .replace(/[｜|].*$/, '')
    .trim();
}

function extractSection(content: string, sectionNames: string[]): string {
  for (const name of sectionNames) {
    // Match section with emoji or without
    const patterns = [
      new RegExp(`## ${name}[\\s\\S]*?(?=\\n## |$)`, 'i'),
      new RegExp(`## [\\p{Emoji_Presentation}\\p{Emoji}\\u{1F300}-\\u{1F9FF}]*\\s*${name}[\\s\\S]*?(?=\\n## |$)`, 'iu'),
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        // Extract content after the heading
        const lines = match[0].split('\n');
        const sectionContent = lines.slice(1).join('\n').trim();
        if (sectionContent) return sectionContent;
      }
    }
  }
  return '';
}

function extractLifeScenario(content: string): string {
  return extractSection(content, [
    '从日出日落说起',
    '生活中的算法',
    '生活场景',
    '购物找零',
    '开门见山',
  ]);
}

function extractDescription(content: string): string {
  return extractSection(content, [
    '问题解析',
    '问题描述',
    '问题的本质',
  ]);
}

function extractThoughtProcess(content: string): string {
  return extractSection(content, [
    '思路发展历程',
    '思路历程',
    '解题思路',
    '思路',
  ]);
}

function extractCodeExplanation(content: string): string {
  return extractSection(content, [
    '代码详解',
    '代码解析',
    '代码说明',
  ]);
}

function extractPitfalls(content: string): string {
  return extractSection(content, [
    '易错点剖析',
    '易错点',
    '注意事项',
    '坑点',
  ]);
}

function extractExtensions(content: string): string {
  return extractSection(content, [
    '举一反三',
    '拓展',
    '延伸',
    '进阶',
  ]);
}

function extractTips(content: string): string {
  return extractSection(content, [
    '面试技巧',
    '面试要点',
    '面试',
  ]);
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

  // Pattern 1: "优雅的解决方案" or "解决方案"
  const solutionPatterns = [
    /## [\p{Emoji_Presentation}\p{Emoji}\u{1F300}-\u{1F9FF}]*\s*优雅的解决方案[\s\S]*?(?=\n## |$)/iu,
    /## 解决方案[\s\S]*?(?=\n## |$)/i,
    /## [\p{Emoji_Presentation}\p{Emoji}\u{1F300}-\u{1F9FF}]*\s*解决方案[\s\S]*?(?=\n## |$)/iu,
  ];

  for (const pattern of solutionPatterns) {
    const match = content.match(pattern);
    if (match) {
      const codeBlocks = extractCodeBlocks(match[0]);
      const explanation = match[0]
        .replace(/```[\s\S]*?```/g, '')
        .replace(/^##\s*.+$/m, '')
        .trim();

      if (codeBlocks.length > 0) {
        solutions.push({
          title: '题解',
          explanation,
          codeBlocks
        });
        break;
      }
    }
  }

  // Also check for "暴力解法" and "优化解法" sections
  const bruteMatch = content.match(/## (?:最直观的解法|暴力解法)[：:\s\S]*?(?=\n## |$)/i);
  if (bruteMatch) {
    const codeBlocks = extractCodeBlocks(bruteMatch[0]);
    if (codeBlocks.length > 0) {
      solutions.push({
        title: '暴力解法',
        explanation: bruteMatch[0].replace(/```[\s\S]*?```/g, '').replace(/^##\s*.+$/m, '').trim(),
        codeBlocks
      });
    }
  }

  const optimizedMatch = content.match(/## 优化解法[：:\s\S]*?(?=\n## |$)/i);
  if (optimizedMatch) {
    const codeBlocks = extractCodeBlocks(optimizedMatch[0]);
    if (codeBlocks.length > 0) {
      solutions.push({
        title: '优化解法',
        explanation: optimizedMatch[0].replace(/```[\s\S]*?```/g, '').replace(/^##\s*.+$/m, '').trim(),
        codeBlocks
      });
    }
  }

  // If no solutions found, extract all code blocks
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
    difficulty: 'unknown',
    categoryId,
    order: parseInt(fileOrder, 10),
    slug: slugify(titleFromFilename),
    description: extractDescription(content),
    lifeScenario: extractLifeScenario(content),
    thoughtProcess: extractThoughtProcess(content),
    codeExplanation: extractCodeExplanation(content),
    pitfalls: extractPitfalls(content),
    extensions: extractExtensions(content),
    tips: extractTips(content),
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

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const dirs = fs.readdirSync(CONTENT_DIR)
    .filter(d => {
      const stat = fs.statSync(path.join(CONTENT_DIR, d));
      return stat.isDirectory() && /^\d+-/.test(d) && d !== '1-目录';
    })
    .sort();

  console.log(`Found ${dirs.length} category directories:`, dirs);

  const categories: Category[] = [];
  const allProblems: Problem[] = [];

  for (const dir of dirs) {
    const result = parseCategory(path.join(CONTENT_DIR, dir));
    if (result) {
      categories.push(result.category);
      allProblems.push(...result.problems);
      console.log(`Parsed ${result.category.name}: ${result.problems.length} problems`);
    }
  }

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
