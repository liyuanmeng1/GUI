#!/bin/bash

################################################################################
# TEAM 字段信息查询脚本
# 
# 功能：查询指定任务分类的字段信息
# 使用：bash get_fields.sh [分类ID] [操作人]
#
# 示例：
#   bash get_fields.sh 287676 wangyihan
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

# 参数（优先使用命令行参数）
TASK_CLASS_ID="${1:-${TEAM_TASK_CLASS_ID:-287676}}"
OPERATOR="${2:-${TEAM_OPERATOR:-wangyihan}}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
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
        return 1
    fi
    
    log_info "✓ 成功获取 accessToken"
    return 0
}

# 获取字段信息
get_fields() {
    log_info "查询分类 ${TASK_CLASS_ID} 的字段信息..."
    echo ""
    
    FIELDS_URL="${BASE_URL}/pm/api/no-ba/external/task/getFields?taskClassId=${TASK_CLASS_ID}&operator=${OPERATOR}"
    
    FIELDS_RESPONSE=$(curl -s -X GET "${FIELDS_URL}" \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        -H "Content-Type: application/json")
    
    CODE=$(echo "${FIELDS_RESPONSE}" | python3 -c "import sys, json; print(json.load(sys.stdin).get('code', -1))" 2>/dev/null)
    
    if [ "${CODE}" = "0" ]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "  字段信息"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        
        # 格式化输出
        echo "${FIELDS_RESPONSE}" | python3 -c "
import sys, json
data = json.load(sys.stdin)
fields = data.get('result', [])

print(f'共 {len(fields)} 个字段\n')

required_fields = [f for f in fields if f.get('required')]
if required_fields:
    print(f'${BLUE}必填字段: {len(required_fields)} 个${NC}')
    for f in required_fields:
        print(f\"  ├─ {f['fieldName']} ({f['fieldKey']})\")
        print(f\"  │  类型: {f['fieldType']}\")
        if f.get('fieldItemModels'):
            print(f\"  │  选项:\")
            for item in f['fieldItemModels']:
                print(f\"  │    - {item['itemName']}: {item['itemValue']}\")
        print()

optional_fields = [f for f in fields if not f.get('required')]
if optional_fields:
    print(f'${YELLOW}可选字段: {len(optional_fields)} 个${NC}')
    for f in optional_fields[:10]:  # 只显示前10个
        print(f\"  ├─ {f['fieldName']} ({f['fieldKey']}): {f['fieldType']}\")
    if len(optional_fields) > 10:
        print(f\"  └─ ... 还有 {len(optional_fields) - 10} 个字段\")
" 2>/dev/null || echo "${FIELDS_RESPONSE}" | python3 -m json.tool
        
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        return 0
    else
        log_error "查询字段信息失败"
        echo "${FIELDS_RESPONSE}" | python3 -m json.tool 2>/dev/null || echo "${FIELDS_RESPONSE}"
        return 1
    fi
}

# 主函数
main() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  TEAM 字段信息查询工具"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    if ! get_access_token; then
        exit 1
    fi
    
    echo ""
    
    if ! get_fields; then
        exit 1
    fi
    
    log_info "完成！"
}

main "$@"
