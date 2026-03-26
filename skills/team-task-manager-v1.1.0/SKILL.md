---
name: team-task-manager
description: 快手 TEAM 项目管理系统任务操作技能。支持创建任务、查询分类、获取字段信息等操作。当用户说"创建 TEAM 任务"、"在 TEAM 里创建任务"、"帮我在项目里加个任务"等时使用此技能。
version: 1.1.0
requires_meta_execution: true
export:
  policy: sanitize
  reason: "TEAM任务管理技能，脱敏后可导出"
---

> **⚠️ META-EXECUTION REQUIRED** — 本技能已启用强制质量保障（C1+C2: 多步骤+涉及企业内部系统）。
> 加载本技能时，**必须**同时执行 meta-execution 的 P1（启动前检查）和 P0（交付前自审）流程。
> - P1: 需求理解 → 踩坑记忆检索 → 方案预演
> - P0: 完备性检查 → 正确性检查 → 清晰度检查

> **❗ 第零步：加载质量保障（强制）**
> 在执行本技能的任何步骤之前，必须先加载 meta-execution 技能。
> 先穿铠甲，再上战场。
>
> **执行动作**：
> ```
> use_skill(skill_name="meta-execution", reason="强制绑定：team-task-manager 加载质量保障")
> ```
>
> **P1 启动前检查**：
> - 踩坑记忆检索：搜索与本技能相关的 common_pitfalls_experience
> - 确认项目ID、分类ID、任务组ID等必需信息
> - 方案预演：脑中走一遍完整流程，预判哪些环节可能出问题
>
> **激活标记**（必须输出）：
> ```
> [Meta-Execution] 已激活 | 技能: team-task-manager
> ```

# TEAM 任务管理技能

## 架构层级说明

本技能基于双层架构设计：

| 层级 | 技能 | 职责 |
|------|------|------|
| **Layer 1（领域技能）** | `team-task-manager`（本技能） | TEAM API 调用、字段定义、业务规则、认证流程 |
| **Layer 2（交互层）** | `a2ui skill` | 接收 Layer 1 传入的字段 schema，生成 A2UI 表单 JSON，驱动用户交互 |

**目录结构按工作流顺序组织**：

```
team-task-manager/
│
│  ── Step 1: 初始化配置 ──────────────────────────────────────
├── .env                          # API 密钥（TEAM_APP_KEY / SECRET_KEY）
├── user-config.json              # 用户信息 + 项目默认配置
├── team-members.json             # 同事名单（执行人快速选择）
├── scripts/
│   └── 01-setup.sh              # 配置向导（首次运行）
│
│  ── Step 2: 查询字段定义（Layer 1） ─────────────────────────
├── scripts/
│   └── 02-get_fields.sh         # 查询任务分类的必填/选填字段
│
│  ── Step 3: 构建交互表单（Layer 2 · a2ui skill） ───────────────
│              委托 a2ui skill 根据字段 schema 动态生成表单
│              use_skill(skill_name="a2ui", reason="生成任务创建表单")
│
│  ── Step 4: 创建任务 ─────────────────────────────────────────
├── scripts/
│   └── 03-create_task.sh        # 调用 TEAM create API
│
│  ── Step 5: 任务描述模板 ─────────────────────────────────────
├── templates/
│   ├── task-template.html       # HTML 富文本描述模板
│   └── README.md                # 模板使用说明
│
│  ── 技能文档 ──────────────────────────────────────────────────
├── SKILL.md                     # 主技能文件（本文件）
├── README.md                    # 技能使用说明
└── CHANGELOG.md                 # 版本历史
```

---

## 🚀 首次使用？请先运行配置向导！

如果这是你第一次使用本技能，请运行配置向导完成初始化：

```bash
bash ~/.codex/skills/team-task-manager/scripts/01-setup.sh
```

**配置向导会引导你完成**：
1. ✅ 用户基本信息（快手邮箱和中文名）
2. ✅ API 认证配置（APP_KEY 和 SECRET_KEY）
3. ✅ 项目默认配置（项目ID、分类ID、任务组ID等）
4. ✅ 同事名单（可选，方便创建任务时使用）

**获取 API 凭证**：
如果您还没有 TEAM OpenAPI 凭证，请访问：
🔗 https://docs.corp.kuaishou.com/d/home/fcACUPcoqNTCz9vZj284YOCHk

---

## 概述

这是快手 TEAM 项目管理系统的任务管理技能，支持：
- **创建任务**：在指定项目和分类下创建新任务
- **查询分类**：获取项目下的任务分类列表
- **获取字段信息**：查询任务分类的必填字段和可选字段
- **查询任务组**：获取项目下的任务组（Section）列表
- **首次配置向导**：交互式配置体验
- **同事名单管理**：便捷的团队成员管理

## API 配置信息

| 配置项 | 说明 |
|--------|-----|
| **API Key** | 存储在环境变量 `TEAM_APP_KEY` 中 |
| **Secret Key** | 存储在环境变量 `TEAM_SECRET_KEY` 中 |
| **Gateway URL** | `https://is-gateway.corp.kuaishou.com` |
| **Token 获取** | POST `/token/get` |
| **Token 有效期** | 12小时（43200秒） |
| **认证方式** | `Authorization: Bearer <accessToken>` |

### 环境变量配置

本技能使用环境变量存储敏感信息（API密钥），避免密钥泄漏。

**推荐方式：使用配置向导（一键配置）**

```bash
cd ~/.codeflicker/skills/team-task-manager
bash scripts/setup.sh
```

配置向导会交互式地收集所有必需信息，并自动生成配置文件。

**手动配置方式**：

1. 复制示例配置文件：
```bash
cd ~/.codeflicker/skills/team-task-manager
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的实际凭证：
```bash
TEAM_APP_KEY="your_actual_app_key"
TEAM_SECRET_KEY="your_actual_secret_key"
```

3. 确保 `.env` 文件权限安全：
```bash
chmod 600 .env
```

**注意事项**：
- ⚠️ **绝对不要**将 `.env` 文件提交到 Git
- ✅ `.gitignore` 已配置忽略 `.env` 文件
- ✅ 脚本会自动从 `.env` 加载配置

### 配置文件说明

本技能使用多个配置文件管理不同类型的信息：

#### 1. `.env`（环境变量 - 敏感信息）

**作用**：存储 API 认证凭证和默认配置
**安全级别**：⚠️ 高度敏感，不可提交到 Git

```bash
# API 认证
TEAM_APP_KEY="9c7d5af0-761a-4d92-95d5-f3c33d79085e"
TEAM_SECRET_KEY="c1ebbf9b60866116b3c98232ee3f78b3"

# 默认配置
TEAM_PROJECT_ID="P98273"
TEAM_TASK_CLASS_ID="287676"
TEAM_SECTION_ID="S248305"
TEAM_OPERATOR="wangyihan"
TEAM_DEFAULT_PRIORITY="65"
TEAM_DEFAULT_STATUS="3215447"

# API 网关
TEAM_BASE_URL="https://is-gateway.corp.kuaishou.com"
```

#### 2. `user-config.json`（用户配置）

**作用**：存储用户个人信息和项目配置
**安全级别**：一般，包含非敏感信息

```json
{
  "user": {
    "username": "wangyihan",
    "email": "wangyihan@kuaishou.com",
    "chineseName": "王一寒"
  },
  "project": {
    "projectId": "P98273",
    "taskClassId": "287676",
    "sectionId": "S248305",
    "defaultPriority": 65,
    "defaultStatus": "3215447"
  },
  "setupComplete": true,
  "setupDate": "2026-03-24T12:00:00Z"
}
```

#### 3. `team-members.json`（同事名单 - 可选）

**作用**：管理常用的团队成员信息
**安全级别**：一般，公司内部信息

```json
[
  {
    "username": "qujunyan",
    "email": "qujunyan@kuaishou.com",
    "chineseName": "曲俊燕",
    "role": "UI设计师"
  },
  {
    "username": "cuileizhen",
    "email": "cuileizhen@kuaishou.com",
    "chineseName": "崔磊振",
    "role": "开发工程师"
  }
]
```

**用途**：
- 快速查找同事的 username（创建任务时使用）
- 自动填充任务的参与人信息
- 方便团队协作

**管理方式**：
- 首次配置时通过向导添加
- 手动编辑 `team-members.json` 文件
- 参考 `team-members.json.example` 示例

## 触发场景

当用户说以下内容时，使用此技能：

**创建任务场景**：
- "创建 TEAM 任务"
- "在 TEAM 里创建任务"
- "帮我在项目 P98273 下加个任务"
- "在产品需求分类下新建一个任务"
- "给客户端任务组创建一个任务"

**查询信息场景**：
- "查询项目的任务分类"
- "获取分类的字段信息"
- "项目下有哪些任务组"
- "这个分类有哪些必填字段"

## 核心流程

### ⚡ 标准工作流（严格遵守）

**用户触发创建任务关键词后，立即执行以下步骤，不得询问任何问题：**

```
第一步：后台静默获取 accessToken（execute_command，不输出）
第二步：构造字段 schema，调用 use_skill("a2ui") 生成表单 JSON
```

**✅ 正确交互模式**：
```
用户：创建 TEAM 任务
AI：[调用 a2ui skill，立即输出 A2UI JSON]

用户：[填写后发回 JSON]
AI：[立即调用 API 创建，返回任务 ID]
```

### 🎨 A2UI 表单交互流程

当用户触发创建任务时，使用 **a2ui skill** 生成交互表单。

**两层协作架构**：
- **Layer 1（本技能）**：负责 API 调用、字段定义、数据提交
- **Layer 2（a2ui skill）**：负责将字段 schema 转成可填写的 A2UI 表单 JSON

**执行步骤**：

1. **后台获取 accessToken**（本技能，静默执行）

2. **构造字段 schema 并调用 a2ui**（本技能传递给 a2ui skill）：
   ```
   use_skill(skill_name="a2ui", reason="生成 TEAM 任务创建表单")
   ```
   传入以下字段 schema（`{{TEAM_OPERATOR}}` 和 `{{TEAM_DEFAULT_PRIORITY}}` 从 `.env` 替换为实际值）：
   ```json
   {
     "task": "生成任务创建表单",
     "fields": [
       { "key": "title",       "label": "任务标题", "type": "shortText",  "required": true,  "placeholder": "请输入任务标题" },
       { "key": "description", "label": "任务描述", "type": "longText",   "required": false, "placeholder": "请输入任务描述（可选）" },
       { "key": "assignee",    "label": "执行人",   "type": "shortText",  "required": true,  "placeholder": "快手用户名（如 liyuanmeng05）", "default": "{{TEAM_OPERATOR}}" },
       { "key": "reporter",    "label": "报告人",   "type": "shortText",  "required": true,  "placeholder": "快手用户名", "default": "{{TEAM_OPERATOR}}" },
       { "key": "priority",    "label": "优先级",   "type": "SELECT",     "required": true,  "default": "{{TEAM_DEFAULT_PRIORITY}}",
         "choices": [
           { "label": "最高优", "value": "63" },
           { "label": "高优",   "value": "64" },
           { "label": "中等",   "value": "65" },
           { "label": "较低",   "value": "66" },
           { "label": "极低",   "value": "67" }
         ]
       },
       { "key": "endAt",       "label": "截止日期", "type": "DATE",       "required": false },
       { "key": "participant", "label": "参与人",   "type": "shortText",  "required": false, "placeholder": "多个用户名以逗号分隔" }
     ],
     "submitAction": { "event": { "name": "submit_task_form" } },
     "cancelAction":  { "event": { "name": "cancel_form" } }
   }
   ```

3. **a2ui skill 生成并输出表单 JSON**（a2ui skill 负责，符合 A2UI v0.9 规范）

4. **用户提交后回到本技能处理**（见下方"用户回传 JSON 后的处理流程"）

### 用户回传 JSON 后的处理流程

当用户发回填写好的 A2UI JSON 时（含 `updateDataModel.contents`），**立即执行**：

1. 从 `updateDataModel.contents` 提取字段值：`title`, `description`, `assignee`, `reporter`, `priority`, `endAt`, `participant`
2. 获取 accessToken（`source .env` + POST `/token/get`）
3. 调用 create API（`endAt` 字段**不放入** `fields`，直接放顶层；`participant` 为空时不传）
4. 返回任务 ID 和简短成功提示

**字段提取规则**：
- `priority`：从 `contents.priority` 取值（如 `"65"`），放入 `fields.priority`
- `assignee`/`reporter`/`participant`：USER_PICKER 类型，值为数组 `["username"]`；`participant` 逗号分隔时拆分为数组
- `endAt`：如有值，放到 create API 请求体**顶层**（非 fields 内），格式为毫秒时间戳
- `status`：固定使用 `.env` 中的 `TEAM_DEFAULT_STATUS`

**字段值回写规则**（a2ui 表单提交数据 → TEAM API 格式）：

| 字段 | 处理方式 |
|------|---------|
| `assignee` / `reporter` | USER_PICKER 类型，包装为数组 `["username"]` |
| `participant` | 逗号分隔时拆分为数组 `["u1", "u2"]`；为空时不传 |
| `priority` | 包装为数组 `["65"]` |
| `endAt` | 放到请求体**顶层**（非 fields 内），转为毫秒时间戳 |
| `status` | 不放入表单，由本技能自动填充 `.env` 中的 `TEAM_DEFAULT_STATUS` |

## API 详细说明

### 1. 获取 AccessToken

**必须先获取 accessToken 才能调用其他 API**

**API**: `POST /token/get`

```bash
curl -s -X POST "https://is-gateway.corp.kuaishou.com/token/get" \
  -H "Content-Type: application/json" \
  -d '{
    "appKey": "${TEAM_APP_KEY}",
    "secretKey": "${TEAM_SECRET_KEY}",
    "grantType": "client_credentials"
  }'
```

**返回示例**:
```json
{
  "code": 0,
  "message": "OK",
  "result": {
    "appId": 551041,
    "accessToken": "e52dcaec-10e1-4823-bbb1-dcb31392c65c",
    "expireTime": 43200,
    "refreshToken": "73fcb558-c1db-48c6-9773-f89bb67c68ea"
  }
}
```

### 2. 查询项目任务分类

**API**: `GET /pm/api/no-ba/external/task/listTaskClasses`

```bash
curl -X GET "https://is-gateway.corp.kuaishou.com/pm/api/no-ba/external/task/listTaskClasses?projectId=P98273&operator=wangyihan" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json"
```

**参数说明**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| projectId | String | 是 | 项目ID，如 P98273 |
| operator | String | 是 | 操作人用户名 |

**返回示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "result": [
    {
      "taskClassId": 287676,
      "taskClassName": "产品需求",
      "workflowId": 237125,
      "workflowName": "【研发效能中心】产品需求工作流",
      "group": "demand",
      "type": "demand",
      "taskNum": 17
    }
  ]
}
```

### 3. 获取任务分类字段信息

**API**: `GET /pm/api/no-ba/external/task/getFields`

```bash
curl -X GET "https://is-gateway.corp.kuaishou.com/pm/api/no-ba/external/task/getFields?taskClassId=287676&operator=wangyihan" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json"
```

**参数说明**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| taskClassId | Integer | 是 | 分类标识 |
| operator | String | 是 | 操作人用户名 |

**返回示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "result": [
    {
      "fieldKey": "assignee",
      "fieldName": "执行人",
      "fieldType": "USER_PICKER",
      "required": true,
      "defaultValue": null,
      "fieldItemModels": null
    },
    {
      "fieldKey": "priority",
      "fieldName": "优先级",
      "fieldType": "DROP_DOWN_SINGLE",
      "required": true,
      "defaultValue": null,
      "fieldItemModels": [
        {"itemName": "最高优", "itemValue": "63"},
        {"itemName": "高优", "itemValue": "64"},
        {"itemName": "中等", "itemValue": "65"}
      ]
    }
  ]
}
```

### 4. 创建任务

**API**: `POST /pm/api/no-ba/external/task/create`

```bash
curl -X POST "https://is-gateway.corp.kuaishou.com/pm/api/no-ba/external/task/create" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "任务标题",
    "description": "任务描述",
    "projectId": "P98273",
    "taskClass": "287676",
    "sectionId": "S248305",
    "operator": "wangyihan",
    "fields": {
      "assignee": ["wangyihan"],
      "reporter": ["wangyihan"],
      "priority": ["65"],
      "status": ["3215447"]
    }
  }'
```

**Body 参数说明**:
| 字段名称 | 字段类型 | 是否必填 | 说明 |
|---------|---------|---------|------|
| title | String | **是** | 任务标题 |
| description | String | 否 | 任务描述（支持HTML格式，见下方说明） |
| projectId | String | **是** | 项目ID |
| taskClass | String | **是** | 任务分类ID |
| sectionId | String | **是** | 任务组ID |
| operator | String | **是** | 操作人username |
| fields | Object | 否 | 字段信息集合，需包含所有必填字段 |

#### 任务描述格式支持

**重要**：description 字段支持简单 HTML 标签，**禁止使用 CSS 样式**。

支持的 HTML 标签：

| 标签类型 | 标签示例 | 说明 |
|---------|---------|------|
| **标题** | `<h1>标题</h1>` `<h2>二级标题</h2>` `<h3>三级标题</h3>` | 三级标题 |
| **段落** | `<p>内容</p>` | 段落内容 |
| **加粗** | `<b>粗体</b>` | 加粗文本 |
| **列表** | `<ul><li>无序1</li><li>无序2</li></ul>` | 无序列表 |
|  | `<ol><li>有序1</li><li>有序2</li></ol>` | 有序列表 |
| **链接** | `<a href='URL' target='_blank'>链接文本</a>` | 超链接（建议添加 target='_blank'） |
| **图片** | `<img src='URL' alt='描述' height='250' width='250'>` | 不推荐使用（存在XSS风险） |
| **其他** | `<br>` | 换行 |
|  | `<hr>` | 分割线 |

**示例（HTML格式）**：
```html
<h2>需求文档</h2>
<p><a href='https://docs.corp.kuaishou.com/k/home/xxx' target='_blank'>产品需求文档</a></p>
<hr>
<h2>设计稿</h2>
<p><a href='https://www.figma.com/design/xxx' target='_blank'>Figma 设计稿</a></p>
<hr>
<h2>团队协作</h2>
<ul>
<li><b>产品经理</b>：王一寒</li>
<li><b>UI设计师</b>：曲俊燕</li>
<li><b>开发工程师</b>：崔磊振</li>
</ul>
<hr>
<p><small>✨ Created by CodeFlicker @wangyihan</small></p>
```

**水印说明**：
- ✨ 脚本会自动在任务描述末尾添加水印："✨ Created by CodeFlicker @wangyihan"
- 水印格式：`<hr><p><small>✨ Created by CodeFlicker @wangyihan</small></p>`
- 如果不想要水印，可以在API调用时手动构造description，不使用脚本

**注意事项**：
- ⚠️ **禁止使用 CSS 样式**（如 `style="color:red"`）
- ⚠️ **不推荐使用 `<img>` 标签**，存在 XSS 攻击风险
- ✅ 链接建议使用 `target='_blank'` 在新窗口打开
- ✅ 使用 `<hr>` 分割线可以让内容更清晰

**返回示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "result": {
    "taskId": "T11117111",
    "taskClass": 287676
  }
}
```

## 常用项目配置

### 项目 P98273（研发效能中心）

| 配置项 | 值 |
|--------|-----|
| **项目ID** | P98273 |
| **操作人** | wangyihan |
| **任务分类** | 287676（产品需求）、287681（技术预研） |
| **任务组** | S248305（客户端） |

**必填字段（分类 287676）**:
- `status`: 任务状态（DROP_DOWN_SINGLE）
- `assignee`: 执行人（USER_PICKER）
- `priority`: 优先级（DROP_DOWN_SINGLE）
  - 65: 中等
  - 64: 高优
  - 63: 最高优
- `reporter`: 报告人（USER_PICKER）

**默认状态值**:
- `3215447`: 待处理（示例值，具体请通过 getFields 获取）

## 使用示例

### 示例 1：使用脚本创建任务（推荐）

```bash
# 确保已配置 .env 文件
cd ~/.codeflicker/skills/team-task-manager

# 使用默认配置创建任务
bash scripts/create_task.sh "修复登录Bug" "用户反馈登录失败，需要排查并修复"

# 指定优先级（64=高优）
bash scripts/create_task.sh "修复登录Bug" "用户反馈登录失败" "64"
```

### 示例 2：使用HTML格式创建任务（推荐用于富文本描述）

```bash
#!/bin/bash

# 加载环境变量
source ~/.codeflicker/skills/team-task-manager/.env

# 1. 获取 token
TOKEN_RESPONSE=$(curl -s -X POST "https://is-gateway.corp.kuaishou.com/token/get" \
  -H "Content-Type: application/json" \
  -d "{
    \"appKey\": \"${TEAM_APP_KEY}\",
    \"secretKey\": \"${TEAM_SECRET_KEY}\",
    \"grantType\": \"client_credentials\"
  }")

ACCESS_TOKEN=$(echo "${TOKEN_RESPONSE}" | python3 -c "import sys, json; print(json.load(sys.stdin).get('result', {}).get('accessToken', ''))")

# 2. 创建任务 - 使用HTML格式描述
curl -X POST "https://is-gateway.corp.kuaishou.com/pm/api/no-ba/external/task/create" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "B2-4 多媒体",
    "description": "<h2>需求文档</h2><p><a href=\"https://docs.corp.kuaishou.com/k/home/xxx\" target=\"_blank\">产品需求文档</a></p><hr><h2>设计稿</h2><p><a href=\"https://www.figma.com/design/xxx\" target=\"_blank\">Figma 设计稿</a></p><hr><h2>UI 交付时间</h2><p>UI 3.24 @曲俊燕</p><hr><h2>需求说明</h2><p>B2-4 多媒体，支持：图片</p><hr><h2>团队协作</h2><ul><li><b>产品经理</b>：王一寒</li><li><b>UI设计师</b>：曲俊燕</li><li><b>开发工程师</b>：崔磊振</li><li><b>任务参与人</b>：曲俊燕、崔磊振</li></ul>",
    "projectId": "${TEAM_PROJECT_ID}",
    "taskClass": "${TEAM_TASK_CLASS_ID}",
    "sectionId": "${TEAM_SECTION_ID}",
    "operator": "${TEAM_OPERATOR}",
    "fields": {
      "assignee": ["cuileizhen"],
      "reporter": ["wangyihan"],
      "priority": ["65"],
      "status": ["${TEAM_DEFAULT_STATUS}"],
      "participant": ["qujunyan", "cuileizhen"],
      "rd": ["cuileizhen"],
      "pm": ["wangyihan"]
    }
  }'
```

### 示例 3：从代码调用（纯文本描述）

```bash
#!/bin/bash

# 加载环境变量
source ~/.codeflicker/skills/team-task-manager/.env

# 1. 获取 token
TOKEN_RESPONSE=$(curl -s -X POST "https://is-gateway.corp.kuaishou.com/token/get" \
  -H "Content-Type: application/json" \
  -d "{
    \"appKey\": \"${TEAM_APP_KEY}\",
    \"secretKey\": \"${TEAM_SECRET_KEY}\",
    \"grantType\": \"client_credentials\"
  }")

ACCESS_TOKEN=$(echo "${TOKEN_RESPONSE}" | python3 -c "import sys, json; print(json.load(sys.stdin).get('result', {}).get('accessToken', ''))")

# 2. 创建任务
curl -X POST "https://is-gateway.corp.kuaishou.com/pm/api/no-ba/external/task/create" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"修复登录Bug\",
    \"description\": \"用户反馈登录失败，需要排查并修复\",
    \"projectId\": \"${TEAM_PROJECT_ID}\",
    \"taskClass\": \"${TEAM_TASK_CLASS_ID}\",
    \"sectionId\": \"${TEAM_SECTION_ID}\",
    \"operator\": \"${TEAM_OPERATOR}\",
    \"fields\": {
      \"assignee\": [\"${TEAM_OPERATOR}\"],
      \"reporter\": [\"${TEAM_OPERATOR}\"],
      \"priority\": [\"64\"],
      \"status\": [\"${TEAM_DEFAULT_STATUS}\"]
    }
  }"
```

## 错误处理

### 常见错误码

| 错误码 | 错误信息 | 解决方案 |
|--------|---------|---------|
| 40100 | OpenAccessToken invalid | accessToken 无效，重新获取 token |
| 40101 | OpenAccessToken无效, 认证失败 | 检查 appKey 是否正确 |
| 400 | 请选择任务组 | 缺少 sectionId 参数 |
| 405009 | 必填字段不能为空 | 检查并填充所有必填字段 |
| 40024 | 接口未接入 | 该接口未被授权给当前 appKey |

### 调试技巧

1. **先获取字段信息**：创建任务前，务必先调用 `getFields` 接口获取必填字段列表
2. **检查任务组ID**：如果无法自动获取任务组，需要手动指定 sectionId
3. **Token 有效期**：accessToken 有效期 12 小时，建议每次操作重新获取
4. **字段值格式**：所有字段值都是数组格式，即使是单选字段也要用 `["value"]`

## 注意事项

1. **必填字段**：不同的任务分类可能有不同的必填字段，创建任务前必须调用 `getFields` 查询
2. **任务组ID**：sectionId 是必填的，如果项目配置接口未授权，需要手动从 TEAM 系统获取
3. **字段值类型**：
   - `USER_PICKER`: 用户名数组，如 `["wangyihan"]`
   - `DROP_DOWN_SINGLE`: 单选下拉框，值为选项的 itemValue
   - `DATE_TIME`: 时间戳或日期字符串
4. **Token 管理**：建议在脚本中实现 token 缓存机制，避免频繁请求

## 相关文档

- OpenAPI 文档：https://openapi.corp.kuaishou.com/doc/43cf05d4-1061-11eb-9767-246e96a03088
- Token 获取文档：https://openapi.corp.kuaishou.com（产品使用手册 > 接口调用）
- TEAM 系统：内部项目管理平台

## 版本历史

- **v1.1.0** (2026-03-26)
  - 接入 a2ui skill（Layer 2）：表单渲染改为通过字段 schema 委托 a2ui skill 动态生成
  - 移除硬编码 `a2ui/02-form-template.json`，改为运行时由 a2ui skill 生成
  - 架构层级更新：Layer 2 由 a2ui-integrator 描述改为直接引用 a2ui skill

- **v1.0.0** (2026-03-24)
  - 初始版本
  - 支持创建任务、查询分类、获取字段信息
  - 完整的认证流程和错误处理

## P0 交付前自审（强制）

创建任务后，必须执行以下自审：

### 1. 完备性检查
- [ ] 已获取 accessToken
- [ ] 已确认项目ID、分类ID、任务组ID
- [ ] 已填充所有必填字段
- [ ] 任务标题和描述清晰明确

### 2. 正确性检查
- [ ] API 返回 code=0，表示成功
- [ ] 获取到有效的 taskId
- [ ] 字段值格式正确（数组格式）

### 3. 清晰度检查
- [ ] 任务标题能准确描述任务内容
- [ ] 任务描述包含必要的背景信息
- [ ] 分配给了正确的执行人

### 4. 用户确认
- [ ] 向用户反馈任务创建结果
- [ ] 提供任务ID和访问链接（如有）
