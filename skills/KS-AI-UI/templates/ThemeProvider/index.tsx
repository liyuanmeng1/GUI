/**
 * ThemeProvider 主组件
 * 提供主题配置上下文 + 右下角浮动按钮 + 主题编辑抽屉
 */

import React, { useState } from 'react'
import { ConfigProvider, FloatButton } from 'antd'
import { BgColorsOutlined } from '@ant-design/icons'
import ThemeDrawer from './ThemeDrawer'
import { PRESET_THEMES, type PresetTheme } from './presets'
import { saveThemeConfig } from './saveTheme'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: PresetTheme
  onSave?: (theme: PresetTheme) => Promise<void>
}

export function ThemeProvider({
  children,
  defaultTheme = PRESET_THEMES['专业蓝'],
  onSave
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<PresetTheme>(defaultTheme)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleSave = async (newTheme: PresetTheme) => {
    if (onSave) {
      await onSave(newTheme)
    } else {
      // 如果没有提供 onSave，使用默认的保存逻辑
      await saveThemeConfig(newTheme)
    }
  }

  return (
    <>
      <ConfigProvider theme={theme}>
        {children}
      </ConfigProvider>

      {/* 右下角浮动按钮 */}
      <FloatButton
        icon={<BgColorsOutlined />}
        tooltip="主题设置"
        onClick={() => setDrawerOpen(true)}
        style={{ right: 24, bottom: 24 }}
      />

      {/* 主题编辑抽屉 */}
      <ThemeDrawer
        open={drawerOpen}
        currentTheme={theme}
        onThemeChange={setTheme}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}

export { PRESET_THEMES } from './presets'
export { deriveTheme } from './deriveTheme'
export { saveThemeConfig } from './saveTheme'
export type { PresetTheme, KeyTokens } from './presets'
