# Skills

这里存放所有 CodeFlicker Skill，每个 Skill 以独立文件夹存放，命名格式为 `{skill-name}-v{version}`。

## 目录结构

```
skills/
├── a2ui-integrator-v1.1.0/           # A2UI 融合工具 v1.1.0（最新）
├── a2ui-integrator/                   # A2UI 融合工具 v1.0.0（旧版）
├── a2ui/                              # A2UI 核心 Skill（Layer 2 渲染引擎）
├── team-task-manager-v1.1.0/         # TEAM 任务管理 v1.1.0（最新）
├── team-task-manager-v1.0.0/         # TEAM 任务管理 v1.0.0（旧版）
└── README.md
```

## Skill 列表

| Skill | 版本 | 描述 | 架构层级 |
|-------|------|------|---------|
| [a2ui-integrator](./a2ui-integrator-v1.1.0/) | v1.1.0 ✅ 最新 | 将 A2UI 表单交互协议注入到任意 Layer 1 Skill | 工具 Skill |
| [a2ui-integrator](./a2ui-integrator/) | v1.0.0 | A2UI 融合工具（旧版） | 工具 Skill |
| [a2ui](./a2ui/) | — | A2UI 表单渲染引擎，接收字段 schema 生成表单 JSON | Layer 2 |
| [team-task-manager](./team-task-manager-v1.1.0/) | v1.1.0 ✅ 最新 | 快手 TEAM 任务管理（接入 a2ui skill Layer 2） | Layer 1 |
| [team-task-manager](./team-task-manager-v1.0.0/) | v1.0.0 | 快手 TEAM 任务管理（硬编码表单） | 独立 |

---

## 架构说明

本仓库的 Skill 遵循**双层架构**设计：

| 层级 | 职责 | 代表 Skill |
|------|------|-----------|
| **Layer 1（领域 Skill）** | 业务逻辑：API 调用、字段定义、数据处理、认证流程 | `team-task-manager` |
| **Layer 2（交互层）** | 表单渲染：接收字段 schema，动态生成 A2UI 表单 JSON | `a2ui` |
| **工具 Skill** | 一次性注入：将 Layer 2 协议写入 Layer 1 的 SKILL.md | `a2ui-integrator` |

**工作流**：

```
Layer 1 Skill（如 team-task-manager）
    └── 构造字段 schema
    └── use_skill("a2ui")  ←─── Layer 2 a2ui skill
                                └── 动态生成 A2UI 表单 JSON
                                └── 用户填写后回传 Layer 1
    └── 调用 API 提交
```

**a2ui-integrator 的角色**：

```
a2ui-integrator（工具，一次性）
    └── 分析 Layer 1 字段定义
    └── 向 Layer 1 SKILL.md 注入融合节
    └── 融合节内容 = use_skill("a2ui") + 字段 schema
```

---

## 版本变更记录

### a2ui-integrator v1.1.0
- 字段 schema 中枚举字段统一使用 `choices`（修正 `options` 错误，与 A2UI 规范一致）
- 融合示例（`team-task-manager-patch.md`）更新：「输出」由硬编码 JSON 改为「委托 a2ui skill 生成表单」
- 明确架构关系：a2ui-integrator 是一次性注入工具，运行时 Layer 1 直接引用 a2ui skill

### team-task-manager v1.1.0
- 接入 a2ui skill（Layer 2）：表单渲染改为通过字段 schema 委托 a2ui skill 动态生成
- 移除硬编码 `a2ui/` 目录（form-template.json / field-type-mapping.md）
- 目录结构按工作流顺序重组（01-setup / 02-get_fields / 03-create_task）
