# Basic Catalog v0.9 组件完整速查

**catalogId**: `https://a2ui.org/specification/v0_9/basic_catalog.json`

---

## 布局组件

### Row — 横向排列容器

```json
{
  "id": "toolbar",
  "component": "Row",
  "children": ["btn1", "btn2"],
  "justify": "spaceBetween",
  "align": "center"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `children` | ✅ | ID 数组 或 template 对象 |
| `justify` | | `start`(默认) / `center` / `end` / `spaceBetween` / `spaceAround` / `spaceEvenly` / `stretch` |
| `align` | | `stretch`(默认) / `start` / `center` / `end` |

---

### Column — 纵向排列容器

```json
{
  "id": "content",
  "component": "Column",
  "children": ["header", "body", "footer"],
  "justify": "start",
  "align": "stretch"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `children` | ✅ | ID 数组 或 template 对象 |
| `justify` | | `start`(默认) / `center` / `end` / `spaceBetween` 等 |
| `align` | | `stretch`(默认) / `start` / `center` / `end` |

---

### List — 可滚动列表

```json
{
  "id": "item-list",
  "component": "List",
  "children": { "componentId": "item-template", "path": "/items" },
  "direction": "vertical"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `children` | ✅ | ID 数组（静态）或 template `{ componentId, path }` |
| `direction` | | `vertical`(默认) / `horizontal` |
| `align` | | `stretch`(默认) / `start` / `center` / `end` |

**Template 格式**：
```json
"children": {
  "componentId": "card-template",
  "path": "/restaurants"
}
```
→ 对 `/restaurants` 数组每个元素渲染一次 `card-template`，绑定路径相对于当前元素。

---

## 展示组件

### Text — 文本展示

```json
{ "id": "title", "component": "Text", "text": "Hello World", "variant": "h1" }
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `text` | ✅ | 字符串 或 `{ "path": "/..." }` 数据绑定 |
| `variant` | | `body`(默认) / `h1` / `h2` / `h3` / `h4` / `h5` / `caption` |

---

### Image — 图片展示

```json
{
  "id": "hero-img",
  "component": "Image",
  "url": "https://example.com/hero.jpg",
  "fit": "cover",
  "variant": "header"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `url` | ✅ | 字符串 或 数据绑定 |
| `fit` | | `fill`(默认) / `contain` / `cover` / `none` / `scaleDown` |
| `variant` | | `mediumFeature`(默认) / `icon` / `avatar` / `smallFeature` / `largeFeature` / `header` |

---

### Icon — 图标展示

```json
{ "id": "star-icon", "component": "Icon", "name": "star" }
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 图标名称字符串，或 `{ "path": "..." }` 自定义路径 |

**内置图标名称**（60+）：
`accountCircle` `add` `arrowBack` `arrowForward` `attachFile` `calendarToday` `call` `camera` `check` `close` `delete` `download` `edit` `event` `error` `fastForward` `favorite` `favoriteOff` `folder` `help` `home` `info` `locationOn` `lock` `lockOpen` `mail` `menu` `moreVert` `moreHoriz` `notificationsOff` `notifications` `pause` `payment` `person` `phone` `photo` `play` `print` `refresh` `rewind` `search` `send` `settings` `share` `shoppingCart` `skipNext` `skipPrevious` `star` `starHalf` `starOff` `stop` `upload` `visibility` `visibilityOff` `volumeDown` `volumeMute` `volumeOff` `volumeUp` `warning`

---

### Video — 视频播放

```json
{ "id": "demo-video", "component": "Video", "url": "https://example.com/video.mp4" }
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `url` | ✅ | 字符串 或 数据绑定 |

---

### AudioPlayer — 音频播放

```json
{
  "id": "podcast",
  "component": "AudioPlayer",
  "url": "https://example.com/audio.mp3",
  "description": "Episode 1"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `url` | ✅ | 字符串 或 数据绑定 |
| `description` | | 标题/摘要文本 |

---

### Divider — 分隔线

```json
{ "id": "sep", "component": "Divider", "axis": "horizontal" }
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `axis` | | `horizontal`(默认) / `vertical` |

---

## 容器组件

### Card — 卡片容器

```json
{
  "id": "info-card",
  "component": "Card",
  "child": "card-body"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `child` | ✅ | 单个子组件 ID（多元素需用 Column/Row 包裹） |

---

### Tabs — 选项卡

```json
{
  "id": "settings-tabs",
  "component": "Tabs",
  "tabs": [
    { "title": "概览", "child": "overview-panel" },
    { "title": "详情", "child": "detail-panel" }
  ]
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `tabs` | ✅ | 数组，每项含 `title`（字符串/绑定）和 `child`（组件 ID） |

---

### Modal — 弹窗

```json
{
  "id": "confirm-modal",
  "component": "Modal",
  "trigger": "open-modal-btn",
  "content": "modal-content"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `trigger` | ✅ | 触发弹窗的组件 ID（通常是 Button） |
| `content` | ✅ | 弹窗内容组件 ID |

---

## 交互组件

### Button — 按钮

```json
{
  "id": "submit-btn",
  "component": "Button",
  "child": "submit-text",
  "variant": "primary",
  "action": { "event": { "name": "submit_form" } }
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `child` | ✅ | 按钮内容组件 ID（Text 或 Icon） |
| `action` | ✅ | 点击动作，见下方 Action 格式 |
| `variant` | | `default` / `primary`（主操作）/ `borderless`（链接样式） |

**Action 格式**：
```json
// 发送事件给 Agent
{ "action": { "event": { "name": "submit_form" } } }

// 打开 URL
{ "action": { "call": "openUrl", "args": { "url": "https://example.com" } } }
```

---

### TextField — 文本输入

```json
{
  "id": "name-input",
  "component": "TextField",
  "label": "姓名",
  "value": { "path": "/form/name" },
  "variant": "shortText"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `label` | ✅ | 标签文本（字符串 或 绑定） |
| `value` | | 字段值（数据绑定推荐） |
| `variant` | | `shortText`(默认) / `longText` / `number` / `obscured` |
| `validationRegexp` | | 客户端验证正则表达式 |

---

### CheckBox — 复选框

```json
{
  "id": "terms-checkbox",
  "component": "CheckBox",
  "label": "我同意服务条款",
  "value": { "path": "/form/agreedToTerms" }
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `label` | ✅ | 复选框文本 |
| `value` | ✅ | 布尔值绑定 |

---

### ChoicePicker — 选项选择器

```json
{
  "id": "city-picker",
  "component": "ChoicePicker",
  "label": "选择城市",
  "options": [
    { "label": "北京", "value": "beijing" },
    { "label": "上海", "value": "shanghai" }
  ],
  "value": { "path": "/form/city" },
  "variant": "mutuallyExclusive",
  "displayStyle": "chips"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `options` | ✅ | 选项数组，每项含 `label` 和 `value` |
| `value` | ✅ | 当前选中值（字符串数组绑定） |
| `label` | | 整组标签 |
| `variant` | | `mutuallyExclusive`(默认，单选) / `multipleSelection`（多选） |
| `displayStyle` | | `checkbox`(默认) / `chips` |
| `filterable` | | `false`(默认)，true 时显示搜索框 |

---

### Slider — 滑动条

```json
{
  "id": "budget-slider",
  "component": "Slider",
  "label": "预算",
  "value": { "path": "/form/budget" },
  "min": 0,
  "max": 10000
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `value` | ✅ | 数字值绑定 |
| `max` | ✅ | 最大值 |
| `label` | | 标签 |
| `min` | | 最小值，默认 0 |

---

### DateTimeInput — 日期时间选择器

```json
{
  "id": "checkin-date",
  "component": "DateTimeInput",
  "label": "入住日期",
  "value": { "path": "/booking/checkinDate" },
  "enableDate": true,
  "enableTime": false
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `value` | ✅ | ISO 8601 字符串绑定（未设置时用空字符串 `""`） |
| `enableDate` | | `false`(默认)，true 允许选日期 |
| `enableTime` | | `false`(默认)，true 允许选时间 |
| `label` | | 标签文本 |
| `min` / `max` | | ISO 8601 最小/最大允许值 |

---

## 内置函数速查

| 函数 | 用途 | 示例 |
|------|------|------|
| `formatString` | 字符串插值 | `"${/user/name} 您好"` |
| `formatNumber` | 数字格式化 | `{ "call": "formatNumber", "args": { "value": {"path":"/price"} } }` |
| `formatCurrency` | 货币格式化 | `{ "call": "formatCurrency", "args": { "value": ..., "currency": "CNY" } }` |
| `formatDate` | 日期格式化 | `{ "call": "formatDate", "args": { "value": ..., "format": "yyyy-MM-dd" } }` |
| `pluralize` | 复数形式 | `{ "call": "pluralize", "args": { "value": ..., "one": "item", "other": "items" } }` |
| `required` | 非空校验 | `{ "call": "required", "args": { "value": {"path":"/..."} } }` |
| `email` | 邮箱校验 | `{ "call": "email", "args": { "value": {"path":"/..."} } }` |
| `length` | 长度校验 | `{ "call": "length", "args": { "value": ..., "min": 2, "max": 50 } }` |
| `and` / `or` / `not` | 逻辑运算 | `{ "call": "and", "args": { "values": [...] } }` |
| `openUrl` | 打开链接 | `{ "call": "openUrl", "args": { "url": "https://..." } }` |

---

## v0.8 vs v0.9 对比（迁移参考）

| 方面 | v0.8 | v0.9 |
|------|------|------|
| 组件声明 | `"component": { "Text": { ... } }` | `"component": "Text", ...props` |
| 静态字符串 | `{ "literalString": "Hello" }` | `"Hello"` |
| 静态子节点 | `{ "explicitList": ["a","b"] }` | `["a","b"]` |
| Button 样式 | `primary: true` | `variant: "primary"` |
| Action | `{ "name": "..." }` | `{ "event": { "name": "..." } }` |
| 选择组件 | `MultipleChoice` | `ChoicePicker` |
| 布局对齐 | `distribution`, `alignment` | `justify`, `align` |
| TextField 值字段 | `text` | `value` |
