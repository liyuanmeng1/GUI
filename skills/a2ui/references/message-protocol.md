# A2UI v0.9 消息协议参考

## 消息格式概览

A2UI 消息是一个 JSON 数组，包含一条或多条操作指令。每条指令是具有单一顶层 key 的对象：

```json
[
  { "createSurface": { ... } },
  { "updateComponents": { ... } },
  { "updateDataModel": { ... } }
]
```

---

## 1. createSurface — 创建界面

初始化一个新的 Surface，指定其 ID 和使用的 Catalog。

```json
{
  "createSurface": {
    "surfaceId": "restaurant-booking",
    "catalogId": "https://a2ui.org/specification/v0_9/basic_catalog.json",
    "theme": {
      "primaryColor": "#1677FF",
      "agentDisplayName": "预订助手"
    }
  }
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `surfaceId` | ✅ | 唯一字符串，贯穿后续所有消息 |
| `catalogId` | ✅ | 使用的 Catalog URI |
| `theme.primaryColor` | | 十六进制主题色，如 `#1677FF` |
| `theme.iconUrl` | | Agent/工具图标 URL |
| `theme.agentDisplayName` | | Agent 显示名称 |

---

## 2. updateComponents — 更新组件树

发送平铺的组件列表。可多次调用（增量更新）。

```json
{
  "updateComponents": {
    "surfaceId": "restaurant-booking",
    "components": [
      {
        "id": "root",
        "component": "Column",
        "children": ["title", "form", "submit-row"]
      },
      {
        "id": "title",
        "component": "Text",
        "text": "预订餐厅",
        "variant": "h1"
      },
      {
        "id": "form",
        "component": "Column",
        "children": ["name-field", "date-field", "party-size"]
      },
      {
        "id": "name-field",
        "component": "TextField",
        "label": "姓名",
        "value": { "path": "/booking/name" }
      },
      {
        "id": "date-field",
        "component": "DateTimeInput",
        "label": "预订日期",
        "value": { "path": "/booking/date" },
        "enableDate": true
      },
      {
        "id": "party-size",
        "component": "Slider",
        "label": "人数",
        "value": { "path": "/booking/partySize" },
        "min": 1,
        "max": 20
      },
      {
        "id": "submit-row",
        "component": "Row",
        "children": ["cancel-btn", "submit-btn"],
        "justify": "end"
      },
      {
        "id": "cancel-btn",
        "component": "Button",
        "child": "cancel-text",
        "variant": "borderless",
        "action": { "event": { "name": "cancel" } }
      },
      {
        "id": "cancel-text",
        "component": "Text",
        "text": "取消"
      },
      {
        "id": "submit-btn",
        "component": "Button",
        "child": "submit-text",
        "variant": "primary",
        "action": { "event": { "name": "submit_booking" } }
      },
      {
        "id": "submit-text",
        "component": "Text",
        "text": "确认预订"
      }
    ]
  }
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `surfaceId` | ✅ | 对应 createSurface 中的 ID |
| `components` | ✅ | 平铺组件列表（每项必须有 `id` 和 `component`） |

**增量更新规则**：
- 发送已存在 ID 的组件 → 更新该组件
- 发送新 ID → 添加新组件
- 从父组件的 children 中移除某个 ID → 该组件不再渲染

---

## 3. updateDataModel — 更新数据模型

填充 / 更新数据模型，组件通过 `{ "path": "/..." }` 绑定读取这里的值。

```json
{
  "updateDataModel": {
    "surfaceId": "restaurant-booking",
    "contents": {
      "booking": {
        "name": "",
        "date": "",
        "partySize": 2
      },
      "restaurants": [
        {
          "name": "Xi'an Famous Foods",
          "imageUrl": "https://example.com/xian.jpg",
          "rating": "★★★★☆",
          "address": "81 St Marks Pl, New York"
        },
        {
          "name": "Han Dynasty",
          "imageUrl": "https://example.com/han.jpg",
          "rating": "★★★★☆",
          "address": "90 3rd Ave, New York"
        }
      ]
    }
  }
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `surfaceId` | ✅ | 对应 createSurface 中的 ID |
| `contents` | ✅ | 任意 JSON 对象，作为数据模型根节点 |

**数据绑定寻址**：
- 组件中 `{ "path": "/booking/name" }` → 读取 `contents.booking.name`
- List template 中，`path` 相对于当前数组元素，无需加 `/`
- 例如模板里 `{ "path": "name" }` → 当前元素的 `name` 字段

---

## 完整消息示例（餐厅列表 + 预订表单）

```json
[
  {
    "createSurface": {
      "surfaceId": "restaurant-finder",
      "catalogId": "https://a2ui.org/specification/v0_9/basic_catalog.json",
      "theme": { "primaryColor": "#FF6B35" }
    }
  },
  {
    "updateComponents": {
      "surfaceId": "restaurant-finder",
      "components": [
        { "id": "root", "component": "Column", "children": ["page-title", "restaurant-list"] },
        { "id": "page-title", "component": "Text", "text": "附近餐厅", "variant": "h1" },
        {
          "id": "restaurant-list",
          "component": "List",
          "children": { "componentId": "restaurant-card", "path": "/restaurants" }
        },
        { "id": "restaurant-card", "component": "Card", "child": "card-body" },
        { "id": "card-body", "component": "Column", "children": ["rest-img", "rest-name", "rest-rating", "book-btn"] },
        { "id": "rest-img", "component": "Image", "url": { "path": "imageUrl" }, "variant": "mediumFeature", "fit": "cover" },
        { "id": "rest-name", "component": "Text", "text": { "path": "name" }, "variant": "h3" },
        { "id": "rest-rating", "component": "Text", "text": { "path": "rating" }, "variant": "caption" },
        { "id": "book-btn", "component": "Button", "child": "book-btn-text", "variant": "primary", "action": { "event": { "name": "book_restaurant" } } },
        { "id": "book-btn-text", "component": "Text", "text": "立即预订" }
      ]
    }
  },
  {
    "updateDataModel": {
      "surfaceId": "restaurant-finder",
      "contents": {
        "restaurants": [
          { "name": "Xi'an Famous Foods", "imageUrl": "https://example.com/xian.jpg", "rating": "★★★★☆" },
          { "name": "Han Dynasty", "imageUrl": "https://example.com/han.jpg", "rating": "★★★★☆" },
          { "name": "RedFarm", "imageUrl": "https://example.com/redfarm.jpg", "rating": "★★★★☆" }
        ]
      }
    }
  }
]
```

---

## 常见错误与规避

| 错误 | 原因 | 正确做法 |
|------|------|---------|
| `Card.child` 引用不存在的 ID | 组件 ID 未在 components 中定义 | 确保所有引用的 ID 都有对应组件定义 |
| Button 没有 `child` | v0.9 Button 必须有 child | 始终为 Button 添加 `child`（通常是 Text） |
| 组件内联嵌套 | 在 `card.child` 中直接写组件对象 | 所有组件必须在顶层 `components` 数组中，通过 ID 引用 |
| List template 用绝对路径 | 模板内绑定路径不需要 `/` 开头 | 模板内用相对路径如 `"name"`，非 `"/name"` |
| Slider 缺少 `max` | Slider 的 max 是必填字段 | 始终提供 `max` 值 |
| `DateTimeInput` value 未初始化 | 客户端可能报错 | 未设置时用空字符串 `""` 初始化 |
| `ChoicePicker` value 未初始化 | 选中值无法写回 contents | contents 里对应字段初始化为 `[]`（数组），`TextField` 初始化为 `""` |
| `ChoicePicker` 用 `choices` 字段 | v0.9 规范要求用 `options` | 选项数组字段名必须用 `options`，不是 `choices` |
| 三段式顺序错误（表单场景） | updateComponents 在 updateDataModel 之前时，数据绑定路径不存在 | 表单场景下 `updateDataModel` 必须放在 `updateComponents` **之前** |
