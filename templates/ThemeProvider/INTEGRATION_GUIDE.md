# ThemeProvider 集成指南

本文档说明 AI 如何在生成 UI 页面时自动集成 ThemeProvider 主题编辑器。

---

## 集成时机

当 AI 执行 **Step 4：生成代码** 时，自动集成 ThemeProvider。

---

## 集成步骤

### 步骤 1：检测是否已集成

```typescript
// 检查 src/components/ThemeProvider/ 是否存在
const themeProviderExists = fileExists('src/components/ThemeProvider/index.tsx')
```

### 步骤 2：首次集成 - 复制组件

如果 `themeProviderExists === false`，执行以下操作：

```bash
# 复制完整的 ThemeProvider 组件目录
cp -r templates/ThemeProvider/ src/components/ThemeProvider/
```

复制后的文件结构：
```
src/components/ThemeProvider/
├── index.tsx              # 主组件（导出 ThemeProvider）
├── ThemeDrawer.tsx        # 抽屉容器
├── PresetSelector.tsx     # 预置主题选择器
├── CustomEditor.tsx       # 自定义参数编辑器
├── presets.ts             # 6 种预置主题配置
├── deriveTheme.ts         # 主题推导算法
├── saveTheme.ts           # 保存主题配置工具
└── README.md              # 使用文档
```

### 步骤 3：注入保存逻辑

修改 `src/components/ThemeProvider/saveTheme.ts`，将模拟的保存逻辑替换为实际的 `write_to_file` 调用：

```typescript
// 找到 saveThemeConfig 函数中的注释部分
// 替换为实际的 write_to_file 工具调用

export async function saveThemeConfig(theme: PresetTheme): Promise<void> {
  const code = generateThemeCode(theme)
  
  // AI 注入实际的保存逻辑
  await writeToFile({
    path: '01-foundation/theme.ts',
    content: code
  })
  
  console.log('✅ 主题配置已保存到 01-foundation/theme.ts')
}
```

### 步骤 4：在生成的页面中包裹 ThemeProvider

**React 项目示例**：

```tsx
// 生成的页面：src/pages/UserListPage.tsx
import { ThemeProvider } from '@/components/ThemeProvider'

export default function UserListPage() {
  return (
    <ThemeProvider>
      {/* 页面内容 */}
      <div className="page-container">
        <PageHeader title="用户管理" />
        <Table dataSource={data} columns={columns} />
      </div>
    </ThemeProvider>
  )
}
```

**Vue 3 项目示例**：

```vue
<template>
  <ThemeProvider>
    <!-- 页面内容 -->
    <div class="page-container">
      <PageHeader title="用户管理" />
      <ElTable :data="data" />
    </div>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from '@/components/ThemeProvider/index.vue'
// ... 其他导入
</script>
```

### 步骤 5：输出交付提示

**首次集成时**，在交付报告中包含完整的主题编辑器功能说明：

```
✅ 代码已生成

文件清单：
  ✅ src/pages/UserListPage.tsx
  ✅ src/components/ThemeProvider/  ← 主题编辑器（首次自动注入）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 提示：页面右下角有主题设置按钮（🎨），可随时切换主题风格

功能特性：
  • 6 种预置主题一键切换
    （极简留白/专业蓝/自然绿/暗夜模式/复古文艺/科技感）
  
  • 自定义关键参数
    - 主色调：拖动颜色选择器
    - 圆角风格：方正(2px) / 适中(6px) / 圆润(12px)
    - 背景模式：明亮 / 暗色
    - 字号大小：12px / 14px / 16px
  
  • 实时预览
    所有修改立即生效，无需刷新页面
  
  • 一键保存
    点击"保存配置"持久化到 01-foundation/theme.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**后续生成页面时**，只简单提示：

```
✅ 代码已生成

文件清单：
  ✅ src/pages/ProductListPage.tsx

💡 页面已自动集成主题编辑器，点击右下角 🎨 按钮可切换主题
```

---

## 注意事项

### 1. 框架适配

- **React 项目**：直接使用 `templates/ThemeProvider/` 中的 `.tsx` 文件
- **Vue 3 项目**：需要转换为 Vue 3 组件格式（使用 Composition API）
- **其他框架**：参考 React 实现，适配对应框架的 ConfigProvider

### 2. 路径别名配置

确保项目配置了 `@/` 路径别名，指向 `src/` 目录：

**Vite 项目** (`vite.config.ts`):
```typescript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

**Next.js 项目** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 3. 保存逻辑注入

AI 必须在首次集成时注入实际的 `write_to_file` 调用，否则保存功能只会在控制台输出日志，不会真正写入文件。

### 4. 依赖检查

确保项目已安装以下依赖：
- `antd` >= 5.7.0（支持 ColorPicker 组件）
- `@ant-design/icons`
- `react` >= 18.0.0（或对应框架版本）

---

## 测试验证

集成完成后，访问生成的页面，验证以下功能：

- [ ] 右下角显示 🎨 浮动按钮
- [ ] 点击按钮打开主题编辑抽屉
- [ ] 6 个预置主题卡片全部显示
- [ ] 点击主题卡片，页面立即切换
- [ ] 修改主色调，按钮/链接实时变色
- [ ] 切换暗色模式，背景和文字自动适配
- [ ] 点击"保存配置"，显示成功提示
- [ ] 检查 `01-foundation/theme.ts` 是否已更新

---

## 常见问题

### Q1: 页面白屏，控制台报错 "theme is not defined"

**原因**：`presets.ts` 中使用了 `theme.darkAlgorithm` 但未导入 `theme`

**解决**：确保 `presets.ts` 第 7 行导入了 `theme`：
```typescript
import { theme } from 'antd'
```

### Q2: 保存按钮点击后没有更新 theme.ts

**原因**：AI 未注入实际的 `write_to_file` 调用

**解决**：检查 `src/components/ThemeProvider/saveTheme.ts` 中的 `saveThemeConfig` 函数是否包含实际的文件写入逻辑。

### Q3: 暗色模式切换后样式不正确

**原因**：未应用 `theme.darkAlgorithm`

**解决**：确保 `presets.ts` 中暗夜模式配置包含：
```typescript
{
  token: { /* ... */ },
  algorithm: theme.darkAlgorithm  // ← 必须
}
```

---

## 扩展定制

### 添加新的预置主题

编辑 `src/components/ThemeProvider/presets.ts`：

```typescript
export const PRESET_THEMES: Record<string, PresetTheme> = {
  // 现有主题...
  
  '新主题名称': {
    keyTokens: {
      colorPrimary: '#自定义主色',
      borderRadiusPreset: 'moderate',
      backgroundMode: 'light',
      fontSize: 14
    },
    token: {
      // 完整的 Design Token 配置
    }
  }
}
```

### 调整默认主题

修改 `src/components/ThemeProvider/index.tsx` 中的 `defaultTheme`：

```typescript
export function ThemeProvider({
  defaultTheme = PRESET_THEMES['暗夜模式'],  // 改为其他主题
  // ...
})
```

---

## 参考资源

- [Ant Design Theme Editor](https://ant.design/theme-editor-cn)
- [Ant Design Design Token](https://ant.design/docs/react/customize-theme-cn#theme)
- [ThemeProvider 测试指南](./TEST_GUIDE.md)
- [ThemeProvider 使用文档](./README.md)
