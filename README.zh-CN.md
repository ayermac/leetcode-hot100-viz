# LeetCode Hot 100 Viz

**交互式算法可视化学习平台**

[English](README.md) | 中文

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-2-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Shiki](https://img.shields.io/badge/Shiki-3-1E1E1E?logo=visual-studio-code&logoColor=white)](https://shiki.style/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

通过交互式动画深入理解 LeetCode Hot 100 经典算法。逐步执行、实时观察数据结构变换，建立对核心模式的直觉。

[功能特性](#功能特性) | [快速开始](#快速开始) | [架构](#架构) | [支持的算法](#支持的算法) | [部署](#部署)

---

## 功能特性

- **100 道经典题目** — 涵盖 17 个算法分类（哈希、双指针、滑动窗口、链表、树、图等）
- **算法可视化** — 数组、链表、二叉树、栈、矩阵渲染器，实时状态动画
- **代码同步高亮** — 动画播放时同步高亮当前执行的代码行
- **多语言代码示例** — Go、Python、Java，Shiki 语法高亮
- **自定义输入** — 修改测试输入，观察算法行为变化
- **播放控制** — 播放、暂停、单步执行、速度调节
- **搜索与筛选** — 按名称或编号实时搜索，按难度、分类、收藏多维筛选
- **URL 状态同步** — 筛选和选择状态通过 URL 参数可分享
- **收藏功能** — 收藏题目，localStorage 持久化
- **暗色/亮色主题** — 跟随系统，支持手动切换
- **响应式设计** — 从移动端 (320px) 到桌面端完整支持

## 架构

```
                          ┌───────────────────────────┐
                          │      Next.js App Router    │
                          │     (静态导出 / SPA)       │
                          └─────┬──────────────┬──────┘
                                │              │
                   ┌────────────┘              └────────────┐
                   ▼                                        ▼
          ┌─────────────────┐                    ┌───────────────────┐
          │   页面与布局     │                    │  可视化引擎        │
          │  - 首页 / 浏览   │                    │  - 数组渲染器      │
          │  - 题目详情      │                    │  - 链表渲染器      │
          │  - 分类页        │                    │  - 二叉树渲染器    │
          │  - 收藏页        │                    │  - 栈 / 矩阵      │
          └────────┬────────┘                   └──────┬────────────┘
                   │                                    │
                   ▼                                    ▼
          ┌─────────────────┐                   ┌───────────────────┐
          │  shadcn/ui +     │                   │  执行器引擎        │
          │  Tailwind CSS    │                   │  (算法步骤)        │
          └─────────────────┘                   └───────────────────┘
```

| 层级 | 技术 | 用途 |
|------|------|------|
| 框架 | Next.js 16 (App Router) | 静态导出，基于文件的路由 |
| UI | React 19 | 组件架构 |
| 样式 | Tailwind CSS 4 | 工具类优先的样式方案 |
| 组件 | shadcn/ui | 无障碍组件基础库 |
| 动画 | Framer Motion (Motion) | 数据结构状态过渡 |
| 高亮 | Shiki | 代码查看器语法高亮 |
| 语言 | TypeScript 5 | 端到端类型安全 |

## 快速开始

### 环境要求

- Node.js 18+
- npm（或 pnpm / yarn）

### 安装

```bash
# 克隆仓库
git clone git@github.com:your-username/leetcode-hot100-viz.git
cd leetcode-hot100-viz

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 生产构建

```bash
npm run build
```

静态输出在 `out/` 目录，可部署到任何静态文件服务器。

### 代码检查

```bash
npm run lint
```

## 支持的算法

### 数组

| 题目 | LeetCode # | 可视化效果 |
|------|-----------|-----------|
| 两数之和 (Two Sum) | #1 | 元素状态 + 索引高亮 |
| 移动零 (Move Zeroes) | #283 | 元素交换动画 |
| 盛最多水的容器 (Container With Most Water) | #11 | 指针收敛 |
| 三数之和 (3Sum) | #15 | 三指针移动 |

### 二分查找

| 题目 | LeetCode # | 可视化效果 |
|------|-----------|-----------|
| 寻找旋转排序数组中的最小值 | #153 | 搜索范围收缩 |
| 搜索插入位置 | #35 | 二分查找步骤 |

### 动态规划

| 题目 | LeetCode # | 可视化效果 |
|------|-----------|-----------|
| 最大子数组和 | #53 | Kadane 算法状态 |

### 链表

| 题目 | LeetCode # | 可视化效果 |
|------|-----------|-----------|
| 反转链表 (Reverse Linked List) | #206 | 指针反转动画 |
| 环形链表 (Linked List Cycle) | #141 | 快慢指针检测 |
| 合并两个有序链表 (Merge Two Sorted Lists) | #21 | 节点合并动画 |
| 删除链表的倒数第 N 个节点 | #19 | 双指针间距遍历 |

### 二叉树

| 题目 | LeetCode # | 可视化效果 |
|------|-----------|-----------|
| 二叉树中序遍历 | #94 | 树遍历高亮 |

### 滑动窗口

| 题目 | LeetCode # | 可视化效果 |
|------|-----------|-----------|
| 无重复字符的最长子串 | #3 | 窗口扩展/收缩 |
| 最小覆盖子串 | #76 | 窗口滑动 + 匹配检查 |

### 栈

| 题目 | LeetCode # | 可视化效果 |
|------|-----------|-----------|
| 有效的括号 | #20 | 压入/弹出动画 |
| 每日温度 | #739 | 单调栈构建 |

### 回溯

| 题目 | LeetCode # | 可视化效果 |
|------|-----------|-----------|
| 全排列 | #46 | 决策树探索 |
| 子集 | #78 | 包含/排除分支 |
| 电话号码的字母组合 | #17 | 多分支树 |

### 图

| 题目 | LeetCode # | 可视化效果 |
|------|-----------|-----------|
| 岛屿数量 | #200 | BFS/DFS 洪泛填充 |
| 腐烂的橘子 | #994 | 多源 BFS 扩散 |

### 堆

| 题目 | LeetCode # | 可视化效果 |
|------|-----------|-----------|
| 数组中的第K个最大元素 | #215 | 堆构建 |
| 前K个高频元素 | #347 | 频率桶排序 |

## 项目结构

```
leetcode-hot100-viz/
├── src/
│   ├── app/                          # Next.js App Router 页面
│   │   ├── page.tsx                  # 首页 — 题目浏览
│   │   ├── categories/               # 分类列表
│   │   ├── problems/[id]/            # 题目详情 + 可视化
│   │   └── bookmarks/                # 收藏的题目
│   ├── components/
│   │   ├── ui/                       # shadcn/ui 基础组件
│   │   ├── visualization/            # 数据结构渲染器
│   │   ├── CodeViewer.tsx            # Shiki 代码显示
│   │   ├── FilterPanel.tsx           # 搜索 + 筛选控件
│   │   └── ...
│   ├── hooks/                        # 自定义 React Hooks
│   └── lib/
│       ├── visualization/
│       │   ├── types.ts              # 可视化类型定义
│       │   ├── presets.ts            # 每题动画预设
│       │   └── executors/            # 算法步骤执行器
│       └── data/                     # 数据加载工具
├── data/
│   ├── categories.json               # 17 个算法分类
│   └── problems.json                 # 100 道题目定义
├── scripts/                          # 数据解析脚本
└── ...
```

## 部署

项目配置为静态导出（`output: 'export'`）。构建产物在 `out/` 目录，支持任何静态托管平台。

| 平台 | 方式 |
|------|------|
| Vercel | 从 GitHub 一键导入 |
| Netlify | 拖拽 `out/` 目录 |
| GitHub Pages | 使用 `gh-pages` 或 GitHub Actions |
| 任意静态服务器 | 复制 `out/` 到 Web 根目录 |

## 内容来源

题目描述和解法改编自 LeetCode Hot 100，仅供学习参考。

## 许可证

[MIT](LICENSE)

---

**Built with Next.js + React + Tailwind CSS**
