#!/bin/bash

################################################################################
# TEAM 任务创建脚本
# 
# 功能：在 TEAM 系统中创建任务
# 使用：bash create_task.sh [任务标题] [任务描述] [优先级]
#
# 示例：
#   bash create_task.sh "修复登录Bug" "用户反馈登录失败" "64"
################################################################################

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

# 加载环境变量
if [ -f "${SKILL_DIR}/.env" ]; then
    source "${SKILL_DIR}/.env"
elif [ -f "${HOME}/.codeflicker/skills/team-task-manager/.env" ]; then
    source "${HOME}/.codeflicker/skills/team-task-manager/.env"
fi

# API 配置（从环境变量读取）
APP_KEY="${TEAM_APP_KEY}"
SECRET_KEY="${TEAM_SECRET_KEY}"
BASE_URL="${TEAM_BASE_URL:-https://is-gateway.corp.kuaishou.com}"
TOKEN_URL="${BASE_URL}/token/get"

# 检查必需的环境变量
if [ -z "${APP_KEY}" ] || [ -z "${SECRET_KEY}" ]; then
    echo "错误：未找到 API 凭证"
    echo "请确保以下环境变量已设置："
    echo "  - TEAM_APP_KEY"
    echo "  - TEAM_SECRET_KEY"
    echo ""
    echo "或者创建配置文件："
    echo "  cp ${SKILL_DIR}/.env.example ${SKILL_DIR}/.env"
    echo "  # 然后编辑 .env 文件填入你的凭证"
    exit 1
fi

# 默认配置（优先使用环境变量）
PROJECT_ID="${TEAM_PROJECT_ID:-${PROJECT_ID:-P98273}}"
TASK_CLASS_ID="${TEAM_TASK_CLASS_ID:-${TASK_CLASS_ID:-287676}}"
SECTION_ID="${TEAM_SECTION_ID:-${SECTION_ID:-S248305}}"
OPERATOR="${TEAM_OPERATOR:-${OPERATOR:-wangyihan}}"

# 参数处理
TASK_TITLE="${1:-API测试任务_$(date +%Y%m%d_%H%M%S)}"
TASK_DESCRIPTION_RAW="${2:-这是通过脚本创建的任务}"
PRIORITY="${3:-65}"  # 65=中等, 64=高优, 63=最高优
STATUS="${STATUS:-3215447}"  # 默认状态

# 添加水印到描述末尾
WATERMARK="<hr><p><small>✨ Created by CodeFlicker @wangyihan</small></p>"
TASK_DESCRIPTION="${TASK_DESCRIPTION_RAW}${WATERMARK}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    if ! command -v curl &> /dev/null; then
        log_error "curl 命令未找到，请先安装 curl"
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        log_error "python3 命令未找到，请先安装 python3"
        exit 1
    fi
}

# 获取 accessToken
get_access_token() {
    log_info "获取 accessToken..."
    
    TOKEN_RESPONSE=$(curl -s -X POST "${TOKEN_URL}" \
        -H "Content-Type: application/json" \
        -d "{
            \"appKey\": \"${APP_KEY}\",
            \"secretKey\": \"${SECRET_KEY}\",
            \"grantType\": \"client_credentials\"
        }")
    
    ACCESS_TOKEN=$(echo "${TOKEN_RESPONSE}" | python3 -c "import sys, json; print(json.load(sys.stdin).get('result', {}).get('accessToken', ''))" 2>/dev/null)
    
    if [ -z "${ACCESS_TOKEN}" ]; then
        log_error "获取 accessToken 失败"
        echo "${TOKEN_RESPONSE}" | python3 -m json.tool 2>/dev/null || echo "${TOKEN_RESPONSE}"
        return 1
    fi
    
    log_info "✓ 成功获取 accessToken: ${ACCESS_TOKEN:0:20}..."
    return 0
}

# 创建任务
create_task() {
    log_info "创建任务..."
    log_info "  标题: ${TASK_TITLE}"
    log_info "  描述: ${TASK_DESCRIPTION}"
    log_info "  项目: ${PROJECT_ID}"
    log_info "  分类: ${TASK_CLASS_ID}"
    log_info "  任务组: ${SECTION_ID}"
    log_info "  优先级: ${PRIORITY}"
    echo ""
    
    CREATE_URL="${BASE_URL}/pm/api/no-ba/external/task/create"
    
    TASK_DATA=$(cat <<EOF
{
  "title": "${TASK_TITLE}",
  "description": "${TASK_DESCRIPTION}",
  "projectId": "${PROJECT_ID}",
  "taskClass": "${TASK_CLASS_ID}",
  "sectionId": "${SECTION_ID}",
  "operator": "${OPERATOR}",
  "fields": {
    "assignee": ["${OPERATOR}"],
    "reporter": ["${OPERATOR}"],
    "priority": ["${PRIORITY}"],
    "status": ["${STATUS}"]
  }
}
EOF
)
    
    CREATE_RESPONSE=$(curl -s -X POST "${CREATE_URL}" \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "${TASK_DATA}")
    
    # 解析结果
    CODE=$(echo "${CREATE_RESPONSE}" | python3 -c "import sys, json; print(json.load(sys.stdin).get('code', -1))" 2>/dev/null)
    TASK_ID=$(echo "${CREATE_RESPONSE}" | python3 -c "import sys, json; print(json.load(sys.stdin).get('result', {}).get('taskId', ''))" 2>/dev/null)
    MESSAGE=$(echo "${CREATE_RESPONSE}" | python3 -c "import sys, json; print(json.load(sys.stdin).get('message', '未知错误'))" 2>/dev/null)
    
    if [ "${CODE}" = "0" ] && [ -n "${TASK_ID}" ]; then
        log_info "✓ 任务创建成功！"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "  任务ID: ${TASK_ID}"
        echo "  任务标题: ${TASK_TITLE}"
        echo "  项目ID: ${PROJECT_ID}"
        echo "  分类ID: ${TASK_CLASS_ID}"
        echo "  任务组ID: ${SECTION_ID}"
        echo "  操作人: ${OPERATOR}"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        return 0
    else
        log_error "任务创建失败"
        log_error "错误信息: ${MESSAGE}"
        echo ""
        echo "完整响应:"
        echo "${CREATE_RESPONSE}" | python3 -m json.tool 2>/dev/null || echo "${CREATE_RESPONSE}"
        return 1
    fi
}

# 主函数
main() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  TEAM 任务创建工具"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # 检查依赖
    check_dependencies
    
    # 获取 Token
    if ! get_access_token; then
        exit 1
    fi
    
    echo ""
    
    # 创建任务
    if ! create_task; then
        exit 1
    fi
    
    echo ""
    log_info "完成！"
}

# 执行主函数
main "$@"
