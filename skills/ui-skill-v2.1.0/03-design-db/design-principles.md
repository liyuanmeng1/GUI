# 设计原则 (Design Principles)

## 创意北极星

本设计系统面向 **AI 平台型企业级 Web 应用**，追求"克制的专业感"。

> **核心哲学：信息第一，装饰为零。**

- 通过蓝色主调传递可信赖感
- 通过无 Card 包裹的扁平布局减少视觉噪音
- 通过宽松的间距系统保持内容的呼吸感
- 不追求视觉冲击，让每个组件在正确位置以最准确形式传递信息

## 原则优先级

**一致性 > 可读性 > 美观性**

## 五条核心设计原则

### 1. 扁平化布局（Flat Layout）
- Table 直接平铺，**不使用 Card 包裹**
- 内容区通过背景色差分层，而非 box-shadow
- 禁止在内容区使用卡片的阴影效果

### 2. 克制的色彩（Restrained Color）
- 颜色仅用于传递语义信息（主操作、状态、错误）
- 正文区域以中性色 `#252626 / #575859 / #898A8C` 为主
- 避免使用装饰性色块、渐变背景（PageHeader 渐变除外）

### 3. 清晰的层级（Clear Hierarchy）
- TopNav → Sider → PageHeader → Content 的视觉层级清晰
- 字号层级：18px（页标题）→ 16px（区块标题）→ 14px（正文）→ 12px（辅助）
- 操作按钮优先级：Primary > Default > Link

### 4. 一致的反馈（Consistent Feedback）
- 加载状态：Table `loading` prop
- 成功操作：`message.success()`
- 错误状态：`message.error()` 或表单验证提示
- 空状态：统一使用 `–`（颜色 `#BBBDBF`），禁止留空

### 5. 框架统一（Unified Framework）
- **所有页面必须通过 `AppLayout` 提供框架**（TopNav + Sider）
- 页面组件不得自行实现导航栏或侧边栏
- AppLayout 文件位于 `02-templates/AppLayout/index.tsx`

## 禁止行为

| 禁止项 | 原因 |
| :--- | :--- |
| 页面自行实现 TopNav / Sider | 破坏框架一致性 |
| Table 使用 Card 包裹 | 破坏扁平化风格 |
| Table `bordered={true}` | 竖向分割线造成视觉噪音 |
| 硬编码颜色值（如 `#326BFB`）| 绕过 Token 系统，难以维护 |
| 空值留空不显示 `–` | 用户无法判断是空还是加载中 |
| `destroyOnClose`（Modal）| 应使用 `destroyOnHidden`（antd v5） |
| 内容区 Card 使用 box-shadow | 应通过背景色差分层 |
| 详情页用 Card 分组 | 应使用区块标题 + Divider + Descriptions |
