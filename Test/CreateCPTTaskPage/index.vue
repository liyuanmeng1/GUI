<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from '@ks-infra/element-plus'
import AppLayout from '../../templates/AppLayout/AppLayout.vue'

type PageKey = 'finetune-list' | 'cpt-create' | 'finetune-detail'
const emit = defineEmits<{ (e: 'navigate', page: PageKey, rowId?: string): void }>()

// ---- State ----
const formRef = ref()
const submitting = ref(false)
const expandParams = ref(false)

const formData = ref({
  // 基本信息
  taskName: '',
  taskType: 'text',   // 'text' | 'image'
  taskDesc: '',
  tags: [] as string[],
  tagInput: '',
  fineTuneMethod: 'SFT',   // 'SFT' | 'CPT' | 'LoRA'
  model: '',

  // 训练配置（CPT 仅全量更新）
  trainingMethod: 'full',

  // 数据配置
  datasets: [] as string[],
  mixCorpus: false,
  corpusType: 'general',
  domainType: '',
  mixRatio: null as number | null,

  // 验证集（同 SFT）
  validationSetType: 'split',
  validationSplitRatio: 5,
  validationDataset: '',

  // 模型发布（同 SFT）
  autoPublish: true,
  publishType: 'new',
  modelName: '',
  existingModel: '',
  modelDesc: '',
})

// 精调方式选项（依赖 taskType）
const fineTuneMethodOptions = computed(() => {
  const base = [
    {
      value: 'SFT',
      label: 'SFT',
      desc: '（Supervised Fine-Tuning）使用高质量问答数据进行有监督精调，提升模型指令跟随和任务能力',
    },
    {
      value: 'LoRA',
      label: 'LoRA',
      desc: '（Low-Rank Adaptation）低秩矩阵微调，参数量少、资源消耗低，适合资源受限场景',
    },
  ]
  if (formData.value.taskType === 'text') {
    base.splice(1, 0, {
      value: 'CPT',
      label: 'CPT',
      desc: '（Continual Pre-Training）通过无标注数据进行无监督继续预训练，强化或新增模型特定能力',
    })
  }
  return base
})

// 参数配置
const allParams = ref([
  { name: '迭代轮次', value: '1', min: 1, max: 100, desc: '训练的完整轮次数，CPT 建议默认为 1' },
  { name: '学习率', value: '2e-5', min: '', max: '', desc: '影响权重更新幅度，建议 1e-5 ~ 5e-5' },
  { name: '批次大小', value: '16', min: 1, max: 512, desc: '每次梯度更新使用的样本数量' },
  { name: '最大序列长度', value: '4096', min: 512, max: 8192, desc: '输入序列的最大 Token 数量' },
  { name: 'Warmup 比例', value: '0.03', min: 0, max: 1, desc: '学习率预热阶段占总步数的比例' },
  { name: '权重衰减', value: '0.01', min: 0, max: 1, desc: '正则化系数，防止过拟合' },
  { name: '梯度累积步数', value: '4', min: 1, max: 64, desc: '累积多步梯度后再更新，等效增大 batch size' },
])

const visibleParams = computed(() =>
  expandParams.value ? allParams.value : allParams.value.slice(0, 3)
)

// 版本
const modelVersion = computed(() => {
  if (formData.value.publishType === 'new') return 'v1'
  if (formData.value.existingModel) return 'v3'
  return '–'
})

// 迭代轮次（取自 params[0]）
const epochValue = computed(() => allParams.value[0]?.value || '1')

// 混合语料 tokens 估算（模拟）
const estimatedMixTokens = computed(() => {
  if (!formData.value.mixRatio) return null
  const ratio = parseFloat(String(formData.value.mixRatio))
  if (isNaN(ratio)) return null
  const base = 1000000000  // 10 亿
  const tokens = Math.round(base * ratio / 100)
  return tokens < 1000000
    ? `${tokens.toLocaleString()} tokens`
    : `约 ${(tokens / 100000000).toFixed(2)} 亿 tokens`
})

// 配置概要
const summaryItems = computed(() => {
  const items: { label: string; value: string }[] = [
    { label: '精调方式', value: formData.value.fineTuneMethod || '–' },
    { label: '模型', value: formData.value.model || '–' },
    { label: '训练方法', value: '全量更新' },
    { label: '迭代轮次', value: epochValue.value || '–' },
    { label: '数据集', value: formData.value.datasets.length > 0 ? `已选 ${formData.value.datasets.length} 个` : '–' },
  ]
  if (formData.value.mixCorpus) {
    items.push({ label: '混合语料', value: formData.value.corpusType === 'general' ? '通用类' : (formData.value.domainType || '垂直领域类') })
  }
  items.push({
    label: '验证集',
    value: formData.value.validationSetType === 'split'
      ? `随机拆分 ${formData.value.validationSplitRatio}%`
      : (formData.value.validationDataset || '–'),
  })
  return items
})

// ---- 校验规则 ----
const rules = {
  taskName: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { max: 64, message: '最多输入 64 个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5_-]*$/,
      message: '支持中英文、数字、下划线、中划线，不能以下划线和中划线开头',
      trigger: 'blur',
    },
  ],
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  taskDesc: [{ max: 200, message: '最多输入 200 个字符', trigger: 'blur' }],
  model: [{ required: true, message: '请选择模型', trigger: 'change' }],
  datasets: [{ required: true, message: '请选择至少一个数据集', trigger: 'change' }],
  validationDataset: [
    {
      validator: (_rule: unknown, value: string, callback: Function) => {
        if (formData.value.validationSetType === 'dataset' && !value) {
          callback(new Error('请选择验证集数据集'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
  modelName: [
    {
      validator: (_rule: unknown, value: string, callback: Function) => {
        if (formData.value.autoPublish && formData.value.publishType === 'new') {
          if (!value) return callback(new Error('请输入模型名称'))
          if (value.length > 64) return callback(new Error('最多输入 64 个字符'))
          if (!/^[a-zA-Z0-9\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5_-]*$/.test(value)) {
            return callback(new Error('支持中英文、数字、下划线、中划线，不能以下划线和中划线开头'))
          }
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  existingModel: [
    {
      validator: (_rule: unknown, value: string, callback: Function) => {
        if (formData.value.autoPublish && formData.value.publishType === 'existing' && !value) {
          callback(new Error('请选择已有模型'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
}

// ---- 标签操作 ----
function handleAddTag() {
  const val = formData.value.tagInput.trim()
  if (!val) return
  if (formData.value.tags.includes(val)) return
  formData.value.tags.push(val)
  formData.value.tagInput = ''
}
function handleRemoveTag(tag: string) {
  formData.value.tags = formData.value.tags.filter((t) => t !== tag)
}

// ---- 发布类型切换 ----
watch(() => formData.value.publishType, () => {
  formData.value.modelName = ''
  formData.value.existingModel = ''
})

// ---- 任务类型变更时重置精调方式 ----
watch(() => formData.value.taskType, (val) => {
  if (val === 'image' && formData.value.fineTuneMethod === 'CPT') {
    formData.value.fineTuneMethod = 'SFT'
  }
})

// ---- 提交 ----
function handleSubmit() {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      ElMessage.success('新建成功')
    }, 800)
  })
}

function handleCancel() {
  ElMessageBox.confirm(
    '取消后当前填写的信息将不会保存，是否确认取消？',
    '确认取消？',
    {
      confirmButtonText: '确认取消',
      cancelButtonText: '继续编辑',
      type: 'warning',
    }
  ).then(() => {
    emit('navigate', 'finetune-list')
  }).catch(() => {})
}
</script>

<template>
  <AppLayout selected-menu-key="model-finetuning" active-top-nav="模型服务">
    <!-- ===== 面包屑 ===== -->
    <div :class="$style.breadcrumb">
      <img
        src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/11319693-644a-4057-afc6-bc22995eb2a6"
        alt="back"
        :class="$style.breadcrumbBack"
        @click="handleCancel"
      />
      <div :class="$style.breadcrumbTextRow">
        <span :class="$style.breadcrumbParent" @click="emit('navigate', 'finetune-list')">模型精调</span>
        <img
          src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/870001db-b1fd-41a7-8d86-ed60d70fc298"
          alt="/"
          :class="$style.breadcrumbSep"
        />
        <span :class="$style.breadcrumbCurrent">新建CPT精调任务</span>
      </div>
    </div>

    <!-- ===== 表单 + billing 卡片 ===== -->
    <div :class="$style.pageContentWrapper">
      <div :class="$style.pageContent" :style="{ width: '860px', maxWidth: '100%', margin: '0 auto' }">

        <!-- 表单主体 -->
        <div :class="$style.formArea">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            :class="$style.formSingle"
            hide-required-asterisk
          >

            <!-- ===== 分组 1：基本信息 ===== -->
            <div :class="$style.sectionBlock">
              <div :class="$style.sectionTitle">基本信息</div>
              <div :class="$style.singleFields">

                <!-- 任务名称 -->
                <el-form-item prop="taskName" label="任务名称 *">
                  <el-input
                    v-model="formData.taskName"
                    placeholder="请输入任务名称"
                    maxlength="64"
                    show-word-limit
                    style="width:100%;"
                  />
                  <template #extra>
                    <span :class="$style.fieldHint">支持中英文、数字、下划线、中划线，不能以下划线和中划线开头</span>
                  </template>
                </el-form-item>

                <!-- 任务类型 -->
                <el-form-item prop="taskType" label="任务类型 *">
                  <el-select v-model="formData.taskType" placeholder="请选择任务类型" style="width:100%;">
                    <el-option label="文本生成" value="text" />
                    <el-option label="图像理解" value="image" />
                  </el-select>
                </el-form-item>

                <!-- 任务描述 -->
                <el-form-item prop="taskDesc" label="任务描述">
                  <el-input
                    v-model="formData.taskDesc"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入任务描述"
                    maxlength="200"
                    show-word-limit
                    style="width:100%;"
                  />
                </el-form-item>

                <!-- 标签 -->
                <el-form-item label="标签">
                  <div :class="$style.tagsRow">
                    <el-tag
                      v-for="tag in formData.tags"
                      :key="tag"
                      closable
                      @close="handleRemoveTag(tag)"
                      size="small"
                    >{{ tag }}</el-tag>
                    <el-input
                      v-model="formData.tagInput"
                      placeholder="输入标签后回车添加"
                      size="small"
                      style="width:160px;"
                      @keyup.enter="handleAddTag"
                    />
                  </div>
                </el-form-item>

                <!-- 精调方式（卡片单选） -->
                <el-form-item prop="fineTuneMethod" label="精调方式 *">
                  <div :class="$style.radioCardGroup">
                    <div
                      v-for="opt in fineTuneMethodOptions"
                      :key="opt.value"
                      :class="[$style.radioCard, formData.fineTuneMethod === opt.value ? $style.radioCardActive : '']"
                      @click="formData.fineTuneMethod = opt.value"
                    >
                      <div :class="$style.radioCardHeader">
                        <div :class="$style.radioCircle">
                          <div v-if="formData.fineTuneMethod === opt.value" :class="$style.radioInner" />
                        </div>
                        <span :class="$style.radioCardTitle">{{ opt.label }}</span>
                        <span v-if="opt.value === 'SFT'" :class="$style.defaultBadge">默认</span>
                      </div>
                      <span :class="$style.radioCardDesc">{{ opt.desc }}</span>
                    </div>
                  </div>
                </el-form-item>

                <!-- 模型 -->
                <el-form-item prop="model" label="模型 *">
                  <el-select v-model="formData.model" placeholder="请选择模型" style="width:100%;">
                    <el-option-group label="预置模型">
                      <el-option label="Qwen2.5-7B" value="qwen2.5-7b" />
                      <el-option label="Qwen2.5-14B" value="qwen2.5-14b" />
                      <el-option label="Qwen2.5-32B" value="qwen2.5-32b" />
                      <el-option label="LLaMA-3-8B" value="llama3-8b" />
                    </el-option-group>
                    <el-option-group label="我的模型">
                      <el-option label="my-base-model-v1" value="my-base-model-v1" />
                    </el-option-group>
                  </el-select>
                </el-form-item>

              </div>
            </div>

            <!-- ===== 分组 2：训练配置 ===== -->
            <div :class="$style.sectionBlock">
              <div :class="$style.sectionTitle">训练配置</div>
              <div :class="$style.singleFields">

                <!-- 训练方法：仅全量更新 -->
                <el-form-item label="训练方法 *">
                  <el-radio-group v-model="formData.trainingMethod">
                    <el-radio value="full">全量更新 <span :class="$style.defaultBadge">默认</span></el-radio>
                  </el-radio-group>
                </el-form-item>

                <!-- 参数配置 -->
                <el-form-item label="参数配置 *">
                  <div :class="$style.paramsTableWrap">
                    <table :class="$style.paramsTable">
                      <thead>
                        <tr>
                          <th :class="$style.paramsTh">超参数（名称）</th>
                          <th :class="$style.paramsTh">参数值（可修改范围）</th>
                          <th :class="$style.paramsTh">参数说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(param, i) in visibleParams" :key="i" :class="$style.paramsTr">
                          <td :class="$style.paramsTd">{{ param.name }}</td>
                          <td :class="$style.paramsTd">
                            <div :class="$style.paramInputCell">
                              <el-input v-model="param.value" size="small" style="width:90px;" />
                              <span v-if="param.min !== '' || param.max !== ''" :class="$style.paramRange">
                                ({{ param.min }}~{{ param.max }})
                              </span>
                            </div>
                          </td>
                          <td :class="[$style.paramsTd, $style.paramsDescTd]">{{ param.desc }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div :class="$style.expandParamsRow">
                      <span :class="$style.expandParamsBtn" @click="expandParams = !expandParams">
                        {{ expandParams ? '收起参数' : '更多参数' }}
                        <span :class="[$style.expandArrow, expandParams ? $style.expandArrowUp : '']">›</span>
                      </span>
                    </div>
                  </div>
                </el-form-item>

              </div>
            </div>

            <!-- ===== 分组 3：数据配置 ===== -->
            <div :class="$style.sectionBlock">
              <div :class="$style.sectionTitle">数据配置</div>
              <div :class="$style.singleFields">

                <!-- 数据集（多选） -->
                <el-form-item prop="datasets" label="数据集 *">
                  <el-select
                    v-model="formData.datasets"
                    multiple
                    placeholder="请选择数据集（支持多选）"
                    style="width:100%;"
                  >
                    <el-option-group label="预置数据集">
                      <el-option label="cpt-pretrain-zh-v1（预置）" value="cpt-pretrain-zh-v1" />
                      <el-option label="cpt-web-corpus-v2（预置）" value="cpt-web-corpus-v2" />
                    </el-option-group>
                    <el-option-group label="项目数据集">
                      <el-option label="cpt-dataset-001" value="cpt-dataset-001" />
                      <el-option label="cpt-domain-corpus-v3" value="cpt-domain-corpus-v3" />
                    </el-option-group>
                  </el-select>
                  <!-- 说明内容 -->
                  <template #extra>
                    <div :class="$style.datasetHint">
                      <span :class="$style.fieldHint">文本生成CPT任务建议数据集 10 亿 tokens 起，可获得较好的效果。</span>
                    </div>
                    <div :class="$style.datasetCleanTip">
                      <svg viewBox="0 0 16 16" fill="none" style="width:14px;height:14px;flex-shrink:0;color:#FFAA00;">
                        <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/>
                        <path d="M8 5v4M8 10.5v.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                      </svg>
                      <span>CPT数据集清洗后训练效果更好</span>
                      <a :class="$style.datasetCleanLink" href="#">去清洗</a>
                    </div>
                  </template>
                </el-form-item>

                <!-- 混合语料训练 -->
                <el-form-item label="混合语料训练">
                  <div style="width:100%;">
                    <div :class="$style.switchRow">
                      <el-switch v-model="formData.mixCorpus" />
                      <span :class="$style.switchHint">
                        使用混合语料训练可有效降低模型幻觉问题，根据混合比例将增加对应 token 数，并增加计费
                      </span>
                    </div>

                    <!-- 展开时的子字段 -->
                    <template v-if="formData.mixCorpus">
                      <div :class="$style.mixSubFields">

                        <!-- 语料类型 -->
                        <el-form-item label="语料类型" :class="$style.subFormItem">
                          <el-radio-group v-model="formData.corpusType">
                            <el-radio value="general">通用类 <span :class="$style.defaultBadge">默认</span></el-radio>
                            <el-radio value="vertical">垂直领域类</el-radio>
                          </el-radio-group>
                        </el-form-item>

                        <!-- 垂直领域类型（仅 vertical 时展示） -->
                        <el-form-item v-if="formData.corpusType === 'vertical'" label="领域类型" :class="$style.subFormItem">
                          <el-select v-model="formData.domainType" placeholder="请选择领域类型" style="width:100%;">
                            <el-option label="科技类" value="tech" />
                            <el-option label="医疗类" value="medical" />
                            <el-option label="教育类" value="edu" />
                            <el-option label="新闻类" value="news" />
                            <el-option label="社交媒体类" value="social" />
                          </el-select>
                        </el-form-item>

                        <!-- 混合比例 -->
                        <el-form-item label="混合比例" :class="$style.subFormItem">
                          <div :class="$style.mixRatioRow">
                            <el-input
                              v-model="formData.mixRatio"
                              placeholder="示例：1.25"
                              style="width:160px;"
                            >
                              <template #append>%</template>
                            </el-input>
                            <span v-if="estimatedMixTokens" :class="$style.estimatedTokens">
                              约 {{ estimatedMixTokens }}
                            </span>
                          </div>
                          <template #extra>
                            <span :class="$style.fieldHint">最大 100%，支持小数点后 2 位</span>
                          </template>
                        </el-form-item>

                      </div>
                    </template>
                  </div>
                </el-form-item>

                <!-- 验证集（同 SFT） -->
                <el-form-item label="验证集 *">
                  <div :class="$style.singleFields" style="gap:0;width:100%;">
                    <el-radio-group v-model="formData.validationSetType" style="margin-bottom:12px;">
                      <el-radio value="split">数据拆分 <span :class="$style.defaultBadge">默认</span></el-radio>
                      <el-radio value="dataset">选择数据集</el-radio>
                    </el-radio-group>
                    <div v-if="formData.validationSetType === 'split'" :class="$style.splitRatioRow">
                      <span :class="$style.splitHint">从当前训练集中随机拆分</span>
                      <el-input-number
                        v-model="formData.validationSplitRatio"
                        :min="1"
                        :max="30"
                        :step="1"
                        size="small"
                        style="width:80px;"
                      />
                      <span :class="$style.splitHint">% 作为验证集</span>
                    </div>
                    <el-form-item v-else prop="validationDataset" style="margin-top:8px;margin-bottom:0;">
                      <el-select v-model="formData.validationDataset" placeholder="请选择验证集数据集" style="width:100%;">
                        <el-option-group label="预置数据集">
                          <el-option label="cpt-eval-v1" value="cpt-eval-v1" />
                        </el-option-group>
                        <el-option-group label="我的数据集">
                          <el-option label="my-eval-dataset" value="my-eval-dataset" />
                        </el-option-group>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-form-item>

              </div>
            </div>

            <!-- ===== 分组 4：模型发布 ===== -->
            <div :class="$style.sectionBlock">
              <div :class="$style.sectionTitle">模型发布</div>
              <div :class="$style.singleFields">

                <el-form-item label="自动发布">
                  <div :class="$style.switchRow">
                    <el-switch v-model="formData.autoPublish" />
                    <span :class="$style.switchHint">
                      开启后训练任务成功后将自动发布至模型仓库，不开启则需手动发布至模型仓库
                    </span>
                  </div>
                </el-form-item>

                <template v-if="formData.autoPublish">
                  <el-form-item label="发布方式 *">
                    <el-radio-group v-model="formData.publishType">
                      <el-radio value="new">发布为新模型</el-radio>
                      <el-radio value="existing">已有模型新版本</el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item v-if="formData.publishType === 'new'" prop="modelName" label="模型名称 *">
                    <el-input
                      v-model="formData.modelName"
                      placeholder="请输入模型名称"
                      maxlength="64"
                      show-word-limit
                      style="width:100%;"
                    />
                    <template #extra>
                      <span :class="$style.fieldHint">支持中英文、数字、下划线、中划线，不能以下划线和中划线开头</span>
                    </template>
                  </el-form-item>

                  <el-form-item v-else prop="existingModel" label="选择已有模型 *">
                    <el-select v-model="formData.existingModel" placeholder="请选择模型" style="width:100%;">
                      <el-option label="cpt-qwen-v1（已发布）" value="cpt-qwen-v1" />
                      <el-option label="custom-model-prod（已发布）" value="custom-model-prod" />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="版本">
                    <div :class="$style.readonlyField">{{ modelVersion }}</div>
                    <template #extra>
                      <span :class="$style.fieldHint">版本号根据发布类型自动生成</span>
                    </template>
                  </el-form-item>

                  <el-form-item prop="modelDesc" label="模型描述">
                    <el-input
                      v-model="formData.modelDesc"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入模型描述"
                      maxlength="200"
                      show-word-limit
                      style="width:100%;"
                    />
                  </el-form-item>
                </template>

              </div>
            </div>

          </el-form>
        </div>

        <!-- ===== 右侧 billing 卡片 ===== -->
        <div :class="$style.billingCard">
          <!-- 配置概要 -->
          <div :class="$style.billingSection">
            <div :class="$style.billingSectionTitle">配置概要</div>
            <div :class="$style.billingRows">
              <div v-for="item in summaryItems" :key="item.label" :class="$style.billingRow">
                <span :class="$style.billingLabel">{{ item.label }}</span>
                <span :class="$style.billingValue">{{ item.value }}</span>
              </div>
            </div>
          </div>

          <div :class="$style.billingDivider" />

          <!-- 费用预估 -->
          <div :class="$style.billingFeeSection">
            <div :class="$style.billingFeeHeader">
              <span :class="$style.billingFeeTitleText">费用预估</span>
              <a :class="$style.billingFeeLink" href="#">计费说明</a>
            </div>
            <div :class="$style.billingFeeRow">
              <span :class="$style.billingLabel">预估消耗</span>
              <span :class="$style.billingFeeAmount">100 亿～150 亿 Token</span>
            </div>
            <div :class="$style.billingFeeRow">
              <span :class="$style.billingLabel">折合费用</span>
              <span :class="$style.billingFeeAmount">A～B 折合 ¥ 50.00～75.00</span>
            </div>
            <div :class="$style.billingNote">以实际账单为准</div>
          </div>

          <el-button
            type="primary"
            style="width:100%;"
            :loading="submitting"
            @click="handleSubmit"
          >
            {{ submitting ? '提交中...' : '提交' }}
          </el-button>
        </div>

      </div>
    </div>
  </AppLayout>
</template>

<style module>
/* ① 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px 8px;
  height: 44px;
  flex-shrink: 0;
}

.breadcrumbBack {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  cursor: pointer;
  opacity: 0.6;
}
.breadcrumbBack:hover { opacity: 1; }

.breadcrumbTextRow {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 1px 0;
}

.breadcrumbParent {
  font-size: 12px;
  line-height: 18px;
  color: #898A8C;
  cursor: pointer;
  font-family: 'PingFang SC', sans-serif;
}
.breadcrumbParent:hover { color: #252626; }

.breadcrumbSep { width: 16px; height: 16px; flex-shrink: 0; }

.breadcrumbCurrent {
  font-size: 12px;
  line-height: 18px;
  color: #252626;
  font-family: 'PingFang SC', sans-serif;
}

/* ② 外层 wrapper */
.pageContentWrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 24px 80px;
}

.pageContent {
  display: flex;
  align-items: flex-start;
  gap: 40px;
}

.formArea { flex: 1; min-width: 0; }

/* ③ 单列 */
.formSingle { width: 520px; }

/* 分组区块 */
.sectionBlock {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}
.sectionBlock:last-child { margin-bottom: 0; }

.sectionTitle {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: var(--el-text-primary);
  font-family: 'PingFang SC', sans-serif;
}

.singleFields { display: flex; flex-direction: column; }

/* 字段提示 */
.fieldHint {
  font-size: 12px;
  line-height: 18px;
  color: var(--el-text-tertiary);
}

/* 标签行 */
.tagsRow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  width: 100%;
}

/* 精调方式卡片 */
.radioCardGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.radioCard {
  padding: 12px;
  border: 1px solid var(--el-stroke-form);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.radioCard:hover { border-color: var(--el-text-brand); }

.radioCardActive {
  border-color: var(--el-text-brand);
  background: rgba(50, 107, 251, 0.04);
}

.radioCardHeader {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radioCircle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid #D5D6D9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s;
}
.radioCardActive .radioCircle { border-color: var(--el-text-brand); }

.radioInner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--el-text-brand);
}

.radioCardTitle {
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--el-text-primary);
}

.radioCardDesc {
  font-size: 12px;
  line-height: 18px;
  color: var(--el-text-tertiary);
  padding-left: 24px;
}

/* 默认徽章 */
.defaultBadge {
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  height: 16px;
  border-radius: 2px;
  background: rgba(50, 107, 251, 0.08);
  color: var(--el-text-brand);
  font-size: 10px;
  line-height: 16px;
  font-weight: 400;
}

/* 参数配置表格 */
.paramsTableWrap { width: 100%; }

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

.paramInputCell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.paramRange {
  font-size: 12px;
  color: var(--el-text-tertiary);
  white-space: nowrap;
}

.expandParamsRow {
  display: flex;
  justify-content: center;
  padding: 8px 0;
  border-top: 1px solid var(--el-stroke-table);
}

.expandParamsBtn {
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

/* 数据集说明 */
.datasetHint { margin-top: 4px; }

.datasetCleanTip {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-secondary);
}

.datasetCleanLink {
  color: var(--el-text-brand);
  cursor: pointer;
  text-decoration: none;
}
.datasetCleanLink:hover { text-decoration: underline; }

/* switch 行 */
.switchRow {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.switchHint {
  font-size: 12px;
  line-height: 18px;
  color: var(--el-text-tertiary);
  padding-top: 2px;
}

/* 混合语料子字段 */
.mixSubFields {
  margin-top: 16px;
  padding: 16px;
  background: #F9FAFD;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.subFormItem { margin-bottom: 16px; }
.subFormItem:last-child { margin-bottom: 0; }

.mixRatioRow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.estimatedTokens {
  font-size: 12px;
  color: var(--el-text-tertiary);
  white-space: nowrap;
}

/* 验证集拆分行 */
.splitRatioRow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.splitHint {
  font-size: 13px;
  color: var(--el-text-secondary);
}

/* 只读字段 */
.readonlyField {
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--el-text-primary);
  padding: 0 12px;
  background: #F5F7FA;
  border: 1px solid var(--el-stroke-form);
  border-radius: 4px;
  width: 100%;
}

/* billing 卡片 */
.billingCard {
  width: 300px;
  flex-shrink: 0;
  align-self: flex-start;
  position: sticky;
  top: 0;
  border: 1px solid var(--el-stroke-border);
  border-radius: 8px;
  background: #FCFCFD;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.billingSection { display: flex; flex-direction: column; gap: 8px; }

.billingSectionTitle {
  font-size: 14px; line-height: 22px; font-weight: 500; color: var(--el-text-primary);
}

.billingRows { display: flex; flex-direction: column; gap: 8px; }

.billingRow { display: flex; align-items: flex-start; gap: 12px; }

.billingLabel {
  flex-shrink: 0;
  width: 48px;
  font-size: 12px;
  line-height: 18px;
  color: var(--el-text-secondary);
}

.billingValue {
  flex: 1;
  font-size: 12px;
  line-height: 18px;
  color: var(--el-text-primary);
}

.billingDivider { height: 1px; background: var(--el-stroke-table); flex-shrink: 0; }

.billingFeeSection { display: flex; flex-direction: column; gap: 8px; }

.billingFeeHeader { display: flex; justify-content: space-between; align-items: center; }

.billingFeeTitleText { font-size: 14px; line-height: 22px; font-weight: 500; color: var(--el-text-primary); }

.billingFeeLink {
  font-size: 12px;
  line-height: 18px;
  color: var(--el-text-brand);
  cursor: pointer;
  text-decoration: none;
}

.billingFeeRow { display: flex; align-items: flex-start; gap: 12px; }

.billingFeeAmount { font-size: 13px; line-height: 18px; font-weight: 500; color: #FF7429; flex: 1; }

.billingNote {
  font-size: 11px;
  color: var(--el-text-tertiary);
  text-align: center;
}
</style>
