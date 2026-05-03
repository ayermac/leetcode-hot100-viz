# Phase 1: 项目初始化与内容管道 - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning

<domain>
## Phase Boundary

建立项目基础架构，完成 markdown 内容到结构化数据的转换管道，实现基础路由和页面骨架。

**Requirements:** STRUCT-01 (分类列表页), STRUCT-02 (题目列表页)

**Out of scope:** 题目详情页 (Phase 2)、动画可视化 (Phase 3-4)、用户体验增强 (Phase 5)

</domain>

<decisions>
## Implementation Decisions

### 项目位置与结构
- **D-01:** 创建独立子目录 `leetcode-hot100-viz/` 作为 Next.js 项目根目录
- **D-02:** 现有 markdown 内容保持不变，仅作为数据源被解析脚本读取
- **D-03:** 生成的 JSON 数据存放在 `leetcode-hot100-viz/data/` 目录

### 内容解析策略
- **D-04:** 使用一次性脚本解析现有 markdown 文件，生成静态 JSON 数据
- **D-05:** 解析粒度：完整提取标题、难度、分类、代码块、问题描述、解法说明
- **D-06:** 难度信息：默认标记为"未知"，后续手动补充（markdown 中无显式难度标签）
- **D-07:** 代码块处理：按解法标题分组（如"暴力解法"、"优化解法"），每个解法保留对应代码块
- **D-08:** 分类映射：创建目录名到分类 ID 的映射表（如 "2-哈希" → "hash"）

### 分类列表页设计
- **D-09:** 分类图标使用 Lucide Icons 图标库（快速实现，风格统一）
- **D-10:** 图标映射示例：Hash → HashIcon, TwoPointers → GitBranchIcon, LinkedList → Link2Icon

### Claude's Discretion
- 解析脚本的具体实现（正则表达式、错误处理）
- JSON Schema 的详细结构设计
- 分类卡片的视觉设计（布局、间距、颜色）
- 目录名到分类 ID 的完整映射表
- Lucide Icons 到分类的具体映射

</decisions>

<specifics>
## Specific Ideas

- 现有 markdown 文件格式一致：生活场景 → 问题描述 → 暴力解法 → 优化解法 → 代码对比
- 代码块带语言标识符（```go, ```python, ```java）
- 分类目录命名格式：`{序号}-{中文名}`（如 `2-哈希`, `7-链表`）

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 项目范围与需求
- `.planning/PROJECT.md` — 项目愿景、核心价值、技术栈选择
- `.planning/REQUIREMENTS.md` — MVP 需求列表，Phase 1 对应 STRUCT-01、STRUCT-02
- `.planning/ROADMAP.md` — Phase 1 详细计划（P1-01 至 P1-04）
- `.planning/research/SUMMARY.md` — 技术栈推荐和关键陷阱

### 技术决策
- `.planning/research/STACK.md` — Next.js 15、Tailwind CSS 4、shadcn/ui、Shiki 等技术选型理由
- `.planning/research/ARCHITECTURE.md` — 数据流架构、组件结构设计

### 现有内容结构
- `2-哈希/` 至 `17-技巧/` — 17 个分类目录，每个包含多个 markdown 文件
- `README.md` — 项目说明文档

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 无现有项目代码，需从零初始化 Next.js 项目

### Content Assets (Raw Material)
- 17 个分类目录，包含约 100 道 LeetCode Hot 100 题目
- Markdown 文件格式一致，便于解析：
  - 标题：`# 从{场景}到{题目名}：{副标题}`
  - 章节：`## 问题描述`、`## 最直观的解法`、`## 优化解法`、`## 解法比较`
  - 代码块：带语言标识符（go、python、java）

### Integration Points
- 解析脚本读取现有 markdown 内容
- 生成的 JSON 供 Next.js 页面组件使用
- 数据流：markdown → 解析脚本 → JSON → Next.js SSG → 静态页面

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 01-project-init-content-pipeline*
*Context gathered: 2026-04-30*
