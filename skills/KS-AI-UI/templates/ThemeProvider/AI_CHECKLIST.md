# ThemeProvider 自动集成执行清单

**此文件供 AI 在生成 UI 页面时参考，确保正确集成 ThemeProvider。**

---

## ✅ 执行检查清单

### 在 Step 4 生成代码时执行

- [ ] **1. 检测集成状态**
  ```typescript
  检查文件是否存在：src/components/ThemeProvider/index.tsx
  ```

- [ ] **2. 首次集成时复制组件**
  ```bash
  如果不存在，执行：
  cp -r templates/ThemeProvider/ src/components/ThemeProvider/
  ```

- [ ] **3. 注入保存逻辑**（首次集成时）
  ```typescript
  修改 src/components/ThemeProvider/saveTheme.ts
  替换模拟保存为实际 write_to_file 调用
  ```

- [ ] **4. 在生成的页面中包裹 ThemeProvider**
  ```tsx
  import { ThemeProvider } from '@/components/ThemeProvider'
  
  export default function PageName() {
    return (
      <ThemeProvider>
        {/* 页面内容 */}
      </ThemeProvider>
    )
  }
  ```

- [ ] **5. 输出交付提示**
  - 首次集成：输出完整的功能说明
  - 后续集成：简单提示已集成

---

## 🔍 关键代码片段

### saveTheme.ts 注入示例

**原始代码**（模拟保存）：
```typescript
export async function saveThemeConfig(theme: PresetTheme): Promise<void> {
  const code = generateThemeCode(theme)
  
  // 在实际项目中，AI 会在这里注入 write_to_file 工具调用
  console.log('生成的主题配置代码：\n', code)
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('✅ 主题配置已保存')
      resolve()
    }, 500)
  })
}
```

**注入后代码**（实际保存）：
```typescript
export async function saveThemeConfig(theme: PresetTheme): Promise<void> {
  const code = generateThemeCode(theme)
  
  // AI 注入的实际保存逻辑
  await writeToFile({
    path: '01-foundation/theme.ts',
    content: code
  })
  
  console.log('✅ 主题配置已保存到 01-foundation/theme.ts')
}
```

### 页面包裹示例

**React + TypeScript**：
```tsx
import React from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Button, Table, Card } from 'antd'

export default function UserListPage() {
  return (
    <ThemeProvider>
      <div className="page-container">
        {/* 页面内容 */}
      </div>
    </ThemeProvider>
  )
}
```

**Vue 3 + TypeScript**：
```vue
<template>
  <ThemeProvider>
    <div class="page-container">
      <!-- 页面内容 -->
    </div>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from '@/components/ThemeProvider/index.vue'
</script>
```

---

## 📝 交付提示模板

### 首次集成提示

```markdown
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

### 后续集成提示

```markdown
✅ 代码已生成

文件清单：
  ✅ src/pages/ProductListPage.tsx

💡 页面已自动集成主题编辑器，点击右下角 🎨 按钮可切换主题
```

---

## ⚠️ 常见错误与解决

### 错误 1: theme is not defined

**现象**：页面白屏，控制台报错

**原因**：`presets.ts` 未导入 `theme`

**解决**：
```typescript
// presets.ts 第 6-7 行必须包含
import type { ThemeConfig } from 'antd'
import { theme } from 'antd'  // ← 必须导入
```

### 错误 2: 保存后 theme.ts 未更新

**现象**：点击保存显示成功，但文件未变化

**原因**：未注入实际的 write_to_file 调用

**解决**：检查 `saveTheme.ts` 是否包含实际的文件写入逻辑

### 错误 3: 路径别名 @ 无法解析

**现象**：`Cannot find module '@/components/ThemeProvider'`

**原因**：项目未配置路径别名

**解决**：
```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

---

## 🧪 集成验证

集成完成后，执行以下验证步骤：

1. 访问生成的页面
2. 确认右下角有 🎨 浮动按钮
3. 点击打开主题编辑抽屉
4. 点击"自然绿"主题，页面立即变绿色
5. 修改主色调为橙色，按钮立即变橙色
6. 切换暗色模式，背景变黑，文字变白
7. 点击"保存配置"，显示成功提示
8. 检查 `01-foundation/theme.ts` 是否已更新

全部通过 = 集成成功 ✅

---

## 📚 相关文档

- [SKILL.md - Step 4 代码生成规范](../../SKILL.md#step-4生成代码)
- [INTEGRATION_GUIDE.md - 完整集成指南](./INTEGRATION_GUIDE.md)
- [README.md - 组件使用文档](./README.md)
- [TEST_GUIDE.md - 功能测试指南](./TEST_GUIDE.md)
