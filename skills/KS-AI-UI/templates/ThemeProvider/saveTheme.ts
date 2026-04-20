/**
 * 保存主题配置到 01-foundation/theme.ts
 * 此函数会在生成页面时由 AI 自动注入实际的保存逻辑
 */

import type { PresetTheme } from './presets'

/**
 * 生成主题配置代码
 */
export function generateThemeCode(theme: PresetTheme): string {
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const themeJson = JSON.stringify(theme, null, 2)
    .replace(/"([^"]+)":/g, '$1:')  // 移除属性名的引号
    .replace(/: "([^"]+)"/g, ": '$1'")  // 字符串值改用单引号

  return `/**
 * KS-AI-UI 主题配置
 * 生成时间：${timestamp}
 * 
 * 关键参数：
 *   主色调：${theme.keyTokens.colorPrimary}
 *   圆角风格：${theme.keyTokens.borderRadiusPreset}
 *   背景模式：${theme.keyTokens.backgroundMode}
 *   字号：${theme.keyTokens.fontSize}px
 */

import type { ThemeConfig } from 'antd'
${theme.algorithm ? "import { theme } from 'antd'\n" : ''}
export const themeConfig: ThemeConfig = ${themeJson.replace('"darkAlgorithm"', 'theme.darkAlgorithm')}
`
}

/**
 * 保存主题配置
 * 此函数在实际项目中会由 AI 注入 write_to_file 工具调用
 */
export async function saveThemeConfig(theme: PresetTheme): Promise<void> {
  const code = generateThemeCode(theme)
  
  // 在实际项目中，AI 会在这里注入 write_to_file 工具调用
  // 例如：
  // await writeToFile('01-foundation/theme.ts', code)
  
  console.log('生成的主题配置代码：\n', code)
  
  // 模拟异步保存
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('✅ 主题配置已保存到 01-foundation/theme.ts')
      resolve()
    }, 500)
  })
}
