---
name: ui-skill
description: Generate high-quality enterprise Web UI code based on Ant Design 5 framework. Use this skill when the user wants to create UI components, pages, or layouts using Ant Design (antd), such as list pages, form pages, detail pages, dashboards, modals, or any antd-based frontend components. Trigger on keywords like "生成UI", "antd", "Ant Design", "列表页", "表单页", "详情页", "Dashboard", "组件", "UI代码".
---

# UI 生成 Skill

## 三层架构总览

```
01-foundation/          ← 第一层：基础层（主题 Token + 依赖声明）
02-templates/           ← 第二层：模板层（可复用页面模板）
03-design-db/           ← 第三层：设计数据库（开发时必须引用）
src/pages/              ← 业务层（已交付的业务页，作为产出示例）
```

---

## 核心文件索引

### 第一层：基础层（01-foundation）

| 文件 | 用途 |
| :--- | :--- |
| `01-foundation/theme.json` | Ant Design 5 主题 Token，所有颜色/圆角/间距的精确数值来源 |
| `01-foundation/dependencies.md` | 依赖版本声明、ConfigProvider 标准模板、index.html 全局样式 |

### 第二层：模板层（02-templates）

| 模板 | 适用场景 | 关键特征 |
| :--- | :--- | :--- |
| `AppLayout/` | **全局框架（所有页面必须接入）** | TopNav + Sider + Content 卡片 |
| `ListPage/` | 资源列表页（推理服务、精调任务等） | PageHeader + Toolbar + Table + PaginationBar |
| `DetailPage/` | 资源详情页（带面包屑、状态、Tabs） | 面包屑 + 标题行 + MetaInfo + Tab 内容区 |
| `FormPage/` | 新建 / 编辑全页面表单 | 分组表单 + 固定底部操作栏 |
| `DashboardPage/` | 数据看板（统计卡片 + 图表 + 排行） | StatsRow + ChartArea + TopList |

### 第三层：设计数据库（03-design-db）

| 文件 | 内容 |
| :--- | :--- |
| `03-design-db/design-principles.md` | 5 条核心设计原则 + 禁止行为清单 |
| `03-design-db/typography.md` | 字号层级、行高、字体栈、文字颜色层级 |
| `03-design-db/copywriting.md` | 按钮/状态/空值/表单/Toast 文案规范 |
| `03-design-db/color.md` | Token 速查、状态色用法、页面结构色彩 |

---

## ⛔ 模板保护规则（最高优先级）

**`02-templates/` 目录下的所有文件为只读模板，任何情况下不得直接修改。**

### 正确使用方式

收到 PRD 需求后，必须按以下流程操作：

```
1. 从 02-templates/ 中选择匹配的模板
2. 将模板文件【完整复制】到 src/pages/{YourPageName}/ 目录下
3. 在副本上进行业务内容替换（标题、字段、数据、menuKey 等）
4. 原模板文件保持不变
```

**示例：**
```
# ✅ 正确：复制后修改副本
cp 02-templates/ListPage/index.tsx        src/pages/ModelFineTuningPage/index.tsx
cp 02-templates/ListPage/index.module.css src/pages/ModelFineTuningPage/index.module.css
# 然后只修改 src/pages/ModelFineTuningPage/ 里的文件

# ❌ 错误：直接修改模板
# 不得编辑 02-templates/ListPage/index.tsx
```

### 模板更新规则

- 模板文件 **只有在用户明确说"更新模板"时**，才允许修改 `02-templates/` 内的文件
- 未经用户明确指令，即使发现模板有改进空间，也**不得自行修改模板**
- 如需新增模板类型，需用户确认后方可在 `02-templates/` 下新建

---

## ⚠️ 常见失误与强制约束（务必遵守）

### 失误一：跳过读取模板文件直接写代码

**错误行为**：理解需求后直接凭记忆/印象写组件代码，没有先 `read_file` 读取对应模板。  
**后果**：丢失模板中精心设计的细节（`pageTitleDivider`、`pageTabContainer`、`toolbar` 内 Tabs+Space 组合等），导致与设计规范不符，需要返工。

**强制规则**：
> ❌ 禁止在未读取模板文件的情况下开始写任何页面代码。  
> ✅ 必须先 `read_file` 读取 `02-templates/{PageType}/index.tsx` 和对应 `.module.css`，以这两个文件的完整内容为基础进行业务替换。

### 失误二：把模板当"参考"而非"基础"

**错误行为**：读了模板但只借鉴了大体结构，细节重新手写。  
**后果**：CSS 类名、组件配置、间距与模板不一致，增加维护成本。

**强制规则**：
> 模板是**基础**，不是**参考**。开发新页面的第一步是完整复制模板代码，第二步才是替换业务内容。任何没有在 PRD 中要求删减的结构，必须保留。

### 失误三：对模板中"最全元素"的错误处理

**模板设计原则**：模板中包含该类型页面所有可能出现的功能区域（如 DetailPage 有 ①面包屑 ②标题 ③操作按钮 ④附属信息 ⑤Tab ⑥内容区）。

**正确做法**：
- 对照 PRD，**逐一判断**每个功能区域是否需要（保留 or 删除）
- 如果 PRD 中有但模板没有的元素，在副本中**增加**
- 如果模板有但 PRD 中没有的元素，在副本中**删除**
- 不要凭感觉省略，也不要凭感觉增加未在需求中出现的内容

---

## 工作流程（收到 PRD 后）

```
用户描述需求
    ↓
Step 1：完整阅读 PRD，梳理所有涉及的页面及其类型（不要只看到一个页面就开始动手）
    ↓
Step 2：为每个页面用 read_file 读取对应模板（必须执行，不可跳过）
    ↓
Step 3：对照 PRD，逐页面逐区域判断：保留 / 删除 / 新增哪些元素
    ↓
Step 4：以模板为基础完整复制，按改造计划替换业务内容
    ↓
Step 5：交付前自检（强制）—— 产出代码后立即执行，不可跳过
```

---

### Step 1：完整分析 PRD，识别所有涉及的页面

> ⚠️ **不要只看到一个页面就开始动手。** 必须先通读 PRD，整理出完整的页面清单，再统一开始开发。

阅读 PRD，提取：

**1. 涉及几个页面？列出所有页面清单**

例如（模型仓库需求）：
- 页面 A：模型仓库列表页（展示模型列表，支持搜索筛选）
- 页面 B：模型详情页（查看/编辑模型信息）—— Tab1：模型详情，Tab2：部署记录

**2. 每个页面对应哪种模板类型？**

| 需求描述 | 匹配模板 |
|---------|----------|
| 展示资源列表，支持搜索筛选分页 | `ListPage` |
| 查看某条资源详情，有面包屑返回 | `DetailPage` |
| 新建 / 编辑某个资源 | `FormPage` |
| 数据统计看板、图表 | `DashboardPage` |

**3. 页面间有哪些跳转关系？** 梳理跳转路径，确保一并实现。

**4. 每个页面的核心字段、操作行为、状态分别是什么？**

如信息不足，**主动追问**，不得猜测核心业务逻辑。

---

### Step 2：为每个页面读取对应模板（强制）

根据 Step 1 的页面清单，**逐一用 `read_file` 读取对应模板的 `.tsx` 和 `.module.css`**：

```
列表页   → read_file 02-templates/ListPage/index.tsx
         → read_file 02-templates/ListPage/index.module.css
详情页   → read_file 02-templates/DetailPage/index.tsx
         → read_file 02-templates/DetailPage/index.module.css
表单页   → read_file 02-templates/FormPage/index.tsx
         → read_file 02-templates/FormPage/index.module.css
看板页   → read_file 02-templates/DashboardPage/index.tsx
         → read_file 02-templates/DashboardPage/index.module.css
所有页面 → 必须嵌套在 AppLayout 内
```

> ❌ 禁止在未 `read_file` 读取模板文件的情况下开始写任何页面代码。  
> ✅ 读完模板 → 理解模板中每个区域的设计意图 → 再动手写业务代码。

**AppLayout 接入方式（强制）：**
```tsx
import AppLayout from './02-templates/AppLayout/index';

<AppLayout selectedMenuKey="model-repo" activeTopNav="模型服务">
  <YourPage />
</AppLayout>
```

---

### Step 3：对照 PRD 逐区域判断，制定每个页面的改造计划

模板中包含该页面类型**所有可能出现的功能区域**（最全版本）。  
收到 PRD 后，必须对每个区域做明确决策：

| 决策 | 含义 |
|------|------|
| ✅ 保留 | PRD 中有该区域，直接复用模板结构 |
| ✏️ 修改 | PRD 中有该区域但内容不同，替换业务字段/文案/逻辑 |
| ➕ 新增 | PRD 中有但模板没有的元素，在副本中添加 |
| ❌ 删除 | PRD 中没有该区域，从副本中移除 |

**示例（模型详情页改造计划）：**
```
① 面包屑区   ✅ 保留（返回模型仓库列表）
② 标题区     ✏️ 修改（无状态标签，只显示模型名称）
③ 操作按钮区 ❌ 删除（PRD 无全局操作按钮）
④ 附属信息区 ❌ 删除（PRD 无横排 meta 信息）
⑤ Tab 切换区 ✅ 保留（模型详情 + 部署记录两个 Tab）
⑥ 内容区     ✏️ 修改（自定义双列信息展示 + 行内编辑）
```

---

### Step 4：生成代码

按以下优先级决策：

```
1. 完整复制对应模板文件到 src/pages/{PageName}/
2. 按 Step 3 的改造计划，逐区域修改副本（不动原模板）
3. 优先使用 Ant Design 5 原生组件
4. 通过 ConfigProvider + theme.json 应用主题
5. 布局遵循 design-principles.md 的规范
6. 文案遵循 copywriting.md 的规范
```

---

### Step 5：交付前自检（强制——产出代码后立即执行，不可跳过）

> ⚠️ **每次产出页面代码后，必须逐条过以下清单。所有项均通过才算交付完成。**
> 如有任何一项不满足，必须立即修正，不得等用户发现后再改。

#### 🔴 CSS 来源核查（最高优先级）

- [ ] **每个页面的 `index.module.css` 是否通过 `cp 02-templates/XxxPage/index.module.css src/pages/YourPage/index.module.css` 复制而来？**
  - ❌ 禁止手写 CSS 文件（凭记忆重写模板 CSS 是已知的高频错误，会导致布局结构缺失）
  - ✅ 业务专用类（如 `billingNote`、`mixCorpusBlock`）可以**追加**到复制后的文件末尾，不得替换原有内容
  - 验证方式：对比文件头部是否包含模板的标准注释块（如 `/* FormPage — 表单页模板样式 */`）

#### 🔴 JSX 布局结构核查

- [ ] **FormPage**：外层包裹是否为 `<div className={\`${styles.pageContent} ${styles.pageContentSingle}\`}>` 或 `pageContentDouble`？`formArea` 和 `billingCard` 是否同级放在该 div 内？
  - 常见错误：缺少 `pageContentSingle` 类 → 表单不居中；多包一层 `pageInner` → 双重约束导致 billing 卡片错位
- [ ] **ListPage**：是否包含 `pageHeader` → `pageContent` → `toolbar` → `Table` → `paginationBar` 完整五层？
- [ ] **DetailPage**：是否包含 `pageHeaderTop`（面包屑+标题+操作）→ `metaRow` → `tabRow` → `pageContent` 四层？

#### 常规核查

- [ ] 页面是否嵌套在 `AppLayout` 内？
- [ ] 是否使用了 `ConfigProvider` 包裹（注入 theme + zhCN）？
- [ ] `index.html` 是否有 `-webkit-font-smoothing: antialiased`？
- [ ] 是否有 inline style 硬编码颜色？（替换为 `token.xxx`）
- [ ] 空值是否显示 `–`（`#BBBDBF`）？
- [ ] Modal 是否使用了 `destroyOnHidden`？
- [ ] Table 是否 `bordered={false}`，无 Card 包裹？
- [ ] 所有状态（加载中/空状态/错误）是否已处理？

---

## 各模板使用规范速查

### ListPage（列表页）

**只需替换：**
- 页面标题、副标题
- Table `columns` 定义
- Mock 数据结构和字段
- `selectedMenuKey` 和 `activeTopNav`
- 新建弹窗表单字段

**必须保持不变：**
- `AppLayout` 接入方式
- `PageHeader`：高 56px，渐变背景，无底部线
- `Toolbar`：左新建按钮+Tabs，右搜索+刷新+设置
- `Table`：`bordered={false}`，`pagination={false}`
- `PaginationBar`：左共N条+每页选择，右页码+跳页

---

### DetailPage（详情页）

**6 个功能区域（按需开/关）：**

| # | 区域 | 必有/可选 | 控制方式 |
|---|------|-----------|----------|
| ① | 面包屑区 | **必有** | `breadcrumbs` prop（必传） |
| ② | 标题区 | **必有** | `title` + `statusTag` prop（必传） |
| ③ | 全局操作按钮区 | **可选** | `actions` 不传或传 `undefined` 则隐藏 |
| ④ | 附属信息区 | **可选** | `metaItems` 不传或传 `undefined` 则隐藏 |
| ⑤ | Tab 切换区 | **可选** | `tabs` 不传或传 `undefined` 则隐藏，内容区直接渲染 `children` |
| ⑥ | 内容区 | **必有** | 有 `tabs` 时渲染对应 Tab 的 `children`；无 `tabs` 时渲染 `children` prop |

> **生成规则**：根据 PRD 需求判断哪些可选区域需要展示，不需要的区域不传对应 prop 即可。

**Props 接口：**
```tsx
<DetailPage
  breadcrumbs={[{ label: '父页面', onClick: () => history.back() }, { label: '当前页面' }]}
  title="资源名称"
  statusTag={{ label: '运行中', bgColor: '#DAF7DD', dotColor: '#30C453' }}
  actions={[{ key: 'stop', label: '终止', onClick: () => {} }]}       {/* ③ 可选，不需要时删除此行 */}
  metaItems={[{ label: 'ID', value: '12345' }, { label: '创建人', value: '张三' }]}  {/* ④ 可选 */}
  tabs={[                                                               {/* ⑤ 可选 */}
    { key: 'basic', label: '基本信息', children: <BasicInfoContent /> },
    { key: 'log', label: '日志', children: <LogContent /> },
  ]}
/>
```

---

### FormPage（表单页）

**Props 变体：**

| Prop | 可选值 | 说明 |
| :--- | :--- | :--- |
| `formLayout` | `'single'`（默认）/ `'double'` | 单列（520px 宽）/ 双列（全宽）布局 |
| `buttonVariant` | `'normal'`（默认）/ `'billing'` / `'none'` | 按钮区域一（底部居中横条）/ 按钮区域二（右侧费用卡片）/ 无 |

**区域结构：**
1. **面包屑**（必有）—— `← 父级页面 / 当前页面`
2. **表单区域**（必有）—— 分组 `sectionTitle + Form.Item`，单列 `requiredMark={false}`，双列 `requiredMark="optional"`
3. **按钮区域**（二选一）：
   - `normal`：底部 `position: fixed` 横条，居中排列「下一步（Primary）」+「取消（Default）」
   - `billing`：右侧 300px 卡片，含配置概要 + 费用预估（`#FF7429`）+ 提交按钮（antd Primary）

**关键规范：**
- Form `layout="vertical"`
- 有费用卡片时：`formArea` 用 `flex: 1` 撑满；无费用卡片时：`formAreaCentered` 用 `margin: 0 auto` 居中
- 按钮全部使用 antd `<Button>`，禁止自定义 `<button>`
- 底部横条 `left: 228px`（Sider 220px + gap 8px）避免遮挡侧边栏

---

### DashboardPage（看板页）

**替换内容：**
- 统计卡片 `STATS` 数据定义
- 图表区替换为实际图表组件（ECharts/Recharts）
- 排行/列表数据

---

## 禁止行为清单

| 禁止项 | 替代方案 |
| :--- | :--- |
| 页面自行实现 TopNav / Sider | 通过 `AppLayout` 提供 |
| 硬编码颜色值 | 使用 `token.colorPrimary` 等 Token |
| Table 使用 Card 包裹 | Table 直接平铺 |
| Table `bordered={true}` | 使用 `bordered={false}` |
| 空值不显示 `–` | `<span style={{ color: '#BBBDBF' }}>–</span>` |
| `destroyOnClose` | 使用 `destroyOnHidden` |
| `any` 类型 | 定义具体 `interface` |
| 省略 `rowKey` | 必须指定 `rowKey="id"` |
| 操作列不加 `fixed: 'right'` | 操作列必须 `fixed: 'right'` |
| 详情页用 Card 分组 | 用区块标题 + Divider + Descriptions |
