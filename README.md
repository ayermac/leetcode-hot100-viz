# LeetCode Hot 100 可视化学习平台

通过交互式动画深入理解经典算法，掌握 Hot 100 核心题型。

## 功能特性

### 📚 题目浏览
- 17 个算法分类（哈希、双指针、滑动窗口、链表、树、图等）
- 100 道经典题目，包含详细描述和生活场景类比
- 多语言代码示例（Go、Python、Java）
- Shiki 语法高亮

### 🎬 算法可视化
- **数组可视化**：元素状态动画、指针标注、索引显示
- **链表可视化**：节点连接、指针移动、环检测演示
- **二叉树可视化**：树形结构渲染、路径高亮、遍历动画
- **栈可视化**：垂直布局、TOP 指针、压入/弹出动画
- **矩阵可视化**：二维网格、单元格状态、坐标追踪
- **动画控制**：播放/暂停、步进执行、速度调节
- **自定义输入**：修改输入数据，观察算法行为变化
- **代码同步**：动画执行时同步高亮当前代码行

### 🔍 搜索与筛选
- 实时搜索（按题目名称、编号）
- 多维度筛选（难度、分类、收藏状态）
- URL 参数同步（可分享筛选结果）

### 🌙 用户体验
- 收藏功能（本地存储持久化）
- 亮色/暗色主题切换
- 响应式设计（支持移动端）

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (静态导出) |
| 前端 | React 19 |
| 样式 | Tailwind CSS 4 |
| UI 组件 | shadcn/ui |
| 动画 | Motion (Framer Motion) |
| 代码高亮 | Shiki |
| 语言 | TypeScript 5 |

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建静态站点

```bash
npm run build
```

构建产物在 `out/` 目录，可直接部署到任何静态文件服务器。

### 代码检查

```bash
npm run lint
```

## 项目结构

```
leetcode-hot100-viz/
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── page.tsx            # 首页
│   │   ├── categories/         # 分类页面
│   │   ├── problems/[id]/      # 题目详情页
│   │   └── bookmarks/          # 收藏页面
│   ├── components/             # React 组件
│   │   ├── ui/                 # shadcn/ui 基础组件
│   │   ├── visualization/      # 可视化组件
│   │   ├── CodeViewer.tsx
│   │   ├── FilterPanel.tsx
│   │   └── ...
│   ├── hooks/                  # 自定义 Hooks
│   └── lib/                    # 工具库
│       ├── visualization/      # 可视化核心
│       │   ├── types.ts
│       │   ├── presets.ts
│       │   └── executors/      # 算法执行器
│       └── data/               # 数据加载
├── data/                       # JSON 数据
│   ├── categories.json
│   └── problems.json
└── scripts/                    # 解析脚本
```

## 已支持的算法可视化

### 数组类
- 两数之和 (Two Sum) - LeetCode 1
- 移动零 (Move Zeroes) - LeetCode 283
- 盛最多水的容器 (Container With Most Water) - LeetCode 11
- 三数之和 (3Sum) - LeetCode 15

### 二分查找
- 寻找旋转排序数组中的最小值 - LeetCode 153
- 搜索插入位置 - LeetCode 35

### 动态规划
- 最大子数组和 - LeetCode 53

### 链表类
- 反转链表 (Reverse Linked List) - LeetCode 206
- 环形链表 (Linked List Cycle) - LeetCode 141
- 合并两个有序链表 (Merge Two Sorted Lists) - LeetCode 21
- 删除链表的倒数第 N 个节点 - LeetCode 19

### 二叉树
- 二叉树中序遍历 - LeetCode 94

### 滑动窗口
- 无重复字符的最长子串 - LeetCode 3
- 最小覆盖子串 - LeetCode 76

### 栈
- 有效的括号 - LeetCode 20
- 每日温度 - LeetCode 739

### 回溯
- 全排列 - LeetCode 46
- 子集 - LeetCode 78
- 电话号码的字母组合 - LeetCode 17

### 图
- 岛屿数量 - LeetCode 200
- 腐烂的橘子 - LeetCode 994

### 堆
- 数组中的第K个最大元素 - LeetCode 215
- 前K个高频元素 - LeetCode 347

## 部署

项目配置为静态导出，支持部署到：

- **Vercel**: 一键部署
- **Netlify**: 拖拽 `out/` 目录
- **GitHub Pages**: 使用 `gh-pages` 或 GitHub Actions
- **任何静态服务器**: 复制 `out/` 目录即可

## 内容来源

题目内容来自 LeetCode Hot 100 题解，仅供学习参考。

## License

MIT
