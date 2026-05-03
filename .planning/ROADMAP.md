# Roadmap: LeetCode Hot 100 可视化学习平台

**Project Code:** LCVIZ
**Created:** 2026-04-30
**Mode:** yolo (auto-approve)
**Granularity:** standard

---

## Overview

本路线图将 LeetCode Hot 100 可视化学习平台开发划分为 5 个阶段，每个阶段产出可验证的增量价值。

```
Phase 1: 项目初始化与内容管道
    ↓
Phase 2: 问题展示与代码浏览
    ↓
Phase 3: 动画引擎与数组可视化
    ↓
Phase 4: 链表可视化与高级动画
    ↓
Phase 5: 用户体验增强
```

---

## Phase 1: 项目初始化与内容管道 ✅

**Goal:** 建立项目基础架构，完成 markdown 内容到结构化数据的转换管道，实现基础路由和页面骨架。

**Requirements:** STRUCT-01, STRUCT-02

**Duration Estimate:** 2-3 days

**Status:** ✅ COMPLETE (2026-04-30)

### Plans

#### P1-01: 项目初始化 ✅

**Goal:** 创建 Next.js 项目，配置静态导出和开发环境。

**Status:** ✅ COMPLETE

**Tasks:**
- [x] 初始化 Next.js 15 项目 (`npx create-next-app@latest`)
- [x] 配置 `next.config.ts` 启用静态导出 (`output: 'export'`)
- [x] 安装核心依赖：Tailwind CSS 4、shadcn/ui、Lucide Icons
- [x] 配置 Tailwind CSS（主题色、字体）
- [x] 设置 shadcn/ui 基础组件（Button、Card、Badge）
- [x] 创建基础目录结构

**Directory Structure:**
```
leetcode-hot100-viz/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   └── problems/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   │   └── data/
│   └── styles/
├── data/                    # 生成的 JSON 数据
├── content/                 # 原始 markdown 内容
└── scripts/                 # 解析脚本
```

**Success Criteria:**
- [ ] `pnpm dev` 启动开发服务器，访问 localhost:3000 显示首页
- [ ] `pnpm build` 成功生成静态文件到 `out/` 目录
- [ ] Tailwind 类名正常工作

#### P1-02: 内容解析管道

**Goal:** 创建脚本将现有 markdown 文件解析为结构化 JSON 数据。

**Tasks:**
- [ ] 分析现有 markdown 文件结构（标题、代码块、章节）
- [ ] 设计数据 Schema（Category、Problem、Solution）
- [ ] 创建解析脚本 `scripts/parse-content.ts`
- [ ] 提取题目信息（编号、名称、难度、分类）
- [ ] 提取代码块（按语言分类）
- [ ] 生成 `data/categories.json` 和 `data/problems.json`
- [ ] 添加验证脚本确保数据完整性

**Data Schema:**
```typescript
interface Category {
  id: string;           // "hash", "two-pointers"
  name: string;         // "哈希", "双指针"
  slug: string;         // URL slug
  order: number;        // 显示顺序
  problemCount: number;
  description: string;
}

interface Problem {
  id: string;           // "0001", "0283"
  title: string;        // "两数之和"
  leetcodeId: number;   // 1, 283
  difficulty: 'easy' | 'medium' | 'hard';
  categoryId: string;
  description: string;
  solutions: Solution[];
}

interface Solution {
  language: 'go' | 'python' | 'java';
  code: string;
  explanation?: string;
}
```

**Success Criteria:**
- [x] `npm run parse` 命令成功执行
- [x] 生成 `data/categories.json` 包含 16 个分类
- [x] 生成 `data/problems.json` 包含 100 道题目
- [x] 每道题目至少有一个 Go 语言代码块 (100%)

#### P1-03: 分类列表页 ✅

**Goal:** 实现分类浏览页面，展示 16 个算法分类。

**Status:** ✅ COMPLETE

**Tasks:**
- [x] 创建分类数据读取函数 `getCategories()`
- [x] 设计分类卡片组件 `CategoryCard`
- [x] 实现分类网格布局（响应式）
- [x] 添加分类图标（使用 Lucide Icons）
- [x] 显示每个分类的题目数量

**Success Criteria:**
- [x] `/` 首页显示 16 个分类卡片
- [x] `/categories` 页面显示 16 个分类卡片
- [x] 每个卡片显示分类名称、图标、题目数量
- [x] 点击卡片跳转到对应分类的题目列表

#### P1-04: 题目列表页 ✅

**Goal:** 实现题目列表页面，支持按分类浏览。

**Status:** ✅ COMPLETE

**Tasks:**
- [x] 创建题目数据读取函数 `getProblemsByCategory(categoryId)`
- [x] 设计题目列表项组件 `ProblemListItem`
- [x] 实现题目列表布局
- [x] 显示题目编号、名称、难度标签
- [x] 添加难度颜色标识（简单-绿、中等-黄、困难-红）

**Success Criteria:**
- [x] `/categories/[slug]` 显示该分类下的所有题目
- [x] 题目按编号排序
- [x] 难度标签颜色正确
- [x] 点击题目跳转到详情页（占位页）

**Verification:** [VERIFICATION.md](phases/01-project-init-content-pipeline/VERIFICATION.md)

**Dependencies:** None (first phase)

---

## Phase 2: 问题展示与代码浏览

**Goal:** 实现题目详情页，包含问题描述、难度标签、多语言代码展示和语法高亮。

**Requirements:** STRUCT-03, STRUCT-04, STRUCT-05

**Duration Estimate:** 2-3 days

### Plans

#### P2-01: 题目详情页骨架

**Goal:** 创建题目详情页基础结构。

**Tasks:**
- [ ] 创建题目数据读取函数 `getProblem(id)`
- [ ] 设计详情页布局（左侧描述、右侧代码）
- [ ] 创建题目头部组件（标题、难度、标签）
- [ ] 实现题目描述展示（Markdown 渲染）
- [ ] 添加 LeetCode 原题链接

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Header: 面包屑导航                               │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────┐ ┌───────────────────────┐│
│ │ 题目信息            │ │ 代码区域              ││
│ │ - 标题              │ │ - 语言切换            ││
│ │ - 难度标签          │ │ - 代码块              ││
│ │ - 算法标签          │ │ - 复制按钮            ││
│ │ - 描述              │ │                       ││
│ │                     │ │                       ││
│ └─────────────────────┘ └───────────────────────┘│
└─────────────────────────────────────────────────┘
```

**Success Criteria:**
- [ ] `/problems/[id]` 显示题目详情
- [ ] 面包屑导航正确
- [ ] LeetCode 链接可点击跳转

#### P2-02: Markdown 渲染

**Goal:** 实现题目描述的 Markdown 渲染。

**Tasks:**
- [ ] 安装 `next-mdx-remote` 或 `react-markdown`
- [ ] 配置 Markdown 渲染器
- [ ] 支持代码块语法高亮
- [ ] 支持表格、列表等常见格式
- [ ] 添加自定义样式

**Success Criteria:**
- [ ] 题目描述正确渲染 Markdown 格式
- [ ] 代码块有语法高亮
- [ ] 链接可点击

#### P2-03: 代码查看器

**Goal:** 实现代码展示组件，支持语法高亮。

**Tasks:**
- [ ] 安装 Shiki (`pnpm add shiki`)
- [ ] 创建 `CodeViewer` 组件
- [ ] 配置 Shiki 主题（支持亮色/暗色）
- [ ] 实现代码高亮渲染
- [ ] 添加行号显示
- [ ] 添加复制代码按钮

**Success Criteria:**
- [ ] 代码正确显示语法高亮
- [ ] 行号显示正确
- [ ] 复制按钮工作正常
- [ ] 主题跟随系统/用户设置

#### P2-04: 语言切换

**Goal:** 实现代码语言切换功能。

**Tasks:**
- [ ] 创建语言选择器组件 `LanguageSelector`
- [ ] 支持 Go、Python、Java 三种语言
- [ ] 切换时保持滚动位置
- [ ] 记住用户偏好（localStorage）
- [ ] 处理语言不存在的情况（显示提示）

**Success Criteria:**
- [ ] 语言选择器显示三种语言选项
- [ ] 切换语言后代码正确更新
- [ ] 刷新页面后保持语言选择
- [ ] 如果题目没有某语言代码，显示提示

**Dependencies:** Phase 1 complete

---

## Phase 3: 动画引擎与数组可视化

**Goal:** 建立动画状态机基础设施，实现数组可视化器，完成首批数组类算法的动画演示。

**Requirements:** VIZ-01, VIZ-03

**Duration Estimate:** 4-5 days

### Plans

#### P3-01: 动画状态机

**Goal:** 设计并实现动画播放的核心状态管理。

**Tasks:**
- [ ] 定义动画快照数据结构 `AnimationSnapshot`
- [ ] 创建动画状态 Hook `useAnimationPlayer`
- [ ] 实现播放控制逻辑（播放、暂停、步进、重置）
- [ ] 实现速度控制（0.25x, 0.5x, 1x, 2x）
- [ ] 创建 `AnimationController` 上下文

**Data Structures:**
```typescript
interface AnimationSnapshot {
  step: number;
  description: string;
  codeLine: number;
  data: Record<string, unknown>;
}

interface AnimationState {
  snapshots: AnimationSnapshot[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number;
}

interface AnimationControls {
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  goTo: (index: number) => void;
}
```

**Success Criteria:**
- [ ] Hook 提供完整的播放控制 API
- [ ] 速度切换平滑无卡顿
- [ ] 步进操作立即响应

#### P3-02: 播放控制 UI

**Goal:** 创建动画播放控制器组件。

**Tasks:**
- [ ] 设计播放控制器 UI `PlaybackControls`
- [ ] 实现播放/暂停按钮
- [ ] 实现前进/后退步进按钮
- [ ] 实现重置按钮
- [ ] 实现速度选择器
- [ ] 实现进度条（可拖拽）

**UI Layout:**
```
┌──────────────────────────────────────────────┐
│ [◀◀] [◀] [▶/⏸] [▶] [▶▶]  速度: [1x ▼]      │
│ ────────────●────────────────────  步骤 3/10 │
└──────────────────────────────────────────────┘
```

**Success Criteria:**
- [ ] 所有控制按钮功能正确
- [ ] 进度条可拖拽跳转
- [ ] 显示当前步骤/总步骤

#### P3-03: 数组可视化器

**Goal:** 实现数组数据结构的可视化展示。

**Tasks:**
- [ ] 设计数组元素组件 `ArrayElement`
- [ ] 实现数组容器 `ArrayVisualizer`
- [ ] 支持元素状态颜色（正常、比较中、交换中、已排序、pivot）
- [ ] 支持指针箭头标注
- [ ] 支持索引显示
- [ ] 添加元素值动画过渡

**Visual Design:**
```
索引:   0    1    2    3    4
      ┌───┐┌───┐┌───┐┌───┐┌───┐
      │ 2 ││ 7 ││ 11││ 15││ 0 │
      └───┘└───┘└───┘└───┘└───┘
        ↑           ↑
       left       right
```

**Success Criteria:**
- [ ] 数组元素正确显示值和索引
- [ ] 状态颜色正确应用
- [ ] 指针箭头位置正确
- [ ] 元素变化有平滑过渡

#### P3-04: 数组算法执行器

**Goal:** 实现数组类算法的快照生成器。

**Tasks:**
- [ ] 设计算法执行器接口 `AlgorithmExecutor`
- [ ] 实现 Two Sum 算法执行器
- [ ] 实现 Move Zeroes 算法执行器
- [ ] 实现盛最多水的容器执行器
- [ ] 每步生成描述文字

**Executor Interface:**
```typescript
interface AlgorithmExecutor<TInput, TSnapshots> {
  execute(input: TInput): AnimationSnapshot[];
  getDefaultInput(): TInput;
  validateInput(input: unknown): input is TInput;
}
```

**Success Criteria:**
- [ ] Two Sum 执行器生成正确快照序列
- [ ] Move Zeroes 执行器生成正确快照序列
- [ ] 快照描述清晰易懂

**Dependencies:** Phase 2 complete

---

## Phase 4: 链表可视化与高级动画

**Goal:** 实现链表可视化器，完成链表类算法动画，支持自定义输入和代码同步。

**Requirements:** VIZ-02, VIZ-04, VIZ-05

**Duration Estimate:** 4-5 days

### Plans

#### P4-01: 链表可视化器

**Goal:** 实现链表数据结构的可视化展示。

**Tasks:**
- [ ] 设计链表节点组件 `ListNode`
- [ ] 实现链表容器 `LinkedListVisualizer`
- [ ] 使用 Framer Motion 实现节点动画
- [ ] 支持节点状态（正常、访问中、高亮）
- [ ] 支持慢快指针标注
- [ ] 支持循环链表展示

**Visual Design:**
```
┌───┐    ┌───┐    ┌───┐    ┌───┐
│ 1 │───→│ 2 │───→│ 3 │───→│ 4 │───→ NULL
└───┘    └───┘    └───┘    └───┘
  ↑                 ↑
 slow             fast
```

**Success Criteria:**
- [ ] 链表节点正确连接
- [ ] 指针标注位置正确
- [ ] 节点移动动画流畅
- [ ] 循环链表正确展示环

#### P4-02: 链表算法执行器

**Goal:** 实现链表类算法的快照生成器。

**Tasks:**
- [ ] 实现反转链表执行器
- [ ] 实现环形链表检测执行器
- [ ] 实现回文链表执行器
- [ ] 实现合并两个有序链表执行器

**Success Criteria:**
- [ ] 反转链表执行器正确展示指针移动
- [ ] 环形链表执行器正确展示快慢指针相遇
- [ ] 每步描述清晰

#### P4-03: 自定义输入

**Goal:** 允许用户修改算法输入数据。

**Tasks:**
- [ ] 设计输入编辑器组件 `InputEditor`
- [ ] 数组输入：文本框，逗号分隔
- [ ] 链表输入：文本框，逗号分隔（自动构建链表）
- [ ] 预设测试用例选择器
- [ ] 输入验证和错误提示
- [ ] 重新运行按钮

**Success Criteria:**
- [ ] 用户可输入自定义数组数据
- [ ] 用户可输入自定义链表数据
- [ ] 预设用例一键加载
- [ ] 无效输入显示错误提示

#### P4-04: 代码同步高亮

**Goal:** 动画执行时同步高亮代码行。

**Tasks:**
- [ ] 增强 `CodeViewer` 支持行高亮
- [ ] 根据快照 `codeLine` 高亮当前行
- [ ] 高亮动画过渡效果
- [ ] 显示当前步骤描述

**Success Criteria:**
- [ ] 当前执行行高亮显示
- [ ] 步骤描述实时更新
- [ ] 高亮切换平滑

**Dependencies:** Phase 3 complete

---

## Phase 5: 用户体验增强

**Goal:** 完善用户体验，包括搜索、筛选、收藏、主题切换和响应式设计。

**Requirements:** UX-01, UX-02, UX-03, UX-04, UX-05

**Duration Estimate:** 3-4 days

### Plans

#### P5-01: 搜索功能

**Goal:** 实现题目搜索功能。

**Tasks:**
- [ ] 创建搜索组件 `SearchBar`
- [ ] 实现搜索 Hook `useProblemSearch`
- [ ] 支持按题目名称搜索
- [ ] 支持模糊匹配
- [ ] 实时显示搜索结果
- [ ] 搜索结果高亮匹配文本

**Success Criteria:**
- [ ] 输入时实时显示匹配结果
- [ ] 模糊匹配工作正常
- [ ] 无结果时显示提示

#### P5-02: 筛选系统

**Goal:** 实现多维度筛选功能。

**Tasks:**
- [ ] 创建筛选组件 `FilterPanel`
- [ ] 按难度筛选（简单/中等/困难）
- [ ] 按分类筛选
- [ ] 按收藏状态筛选
- [ ] URL 参数同步（可分享筛选结果）

**Success Criteria:**
- [ ] 筛选条件正确过滤题目列表
- [ ] 多个筛选条件可组合使用
- [ ] 筛选状态可通过 URL 分享

#### P5-03: 收藏功能

**Goal:** 实现题目收藏功能。

**Tasks:**
- [ ] 创建收藏 Hook `useBookmarks`
- [ ] 收藏按钮组件 `BookmarkButton`
- [ ] 收藏列表页面
- [ ] localStorage 持久化
- [ ] 收藏状态同步

**Success Criteria:**
- [ ] 点击收藏按钮切换收藏状态
- [ ] 刷新页面后收藏状态保留
- [ ] 收藏列表显示所有收藏题目

#### P5-04: 暗色模式

**Goal:** 实现亮色/暗色主题切换。

**Tasks:**
- [ ] 配置 Tailwind CSS 暗色模式
- [ ] 创建主题切换 Hook `useTheme`
- [ ] 主题切换按钮 `ThemeToggle`
- [ ] 记住用户偏好（localStorage）
- [ ] 代码高亮主题切换
- [ ] 可视化组件适配暗色模式

**Success Criteria:**
- [ ] 点击切换按钮切换主题
- [ ] 所有组件正确显示两种主题
- [ ] 刷新页面后保持主题设置
- [ ] 代码高亮跟随主题

#### P5-05: 响应式设计

**Goal:** 确保网站在各种设备上可用。

**Tasks:**
- [ ] 移动端导航（汉堡菜单）
- [ ] 详情页响应式布局（移动端垂直堆叠）
- [ ] 可视化器触摸手势支持
- [ ] 测试关键断点（375、768、1024、1440px）

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Success Criteria:**
- [ ] 移动端可正常浏览题目
- [ ] 可视化器在移动端可操作
- [ ] 无水平滚动条

**Dependencies:** Phase 4 complete

---

## Summary

| Phase | Focus | Requirements | Duration | Status |
|-------|-------|--------------|----------|--------|
| 1 | 项目初始化与内容管道 | STRUCT-01, STRUCT-02 | 2-3 days | ✅ COMPLETE |
| 2 | 问题展示与代码浏览 | STRUCT-03, STRUCT-04, STRUCT-05 | 2-3 days | Pending |
| 3 | 动画引擎与数组可视化 | VIZ-01, VIZ-03 | 4-5 days | Pending |
| 4 | 链表可视化与高级动画 | VIZ-02, VIZ-04, VIZ-05 | 4-5 days | Pending |
| 5 | 用户体验增强 | UX-01 ~ UX-05 | 3-4 days | Pending |

**Total Estimated Duration:** 15-20 days

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Markdown 解析复杂 | 先处理简单格式，复杂格式手动调整 |
| 动画性能问题 | 使用 Framer Motion 的 `layoutId` 优化 |
| 链表自动布局混乱 | 禁用自动重排，固定节点位置 |
| 静态导出失败 | 从 Phase 1 就使用 `output: 'export'` |

---

*Roadmap created: 2026-04-30*
