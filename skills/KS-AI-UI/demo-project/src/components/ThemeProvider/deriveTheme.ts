/**
 * 主题推导算法
 * 根据关键参数自动推导完整的 Design Token 配置
 */

import type { ThemeConfig } from 'antd'
import type { KeyTokens, PresetTheme } from './presets'
import { theme } from 'antd'

export function deriveTheme(keyTokens: KeyTokens): PresetTheme {
  const { colorPrimary, borderRadiusPreset, backgroundMode, fontSize } = keyTokens

  // 圆角映射
  const borderRadiusMap = {
    square: 2,
    moderate: 6,
    rounded: 12
  }

  // 背景模式推导
  const isDark = backgroundMode === 'dark'

  const token: ThemeConfig['token'] = {
    // 主色系
    colorPrimary,
    colorLink: colorPrimary,
    colorInfo: colorPrimary,

    // 固定语义色
    colorSuccess: isDark ? '#73D13D' : '#52C41A',
    colorWarning: isDark ? '#FFC53D' : '#FAAD14',
    colorError: isDark ? '#FF7875' : '#FF4D4F',

    // 背景与文本
    colorBgBase: isDark ? '#141414' : '#FFFFFF',
    colorTextBase: isDark ? '#FFFFFF' : '#000000',

    // 尺寸
    fontSize,
    borderRadius: borderRadiusMap[borderRadiusPreset],

    // 字体
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
  }

  const config: PresetTheme = {
    keyTokens,
    token
  }

  // 暗色模式需要应用暗色算法
  if (isDark) {
    config.algorithm = theme.darkAlgorithm
  }

  return config
}
