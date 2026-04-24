/**
 * 自定义参数编辑器
 * 允许用户调整主色调、圆角、背景模式、字号
 */

import React from 'react'
import { Space, ColorPicker, Radio, Slider } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { deriveTheme } from './deriveTheme'
import type { KeyTokens, PresetTheme } from './presets'

interface CustomEditorProps {
  theme: PresetTheme
  onChange: (theme: PresetTheme) => void
}

export default function CustomEditor({ theme, onChange }: CustomEditorProps) {
  const updateKeyToken = (key: keyof KeyTokens, value: any) => {
    const newKeyTokens = {
      ...theme.keyTokens,
      [key]: value
    }
    const newTheme = deriveTheme(newKeyTokens)
    onChange(newTheme)
  }

  const handleColorChange = (color: Color) => {
    updateKeyToken('colorPrimary', color.toHexString())
  }

  return (
    <div>
      <h4 style={{ marginBottom: 16 }}>自定义主题</h4>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        
        {/* 主色调 */}
        <div>
          <div style={{ marginBottom: 8, fontSize: 13, color: '#595959' }}>主色调</div>
          <ColorPicker
            value={theme.keyTokens.colorPrimary}
            onChange={handleColorChange}
            showText
            size="large"
            style={{ width: '100%' }}
          />
        </div>

        {/* 圆角风格 */}
        <div>
          <div style={{ marginBottom: 8, fontSize: 13, color: '#595959' }}>圆角风格</div>
          <Radio.Group
            value={theme.keyTokens.borderRadiusPreset}
            onChange={(e) => updateKeyToken('borderRadiusPreset', e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="square">方正 (2px)</Radio>
              <Radio value="moderate">适中 (6px)</Radio>
              <Radio value="rounded">圆润 (12px)</Radio>
            </Space>
          </Radio.Group>
        </div>

        {/* 背景模式 */}
        <div>
          <div style={{ marginBottom: 8, fontSize: 13, color: '#595959' }}>背景模式</div>
          <Radio.Group
            value={theme.keyTokens.backgroundMode}
            onChange={(e) => updateKeyToken('backgroundMode', e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="light">明亮</Radio>
              <Radio value="dark">暗色</Radio>
            </Space>
          </Radio.Group>
        </div>

        {/* 字号大小 */}
        <div>
          <div style={{ marginBottom: 8, fontSize: 13, color: '#595959' }}>
            字号大小 ({theme.keyTokens.fontSize}px)
          </div>
          <Slider
            min={12}
            max={16}
            step={2}
            marks={{
              12: '12px',
              14: '14px',
              16: '16px'
            }}
            value={theme.keyTokens.fontSize}
            onChange={(val) => updateKeyToken('fontSize', val as 12 | 14 | 16)}
          />
        </div>
      </Space>
    </div>
  )
}
