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
  thoughtProcess: string; // 思路发展历程
  codeExplanation: string; // 代码详解
  pitfalls: string;     // 易错点剖析
  extensions: string;   // 举一反三
  tips: string;         // 面试技巧
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
