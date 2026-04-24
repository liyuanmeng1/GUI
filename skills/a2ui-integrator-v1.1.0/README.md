# a2ui-integrator

将 A2UI 表单交互能力注入到任意 Layer 2 业务 Skill，使其具备「声明字段 schema → 委托 Layer 1 渲染表单 → 用户填写 → 回传业务层提交」的能力。

---

## 架构层级

| 层级 | 名称 | 代表 Skill | 职责 | 特点 |
|------|------|-----------|------|------|
| **Layer 2** | 业务层（Domain Layer） | `team-task-manager` 等 | 业务逻辑：API 调用、字段定义、数据处理、认证流程 | 专注业务，声明字段 schema 后委托 Layer 1 渲染 |
| **Layer 1** | 基础层（Foundation Layer） | `a2ui skill` | 通用表单渲染：接收任意字段 schema，输出标准 A2UI 表单 JSON | 无业务感知，可被**任意** Layer 2 引用 |

**调用关系**：

```
Layer 2（业务层）  →  use_skill("a2ui")  →  Layer 1（基础层）
team-task-manager                           a2ui skill
审批流程 skill                              （通用，可复用）
表单提交 skill
...任意业务 skill
```

---

## a2ui-integrator 的定位

a2ui-integrator 是**一次性集成工具**，不参与运行时：

```
a2ui-integrator（集成阶段，一次性）
    └── 分析 Layer 2 业务 skill 的字段定义
    └── 向其 SKILL.md 注入融合节
    └── 融合节内容 = use_skill("a2ui") + 字段 schema
    └── 完成后退出，运行时由 Layer 2 直接调用 Layer 1
```

---

## 使用方式

在 CodeFlicker 中对任意 Layer 2 业务 skill 说：

```
集成 A2UI
```

或：

```
给这个 skill 加上表单
```

a2ui-integrator 会自动分析该 skill 的字段定义，生成字段 schema，并将调用 a2ui skill 的融合节注入到目标 SKILL.md 中。

---

## 目录结构

```
a2ui-integrator/
├── SKILL.md                              # 主技能文件（5步注入流程）
├── examples/
│   └── team-task-manager-patch.md       # 融合示例：team-task-manager v1.0 → v1.1
└── references/
    └── integration-protocol.md          # 完整融合协议规范
```

---

## 版本

| 版本 | 变更内容 |
|------|---------|
| v1.1.0 | 字段 schema 枚举字段统一使用 `choices`（修正 `options`）；融合示例更新为委托 a2ui skill 生成表单；明确双层架构定义 |
| v1.0.0 | 初始版本，支持基础字段注入流程 |
