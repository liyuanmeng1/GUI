---
name: a2ui-integrator
description: 将 A2UI 表单交互模式注入到任意 Layer 1 Domain Skill 中。当用户提供一个已有的 Layer 1 skill（如任务管理、审批流程、表单提交等），此技能分析其字段定义，并将 A2UI 表单交互协议直接写入该 skill 的 SKILL.md，使其具备"动态生成 A2UI 表单 → 用户填写 → 自动提交"的能力。触发词：「集成 A2UI」「融合 A2UI」「给这个 skill 加上表单」「a2ui-integrator」「注入 A2UI」。
version: 1.1.0
---

# A2UI Integrator

将 A2UI 表单交互能力注入到任意 Layer 1 Domain Skill，**只修改目标 skill，不修改 a2ui skill 本身**。

---

## 核心定位

```
用户提供 Layer 1 Skill
        ↓
a2ui-integrator 分析字段定义
        ↓
向目标 SKILL.md 写入 A2UI 融合节
        ↓
目标 skill 获得表单交互能力
```

**不做的事**：
- ❌ 不修改 a2ui skill
- ❌ 不新建中间层 skill
- ❌ 不改变目标 skill 原有 API 逻辑

---

## 执行流程（MUST FOLLOW）

### Step 1：读取目标 skill

```
read_file(path="~/.codex/skills/<target-skill>/SKILL.md")
```

分析以下内容：
1. **字段定义**：找出 skill 中需要用户输入的字段（必填/可选、类型、枚举值）
2. **提交 API**：找出最终调用的接口（URL、请求体格式）
3. **现有流程**：定位"核心流程"或"触发场景"节，确认注入位置

### Step 2：构造字段 Schema

将目标 skill 的字段定义转换为标准 A2UI 字段 schema：

```json
{
  "task": "<描述性任务名>",
  "fields": [
    {
      "key": "<字段键名>",
      "label": "<显示标签>",
      "type": "<类型，见下方映射表>",
      "required": true,
      "placeholder": "<可选>",
      "choices": [{ "label": "...", "value": "..." }]
    }
  ],
  "submitAction": { "event": { "name": "<submit_event_name>" } },
  "cancelAction": { "event": { "name": "cancel_form" } }
}
```

**字段类型映射**（目标 skill 类型 → A2UI 组件）：

| 目标 skill 字段类型 | A2UI 组件 | `choices` 来源 |
|-------------------|-----------|---------------|
| 短文本 / `SHORT_TEXT` / `USER_PICKER` | `TextField(variant: shortText)` | — |
| 长文本 / `LONG_TEXT` / `TEXTAREA` | `TextField(variant: longText)` | — |
| 数字 / `NUMBER` | `TextField(variant: number)` | — |
| 单选 / `DROP_DOWN_SINGLE` / `SELECT` | `ChoicePicker(variant: mutuallyExclusive)` | `fieldItemModels` 或枚举值 |
| 多选 / `DROP_DOWN_MULTI` / `MULTI_SELECT` | `ChoicePicker(variant: multipleSelection)` | 同上 |
| 日期 / `DATE` | `DateTimeInput(enableDate: true)` | — |
| 日期时间 / `DATETIME` | `DateTimeInput(enableDate: true, enableTime: true)` | — |
| 布尔 / `CHECKBOX` | `CheckBox` | — |

### Step 3：生成融合节内容

生成一段标准 Markdown，包含以下子节，准备写入目标 SKILL.md：

```markdown
### 🎨 A2UI 表单交互流程（推荐）

当用户触发<具体操作>时，推荐使用 **a2ui skill** 生成交互表单。

**两层协作架构**：
- **Layer 1（本技能）**：负责 API 调用、字段获取、数据提交
- **Layer 2（a2ui skill）**：负责将字段 schema 转成可填写的 A2UI 表单 JSON

**执行步骤**：

1. **<前置数据获取步骤>**（本技能）：[描述如何获取字段枚举、配置等]

2. **构造 a2ui 调用上下文**（本技能传递给 a2ui）：
   ```json
   <完整的字段 schema JSON>
   ```

3. **a2ui 生成表单**（a2ui skill 负责）：
   - 调用 `use_skill(skill_name="a2ui", reason="生成<具体表单名>")`
   - 传入字段 schema，生成符合 A2UI v0.9 规范的表单 JSON

4. **用户提交后**（本技能接收）：
   - 从表单数据中提取各字段值
   - 映射为 API 请求体格式
   - 调用 `<提交 API endpoint>`

**字段类型映射**（本技能字段 → A2UI 组件）：

| 字段 | 类型 | A2UI 组件 |
|------|------|-----------|
| <字段1> | <类型1> | <组件1> |
```

### Step 4：写入目标 SKILL.md

定位目标 SKILL.md 中"核心流程"或等价章节，在其下方插入融合节：

```
replace_in_file(
  path="~/.codex/skills/<target-skill>/SKILL.md",
  oldString="<定位锚点>",
  newString="<锚点内容> + \n\n<融合节内容>"
)
```

**注入原则**：
- 融合节追加在现有流程节之后，**不替换原有内容**
- 保持目标 skill 原有 API 文档、示例、错误处理完整不变
- 若已存在 A2UI 融合节，更新而非重复添加

### Step 5：验证

写入后读取目标 SKILL.md，确认：
- [ ] 融合节存在且格式正确
- [ ] 字段 schema JSON 合法
- [ ] 原有内容未被破坏
- [ ] `use_skill(skill_name="a2ui")` 调用方式正确

---

## 生成检查清单

- [ ] 字段 schema 中所有必填字段已标注 `required: true`
- [ ] 有枚举值的字段已提供 `choices` 数组（A2UI 规范字段名，非 `options`）
- [ ] `submitAction.event.name` 与目标 skill 的提交逻辑匹配
- [ ] 注入位置正确，未破坏原有内容
- [ ] 目标 skill 版本号已更新（minor bump，如 1.0.0 → 1.1.0）

---

## 支持文件

- `references/integration-protocol.md` — 完整融合协议规范
- `examples/team-task-manager-patch.md` — team-task-manager 融合示例（已完成参考）
