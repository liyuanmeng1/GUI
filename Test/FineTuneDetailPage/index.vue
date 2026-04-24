<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '../../templates/AppLayout/AppLayout.vue'
import DetailPage from '../../templates/DetailPage/DetailPage.vue'
import type { BreadcrumbItem, StatusTag, MetaItem, TabItem, ActionItem } from '../../templates/DetailPage/DetailPage.vue'

type PageKey = 'finetune-list' | 'cpt-create' | 'finetune-detail'
const props = defineProps<{ rowId?: string }>()
const emit = defineEmits<{ (e: 'navigate', page: PageKey, rowId?: string): void }>()

// ---- Mock 详情数据（回显 CreateCPTTaskPage 填写字段）----
const detail = ref({
  // 基本信息
  taskName: 'cpt-task-001',
  taskType: '文本生成',
  taskDesc: '用于扩展模型在科技领域的预训练知识，增强模型理解垂直领域文本的能力。',
  tags: ['CPT', '科技领域', '预训练'],
  fineTuneMethod: 'CPT',
  model: 'Qwen2.5-7B',

  // 训练配置
  trainingMethod: '全量更新',
  params: [
    { name: '迭代轮次', value: '1', desc: '训练的完整轮次数，CPT 建议默认为 1' },
    { name: '学习率', value: '2e-5', desc: '影响权重更新幅度，建议 1e-5 ~ 5e-5' },
    { name: '批次大小', value: '16', desc: '每次梯度更新使用的样本数量' },
    { name: '最大序列长度', value: '4096', desc: '输入序列的最大 Token 数量' },
    { name: 'Warmup 比例', value: '0.03', desc: '学习率预热阶段占总步数的比例' },
    { name: '权重衰减', value: '0.01', desc: '正则化系数，防止过拟合' },
    { name: '梯度累积步数', value: '4', desc: '累积多步梯度后再更新，等效增大 batch size' },
  ],

  // 数据配置
  datasets: ['cpt-pretrain-zh-v1（预置）', 'cpt-domain-corpus-v3'],
  mixCorpus: true,
  corpusType: '垂直领域类',
  domainType: '科技类',
  mixRatio: '1.25%',
  validationSetType: '数据拆分',
  validationSplitRatio: '5%',

  // 模型发布
  autoPublish: true,
  publishType: '发布为新模型',
  modelName: 'cpt-qwen-sci-v1',
  modelVersion: 'v1',
  modelDesc: '基于 Qwen2.5-7B 在科技领域语料上继续预训练的专用模型，适用于科技文本理解场景。',

  // 元信息
  id: '4123121',
  status: 'running' as const,
  createdAt: '2024-04-01 10:00:00',
  updatedAt: '2024-04-01 14:32:10',
  creator: '希天天',
  project: '团队项目 A',
})

// ---- DetailPage props ----
const breadcrumbs: BreadcrumbItem[] = [
  { label: '模型精调', onClick: () => emit('navigate', 'finetune-list') },
  { label: detail.value.taskName },
]

const statusTag: StatusTag = {
  label: '运行中',
  dotColor: '#326BFB',
  bgColor: '#326BFB',
  textColor: '#252626',
}

const metaItems: MetaItem[] = [
  { label: '任务 ID', value: detail.value.id },
  { label: '创建时间', value: detail.value.createdAt },
  { label: '更新时间', value: detail.value.updatedAt },
  { label: '创建人', value: detail.value.creator },
  { label: '所属项目', value: detail.value.project },
]

const actions: ActionItem[] = [
  { key: 'stop', label: '停止', type: 'default' },
  {
    key: 'more',
    label: '更多',
    type: 'default',
    dropdownMenu: [
      { key: 'copy', label: '复制配置' },
      { key: 'delete', label: '删除', danger: true },
    ],
  },
]

const tabs: TabItem[] = [
  { key: 'basic', label: '基本信息' },
  { key: 'training', label: '训练配置' },
  { key: 'data', label: '数据配置' },
  { key: 'publish', label: '模型发布' },
  { key: 'metrics', label: '效果指标' },
  { key: 'logs', label: '训练日志' },
]

const activeTab = ref('basic')

function handleTabChange(key: string) {
  activeTab.value = key
}

// ---- 参数展开 ----
const expandParams = ref(false)
</script>

<template>
  <AppLayout selected-menu-key="model-finetuning" active-top-nav="模型服务">
  <DetailPage
    :breadcrumbs="breadcrumbs"
    :title="detail.taskName"
    :status-tag="statusTag"
    :meta-items="metaItems"
    :actions="actions"
    :tabs="tabs"
    default-active-tab="basic"
    @tab-change="handleTabChange"
  >
    <!-- ===== Tab: 基本信息 ===== -->
    <template v-if="activeTab === 'basic'">
      <el-descriptions
        :column="2"
        :colon="false"
        :label-style="{ color: '#898A8C', width: '84px', fontSize: '14px', lineHeight: '22px' }"
        :content-style="{ color: '#252626', fontSize: '14px' }"
        style="margin-top:16px;"
      >
        <el-descriptions-item label="任务名称">{{ detail.taskName || '–' }}</el-descriptions-item>
        <el-descriptions-item label="任务 ID">{{ detail.id || '–' }}</el-descriptions-item>
        <el-descriptions-item label="精调方式">
          <span
            :style="{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              lineHeight: '18px',
              fontWeight: 500,
              color: '#9B5CF6',
              background: 'rgba(155,92,246,0.08)',
            }"
          >{{ detail.fineTuneMethod || '–' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="任务类型">{{ detail.taskType || '–' }}</el-descriptions-item>
        <el-descriptions-item label="基础模型">{{ detail.model || '–' }}</el-descriptions-item>
        <el-descriptions-item label="所属项目">{{ detail.project || '–' }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ detail.creator || '–' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createdAt || '–' }}</el-descriptions-item>
        <el-descriptions-item label="标签" :span="2">
          <div v-if="detail.tags.length" style="display:flex;flex-wrap:wrap;gap:6px;">
            <el-tag v-for="tag in detail.tags" :key="tag" size="small" type="">{{ tag }}</el-tag>
          </div>
          <span v-else style="color:var(--el-text-disable);">–</span>
        </el-descriptions-item>
        <el-descriptions-item label="任务描述" :span="2">{{ detail.taskDesc || '–' }}</el-descriptions-item>
      </el-descriptions>
    </template>

    <!-- ===== Tab: 训练配置 ===== -->
    <template v-else-if="activeTab === 'training'">
      <el-descriptions
        :column="2"
        :colon="false"
        :label-style="{ color: '#898A8C', width: '84px', fontSize: '14px', lineHeight: '22px' }"
        :content-style="{ color: '#252626', fontSize: '14px' }"
        style="margin-top:16px;margin-bottom:16px;"
      >
        <el-descriptions-item label="训练方法" :span="2">{{ detail.trainingMethod || '–' }}</el-descriptions-item>
      </el-descriptions>

      <!-- 参数配置表格 -->
      <div :class="$style.sectionLabel">参数配置</div>
      <table :class="$style.paramsTable">
        <thead>
          <tr>
            <th :class="$style.paramsTh">超参数（名称）</th>
            <th :class="$style.paramsTh">参数值</th>
            <th :class="$style.paramsTh">参数说明</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(param, i) in (expandParams ? detail.params : detail.params.slice(0, 3))"
            :key="i"
            :class="$style.paramsTr"
          >
            <td :class="$style.paramsTd">{{ param.name }}</td>
            <td :class="$style.paramsTd">{{ param.value }}</td>
            <td :class="[$style.paramsTd, $style.paramsDescTd]">{{ param.desc }}</td>
          </tr>
        </tbody>
      </table>
      <div :class="$style.expandRow">
        <span :class="$style.expandBtn" @click="expandParams = !expandParams">
          {{ expandParams ? '收起参数' : '更多参数' }}
          <span :class="[$style.expandArrow, expandParams ? $style.expandArrowUp : '']">›</span>
        </span>
      </div>
    </template>

    <!-- ===== Tab: 数据配置 ===== -->
    <template v-else-if="activeTab === 'data'">
      <el-descriptions
        :column="2"
        :colon="false"
        :label-style="{ color: '#898A8C', width: '84px', fontSize: '14px', lineHeight: '22px' }"
        :content-style="{ color: '#252626', fontSize: '14px' }"
        style="margin-top:16px;"
      >
        <el-descriptions-item label="数据集" :span="2">
          <div v-if="detail.datasets.length" style="display:flex;flex-direction:column;gap:4px;">
            <span v-for="ds in detail.datasets" :key="ds">{{ ds }}</span>
          </div>
          <span v-else style="color:var(--el-text-disable);">–</span>
        </el-descriptions-item>
        <el-descriptions-item label="混合语料" :span="2">{{ detail.mixCorpus ? '已开启' : '未开启' }}</el-descriptions-item>
        <template v-if="detail.mixCorpus">
          <el-descriptions-item label="语料类型">{{ detail.corpusType || '–' }}</el-descriptions-item>
          <el-descriptions-item label="领域类型">{{ detail.domainType || '–' }}</el-descriptions-item>
          <el-descriptions-item label="混合比例">{{ detail.mixRatio || '–' }}</el-descriptions-item>
        </template>
        <el-descriptions-item label="验证集类型">{{ detail.validationSetType || '–' }}</el-descriptions-item>
        <el-descriptions-item label="验证集比例">{{ detail.validationSplitRatio || '–' }}</el-descriptions-item>
      </el-descriptions>
    </template>

    <!-- ===== Tab: 模型发布 ===== -->
    <template v-else-if="activeTab === 'publish'">
      <el-descriptions
        :column="2"
        :colon="false"
        :label-style="{ color: '#898A8C', width: '84px', fontSize: '14px', lineHeight: '22px' }"
        :content-style="{ color: '#252626', fontSize: '14px' }"
        style="margin-top:16px;"
      >
        <el-descriptions-item label="自动发布">{{ detail.autoPublish ? '是' : '否' }}</el-descriptions-item>
        <el-descriptions-item label="发布方式">{{ detail.publishType || '–' }}</el-descriptions-item>
        <el-descriptions-item label="模型名称">{{ detail.modelName || '–' }}</el-descriptions-item>
        <el-descriptions-item label="版本">{{ detail.modelVersion || '–' }}</el-descriptions-item>
        <el-descriptions-item label="模型描述" :span="2">{{ detail.modelDesc || '–' }}</el-descriptions-item>
      </el-descriptions>
    </template>

    <!-- ===== Tab: 效果指标 ===== -->
    <template v-else-if="activeTab === 'metrics'">
      <el-empty
        description="效果指标由后端定义，功能同 SFT，数据加载中..."
        :image-size="120"
        style="margin-top:40px;"
      />
    </template>

    <!-- ===== Tab: 训练日志 ===== -->
    <template v-else-if="activeTab === 'logs'">
      <el-empty
        description="训练日志功能同 SFT，数据加载中..."
        :image-size="120"
        style="margin-top:40px;"
      />
    </template>
  </DetailPage>
  </AppLayout>
</template>

<style module>
/* 参数配置表格（详情页只读版）*/
.sectionLabel {
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  color: var(--el-text-secondary);
  margin-bottom: 8px;
}

.paramsTable {
  width: 100%;
  border-collapse: collapse;
}

.paramsTh {
  padding: 8px 12px;
  background: #F5F7FA;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-secondary);
  text-align: left;
  border-bottom: 1px solid var(--el-stroke-table);
}

.paramsTr { border-bottom: 1px solid var(--el-stroke-table); }
.paramsTr:last-child { border-bottom: none; }

.paramsTd {
  padding: 10px 12px;
  font-size: 13px;
  color: var(--el-text-primary);
  vertical-align: middle;
}

.paramsDescTd {
  color: var(--el-text-tertiary);
  font-size: 12px;
}

.expandRow {
  display: flex;
  justify-content: center;
  padding: 8px 0;
  border-top: 1px solid var(--el-stroke-table);
}

.expandBtn {
  font-size: 13px;
  color: var(--el-text-brand);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
}

.expandArrow {
  font-size: 16px;
  display: inline-block;
  transition: transform 0.2s;
  transform: rotate(90deg);
  line-height: 1;
}
.expandArrowUp { transform: rotate(-90deg); }
</style>
