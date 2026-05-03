# Phase 4: 链表可视化与高级动画 - Context

**Gathered:** 2026-05-03
**Status:** Ready for planning

<domain>
## Phase Boundary

实现链表可视化器，完成链表类算法动画，支持自定义输入和代码同步。

**Requirements:** VIZ-02 (链表可视化), VIZ-04 (自定义输入), VIZ-05 (代码同步)

**Out of scope:** 树结构可视化 (v2)、图结构可视化 (v2)、搜索筛选收藏 (Phase 5)、暗色模式 (Phase 5)

</domain>

<decisions>
## Implementation Decisions

### 链表布局样式
- **D-01:** 采用水平布局，节点从左到右排列，与数组可视化风格保持一致
- **D-02:** 环形链表使用虚线回环箭头展示环结构，从尾节点指向环入口节点
- **D-03:** 节点采用"值+指针分栏"设计，左半部分显示节点值，右半部分显示 next 指针箭头
- **D-04:** 指针标注在节点上方显示，类似数组的 PointerArrow 组件，支持 slow、fast、prev、curr 等指针名称

### 代码同步高亮
- **D-05:** 当前执行行使用背景色高亮，随动画步骤自动滚动到对应行
- **D-06:** 代码与动画采用上下布局：上方显示代码，下方显示动画
- **D-07:** 步骤描述文字在动画下方显示，如"快指针移动到节点 2"
- **D-08:** 需要扩展 AnimationSnapshot 类型，添加 codeLine 字段

### 自定义输入交互
- **D-09:** 链表输入采用文本框逗号分隔格式，如 `1,2,3,4,5`
- **D-10:** 带环链表输入：最后一个值表示环入口节点值，如 `1,2,3,4,2`
- **D-11:** 提供 3-5 个预设测试用例，用户可一键加载典型场景
- **D-12:** 输入验证错误在输入框下方显示红色提示，禁用运行按钮

### 首批链表算法
- **D-13:** 首批实现 4 道基础指针操作题目：
  - 0206-反转链表（迭代法）
  - 0141-环形链表检测（快慢指针）
  - 0021-合并两个有序链表（双指针）
  - 0019-删除链表的倒数第N个结点（快慢指针）

### Claude's Discretion
- 链表节点的具体样式（大小、间距、圆角、颜色）
- 指针箭头的具体样式和颜色
- 代码高亮的过渡动画效果
- 输入组件的具体布局和样式
- 节点数量上限的验证规则

</decisions>

<specifics>
## Specific Ideas

- 链表可视化风格与现有数组可视化保持一致
- 节点上方指针标签与数组 PointerArrow 组件复用相同设计
- 代码+动画上下布局类似 IDE 调试器体验
- 步骤描述文字帮助用户理解每一步操作

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 现有可视化架构
- `leetcode-hot100-viz/src/lib/visualization/types.ts` — AnimationSnapshot、AnimationState 类型定义
- `leetcode-hot100-viz/src/hooks/useAnimationPlayer.ts` — 动画播放器 Hook
- `leetcode-hot100-viz/src/components/visualization/` — 数组可视化组件实现

### 需求规格
- `.planning/REQUIREMENTS.md` — VIZ-02, VIZ-04, VIZ-05 详细需求
- `.planning/ROADMAP.md` — Phase 4 详细计划（P4-01 至 P4-04）

### 先前阶段决策
- `.planning/phases/03-animation-engine-array-viz/03-CONTEXT.md` — 动画引擎决策，Framer Motion 使用方式

### 链表题目内容
- `7-链表/2-0206-反转链表.md` — 反转链表算法说明
- `7-链表/4-0141-环形链表.md` — 环形链表检测算法说明

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useAnimationPlayer` Hook — 可直接复用于链表动画播放控制
- `PlaybackControls` 组件 — 可直接复用，提供播放/暂停/步进/速度控制
- `PointerArrow` 组件 — 可复用设计模式，用于链表指针标注
- `AnimationSnapshot` 类型 — 需要扩展支持链表快照和 codeLine 字段

### Established Patterns
- Framer Motion (`motion` package) 用于动画实现
- `useReducer` 用于状态管理
- Generator 函数用于算法执行器
- 组件组合模式：Visualizer + PlaybackControls

### Integration Points
- `VisualizationSection.tsx` — 需要扩展支持链表执行器
- `CodeViewer.tsx` — 需要扩展支持行高亮
- `/problems/[id]/ProblemPageClient.tsx` — 需要调整代码+动画布局

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 04-linked-list-viz-advanced-animation*
*Context gathered: 2026-05-03*
