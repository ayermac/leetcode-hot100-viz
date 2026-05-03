# PROJECT: LeetCode Hot 100 可视化学习平台

**Code:** `LCVIZ`
**Status:** Planning
**Created:** 2026-04-30

---

## What This Is

一个将 LeetCode Hot 100 题解转换为交互式可视化学习平台的 Web 应用。用户可以：

- **浏览题目**: 按 17 个算法分类自由浏览 100 道经典题目
- **可视化学习**: 通过动画演示理解算法执行过程
- **交互操作**: 控制动画速度、步进执行、修改输入数据
- **代码参考**: 查看多语言题解（Go、Python、Java 等）

### Core Value

**让抽象的算法变得可见、可交互、可理解。**

这不是一个在线编程平台，而是一个帮助理解算法"如何工作"的可视化工具。

---

## Context

### Background

项目作者已有 LeetCode Hot 100 的完整题解文档（17 个分类，包含 Go/Java 代码示例），存储在 markdown 文件中。希望通过 Web 可视化让学习更加直观。

### Motivation

- 算法学习难点在于理解"过程"，不仅仅是"结果"
- 静态文档难以展示动态的算法执行过程
- 可视化能帮助建立直觉，加深理解

### Success Indicators

- 用户能在 5 分钟内理解一道算法的核心思想
- 可视化动画能正确展示算法执行过程
- 网站能静态部署，无需服务器
- 代码和内容易于维护和扩展

---

## Requirements

### Validated

(None yet — ship to validate)

### Active

#### MVP - 基础结构

- [ ] **STRUCT-01**: 用户可以查看 17 个算法分类列表
- [ ] **STRUCT-02**: 用户可以浏览每个分类下的题目列表
- [ ] **STRUCT-03**: 用户可以查看题目详情页（题目描述、难度、标签）
- [ ] **STRUCT-04**: 用户可以查看题目对应的题解代码
- [ ] **STRUCT-05**: 用户可以切换代码语言（Go、Python、Java）

#### MVP - 核心可视化

- [ ] **VIZ-01**: 用户可以查看数组的可视化展示（元素、索引、状态）
- [ ] **VIZ-02**: 用户可以查看链表的可视化展示（节点、指针、连接）
- [ ] **VIZ-03**: 用户可以控制动画播放（播放、暂停、步进、速度）
- [ ] **VIZ-04**: 用户可以修改输入数据，观察算法行为变化

#### MVP - 用户体验

- [ ] **UX-01**: 用户可以搜索题目（按名称、标签）
- [ ] **UX-02**: 用户可以筛选题目（按难度、分类、状态）
- [ ] **UX-03**: 用户可以收藏题目（本地存储）
- [ ] **UX-04**: 用户可以切换暗色/亮色模式
- [ ] **UX-05**: 网站响应式设计，支持移动端浏览

### Out of Scope

- 在线编码/运行代码 — 链接到 LeetCode 原站
- 用户账户系统 — 仅本地存储
- 学习进度追踪 — 后续版本
- 笔记功能 — 后续版本
- 后端服务 — 纯静态部署

---

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js + 静态导出 | 作者后端背景，Next.js 学习曲线平缓，静态部署免费简单 | — Pending |
| 转换现有 markdown | 已有完整题解，避免重复工作 | — Pending |
| 综合型可视化 | 不同算法类型需要不同展示方式 | — Pending |
| 自由浏览模式 | 无需用户系统，降低复杂度 | — Pending |

---

## Constraints

### Technical

- 纯静态部署，无后端服务
- 需要解析现有 markdown 文件结构
- 可视化需要流畅，不能卡顿

### Content

- 17 个算法分类（哈希、双指针、滑动窗口、链表、树、图等）
- 100 道经典题目
- 多语言代码示例

### Timeline

- MVP 目标：基础结构 + 核心可视化 + 用户体验增强
- 后续版本：学习辅助功能

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

*Last updated: 2026-04-30 after initialization*
