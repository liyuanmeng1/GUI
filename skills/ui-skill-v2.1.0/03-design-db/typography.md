# 排版规范 (Typography)

## 字体家族

```css
font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

- **中文**：PingFang SC（macOS/iOS）/ 微软雅黑（Windows）
- **英文/数字**：-apple-system, BlinkMacSystemFont, "Segoe UI"
- **全局字体平滑**（必须写在 `index.html` 的 `body` 上）：
  ```css
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  ```

---

## 字号层级

| 层级 | Token | 字号 | 字重 | 颜色 | 用途 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **页面主标题** | `fontSizeHeading4` | 18px | 600 | `#252626` | PageHeader 中的页面标题 |
| **区块标题** | 自定义 | 16px | 600 | `#252626` | 详情页分组标题（如"基本信息"） |
| **基础正文** | `fontSize` | 14px | 400 | `#252626` / `#575859` | 表格数据、Form 内容、描述 |
| **辅助文字** | `fontSizeSM` | 12px | 400 | `#898A8C` | 导航分组标签、副标题、注脚 |

---

## 行高规范

| 字号 | 对应行高 | 说明 |
| :--- | :--- | :--- |
| 18px | 24px | 页面标题 |
| 16px | 22px | 区块标题 |
| 14px | 22px | 正文、表格单元格 |
| 12px | 18px | 辅助文字、标签 |

---

## 颜色层级（文字色）

| 层级 | Token | 色值 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **主文字** | `colorText` | `#252626` | 标题、数据值、激活状态 |
| **次要文字** | `colorTextSecondary` | `#575859` | 正文、说明文字 |
| **三级文字** | `colorTextTertiary` | `#898A8C` | 分组标签、占位符、辅助 |
| **禁用/空值** | `colorTextQuaternary` | `#BBBDBF` | 禁用态、空值 `–` |

---

## 常见排版组合

### PageHeader 标题区
```tsx
// 列表页标题
<Title level={4} style={{ fontSize: 18, fontWeight: 600, color: '#252626', margin: 0 }}>
  页面标题
</Title>
<Text style={{ fontSize: 12, color: '#898A8C', marginLeft: 12 }}>
  副标题说明文字
</Text>
```

### 详情页标题区
```tsx
<span style={{ fontSize: 16, fontWeight: 500, color: '#252626' }}>
  任务名称
</span>
```

### 区块标题（详情页 / 表单页）
```tsx
<Title level={5} style={{ fontSize: 16, fontWeight: 600, color: '#252626', margin: 0 }}>
  基本信息
</Title>
<Divider style={{ borderColor: '#EBEDF0', margin: '12px 0 20px' }} />
```

### 空值展示
```tsx
<span style={{ color: '#BBBDBF' }}>–</span>
```

---

## 展示态表单排版（Descriptions）

详情页中使用 `antd Descriptions` 展示只读数据时，遵循以下规范：

### 对齐方式
- **label**：右对齐，宽度固定 `120px`，颜色 `#898A8C`，字号 `14px`
- **content**：左对齐，颜色 `#252626`，字号 `14px`

```tsx
<Descriptions
  column={2}
  labelStyle={{ color: '#898A8C', width: 120, textAlign: 'right', fontSize: 14 }}
  contentStyle={{ color: '#252626', fontSize: 14 }}
>
  <Descriptions.Item label="任务名称">cpt-task-medical-v2</Descriptions.Item>
  <Descriptions.Item label="任务类型">文本生成</Descriptions.Item>
  <Descriptions.Item label="描述" span={2}>医疗领域继续预训练任务</Descriptions.Item>
</Descriptions>
```

### 分组标题
详情页中每个信息组之前加粗标题，样式如下：

```tsx
<div style={{ fontWeight: 500, fontSize: 14, color: '#252626', marginBottom: 12 }}>
  基本信息
</div>
```

### 空值规范
Descriptions 中的空值统一显示为 `–`（en-dash），颜色 `#BBBDBF`：

```tsx
<Descriptions.Item label="描述">
  {value || <span style={{ color: '#BBBDBF' }}>–</span>}
</Descriptions.Item>
```
