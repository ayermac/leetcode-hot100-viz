# Phase 2: 问题展示与代码浏览 - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning

<domain>
## Phase Boundary

实现题目详情页，包含问题描述、难度标签、多语言代码展示和语法高亮。用户可以浏览题目详情、切换代码语言、查看不同解法。

**Requirements:** STRUCT-03 (题目详情页), STRUCT-04 (代码展示), STRUCT-05 (语言切换)

**Out of scope:** 动画可视化 (Phase 3-4)、搜索筛选 (Phase 5)、暗色模式切换 (Phase 5)

</domain>

<decisions>
## Implementation Decisions

### 页面布局
- **D-01:** 左右分栏布局 — 左侧题目描述，右侧代码区域
- **D-02:** 桌面端两栏并排，移动端自动堆叠（响应式）
- **D-03:** 左侧包含：标题、难度标签、问题描述、生活场景
- **D-04:** 右侧包含：语言切换器、解法标签页、代码块、复制按钮

### 解法展示
- **D-05:** 使用 Tabs 组件切换不同解法（暴力解法/优化解法）
- **D-06:** 每个解法标签页包含：解释说明 + 代码块
- **D-07:** 解法标题从 markdown 解析（"暴力解法"、"优化解法"等）

### 代码展示
- **D-08:** 使用 Shiki 进行语法高亮（github-dark 主题）
- **D-09:** 仅暗色主题（Phase 5 实现完整主题切换）
- **D-10:** 显示行号
- **D-11:** 添加复制按钮（右上角，点击后显示「已复制」）

### 语言切换
- **D-12:** 支持三种语言：Go、Python、Java
- **D-13:** 使用 Select 或 Tabs 组件切换语言
- **D-14:** 缺失语言时禁用选项并显示提示「该语言暂无代码」
- **D-15:** Go 代码覆盖率 100%，Python/Java 可能部分缺失

### Markdown 渲染
- **D-16:** 使用 next-mdx-remote 渲染题目描述
- **D-17:** 支持 GitHub Flavored Markdown（表格、列表、链接等）
- **D-18:** 代码块内的代码使用 Shiki 高亮

### 导航增强
- **D-19:** 在题目标题旁添加 LeetCode 原题链接（外链图标）
- **D-20:** 添加面包屑导航：首页 > 分类名 > 题目名
- **D-21:** 面包屑可点击返回上级

### Claude's Discretion
- 代码块样式细节（字体、间距、滚动条）
- 复制按钮的具体实现（navigator.clipboard API）
- 面包屑组件的具体样式
- 空状态处理（无描述、无解法的情况）
- 移动端断点选择（sm/md/lg）

</decisions>

<specifics>
## Specific Ideas

- 左右分栏布局类似于 VS Code 的编辑器布局 — 左侧内容，右侧代码
- 解法标签页切换要流畅，不要整页刷新
- 复制按钮点击后显示「已复制」2 秒后恢复

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 技术栈与架构
- `.planning/research/STACK.md` — Shiki 语法高亮配置、next-mdx-remote 使用方式
- `.planning/research/ARCHITECTURE.md` — Problem 详情页组件结构、数据流设计

### 现有代码参考
- `leetcode-hot100-viz/src/lib/data/types.ts` — Problem、Solution、CodeBlock 接口定义
- `leetcode-hot100-viz/src/lib/data/loader.ts` — getProblemById() 数据读取函数
- `leetcode-hot100-viz/src/components/DifficultyBadge.tsx` — 难度标签组件（已实现）

### 需求规格
- `.planning/REQUIREMENTS.md` — STRUCT-03, STRUCT-04, STRUCT-05 详细需求

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `DifficultyBadge` — 难度标签组件，支持 easy/medium/hard/unknown 四种状态
- `Header` — 导航头部组件，可在其中添加面包屑
- `Problem` 接口 — 已定义完整数据结构，包含 solutions 数组
- `getProblemById()` — 数据加载函数，返回单个题目详情

### Established Patterns
- Next.js App Router — 使用 `generateStaticParams` 生成静态页面
- Tailwind CSS 4 — 使用 Tailwind 类名进行样式
- Lucide Icons — 图标库，外链图标使用 `ExternalLink`

### Integration Points
- `/problems/[id]/page.tsx` — 已有占位页面，需要完整实现
- `data/problems.json` — 数据源，100 道题目
- 每个题目有 solutions 数组，每个 solution 有 codeBlocks 数组

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 02-problem-detail-code-view*
*Context gathered: 2026-05-01*
