# 第一层：基础层（01-foundation）

> ⚠️ 此目录为**待配置状态**。
>
> 请先运行开箱向导：跟 AI 说「我要配置 aiui_v1 skill」。
> 向导会引导你填写以下内容：

---

## 此目录应包含的文件

### `dependencies.md`（必须）

声明以下信息：
- 前端框架（React / Vue 3 / 其他）
- UI 组件库名称、版本、npm 包名
- 组件库安装方式（如有私有 registry 需特殊配置）
- 全量引入 / 按需引入代码示例
- 国际化配置
- `index.html` 全局样式要求
- Vite / Webpack / Next.js 构建工具配置

**尚未填写的状态**：此文件不存在，开箱向导将自动生成。

---

### `theme.json`（可选）

声明主题 Token 配置（Ant Design v5 格式 / CSS 变量 / 组件库专属格式）：

```json
{
  "token": {
    "colorPrimary": "#165DFF",
    "borderRadius": 4
  },
  "components": {}
}
```

如组件库不需要 Token 注入（纯 CSS 变量体系），此文件可跳过。

---

### `spacing-system.md`（可选）

声明间距系统（8px grid / 自定义间距 Token 等）。

---

## 如何填写

1. 方式一：运行开箱向导，AI 自动生成文件
2. 方式二：直接将现有配置代码发给 AI，AI 整理后写入
3. 方式三：按上方格式手动创建文件

---

> 📌 完成配置后，此 README.md 可删除。
