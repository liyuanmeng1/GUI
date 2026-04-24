# 第二层：模板层（02-templates）

> ⚠️ 此目录为**待配置状态**。
>
> 请先运行开箱向导：跟 AI 说「我要配置 aiui_v1 skill」。

---

## 此目录应包含的子目录及文件

每个页面模板一个子目录，每个子目录包含以下文件：

```
02-templates/
  AppLayout/          ← 全局框架（所有页面必须接入，必须配置）
    AppLayout.{vue|tsx}
    AppLayout.module.css

  ListPage/           ← 列表页模板（表格 + 搜索 + 分页）
    ListPage.{vue|tsx}
    ListPage.module.css

  DetailPage/         ← 详情页模板（面包屑 + 状态 + Tabs）
    DetailPage.{vue|tsx}
    DetailPage.module.css

  FormPage/           ← 表单页模板（新建/编辑）
    FormPage.{vue|tsx}
    FormPage.module.css

  DashboardPage/      ← 看板页模板（统计卡片 + 图表）（可选）
    DashboardPage.{vue|tsx}
    DashboardPage.module.css
```

---

## 模板保护规则（配置完成后生效）

配置完成后，此目录下的所有文件为**只读模板**：

- ❌ 不得在此目录直接开发业务代码
- ✅ 开发业务页时，将模板**完整复制**到 `src/pages/{PageName}/` 后再修改
- ✅ 只有用户明确说「更新模板」时，才允许修改此目录内的文件

---

## 如何填写

1. 运行开箱向导（推荐）：AI 引导你逐个填写，自动写入文件
2. 直接发代码：把现有项目中的页面代码发给 AI，AI 整理规范化后写入
3. 手动创建：按上方目录结构手动创建文件

---

> 📌 完成配置后，此 README.md 可删除。
