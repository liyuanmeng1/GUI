#!/bin/bash

# KS-AI-UI Skill 重置脚本
# 用途：重置到初始空状态，清除所有开箱配置

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  KS-AI-UI Skill 重置工具"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查是否在 KS-AI-UI 目录
if [ ! -f "SKILL.md" ]; then
    echo "❌ 错误：请在 KS-AI-UI 目录下运行此脚本"
    echo "   cd ~/.codex/skills/KS-AI-UI"
    exit 1
fi

# 确认重置
echo "⚠️  此操作将清除以下内容："
echo ""
echo "  📁 01-foundation/"
echo "     └─ dependencies.md  → 清空内容"
echo ""
echo "  📁 02-templates/"
echo "     └─ AppLayout/       → 清空所有 .vue/.tsx/.css 文件"
echo "     └─ ListPage/        → 清空所有 .vue/.tsx/.css 文件"
echo "     └─ FormPage/        → 清空所有 .vue/.tsx/.css 文件"
echo "     └─ DetailPage/      → 清空所有 .vue/.tsx/.css 文件"
echo "     └─ DashboardPage/   → 清空所有 .vue/.tsx/.css 文件"
echo ""
echo "  📁 03-design-db/"
echo "     └─ design-principles.md → 清空内容"
echo "     └─ typography.md       → 清空内容"
echo "     └─ ui-patterns.md       → 清空内容"
echo "     └─ copywriting.md       → 清空内容"
echo ""
echo "  如果你的项目中有以下文件，也需要手动删除："
echo "     └─ src/components/ThemeProvider/  → 手动删除"
echo "     └─ 01-foundation/theme.ts         → 手动删除"
echo ""
read -p "确认重置？输入 yes 继续: " confirm

if [ "$confirm" != "yes" ]; then
    echo ""
    echo "❌ 已取消重置"
    exit 0
fi

echo ""
echo "🔄 开始重置..."
echo ""

# 重置 01-foundation/dependencies.md
echo "  📝 清空 01-foundation/dependencies.md"
cat > 01-foundation/dependencies.md << 'EOF'
# 依赖配置

> 此文件由 AI 在 Setup A 完成时自动填充

## 框架信息

（待填充）

## 组件库信息

（待填充）

## 安装方式

（待填充）

## 引入方式

（待填充）
EOF

# 重置 02-templates/ 下的所有文件
echo "  📝 清空 02-templates/ 下的所有文件"

# AppLayout
for file in 02-templates/AppLayout/*; do
    if [ -f "$file" ]; then
        echo "" > "$file"
        echo "     ✅ 清空 $file"
    fi
done

# ListPage
for file in 02-templates/ListPage/*; do
    if [ -f "$file" ]; then
        echo "" > "$file"
        echo "     ✅ 清空 $file"
    fi
done

# FormPage
for file in 02-templates/FormPage/*; do
    if [ -f "$file" ]; then
        echo "" > "$file"
        echo "     ✅ 清空 $file"
    fi
done

# DetailPage
for file in 02-templates/DetailPage/*; do
    if [ -f "$file" ]; then
        echo "" > "$file"
        echo "     ✅ 清空 $file"
    fi
done

# DashboardPage
for file in 02-templates/DashboardPage/*; do
    if [ -f "$file" ]; then
        echo "" > "$file"
        echo "     ✅ 清空 $file"
    fi
done

# 重置 03-design-db/ 下的所有文件
echo "  📝 清空 03-design-db/ 下的所有文件"

# design-principles.md
cat > 03-design-db/design-principles.md << 'EOF'
# 设计原则

> 此文件由 AI 在 Setup C 完成时自动填充

（待填充）
EOF
echo "     ✅ 清空 03-design-db/design-principles.md"

# typography.md
cat > 03-design-db/typography.md << 'EOF'
# 排版规范

> 此文件由 AI 在 Setup C 完成时自动填充

（待填充）
EOF
echo "     ✅ 清空 03-design-db/typography.md"

# ui-patterns.md
cat > 03-design-db/ui-patterns.md << 'EOF'
# UI 模式

> 此文件由 AI 在 Setup C 完成时自动填充

（待填充）
EOF
echo "     ✅ 清空 03-design-db/ui-patterns.md"

# copywriting.md
cat > 03-design-db/copywriting.md << 'EOF'
# 文案规范

> 此文件由 AI 在 Setup C 完成时自动填充

（待填充）
EOF
echo "     ✅ 清空 03-design-db/copywriting.md"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Skill 层级重置完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  注意：如果你的项目中已经生成了以下文件，需要手动删除："
echo ""
echo "  项目目录："
echo "    └─ src/components/ThemeProvider/  ← 主题编辑器组件（手动删除）"
echo "    └─ 01-foundation/theme.ts         ← 主题配置文件（手动删除）"
echo ""
echo "删除命令示例："
echo ""
echo "  cd /path/to/your/project"
echo "  rm -rf src/components/ThemeProvider/"
echo "  rm -f 01-foundation/theme.ts"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ 重置完成！现在可以重新开始开箱流程："
echo ""
echo "  对 AI 说：生成一个用户列表页"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
