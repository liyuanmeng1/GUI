# ThemeProvider 路径判断指南

## 核心原则

**ThemeProvider 主题编辑器仅在 Setup A（预置主题）路径中使用。**

---

## Setup 路径标记

在 Setup A 完成时，`01-foundation/dependencies.md` 文件头部会写入路径标记：

```markdown
<!-- Setup Path: A -->  ← 预置主题路径
```

或

```markdown
<!-- Setup Path: B -->  ← 自定义组件库路径
```

---

## Step 4 判断逻辑

在 Step 4 生成代码时，**必须**先读取 `01-foundation/dependencies.md` 文件头部的路径标记：

```typescript
// 读取文件头部前 3 行
const firstLines = readFile('01-foundation/dependencies.md', { lines: 3 })

// 判断路径
if (firstLines.includes('<!-- Setup Path: A -->')) {
  // 执行 ThemeProvider 注入流程
  injectThemeProvider()
} else if (firstLines.includes('<!-- Setup Path: B -->')) {
  // 跳过 ThemeProvider，直接生成页面
  generatePageDirectly()
}
```

---

## 两种路径的差异

| 对比项 | Setup A（预置主题） | Setup B（自定义组件库） |
|--------|-------------------|----------------------|
| **路径标记** | `<!-- Setup Path: A -->` | `<!-- Setup Path: B -->` |
| **组件库** | React + Ant Design + Pro Components | 用户自定义组件库 |
| **主题配置** | 使用预置主题 + ThemeProvider | 用户自己的主题配置 |
| **ThemeProvider** | ✅ **必须注入** | ❌ **禁止注入** |
| **页面包裹** | `<ThemeProvider>` | 无（或用户自己的 Provider） |
| **主题编辑器** | 右下角 🎨 浮动按钮 | 无 |
| **Setup B** | 自动跳过 | 必须完成 |

---

## 详细流程

### Setup A 路径（预置主题）

#### Setup A 完成时

1. 生成 `01-foundation/dependencies.md`
2. **文件头部写入**：`<!-- Setup Path: A -->`
3. 生成完整的 Pro Components 模板
4. **自动跳过 Setup B**
5. 进入 Setup C

#### Step 4 生成代码时

1. **读取路径标记**：确认为 `Setup Path: A`
2. **检测 ThemeProvider**：
   ```typescript
   if (!exists('src/components/ThemeProvider/index.tsx')) {
     // 首次生成页面
     copyDirectory('templates/ThemeProvider/', 'src/components/ThemeProvider/')
     injectSaveLogic('src/components/ThemeProvider/saveTheme.ts')
     showFirstTimeIntegrationTips()
   }
   ```
3. **包裹页面**：
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
4. **输出提示**：
   - 首次：完整的主题编辑器功能介绍
   - 后续：简单提示

---

### Setup B 路径（自定义组件库）

#### Setup A 完成时

1. 生成 `01-foundation/dependencies.md`
2. **文件头部写入**：`<!-- Setup Path: B -->`
3. **进入 Setup B**（必须完成）

#### Step 4 生成代码时

1. **读取路径标记**：确认为 `Setup Path: B`
2. **跳过 ThemeProvider**：
   - 不复制 ThemeProvider 组件
   - 不包裹 `<ThemeProvider>`
   - 不输出主题编辑器相关提示
3. **直接生成页面**：
   ```tsx
   // 不使用 ThemeProvider
   export default function PageName() {
     return (
       <div className="page-container">
         {/* 页面内容 */}
       </div>
     )
   }
   ```

---

## 代码示例

### 完整的判断和注入流程

```typescript
// Step 4 生成代码时的判断逻辑

async function generatePage(pageName: string, pageType: string) {
  // 1. 读取路径标记
  const setupPath = await detectSetupPath()
  
  // 2. 生成页面代码
  const pageCode = await generatePageCode(pageName, pageType)
  
  // 3. 根据路径判断是否包裹 ThemeProvider
  if (setupPath === 'A') {
    // Setup A：预置主题路径
    const wrappedCode = wrapWithThemeProvider(pageCode)
    
    // 首次生成时，复制 ThemeProvider 组件
    if (!exists('src/components/ThemeProvider/')) {
      await copyThemeProvider()
      await injectSaveLogic()
      showIntegrationTips('first-time')
    } else {
      showIntegrationTips('subsequent')
    }
    
    return wrappedCode
  } else {
    // Setup B：自定义组件库路径
    // 直接返回页面代码，不包裹 ThemeProvider
    return pageCode
  }
}

// 检测 Setup 路径
async function detectSetupPath(): Promise<'A' | 'B'> {
  const content = await readFile('01-foundation/dependencies.md', { lines: 3 })
  
  if (content.includes('<!-- Setup Path: A -->')) {
    return 'A'
  } else if (content.includes('<!-- Setup Path: B -->')) {
    return 'B'
  } else {
    throw new Error('未找到 Setup 路径标记，请先完成 Setup A')
  }
}

// 包裹 ThemeProvider
function wrapWithThemeProvider(pageCode: string): string {
  return `import { ThemeProvider } from '@/components/ThemeProvider'

${pageCode.replace(
  'export default function',
  `export default function PageNameWithTheme() {
  return (
    <ThemeProvider>
      <PageNameOriginal />
    </ThemeProvider>
  )
}

function PageNameOriginal`
)}`
}
```

---

## 常见问题

### Q1: 如果用户在 Setup B 路径中要求使用 ThemeProvider 怎么办？

**A**: 明确告知用户：

> ThemeProvider 仅适用于 Setup A（预置主题）路径。
> 
> 如果您想使用主题编辑器功能，建议：
> 1. 重新运行 Setup A，选择预置主题
> 2. 或者在您的组件库中自行实现主题切换功能

### Q2: 如果文件头部没有路径标记怎么办？

**A**: 抛出错误并引导用户：

> 未找到 Setup 路径标记，请先完成 Setup A。
> 
> 当前 `01-foundation/dependencies.md` 文件可能不完整。
> 建议重新运行开箱引导流程。

### Q3: 能否在 Setup B 路径中手动注入 ThemeProvider？

**A**: 不建议，原因：

1. Setup B 用户选择了自定义组件库，说明他们有自己的主题体系
2. 强行注入 Ant Design 的 ThemeProvider 会导致样式冲突
3. 如果用户真的需要，可以手动复制 `templates/ThemeProvider/` 并自行适配

---

## 测试验证

### Setup A 路径测试

1. 完成 Setup A（选择预置主题）
2. 验证 `01-foundation/dependencies.md` 头部包含 `<!-- Setup Path: A -->`
3. 生成第一个页面
4. 验证 `src/components/ThemeProvider/` 目录已创建
5. 验证页面代码包含 `<ThemeProvider>` 包裹
6. 打开页面，确认右下角有 🎨 浮动按钮
7. 生成第二个页面
8. 验证页面代码仍包含 `<ThemeProvider>` 包裹

### Setup B 路径测试

1. 完成 Setup A（选择自定义组件库）
2. 验证 `01-foundation/dependencies.md` 头部包含 `<!-- Setup Path: B -->`
3. 完成 Setup B（录入页面模板）
4. 生成第一个页面
5. 验证 **不存在** `src/components/ThemeProvider/` 目录
6. 验证页面代码 **不包含** `<ThemeProvider>` 包裹
7. 验证交付提示中 **不包含** 主题编辑器相关内容

---

## 相关文档

- [SKILL.md - Setup 路径标记](../../SKILL.md#-setup-路径标记用于-step-4-判断)
- [setup-guide.md - Setup A 路径 A](../../00-setup/setup-guide.md#路径-a预置主题)
- [setup-guide.md - Setup A 路径 B](../../00-setup/setup-guide.md#路径-b自定义组件库)
- [AI_CHECKLIST.md - ThemeProvider 集成清单](./AI_CHECKLIST.md)
- [INTEGRATION_GUIDE.md - 完整集成指南](./INTEGRATION_GUIDE.md)
