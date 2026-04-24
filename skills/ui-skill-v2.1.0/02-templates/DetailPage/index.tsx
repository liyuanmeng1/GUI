import React, { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Tabs,
  Typography,
  Dropdown,
} from 'antd';
import { ArrowLeftOutlined, DownOutlined } from '@ant-design/icons';
import { theme as antTheme } from 'antd';
import styles from './index.module.css';
// theme is inherited from AppLayout's ConfigProvider; no direct import needed here

const { Text } = Typography;

// ============================================================
// 详情页模板 — DetailPage
// ------------------------------------------------------------
// 功能区域（通过 props 控制显隐）：
//
//   1. 面包屑区    breadcrumbs         必有  props.breadcrumbs
//   2. 标题区      title / statusTag   必有  props.title / props.statusTag
//   3. 全局操作区  actions             可选  props.actions（不传则隐藏）
//   4. 附属信息区  metaItems           可选  props.metaItems（不传则隐藏）
//   5. Tab 切换区  tabs                可选  props.tabs（不传则隐藏，内容区直接渲染 children）
//   6. 内容区      children            必有
// ============================================================

// ---- Types ----

/** 面包屑项 */
export interface BreadcrumbItem {
  label: string;
  /** 有 onClick 则渲染为可点击文本，最后一项不需要传 */
  onClick?: () => void;
}

/** 全局操作按钮 */
export interface ActionItem {
  key: string;
  label: React.ReactNode;
  /** 'primary' | 'default'（三级）| 'danger' */
  type?: 'primary' | 'default' | 'danger';
  /** 是否带下拉菜单（"更多"按钮场景） */
  dropdownMenu?: Array<{ key: string; label: React.ReactNode; danger?: boolean }>;
  onClick?: () => void;
  disabled?: boolean;
}

/** 附属信息项（PageHeader 下方横排 key-value） */
export interface MetaItem {
  label: string;
  /** 可以是字符串或自定义 ReactNode（如头像+名字） */
  value: React.ReactNode;
}

/** Tab 项 */
export interface TabItem {
  key: string;
  label: string;
  children: React.ReactNode;
}

/** 状态 Tag 配置 */
export interface StatusTag {
  label: string;
  /** Tag 背景色（十六进制，会自动加透明度），如 '#DAF7DD' */
  bgColor?: string;
  /** Tag 文字色，默认 '#252626' */
  textColor?: string;
  /** 左侧小圆点颜色（不传则不渲染圆点） */
  dotColor?: string;
}

// ---- Props ----
export interface DetailPageProps {
  // ① 面包屑区（必有）
  breadcrumbs: BreadcrumbItem[];

  // ② 标题区（必有）
  title: string;
  statusTag?: StatusTag;

  // ③ 全局操作按钮区（可选）
  actions?: ActionItem[];

  // ④ 附属信息区（可选）
  metaItems?: MetaItem[];

  // ⑤ Tab 切换区（可选）
  tabs?: TabItem[];
  defaultActiveTab?: string;

  // ⑥ 内容区（必有）
  // 有 tabs 时 children 无效，内容由 tabs[x].children 决定；
  // 无 tabs 时直接渲染 children
  children?: React.ReactNode;
}

// ============================================================
// DetailPage Component
// ============================================================
const DetailPage: React.FC<DetailPageProps> = ({
  breadcrumbs,
  title,
  statusTag,
  actions,
  metaItems,
  tabs,
  defaultActiveTab,
  children,
}) => {
  const { token } = antTheme.useToken();
  const [activeTab, setActiveTab] = useState(defaultActiveTab ?? tabs?.[0]?.key ?? '');

  const hasTabs = tabs && tabs.length > 0;
  const hasActions = actions && actions.length > 0;
  const hasMeta = metaItems && metaItems.length > 0;

  // PageHeader 高度：面包屑 36px + 标题行 32px + (附属信息行 34px)? + (Tab 34px)?
  // 用 flex column 自动撑开，不固定高度

  return (
    <>
      {/* ===== PageHeader ===== */}
      <div className={styles.pageHeader}>

        {/* —— 上半部分：面包屑 + 标题行 + 操作按钮 —— */}
        <div className={styles.pageHeaderTop}>
          {/* 左侧：面包屑 & 标题 */}
          <div className={styles.pageHeaderLeft}>
            {/* ① 面包屑区 */}
            <div className={styles.breadcrumbRow}>
              <Breadcrumb
                items={breadcrumbs.map((item, idx) => ({
                  title: idx < breadcrumbs.length - 1
                    ? (
                      <span
                        className={styles.breadcrumbLink}
                        onClick={item.onClick}
                      >
                        {idx === 0 && (
                          <ArrowLeftOutlined className={styles.breadcrumbArrow} />
                        )}
                        {item.label}
                      </span>
                    )
                    : <span className={styles.breadcrumbCurrent}>{item.label}</span>,
                }))}
                separator={
                  <span className={styles.breadcrumbSep}>
                    <img
                      src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2df9ea9d-f50a-4406-9c08-39aa10bf2b0a"
                      alt=""
                      style={{ width: 16, height: 16, verticalAlign: 'middle' }}
                    />
                  </span>
                }
              />
            </div>

            {/* ② 标题区 */}
            <div className={styles.titleRow}>
              <span className={styles.title}>{title}</span>
              {statusTag && (
                <span
                  className={styles.statusTag}
                  style={{
                    background: statusTag.bgColor ? `${statusTag.bgColor}99` : '#F5F7FA',
                    color: statusTag.textColor ?? '#252626',
                  }}
                >
                  {statusTag.dotColor && (
                    <span
                      className={styles.statusDot}
                      style={{ background: statusTag.dotColor }}
                    />
                  )}
                  {statusTag.label}
                </span>
              )}
            </div>
          </div>

          {/* ③ 全局操作按钮区（可选） */}
          {hasActions && (
            <div className={styles.actions}>
              {actions!.map((action) =>
                action.dropdownMenu ? (
                  <Dropdown
                    key={action.key}
                    menu={{
                      items: action.dropdownMenu.map((m) => ({
                        key: m.key,
                        label: m.label,
                        danger: m.danger,
                      })),
                    }}
                    trigger={['click']}
                  >
                    <Button
                      disabled={action.disabled}
                      style={
                        action.type === 'danger'
                          ? { color: token.colorError, borderColor: token.colorError }
                          : undefined
                      }
                    >
                      {action.label}
                      <DownOutlined style={{ fontSize: 12, marginLeft: 4 }} />
                    </Button>
                  </Dropdown>
                ) : (
                  <Button
                    key={action.key}
                    type={action.type === 'primary' ? 'primary' : 'default'}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    danger={action.type === 'danger'}
                  >
                    {action.label}
                  </Button>
                )
              )}
            </div>
          )}
        </div>

        {/* ④ 附属信息区（可选） */}
        {hasMeta && (
          <div className={styles.metaRow}>
            {metaItems!.map((item, idx) => (
              <div key={idx} className={styles.metaItem}>
                <Text className={styles.metaLabel}>{item.label}</Text>
                <span className={styles.metaValue}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ⑤ Tab 切换区（可选） */}
        {hasTabs && (
          <div className={styles.tabRow}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabs!.map((t) => ({ key: t.key, label: t.label }))}
              style={{ marginBottom: 0 }}
            />
          </div>
        )}
      </div>

      {/* ===== 内容区 ===== */}
      {/* ⑥ 内容区：有 Tab 时渲染对应 Tab 的 children；无 Tab 时渲染 children */}
      <div className={styles.pageContent}>
        {hasTabs
          ? tabs!.find((t) => t.key === activeTab)?.children
          : children}
      </div>
    </>
  );
};

export default DetailPage;

// ============================================================
// 使用示例（main.jsx 中）：
// ============================================================
//
// import AppLayout from '../example/AppLayout/AppLayout';
// import DetailPage from '../example/DetailPage/index';
//
// <AppLayout selectedMenuKey="custom-task" activeTopNav="模型服务">
//   <DetailPage
//     breadcrumbs={[
//       { label: '自定义任务', onClick: () => history.back() },
//       { label: '自定义任务详情' },
//     ]}
//     title="自定义任务-test"
//     statusTag={{ label: '运行中', bgColor: '#DAF7DD', dotColor: '#30C453' }}
//     actions={[
//       { key: 'tensorboard', label: 'TensorBoard', onClick: () => {} },
//       { key: 'copy', label: '复制', onClick: () => {} },
//       { key: 'stop', label: '终止', onClick: () => {} },
//       {
//         key: 'more',
//         label: '更多',
//         dropdownMenu: [
//           { key: 'delete', label: '删除', danger: true },
//         ],
//       },
//     ]}
//     metaItems={[
//       { label: 'ID', value: '20240426120000' },
//       { label: '创建人', value: <><Avatar size={20} />希夭夭</> },
//       { label: '更新时间', value: '2024-04-26 12:00:00' },
//       { label: '数据类型', value: '非结构化数据' },
//     ]}
//     tabs={[
//       { key: 'basic', label: '基本信息', children: <BasicInfoContent /> },
//       { key: 'instances', label: '实例列表', children: <InstanceListContent /> },
//       { key: 'logs', label: '日志', children: <LogsContent /> },
//     ]}
//   />
// </AppLayout>
