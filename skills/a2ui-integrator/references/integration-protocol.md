# A2UI Integrator — 融合协议规范

本文档定义 `a2ui-integrator` 对任意 Layer 1 skill 执行融合操作的完整规范。

---

## 1. 术语定义

| 术语 | 含义 |
|------|------|
| **目标 skill** | 被融合的 Layer 1 Domain Skill（如 team-task-manager） |
| **融合节** | 注入到目标 SKILL.md 中的 A2UI 交互流程章节 |
| **字段 schema** | Layer 1 → a2ui 的标准化字段描述 JSON |
| **a2ui skill** | Layer 2 能力 skill，只负责生成 A2UI 表单 JSON，不被修改 |

---

## 2. 融合条件

目标 skill **必须满足**：
1. 有明确的用户输入字段（可从 API 文档、示例或字段说明中提取）
2. 有最终提交接口（HTTP API 或脚本）
3. 有 `SKILL.md` 文件

目标 skill **不需要**：
- 不需要已有 A2UI 相关内容
- 不需要前端渲染能力（渲染由用户侧负责）

---

## 3. 字段 Schema 规范

```typescript
interface FieldSchema {
  task: string;              // 表单用途描述，如"生成任务创建表单"
  fields: Field[];
  submitAction: Action;
  cancelAction?: Action;
}

interface Field {
  key: string;               // 与 API 请求体字段名一致
  label: string;             // 中文显示标签
  type: FieldType;
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: Option[];        // 枚举字段必填
}

type FieldType =
  | "shortText"              // → TextField(variant: shortText)
  | "longText"               // → TextField(variant: longText)
  | "number"                 // → TextField(variant: number)
  | "SELECT"                 // → ChoicePicker(variant: mutuallyExclusive)
  | "MULTI_SELECT"           // → ChoicePicker(variant: multipleSelection)
  | "DATE"                   // → DateTimeInput(enableDate: true)
  | "DATETIME"               // → DateTimeInput(enableDate: true, enableTime: true)
  | "boolean";               // → CheckBox

interface Option {
  label: string;
  value: string;
}

interface Action {
  event: { name: string };
}
```

---

## 4. A2UI 组件生成规则

### 4.1 TextField

```json
{
  "id": "field-<key>",
  "component": "TextField",
  "label": "<label>[ *]",
  "variant": "<shortText|longText|number>",
  "placeholder": "<placeholder>",
  "value": { "path": "/form/<key>" }
}
```

- `required: true` → label 末尾追加 ` *`

### 4.2 ChoicePicker

```json
{
  "id": "field-<key>",
  "component": "ChoicePicker",
  "label": "<label>[ *]",
  "variant": "<mutuallyExclusive|multipleSelection>",
  "choices": [{ "label": "...", "value": "..." }],
  "value": { "path": "/form/<key>" }
}
```

- 字段名必须用 `choices`（A2UI v0.9 规范），**不用 `options`**
- `options` 来自字段的枚举定义（如 API `fieldItemModels`）

### 4.3 DateTimeInput

```json
{
  "id": "field-<key>",
  "component": "DateTimeInput",
  "label": "<label>",
  "enableDate": true,
  "enableTime": false,
  "value": { "path": "/form/<key>" }
}
```

### 4.4 CheckBox

```json
{
  "id": "field-<key>",
  "component": "CheckBox",
  "label": "<label>",
  "value": { "path": "/form/<key>" }
}
```

### 4.5 标准按钮行

```json
{ "id": "action-row", "component": "Row", "justify": "end", "children": ["btn-cancel", "btn-submit"] },
{ "id": "btn-cancel", "component": "Button", "variant": "borderless", "child": "btn-cancel-label",
  "action": { "event": { "name": "cancel_form" } } },
{ "id": "btn-cancel-label", "component": "Text", "text": "取消", "variant": "body" },
{ "id": "btn-submit", "component": "Button", "variant": "primary", "child": "btn-submit-label",
  "action": { "event": { "name": "<submitAction.event.name>" } } },
{ "id": "btn-submit-label", "component": "Text", "text": "提交", "variant": "body" }
```

---

## 5. 注入位置规则

按优先级查找注入锚点：

1. `## 核心流程` 章节末尾（最优先）
2. `### 完整创建流程` 或类似流程图节末尾
3. `## 触发场景` 章节末尾
4. 文件末尾（兜底）

**注入格式**：

```
<现有内容>

### 🎨 A2UI 表单交互流程（推荐）
<融合节内容>
```

---

## 6. 版本管理

融合完成后，目标 skill 的版本号执行 minor bump：
- `version: 1.0.0` → `version: 1.1.0`
- `version: 1.2.0` → `version: 1.3.0`

---

## 7. 已融合 skill 列表（参考）

| skill | 融合时间 | 融合内容 |
|-------|---------|---------|
| `team-task-manager` | 2026-03-25 | 任务创建表单（title/assignee/priority/description） |
