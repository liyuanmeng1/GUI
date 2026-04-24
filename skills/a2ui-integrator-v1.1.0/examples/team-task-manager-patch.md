# 示例：team-task-manager 融合补丁

本文档记录 `a2ui-integrator` 对 `team-task-manager` 执行融合操作的完整过程，作为后续融合其他 skill 的参考样本。

---

## 输入：目标 skill 信息

- **skill 名称**：`team-task-manager`
- **原版本**：`1.0.0`
- **融合后版本**：`1.1.0`

### 提取到的字段定义

来源：`SKILL.md` 中"常用项目配置"和"创建任务 API"章节

| 字段 key | 中文标签 | 字段类型 | 必填 | 枚举值 |
|---------|---------|---------|------|--------|
| `title` | 任务标题 | shortText | ✅ | — |
| `assignee` | 执行人 | USER_PICKER → shortText | ✅ | — |
| `priority` | 优先级 | DROP_DOWN_SINGLE → SELECT | ✅ | 63/最高优、64/高优、65/中等 |
| `description` | 任务描述 | longText | ❌ | — |
| `status` | 任务状态 | DROP_DOWN_SINGLE | ✅ | 由 getFields API 动态获取 |

### 提交 API

```
POST /pm/api/no-ba/external/task/create
{
  "title": "...",
  "projectId": "P42952",
  "taskClass": "128346",
  "sectionId": "S138926",
  "operator": "liyuanmeng05",
  "fields": {
    "assignee": ["<user>"],
    "priority": ["<65|64|63>"],
    "status": ["3215447"],
    "reporter": ["liyuanmeng05"]
  }
}
```

---

## 输出：构造的字段 Schema

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
      "key": "assignee",
      "label": "执行人",
      "type": "shortText",
      "required": true,
      "placeholder": "请输入用户名（如 liyuanmeng05）"
    },
    {
      "key": "priority",
      "label": "优先级",
      "type": "SELECT",
      "required": true,
      "choices": [
        { "label": "最高优", "value": "63" },
        { "label": "高优", "value": "64" },
        { "label": "中等", "value": "65" }
      ]
    },
    {
      "key": "description",
      "label": "任务描述",
      "type": "longText",
      "required": false,
      "placeholder": "请描述任务内容、背景及目标"
    }
  ],
  "submitAction": { "event": { "name": "submit_task_form" } },
  "cancelAction": { "event": { "name": "cancel_form" } }
}
```

---

## 输出：委托 a2ui skill 生成表单

team-task-manager 在运行时调用：

```
use_skill(skill_name="a2ui", reason="生成 TEAM 任务创建表单")
```

传入上方字段 schema，由 **a2ui skill（Layer 2）** 负责生成符合 A2UI v0.9 规范的表单 JSON，包含：

- 4 个字段组件：TextField × 3 + ChoicePicker × 1（`choices` 字段）
- 1 个操作行：取消 + 提交按钮
- updateDataModel 预填默认值（从 `.env` 注入 `TEAM_OPERATOR` 和 `TEAM_DEFAULT_PRIORITY`）

**team-task-manager 自身不输出任何硬编码 JSON**，表单 JSON 完全由 a2ui skill 动态生成。

---

## 融合节注入位置

注入到 `SKILL.md` 第 228 行（`### 完整创建任务流程` 的 mermaid 图之后）：

```
### 完整创建任务流程
[mermaid 图]

↓ 注入位置 ↓

### 🎨 A2UI 表单交互流程（推荐）
[融合节内容]
```

---

## 验证结果

- ✅ 融合节已注入，位于第 230 行
- ✅ 字段 schema JSON 合法
- ✅ 原有 API 文档（listTaskClasses / getFields / create）完整保留
- ✅ `.env` 同步修复：`TEAM_DEFAULT_STATUS=""` → `"3215447"`
- ✅ 端到端验证成功：表单 JSON → 用户填写 → Task `T11129910` 创建成功

---

## 注意事项（经验）

1. **`choices` vs `options`**：A2UI 规范使用 `choices`，渲染器若只支持 `options` 需同步修复（`playground.html` 第 839 行已修复）
2. **`status` 字段**：该项目的 status 无 `fieldItemModels`（工作流驱动），使用 fallback 值 `3215447`，不放入表单由 Layer 1 自动填充
3. **执行人格式**：TEAM API 需要用户名（`liyuanmeng05`），不是中文名，表单 placeholder 需说明
