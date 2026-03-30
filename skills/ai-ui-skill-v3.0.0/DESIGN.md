# 设计系统指南：专业蓝调 · 轻量级企业风 (Professional Blue · Lightweight Enterprise)

## 1. 创意北极星 (The Design North Star)

本设计系统面向**企业级 Web 应用**，追求"克制的专业感"。核心哲学是：**信息第一，装饰为零**。通过蓝色为主的色调传递可信赖感，通过低饱和的中性灰底色提供视觉宁静，通过统一的 4px 圆角系统保持界面的紧凑与现代。我们不追求视觉冲击，而是让每一个组件都在它应该出现的地方，以最准确的形式传递信息。

设计原则优先级：**一致性 > 可读性 > 美观性**。

---

## 2. 色彩体系 (Color Palette & Logic)

### 核心 Token（来自 theme.json）

| 角色 | Token | 色值 | 用途 |
| :--- | :--- | :--- | :--- |
| **主色** | `colorPrimary` | `#326BFB` | 主按钮、激活态、链接、关键图标 |
| **主色悬停** | `colorPrimaryHover` | `#85AFFF` | 主色元素悬停态 |
| **主色激活** | `colorPrimaryActive` | `#204DD4` | 主色元素点击/按下态 |
| **主色浅底** | `colorPrimaryBg` | `#F0F7FF` | 选中行背景、激活态背景 |
| **成功色** | `colorSuccess` | `#30C453` | 成功状态、正向指标 |
| **警告色** | `colorWarning` | `#FFAA00` | 警告提示、需关注指标 |
| **错误色** | `colorError` | `#FA4E3E` | 错误、删除、危险操作 |
| **信息色** | `colorInfo` | `#19B2FF` | 中性提示、引导信息 |
| **布局背景** | `colorBgLayout` | `#F5F7FA` | 页面整体背景色 |
| **遮罩色** | `colorBgMask` | `rgba(0,0,0,0.2)` | Modal、Drawer 背景遮罩 |

### 文字色阶

| 层级 | Token | 色值 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **主文字** | `colorText` | `#252626` | 标题、重要内容、激活状态 |
| **次要文字** | `colorTextSecondary` | `#575859` | 正文、说明文字 |
| **三级文字** | `colorTextTertiary` | `#898A8C` | 占位符、辅助说明、图标 |
| **禁用文字** | `colorTextQuaternary` | `#BBBDBF` | 禁用态文字 |

### 填充色阶（背景用）

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| `colorFill` | `#D5D6D9` | 强填充，Slider 轨道等 |
| `colorFillSecondary` | `#EBEDF0` | 中等填充 |
| `colorFillTertiary` | `#F0F2F5` | 轻填充，禁用背景 |
| `colorFillQuaternary` | `#F5F7FA` | 极轻填充，悬停背景 |

### 边框色

- 主边框：`colorBorder` = `#D5D6D9`
- 次级边框/分割线：`colorBorderSecondary` = `#EBEDF0`

### 色彩使用规则
- **主色只用于可交互元素**：按钮、链接、选中态、进度条，禁止用于纯装饰
- **语义色必须对应语义**：成功/警告/错误/信息色不得混用
- **背景色梯度**：页面背景 `#F5F7FA` → 卡片/容器白色 `#FFFFFF` → 嵌套内容 `#F5F7FA`，通过明度差而非边框分层

---

## 3. 字体排印 (Typography)

### 字体家族
- **中文**：PingFang SC（macOS/iOS）/ 微软雅黑（Windows）/ 系统默认无衬线体
- **英文/数字**：-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### 字号层级（来自 theme.json）

| 层级 | Token | 字号 | 用途 |
| :--- | :--- | :--- | :--- |
| **一级标题** | `fontSizeHeading1` | 24px | 页面主标题，极少使用 |
| **二级标题** | `fontSizeHeading2` | 22px | 模块标题 |
| **三级标题** | `fontSizeHeading3` | 20px | 卡片标题、区块标题 |
| **四级标题** | `fontSizeHeading4` | 18px | 子模块标题，等同 `fontSizeXL` |
| **基础正文** | `fontSize` | 14px | 主要阅读内容，全局默认 |
| **小号文字** | `fontSizeSM` | 12px | 辅助说明、标签、注脚 |

### 字重规范
- 标题：`font-weight: 600`
- 正文：`font-weight: 400`
- 强调：`font-weight: 500`

### 禁止规则
- 禁止正文使用 `#252626` 纯黑（应使用 `colorTextSecondary`）
- 禁止标签/注脚字号低于 12px
- 禁止标题字号与正文字号差距小于 4px

---

## 4. 圆角与深度 (Border Radius & Elevation)

### 圆角体系

| Token | 值 | 适用组件 |
| :--- | :--- | :--- |
| `borderRadius` | 4px | **全局基础**：输入框、按钮、Select、下拉菜单、Tag、大多数组件 |
| `borderRadiusLG` | 8px | Card、大型容器、Modal |
| `borderRadiusSM` | 2px | 极小组件内部圆角 |
| `borderRadiusXS` | 0px | 无圆角，紧贴边缘元素 |

**圆角黄金规则：统一使用 4px，Card 使用 8px，其余一律遵循 Token，禁止使用 Token 外的自定义值。**

### 投影体系（极克制）

主投影（浮层、Card）：
```css
box-shadow: 0px 6px 12px -10px rgba(31, 35, 41, 0.06),
            0px 8px 24px 0px rgba(31, 35, 41, 0.04),
            0px 10px 36px 10px rgba(31, 35, 41, 0.04);
```

次级投影（下拉、小浮层）：
```css
box-shadow: 0px 4px 8px -8px rgba(31, 35, 41, 0.06),
            0px 6px 12px 0px rgba(31, 35, 41, 0.04),
            0px 8px 24px 8px rgba(31, 35, 41, 0.04);
```

**投影规则：**
- 透明度最高不超过 6%，必须带环境色 `rgba(31,35,41,...)`
- 禁止使用纯灰阴影 `rgba(0,0,0,...)`
- 禁止在已有阴影的容器内再嵌套阴影

---

## 5. 组件设计规范 (Components)

### 按钮 (Button)

- **主要按钮 (Primary)**：背景 `#326BFB`，白色文字，高度 32px（默认）/ 36px（LG）/ 28px（SM），圆角 4px，无阴影（`primaryShadow: "0"`）
- **默认按钮 (Default)**：白色背景，边框 `#D5D6D9`，文字 `#252626`；悬停边框变 `#5C8FFF`，文字变 `#5C8FFF`；激活边框/文字变 `#204DD4`
- **危险按钮 (Danger)**：边框/文字 `#FA4E3E`，无阴影
- **禁用态**：背景 `#F0F2F5`，边框 `#EBEDF0`，文字 `#BBBDBF`
- **禁止**：禁止自定义阴影；禁止圆角超出 4px；禁止文字超出一行

### 输入框 (Input / Select / DatePicker)

- **常态**：白色背景，边框 `#D5D6D9`，圆角 4px，高度 32px（默认）/ 36px（LG）/ 28px（SM）
- **激活/聚焦态**：边框变 `#326BFB`，带 `box-shadow: 0 0 0 2px rgba(50,107,251,0.1)`
- **悬停态**：边框变 `#85AFFF`
- **禁用态**：背景 `#F0F2F5` / `#EBEDF0`，文字 `#BBBDBF`
- **错误态**：边框/文字变 `#FA4E3E`
- **附加前/后缀区域**：背景 `#F5F7FA`

### 表格 (Table)

- **表头**：文字 `#252626`（weight 600），分割线颜色 `#F0F2F5`，排序激活背景 `#F0F2F5`，圆角 4px（表头容器）
- **数据行**：悬停背景无特殊（继承全局），选中行背景 `#F0F7FF`，选中行悬停 `#ABCDFF`
- **分割线**：`#EBEDF0`，不透明度 100%（本系统允许）
- **排序激活**：列背景变 `#F5F7FA`
- **禁止**：禁止竖向分割线；禁止斑马纹（用选中态区分）

### Tab 导航 (Tabs)

- **激活态**：底部指示条颜色 `#326BFB`，文字 `#326BFB`
- **未激活态**：文字 `#252626`
- **悬停态**：文字 `#5C8FFF`
- **点击/按下态**：文字 `#204DD4`
- **内边距**：`8px 0`（水平方向）
- **禁止**：禁止填充型 Tab 背景使用主色；禁止 Tab 标签超过 5 个不加下拉收起

### 卡片 (Card)

- **圆角**：8px（`borderRadiusLG`）
- **extra 区域文字**：`#252626`
- **背景**：白色，应用次级投影或无投影
- **嵌套卡片**：内层背景使用 `#F5F7FA`

### 下拉菜单 / Dropdown

- **选项悬停背景**：`#F5F7FA`
- **分割线**：`#F0F2F5`
- **圆角**：4px
- **禁止**：禁止选项文字使用主色（仅激活/选中态可用）

### Select 选择器

- **选中选项背景**：`#F0F7FF`，文字 `#252626`
- **悬停选项背景**：`#F5F7FA`
- **多选 Tag 背景**：`#F0F2F5`
- **禁用 Tag 文字**：`#BBBDBF`

### 分段控制器 (Segmented)

- **轨道背景**：`#F5F7FA`，内边距 3px
- **未激活文字**：`#575859`
- **悬停**：背景 `#F5F7FA`，文字 `#252626`
- **激活**：文字 `#252626`，背景 `#F0F7FF`
- **高度**：36px（LG）/ 28px（SM）/ 默认 32px

### 菜单 (Menu)

- **选中项**：背景 `#F0F7FF`，文字/图标 `#326BFB`
- **悬停项**：文字 `#252626`
- **禁用项**：文字 `#BBBDBF`
- **分割线**：`#F0F2F5`
- **子菜单选中**：文字 `#326BFB`

### 面包屑 (Breadcrumb)

- **当前页（最后一项）**：文字 `#252626`
- **其他项**：文字/链接 `#898A8C`
- **悬停**：背景 `#F5F7FA`，文字 `#252626`
- **分隔符**：`#898A8C`

### 分页 (Pagination)

- **禁用激活项**：背景 `#EBEDF0`，文字 `#BBBDBF`
- **圆角**：4px

### 弹窗 (Modal)

- **标题文字**：`#252626`（weight 600）
- **分割线**：`#F0F2F5`
- **关闭按钮悬停背景**：`#F5F7FA`，激活背景：`#F0F7FF`
- **圆角**：8px（容器），4px（内部元素）

### 通知 / Toast (Notification & Message)

- **圆角**：4px
- **悬停背景**：`#F0F2F5`，激活背景：`#F0F7FF`

### 布局 (Layout)

- **页面背景**：`#F5F7FA`
- **Footer 背景**：`#F5F7FA`
- **Header 文字**：`#252626`
- **侧边栏收起触发器**：`#252626`

### 骨架屏 (Skeleton)

- **渐变起始色**：`rgba(0,0,0,0.04)`
- **渐变结束色**：`rgba(0,0,0,0.08)`
- **禁止**：禁止 Skeleton 与真实布局结构差异过大

---

## 6. 间距规范 (Spacing)

| Token | 值 | 使用场景 |
| :--- | :--- | :--- |
| `marginXXS` | 4px | 最小间距，图标与文字间距 |
| `marginXS` | 8px | 紧凑元素间距 |
| `margin` | 16px | 标准组件间距 |
| `marginMD` | 20px | 模块内部间距 |
| `marginLG` | 24px | 模块间距 |
| `marginXL` | 32px | 页面区块间距 |

---

## 7. 执行准则 (Do's and Don'ts)

### 正确做法 (Do)
- **使用 ConfigProvider 统一注入主题**：所有页面必须包裹在 `<ConfigProvider theme={theme}>` 中
- **优先使用语义 Token**：颜色使用 `colorPrimary` 等 Token，禁止硬编码色值
- **保持圆角一致**：全局 4px，Card/Modal 用 8px，严格遵守 Token
- **投影用于浮层**：仅 Card、Modal、Dropdown 等浮层元素使用投影
- **文字层级分明**：标题用 `#252626`，正文用 `#575859`，辅助用 `#898A8C`

### 错误做法 (Don't)
- **禁止 inline style 覆盖 Token 值**：不得用 `style={{ color: '#326BFB' }}` 代替 Token
- **禁止使用纯灰阴影**：`box-shadow` 中禁止 `rgba(0,0,0,...)` 纯灰，必须带环境色
- **禁止主色用于非交互装饰**：背景、插图、纯文字区域禁止使用 `#326BFB`
- **禁止在卡片内嵌套卡片投影**：嵌套容器用背景色区分，不用阴影叠加
- **禁止语义色混用**：success/warning/error/info 各有用途，不得相互替代
- **禁止超出字号层级**：不得使用 10px、11px、13px 等 Token 外的字号
