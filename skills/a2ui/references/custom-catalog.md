# 自定义 Catalog 规范指南

当 Basic Catalog 的 18 个内置组件不满足需求时，定义自定义 Catalog 来扩展组件库，对齐自己的设计系统。

---

## 一、何时需要自定义 Catalog

- 需要图表类组件（折线图、柱状图、饼图）
- 需要复杂布局组件（Grid、Masonry、Timeline）
- 需要业务专属组件（状态气泡、进度条、评分星级、Tag 组）
- 需要对齐公司设计系统（自定义 Button 风格、统一 Token）

---

## 二、自定义 Catalog 的定义方式

### 2.1 catalogId 命名规则

```
https://{your-domain}/catalogs/{name}/v{major}/catalog.json
```

示例：
```
https://design.kuaishou.com/catalogs/kwai-ui/v1/catalog.json
```

> catalogId 是唯一标识符，**不用于运行时拉取**，客户端渲染器需提前内置或注册对应的组件实现。

---

### 2.2 定义一个自定义组件

每个自定义组件需提供：

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 组件类型名，如 `"LineChart"` |
| `description` | ✅ | 供 LLM 理解的组件用途描述 |
| `properties` | ✅ | 组件属性的 JSON Schema 定义 |
| `required` | | 必填属性列表 |

**示例：定义一个折线图组件**

```json
{
  "LineChart": {
    "type": "object",
    "description": "A line chart component that visualizes time-series or categorical data.",
    "properties": {
      "id": { "type": "string" },
      "component": { "const": "LineChart" },
      "title": { "type": "string", "description": "Chart title" },
      "xAxisKey": { "type": "string", "description": "Data key for X axis" },
      "yAxisKey": { "type": "string", "description": "Data key for Y axis" },
      "data": {
        "description": "Array of data points or data binding",
        "oneOf": [
          { "type": "array", "items": { "type": "object" } },
          { "$ref": "#/$defs/DataBinding" }
        ]
      },
      "color": { "type": "string", "description": "Line color hex, e.g. #1677FF" }
    },
    "required": ["id", "component", "xAxisKey", "yAxisKey", "data"]
  }
}
```

---

### 2.3 完整自定义 Catalog 结构

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "catalogId": "https://design.example.com/catalogs/my-catalog/v1/catalog.json",
  "description": "My custom UI catalog",
  "theme": {
    "primaryColor": "#FF5722"
  },
  "components": {
    "LineChart": { /* 组件定义，见 2.2 */ },
    "ProgressBar": { /* ... */ },
    "TagGroup": { /* ... */ },
    "StatusBadge": { /* ... */ }
  }
}
```

---

## 三、扩展 Basic Catalog（推荐方式）

不从零构建，继承 Basic Catalog 的全部 18 个组件，追加自定义组件：

```json
{
  "catalogId": "https://design.example.com/catalogs/extended/v1/catalog.json",
  "extends": "https://a2ui.org/specification/v0_9/basic_catalog.json",
  "components": {
    "LineChart": { /* 新增 */ },
    "ProgressBar": { /* 新增 */ }
  }
}
```

**使用时 createSurface 中指定自定义 catalogId**：
```json
{
  "createSurface": {
    "surfaceId": "my-dashboard",
    "catalogId": "https://design.example.com/catalogs/extended/v1/catalog.json"
  }
}
```

---

## 四、告诉 LLM 如何使用自定义组件

### 方式 A：在对话开头描述组件

> "我有自定义 Catalog，包含以下额外组件：
> - `LineChart`：折线图，必填 xAxisKey/yAxisKey/data
> - `ProgressBar`：进度条，必填 value(0-100)/label
> 请使用 catalogId `https://design.example.com/catalogs/extended/v1/catalog.json` 生成界面"

### 方式 B：在 SKILL.md 的自定义 Catalog 章节中注册

在本 Skill 目录新建 `catalogs/` 目录，每个自定义 Catalog 一个文件：

```
~/.codex/skills/a2ui/
└── catalogs/
    ├── kwai-ui-v1.md     ← 描述 kwai-ui catalog 中的组件
    └── admin-v2.md       ← 描述后台系统专用 catalog
```

每个文件格式：
```markdown
# Catalog: kwai-ui-v1
catalogId: https://design.kuaishou.com/catalogs/kwai-ui/v1/catalog.json
extends: basic_catalog v0.9

## 额外组件

### LineChart
- 必填：xAxisKey, yAxisKey, data
- 可选：color, title, height
- data 支持数据绑定 { "path": "/..." }

### ProgressBar  
- 必填：value（0-100）
- 可选：label, color, variant(default/striped)

### TagGroup
- 必填：tags（字符串数组 或 数据绑定）
- 可选：variant(default/outlined/filled)
```

---

## 五、渲染器注册自定义组件

自定义 Catalog 中的组件需要在渲染器 `a2ui-renderer.js` 中注册对应的渲染函数：

```javascript
// 注册自定义组件（在 renderer/a2ui-renderer.js 加载后调用）
A2UIRenderer.registerComponent('LineChart', (props, data) => {
  const el = document.createElement('div');
  el.className = 'a2ui-linechart';
  // 自定义渲染逻辑（可接入 ECharts/Chart.js 等）
  const resolvedData = A2UIRenderer.resolveValue(props.data, data);
  renderLineChart(el, { data: resolvedData, xKey: props.xAxisKey, yKey: props.yAxisKey });
  return el;
});

A2UIRenderer.registerComponent('ProgressBar', (props, data) => {
  const value = A2UIRenderer.resolveValue(props.value, data);
  const el = document.createElement('div');
  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:4px">
      ${props.label ? `<span style="font-size:12px;color:#5f6368">${props.label}</span>` : ''}
      <div style="background:#f0f2f5;border-radius:4px;height:8px;overflow:hidden">
        <div style="background:var(--primary);width:${value}%;height:100%;border-radius:4px;transition:width 0.3s"></div>
      </div>
    </div>
  `;
  return el;
});
```

---

## 六、版本管理建议

| 变更类型 | 操作 |
|----------|------|
| 新增组件或可选属性 | 可在当前版本直接添加（非破坏性） |
| 删除组件或必填属性变更 | 升级主版本号（v1 → v2） |
| 修改组件名 | 升级主版本号 |
| 纯主题/样式调整 | 可在当前版本直接改 |

**多版本共存策略**：
- Client 渲染器同时注册 v1 和 v2 的组件
- `createSurface` 中的 catalogId 决定使用哪个版本
- 旧 Agent 继续用 v1，新 Agent 用 v2，零停机迁移
