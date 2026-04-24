# 安全配置指南

## 环境变量管理

本 Skill 使用环境变量存储敏感信息（API 密钥），确保安全性。

### 文件说明

| 文件 | 说明 | 是否提交到 Git |
|------|------|--------------|
| `.env` | **实际配置文件**，包含真实密钥 | ❌ **绝对不要提交** |
| `.env.example` | 配置文件模板，仅包含占位符 | ✅ 可以提交 |
| `.gitignore` | 已配置忽略 `.env` 文件 | ✅ 可以提交 |

### 首次配置步骤

1. **复制模板文件**
   ```bash
   cd ~/.codeflicker/skills/team-task-manager
   cp .env.example .env
   ```

2. **编辑配置文件**
   ```bash
   vim .env
   # 或使用你喜欢的编辑器
   ```

3. **填入真实凭证**
   ```bash
   TEAM_APP_KEY="your_actual_app_key_here"
   TEAM_SECRET_KEY="your_actual_secret_key_here"
   ```

4. **设置文件权限**（可选但推荐）
   ```bash
   chmod 600 .env
   ```
   这确保只有文件所有者能读写。

### 如何获取 API 凭证

1. 访问 [快手 OpenAPI 平台](https://openapi.corp.kuaishou.com)
2. 注册应用
3. 获取 `appKey` 和 `secretKey`
4. 将凭证填入 `.env` 文件

### 环境变量说明

#### 必填环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `TEAM_APP_KEY` | OpenAPI 应用密钥 | `9c7d5af0-761a-4d92-95d5-f3c33d79085e` |
| `TEAM_SECRET_KEY` | OpenAPI 密钥 | `c1ebbf9b60866116b3c98232ee3f78b3` |

#### 可选环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `TEAM_PROJECT_ID` | 默认项目ID | `P98273` |
| `TEAM_OPERATOR` | 默认操作人 | `wangyihan` |
| `TEAM_TASK_CLASS_ID` | 默认任务分类 | `287676` |
| `TEAM_SECTION_ID` | 默认任务组 | `S248305` |
| `TEAM_DEFAULT_PRIORITY` | 默认优先级 | `65` |
| `TEAM_DEFAULT_STATUS` | 默认状态 | `3215447` |
| `TEAM_BASE_URL` | API 网关地址 | `https://is-gateway.corp.kuaishou.com` |

### 安全最佳实践

#### ✅ 应该做的事

1. **使用环境变量**
   - 所有敏感信息都应存储在 `.env` 文件中
   - 脚本从环境变量读取配置

2. **保护 `.env` 文件**
   - 设置严格的文件权限：`chmod 600 .env`
   - 确保不被意外提交到 Git

3. **定期更新密钥**
   - 定期轮换 API 密钥
   - 如果密钥泄漏，立即更换

4. **使用不同环境的不同密钥**
   - 开发环境：使用测试密钥
   - 生产环境：使用生产密钥

#### ❌ 不应该做的事

1. **不要硬编码密钥**
   ```bash
   # ❌ 错误示例
   APP_KEY="9c7d5af0-761a-4d92-95d5-f3c33d79085e"
   
   # ✅ 正确示例
   APP_KEY="${TEAM_APP_KEY}"
   ```

2. **不要提交 `.env` 文件**
   - 检查 `.gitignore` 是否包含 `.env`
   - 提交前使用 `git status` 确认

3. **不要在日志中打印密钥**
   ```bash
   # ❌ 错误示例
   echo "Using API Key: ${APP_KEY}"
   
   # ✅ 正确示例
   echo "Using API Key: ${APP_KEY:0:10}..."
   ```

4. **不要共享 `.env` 文件**
   - 通过安全渠道（如密码管理器）共享密钥
   - 不要通过邮件、聊天工具发送

### 如果密钥泄漏了怎么办？

1. **立即更换密钥**
   - 登录 OpenAPI 平台
   - 生成新的密钥
   - 更新 `.env` 文件

2. **检查使用记录**
   - 查看 API 调用日志
   - 确认是否有异常访问

3. **通知管理员**
   - 如果是企业应用，通知安全团队

### 验证配置

检查环境变量是否正确加载：

```bash
# 测试查询接口
bash scripts/get_fields.sh 287676 wangyihan

# 如果看到"错误：未找到 API 凭证"，说明配置有问题
# 检查 .env 文件是否存在且格式正确
```

### 故障排查

#### 错误：未找到 API 凭证

**原因**：
- `.env` 文件不存在
- `.env` 文件路径不正确
- 环境变量名称错误

**解决方案**：
```bash
# 1. 检查文件是否存在
ls -la ~/.codeflicker/skills/team-task-manager/.env

# 2. 检查文件内容
cat ~/.codeflicker/skills/team-task-manager/.env

# 3. 确保变量名正确
# 应该是 TEAM_APP_KEY 而不是 APP_KEY
```

#### 错误：权限被拒绝

**原因**：
- `.env` 文件权限设置过严

**解决方案**：
```bash
chmod 644 ~/.codeflicker/skills/team-task-manager/.env
```

### 相关文档

- [OpenAPI 文档](https://openapi.corp.kuaishou.com)
- [SKILL.md](./SKILL.md) - 完整的技能文档
- [README.md](./README.md) - 快速开始指南

## 总结

✅ 使用环境变量存储敏感信息
✅ 不要提交 `.env` 文件到 Git
✅ 设置严格的文件权限
✅ 定期更新密钥
✅ 如果泄漏立即更换

遵循这些安全最佳实践，可以有效保护你的 API 密钥。
