import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  message,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const { Text } = Typography;

// ============================================================
// 表单页模板 — FormPage
// ------------------------------------------------------------
// 适用场景：新建/编辑资源的全页面表单（非弹窗）
//
// 区域结构：
//   1. 面包屑（必有）
//   2. 表单区域（必有）：formLayout = 'single' | 'double'
//   3. 按钮区域（二选一，可选）：
//      buttonVariant = 'normal'  → 按钮区域一（下一步 + 取消，底部居中横条）
//      buttonVariant = 'billing' → 按钮区域二（右侧配置概要卡片 + 提交按钮）
//
// Props:
//   formLayout?:    'single' | 'double'   — 单列 / 双列，默认 single
//   buttonVariant?: 'normal' | 'billing' | 'none' — 按钮区域变体，默认 normal
// ============================================================

export interface FormPageProps {
  /** 单列（single，含右侧配置概要）或双列（double）布局 */
  formLayout?: 'single' | 'double';
  /** 按钮区域变体：normal=普通提交底部栏；billing=右侧含费用预估卡片；none=不展示 */
  buttonVariant?: 'normal' | 'billing' | 'none';
}

const FormPage = ({
  formLayout = 'single',
  buttonVariant = 'normal',
}: FormPageProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    form.validateFields().then(() => {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        message.success('提交成功');
      }, 600);
    });
  };

  const handleCancel = () => {
    history.back();
  };

  // ---- 单列（single）左侧表单区 ----
  const singleColumnForm = (
    <Form form={form} layout="vertical" className={styles.formSingle} requiredMark={false}>
      {/* 分组 1 */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionTitle}>字段组</div>
        <div className={styles.singleFields}>
          <Form.Item name="field1" label="标题" rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="field2" label="标题">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="field3" label="标题">
            <Input placeholder="请输入" />
          </Form.Item>
        </div>
      </div>

      {/* 分组 2 */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionTitle}>字段组</div>
        <div className={styles.singleFields}>
          <Form.Item name="field4" label="标题">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="field5" label="标题">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="field6" label="标题">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="field7" label="标题">
            <Input placeholder="请输入" />
          </Form.Item>
        </div>
      </div>
    </Form>
  );

  // ---- 双列（double）表单区 ----
  const doubleColumnForm = (
    <Form form={form} layout="vertical" className={styles.formDouble} requiredMark="optional">
      {/* 分组 1：基本信息 */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionTitle}>基本信息</div>
        <div className={styles.doubleGrid}>
          <Form.Item
            name="name"
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
            className={styles.fullWidth}
          >
            <Input placeholder="请输入任务名称" maxLength={64} showCount />
          </Form.Item>
          <Form.Item name="description" label="任务描述" className={styles.fullWidth}>
            <Input.TextArea placeholder="请输入任务描述" rows={3} />
          </Form.Item>
        </div>
      </div>

      {/* 分组 2：接入配置 */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionTitle}>接入配置</div>
        <div className={styles.doubleGrid}>
          <Form.Item
            name="model"
            label="模型"
            rules={[{ required: true, message: '请添加模型' }]}
            className={styles.fullWidth}
          >
            <Button icon={<PlusOutlined />}>添加模型</Button>
          </Form.Item>
          <Form.Item
            name="evalScene"
            label="评测场景"
            rules={[{ required: true, message: '请选择评测场景' }]}
            className={styles.fullWidth}
          >
            <Select
              placeholder="请选择评测集"
              options={[
                { label: '在线推理', value: 'online' },
                { label: '离线推理', value: 'offline' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="dataset"
            label="数据集"
            rules={[{ required: true, message: '请选择数据集' }]}
            className={styles.fullWidth}
          >
            <Select placeholder="请选择评测集" />
          </Form.Item>
          <div className={`${styles.doubleRow} ${styles.fullWidth}`}>
            <Form.Item
              name="stress"
              label="压力值"
              rules={[{ required: true, message: '请填写压力值' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请填写压力值" addonAfter="QPS" />
            </Form.Item>
            <Form.Item
              name="duration"
              label="持续时长"
              rules={[{ required: true, message: '请填写持续时长' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请填写持续时长" addonAfter="秒" />
            </Form.Item>
          </div>
          <div className={`${styles.doubleRow} ${styles.fullWidth}`}>
            <Form.Item name="timeout" label="超时时间" style={{ flex: 1 }}>
              <Input placeholder="请填写超时时间" addonAfter="秒" />
            </Form.Item>
            <div style={{ flex: 1 }} />
          </div>
        </div>
      </div>
    </Form>
  );

  // ---- 按钮区域二右侧卡片 ----
  const billingCard = (
    <div className={styles.billingCard}>
      {/* 配置概要 */}
      <div className={styles.billingSection}>
        <div className={styles.billingSectionTitle}>配置概要</div>
        <div className={styles.billingRows}>
          <div className={styles.billingRow}>
            <span className={styles.billingLabel}>实例规格</span>
            <span className={styles.billingValue}>ML.hsnf.sf (16vCPU，16G，4090)</span>
          </div>
          <div className={styles.billingRow}>
            <span className={styles.billingLabel}>地域信息</span>
            <span className={styles.billingValue}>华北-内蒙、华北-北京</span>
          </div>
          <div className={styles.billingRow}>
            <span className={styles.billingLabel}>计费方式</span>
            <span className={styles.billingValue}>按资源规格预付费 (按月)</span>
          </div>
        </div>
      </div>

      {/* 分割线 */}
      <div className={styles.billingDivider} />

      {/* 费用预估 */}
      <div className={styles.billingFeeSection}>
        <div className={styles.billingFeeHeader}>
          <span className={styles.billingFeeTitleText}>费用预估</span>
          <span className={styles.billingFeeLink}>计费说明</span>
        </div>
        <div className={styles.billingFeeRow}>
          <span className={styles.billingLabel}>折合费用</span>
          <span className={styles.billingFeeAmount}>¥40.00/小时</span>
        </div>
      </div>

      {/* 提交按钮 */}
      <Button
        type="primary"
        block
        loading={submitting}
        onClick={handleSubmit}
      >
        提交
      </Button>
    </div>
  );

  return (
    <>
      {/* ===== 1. 面包屑（必有）===== */}
      <div className={styles.breadcrumb}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          size="small"
          className={styles.breadcrumbBack}
          onClick={handleCancel}
        />
        <Text className={styles.breadcrumbParent} onClick={handleCancel}>MCP 管理</Text>
        <span className={styles.breadcrumbSep}>/</span>
        <Text className={styles.breadcrumbCurrent}>新建 MCP 服务</Text>
      </div>

      {/* ===== 2 + 3. 表单区域 + 按钮区域二（billing 在右侧）===== */}
      {/* 外层 wrapper 提供左右 24px 安全间距，内层容器按规则居中 */}
      <div className={styles.pageContentWrapper}>
        <div
          className={styles.pageContent}
          style={{
            width: formLayout === 'single'
              ? (buttonVariant === 'billing' ? 860 : 520)
              : (buttonVariant === 'billing' ? 1340 : 1000),
            maxWidth: '100%',
            margin: '0 auto',
          }}
        >
          {/* 表单主体 */}
          <div className={styles.formArea}>
            {formLayout === 'single' ? singleColumnForm : doubleColumnForm}
          </div>

          {/* 按钮区域二：右侧卡片（billing 时展示） */}
          {buttonVariant === 'billing' && billingCard}
        </div>
      </div>

      {/* ===== 按钮区域一：底部居中横条（仅 normal 时展示）===== */}
      {buttonVariant === 'normal' && (
        <div className={styles.bottomBar}>
          <Space size={16}>
            <Button
              type="primary"
              style={{ width: 168 }}
              loading={submitting}
              onClick={handleSubmit}
            >
              下一步
            </Button>
            <Button
              style={{ width: 168 }}
              onClick={handleCancel}
            >
              取消
            </Button>
          </Space>
        </div>
      )}
    </>
  );
};

export default FormPage;

// ============================================================
// 使用示例：
// ============================================================
//
// import AppLayout from '../../02-templates/AppLayout/index';
// import FormPage from '../../02-templates/FormPage/index';
//
// // 普通表单（单列 + 底部按钮栏）
// <AppLayout selectedMenuKey="online-inference" activeTopNav="模型服务">
//   <FormPage formLayout="single" buttonVariant="normal" />
// </AppLayout>
//
// // 涉及费用（单列 + 右侧费用卡片）
// <AppLayout selectedMenuKey="online-inference" activeTopNav="模型服务">
//   <FormPage formLayout="single" buttonVariant="billing" />
// </AppLayout>
//
// // 双列布局
// <AppLayout selectedMenuKey="online-inference" activeTopNav="模型服务">
//   <FormPage formLayout="double" buttonVariant="normal" />
// </AppLayout>
