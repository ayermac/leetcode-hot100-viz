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
- 两数之和 (Two Sum)
- 移动零 (Move Zeroes)
- 盛最多水的容器 (Container With Most Water)
- 三数之和 (3Sum)

### 链表类
- 反转链表 (Reverse Linked List)
- 环形链表 (Linked List Cycle)
- 合并两个有序链表 (Merge Two Sorted Lists)
- 删除链表的倒数第 N 个节点 (Remove Nth Node From End)

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
