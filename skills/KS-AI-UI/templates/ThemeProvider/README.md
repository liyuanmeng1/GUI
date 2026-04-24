# ThemeProvider

KS-AI-UI 内嵌式主题编辑器组件。

## 功能特性

- 🎨 **预置主题切换** — 6 种预设主题一键切换
- ✨ **实时预览** — 所有修改立即生效，无需刷新
- 🎛️ **关键参数调节** — 主色调/圆角/背景模式/字号
- 💾 **一键保存** — 保存到 `01-foundation/theme.ts`
- 📱 **右下角浮动按钮** — 非侵入式入口

## 使用方式

### 1. 包裹应用根组件

```tsx
import { ThemeProvider } from '@/components/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  )
}
```

### 2. 自定义默认主题

```tsx
import { ThemeProvider, PRESET_THEMES } from '@/components/ThemeProvider'

<ThemeProvider defaultTheme={PRESET_THEMES['暗夜模式']}>
  <YourApp />
</ThemeProvider>
```

### 3. 自定义保存逻辑

```tsx
<ThemeProvider
  onSave={async (theme) => {
    // 自定义保存逻辑
    await saveThemeToBackend(theme)
  }}
>
  <YourApp />
</ThemeProvider>
```

## 文件结构

```
ThemeProvider/
├── index.tsx              # 主组件（ConfigProvider + FloatButton + ThemeDrawer）
├── ThemeDrawer.tsx        # 抽屉容器
├── PresetSelector.tsx     # 预置主题选择器
├── CustomEditor.tsx       # 自定义参数编辑器
├── presets.ts             # 6 种预置主题配置
├── deriveTheme.ts         # 主题推导算法
└── README.md              # 说明文档
```

## 预置主题

1. **极简留白** — 黑白配色，方正圆角，极简克制
2. **专业蓝** — 标准企业蓝，适中圆角，稳重专业
3. **自然绿** — 清新绿色，圆润风格，亲和力强
4. **暗夜模式** — 深色背景，护眼舒适
5. **复古文艺** — 暖棕色调，衬线字体，人文质感
6. **科技感** — 高饱和紫色，未来科技风

## 关键参数

用户只需调整 4 个关键参数，其他自动推导：

- `colorPrimary` — 主色调（必填）
- `borderRadiusPreset` — 圆角风格（方正/适中/圆润）
- `backgroundMode` — 背景模式（明亮/暗色）
- `fontSize` — 字号大小（12px/14px/16px）

## 自动推导规则

从关键参数自动推导完整 Design Token：

- `colorLink` / `colorInfo` ← 从 `colorPrimary` 推导
- `colorSuccess` / `colorWarning` / `colorError` ← 固定语义色
- `colorBgBase` / `colorTextBase` ← 从 `backgroundMode` 推导
- `borderRadius` ← 从 `borderRadiusPreset` 推导（2px/6px/12px）

## 注意事项

- 此组件会自动应用到所有嵌套的 Ant Design 组件
- 修改实时生效，无需刷新页面
- 保存后会更新 `01-foundation/theme.ts` 文件
- 支持暗色模式自动应用 Ant Design 暗色算法
