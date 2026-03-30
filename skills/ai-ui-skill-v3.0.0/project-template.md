# 项目环境模板 (Project Environment)

## 依赖版本（必须严格遵守）

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "antd": "^5.x",
    "dayjs": "^1.11.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

> ⚠️ 必须使用 **Ant Design 5.x**，不得使用 antd v4 及以下版本。
> antd v5 与 v4 的主题 API 完全不同，v5 使用 `theme` prop + Design Token，v4 使用 less 变量。

---

## antd v5 关键 API 差异（禁止使用 v4 写法）

| 场景 | ❌ v4 写法（禁止） | ✅ v5 写法（必须） |
| :--- | :--- | :--- |
| 主题注入 | `less` 变量 / `ConfigProvider.config()` | `<ConfigProvider theme={theme}>` |
| 图标引入 | `import { xxx } from '@ant-design/icons'` | 同左（图标库独立，需单独安装） |
| 日期组件 | 内置 `moment.js` | 内置 `dayjs`，需 `import 'dayjs/locale/zh_cn'` |
| 弹窗显隐 | `visible` prop | `open` prop |
| Dropdown 菜单 | `overlay` prop | `menu` prop（`{ items: [...] }` 格式） |
| Select 选项 | `<Option>` 子组件 | `options` prop（数组格式） |
| Form.List | 同 | 同，无变化 |

---

## 主题注入标准写法

```tsx
// src/main.tsx 或 src/App.tsx 根组件
import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh_cn';
import theme from './theme.json';

dayjs.locale('zh-cn');

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      {/* 所有页面内容 */}
    </ConfigProvider>
  );
};

export default App;
```

---

## 图标使用规范

图标需单独安装 `@ant-design/icons`：

```bash
npm install @ant-design/icons
```

```tsx
// ✅ 正确：按需引入单个图标
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

// ❌ 错误：全量引入
import * as Icons from '@ant-design/icons';
```

常用图标速查：
- 新增：`PlusOutlined`
- 编辑：`EditOutlined`
- 删除：`DeleteOutlined`
- 搜索：`SearchOutlined`
- 刷新：`ReloadOutlined`
- 导出：`ExportOutlined`
- 导入：`ImportOutlined`
- 查看：`EyeOutlined`
- 设置：`SettingOutlined`
- 关闭：`CloseOutlined`
- 确认：`CheckOutlined`
- 警告：`ExclamationCircleOutlined`

---

## antd v5 常用组件 API 速查

### Select（选项数组写法）

```tsx
// ✅ v5 写法
<Select
  options={[
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
  ]}
  placeholder="请选择"
/>
```

### Dropdown（menu 对象写法）

```tsx
// ✅ v5 写法
<Dropdown
  menu={{
    items: [
      { key: '1', label: '操作一' },
      { key: '2', label: '操作二', danger: true },
    ],
    onClick: ({ key }) => handleMenuClick(key),
  }}
>
  <Button>更多操作</Button>
</Dropdown>
```

### DatePicker（dayjs 格式）

```tsx
import dayjs from 'dayjs';

<DatePicker
  defaultValue={dayjs('2024-01-01')}
  format="YYYY-MM-DD"
  onChange={(date, dateString) => console.log(dateString)}
/>
```

### Modal（open 替代 visible）

```tsx
// ✅ v5 写法
<Modal open={visible} onCancel={() => setVisible(false)}>
  {/* 内容 */}
</Modal>
```

### Table（rowSelection 标准写法）

```tsx
const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

const rowSelection = {
  selectedRowKeys,
  onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
};

<Table rowSelection={rowSelection} columns={columns} dataSource={data} rowKey="id" />
```

---

## 生成代码的完整文件结构

生成单个页面时，输出文件结构如下：

```
PageName/
├── index.tsx          ← 页面主文件（包含 ConfigProvider）
├── index.module.css   ← 仅布局样式（可选）
└── types.ts           ← 类型定义（数据量大时独立）
```

生成完整应用时：

```
src/
├── main.tsx           ← 入口，包含 ConfigProvider + theme 注入
├── App.tsx            ← 路由配置
├── theme.json         ← 主题文件（从 UI-skill/ 复制）
├── pages/
│   └── PageName/
│       └── index.tsx
└── components/
    └── ComponentName/
        └── index.tsx
```
