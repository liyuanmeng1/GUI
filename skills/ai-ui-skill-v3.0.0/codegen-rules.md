# 代码生成规范 (Code Generation Rules)

## 技术栈

| 类别 | 技术 |
| :--- | :--- |
| **框架** | React 18+ (TypeScript) |
| **UI 库** | Ant Design 5.x |
| **样式方案** | Ant Design CSS-in-JS（通过 ConfigProvider）+ CSS Modules（补充布局） |
| **状态管理** | 轻量场景用 `useState` / `useReducer`，复杂场景用 Zustand |
| **国际化** | `antd/locale/zh_CN` |

---

## 文件命名规范

```
pages/
  UserList/
    index.tsx          ← 页面入口
    index.module.css   ← 仅布局/间距样式，不写颜色
    types.ts           ← TypeScript 类型定义
    hooks.ts           ← 业务 hooks

components/
  UserTable/
    index.tsx
    index.module.css
```

- 组件文件夹名：`PascalCase`
- 工具函数文件：`camelCase.ts`
- 类型文件：`types.ts` 或内联在组件文件中

---

## 组件代码规范

### 基础结构模板

```tsx
import React from 'react';
import { ConfigProvider, Table, Button } from 'antd';
import type { TableColumnsType } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import theme from '@/theme.json';
import styles from './index.module.css';

interface Props {
  // 明确定义所有 Props
}

const MyComponent: React.FC<Props> = ({ ...props }) => {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      {/* 组件内容 */}
    </ConfigProvider>
  );
};

export default MyComponent;
```

### 样式规范

**CSS Modules 只写布局，不写颜色：**

```css
/* ✅ 正确：只写布局和间距 */
.pageWrapper {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tableActions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* ❌ 错误：在 CSS 中硬编码颜色 */
.title {
  color: #326BFB;       /* 禁止 */
  background: #F0F7FF;  /* 禁止 */
}
```

**颜色必须通过 Ant Design Token 系统控制：**

```tsx
// ✅ 正确：通过 theme token 使用颜色
import { theme as antTheme } from 'antd';
const { token } = antTheme.useToken();
<div style={{ color: token.colorPrimary }}>文字</div>

// ❌ 错误：硬编码颜色
<div style={{ color: '#326BFB' }}>文字</div>
```

---

## 布局规范

### 页面级间距

```tsx
// 页面容器
<div style={{ padding: '24px' }}>

// 区块间距（Card 与 Card 之间）
<Space direction="vertical" size={16} style={{ width: '100%' }}>

// 顶部操作栏（标题 + 按钮）
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
  <Typography.Title level={4} style={{ margin: 0 }}>页面标题</Typography.Title>
  <Space>
    <Button>次要操作</Button>
    <Button type="primary">主要操作</Button>
  </Space>
</div>
```

### 标准页面框架

```tsx
<Layout style={{ minHeight: '100vh' }}>
  <Layout.Sider>
    <Menu mode="inline" items={menuItems} />
  </Layout.Sider>
  <Layout>
    <Layout.Header style={{ background: '#fff', padding: '0 24px' }}>
      {/* Header 内容 */}
    </Layout.Header>
    <Layout.Content style={{ padding: 24, background: '#F5F7FA' }}>
      {/* 页面内容 */}
    </Layout.Content>
  </Layout>
</Layout>
```

---

## 各组件使用规范

### Table

```tsx
<Table
  columns={columns}
  dataSource={data}
  rowKey="id"
  bordered={false}          // 必须：不使用全边框
  pagination={{
    pageSize: 20,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
    position: ['bottomRight'],  // 必须：分页在右下角
  }}
  locale={{ emptyText: <Empty description="暂无数据" /> }}
/>
```

**columns 规范：**
```tsx
const columns: TableColumnsType<DataType> = [
  {
    title: '列名',
    dataIndex: 'field',
    width: 120,          // 必须设置 width，防止列宽抖动
    ellipsis: true,      // 长文本列必须设置
  },
  {
    title: '操作',
    key: 'action',
    width: 160,
    fixed: 'right',      // 操作列固定在右侧
    render: (_, record) => (
      <Space size={4}>
        <Button type="link" size="small">编辑</Button>
        <Button type="link" size="small" danger>删除</Button>
      </Space>
    ),
  },
];
```

### Form

```tsx
<Form
  form={form}
  layout="vertical"           // 推荐使用 vertical（label 在上方）
  onFinish={handleSubmit}
  autoComplete="off"
>
  <Form.Item
    name="fieldName"
    label="字段名称"
    rules={[{ required: true, message: '请输入字段名称' }]}
  >
    <Input placeholder="请输入" />
  </Form.Item>

  {/* 表单底部操作区 */}
  <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
    <Space>
      <Button onClick={handleCancel}>取消</Button>
      <Button type="primary" htmlType="submit">确认</Button>
    </Space>
  </Form.Item>
</Form>
```

### Modal

```tsx
<Modal
  title="弹窗标题"
  open={visible}
  onOk={handleOk}
  onCancel={handleCancel}
  okText="确认"
  cancelText="取消"
  destroyOnClose       // 关闭时销毁内容，防止状态残留
  width={520}          // 默认宽度，复杂表单用 720
>
  {/* 弹窗内容 */}
</Modal>
```

### 状态处理规范

```tsx
// 加载状态
const [loading, setLoading] = useState(false);
<Table loading={loading} />
<Button loading={loading} type="primary">提交</Button>

// 空状态
<Empty
  description="暂无数据"
  image={Empty.PRESENTED_IMAGE_SIMPLE}
/>

// 错误状态
<Alert
  type="error"
  message="加载失败"
  description={error.message}
  showIcon
/>
```

---

## TypeScript 规范

```tsx
// ✅ 所有数据类型必须定义 interface
interface UserRecord {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'disabled';
  createdAt: string;
}

// ✅ 枚举状态使用 const 对象（不用 enum）
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISABLED: 'disabled',
} as const;

type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

// ❌ 禁止使用 any
const data: any = {};  // 禁止
```

---

## 状态与交互规范

### 按钮组顺序（必须遵守）

```
取消 / 重置（次要）→ 确认 / 提交（主要）
```

主要操作永远在**右侧**。

### 危险操作必须二次确认

```tsx
// 删除等危险操作，使用 Popconfirm
<Popconfirm
  title="确认删除"
  description="删除后无法恢复，是否继续？"
  onConfirm={handleDelete}
  okText="确认删除"
  cancelText="取消"
  okButtonProps={{ danger: true }}
>
  <Button type="link" danger>删除</Button>
</Popconfirm>
```

### 异步操作反馈

```tsx
// 成功提示
message.success('操作成功');

// 失败提示
message.error('操作失败，请重试');

// 警告提示
message.warning('请注意：此操作不可撤销');
```

---

## 禁止行为

| 禁止项 | 原因 |
| :--- | :--- |
| `style={{ color: '#326BFB' }}` | 绕过 Token 系统，破坏主题一致性 |
| `border: '1px solid #d9d9d9'` | 使用了非 Token 的默认 antd 色值 |
| `borderRadius: 6` | 不在 Token 规范内（只有 0/2/4/8） |
| `any` 类型 | 破坏类型安全 |
| 省略 `rowKey` | 导致 Table 渲染警告和性能问题 |
| Modal 不加 `destroyOnClose` | 导致表单状态残留 |
| 操作列不固定 `fixed: 'right'` | 横向滚动时操作列消失 |
