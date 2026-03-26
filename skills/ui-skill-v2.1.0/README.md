# ui-skill

**版本：v2.1.0** · 企业级 Web UI 代码生成技能包，基于 Ant Design 5。

---

## 简介

`ui-skill` 是一套专为 AI 代码生成设计的 UI 规范包，覆盖从需求分析到代码交付的完整工作流。通过统一的模板、设计 Token 和自查机制，确保每次生成的页面都符合设计规范、结构正确、可直接运行。

---

## 版本历史

| 版本 | 主要变更 |
|------|----------|
| **v2.1.0** | 新增 Step 5 强制交付自查：CSS 来源核查（禁止手写，必须从模板 `cp`）+ JSX 布局结构核查（FormPage 双类检查、ListPage 五层结构、DetailPage 四层结构） |
| **v2.0.0** | 重构工作流为五步流程（分析 PRD → 读取模板 → 制定改造计划 → 生成代码 → 自检）；FormPage 支持 `single/double` 布局和 `normal/billing/none` 按钮变体；ListPage 自定义 SegmentedTab 组件 |
| **v1.0.0** | 初始版本：AppLayout 全局框架 + ListPage / DetailPage / FormPage / DashboardPage 四套模板 + design-db 设计数据库 |

---

## 目录结构

```
ui-skill/
├── 01-foundation/
│   ├── theme.json          # Ant Design 5 主题 Token（颜色/圆角/间距精确数值）
│   └── dependencies.md     # 依赖版本声明、ConfigProvider 模板、index.html 全局样式
├── 02-templates/
│   ├── AppLayout/          # 全局框架（TopNav + Sider + Content 卡片）⚠️ 只读
│   ├── ListPage/           # 资源列表页模板 ⚠️ 只读
│   ├── DetailPage/         # 资源详情页模板 ⚠️ 只读
│   ├── FormPage/           # 新建/编辑表单页模板 ⚠️ 只读
│   └── DashboardPage/      # 数据看板模板 ⚠️ 只读
├── 03-design-db/
│   ├── color.md            # Token 速查、状态色用法、页面结构色彩
│   ├── typography.md       # 字号层级、行高、字体栈、文字颜色层级
│   ├── copywriting.md      # 按钮/状态/空值/表单/Toast 文案规范
│   └── design-principles.md # 5 条核心设计原则 + 禁止行为清单
├── preview/                # 本地预览工程（Vite + React）
├── README.md               # 本文件
└── SKILL.md                # Skill 核心指令文件（工作流 + 规范 + 自查清单）
```

---

## 工作流（五步）

```
Step 1  完整阅读 PRD → 列出所有涉及页面 + 匹配模板类型
Step 2  read_file 读取每个页面对应的模板 .tsx 和 .module.css（强制，不可跳过）
Step 3  逐页面逐区域制定改造计划（保留 / 修改 / 新增 / 删除）
Step 4  cp 复制模板 → 在副本上替换业务内容（禁止手写 CSS）
Step 5  交付前强制自查（CSS 来源 + JSX 布局结构 + 常规规范）
```

---

## 核心规范

### CSS 使用规范（⚠️ 最高优先级）

- **禁止手写 CSS 文件**，必须通过 `cp` 从 `02-templates/` 复制
- 业务专用 CSS 类**只能追加**到文件末尾，不得修改原有内容
- 违反此规范是已知最高频的错误，会导致布局结构缺失

```bash
# ✅ 正确做法
cp 02-templates/FormPage/index.module.css src/pages/MyFormPage/index.module.css
# 然后在末尾追加业务专用类

# ❌ 禁止：凭记忆手写 CSS
```

### JSX 布局结构规范

**FormPage（表单页）**
```jsx
<div className={`${styles.pageContent} ${styles.pageContentSingle}`}>
  <div className={styles.formArea}>
    {/* 表单内容 520px */}
  </div>
  <div className={styles.billingCard}>
    {/* 右侧费用卡片 300px */}
  </div>
</div>
// 整体 860px，margin: 0 auto 居中
```

**ListPage（列表页）**：`pageHeader → pageContent → toolbar → Table → paginationBar` 五层

**DetailPage（详情页）**：`pageHeaderTop → metaRow → tabRow → pageContent` 四层

---

## 模板说明

| 模板 | 适用场景 | 关键特征 |
|------|----------|----------|
| `AppLayout` | 所有页面必须接入的全局框架 | TopNav + Sider + Content 卡片 |
| `ListPage` | 资源列表、精调任务等 | PageHeader + Toolbar + Table + PaginationBar |
| `DetailPage` | 资源详情（带面包屑、状态、Tab） | 面包屑 + 标题 + MetaInfo + Tab 内容区 |
| `FormPage` | 新建/编辑全页面表单 | 分组表单 + 底部横条 / 右侧费用卡片 |
| `DashboardPage` | 数据统计看板 | StatsRow + ChartArea + TopList |

> ⚠️ `02-templates/` 下所有文件为**只读模板**，任何情况下不得直接修改。业务页面必须复制到 `src/pages/{YourPageName}/` 后再修改副本。

---

## 使用方式

在 CodeFlicker 中，当用户描述 UI 需求时，该 skill 会自动触发。

**触发关键词**：`生成UI`、`antd`、`Ant Design`、`列表页`、`表单页`、`详情页`、`Dashboard`、`组件`、`UI代码`
