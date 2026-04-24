/**
 * ThemeProvider 使用示例
 * 展示如何在实际项目中集成 ThemeProvider
 */

import React from 'react'
import { Button, Space, Table, Card, Input, Tag, message } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { ThemeProvider } from './index'

// 模拟数据
const dataSource = [
  {
    key: '1',
    name: '张三',
    age: 28,
    status: 'active',
    address: '北京市朝阳区'
  },
  {
    key: '2',
    name: '李四',
    age: 35,
    status: 'warning',
    address: '上海市浦东新区'
  },
  {
    key: '3',
    name: '王五',
    age: 42,
    status: 'inactive',
    address: '广州市天河区'
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
        active: '正常',
        warning: '警告',
        inactive: '已停用'
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
        <Button type="link" danger size="small">删除</Button>
      </Space>
    )
  }
]

function DemoPage() {
  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
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
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Card title="操作示例" style={{ marginTop: 24 }}>
        <Space wrap>
          <Button type="primary">Primary Button</Button>
          <Button>Default Button</Button>
          <Button type="dashed">Dashed Button</Button>
          <Button type="link">Link Button</Button>
          <Button danger>Danger Button</Button>
        </Space>
      </Card>

      <Card title="反馈测试" style={{ marginTop: 24 }}>
        <Space>
          <Button onClick={() => message.success('操作成功')}>
            Success Message
          </Button>
          <Button onClick={() => message.warning('请注意')}>
            Warning Message
          </Button>
          <Button onClick={() => message.error('操作失败')}>
            Error Message
          </Button>
        </Space>
      </Card>

      <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <h3>💡 使用提示</h3>
        <p>点击右下角的 🎨 按钮打开主题编辑器：</p>
        <ul>
          <li>选择预置主题，页面立即切换风格</li>
          <li>自定义主色调、圆角、背景模式、字号</li>
          <li>所有修改实时预览</li>
          <li>点击"保存配置"持久化主题</li>
        </ul>
      </div>
    </div>
  )
}

export default function App() {
  const handleSave = async (theme: any) => {
    console.log('保存主题配置:', theme)
    // 在实际项目中，这里应该调用 AI 的 write_to_file 工具
    // 将主题配置写入 01-foundation/theme.ts
    return new Promise((resolve) => setTimeout(resolve, 500))
  }

  return (
    <ThemeProvider onSave={handleSave}>
      <DemoPage />
    </ThemeProvider>
  )
}
