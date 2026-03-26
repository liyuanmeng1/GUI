# Skills

这里存放所有 CodeFlicker Skill，每个 Skill 以独立文件夹存放，命名格式为 `{skill-name}-v{version}`。

## 目录结构

```
skills/
├── team-task-manager-v1.0.0/   # TEAM 任务管理 v1.0.0（旧版，硬编码表单）
├── team-task-manager-v1.1.0/   # TEAM 任务管理 v1.1.0（接入 a2ui skill）
└── ...                          # 更多 Skill（持续更新）
```

## Skill 列表

| Skill | 版本 | 描述 | 架构 |
|-------|------|------|------|
| [team-task-manager](./team-task-manager-v1.1.0/) | v1.1.0 ✅ 最新 | 快手 TEAM 项目管理系统任务操作（创建任务、查询字段、A2UI 表单交互） | Layer 1 + a2ui skill (Layer 2) |
| [team-task-manager](./team-task-manager-v1.0.0/) | v1.0.0 | 快手 TEAM 项目管理系统任务操作（硬编码表单） | 独立 |

---

## 工作流架构说明

本仓库的 Skill 遵循**双层架构**设计：

| 层级 | 职责 |
|------|------|
| **Layer 1（领域 Skill）** | 负责业务逻辑：API 调用、字段定义、数据处理、认证流程 |
| **Layer 2（a2ui skill）** | 负责交互层：接收字段 schema，动态生成 A2UI 表单 JSON，驱动用户填写 |

**创建任务工作流（v1.1.0）**：

```
Step 1  初始化配置     →  .env / user-config.json / 01-setup.sh
Step 2  查询字段定义   →  scripts/02-get_fields.sh（Layer 1）
Step 3  构建交互表单   →  use_skill("a2ui") + 字段 schema（Layer 2，无本地文件）
Step 4  创建任务       →  scripts/03-create_task.sh（调用 TEAM API）
Step 5  任务描述模板   →  templates/task-template.html
```

## 使用方式

在 CodeFlicker 中说：

```
创建 TEAM 任务
```

AI 会自动加载 `team-task-manager` skill，静默获取 accessToken，调用 a2ui skill 生成表单，等待用户填写后提交创建。
