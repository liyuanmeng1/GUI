# AppLayout 生成指南

当引导用户完成 Phase 1 后，根据用户的回答生成 AppLayout 组件。

---

## 标准 AppLayout 结构

```
<AppLayout>
  ├── TopNav（顶部导航，高度 56px）
  │   ├── Logo/产品名（左侧）
  │   ├── 一级导航 Tabs（居中 or 左侧紧跟 Logo）
  │   └── 用户区（右侧）
  │       ├── 通知铃铛（可选）
  │       └── 用户头像 + 下拉菜单
  └── 主体区域（flex 布局）
      ├── Sider（左侧，宽 220px）
      │   └── Menu 菜单列表
      └── Content 区域（flex: 1）
          └── <slot> children
```

---

## 代码模板骨架

```tsx
import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { theme } from 'antd';
import styles from './index.module.css';

const { Header, Sider, Content } = Layout;

// ========== 导航数据（替换为用户实际业务菜单） ==========
// 顶部一级导航
const TOP_NAV_ITEMS = [
  { key: 'module-a', label: '模块A' },
  { key: 'module-b', label: '模块B' },
];

// 侧边栏菜单（可根据顶部导航动态切换，或使用固定菜单）
const SIDER_MENU_ITEMS: Record<string, MenuItemConfig[]> = {
  'module-a': [
    { key: 'page-1', label: '页面1' },
    {
      key: 'group-1',
      label: '分组1',
      children: [
        { key: 'sub-page-1', label: '子页面1' },
        { key: 'sub-page-2', label: '子页面2' },
      ],
    },
  ],
  'module-b': [
    { key: 'page-2', label: '页面2' },
  ],
};

// ========== Props 接口 ==========
interface AppLayoutProps {
  children: React.ReactNode;
  selectedMenuKey?: string;   // 当前选中的菜单项 key
  activeTopNav?: string;      // 当前激活的顶部导航名称
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  selectedMenuKey,
  activeTopNav,
}) => {
  const { token } = theme.useToken();
  const [activeNav, setActiveNav] = useState(
    TOP_NAV_ITEMS.find(item => item.label === activeTopNav)?.key ?? TOP_NAV_ITEMS[0].key
  );

  const menuItems = SIDER_MENU_ITEMS[activeNav] ?? [];

  return (
    <Layout className={styles.layout}>
      {/* ===== TopNav ===== */}
      <Header className={styles.header}>
        {/* Logo */}
        <div className={styles.logo}>
          {/* 替换为实际 Logo 或产品名 */}
          <span className={styles.logoText}>产品名称</span>
        </div>

        {/* 顶部导航 */}
        <nav className={styles.topNav}>
          {TOP_NAV_ITEMS.map(item => (
            <span
              key={item.key}
              className={`${styles.topNavItem} ${activeNav === item.key ? styles.topNavItemActive : ''}`}
              onClick={() => setActiveNav(item.key)}
            >
              {item.label}
            </span>
          ))}
        </nav>

        {/* 右侧用户区 */}
        <div className={styles.headerRight}>
          {/* 通知铃铛（可选，按需保留） */}
          <Badge count={0} className={styles.bell}>
            <BellOutlined style={{ fontSize: 18, color: token.colorTextSecondary }} />
          </Badge>

          {/* 用户头像 */}
          <Dropdown
            menu={{
              items: [
                { key: 'profile', label: '个人中心' },
                { key: 'logout', label: '退出登录' },
              ],
            }}
          >
            <Avatar icon={<UserOutlined />} className={styles.avatar} />
          </Dropdown>
        </div>
      </Header>

      {/* ===== 主体区域 ===== */}
      <Layout className={styles.body}>
        {/* Sider */}
        <Sider width={220} className={styles.sider}>
          <Menu
            mode="inline"
            selectedKeys={selectedMenuKey ? [selectedMenuKey] : []}
            items={menuItems}
            className={styles.menu}
          />
        </Sider>

        {/* Content */}
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
```

---

## CSS 模板骨架

```css
/* AppLayout — 全局布局模板样式 */

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== TopNav ===== */
.header {
  height: 56px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #E5E6E8;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 32px;
  flex-shrink: 0;
}

.logoText {
  font-size: 16px;
  font-weight: 600;
  color: #1D2129;
}

.topNav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.topNavItem {
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #4E5969;
  transition: all 0.2s;
}

.topNavItem:hover {
  background: #F5F6F8;
  color: #1D2129;
}

.topNavItemActive {
  background: #E8F3FF;
  color: #165DFF;
  font-weight: 500;
}

.headerRight {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.bell {
  cursor: pointer;
}

.avatar {
  cursor: pointer;
}

/* ===== 主体区域 ===== */
.body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ===== Sider ===== */
.sider {
  background: #fff !important;
  border-right: 1px solid #F2F3F5;
  overflow-y: auto;
}

.menu {
  border-right: none !important;
  padding: 8px 0;
}

/* ===== Content ===== */
.content {
  flex: 1;
  background: #F5F6F8;
  overflow-y: auto;
  padding: 16px;
}
```

---

## 定制化要点

生成 AppLayout 时，根据用户回答替换以下内容：

| 位置 | 替换内容 |
|------|---------|
| `logoText` 内的文字 | 用户的产品名称 |
| `TOP_NAV_ITEMS` 数组 | 用户的顶部一级导航 |
| `SIDER_MENU_ITEMS` 对象 | 用户的侧边栏菜单（含分组和嵌套） |
| `topNavItemActive` 中的颜色 | 用户的品牌主色 |
| Dropdown items | 用户右上角的下拉菜单项 |
| `Bell` 组件 | 如用户说不需要，删除通知铃铛 |

---

## 固定侧边栏 vs 动态侧边栏

### 固定侧边栏（不随顶部切换）

将 `SIDER_MENU_ITEMS` 改为普通数组：

```tsx
const SIDER_MENU_ITEMS: MenuItemConfig[] = [
  { key: 'page-1', label: '页面1' },
  { key: 'page-2', label: '页面2' },
];

// 使用时直接引用
<Menu items={SIDER_MENU_ITEMS} ... />
```

### 动态侧边栏（随顶部导航切换）

保持 `SIDER_MENU_ITEMS` 为对象，key 对应顶部导航 key：

```tsx
const menuItems = SIDER_MENU_ITEMS[activeNav] ?? [];
<Menu items={menuItems} ... />
```
