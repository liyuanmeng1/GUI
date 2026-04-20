import React from 'react'
import { Button, Space, Table, Card, Input, Tag, message, Descriptions, Statistic, Row, Col } from 'antd'
import { SearchOutlined, PlusOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons'
import { ThemeProvider } from './components/ThemeProvider'

// 模拟用户数据
const dataSource = [
  {
    key: '1',
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    status: 'active',
    address: '北京市朝阳区'
  },
  {
    key: '2',
    name: '李四',
    age: 35,
    email: 'lisi@example.com',
    status: 'warning',
    address: '上海市浦东新区'
  },
  {
    key: '3',
    name: '王五',
    age: 42,
    email: 'wangwu@example.com',
    status: 'inactive',
    address: '广州市天河区'
  },
  {
    key: '4',
    name: '赵六',
    age: 31,
    email: 'zhaoliu@example.com',
    status: 'active',
    address: '深圳市南山区'
  }
]

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorMap: Record<string, string> = {
        active: 'success',
        warning: 'warning',
        inactive: 'default'
      }
      const textMap: Record<string, string> = {
        active: '✅ 正常',
        warning: '⚠️ 警告',
        inactive: '🔴 已停用'
      }
      return <Tag color={colorMap[status]}>{textMap[status]}</Tag>
    }
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size="small">
        <Button type="link" size="small">编辑</Button>
        <Button type="link" size="small">查看</Button>
        <Button type="link" danger size="small">删除</Button>
      </Space>
    )
  }
]

function DemoPage() {
  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
      {/* 数据统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={1128}
              prefix={<UserOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日订单"
              value={93}
              prefix={<ShoppingCartOutlined />}
              suffix="笔"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日收入"
              value={11280}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="增长率"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 用户列表 */}
      <Card
        title="用户管理"
        extra={
          <Space>
            <Input
              placeholder="搜索用户"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Button type="primary" icon={<PlusOutlined />}>
              新建用户
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 10, total: 50 }}
        />
      </Card>

      {/* 按钮示例 */}
      <Card title="按钮示例" style={{ marginTop: 24 }}>
        <Space wrap>
          <Button type="primary">Primary Button</Button>
          <Button>Default Button</Button>
          <Button type="dashed">Dashed Button</Button>
          <Button type="link">Link Button</Button>
          <Button danger>Danger Button</Button>
          <Button type="primary" disabled>Disabled</Button>
        </Space>
      </Card>

      {/* 详情示例 */}
      <Card title="详情示例" style={{ marginTop: 24 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="用户名">张三</Descriptions.Item>
          <Descriptions.Item label="手机号">188****8888</Descriptions.Item>
          <Descriptions.Item label="邮箱">zhangsan@example.com</Descriptions.Item>
          <Descriptions.Item label="注册时间">2024-01-15</Descriptions.Item>
          <Descriptions.Item label="地址" span={2}>
            北京市朝阳区某某街道某某小区
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 反馈测试 */}
      <Card title="反馈示例" style={{ marginTop: 24 }}>
        <Space>
          <Button onClick={() => message.success('✅ 操作成功')}>
            Success Message
          </Button>
          <Button onClick={() => message.warning('⚠️ 请注意检查')}>
            Warning Message
          </Button>
          <Button onClick={() => message.error('❌ 操作失败')}>
            Error Message
          </Button>
          <Button onClick={() => message.info('ℹ️ 这是提示信息')}>
            Info Message
          </Button>
        </Space>
      </Card>

      {/* 使用提示 */}
      <Card
        title="💡 主题编辑器使用提示"
        style={{ marginTop: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
        headStyle={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)' }}
      >
        <div style={{ fontSize: 15, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 12, fontWeight: 500 }}>
            👉 点击右下角的 <span style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '2px 8px', 
              borderRadius: 4,
              fontWeight: 600
            }}>🎨</span> 按钮打开主题编辑器
          </p>
          <ul style={{ paddingLeft: 24, margin: 0 }}>
            <li>✨ 6 种预置主题一键切换（极简留白/专业蓝/自然绿/暗夜模式/复古文艺/科技感）</li>
            <li>🎨 自定义主色调，所有按钮/链接/Tag 实时变色</li>
            <li>📐 调整圆角风格（方正/适中/圆润），组件立即响应</li>
            <li>🌓 切换背景模式（明亮/暗色），体验暗色主题</li>
            <li>📏 调整字号大小（12px/14px/16px），文字大小实时变化</li>
            <li>💾 点击"保存配置"按钮，持久化主题设置</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

export default function App() {
  const handleSave = async (theme: any) => {
    console.log('保存主题配置:', theme)
    // 模拟保存延迟
    return new Promise((resolve) => setTimeout(resolve, 800))
  }

  return (
    <ThemeProvider onSave={handleSave}>
      <DemoPage />
    </ThemeProvider>
  )
}
