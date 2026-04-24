---
name: a2ui
description: Generate A2UI interface JSON payloads that comply with the official A2UI specification (v0.9). Use this skill when the user wants to create, design, or generate A2UI UI surfaces, component trees, form layouts, list views, dashboards, cards, or any A2UI-based interface. Trigger on keywords like "A2UI", "生成A2UI", "A2UI界面", "A2UI表单", "A2UI列表", "A2UI卡片", "A2UI仪表盘", "生成UI JSON", "Surface", "Catalog", "A2UI组件", "帮我生成一个A2UI".
version: 1.1.0
---

# A2UI Interface Generator

根据用户需求，生成符合 A2UI v0.9 官方规范的 UI 界面 JSON。**默认只输出 JSON**。

---

## 调用方式

### 直接调用（用户驱动）

| 用户意图 | 输出内容 |
|----------|----------|
| 只说"生成 A2UI" / "设计界面"（默认） | **仅输出 JSON** |
| 说"渲染出来" / "给我看效果" / "生成界面" | 输出可运行 HTML（内嵌渲染器） |
| 使用自定义 Catalog | 先读 `references/custom-catalog.md` |

### 被 Domain Skill 调用（程序化）

当 Domain Skill（如 team-task-manager）作为 Layer 1 调用本技能时，会传入结构化的字段 schema。接收格式如下：

```json
{
  "task": "生成任务创建表单",
  "fields": [
    {
      "key": "title",
      "label": "任务标题",
      "type": "shortText",
      "required": true,
      "placeholder": "请输入任务标题"
    },
    {
      "key": "priority",
      "label": "优先级",
      "type": "SELECT",
      "required": true,
      "options": [
        { "label": "最高优", "value": "63" },
        { "label": "高优", "value": "64" },
        { "label": "中等", "value": "65" }
      ]
    }
  ],
  "submitAction": { "event": { "name": "submit_task_form" } },
  "cancelAction": { "event": { "name": "cancel_form" } }
}
```

**字段类型 → A2UI 组件映射**：

| `type` | A2UI 组件 | 备注 |
|--------|-----------|------|
| `shortText` | `TextField(variant: shortText)` | 单行文本 |
| `longText` | `TextField(variant: longText)` | 多行文本 |
| `number` | `TextField(variant: number)` | 数字 |
| `SELECT` | `ChoicePicker(variant: mutuallyExclusive)` | 单选，选项字段名为 `options`（非 `choices`），value 绑定为字符串数组 |
| `MULTI_SELECT` | `ChoicePicker(variant: multipleSelection)` | 多选 |
| `DATE` | `DateTimeInput(enableDate: true)` | 日期 |
| `DATETIME` | `DateTimeInput(enableDate: true, enableTime: true)` | 日期时间 |
| `boolean` | `CheckBox` | 复选框 |

**处理规则**：
1. `required: true` 的字段在 label 后加 `*` 标注
2. 有 `options` 的字段生成 `ChoicePicker`，选项数组字段名为 `options`（**不是** `choices`），`contents` 里对应字段初始化为 `[]`（数组）
3. `submitAction` 绑定到提交 Button 的 action
4. 整体布局：`Column` → 各字段 → `Row(justify: end)` → 取消/提交按钮

---

## 生成规则（MUST FOLLOW）

### 1. JSON 消息结构（三段式）

```json
[
  { "createSurface": { "surfaceId": "<描述性ID>", "catalogId": "...", "theme": {} } },
  { "updateDataModel": { "surfaceId": "<同上>", "contents": { /* 数据，必须预初始化所有字段：ChoicePicker 用 []，TextField 用 "" */ } } },
  { "updateComponents": { "surfaceId": "<同上>", "components": [ /* 平铺列表 */ ] } }
]
```

**catalogId**：
- Basic Catalog（默认）：`https://a2ui.org/specification/v0_9/basic_catalog.json`
- 自定义 Catalog：用户指定的 URI，同时需要在 `catalogs/` 目录下有对应描述文件

**theme**：
- **必须使用 `themeRef` 字段**引用 `theme.md` 文件，不得将 token 值直接内联写入 `theme` 字段
- `theme` 字段仅用于**局部覆盖**：当某个界面需要覆盖个别 token 时才填写，无需覆盖则设为 `{}`
- 渲染器运行时读取 `themeRef` 指向的文件，解析所有 token，再用 `theme` 中的键值做覆盖合并
- 示例：
```json
{
  "createSurface": {
    "surfaceId": "my-surface",
    "catalogId": "https://a2ui.org/specification/v0_9/basic_catalog.json",
    "themeRef": "theme.md",
    "theme": {}
  }
}
```
- 若某个界面需要局部覆盖主色：
```json
{
  "createSurface": {
    "surfaceId": "my-surface",
    "catalogId": "https://a2ui.org/specification/v0_9/basic_catalog.json",
    "themeRef": "theme.md",
    "theme": { "primaryColor": "#6366F1" }
  }
}
```
- **禁止**在 `theme` 中重复列出 `theme.md` 已有的默认值，避免 `theme.md` 修改失效

### 2. 组件格式（v0.9）

所有组件**必须平铺**在 `components` 数组中，通过 `id` 引用，**禁止 inline 嵌套**：

```json
{ "id": "root", "component": "Column", "children": ["header", "body"] }
{ "id": "header", "component": "Text", "text": "标题", "variant": "h1" }
```

**通用字段**：
- `id`（必填）：全局唯一，使用描述性名称（`submit-btn` 而非 `c1`）
- `component`（必填）：组件类型字符串
- `weight`（可选）：flex-grow，仅在 Row/Column 子组件中有效

### 3. 数据绑定

- 静态值：直接写字符串/数字/布尔
- 动态绑定：`{ "path": "/json/pointer" }`（绝对路径）
- 模板内绑定：`{ "path": "fieldName" }`（相对于当前元素）
- List 模板：`"children": { "componentId": "card", "path": "/items" }`

### 4. 容器引用规则

| 组件 | 字段 | 规则 |
|------|------|------|
| `Card` | `child` | 单个 ID，需在 components 中存在 |
| `Button` | `child` | 单个 ID（Text 或 Icon） |
| `Modal` | `trigger`, `content` | 各一个 ID |
| `Tabs` | `tabs[].child` | 每个 tab 一个 ID |

### 5. Action 格式（v0.9）

```json
{ "action": { "event": { "name": "submit_form" } } }
{ "action": { "call": "openUrl", "args": { "url": "https://..." } } }
```

---


## 自定义 Catalog 支持（新增）

当用户需要内置 18 个组件以外的组件时：

1. **参考** `references/custom-catalog.md` 定义新组件
2. 在 `catalogs/` 目录创建 Catalog 描述文件（如 `catalogs/kwai-ui-v1.md`）
3. 在 JSON 的 `createSurface.catalogId` 中指定自定义 catalogId
4. 在渲染 HTML 中用 `A2UIRenderer.registerComponent()` 注册自定义组件实现
5. 版本升级遵循：新增/可选属性 → 保持版本；删除/必填变更 → 升主版本号

---

## 组件速查（Basic Catalog v0.9）

> 完整属性见 `references/basic-catalog.md`

**布局**：`Row` / `Column` / `List`

**展示**：`Text`（h1-h5/caption/body）、`Image`（icon/avatar/smallFeature/mediumFeature/largeFeature/header）、`Icon`（60+ 内置名）、`Video`、`AudioPlayer`、`Divider`

**输入**：`TextField`（shortText/longText/number/obscured）、`CheckBox`、`ChoicePicker`（mutuallyExclusive/multipleSelection）、`Slider`（必须 max）、`DateTimeInput`（enableDate/enableTime）

**容器**：`Card` / `Tabs` / `Modal`

**Button variant**：`default` / `primary` / `borderless`

---

## 常见 UI 模式

- **表单**：`Column` → 多个输入组件 → `Row(justify:end)` → `Button(primary)`
- **数据列表**：`List(template)` + 模板 `Card` + `updateDataModel` 提供数组
- **详情页**：`Column` → `Image(header)` → `Card` 信息 → `Row` 操作按钮
- **仪表盘**：`Column` → `Row` of `Card`（统计）→ `Tabs`（切换视图）
- **Modal 确认**：`Modal(trigger=Button, content=Column)` + 操作按钮

---

## 生成检查清单

- [ ] 所有引用的 ID（children/child/trigger/content）均有对应组件定义
- [ ] 无组件被 inline 嵌套，全部在顶层 `components` 数组中
- [ ] `Button` 必有 `child` 和 `action`
- [ ] `Slider` 必有 `max`
- [ ] `CheckBox` 必有 `label` 和 `value`
- [ ] `ChoicePicker` 必有 `options` 和 `value`
- [ ] 数据绑定 `path` 以 `/` 开头（模板内相对路径除外）
- [ ] 使用自定义 Catalog 时，catalogs/ 目录有对应描述，HTML 中有 `registerComponent()`

---

## 支持文件

- `theme.md` — **主题 token 定义（产品方定制主题只需修改此文件）**
- `references/basic-catalog.md` — 18 个组件完整属性速查 + 图标列表
- `references/message-protocol.md` — 三段式消息协议完整参考
- `references/custom-catalog.md` — 自定义 Catalog 定义与扩展指南
- `examples/booking-form.json` — 预订表单
- `examples/data-list.json` — 动态列表
- `examples/dashboard.json` — 仪表盘
- `examples/detail-page.json` — 详情页 + Modal
