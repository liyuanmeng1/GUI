/**
 * 预置主题选择器
 * 展示 6 种预设主题卡片，点击切换
 */

import React from 'react'
import { Card, Row, Col } from 'antd'
import { PRESET_THEMES, type PresetTheme } from './presets'

interface PresetSelectorProps {
  currentTheme: PresetTheme
  onSelect: (theme: PresetTheme) => void
}

export default function PresetSelector({ currentTheme, onSelect }: PresetSelectorProps) {
  const isSelected = (themeName: string) => {
    const preset = PRESET_THEMES[themeName]
    return preset.keyTokens.colorPrimary === currentTheme.keyTokens.colorPrimary
  }

  return (
    <div>
      <h4 style={{ marginBottom: 16 }}>预置主题</h4>
      <Row gutter={[12, 12]}>
        {Object.entries(PRESET_THEMES).map(([name, config]) => (
          <Col span={8} key={name}>
            <Card
              size="small"
              hoverable
              onClick={() => onSelect(config)}
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                border: isSelected(name) ? `2px solid ${config.token.colorPrimary}` : undefined
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 40,
                  backgroundColor: config.token.colorPrimary,
                  borderRadius: 4,
                  marginBottom: 8
                }}
              />
              <div style={{ fontSize: 12, fontWeight: isSelected(name) ? 500 : 400 }}>
                {name}
              </div>
              <div style={{ fontSize: 11, color: '#8C8C8C' }}>
                {config.token.colorPrimary}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
