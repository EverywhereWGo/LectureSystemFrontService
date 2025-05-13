<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { Card, Form, Input, Button, Select, message, Spin, DatePicker } from 'ant-design-vue';
import { SaveOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import type { Rule } from 'ant-design-vue/es/form';

import { addNotificationApi } from '../../../api/lecture/notification';
import { userList } from '../../../api/system/user';
import { getHotRecommendApi } from '../../../api/lecture/recommend';

const router = useRouter();
const formRef = ref();
const loading = ref(false);
const submitting = ref(false);

// 讲座列表
const lectureOptions = ref<any[]>([]);
const loadingLectures = ref(false);

// 用户列表
const userOptions = ref<any[]>([]);
const loadingUsers = ref(false);

// 表单数据
const formData = reactive({
  title: '',
  content: '',
  type: 'system',
  lectureId: undefined,
  receiverIds: [] as number[], // 接收者用户ID列表
  sendTime: undefined // 默认为undefined，后端会自动使用当前时间
});

// 表单规则
const rules = {
  title: [{ required: true, message: '请输入通知标题', trigger: 'blur' } as Rule],
  content: [{ required: true, message: '请输入通知内容', trigger: 'blur' } as Rule],
  type: [{ required: true, message: '请选择通知类型', trigger: 'change' } as Rule],
  receiverIds: [{ required: true, message: '请选择接收者', trigger: 'change', type: 'array' } as Rule]
};

// 通知类型选项
const typeOptions = [
  { label: '系统通知', value: 'system' },
  { label: '讲座通知', value: 'lecture' }
];

// 是否显示讲座选择
const showLectureSelect = computed(() => {
  return formData.type === 'lecture';
});

// 加载讲座列表
const loadLectures = async () => {
  loadingLectures.value = true;
  try {
    const res = await getHotRecommendApi({ limit: 100 });
    if (res.code === 200) {
      lectureOptions.value = (res.rows || []).map((item: any) => ({
        label: item.title,
        value: item.lectureId
      }));
    }
  } catch (error) {
    console.error('获取讲座列表失败', error);
  } finally {
    loadingLectures.value = false;
  }
};

// 加载用户列表
const loadUsers = async () => {
  loadingUsers.value = true;
  try {
    const res = await userList({ pageSize: 100 });
    if (res) {
      userOptions.value = (res.rows || []).map((item: any) => ({
        label: `${item.nickName} (${item.userName})`,
        value: item.userId
      }));
    }
  } catch (error) {
    console.error('获取用户列表失败', error);
  } finally {
    loadingUsers.value = false;
  }
};

// 处理类型变更
const handleTypeChange = (value: any) => {
  formData.type = value;
  if (value === 'lecture' && lectureOptions.value.length === 0) {
    loadLectures();
  }
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    submitting.value = true;
    
    // 构建提交数据
    const submitData = {
      ...formData
    };
    
    const res = await addNotificationApi(submitData);
    if (res.code === 200) {
      message.success('发布通知成功');
      router.push('/lecture/notification');
    } else {
      message.error(res.msg || '发布通知失败');
    }
  } catch (error) {
    console.error('发布通知失败', error);
  } finally {
    submitting.value = false;
  }
};

// 取消操作
const handleCancel = () => {
  router.push('/lecture/notification');
};

// 重置表单
const resetForm = () => {
  formRef.value.resetFields();
};

onMounted(() => {
  // 加载用户列表
  loadUsers();
});
</script>

<template>
  <div class="notification-create-container">
    <Card :bordered="false" class="notification-create-card">
      <template #title>
        <span>发布通知</span>
      </template>
      
      <Spin :spinning="loading">
        <Form
          ref="formRef"
          :model="formData"
          :rules="rules"
          class="notification-form"
        >
          <Form.Item label="通知标题" name="title">
            <Input v-model:value="formData.title" placeholder="请输入通知标题" :maxlength="100" />
          </Form.Item>
          
          <Form.Item label="通知类型" name="type">
            <Select
              v-model:value="formData.type"
              placeholder="请选择通知类型"
              @change="handleTypeChange"
            >
              <Select.Option v-for="option in typeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item v-if="showLectureSelect" label="相关讲座" name="lectureId">
            <Select
              v-model:value="formData.lectureId"
              placeholder="请选择相关讲座"
              :loading="loadingLectures"
              allowClear
            >
              <Select.Option v-for="option in lectureOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="接收者" name="receiverIds">
            <Select
              v-model:value="formData.receiverIds"
              placeholder="请选择接收者"
              :loading="loadingUsers"
              mode="multiple"
            >
              <Select.Option v-for="option in userOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="通知内容" name="content">
            <Input.TextArea 
              v-model:value="formData.content" 
              placeholder="请输入通知内容" 
              :rows="6" 
              :maxlength="500"
              showCount
            />
          </Form.Item>
          
          <Form.Item label="发送时间" name="sendTime">
            <DatePicker 
              v-model:value="formData.sendTime" 
              showTime 
              placeholder="不选择则使用当前时间"
              style="width: 100%"
              allowClear
            />
          </Form.Item>
          
          <Form.Item>
            <div class="form-actions">
              <Button type="primary" @click="handleSubmit" :loading="submitting">
                <SendOutlined /> 发送通知
              </Button>
              <Button @click="resetForm">
                <SaveOutlined /> 重置
              </Button>
              <Button @click="handleCancel">
                <CloseOutlined /> 取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  </div>
</template>

<style lang="less" scoped>
.notification-create-container {
  padding: 16px;
  
  .notification-create-card {
    margin-bottom: 16px;
  }
  
  .notification-form {
    max-width: 800px;
    margin: 0 auto;
    
    .form-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 24px;
    }
  }
}
</style> 