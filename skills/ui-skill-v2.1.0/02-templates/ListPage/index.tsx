import React, { useState } from 'react';
import {
  ConfigProvider,
  Table,
  Button,
  Input,
  Space,
  Typography,
  Badge,
  Tag,
  Select,
  Pagination,
  Modal,
  Form,
  Dropdown,
  Avatar,
  Empty,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { TableColumnsType, MenuProps } from 'antd';
import { theme as antTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import theme from '../../01-foundation/theme.json';
import styles from './index.module.css';

const { Title, Text } = Typography;

// ---- PageHeader Types ----
interface PageHeaderTabItem {
  key: string;
  label: string;
}

interface PageHeaderProps {
  title: string;
  /** 描述文案（与 tabs 二选一） */
  description?: string;
  /** 功能 Tab（与 description 二选一） */
  tabs?: PageHeaderTabItem[];
  activeTabKey?: string;
  onTabChange?: (key: string) => void;
  /** 使用说明按钮点击 */
  onHelp?: () => void;
}

// ---- PageHeader Component ----
const PageHeader = ({
  title,
  description,
  tabs,
  activeTabKey,
  onTabChange,
  onHelp,
}: PageHeaderProps) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.pageHeaderLeft}>
        {/* Title block */}
        <div className={styles.pageTitleBlock}>
          <Title level={4} className={styles.pageTitle}>{title}</Title>
        </div>
        {/* Description variant */}
        {description && !tabs && (
          <span className={styles.pageDescription}>{description}</span>
        )}
        {/* Tab variant */}
        {tabs && tabs.length > 0 && !description && (
          <>
          <div className={styles.pageTitleDivider} />
          <div className={styles.pageTabContainer}>
            <div className={styles.pageTabList}>
              {tabs.map((tab) => {
                const isActive = tab.key === activeTabKey;
                return (
                  <div
                    key={tab.key}
                    className={`${styles.pageTabItem} ${isActive ? styles.pageTabItemActive : ''}`}
                    onClick={() => onTabChange?.(tab.key)}
                  >
                    <div className={styles.pageTabItemLabel}>{tab.label}</div>
                    {isActive && <div className={styles.pageTabItemUnderline} />}
                  </div>
                );
              })}
            </div>
          </div>
          </>
        )}
      </div>
      {/* 使用说明 */}
      <div className={styles.pageHeaderHelp} onClick={onHelp}>
        <img
          className={styles.pageHeaderHelpIcon}
          src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ade58665-0cb8-4714-829f-b46ea24d15f2"
          alt="help"
        />
        <Text className={styles.pageHeaderHelpText}>使用说明</Text>
      </div>
    </div>
  );
};

// ---- Types ----
type InferenceStatus = 'running' | 'stopped' | 'error' | 'starting';

interface InferenceRecord {
  id: string;
  name: string;
  status: InferenceStatus;
  image: string;
  resource: string;
  runningTime: string;
  project: string;
  updatedAt: string;
  creator: {
    name: string;
    avatar?: string;
  };
}

// ---- Constants ----
const STATUS_CONFIG: Record<InferenceStatus, { label: string; badgeStatus: 'processing' | 'success' | 'error' | 'warning'; tagColor?: string }> = {
  running: { label: '运行中', badgeStatus: 'processing' },
  stopped: { label: '已停止', badgeStatus: 'error', tagColor: 'error' },
  error: { label: '异常', badgeStatus: 'warning', tagColor: 'warning' },
  starting: { label: '启动中', badgeStatus: 'processing' },
};

// ---- Mock Data ----
const mockData: InferenceRecord[] = Array.from({ length: 9 }, (_, i) => ({
  id: `412312${i + 1}`,
  name: '默认文字',
  status: 'running' as InferenceStatus,
  image: '机器镜像',
  resource: '16G',
  runningTime: '6h14m22s',
  project: '个人项目',
  updatedAt: '2024-03-0' + (i + 1),
  creator: {
    name: '希天天',
    avatar: undefined,
  },
}));

const PAGE_SIZE_OPTIONS = [
  { label: '10 条/页', value: 10 },
  { label: '20 条/页', value: 20 },
  { label: '50 条/页', value: 50 },
];

// ---- Main Component Props ----
interface OnlineInferencePageProps {
  /** PageHeader 变体：'description'（描述类型）| 'tabs'（Tab类型），默认 'description' */
  headerVariant?: 'description' | 'tabs';
}

// ---- Main Component ----
const OnlineInferencePage = ({ headerVariant = 'description' }: OnlineInferencePageProps) => {
  const { token } = antTheme.useToken();

  const [dataSource] = useState<InferenceRecord[]>(mockData);
  const [filteredData, setFilteredData] = useState<InferenceRecord[]>(mockData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [pageHeaderActiveTab, setPageHeaderActiveTab] = useState<string>('tab1');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(5);
  const [pageSize, setPageSize] = useState(10);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  const total = 85;

  // ---- Tab change ----
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'all') {
      setFilteredData(dataSource);
    } else {
      setFilteredData(dataSource.filter((item) => item.status === 'running'));
    }
    setCurrentPage(1);
  };

  // ---- Search ----
  const handleSearch = (value: string) => {
    setSearchValue(value);
    const base = activeTab === 'all' ? dataSource : dataSource.filter((i) => i.status === 'running');
    setFilteredData(
      value ? base.filter((item) => item.name.includes(value) || item.id.includes(value)) : base
    );
  };

  // ---- Refresh ----
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('刷新成功');
    }, 600);
  };

  // ---- Create ----
  const handleCreate = () => {
    form.resetFields();
    setCreateModalOpen(true);
  };

  const handleCreateOk = () => {
    form.validateFields().then(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setCreateModalOpen(false);
        message.success('新建成功');
      }, 500);
    });
  };

  // ---- Action Menu ----
  const getActionMenu = (record: InferenceRecord): MenuProps => ({
    items: [
      { key: 'edit', label: '编辑' },
      { key: 'stop', label: '停止', disabled: record.status !== 'running' },
      { type: 'divider' },
      { key: 'delete', label: <span style={{ color: token.colorError }}>删除</span>, danger: false },
    ],
  });

  // ---- Columns ----
  const columns: TableColumnsType<InferenceRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
      render: (text) => (
        <a style={{ color: token.colorPrimary }}>{text}</a>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      filterIcon: <span style={{ fontSize: 12, color: token.colorTextTertiary }}>▼</span>,
      render: (status: InferenceStatus) => {
        const cfg = STATUS_CONFIG[status];
        if (status === 'running' || status === 'starting') {
          return (
            <Space size={4}>
              <Badge status={cfg.badgeStatus} color={status === 'running' ? token.colorPrimary : token.colorWarning} />
              <Text style={{ fontSize: 14 }}>{cfg.label}</Text>
            </Space>
          );
        }
        return (
          <Tag color={cfg.tagColor} style={{ borderRadius: 4, fontSize: 12, margin: 0 }}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: '镜像',
      dataIndex: 'image',
      width: 120,
      ellipsis: true,
      filterIcon: <span style={{ fontSize: 12, color: token.colorTextTertiary }}>▼</span>,
    },
    {
      title: '资源规格',
      dataIndex: 'resource',
      width: 110,
      ellipsis: true,
      filterIcon: <span style={{ fontSize: 12, color: token.colorTextTertiary }}>▼</span>,
    },
    {
      title: '运行时长',
      dataIndex: 'runningTime',
      width: 110,
      sorter: true,
    },
    {
      title: '所属项目',
      dataIndex: 'project',
      width: 120,
      ellipsis: true,
      filterIcon: <span style={{ fontSize: 12, color: token.colorTextTertiary }}>▼</span>,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 120,
      ellipsis: true,
      filterIcon: <span style={{ fontSize: 12, color: token.colorTextTertiary }}>▼</span>,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 90,
      render: (creator: InferenceRecord['creator']) => (
        <Space size={6}>
          <Avatar
            size={24}
            src={creator.avatar}
            style={{ backgroundColor: token.colorPrimaryBg, color: token.colorPrimary, fontSize: 12 }}
          >
            {creator.name[0]}
          </Avatar>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button
            type="link"
            size="small"
            style={{ color: token.colorPrimary, paddingLeft: 0 }}
          >
            启用
          </Button>
          <Dropdown menu={getActionMenu(record)} trigger={['click']}>
            <Button type="link" size="small" style={{ color: token.colorTextSecondary }}>
              更多
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: 'all', label: '全部' },
    { key: 'mine', label: '我创建的' },
  ];

  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      {/* PageHeader */}
      {headerVariant === 'tabs' ? (
        <PageHeader
          title="在线推理"
          tabs={[
            { key: 'tab1', label: 'Tab1' },
            { key: 'tab2', label: 'Tab2' },
            { key: 'tab3', label: 'Tab3' },
            { key: 'tab4', label: 'Tab4' },
            { key: 'tab5', label: 'Tab5' },
            { key: 'tab6', label: 'Tab6' },
            { key: 'tab7', label: 'Tab7' },
          ]}
          activeTabKey={pageHeaderActiveTab}
          onTabChange={setPageHeaderActiveTab}
          onHelp={() => message.info('使用说明')}
        />
      ) : (
        <PageHeader
          title="在线推理"
          description="在线推理是一种高效的模型服务化方式，帮助用户轻松将模型部署为 API 接口"
          onHelp={() => message.info('使用说明')}
        />
      )}

      {/* PageContent */}
      <div className={styles.pageContent}>

          {/* 操作栏 */}
          <div className={styles.toolbar}>
            {/* 左侧：按钮 + Tab + 搜索，间距 12px */}
            <Space size={12} align="center">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                新建推理服务
              </Button>
              {/* 自定义 SegmentedTab，不使用 antd Tabs */}
              <div className={styles.segmentedTab}>
                {tabItems.map((tab) => (
                  <div
                    key={tab.key}
                    className={`${styles.segmentedTabItem} ${activeTab === tab.key ? styles.segmentedTabItemActive : ''}`}
                    onClick={() => handleTabChange(tab.key)}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
              <Input
                placeholder="搜索名称、回车执行搜索"
                prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                style={{ width: 240 }}
                allowClear
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                onPressEnter={() => handleSearch(searchValue)}
              />
            </Space>
            {/* 右侧：两个 icon button，间距 12px */}
            <Space size={12} align="center">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                style={{ color: token.colorTextTertiary }}
              />
              <Button
                icon={<SettingOutlined />}
                style={{ color: token.colorTextTertiary }}
              />
            </Space>
          </div>

          {/* Table */}
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            bordered={false}
            pagination={false}
            scroll={{ x: 1100 }}
          />

          {/* 分页栏 */}
          <div className={styles.paginationBar}>
            <Space size={8} align="center">
              <Text style={{ color: token.colorTextSecondary, fontSize: 14 }}>
                共 {total} 条
              </Text>
              <Select
                value={pageSize}
                size="small"
                style={{ width: 100 }}
                options={PAGE_SIZE_OPTIONS}
                onChange={(val) => { setPageSize(val); setCurrentPage(1); }}
              />
            </Space>
            <Space size={8} align="center">
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showQuickJumper
                showSizeChanger={false}
              />
            </Space>
          </div>
      </div>

      {/* 新建推理服务弹窗 */}
      <Modal
        title="新建推理服务"
        open={createModalOpen}
        onOk={handleCreateOk}
        onCancel={() => setCreateModalOpen(false)}
        okText="确认"
        cancelText="取消"
        confirmLoading={loading}
        destroyOnHidden
        width={560}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="服务名称"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder="请输入服务名称" />
          </Form.Item>
          <Form.Item
            name="image"
            label="镜像"
            rules={[{ required: true, message: '请选择镜像' }]}
          >
            <Select
              placeholder="请选择镜像"
              options={[
                { label: '机器镜像 v1.0', value: 'machine-v1' },
                { label: '机器镜像 v2.0', value: 'machine-v2' },
                { label: '自定义镜像', value: 'custom' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="resource"
            label="资源规格"
            rules={[{ required: true, message: '请选择资源规格' }]}
          >
            <Select
              placeholder="请选择资源规格"
              options={[
                { label: '8G', value: '8g' },
                { label: '16G', value: '16g' },
                { label: '32G', value: '32g' },
                { label: '80G', value: '80g' },
              ]}
            />
          </Form.Item>
          <Form.Item name="project" label="所属项目">
            <Select
              placeholder="请选择项目"
              options={[
                { label: '个人项目', value: 'personal' },
                { label: '团队项目 A', value: 'team-a' },
                { label: '团队项目 B', value: 'team-b' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default OnlineInferencePage;
