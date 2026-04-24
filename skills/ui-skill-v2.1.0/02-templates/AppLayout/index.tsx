import React, { useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import styles from './index.module.css';

// ---- Logo 图片（Figma 导出） ----
const LOGO_IMGS = [
  // bottom-right (z1)
  { style: { position: 'absolute' as const, bottom: '5.6px', right: '0px', width: 11, height: 11 }, src: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5a792250-6b94-48a2-93b5-a70c6aa06229' },
  // top-left (z2)
  { style: { position: 'absolute' as const, top: '5.6px', left: '0px', width: 11, height: 11 }, src: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3109c049-8075-4a22-8e31-68bd136c02ff' },
  // bottom-left (z3)
  { style: { position: 'absolute' as const, bottom: '0px', left: '5.6px', width: 11, height: 11 }, src: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e341243b-4333-4714-920d-e5296b3cacdf' },
  // top-right (z4)
  { style: { position: 'absolute' as const, top: '0px', right: '5.6px', width: 11, height: 11 }, src: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/627d8aa0-7951-48ed-b5b6-fab83069b987' },
];

// ---- 顶部导航 ----
const TOP_NAVS = ['首页', '模型服务', 'GPU算力服务', '系统管理'];

// ---- 菜单数据（完整对应 Figma 侧边栏） ----
interface MenuItem {
  key: string;
  label: string;
  iconUrl: string;
  children?: Array<{ key: string; label: string }>;
}

interface MenuGroup {
  groupKey: string;
  label: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    groupKey: 'inference',
    label: '模型推理',
    items: [
      { key: 'online-inference', label: '在线推理', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2b860aca-fb8b-41b5-a847-68eef951fb2e' },
      { key: 'batch-inference', label: '批量推理', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7178e1bc-ce25-4e05-b4ec-a49e7540c7ed' },
      { key: 'model-monitor', label: '模型监控', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b1393017-6a80-4267-b9bc-b662fc3a33cf' },
    ],
  },
  {
    groupKey: 'custom',
    label: '模型定制',
    items: [
      { key: 'model-finetuning', label: '模型精调', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/bcefd10b-c194-4169-a057-21c7bdf18dfc' },
      { key: 'model-quantize', label: '模型量化', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ecc72108-7afb-493c-92e0-86c1eb5f6fea' },
      { key: 'model-distill', label: '模型蒸馏', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/73b0a4d8-d620-4b3d-a87e-914649005a75' },
      {
        key: 'model-dev',
        label: '模型研发',
        iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e91188bc-bc5f-4bf8-b03e-81ebddd16768',
        children: [
          { key: 'dev-machine', label: '开发机' },
          { key: 'file-storage', label: '文件存储' },
          { key: 'custom-task', label: '自定义任务' },
        ],
      },
    ],
  },
  {
    groupKey: 'hosting',
    label: '模型托管',
    items: [
      { key: 'model-deploy', label: '模型部署', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3f4e5a3d-8c70-4a78-b0e4-f49c51b123d5' },
      { key: 'model-repo', label: '模型仓库', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/8a9fd1f8-09b7-4b0a-a8fc-f279a7d6a59b' },
    ],
  },
  {
    groupKey: 'eval',
    label: '模型评测',
    items: [
      { key: 'effect-eval', label: '效果评测', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c1ce051d-3e7f-4c86-9f0f-c8ae69480f3a' },
      { key: 'perf-eval', label: '性能评测', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2e3a6b38-232d-4577-b44b-ce45ae484cfe' },
    ],
  },
  {
    groupKey: 'data',
    label: '数据管理',
    items: [
      { key: 'dataset', label: '数据集', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f6a6bf13-9890-4177-a048-3eae774d96ef' },
      { key: 'data-analysis', label: '数据分析', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/51c7f473-9a01-4e00-bdf9-0aa0f0f2cb3d' },
      { key: 'data-workflow', label: '数据工作流', iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/1113d021-8434-462c-b219-dd97c5acb551' },
    ],
  },
];

// ---- 模型广场（顶部独立项） ----
const MODEL_SQUARE: MenuItem = {
  key: 'model-square',
  label: '模型广场',
  iconUrl: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/1a178f5e-31e0-4e65-b876-1972ab58078e',
};

// ---- Props ----
export interface AppLayoutProps {
  children: React.ReactNode;
  selectedMenuKey?: string;
  activeTopNav?: string;
}

// ============================================================
// AppLayout 全局框架
// ============================================================
const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  selectedMenuKey = 'online-inference',
  activeTopNav = '模型服务',
}) => {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['model-dev']));

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const isActive = selectedMenuKey === item.key;
    const hasChildren = !!item.children?.length;
    const isExpanded = expandedKeys.has(item.key);

    return (
      <div key={item.key}>
        <div
          className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''} ${isChild ? styles.menuItemChild : ''}`}
          onClick={() => hasChildren && toggleExpand(item.key)}
        >
          {!isChild && (
            <img src={item.iconUrl} alt="" className={`${styles.menuItemIcon} ${isActive ? styles.menuItemIconActive : ''}`} />
          )}
          {isChild && <span className={styles.menuItemChildIndent} />}
          <span className={`${styles.menuItemLabel} ${isActive ? styles.menuItemLabelActive : ''}`}>
            {item.label}
          </span>
          {hasChildren && (
            <RightOutlined
              className={`${styles.menuItemArrow} ${isExpanded ? styles.menuItemArrowExpanded : ''}`}
            />
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.subMenu}>
            {item.children!.map((child) => renderMenuItem({ ...child, iconUrl: '' }, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F9FAFD' }}>
      {/* ====== TopNav ====== */}
      <div className={styles.topNav}>
        {/* 左区 */}
        <div className={styles.topNavLeft}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              {LOGO_IMGS.map((img, i) => (
                <img key={i} src={img.src} alt="" style={img.style} />
              ))}
            </div>
            <span className={styles.logoText}>快手万擎</span>
            <DownOutlined className={styles.logoArrow} />
          </div>

          {/* 顶部导航 Tab */}
          <div className={styles.topNavTabs}>
            {TOP_NAVS.map((nav) => (
              <div
                key={nav}
                className={`${styles.topNavTab} ${nav === activeTopNav ? styles.topNavTabActive : ''}`}
              >
                {nav}
              </div>
            ))}
          </div>
        </div>

        {/* 右区 */}
        <div className={styles.topNavRight}>
          {/* 项目选择器 */}
          <div className={styles.projectSelector}>
            <img
              src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/de9651ec-cf5a-4e6e-89f3-654bc851d5b0"
              alt=""
              className={styles.projectIcon}
            />
            <span className={styles.projectName}>默认项目</span>
            <img
              src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/08518bab-0acc-4af0-9e32-3c2ed0042385"
              alt=""
              style={{ width: 16, height: 16, flexShrink: 0 }}
            />
          </div>

          {/* 链接区 */}
          <div className={styles.topNavLinks}>
            <span className={styles.topNavLink}>API文档</span>
            <span className={styles.topNavLink}>官网</span>
            <span className={styles.topNavLink}>费用</span>
          </div>

          {/* 通知图标 */}
          <img
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a676dfd3-b925-4790-a5ed-f1425465c023"
            alt=""
            style={{ width: 24, height: 24, borderRadius: 4, flexShrink: 0 }}
          />

          {/* 用户头像 */}
          <div className={styles.userAvatar}>
            <span className={styles.userAvatarText}>Q</span>
          </div>
          <DownOutlined style={{ fontSize: 10, color: '#898A8C' }} />
        </div>
      </div>

      {/* ====== Body（Sider + Content） ====== */}
      <div style={{ display: 'flex', flex: 1, gap: 8, padding: '4px 8px 8px 8px', alignItems: 'flex-start', minHeight: 0 }}>
        {/* Sider */}
        <div style={{ width: 220, flexShrink: 0, background: '#FFFFFF', borderRadius: 12, border: '2px solid #FFFFFF', boxShadow: '0 2px 6px #1B196514, 0 0 18px #4558FF08', overflowY: 'auto', overflowX: 'hidden', minHeight: 'calc(100vh - 48px - 16px)', alignSelf: 'flex-start' }}>
          <div className={styles.siderInner}>
            {/* 模型广场（独立顶部项） */}
            {renderMenuItem(MODEL_SQUARE)}

            {/* 分组菜单 */}
            {MENU_GROUPS.map((group) => (
              <div key={group.groupKey} className={styles.menuGroup}>
                <span className={styles.menuGroupLabel}>{group.label}</span>
                {group.items.map((item) => renderMenuItem(item))}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: '#FFF', borderRadius: 12, border: '2px solid #FFFFFF', boxShadow: '0 2px 6px #1B196514, 0 0 18px #4558FF08', minHeight: 'calc(100vh - 48px - 16px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
