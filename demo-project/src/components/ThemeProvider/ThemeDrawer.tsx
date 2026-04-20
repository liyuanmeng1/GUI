/**
 * 主题编辑抽屉
 * 包含预置主题选择器和自定义编辑器
 */

import React from 'react'
import { Drawer, Space, Button, message, Divider } from 'antd'
import PresetSelector from './PresetSelector'
import CustomEditor from './CustomEditor'
import type { PresetTheme } from './presets'

interface ThemeDrawerProps {
  open: boolean
  currentTheme: PresetTheme
  onThemeChange: (theme: PresetTheme) => void
  onClose: () => void
  onSave: (theme: PresetTheme) => Promise<void>
}

export default function ThemeDrawer({
  open,
  currentTheme,
  onThemeChange,
  onClose,
  onSave
}: ThemeDrawerProps) {
  const [saving, setSaving] = React.useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(currentTheme)
      message.success('✅ 主题配置已保存到 01-foundation/theme.ts')
      onClose()
    } catch (error) {
      message.error('保存失败，请重试')
      console.error('Save theme error:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer
      title="🎨 主题设置"
      placement="right"
      width={400}
      open={open}
      onClose={onClose}
      footer={
        <Button
          type="primary"
          block
          size="large"
          loading={saving}
          onClick={handleSave}
        >
          保存配置
        </Button>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 预置主题选择 */}
        <PresetSelector
          currentTheme={currentTheme}
          onSelect={onThemeChange}
        />

        <Divider />

        {/* 自定义参数编辑 */}
        <CustomEditor
          theme={currentTheme}
          onChange={onThemeChange}
        />
      </Space>
    </Drawer>
  )
}
