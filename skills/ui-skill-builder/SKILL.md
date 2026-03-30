---
name: ui-skill-builder
description: 一步一步引导用户为自己的业务线搭建专属的 ui-skill（企业级 Ant Design 5 UI 生成工具）。当用户说"搭建 ui skill"、"帮我配置 ui skill"、"我想创建自己的 UI 生成技能"、"初始化 ui-skill"、"setup ui skill"、"build ui skill" 时使用此技能。引导用户完成：全局框架布局决策、页面模板定制、设计数据库配置（颜色/字体/文案/原则）、主题 Token 配置等全部流程。
version: 3.0.0
---

# UI Skill Builder

## 终极目标

引导用户逐步提供业务内容，最终在 `~/.codex/skills/ui-skill/` 创建一个**全新的、完整的 ui-skill**，包含：
- `01-foundation/`：基础层（theme.json + dependencies.md）
- `02-templates/`：模板层（AppLayout + 各类页面模板，每个含 index.tsx + index.module.css）
- `03-design-db/`：设计数据库（color.md + typography.md + copywriting.md + design-principles.md）
- `SKILL.md`：最终根据所有收集内容生成的完整主文件

**所有内容来自用户提供，AI 负责整理和规范化后写入文件，不自行假设业务内容。**

---

## 核心规则

1. **内容来源**：所有业务信息（颜色、菜单、组件代码）必须由用户提供，AI 只做整理
2. **一次一件事**：完成当前项后，立刻明确告诉用户「下一步是什么」，引导继续
3. **立刻落盘**：每个模块用户确认后立即用 write_to_file 写入文件
4. **随时打勾**：每完成一项立刻更新并展示最新进度
5. **可以跳过**：用户说不需要某个模板，标记 ☑️ 跳过，继续下一个

---

## 启动流程

收到触发指令后，**立刻执行以下命令**创建空骨架：

```bash
mkdir -p "$HOME/.codex/skills/ui-skill/01-foundation"
mkdir -p "$HOME/.codex/skills/ui-skill/02-templates"
mkdir -p "$HOME/.codex/skills/ui-skill/03-design-db"
```

然后用 write_to_file 写入最小骨架 `SKILL.md`：

```markdown
---
name: ui-skill
description: （待填写）
version: 1.0.0
---

# UI 生成 Skill

> ⚠️ 此 skill 正在搭建中，请使用 ui-skill-builder 完成配置。
```

骨架创建完成后，向用户展示进度，并**立刻引导第一步**：

```
✅ ui-skill 骨架已创建：~/.codex/skills/ui-skill/

────────────────────────────────────
📋 搭建进度
────────────────────────────────────
【第一层：基础层 01-foundation】
  ☐ theme.json — 主题 Token
  ☐ dependencies.md — 依赖与脚手架配置

【第二层：模板层 02-templates】
  ☐ AppLayout — 全局框架
  ☐ ListPage — 列表页模板
  ☐ DetailPage — 详情页模板
  ☐ FormPage — 表单页模板
  ☐ DashboardPage — 看板页模板

【第三层：设计数据库 03-design-db】
  ☐ color.md — 颜色规范
  ☐ typography.md — 字体规范
  ☐ copywriting.md — 文案规范
  ☐ design-principles.md — 设计原则
────────────────────────────────────

我们从第一层开始 👇

━━━ 第一步：基础组件库 ━━━

你们前端项目用的是哪种基础组件方案？

A）使用 Ant Design（官方 antd）
B）使用自己维护的私有组件库（有 npm 仓库地址）
C）其他（请描述）
```

---

## 第一层：基础层（01-foundation）

### ① 基础组件库（分路判断）

**路线 A：Ant Design 官方**

用户选 A 后，追问：
```
请把你项目的以下内容发给我（有什么发什么）：
1. package.json（我需要看 antd 版本号）
2. 现有的 antd ConfigProvider 配置
3. 已有的主题 token 配置

如果都没有，直接告诉我：你们产品的品牌主色是什么颜色？
```

收到信息后：
- 有现成主题配置 → 整理成 antd v5 theme.json 格式，写入 `01-foundation/theme.json`
- 只有主色 → 基于主色生成完整 token 配置，写入 `01-foundation/theme.json`
- 什么都没有 → 追问主色，再生成

**路线 B：私有组件库**

用户选 B 后，追问：
```
请把组件库的 npm 仓库地址发给我（支持 npm registry URL、git 地址、内网 nexus 地址等）。

另外告诉我：
1. 包名是什么？（如 @myorg/ui）
2. 安装命令是什么？（如果有特殊 registry 或 token 需要配置的话）
```

收到地址后，执行安装命令（用 execute_command）：
```bash
# 根据用户提供的安装命令执行，例如：
npm install @myorg/ui --registry=https://your-registry.com
# 或
pip install / yarn add 等
```

安装完成后，询问主题配置：
```
✅ 组件库安装完成！

这个组件库有主题/token 配置吗？
- 有的话发给我（配置代码或文档）
- 没有的话告诉我主色色值，我帮你整理到 dependencies.md 里
```

根据用户回答，将组件库信息、安装方式、主题配置整理写入 `01-foundation/dependencies.md`（路线 B 不需要 theme.json，跳过该文件）。

**写入完成后，展示进度并引导下一步**：

```
✅ 基础组件层配置完成！

────────────────────────────────────
📋 搭建进度
────────────────────────────────────
【第一层：基础层】
  ✅ theme.json（路线A）或 ✅ dependencies.md（路线B）
  ☐ dependencies.md — 依赖与脚手架配置
...（其余未变）
────────────────────────────────────

━━━ 第二步：dependencies.md ━━━

你的项目用什么构建工具？
- Vite + npm/yarn/pnpm
- Create React App
- Next.js
- 其他（请说明）

另外，你的 index.html 里有没有全局样式设置？有的话发给我看看。
```

### ② dependencies.md

根据用户回答，生成 `01-foundation/dependencies.md`（包含依赖版本声明、ConfigProvider 接入模板、index.html 全局样式）。

**写入完成后，展示进度并引导下一步**：

```
✅ dependencies.md 已写入！

────────────────────────────────────
📋 搭建进度
────────────────────────────────────
【第一层：基础层】
  ✅ theme.json
  ✅ dependencies.md
【第二层：模板层】
  ☐ AppLayout
  ☐ ListPage
  ☐ DetailPage
  ☐ FormPage
  ☐ DashboardPage
...
────────────────────────────────────

第一层完成 🎉 进入第二层！

━━━ 第三步：AppLayout 全局框架 ━━━

请把你项目现有的全局布局代码发给我：
1. 顶部导航栏组件代码
2. 侧边栏/菜单组件代码
3. 对应的 CSS 样式文件

如果还没有，描述一下就行：
- 顶部导航有什么内容？（Logo、一级导航、用户头像等）
- 侧边栏有哪些菜单？（菜单名称和层级）
```

---

## 第二层：模板层（02-templates）

**每个模板的处理流程完全一致**：
1. 用户发来代码 → 整理成规范的 `index.tsx` + `index.module.css`
2. 用户描述需求 → 根据描述生成规范代码
3. 写入 `02-templates/{PageName}/index.tsx` 和 `index.module.css`
4. **打勾 + 展示最新进度 + 立刻引导下一个模板**

### ③ AppLayout

写入完成后引导：

```
✅ AppLayout 已写入！

...（进度）...

━━━ 第四步：ListPage 列表页模板 ━━━

请发给我一个你们产品里典型的列表页代码，或者描述它的结构：
- 页面标题区域有什么？
- 工具栏有哪些操作？（搜索/筛选/新建按钮等）
- 表格有哪些主要列？
- 有分页吗？

如果这类页面还没有，说「暂时没有」，我帮你生成一个通用模板。
不需要这类页面，说「跳过」。
```

### ④ ListPage

写入完成后引导：

```
✅ ListPage 已写入！

...（进度）...

━━━ 第五步：DetailPage 详情页模板 ━━━

请发给我一个典型的详情页代码，或者描述它的结构：
- 有没有面包屑导航？
- 标题区域有没有状态标签（如运行中/已停止）？
- 有没有操作按钮（启动/停止/删除等）？
- 内容区有没有 Tab 切换？

如果不需要，说「跳过」。
```

### ⑤ DetailPage

写入完成后引导：

```
✅ DetailPage 已写入！

...（进度）...

━━━ 第六步：FormPage 表单页模板 ━━━

请发给我一个典型的新建/编辑表单页代码，或者描述它：
- 单列还是双列表单布局？
- 表单分几个区块？每个叫什么？
- 底部有费用预览卡片吗？

如果不需要，说「跳过」。
```

### ⑥ FormPage

写入完成后引导：

```
✅ FormPage 已写入！

...（进度）...

━━━ 第七步：DashboardPage 看板页模板 ━━━

请发给我数据看板页的代码，或者描述它：
- 顶部有几个统计卡片？分别统计什么？
- 有哪些图表？
- 有没有排行榜或列表？

如果不需要，说「跳过」。
```

### ⑦ DashboardPage

写入完成（或跳过）后引导：

```
✅ DashboardPage 已写入！（或 ☑️ 跳过）

...（进度）...

第二层完成 🎉 进入第三层！

━━━ 第八步：color.md 颜色规范 ━━━

请提供你们产品的颜色信息：
- 设计稿截图
- 颜色规范文档
- 或者直接告诉我：主色、辅助色、状态色（成功/警告/错误）的色值

只有主色也没关系，告诉我主色，我帮你整理一套完整的颜色规范。
```

---

## 第三层：设计数据库（03-design-db）

### ⑧ color.md

写入完成后引导：

```
✅ color.md 已写入！

...（进度）...

━━━ 第九步：typography.md 字体规范 ━━━

你们产品对字体有特殊要求吗？
- 有设计规范文档 → 发给我
- 有指定字体/字号 → 直接告诉我
- 没有特殊要求 → 说「默认」，我用通用规范
```

### ⑨ typography.md

写入完成后引导：

```
✅ typography.md 已写入！

...（进度）...

━━━ 第十步：copywriting.md 文案规范 ━━━

两个问题：
1. 你们产品语气风格？（严肃专业 / 友好轻松 / 技术简洁）
2. 产品里常见的状态词有哪些需要统一？
   比如：运行中、已停止、排队中、失败……列出来我帮你整理。
```

### ⑩ copywriting.md

写入完成后引导：

```
✅ copywriting.md 已写入！

...（进度）...

━━━ 第十一步：design-principles.md 设计原则 ━━━

最后一步！

你们团队有没有设计原则或约定？
- 有文档 → 发给我
- 没有文档 → 有哪些「禁止做」的事情？（比如：表格必须固定操作列、不用红色做品牌色等）

没有任何约定的话，说「默认」，我用通用设计原则。
```

### ⑪ design-principles.md

写入完成后，**进入收尾阶段**：

```
✅ design-principles.md 已写入！

第三层完成 🎉 所有内容已收集完毕！

正在生成完整的 SKILL.md……
```

---

## 收尾：生成完整 SKILL.md

根据整个过程收集到的所有内容，重新生成完整的 `~/.codex/skills/ui-skill/SKILL.md`：

- `description`：基于用户业务描述
- 三层架构总览：填入实际路径
- 模板层说明：填入用户实际的菜单 key、页面类型
- 工作流程（Step 1~5）：从原始 ui-skill 规范继承
- 禁止行为清单：从原始 ui-skill 规范继承

写入完成后展示**最终完成状态**：

```
🎉 ui-skill 搭建完成！

────────────────────────────────────
📋 最终进度
────────────────────────────────────
【第一层：基础层】
  ✅ theme.json
  ✅ dependencies.md

【第二层：模板层】
  ✅ AppLayout
  ✅ ListPage
  ✅ DetailPage
  ✅ FormPage
  ☑️ DashboardPage（跳过）

【第三层：设计数据库】
  ✅ color.md
  ✅ typography.md
  ✅ copywriting.md
  ✅ design-principles.md

✅ SKILL.md（主文件）
────────────────────────────────────

📂 安装位置：~/.codex/skills/ui-skill/

⚠️ 生效提示：等待约 30 秒，或重启 VS Code 立即生效。

使用方法：直接跟 AI 说「帮我生成一个列表页」即可开始使用！
```
