# TEAM 任务模板使用指南

## 模板文件

- **task-template.html**: 标准任务描述模板（HTML格式）

## 使用方法

### 方式一：直接复制模板内容

```bash
# 查看模板
cat ~/.codeflicker/skills/team-task-manager/templates/task-template.html

# 复制模板内容，填充后用于创建任务
```

### 方式二：使用脚本创建任务

```bash
cd ~/.codeflicker/skills/team-task-manager

# 基础用法（纯文本描述）
bash scripts/create_task.sh "任务标题" "任务描述" "优先级"

# HTML格式描述
bash scripts/create_task.sh "任务标题" "<h2>需求说明</h2><p>任务内容</p>" "65"
```

### 方式三：使用 API 直接创建

参考 `SKILL.md` 中的示例，使用 curl 命令创建任务。

## 模板字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| **需求文档** | 产品需求文档链接 | K文档链接 |
| **设计稿** | Figma 设计稿链接 | Figma 链接 |
| **UI 交付时间** | UI 设计交付日期和设计师 | UI 3.24 @曲俊燕 |
| **需求说明** | 任务主要内容和子需求列表 | B2-4 多媒体<br>- 支持图片<br>- 支持视频 |
| **团队协作** | 团队成员信息 | 产品经理、设计师、开发工程师 |
| **风险点**（可选） | 风险和负责人 | 需要XXX调研 |

## 注意事项

1. **HTML标签**：仅支持简单标签（h1-h3, p, b, ul/ol/li, a, hr, br），禁止CSS
2. **链接格式**：`<a href='URL' target='_blank'>链接文本</a>`
3. **中文名称**：团队成员使用中文名（如：王一寒、曲俊燕）
4. **邮箱格式**：username@kuaishou.com（在风险点或其他需要时使用）
5. **水印**：脚本会自动添加 "✨ Created by CodeFlicker @wangyihan"

## 字段映射（username 对应关系）

创建任务时需要使用 username（邮箱前缀），不是中文名：

| 中文名 | Username |
|--------|----------|
| 王一寒 | wangyihan |
| 曲俊燕 | qujunyan |
| 崔磊振 | cuileizhen |
| 龙涛 | longtao |

## 示例

### 示例 1：带设计稿的任务

```html
<h2>需求文档</h2>
<p><a href='https://docs.corp.kuaishou.com/k/home/xxx' target='_blank'>产品需求文档</a></p>
<hr>
<h2>设计稿</h2>
<p><a href='https://www.figma.com/design/xxx' target='_blank'>Figma 设计稿</a></p>
<hr>
<h2>UI 交付时间</h2>
<p>UI 3.24 @曲俊燕</p>
<hr>
<h2>需求说明</h2>
<p>B2-4 多媒体</p>
<ul>
<li>支持：图片</li>
<li>支持：视频</li>
</ul>
<hr>
<h2>团队协作</h2>
<ul>
<li><b>产品经理</b>：王一寒</li>
<li><b>UI设计师</b>：曲俊燕</li>
<li><b>开发工程师</b>：崔磊振</li>
</ul>
<hr>
<p><small>✨ Created by CodeFlicker @wangyihan</small></p>
```

### 示例 2：调研类任务（带风险点）

```html
<h2>需求说明</h2>
<p>B4 输入框</p>
<ul>
<li>B4-1 文本输入</li>
<li>B4-3 添加附件（图片）</li>
<li>B4-9 模型切换设置</li>
</ul>
<hr>
<h2>风险点</h2>
<ul>
<li>需要 <b>龙涛</b> (longtao@kuaishou.com) 调研</li>
</ul>
<hr>
<h2>团队协作</h2>
<ul>
<li><b>产品经理</b>：王一寒</li>
<li><b>负责人</b>：龙涛</li>
</ul>
<hr>
<p><small>✨ Created by CodeFlicker @wangyihan</small></p>
```

## 快速创建

保存常用的任务描述到本地文件，需要时直接使用：

```bash
# 保存任务描述到文件
cat > /tmp/task_desc.txt << 'EOF'
<h2>需求说明</h2>
<p>你的任务内容</p>
EOF

# 使用文件内容创建任务
DESCRIPTION=$(cat /tmp/task_desc.txt)
bash scripts/create_task.sh "任务标题" "${DESCRIPTION}" "65"
```

## 相关文档

- [SKILL.md](../SKILL.md) - 完整的技能文档
- [create_task.sh](../scripts/create_task.sh) - 任务创建脚本
- [get_fields.sh](../scripts/get_fields.sh) - 字段查询脚本
