import React from 'react';
import {
  ConfigProvider,
  Row,
  Col,
  Typography,
  Statistic,
  Table,
  Space,
  Badge,
} from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { theme as antTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import theme from '../../01-foundation/theme.json';
import styles from './index.module.css';

const { Title, Text } = Typography;

// ============================================================
// 数据看板页模板 — DashboardPage
// ------------------------------------------------------------
// 结构：
//   PageHeader  — 页面标题 + 副标题
//   StatsRow    — 统计卡片行（4 列）
//   ContentRow  — 图表区（左 2/3） + 排行/列表区（右 1/3）
// ============================================================

// ---- Mock 统计数据 ----
const STATS = [
  { label: '今日调用量', value: 128540, unit: '次', trend: 'up', trendValue: '+12.5%' },
  { label: '运行中服务', value: 24, unit: '个', trend: 'up', trendValue: '+2' },
  { label: '平均响应时长', value: 85, unit: 'ms', trend: 'down', trendValue: '-8ms' },
  { label: '错误率', value: 0.12, unit: '%', trend: 'down', trendValue: '-0.03%' },
];

// ---- Mock 列表数据 ----
interface TopItem { rank: number; name: string; value: number; unit: string }
const TOP_DATA: TopItem[] = [
  { rank: 1, name: '在线推理服务-A', value: 45230, unit: '次' },
  { rank: 2, name: '模型精调任务-B', value: 32100, unit: '次' },
  { rank: 3, name: '批量推理服务-C', value: 28800, unit: '次' },
  { rank: 4, name: '在线推理服务-D', value: 14320, unit: '次' },
  { rank: 5, name: '模型量化任务-E', value: 8090, unit: '次' },
];

const DashboardPage: React.FC = () => {
  const { token } = antTheme.useToken();

  const topColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 48,
      render: (rank: number) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: 4,
            background: rank <= 3 ? token.colorPrimary : token.colorFillTertiary,
            color: rank <= 3 ? '#fff' : token.colorTextTertiary,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {rank}
        </span>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      render: (name: string) => <Text style={{ color: token.colorText }}>{name}</Text>,
    },
    {
      title: '调用量',
      dataIndex: 'value',
      width: 80,
      align: 'right' as const,
      render: (v: number, r: TopItem) => (
        <Text style={{ color: token.colorTextSecondary, fontSize: 13 }}>
          {v.toLocaleString()} {r.unit}
        </Text>
      ),
    },
  ];

  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      {/* ===== PageHeader ===== */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <Title level={4} className={styles.pageTitle}>数据看板</Title>
          <Text className={styles.pageSubtitle}>实时展示平台核心指标与资源使用情况</Text>
        </div>
      </div>

      {/* ===== PageContent ===== */}
      <div className={styles.pageContent}>

        {/* —— 统计卡片行 —— */}
        <Row gutter={[12, 12]} className={styles.statsRow}>
          {STATS.map((stat) => (
            <Col key={stat.label} xs={24} sm={12} md={6}>
              <div className={styles.statCard}>
                <Text className={styles.statLabel}>{stat.label}</Text>
                <div className={styles.statValueRow}>
                  <Statistic
                    value={stat.value}
                    suffix={stat.unit}
                    valueStyle={{ fontSize: 28, fontWeight: 600, color: token.colorText, lineHeight: 1 }}
                  />
                  <span
                    className={styles.statTrend}
                    style={{ color: stat.trend === 'up' ? token.colorSuccess : token.colorError }}
                  >
                    {stat.trend === 'up'
                      ? <ArrowUpOutlined style={{ fontSize: 11 }} />
                      : <ArrowDownOutlined style={{ fontSize: 11 }} />}
                    {stat.trendValue}
                  </span>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* —— 主内容区 —— */}
        <Row gutter={[12, 12]}>
          {/* 左：图表占位区（实际项目替换为 ECharts / Recharts 等） */}
          <Col xs={24} md={16}>
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <Title level={5} className={styles.cardTitle}>调用量趋势</Title>
                <Space size={8}>
                  {['近7天', '近30天', '近90天'].map((label) => (
                    <span key={label} className={styles.timeFilter}>{label}</span>
                  ))}
                </Space>
              </div>
              {/* 图表占位 */}
              <div className={styles.chartPlaceholder}>
                <Text style={{ color: token.colorTextTertiary }}>在此处接入图表组件（ECharts / Recharts 等）</Text>
              </div>
            </div>

            {/* 服务状态概览 */}
            <div className={styles.chartCard} style={{ marginTop: 12 }}>
              <div className={styles.cardHeader}>
                <Title level={5} className={styles.cardTitle}>服务状态概览</Title>
              </div>
              <div className={styles.statusRow}>
                {[
                  { label: '运行中', count: 24, color: token.colorPrimary },
                  { label: '已停止', count: 5, color: token.colorTextQuaternary },
                  { label: '异常', count: 1, color: token.colorError },
                  { label: '启动中', count: 2, color: token.colorWarning },
                ].map((item) => (
                  <div key={item.label} className={styles.statusItem}>
                    <Space size={6}>
                      <Badge color={item.color} />
                      <Text style={{ color: token.colorTextSecondary }}>{item.label}</Text>
                    </Space>
                    <Text style={{ fontSize: 20, fontWeight: 600, color: item.color }}>
                      {item.count}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* 右：调用量 Top5 */}
          <Col xs={24} md={8}>
            <div className={styles.chartCard} style={{ height: '100%' }}>
              <div className={styles.cardHeader}>
                <Title level={5} className={styles.cardTitle}>调用量 Top 5</Title>
              </div>
              <Table
                rowKey="rank"
                columns={topColumns}
                dataSource={TOP_DATA}
                bordered={false}
                pagination={false}
                size="small"
                showHeader={false}
              />
            </div>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default DashboardPage;

// ============================================================
// 使用示例（main.jsx 中）：
// ============================================================
//
// import AppLayout from '../../02-templates/AppLayout/index';
// import DashboardPage from '../../02-templates/DashboardPage/index';
//
// <AppLayout selectedMenuKey="model-monitor" activeTopNav="首页">
//   <DashboardPage />
// </AppLayout>
