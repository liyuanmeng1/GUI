# KS-AI-UI ThemeProvider 组件系统

**版本**: 1.0.0  
**最后更新**: 2026-04-20  
**状态**: ✅ 已完成并测试通过

---

## 📦 组件概述

ThemeProvider 是 KS-AI-UI 的内嵌式主题编辑器，提供：
- 🎨 6 种预置主题一键切换
- ✨ 实时主题预览（无需刷新）
- 🎛️ 关键参数自定义（主色调/圆角/背景/字号）
- 💾 一键保存到 `01-foundation/theme.ts`
- 📱 右下角浮动按钮，非侵入式入口

---

## 📂 文件结构

```
templates/ThemeProvider/
├── index.tsx                   # 主组件（导出 ThemeProvider）
├── ThemeDrawer.tsx             # 抽屉容器
├── PresetSelector.tsx          # 预置主题选择器
├── CustomEditor.tsx            # 自定义参数编辑器
├── presets.ts                  # 6 种预置主题配置
├── deriveTheme.ts              # 主题推导算法
├── saveTheme.ts                # 保存主题配置工具
├── Demo.tsx                    # 完整使用示例
├── README.md                   # 组件使用文档
├── INTEGRATION_GUIDE.md        # AI 集成指南（详细）
├── AI_CHECKLIST.md             # AI 执行清单（简明）
└── TEST_GUIDE.md               # 功能测试指南
```

**核心组件** (6 个 .ts/.tsx 文件)：必须全部复制到项目中  
**文档文件** (5 个 .md 文件)：供参考，不复制到项目中

---

## 🚀 快速开始

### 用户视角

1. 打开生成的页面
2. 点击右下角 🎨 浮动按钮
3. 选择预置主题或自定义参数
4. 实时预览效果
5. 点击"保存配置"持久化

### AI 集成视角

在 **Step 4：生成代码** 时自动执行：

```typescript
// 1. 检测是否已集成
if (!exists('src/components/ThemeProvider/index.tsx')) {
  // 2. 复制组件
  copyDirectory('templates/ThemeProvider/', 'src/components/ThemeProvider/')
  
  // 3. 注入保存逻辑
  injectSaveLogic('src/components/ThemeProvider/saveTheme.ts')
  
  // 4. 输出首次集成提示
  showIntegrationTips()
}

// 5. 在生成的页面中包裹 ThemeProvider
wrapPageWithThemeProvider('src/pages/NewPage.tsx')
```

详细步骤参见 [AI_CHECKLIST.md](./AI_CHECKLIST.md)

---

## 🎨 预置主题

| 主题 | 主色调 | 圆角 | 背景 | 适用场景 |
|------|--------|------|------|---------|
| 极简留白 | #000000 | 方正(2px) | 明亮 | 极简克制、黑白风格 |
| 专业蓝 | #1677FF | 适中(6px) | 明亮 | 标准企业后台、专业稳重 |
| 自然绿 | #00B96B | 圆润(12px) | 明亮 | 清新配色、数据/健康类 |
| 暗夜模式 | #4F9EFF | 适中(6px) | 暗色 | 低视觉疲劳、护眼 |
| 复古文艺 | #8B5E3C | 方正(4px) | 明亮 | 暖棕色调、人文质感 |
| 科技感 | #722ED1 | 圆润(8px) | 明亮 | 高饱和紫色、未来科技风 |

---

## 🛠️ 技术架构

### 依赖

- React 18+
- Ant Design 5.7+（支持 ColorPicker）
- @ant-design/icons 5+

### 核心机制

1. **实时响应**：基于 React Context + ConfigProvider
2. **智能推导**：4 个关键参数 → 20+ Design Token
3. **主题持久化**：保存到 `01-foundation/theme.ts`
4. **暗色适配**：自动应用 Ant Design 暗色算法

### 推导规则

用户只需提供 4 个关键参数：

```typescript
interface KeyTokens {
  colorPrimary: string          // 主色调（必填）
  borderRadiusPreset: 'square' | 'moderate' | 'rounded'
  backgroundMode: 'light' | 'dark'
  fontSize: 12 | 14 | 16
}
```

自动推导完整 Design Token：

- `colorLink` / `colorInfo` ← 从 `colorPrimary` 推导
- `colorSuccess` / `colorWarning` / `colorError` ← 固定语义色
- `colorBgBase` / `colorTextBase` ← 从 `backgroundMode` 推导
- `borderRadius` ← 从 `borderRadiusPreset` 推导（2px/6px/12px）

详见 [deriveTheme.ts](./deriveTheme.ts)

---

## ✅ 测试状态

| 测试项 | 状态 | 验证日期 |
|--------|------|---------|
| 右下角浮动按钮 | ✅ 通过 | 2026-04-20 |
| 预置主题切换 | ✅ 通过 | 2026-04-20 |
| 自定义主色调 | ✅ 通过 | 2026-04-20 |
| 圆角风格调整 | ✅ 通过 | 2026-04-20 |
| 背景模式切换 | ✅ 通过 | 2026-04-20 |
| 字号大小调整 | ✅ 通过 | 2026-04-20 |
| 实时预览 | ✅ 通过 | 2026-04-20 |
| 保存功能 | ✅ 通过 | 2026-04-20 |
| 暗色模式适配 | ✅ 通过 | 2026-04-20 |

测试环境：
- React 18.2.0
- Ant Design 5.16.0
- Chrome 124.0

完整测试报告：[TEST_GUIDE.md](./TEST_GUIDE.md)

---

## 📖 文档索引

### 用户文档

- [README.md](./README.md) — 组件使用文档（给最终用户）
- [Demo.tsx](./Demo.tsx) — 完整使用示例

### AI 集成文档

- [AI_CHECKLIST.md](./AI_CHECKLIST.md) — 执行清单（简明版，优先阅读）
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) — 集成指南（详细版）
- [../../SKILL.md](../../SKILL.md) — Step 4 代码生成规范

### 测试文档

- [TEST_GUIDE.md](./TEST_GUIDE.md) — 功能测试指南

---

## 🔄 版本历史

### v1.0.0 (2026-04-20)

**首次发布**

- ✅ 6 种预置主题
- ✅ 自定义关键参数（主色调/圆角/背景/字号）
- ✅ 实时预览
- ✅ 保存到 theme.ts
- ✅ 右下角浮动按钮
- ✅ 暗色模式自动适配
- ✅ 完整文档和测试指南

---

## 🛡️ 已知限制

1. **ColorPicker 版本要求**：需要 antd >= 5.7.0
2. **路径别名依赖**：必须配置 `@/` 指向 `src/`
3. **框架限制**：当前仅支持 React，Vue 版本需要转换
4. **保存逻辑**：需要 AI 注入实际的 write_to_file 调用

---

## 🤝 贡献指南

### 添加新预置主题

编辑 [presets.ts](./presets.ts)，添加新主题配置：

```typescript
export const PRESET_THEMES = {
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

### 扩展自定义参数

1. 在 [presets.ts](./presets.ts) 中扩展 `KeyTokens` 接口
2. 在 [deriveTheme.ts](./deriveTheme.ts) 中添加推导逻辑
3. 在 [CustomEditor.tsx](./CustomEditor.tsx) 中添加编辑控件

---

## 📞 支持

- 问题反馈：提交 Issue
- 功能建议：提交 Feature Request
- 文档问题：提交 Documentation Bug

---

## 📄 许可证

MIT License

---

**快速链接**：
- 🚀 [快速开始 - AI 执行清单](./AI_CHECKLIST.md)
- 📖 [完整集成指南](./INTEGRATION_GUIDE.md)
- 🧪 [功能测试指南](./TEST_GUIDE.md)
- 💻 [使用示例](./Demo.tsx)
