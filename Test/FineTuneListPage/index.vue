<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from '@ks-infra/element-plus'
import AppLayout from '../../templates/AppLayout/AppLayout.vue'

type PageKey = 'finetune-list' | 'cpt-create' | 'finetune-detail'
const emit = defineEmits<{ (e: 'navigate', page: PageKey, rowId?: string): void }>()

// ---- Types ----
type FineTuneStatus = 'queuing' | 'running' | 'succeeded' | 'failed' | 'stopped'
type FineTuneMethod = 'SFT' | 'CPT' | 'LoRA'

interface FineTuneRecord {
  id: string
  name: string
  status: FineTuneStatus
  method: FineTuneMethod
  model: string
  dataset: string
  project: string
  updatedAt: string
  creator: { name: string }
  // 状态相关提示
  queueCount?: number
  estimatedWaitHours?: number
  estimatedWaitMinutes?: number
  estimatedRemainHours?: number
  estimatedRemainMinutes?: number
  failReason?: string
}

// ---- Constants ----
const STATUS_CONFIG: Record<FineTuneStatus, { label: string; dotColor: string }> = {
  queuing:   { label: '排队中', dotColor: '#FFAA00' },
  running:   { label: '运行中', dotColor: '#326BFB' },
  succeeded: { label: '已完成', dotColor: '#30C453' },
  failed:    { label: '已失败', dotColor: '#FA4E3E' },
  stopped:   { label: '已停止', dotColor: '#BBBDBF' },
}

const METHOD_TAG_CONFIG: Record<FineTuneMethod, { label: string; color: string; bg: string }> = {
  SFT:  { label: 'SFT',  color: '#326BFB', bg: 'rgba(50,107,251,0.08)' },
  CPT:  { label: 'CPT',  color: '#9B5CF6', bg: 'rgba(155,92,246,0.08)' },
  LoRA: { label: 'LoRA', color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
}

// ---- Mock Data ----
const mockData: FineTuneRecord[] = [
  {
    id: '4123121',
    name: 'cpt-task-001',
    status: 'queuing',
    method: 'CPT',
    model: 'Qwen2.5-7B',
    dataset: 'cpt-dataset-v1',
    project: '个人项目',
    updatedAt: '2024-04-01',
    creator: { name: '希天天' },
    queueCount: 3,
    estimatedWaitHours: 1,
    estimatedWaitMinutes: 20,
  },
  {
    id: '4123122',
    name: 'sft-task-002',
    status: 'running',
    method: 'SFT',
    model: 'Qwen2.5-14B',
    dataset: 'sft-alpaca-zh',
    project: '团队项目 A',
    updatedAt: '2024-04-01',
    creator: { name: '王小明' },
    estimatedRemainHours: 0,
    estimatedRemainMinutes: 45,
  },
  {
    id: '4123123',
    name: 'lora-task-003',
    status: 'succeeded',
    method: 'LoRA',
    model: 'LLaMA-3-8B',
    dataset: 'my-dataset-001',
    project: '个人项目',
    updatedAt: '2024-03-30',
    creator: { name: '李四' },
  },
  {
    id: '4123124',
    name: 'cpt-task-004',
    status: 'failed',
    method: 'CPT',
    model: 'Qwen2.5-7B',
    dataset: 'cpt-dataset-v2',
    project: '团队项目 B',
    updatedAt: '2024-03-29',
    creator: { name: '张三' },
    failReason: '显存不足，训练进程被 OOM 终止。请尝试减小批次大小或选择更小的模型。',
  },
  {
    id: '4123125',
    name: 'sft-task-005',
    status: 'stopped',
    method: 'SFT',
    model: 'Qwen2.5-7B',
    dataset: 'sft-math-v2',
    project: '个人项目',
    updatedAt: '2024-03-28',
    creator: { name: '希天天' },
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `412312${i + 6}`,
    name: `task-00${i + 6}`,
    status: 'succeeded' as FineTuneStatus,
    method: (i % 3 === 0 ? 'SFT' : i % 3 === 1 ? 'CPT' : 'LoRA') as FineTuneMethod,
    model: 'Qwen2.5-7B',
    dataset: `dataset-0${i + 1}`,
    project: '个人项目',
    updatedAt: `2024-03-2${i + 1}`,
    creator: { name: '希天天' },
  })),
]

const PAGE_SIZE_OPTIONS = [
  { label: '10 条/页', value: 10 },
  { label: '20 条/页', value: 20 },
  { label: '50 条/页', value: 50 },
]

// ---- State ----
const dataSource = ref<FineTuneRecord[]>(mockData)
const filteredData = ref<FineTuneRecord[]>(mockData)
const loading = ref(false)
const activeTab = ref('all')
const searchValue = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const total = computed(() => filteredData.value.length)

// ---- Tab Items ----
const toolbarTabItems = [
  { key: 'all', label: '全部' },
  { key: 'mine', label: '我创建的' },
]

// ---- Methods ----
function handleTabChange(key: string) {
  activeTab.value = key
  applyFilter()
  currentPage.value = 1
}

function applyFilter() {
  let base = activeTab.value === 'all'
    ? dataSource.value
    : dataSource.value.filter((item) => item.creator.name === '希天天')
  filteredData.value = searchValue.value
    ? base.filter((item) => item.name.includes(searchValue.value) || item.id.includes(searchValue.value))
    : base
}

function handleSearch() {
  applyFilter()
  currentPage.value = 1
}

function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('刷新成功')
  }, 600)
}

function handleCreate() {
  emit('navigate', 'cpt-create')
}

function handlePageSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
}

// ---- 状态 tooltip 内容 ----
function getStatusTooltip(row: FineTuneRecord): string {
  if (row.status === 'queuing') {
    return `前序任务 ${row.queueCount ?? 0} 个，预估等待时间 ${row.estimatedWaitHours ?? 0} 小时 ${row.estimatedWaitMinutes ?? 0} 分钟`
  }
  if (row.status === 'running') {
    return `预估剩余时间 ${row.estimatedRemainHours ?? 0} 小时 ${row.estimatedRemainMinutes ?? 0} 分钟`
  }
  if (row.status === 'failed') {
    return row.failReason ?? '任务失败'
  }
  return ''
}

function hasStatusTooltip(status: FineTuneStatus): boolean {
  return status === 'queuing' || status === 'running' || status === 'failed'
}

// ---- 分页数据 ----
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})
</script>

<template>
  <AppLayout selected-menu-key="model-finetuning" active-top-nav="模型服务">
    <!-- ====== PageHeader ====== -->
    <div :class="$style.pageHeader">
      <div :class="$style.pageHeaderLeft">
        <div :class="$style.pageTitleBlock">
          <span :class="$style.pageTitle">模型精调</span>
        </div>
        <span :class="$style.pageDescription">通过高质量数据对基础模型进行精调，提升模型在特定场景下的能力</span>
      </div>
      <div :class="$style.pageHeaderHelp">
        <img
          :class="$style.pageHeaderHelpIcon"
          src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ade58665-0cb8-4714-829f-b46ea24d15f2"
          alt="help"
        />
        <span :class="$style.pageHeaderHelpText">使用说明</span>
      </div>
    </div>

    <!-- ====== PageContent ====== -->
    <div :class="$style.pageContent">
      <!-- 操作栏 -->
      <div :class="$style.toolbar">
        <div style="display:flex;align-items:center;gap:12px;">
          <el-button type="primary" @click="handleCreate">
            <template #icon><span>+</span></template>
            新建精调任务
          </el-button>

          <!-- SegmentedTab -->
          <div :class="$style.segmentedTab">
            <div
              v-for="tab in toolbarTabItems"
              :key="tab.key"
              :class="[$style.segmentedTabItem, activeTab === tab.key ? $style.segmentedTabItemActive : '']"
              @click="handleTabChange(tab.key)"
            >{{ tab.label }}</div>
          </div>

          <el-input
            v-model="searchValue"
            placeholder="搜索任务名称"
            style="width:240px;"
            clearable
            @input="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon :size="16" style="color:var(--el-text-tertiary);">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
              </el-icon>
            </template>
          </el-input>
        </div>

        <div style="display:flex;align-items:center;gap:12px;">
          <el-button @click="handleRefresh" style="width:32px;height:32px;padding:0;min-width:32px;">
            <el-icon :size="16" style="color:var(--el-text-tertiary);">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.667 2.667v3.666h3.666" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.9 9.667A5.333 5.333 0 1 0 4.1 4.633L2.667 6.333" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </el-icon>
          </el-button>
        </div>
      </div>

      <!-- Table -->
      <el-table
        :data="pagedData"
        v-loading="loading"
        row-key="id"
        style="width:100%;"
        :border="false"
      >
        <template #empty>
          <el-empty description="暂无精调任务" :image-size="120" />
        </template>

        <el-table-column prop="id" label="ID" width="100" show-overflow-tooltip />

        <el-table-column prop="name" label="任务名称" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <a style="color:var(--el-text-brand);cursor:pointer;" @click="emit('navigate', 'finetune-detail', row.id)">{{ row.name }}</a>
          </template>
        </el-table-column>

        <!-- 状态列：带 tooltip 提示 -->
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tooltip
              v-if="hasStatusTooltip(row.status)"
              :content="getStatusTooltip(row)"
              placement="top"
              :max-width="260"
            >
              <div style="display:flex;align-items:center;gap:6px;cursor:default;">
                <span
                  style="display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;"
                  :style="{ background: STATUS_CONFIG[row.status as FineTuneStatus].dotColor }"
                  :class="row.status === 'running' ? $style.pulseDot : ''"
                />
                <span style="font-size:14px;color:var(--el-text-primary);">
                  {{ STATUS_CONFIG[row.status as FineTuneStatus].label }}
                </span>
                <!-- 帮助图标提示有信息 -->
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:14px;height:14px;color:var(--el-text-tertiary);flex-shrink:0;">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M8 7v4M8 5.5v.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
              </div>
            </el-tooltip>
            <div v-else style="display:flex;align-items:center;gap:6px;">
              <span
                style="display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;"
                :style="{ background: STATUS_CONFIG[row.status as FineTuneStatus].dotColor }"
              />
              <span style="font-size:14px;color:var(--el-text-primary);">
                {{ STATUS_CONFIG[row.status as FineTuneStatus].label }}
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- 精调方式列 -->
        <el-table-column prop="method" label="精调方式" width="110">
          <template #default="{ row }">
            <span
              :style="{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                lineHeight: '18px',
                fontWeight: 500,
                color: METHOD_TAG_CONFIG[row.method as FineTuneMethod].color,
                background: METHOD_TAG_CONFIG[row.method as FineTuneMethod].bg,
              }"
            >{{ METHOD_TAG_CONFIG[row.method as FineTuneMethod].label }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="model" label="基础模型" min-width="140" show-overflow-tooltip />
        <el-table-column prop="dataset" label="训练数据集" min-width="140" show-overflow-tooltip />
        <el-table-column prop="project" label="所属项目" width="120" show-overflow-tooltip />
        <el-table-column prop="updatedAt" label="更新时间" width="120" show-overflow-tooltip />

        <el-table-column prop="creator" label="创建人" width="90">
          <template #default="{ row }">
            <el-avatar :size="24" style="background:var(--el-bg-brand-tag);color:var(--el-text-brand);font-size:12px;">
              {{ row.creator.name[0] }}
            </el-avatar>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="emit('navigate', 'finetune-detail', row.id)">查看详情</el-button>
            <el-divider direction="vertical" style="margin:0 4px;" />
            <el-dropdown trigger="click">
              <el-button type="primary" link size="small" style="color:var(--el-text-secondary);">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>复制配置</el-dropdown-item>
                  <el-dropdown-item :disabled="row.status !== 'running'">停止</el-dropdown-item>
                  <el-dropdown-item divided style="color:var(--el-text-negative);">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <div :class="$style.paginationBar">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:var(--el-text-secondary);font-size:14px;">共 {{ total }} 条</span>
          <el-select
            :model-value="pageSize"
            size="small"
            style="width:100px;"
            @change="handlePageSizeChange"
          >
            <el-option v-for="opt in PAGE_SIZE_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          :total="total"
          :page-size="pageSize"
          layout="prev, pager, next"
          @current-change="(p: number) => currentPage = p"
        />
      </div>
    </div>
  </AppLayout>
</template>

<style module>
/* PageHeader */
.pageHeader {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  gap: 12px;
  background: linear-gradient(180deg, #F8F6FF -1.34%, rgba(234,244,255,0.10) 30%, rgba(255,255,255,0.00) 100%), #FFF;
  flex-shrink: 0;
}

.pageHeaderLeft {
  flex-grow: 1;
  height: 28px;
  display: flex;
  align-items: center;
  gap: 0;
}

.pageTitleBlock {
  height: 28px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.pageTitle {
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  color: #252626;
  white-space: nowrap;
  font-family: 'PingFang SC', sans-serif;
}

.pageDescription {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #898A8C;
  margin: 0 0 0 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pageHeaderHelp {
  width: 76px;
  height: 22px;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  cursor: pointer;
}

.pageHeaderHelpIcon { width: 16px; height: 16px; flex-shrink: 0; }

.pageHeaderHelpText { font-size: 14px; line-height: 22px; color: #575859; }

/* PageContent */
.pageContent {
  padding: 0 24px 24px;
  background: #fff;
}

/* 操作栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-top: 0;
}

/* SegmentedTab */
.segmentedTab {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 3px;
  gap: 4px;
  border: 1px solid #D5D6D9;
  border-radius: 8px;
  background: #FFFFFF;
  flex-shrink: 0;
}

.segmentedTabItem {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px 10px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: #575859;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}

.segmentedTabItem:hover { color: #252626; }

.segmentedTabItemActive {
  background: #EBEDF0;
  color: #252626;
  font-weight: 500;
}

/* 分页栏 */
.paginationBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0 0;
}

/* 脉冲动画（运行中状态） */
.pulseDot {
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
