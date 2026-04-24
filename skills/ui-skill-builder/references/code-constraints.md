# 代码生成约束（所有生成的模板必须遵守）

## Ant Design 5 组件约束

### Table 组件
```tsx
// ✅ 正确
<Table bordered={false} rowKey="id" pagination={false} />

// ❌ 禁止
<Table bordered={true} />   // 有边框
<Table />                   // 缺少 rowKey
```

### Modal 组件
```tsx
// ✅ 正确
<Modal destroyOnHidden />

// ❌ 禁止
<Modal destroyOnClose />  // 已废弃，用 destroyOnHidden 替代
```

### Form 组件
```tsx
// ✅ 正确（单列）
<Form layout="vertical" requiredMark={false}>

// ✅ 正确（双列）
<Form layout="vertical" requiredMark="optional">
```

### Button 组件
```tsx
// ✅ 正确：使用 antd Button
<Button type="primary">确认</Button>
<Button>取消</Button>

// ❌ 禁止：自定义 button
<button className="custom-btn">确认</button>
```

## 颜色与样式约束

### 颜色使用
```tsx
// ✅ 正确：使用 token
const { token } = theme.useToken();
<div style={{ color: token.colorPrimary }}>

// ❌ 禁止：硬编码颜色
<div style={{ color: '#165DFF' }}>
```

### 空值处理
```tsx
// ✅ 正确
{value ?? <span style={{ color: '#BBBDBF' }}>–</span>}

// ❌ 禁止
{value ?? '暂无'}
{value ?? '-'}
{value ?? null}
```

### 操作列
```tsx
// ✅ 正确：操作列必须固定在右侧
{
  title: '操作',
  key: 'action',
  fixed: 'right',
  width: 120,
}

// ❌ 禁止：不固定操作列
{
  title: '操作',
  key: 'action',
}
```

## TypeScript 约束

```tsx
// ✅ 正确：定义具体 interface
interface ServiceItem {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  createdAt: string;
}

// ❌ 禁止：使用 any
const data: any[] = [];
const handler = (item: any) => {};
```

## CSS 模块约束

```css
/* ✅ 正确：复制模板 CSS 后追加业务样式 */
/* 保留模板的所有原有样式... */

/* 业务专用追加 */
.billingNote {
  color: #FF7429;
  font-size: 12px;
}
```

```tsx
// ✅ 正确
import styles from './index.module.css';
<div className={styles.pageWrapper}>

// ❌ 禁止：在 tsx 里写 inline style 布局
<div style={{ padding: '24px', background: '#fff' }}>
```

## 全局框架约束

```tsx
// ✅ 正确：所有页面必须嵌套在 AppLayout 内
<AppLayout selectedMenuKey="xxx" activeTopNav="xxx">
  <MyPage />
</AppLayout>

// ❌ 禁止：独立页面没有 AppLayout 包裹
const App = () => <MyPage />;
```

## ConfigProvider 约束

```tsx
// ✅ 正确：根组件必须使用 ConfigProvider
import zhCN from 'antd/locale/zh_CN';
import themeConfig from './theme.json';

<ConfigProvider locale={zhCN} theme={themeConfig}>
  <App />
</ConfigProvider>
```

## 详情页约束

```tsx
// ✅ 正确：详情页用 Descriptions 展示信息
<Descriptions column={2} labelStyle={{ color: '#86909C' }}>
  <Descriptions.Item label="创建时间">{record.createdAt}</Descriptions.Item>
</Descriptions>

// ❌ 禁止：详情页用 Card 包裹内容分组
<Card title="基本信息">
  <p>创建时间：xxx</p>
</Card>
```
