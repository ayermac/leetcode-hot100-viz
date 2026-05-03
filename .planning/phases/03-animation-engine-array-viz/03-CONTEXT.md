# Phase 3: 动画引擎与数组可视化 - Context

**Gathered:** 2026-05-03
**Status:** Ready for planning

<domain>
## Phase Boundary

建立动画状态机基础设施，实现数组可视化器，完成首批数组类算法的动画演示。

**Requirements:** VIZ-01 (数组可视化展示), VIZ-03 (动画控制)

**Out of scope:** 链表可视化 (Phase 4)、自定义输入 (Phase 4)、代码同步高亮 (Phase 4)、搜索筛选收藏 (Phase 5)

</domain>

<decisions>
## Implementation Decisions

### 动画库选择
- **D-01:** 使用 Framer Motion 实现数组元素动画效果
- **D-02:** 利用 Framer Motion 的 `layoutId` 实现元素位置变化的平滑过渡
- **D-03:** 元素状态变化使用 `AnimatePresence` 和 `motion` 组件

### 动画快照存储
- **D-04:** 采用完整快照模式存储每一步状态
- **D-05:** 每个快照包含：步骤索引、描述文字、数组完整状态、指针位置、元素状态映射
- **D-06:** 支持无限撤销/重做，适合教育场景

### 播放器集成
- **D-07:** 动画播放器内嵌在题目详情页，位于代码区域下方或右侧
- **D-08:** 不创建独立的可视化页面，保持简单路由结构
- **D-09:** 播放器可通过 Tab 切换显示/隐藏

### 数组元素状态
- **D-10:** 支持 3 种基础元素状态：
  - `normal` - 默认状态（灰色或默认色）
  - `comparing` - 比较中（蓝色高亮）
  - `swapping` - 交换中（橙色高亮）
- **D-11:** 状态通过 CSS 类或 Framer Motion 的 `variants` 实现

### 指针标注
- **D-12:** 指针在数组元素上方显示，使用箭头 + 标签形式
- **D-13:** 支持常见指针名：left, right, i, j, mid
- **D-14:** 指针位置变化有平滑过渡动画

### 播放控制
- **D-15:** 提供速度档位：0.5x, 1x, 2x
- **D-16:** 播放控制按钮：播放/暂停、单步前进、单步后退、重置
- **D-17:** 进度条可拖拽跳转到任意步骤

### 首批算法
- **D-18:** 实现 3-5 道核心数组题目动画：
  - Two Sum (哈希表)
  - Move Zeroes (双指针)
  - Container With Most Water (双指针)
  - 3Sum (双指针)
  - Trapping Rain Water (栈/双指针) - 可选
- **D-19:** 每道题目选择一个代表性解法实现动画

### 代码同步
- **D-20:** Phase 3 不实现代码高亮同步，纯动画演示
- **D-21:** 代码同步留到 Phase 4 和链表可视化一起实现

### Claude's Discretion
- AnimationSnapshot 接口的具体字段设计
- 播放控制器的 Hook 返回值结构
- 数组元素组件的详细样式（大小、间距、圆角）
- 指针箭头的具体样式和颜色
- 进度条的具体实现方式

</decisions>

<specifics>
## Specific Ideas

- 动画播放器类似于视频播放器的控制条设计
- 数组元素显示为方块，带索引编号
- 指针变化时，箭头平滑移动到新位置
- 每一步都有描述文字说明当前操作

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 技术栈与架构
- `.planning/research/STACK.md` — Framer Motion 配置和最佳实践
- `.planning/research/ARCHITECTURE.md` — 组件结构设计

### 现有代码参考
- `leetcode-hot100-viz/src/lib/data/types.ts` — Problem, Solution 接口定义
- `leetcode-hot100-viz/src/components/CodeViewer.tsx` — 已有代码展示组件
- `leetcode-hot100-viz/src/app/problems/[id]/page.tsx` — 题目详情页结构

### 需求规格
- `.planning/REQUIREMENTS.md` — VIZ-01, VIZ-03 详细需求
- `.planning/ROADMAP.md` — Phase 3 详细计划（P3-01 至 P3-04）

### 先前阶段决策
- `.planning/phases/01-project-init-content-pipeline/01-CONTEXT.md` — 项目结构决策
- `.planning/phases/02-problem-detail-code-view/02-CONTEXT.md` — 代码展示决策

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CodeViewer` — 已有代码展示组件，可扩展支持行高亮（Phase 4）
- `Tabs` 组件 — 可用于播放器区域的显示/隐藏切换
- `Button` 组件 — 用于播放控制按钮
- `useLanguagePreference` Hook — 可参考其状态管理模式

### Established Patterns
- Next.js App Router + RSC — 服务端渲染
- Tailwind CSS 4 — 样式
- Framer Motion — 已在依赖中（Phase 1 安装）

### Integration Points
- `/problems/[id]` 页面添加动画播放器区域
- 数据流：算法执行器生成快照数组 → 播放器 Hook 管理状态 → ArrayVisualizer 渲染当前快照

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 03-animation-engine-array-viz*
*Context gathered: 2026-05-03*