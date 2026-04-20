/**
 * 预置主题配置
 * 6 种预设主题，每个包含关键参数和完整 Design Token
 */

import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

export interface KeyTokens {
  colorPrimary: string
  borderRadiusPreset: 'square' | 'moderate' | 'rounded'
  backgroundMode: 'light' | 'dark'
  fontSize: 12 | 14 | 16
}

export interface PresetTheme extends ThemeConfig {
  keyTokens: KeyTokens
}

export const PRESET_THEMES: Record<string, PresetTheme> = {
  '极简留白': {
    keyTokens: {
      colorPrimary: '#000000',
      borderRadiusPreset: 'square',
      backgroundMode: 'light',
      fontSize: 14
    },
    token: {
      colorPrimary: '#000000',
      colorSuccess: '#52C41A',
      colorWarning: '#FAAD14',
      colorError: '#FF4D4F',
      colorInfo: '#000000',
      colorLink: '#000000',
      colorTextBase: '#000000',
      colorBgBase: '#FFFFFF',
      fontSize: 14,
      borderRadius: 2
    }
  },

  '专业蓝': {
    keyTokens: {
      colorPrimary: '#1677FF',
      borderRadiusPreset: 'moderate',
      backgroundMode: 'light',
      fontSize: 14
    },
    token: {
      colorPrimary: '#1677FF',
      colorSuccess: '#52C41A',
      colorWarning: '#FAAD14',
      colorError: '#FF4D4F',
      colorInfo: '#1677FF',
      colorLink: '#1677FF',
      colorTextBase: '#000000',
      colorBgBase: '#FFFFFF',
      fontSize: 14,
      borderRadius: 6
    }
  },

  '自然绿': {
    keyTokens: {
      colorPrimary: '#00B96B',
      borderRadiusPreset: 'rounded',
      backgroundMode: 'light',
      fontSize: 14
    },
    token: {
      colorPrimary: '#00B96B',
      colorSuccess: '#52C41A',
      colorWarning: '#FAAD14',
      colorError: '#FF4D4F',
      colorInfo: '#00B96B',
      colorLink: '#00B96B',
      colorTextBase: '#000000',
      colorBgBase: '#FFFFFF',
      fontSize: 14,
      borderRadius: 8
    }
  },

  '暗夜模式': {
    keyTokens: {
      colorPrimary: '#4F9EFF',
      borderRadiusPreset: 'moderate',
      backgroundMode: 'dark',
      fontSize: 14
    },
    token: {
      colorPrimary: '#4F9EFF',
      colorSuccess: '#73D13D',
      colorWarning: '#FFC53D',
      colorError: '#FF7875',
      colorInfo: '#4F9EFF',
      colorLink: '#4F9EFF',
      colorTextBase: '#FFFFFF',
      colorBgBase: '#141414',
      fontSize: 14,
      borderRadius: 6
    },
    algorithm: theme.darkAlgorithm
  },

  '复古文艺': {
    keyTokens: {
      colorPrimary: '#8B5E3C',
      borderRadiusPreset: 'square',
      backgroundMode: 'light',
      fontSize: 14
    },
    token: {
      colorPrimary: '#8B5E3C',
      colorSuccess: '#5A7A52',
      colorWarning: '#C4903A',
      colorError: '#A63D2F',
      colorInfo: '#8B5E3C',
      colorLink: '#8B5E3C',
      colorTextBase: '#2C1A0E',
      colorBgBase: '#FAF6EF',
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontSize: 14,
      borderRadius: 4
    }
  },

  '科技感': {
    keyTokens: {
      colorPrimary: '#722ED1',
      borderRadiusPreset: 'rounded',
      backgroundMode: 'light',
      fontSize: 14
    },
    token: {
      colorPrimary: '#722ED1',
      colorSuccess: '#13C2C2',
      colorWarning: '#FAAD14',
      colorError: '#F5222D',
      colorInfo: '#722ED1',
      colorLink: '#722ED1',
      colorTextBase: '#000000',
      colorBgBase: '#FFFFFF',
      fontSize: 14,
      borderRadius: 8
    }
  }
}
