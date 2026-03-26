#!/bin/bash

################################################################################
# TEAM 任务管理技能 - 首次配置向导
# 
# 功能：帮助用户完成首次配置
# 使用：bash scripts/setup.sh
################################################################################

set -e

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印分隔线
print_separator() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 打印标题
print_title() {
    echo ""
    print_separator
    echo -e "${CYAN}  $1${NC}"
    print_separator
    echo ""
}

# 打印成功消息
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# 打印错误消息
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 打印警告消息
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 打印信息消息
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# 欢迎页面
show_welcome() {
    clear
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                                                        ║${NC}"
    echo -e "${CYAN}║          🎉 欢迎使用 TEAM 任务管理技能 🎉              ║${NC}"
    echo -e "${CYAN}║                                                        ║${NC}"
    echo -e "${CYAN}║     快手内部项目管理系统 API 自动化任务创建工具         ║${NC}"
    echo -e "${CYAN}║                                                        ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "这是您第一次使用本技能，让我们一起完成初始配置吧！"
    echo ""
    echo -e "${YELLOW}配置过程大约需要 3-5 分钟${NC}"
    echo ""
    read -p "按 Enter 键开始配置..."
}

# 步骤1：获取用户基本信息
step1_user_info() {
    print_title "步骤 1/4: 用户基本信息"
    
    echo "请提供您的基本信息："
    echo ""
    
    # 快手邮箱
    while true; do
        read -p "请输入您的快手邮箱（如 wangyihan@kuaishou.com）: " EMAIL
        if [[ "$EMAIL" =~ ^[a-zA-Z0-9._%+-]+@kuaishou\.com$ ]]; then
            USERNAME="${EMAIL%@kuaishou.com}"
            print_success "邮箱验证通过：$EMAIL"
            break
        else
            print_error "邮箱格式错误，请输入正确的快手邮箱"
        fi
    done
    
    # 中文名
    read -p "请输入您的中文名（如 王一寒）: " CHINESE_NAME
    while [ -z "$CHINESE_NAME" ]; do
        print_error "中文名不能为空"
        read -p "请输入您的中文名（如 王一寒）: " CHINESE_NAME
    done
    print_success "中文名：$CHINESE_NAME"
    
    echo ""
}

# 步骤2：获取 API 凭证
step2_api_credentials() {
    print_title "步骤 2/4: API 认证配置"
    
    echo "请提供 TEAM OpenAPI 凭证（用于访问 TEAM 系统）"
    echo ""
    print_info "如果您还没有获取凭证，请访问："
    echo -e "${CYAN}https://docs.corp.kuaishou.com/d/home/fcACUPcoqNTCz9vZj284YOCHk${NC}"
    echo ""
    
    # APP Key
    read -p "请输入 TEAM_APP_KEY: " APP_KEY
    while [ -z "$APP_KEY" ]; do
        print_error "APP_KEY 不能为空"
        read -p "请输入 TEAM_APP_KEY: " APP_KEY
    done
    print_success "APP_KEY 已设置"
    
    # Secret Key
    read -p "请输入 TEAM_SECRET_KEY: " SECRET_KEY
    while [ -z "$SECRET_KEY" ]; do
        print_error "SECRET_KEY 不能为空"
        read -p "请输入 TEAM_SECRET_KEY: " SECRET_KEY
    done
    print_success "SECRET_KEY 已设置"
    
    echo ""
}

# 步骤3：配置项目信息
step3_project_config() {
    print_title "步骤 3/4: 项目配置"
    
    echo "请提供您常用的项目配置信息："
    echo ""
    
    # 项目ID
    read -p "请输入默认项目ID（如 P98273，留空使用 P98273）: " PROJECT_ID
    PROJECT_ID="${PROJECT_ID:-P98273}"
    print_success "项目ID：$PROJECT_ID"
    
    # 任务分类ID
    read -p "请输入默认任务分类ID（如 287676，留空使用 287676）: " TASK_CLASS_ID
    TASK_CLASS_ID="${TASK_CLASS_ID:-287676}"
    print_success "任务分类ID：$TASK_CLASS_ID"
    
    # 任务组ID
    read -p "请输入默认任务组ID（如 S248305，留空使用 S248305）: " SECTION_ID
    SECTION_ID="${SECTION_ID:-S248305}"
    print_success "任务组ID：$SECTION_ID"
    
    # 默认优先级
    echo ""
    echo "优先级选项："
    echo "  63 = 最高优"
    echo "  64 = 高优"
    echo "  65 = 中等（默认）"
    echo "  66 = 较低"
    echo "  67 = 极低"
    read -p "请输入默认优先级（留空使用 65）: " DEFAULT_PRIORITY
    DEFAULT_PRIORITY="${DEFAULT_PRIORITY:-65}"
    print_success "默认优先级：$DEFAULT_PRIORITY"
    
    # 默认状态
    read -p "请输入默认状态ID（如 3215447，留空使用 3215447）: " DEFAULT_STATUS
    DEFAULT_STATUS="${DEFAULT_STATUS:-3215447}"
    print_success "默认状态：$DEFAULT_STATUS"
    
    echo ""
}

# 步骤4：同事名单（可选）
step4_team_members() {
    print_title "步骤 4/4: 同事名单（可选）"
    
    echo "您可以添加常用的快手同事信息，方便后续创建任务时使用"
    echo ""
    read -p "是否要添加同事名单？(y/n): " ADD_MEMBERS
    
    if [[ "$ADD_MEMBERS" =~ ^[Yy]$ ]]; then
        TEAM_MEMBERS="["
        FIRST_MEMBER=true
        
        while true; do
            echo ""
            read -p "同事邮箱（如 qujunyan@kuaishou.com，留空结束）: " MEMBER_EMAIL
            
            if [ -z "$MEMBER_EMAIL" ]; then
                break
            fi
            
            if [[ ! "$MEMBER_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@kuaishou\.com$ ]]; then
                print_error "邮箱格式错误，请重新输入"
                continue
            fi
            
            MEMBER_USERNAME="${MEMBER_EMAIL%@kuaishou.com}"
            read -p "同事中文名（如 曲俊燕）: " MEMBER_CN_NAME
            
            if [ -z "$MEMBER_CN_NAME" ]; then
                print_error "中文名不能为空，请重新输入"
                continue
            fi
            
            read -p "同事角色（如 UI设计师、开发工程师、产品经理）: " MEMBER_ROLE
            MEMBER_ROLE="${MEMBER_ROLE:-开发工程师}"
            
            if [ "$FIRST_MEMBER" = false ]; then
                TEAM_MEMBERS+=","
            fi
            FIRST_MEMBER=false
            
            TEAM_MEMBERS+=$(cat <<EOF

  {
    "username": "$MEMBER_USERNAME",
    "email": "$MEMBER_EMAIL",
    "chineseName": "$MEMBER_CN_NAME",
    "role": "$MEMBER_ROLE"
  }
EOF
)
            print_success "已添加：$MEMBER_CN_NAME ($MEMBER_USERNAME)"
        done
        
        TEAM_MEMBERS+=$'\n]'
    else
        TEAM_MEMBERS="[]"
        print_info "跳过添加同事名单"
    fi
    
    echo ""
}

# 保存配置
save_configuration() {
    print_title "保存配置"
    
    # 创建 .env 文件
    cat > "${SKILL_DIR}/.env" <<EOF
# TEAM OpenAPI 认证配置
TEAM_APP_KEY="${APP_KEY}"
TEAM_SECRET_KEY="${SECRET_KEY}"

# TEAM 默认配置
TEAM_PROJECT_ID="${PROJECT_ID}"
TEAM_TASK_CLASS_ID="${TASK_CLASS_ID}"
TEAM_SECTION_ID="${SECTION_ID}"
TEAM_OPERATOR="${USERNAME}"
TEAM_DEFAULT_PRIORITY="${DEFAULT_PRIORITY}"
TEAM_DEFAULT_STATUS="${DEFAULT_STATUS}"

# API 网关地址
TEAM_BASE_URL="https://is-gateway.corp.kuaishou.com"
EOF
    
    chmod 600 "${SKILL_DIR}/.env"
    print_success ".env 文件已创建（权限：600）"
    
    # 创建用户配置文件
    cat > "${SKILL_DIR}/user-config.json" <<EOF
{
  "user": {
    "username": "$USERNAME",
    "email": "$EMAIL",
    "chineseName": "$CHINESE_NAME"
  },
  "project": {
    "projectId": "$PROJECT_ID",
    "taskClassId": "$TASK_CLASS_ID",
    "sectionId": "$SECTION_ID",
    "defaultPriority": $DEFAULT_PRIORITY,
    "defaultStatus": "$DEFAULT_STATUS"
  },
  "setupComplete": true,
  "setupDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
    
    print_success "user-config.json 已创建"
    
    # 创建同事名单文件
    echo "$TEAM_MEMBERS" > "${SKILL_DIR}/team-members.json"
    print_success "team-members.json 已创建"
    
    echo ""
}

# 验证配置
verify_configuration() {
    print_title "验证配置"
    
    print_info "正在测试 API 连接..."
    
    source "${SKILL_DIR}/.env"
    
    TOKEN_RESPONSE=$(curl -s -X POST "https://is-gateway.corp.kuaishou.com/token/get" \
        -H "Content-Type: application/json" \
        -d "{
            \"appKey\": \"${TEAM_APP_KEY}\",
            \"secretKey\": \"${TEAM_SECRET_KEY}\",
            \"grantType\": \"client_credentials\"
        }")
    
    ACCESS_TOKEN=$(echo "${TOKEN_RESPONSE}" | python3 -c "import sys, json; print(json.load(sys.stdin).get('result', {}).get('accessToken', ''))" 2>/dev/null)
    
    if [ -z "${ACCESS_TOKEN}" ]; then
        print_error "API 认证失败，请检查 APP_KEY 和 SECRET_KEY"
        echo ""
        echo "响应内容："
        echo "${TOKEN_RESPONSE}" | python3 -m json.tool 2>/dev/null || echo "${TOKEN_RESPONSE}"
        echo ""
        print_warning "配置已保存，但 API 认证未通过"
        print_info "请检查凭证是否正确：${SKILL_DIR}/.env"
        return 1
    else
        print_success "API 认证成功！"
        print_info "Token: ${ACCESS_TOKEN:0:20}..."
    fi
    
    echo ""
}

# 完成页面
show_completion() {
    print_title "🎉 配置完成！"
    
    echo -e "恭喜！TEAM 任务管理技能已配置成功。"
    echo ""
    echo -e "${GREEN}快速开始：${NC}"
    echo ""
    echo "  1. 使用脚本创建任务："
    echo -e "     ${CYAN}bash scripts/create_task.sh \"任务标题\" \"任务描述\"${NC}"
    echo ""
    echo "  2. 查看任务分类字段："
    echo -e "     ${CYAN}bash scripts/get_fields.sh 287676 $USERNAME${NC}"
    echo ""
    echo "  3. 查看配置文件："
    echo -e "     ${CYAN}cat ${SKILL_DIR}/user-config.json${NC}"
    echo ""
    echo "  4. 查看使用文档："
    echo -e "     ${CYAN}cat ${SKILL_DIR}/SKILL.md${NC}"
    echo ""
    print_separator
    echo ""
    echo -e "${YELLOW}重要提示：${NC}"
    echo "  - API 凭证已保存在 ${SKILL_DIR}/.env"
    echo "  - 请勿将 .env 文件提交到 Git"
    echo "  - 如需修改配置，可以重新运行本脚本"
    echo ""
    print_info "技能文档：https://docs.corp.kuaishou.com/d/home/fcACUPcoqNTCz9vZj284YOCHk"
    echo ""
}

# 主流程
main() {
    # 检查是否已配置
    if [ -f "${SKILL_DIR}/.env" ] && [ -f "${SKILL_DIR}/user-config.json" ]; then
        echo ""
        print_warning "检测到已存在配置文件"
        echo ""
        read -p "是否要重新配置？(y/n): " RECONFIGURE
        if [[ ! "$RECONFIGURE" =~ ^[Yy]$ ]]; then
            print_info "保持现有配置，退出"
            exit 0
        fi
        echo ""
    fi
    
    # 显示欢迎页面
    show_welcome
    
    # 执行配置步骤
    step1_user_info
    step2_api_credentials
    step3_project_config
    step4_team_members
    
    # 保存配置
    save_configuration
    
    # 验证配置
    verify_configuration
    
    # 显示完成页面
    show_completion
}

# 运行主流程
main
