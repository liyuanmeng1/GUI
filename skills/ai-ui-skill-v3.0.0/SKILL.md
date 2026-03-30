# AI-UI-Skill

## 概述

本 Skill 专注于基于 Ant Design 5 框架和项目设计系统，生成高质量、视觉一致的企业级 Web UI 代码。

---

## 核心文件

| 文件 | 用途 |
| :--- | :--- |
| `theme.json` | Ant Design 5 主题 Token，所有颜色/圆角/间距的精确数值来源 |
| `DESIGN.md` | 人类可读的设计规范，包含布局哲学、组件规范和禁止规则 |
| `codegen-rules.md` | 代码生成的技术规范，包括目录结构、命名和代码风格 |
| `project-template.md` | 项目环境说明：antd v5 依赖版本、API 差异速查、标准文件结构 |

---

## 工作流程

### Step 1：理解需求

收到 UI 生成请求时，首先明确：
- **页面/组件类型**：列表页、表单页、详情页、Dashboard、弹窗、独立组件？
- **核心功能**：页面的主要用户目标是什么？
- **数据结构**：需要展示哪些字段，数据有哪些状态？

如信息不足，**主动追问**，不得猜测核心业务逻辑。

### Step 2：加载设计系统

生成前必须读取以下文件：
1. `theme.json` — 提取精确 Token 值
2. `DESIGN.md` — 获取组件规范和禁止规则

**所有颜色、圆角、间距值必须从 `theme.json` 中取，禁止自行创造数值。**

### Step 3：生成代码

按以下优先级决策：

```
1. 优先使用 Ant Design 5 原生组件（Table、Form、Modal 等）
2. 通过 ConfigProvider + theme.json 应用主题，不得用 inline style 覆盖
3. 布局遵循 DESIGN.md 的间距和层级规范
4. 遵守 DESIGN.md 的 Do's and Don'ts
```

### Step 4：检查与输出

输出前自检：
- [ ] 是否使用了 `ConfigProvider` 包裹？
- [ ] 是否有 inline style 硬编码颜色？（若有，替换为 Token）
- [ ] 圆角是否超出 Token 规范？
- [ ] 所有组件状态（禁用/错误/空状态）是否已处理？
- [ ] 文字层级是否清晰（主/次/三级）？

---

## 各场景生成规范

### 列表/表格页 (List / Table Page)

**布局结构：**
```
页面标题 + 操作区（右对齐）
↓
筛选区（可折叠）
↓
Table 组件
↓
Pagination（右对齐）
```

**关键规范：**
- Table 必须设置 `bordered={false}`，仅使用横向分割线
- 操作列（编辑/删除）使用 Button `type="link"`，颜色继承主色
- 空数据状态必须使用 `Empty` 组件，配说明文字
- 分页默认 `pageSize=20`，放在 Table 右下角

### 表单页 (Form Page)

**布局结构：**
```
页面标题
↓
Form（Card 容器包裹）
  ├── FormItem（label 在上或左）
  └── 操作按钮（右对齐，主按钮在右）
```

**关键规范：**
- Form label 颜色 `#252626`，必填标记 `#FA4E3E`
- 输入框统一高度：默认 32px
- 操作按钮组：取消（Default）在左，确认（Primary）在右
- 错误提示使用 `colorError: #FA4E3E`

### 详情页 (Detail Page)

**布局结构：**
```
面包屑导航
↓
页面标题 + 状态 Tag
↓
Descriptions 组件（基础信息）
↓
Tab 分组（详细内容）
  └── 各 Tab 内容区
```

**关键规范：**
- Descriptions 的 title/content/extra 均使用 `#252626`
- Tab 指示条颜色 `#326BFB`
- 状态 Tag 颜色严格遵循语义：成功绿/警告橙/错误红/默认灰

### Dashboard / 数据看板

**布局结构：**
```
顶部统计卡片（Grid，等分）
↓
图表区（左大右小 或 等分）
↓
数据列表（Table 或 List）
```

**关键规范：**
- 统计卡片使用 `Card`，圆角 8px，无投影或次级投影
- 数值使用 `fontSizeHeading1`（24px），weight 600，颜色 `#252626`
- 趋势指标：上涨用 `#30C453`，下跌用 `#FA4E3E`
- 图表颜色从主色系扩展：`#326BFB` → `#30C453` → `#FFAA00` → `#FA4E3E`

### 弹窗 / 抽屉 (Modal / Drawer)

**关键规范：**
- Modal 标题 `#252626`，weight 600，圆角 8px
- 分割线颜色 `#F0F2F5`
- 确认/取消按钮遵循表单页规范（取消在左，确认在右）
- 危险操作弹窗：确认按钮使用 `danger` 类型

---

## 禁止行为清单

以下行为在任何情况下都不得出现：

1. **禁止硬编码颜色值** — 不得出现 `color: '#326BFB'`，必须通过 `ConfigProvider` 或 Token 变量
2. **禁止自定义圆角** — 只能使用 `borderRadius: 4`、`borderRadiusLG: 8` 等 Token 值
3. **禁止纯灰阴影** — `box-shadow` 必须使用 `theme.json` 中定义的投影值
4. **禁止语义色混用** — success/warning/error/info 颜色语义不可互换
5. **禁止省略禁用/空/错误状态** — 组件所有状态必须处理完整
6. **禁止过度嵌套阴影** — 已有投影的容器内不得再嵌套带投影的子容器
7. **禁止跳过 ConfigProvider** — 每个独立页面/组件都必须有主题注入

---

## 标准 ConfigProvider 模板

每个页面/应用根组件必须使用以下模板：

```tsx
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import theme from './theme.json';

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      {/* 页面内容 */}
    </ConfigProvider>
  );
}
```

---

## 附：快速参考

| 场景 | 使用组件 | 主色 Token |
| :--- | :--- | :--- |
| 主操作按钮 | `Button type="primary"` | `colorPrimary: #326BFB` |
| 危险操作 | `Button danger` | `colorError: #FA4E3E` |
| 数据列表 | `Table` | `rowSelectedBg: #F0F7FF` |
| 导航切换 | `Tabs` | `inkBarColor: #326BFB` |
| 表单容器 | `Form` in `Card` | `borderRadiusLG: 8px` |
| 状态提示 | `Alert` / `Tag` | 语义色系 |
| 页面背景 | `Layout` | `colorBgLayout: #F5F7FA` |
