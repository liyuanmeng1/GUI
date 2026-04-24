# 配色规范 (Color)

## 色彩使用逻辑

> 颜色仅用于传递**语义信息**，不用于装饰。
> 所有色值必须通过 `01-foundation/theme.json` 的 Token 引用，禁止硬编码。

---

## 核心 Token 速查

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
| **页面背景** | — | `#F9FAFD` | 整体页面背景（TopNav + Body） |
| **遮罩色** | `colorBgMask` | `rgba(0,0,0,0.2)` | Modal、Drawer 背景遮罩 |

---

## 文字色阶

| 层级 | Token | 色值 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **主文字** | `colorText` | `#252626` | 标题、数据值、激活状态 |
| **次要文字** | `colorTextSecondary` | `#575859` | 正文、说明文字 |
| **三级文字** | `colorTextTertiary` | `#898A8C` | 分组标签、占位符、辅助说明 |
| **禁用/空值** | `colorTextQuaternary` | `#BBBDBF` | 禁用态文字、空值（`–`） |

---

## 边框色

| Token | 色值 | 用途 |
| :--- | :--- | :--- |
| `colorBorder` | `#D5D6D9` | 输入框、默认按钮边框 |
| `colorBorderSecondary` | `#EBEDF0` | Table 横向分割线、Divider、卡片边框 |

---

## 状态颜色使用规范

### 运行中 / 进行中
```tsx
<Badge status="processing" color={token.colorPrimary} />
// 颜色：#326BFB
```

### 已完成
```tsx
<Tag color="success">已完成</Tag>
// 背景：#DAF7DD（自动计算）
```

### 已停止 / 失败
```tsx
<Tag color="error">已停止</Tag>
// 背景：#FFF4F0（自动计算）
```

### 警告 / 异常
```tsx
<Tag color="warning">异常</Tag>
// 背景：#FFFBE6（自动计算）
```

### 自定义状态 Tag（详情页）
```tsx
<span style={{
  background: '#DAF7DD99',   // bgColor + 透明度
  color: '#252626',
  padding: '1px 4px',
  borderRadius: 4,
  fontSize: 12,
}}>
  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#30C453', display: 'inline-block', marginRight: 4 }} />
  运行中
</span>
```

---

## 页面结构色彩

| 区域 | 色值 | 说明 |
| :--- | :--- | :--- |
| 整体背景 | `#F9FAFD` | TopNav + Body 区域 |
| Sider / Content 卡片背景 | `#FFFFFF` | 卡片白色 |
| Sider / Content 卡片边框 | `#FFFFFF` | 白色边框（配合阴影） |
| 卡片阴影 | `0 2px 6px #1B196514, 0 0 18px #4558FF08` | 轻阴影 |
| PageHeader 背景 | `linear-gradient(180deg, #F8F6FF -1.34%, rgba(234,244,255,0.10) 30%, rgba(255,255,255,0.00) 100%), #FFF` | 顶部渐变 |
| PageContent 背景 | `#FFFFFF` | 纯白 |

---

## 菜单 / 导航色彩

| 状态 | 背景 | 文字 | 说明 |
| :--- | :--- | :--- | :--- |
| 默认 | 透明 | `#252626` | 菜单项正常态 |
| Hover | `#EEEFF6` | `#252626` | 菜单项悬停态 |
| 选中 | `#EEEFF6` | `#252626 (600)` | 菜单项激活态 |
| TopNav Tab 默认 | 透明 | `#575859` | 顶部导航正常态 |
| TopNav Tab Hover | `rgba(77,95,255,0.06)` | `#4558FF` | 顶部导航悬停态 |
| TopNav Tab 选中 | `rgba(77,95,255,0.15)` | `#4558FF (500)` | 顶部导航激活态 |

---

## 禁止行为

- ❌ 硬编码颜色：`style={{ color: '#326BFB' }}` → 改为 `token.colorPrimary`
- ❌ 自创颜色：不得使用 theme.json 之外的色值
- ❌ 装饰性色块：正文区域不得添加彩色背景
- ❌ 随意使用透明度：透明度调整仅限于状态 Tag 的背景色
