# TEAM Task Manager Skill

快手 TEAM 项目管理系统任务操作技能。

## 🚀 首次使用指南

### 第一次使用？运行配置向导！

```bash
cd ~/.codeflicker/skills/team-task-manager
bash scripts/setup.sh
```

配置向导会引导你完成：
1. ✅ 用户基本信息（快手邮箱和中文名）
2. ✅ API 认证配置（APP_KEY 和 SECRET_KEY）
3. ✅ 项目默认配置（项目ID、分类ID、任务组ID等）
4. ✅ 同事名单（可选，方便创建任务时使用）

### 获取 API 凭证

如果您还没有 TEAM OpenAPI 凭证，请访问：
🔗 https://docs.corp.kuaishou.com/d/home/fcACUPcoqNTCz9vZj284YOCHk

## 功能特性

- ✅ 首次使用配置向导
- ✅ 创建任务（支持HTML格式描述）
- ✅ 查询项目任务分类
- ✅ 获取分类字段信息
- ✅ 完整的认证流程
- ✅ 错误处理和调试支持
- ✅ 自动水印标识
- ✅ 同事名单管理

## 快速开始

### 方式一：使用配置向导（推荐）

```bash
cd ~/.codeflicker/skills/team-task-manager
bash scripts/setup.sh
```

### 方式二：手动配置

如果你更喜欢手动配置：

1. **复制配置模板**
```bash
cd ~/.codeflicker/skills/team-task-manager
cp .env.example .env
```

2. **编辑 .env 文件**
```bash
vim .env
# 填入你的实际凭证和配置
```

3. **创建用户配置文件**
```bash
cat > user-config.json << 'EOF'
{
  "user": {
    "username": "your_username",
    "email": "your_email@kuaishou.com",
    "chineseName": "你的中文名"
  },
  "project": {
    "projectId": "P98273",
    "taskClassId": "287676",
    "sectionId": "S248305",
    "defaultPriority": 65,
    "defaultStatus": "3215447"
  },
  "setupComplete": true
}
EOF
```

⚠️ **安全提示**：
- `.env` 文件包含敏感信息，**绝对不要**提交到 Git
- 已在 `.gitignore` 中忽略 `.env` 文件

### 2. 加载技能

在 CodeFlicker 中使用：

```
use_skill(skill_name="team-task-manager", reason="创建 TEAM 任务")
```

### 3. 创建任务

#### 方式一：使用脚本（推荐）

```bash
# 基础用法
bash scripts/create_task.sh "任务标题" "任务描述"

# 指定优先级
bash scripts/create_task.sh "修复登录Bug" "用户反馈登录失败" "64"

# HTML格式描述
bash scripts/create_task.sh "B2-4 多媒体" "<h2>需求说明</h2><p>支持图片上传</p>"
```

#### 方式二：通过 AI 助手

只需告诉 AI：

```
在项目 P98273 的产品需求分类下，给客户端任务组创建一个任务：
标题：修复登录Bug
描述：用户反馈登录失败，需要排查并修复
优先级：高优
```

AI 会自动：
1. 获取 accessToken
2. 查询必填字段
3. 填充默认值
4. 创建任务
5. 返回任务ID

### 4. 查询信息

```bash
# 查询任务分类
bash scripts/get_fields.sh 287676 wangyihan

# 或通过 AI
查询项目 P98273 下的任务分类
查询分类 287676 的字段信息
```

## 配置文件说明

### .env（环境变量，敏感信息）

```bash
# API 认证
TEAM_APP_KEY="your_app_key"
TEAM_SECRET_KEY="your_secret_key"

# 默认配置
TEAM_PROJECT_ID="P98273"
TEAM_TASK_CLASS_ID="287676"
TEAM_SECTION_ID="S248305"
TEAM_OPERATOR="wangyihan"
TEAM_DEFAULT_PRIORITY="65"
TEAM_DEFAULT_STATUS="3215447"
```

### user-config.json（用户配置）

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

### team-members.json（同事名单，可选）

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

## 配置信息

| 项目 | 项目ID | 常用分类 | 常用任务组 |
|------|-------|---------|-----------|
| 研发效能中心 | P98273 | 287676（产品需求）<br>287681（技术预研） | S248305（客户端） |

## 模板使用

所有任务模板都在 `templates/` 目录：

```bash
# 查看模板
cat templates/task-template.html

# 查看使用说明
cat templates/README.md
```

## 使用示例脚本

参考 `scripts/create_task.sh` 查看完整的任务创建示例。

## 注意事项

1. **必填字段**：不同任务分类的必填字段不同，建议先查询字段信息
2. **任务组ID**：sectionId 是必填的，可以从 TEAM 系统页面获取
3. **Token 有效期**：accessToken 有效期 12 小时
4. **字段值格式**：所有字段值都使用数组格式
5. **HTML支持**：任务描述支持简单HTML标签（h1-h3, p, b, ul/ol/li, a, hr, br）
6. **自动水印**：通过脚本创建的任务会自动添加 "✨ Created by CodeFlicker @wangyihan"

## 故障排查

### 首次配置失败

1. 确认 API 凭证是否正确
2. 检查网络连接
3. 查看配置向导的错误提示
4. 重新运行 `bash scripts/setup.sh`

### 创建任务失败

1. 检查是否获取到有效的 accessToken
2. 确认所有必填字段已填充
3. 验证 sectionId 是否正确
4. 查看错误信息中的具体提示

### Token 失效

重新调用 `/token/get` 接口获取新 token（脚本会自动处理）。

### 配置文件丢失

运行配置向导重新生成：

```bash
bash scripts/setup.sh
```

## 相关文档

- [SKILL.md](./SKILL.md) - 完整的技能文档
- [templates/README.md](./templates/README.md) - 模板使用指南
- [SECURITY.md](./SECURITY.md) - 安全配置指南
- [OpenAPI 文档](https://openapi.corp.kuaishou.com/doc/43cf05d4-1061-11eb-9767-246e96a03088)

## 版本历史

- **v1.1.0** - 2026-03-24
  - ✨ 新增首次配置向导（setup.sh）
  - ✨ 新增用户配置管理（user-config.json）
  - ✨ 新增同事名单管理（team-members.json）
  - ✨ 优化开箱体验
  - ✨ 新增任务模板系统

- **v1.0.0** - 2026-03-24
  - 初始版本
  - 支持基本的任务创建和查询功能

