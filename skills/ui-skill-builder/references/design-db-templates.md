# 设计数据库默认模板

当用户不确定如何填写设计数据库时，参考以下默认值和修改指南。

---

## color.md 默认模板

```markdown
# 颜色系统

## 品牌主色

| Token | 值 | 用途 |
|-------|-----|------|
| `colorPrimary` | #165DFF | 主色，按钮、链接、选中态 |
| `colorPrimaryHover` | #4080FF | 悬停态 |
| `colorPrimaryActive` | #0E42D2 | 按下态 |
| `colorPrimaryBg` | #E8F3FF | 主色浅底色，选中行背景 |
| `colorPrimaryBorder` | #BEDAFF | 主色边框 |

## 功能色

| Token | 值 | 用途 |
|-------|-----|------|
| `colorSuccess` | #30C453 | 成功状态 |
| `colorSuccessBg` | #DAF7DD | 成功浅底 |
| `colorWarning` | #FF7429 | 警告/橙色 |
| `colorWarningBg` | #FFECE0 | 警告浅底 |
| `colorError` | #F53F3F | 危险/错误 |
| `colorErrorBg` | #FEECE8 | 错误浅底 |
| `colorInfo` | #165DFF | 信息色（同主色） |

## 中性色

| Token | 值 | 用途 |
|-------|-----|------|
| `colorText` | #1D2129 | 主要文字 |
| `colorTextSecondary` | #4E5969 | 次要文字 |
| `colorTextTertiary` | #86909C | 辅助文字，Label |
| `colorTextQuaternary` | #C9CDD4 | 禁用/占位文字 |
| `colorTextPlaceholder` | #BBBDBF | 空值占位（`–`） |

## 页面结构色

| 用途 | 值 |
|------|-----|
| 页面背景 | #F5F6F8 |
| 卡片/白色区域 | #FFFFFF |
| 边框线 | #E5E6E8 |
| 分割线 | #F2F3F5 |
| 表头背景 | #F5F6F8 |
| 悬停行背景 | #F7F8FA |

## 状态色用法

### 标签/状态指示点

```tsx
// 运行中
<span style={{ background: '#DAF7DD', borderRadius: 10 }}>
  <span style={{ background: '#30C453', /* dot */ }} />
  运行中
</span>

// 已停止
<span style={{ background: '#F2F3F5' }}>
  <span style={{ background: '#86909C' }} />
  已停止
</span>

// 异常/失败
<span style={{ background: '#FEECE8' }}>
  <span style={{ background: '#F53F3F' }} />
  异常
</span>

// 排队中
<span style={{ background: '#FFF7E8' }}>
  <span style={{ background: '#FF9A2E' }} />
  排队中
</span>
```
```

---

## typography.md 默认模板

```markdown
# 字体规范

## 字体栈

```css
/* 全局字体 */
font-family: 'PingFang SC', 'HarmonyOS Sans SC', 'Microsoft YaHei', 
             -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* 代码字体 */
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
```

## 字号层级

| 级别 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| 页面标题 | 20px | 28px | 500 | 页面 PageHeader 大标题 |
| 区块标题 | 16px | 24px | 500 | 卡片、Tab 内分组标题 |
| 正文标准 | 14px | 22px | 400 | 表格内容、表单 Label/Value |
| 小文字 | 12px | 20px | 400 | 辅助说明、时间戳、元信息 |
| 数字大字 | 28px | 36px | 600 | Dashboard 统计卡片数值 |

## 文字颜色层级

| 层级 | 颜色 | 用途 |
|------|------|------|
| 主要文字 | #1D2129 | 页面标题、表格内容 |
| 次要文字 | #4E5969 | 副标题、操作项 |
| 辅助文字 | #86909C | Label、元信息 |
| 禁用文字 | #C9CDD4 | 不可用状态 |
| 空值占位 | #BBBDBF | 表格中的 `–` |

## 全局平滑设置（index.html 必须加）

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```
```

---

## copywriting.md 默认模板

```markdown
# 文案规范

## 按钮文案

| 场景 | 推荐文案 | 禁止文案 |
|------|---------|---------|
| 新建资源 | 新建 / 创建 | 添加 / 增加 / + |
| 提交表单 | 确认 | 提交 / 保存并继续 |
| 取消操作 | 取消 | 返回 / 关闭 |
| 删除资源 | 删除 | 移除 / 清除 |
| 编辑资源 | 编辑 | 修改 / 更改 |
| 查看详情 | 查看 | 详情 / 进入 |
| 启动 | 启动 | 开始 / 运行 |
| 停止 | 停止 | 中止 / 暂停 |

## 操作反馈（Toast）

| 场景 | 文案格式 | 示例 |
|------|---------|------|
| 创建成功 | 已创建 {资源名} | 已创建「推理服务-A」 |
| 更新成功 | 已保存修改 | 已保存修改 |
| 删除成功 | 已删除 {资源名} | 已删除「推理服务-A」 |
| 操作成功 | 操作成功 | 操作成功 |
| 网络错误 | 请求失败，请稍后重试 | |
| 参数错误 | 请检查输入内容 | |

## 空值处理

```tsx
// 所有空值统一展示：– （破折号）+ 颜色 #BBBDBF
{value ?? <span style={{ color: '#BBBDBF' }}>–</span>}
```

禁止使用：`暂无数据` `N/A` `null` `undefined` `-`（普通横线）

## 确认删除弹窗

```tsx
<Modal
  title="确认删除"
  content={`确定要删除「${record.name}」吗？该操作不可撤销。`}
  okText="确认删除"
  okButtonProps={{ danger: true }}
  cancelText="取消"
/>
```

## 表单校验文案

| 场景 | 文案 |
|------|------|
| 必填为空 | 请输入 {字段名} |
| 格式不正确 | {字段名} 格式不正确 |
| 长度超限 | {字段名} 不能超过 {n} 个字符 |
| 数值超范围 | {字段名} 应在 {min} - {max} 之间 |
| 名称重复 | 该名称已被使用，请更换 |

## 加载状态

| 状态 | 文案 |
|------|------|
| 列表加载中 | （Spin 组件，无文字） |
| 提交中 | 提交中... |
| 删除中 | 删除中... |

## 空状态

| 场景 | 标题 | 描述 |
|------|------|------|
| 列表无数据 | 暂无数据 | 你还没有创建任何资源 |
| 搜索无结果 | 未找到相关结果 | 请尝试修改搜索条件 |
| 错误状态 | 加载失败 | 请刷新页面重试 |
```

---

## design-principles.md 默认模板

```markdown
# 设计原则

## 核心原则

### 1. 一致性
同类组件在整个产品中保持统一样式，不自造轮子。所有页面共享同一套 Ant Design 5 组件规范，通过 ConfigProvider + theme.json 统一注入主题。

### 2. 克制性
页面元素不超过必要数量，避免信息过载。每个页面只呈现当前任务所必需的信息，次要信息收折或在详情页展示。

### 3. 反馈性
所有操作必须有明确的状态反馈：
- 异步操作：使用 Loading 态
- 成功操作：使用 Message.success Toast
- 失败操作：使用 Message.error Toast 并附带原因
- 危险操作：必须有二次确认 Modal

### 4. 效率性
减少用户操作步骤，高频功能放在显眼位置：
- 主操作：「新建」按钮放在工具栏左上角，使用 Primary Button
- 次要操作：放在每行操作列
- 危险操作：用 Danger Button 区分，放在操作列最后

### 5. 容错性
危险操作必须可撤销或有确认保护：
- 删除：必须 Modal 二次确认
- 批量操作：展示影响范围
- 表单离开：若有未保存修改，提示用户

## 禁止行为

| 禁止 | 原因 |
|------|------|
| 自行实现 TopNav / Sider | 破坏全局一致性 |
| 硬编码颜色值 | 无法统一主题 |
| 任意使用 z-index | 层叠关系混乱 |
| Modal 内嵌 Modal | 交互体验差 |
| 操作列不固定 | 宽屏下操作列消失 |
| 空值不处理 | 表格信息参差不齐 |
```
