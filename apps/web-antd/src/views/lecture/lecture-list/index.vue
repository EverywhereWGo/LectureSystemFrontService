<script lang="ts" setup>
import { computed, h, onMounted, reactive, ref } from 'vue';

import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { Card, Table, Button, Space, Form, Input, Select, DatePicker, Row, Col, Divider, Modal, message, Tag } from 'ant-design-vue';
import type { TableColumnType } from 'ant-design-vue';
import dayjs from 'dayjs';

import { getLectureList, deleteLecture } from '../../../api/lecture';
import type { Lecture, LectureQuery } from '../../../api/lecture/model';
import type { PageResult } from '../../../api/common';

const loading = ref(false);
const total = ref(0);
const dataSource = ref<Lecture[]>([]);
const selectedRowKeys = ref<(string | number)[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  showTotal: (total: number) => `共 ${total} 条`,
  showQuickJumper: true,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
});

const queryParams = reactive<LectureQuery>({
  pageNum: 1,
  pageSize: 10,
  title: undefined,
  speaker: undefined,
  lectureType: undefined,
  status: undefined,
});

// 定义讲座状态的标签颜色映射
const statusTagColors = {
  draft: 'default',
  waiting: 'processing',
  finish: 'success',
  rejected: 'error',
  closed: 'warning',
};

const statusLabels = {
  draft: '草稿',
  waiting: '待审核',
  finish: '已发布',
  rejected: '已拒绝',
  closed: '已结束',
};

// 查看讲座详情
const viewLecture = (record: Lecture) => {
  message.info(`查看讲座：${record.title}`);
  // 这里可以跳转到详情页或打开详情抽屉/模态窗
};

// 编辑讲座
const editLecture = (record: Lecture) => {
  message.info(`编辑讲座：${record.title}`);
  // 这里可以跳转到编辑页或打开编辑抽屉/模态窗
};

// 确认删除
const confirmDelete = (ids: (string | number)[]) => {
  Modal.confirm({
    title: '删除确认',
    content: '确定要删除所选的讲座吗？删除后将无法恢复。',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteLecture(ids);
        message.success('删除成功');
        getList();
        selectedRowKeys.value = [];
      } catch (error) {
        console.error('删除失败', error);
        message.error('删除失败');
      }
    },
  });
};

// 表格列定义
const columns: TableColumnType<Lecture>[] = [
  {
    title: '讲座标题',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    width: 250,
  },
  {
    title: '主讲人',
    dataIndex: 'speaker',
    key: 'speaker',
    width: 120,
  },
  {
    title: '讲座类型',
    dataIndex: 'lectureTypeName',
    key: 'lectureTypeName',
    width: 120,
  },
  {
    title: '场地',
    dataIndex: 'venueName',
    key: 'venueName',
    width: 120,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    width: 170,
    customRender: ({ text }: { text: string }) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-'),
  },
  {
    title: '结束时间',
    dataIndex: 'endTime', 
    key: 'endTime',
    width: 170,
    customRender: ({ text }: { text: string }) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    customRender: ({ text }: { text: string }) => {
      const color = statusTagColors[text as keyof typeof statusTagColors] || 'default';
      const label = statusLabels[text as keyof typeof statusLabels] || text;
      return h(Tag, { color }, () => label);
    },
  },
  {
    title: '操作',
    key: 'operation',
    width: 180,
    fixed: 'right' as const,
    customRender: ({ record }: { record: Lecture }) => {
      return h(Space, {}, {
        default: () => [
          h(Button, {
            type: 'link',
            size: 'small',
            onClick: () => viewLecture(record),
          }, {
            default: () => [h(EyeOutlined), '查看']
          }),
          h(Button, {
            type: 'link',
            size: 'small',
            onClick: () => editLecture(record),
          }, {
            default: () => [h(EditOutlined), '编辑']
          }),
          h(Button, {
            type: 'link',
            danger: true,
            size: 'small',
            onClick: () => confirmDelete([record.lectureId]),
          }, {
            default: () => [h(DeleteOutlined), '删除']
          }),
        ]
      });
    },
  },
];

// 多选配置
const rowSelection = {
  onChange: (keys: (string | number)[]) => {
    selectedRowKeys.value = keys;
  },
};

// 查询讲座列表
const getList = async () => {
  try {
    loading.value = true;
    queryParams.pageNum = pagination.current;
    queryParams.pageSize = pagination.pageSize;
    
    console.log('Fetching lecture list with params:', queryParams);
    
    const response = await getLectureList(queryParams);
    console.log('API response:', response);
    
    dataSource.value = response.rows;
    total.value = response.total;
    pagination.current = queryParams.pageNum!;
    pagination.pageSize = queryParams.pageSize!;
  } catch (error: any) {
    console.error('获取讲座列表失败', error);
    // 检查错误对象，获取更详细的错误信息
    if (error.response) {
      // 服务器响应了，但状态码不是2xx
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      message.error(`获取讲座列表失败: ${error.response.data?.msg || error.message}`);
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('No response received from server');
      message.error('服务器没有响应，请检查网络连接');
    } else {
      // 请求设置时出错
      message.error(`获取讲座列表失败: ${error.message}`);
    }
  } finally {
    loading.value = false;
  }
};

// 表格变更事件
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  getList();
};

// 重置查询
const resetQuery = () => {
  Object.assign(queryParams, {
    pageNum: 1,
    pageSize: 10,
    title: undefined,
    speaker: undefined,
    lectureType: undefined,
    status: undefined,
  });
  pagination.current = 1;
  getList();
};

// 批量删除
const batchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请至少选择一条记录');
    return;
  }
  confirmDelete(selectedRowKeys.value);
};

// 新增讲座
const addLecture = () => {
  message.info('新增讲座');
  // 这里可以跳转到新增页或打开新增抽屉/模态窗
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="lecture-list-container">
    <!-- 查询和操作区域 -->
    <Card bordered class="mb-4 query-card">
      <Form layout="horizontal" :model="queryParams">
        <Row :gutter="16">
          <Col :span="6">
            <Form.Item label="讲座标题" name="title">
              <Input v-model:value="queryParams.title" placeholder="请输入讲座标题" allowClear />
            </Form.Item>
          </Col>
          <Col :span="6">
            <Form.Item label="主讲人" name="speaker">
              <Input v-model:value="queryParams.speaker" placeholder="请输入主讲人" allowClear />
            </Form.Item>
          </Col>
          <Col :span="6">
            <Form.Item label="讲座类型" name="lectureType">
              <Select v-model:value="queryParams.lectureType" placeholder="请选择讲座类型" allowClear>
                <Select.Option value="academic">学术讲座</Select.Option>
                <Select.Option value="career">职业发展</Select.Option>
                <Select.Option value="culture">文化艺术</Select.Option>
                <Select.Option value="technology">科技创新</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col :span="6">
            <Form.Item label="状态" name="status">
              <Select v-model:value="queryParams.status" placeholder="请选择状态" allowClear>
                <Select.Option value="draft">草稿</Select.Option>
                <Select.Option value="waiting">待审核</Select.Option>
                <Select.Option value="finish">已发布</Select.Option>
                <Select.Option value="rejected">已拒绝</Select.Option>
                <Select.Option value="closed">已结束</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col :span="24" class="text-right">
            <Space>
              <Button type="primary" @click="getList">
                <SearchOutlined /> 查询
              </Button>
              <Button @click="resetQuery">
                <ReloadOutlined /> 重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>

    <!-- 数据表格 -->
    <Card title="讲座列表" bordered class="table-card">
      <template #extra>
        <Space>
          <Button type="primary" @click="addLecture">
            <PlusOutlined /> 新增
          </Button>
          <Button danger :disabled="selectedRowKeys.length === 0" @click="batchDelete">
            <DeleteOutlined /> 批量删除
          </Button>
        </Space>
      </template>

      <Table
        :dataSource="dataSource"
        :columns="columns"
        :pagination="pagination"
        :loading="loading"
        :rowKey="(record: Lecture) => record.lectureId"
        :row-selection="{ selectedRowKeys, onChange: rowSelection.onChange }"
        @change="handleTableChange"
        bordered
        size="middle"
        :scroll="{ x: 1300 }"
      >
      </Table>
    </Card>
  </div>
</template>

<style scoped>
.lecture-list-container {
  padding: 16px;
  background-color: #f0f2f5;
}

.query-card {
  margin-bottom: 16px;
}

.table-card {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.text-right {
  text-align: right;
  padding: 8px 0;
}
</style>
