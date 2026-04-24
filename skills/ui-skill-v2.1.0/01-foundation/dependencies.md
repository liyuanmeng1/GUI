# 依赖声明（Foundation Layer）

## 核心依赖

| 包名 | 版本 | 用途 |
| :--- | :--- | :--- |
| `react` | `^18.0.0` | 核心框架 |
| `react-dom` | `^18.0.0` | DOM 渲染 |
| `antd` | `^5.x` | UI 组件库 |
| `@ant-design/icons` | `^5.x` | 图标库 |
| `typescript` | `^5.x` | 类型系统 |
| `vite` | `^5.x` | 构建工具 |
| `@vitejs/plugin-react` | `^4.x` | Vite React 插件 |

## 国际化

每个页面必须引入中文包：

```tsx
import zhCN from 'antd/locale/zh_CN';
```

## ConfigProvider 标准接入

每个页面组件内部必须用 `ConfigProvider` 包裹，注入主题和国际化：

```tsx
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import theme from '../../01-foundation/theme.json';

<ConfigProvider locale={zhCN} theme={theme}>
  {/* 页面内容 */}
</ConfigProvider>
```

## index.html 全局样式（必须）

每个项目的 `index.html` 必须在 `<style>` 块中包含：

```html
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; padding: 0; }
  body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
</style>
```

## 字体栈

```css
font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```
