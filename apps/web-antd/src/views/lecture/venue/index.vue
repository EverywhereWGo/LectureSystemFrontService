<script lang="ts" setup>
import { h, onMounted, reactive, ref } from 'vue';

import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { Card, Table, Button, Space, Form, Input, Select, Row, Col, Modal, message, Tag } from 'ant-design-vue';
import type { TableColumnType } from 'ant-design-vue';

import { getVenueList, deleteVenue } from '../../../api/lecture';
import type { Venue, VenueQuery } from '../../../api/lecture/model';
import type { PageResult } from '../../../api/common';

const loading = ref(false);
const total = ref(0);
const dataSource = ref<Venue[]>([]);
const selectedRowKeys = ref<(string | number)[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  showTotal: (total: number) => `共 ${total} 条`,
  showQuickJumper: true,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
});

const queryParams = reactive<VenueQuery>({
  pageNum: 1,
  pageSize: 10,
  venueName: undefined,
  status: undefined,
});

// 场地状态标签颜色
const statusTagColors = {
  normal: 'success',
  maintenance: 'warning',
  disabled: 'error',
};

const statusLabels = {
  normal: '正常',
  maintenance: '维护中',
  disabled: '停用',
};

// 查看场地详情
const viewVenue = (record: Venue) => {
  message.info(`查看场地：${record.venueName}`);
  // 这里可以跳转到详情页或打开详情抽屉/模态窗
};

// 编辑场地
const editVenue = (record: Venue) => {
  message.info(`编辑场地：${record.venueName}`);
  // 这里可以跳转到编辑页或打开编辑抽屉/模态窗
};

// 确认删除
const confirmDelete = (ids: (string | number)[]) => {
  Modal.confirm({
    title: '删除确认',
    content: '确定要删除所选的场地吗？删除后将无法恢复。',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteVenue(ids);
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

// 管理场地设备
const manageEquipment = (record: Venue) => {
  message.info(`管理场地设备：${record.venueName}`);
  // 这里可以跳转到设备管理页或打开设备管理抽屉/模态窗
};

// 表格列定义
const columns: TableColumnType<Venue>[] = [
  {
    title: '场地名称',
    dataIndex: 'venueName',
    key: 'venueName',
    ellipsis: true,
    width: 200,
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
    width: 250,
  },
  {
    title: '容量',
    dataIndex: 'capacity',
    key: 'capacity',
    width: 100,
    customRender: ({ text }: { text: number }) => `${text} 人`,
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
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    width: 250,
  },
  {
    title: '操作',
    key: 'operation',
    width: 250,
    fixed: 'right' as const,
    customRender: ({ record }: { record: Venue }) => {
      return h(Space, {}, {
        default: () => [
          h(Button, {
            type: 'link',
            size: 'small',
            onClick: () => viewVenue(record),
          }, {
            default: () => [h(InfoCircleOutlined), '查看']
          }),
          h(Button, {
            type: 'link',
            size: 'small',
            onClick: () => editVenue(record),
          }, {
            default: () => [h(EditOutlined), '编辑']
          }),
          h(Button, {
            type: 'link',
            size: 'small',
            onClick: () => manageEquipment(record),
          }, {
            default: () => [h(SettingOutlined), '设备']
          }),
          h(Button, {
            type: 'link',
            danger: true,
            size: 'small',
            onClick: () => confirmDelete([record.venueId]),
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

// 查询场地列表
const getList = async () => {
  try {
    loading.value = true;
    queryParams.pageNum = pagination.current;
    queryParams.pageSize = pagination.pageSize;
    
    const { rows, total: totalCount } = await getVenueList(queryParams);
    dataSource.value = rows;
    total.value = totalCount;
    pagination.current = queryParams.pageNum!;
    pagination.pageSize = queryParams.pageSize!;
  } catch (error) {
    console.error('获取场地列表失败', error);
    message.error('获取场地列表失败');
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
    venueName: undefined,
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

// 新增场地
const addVenue = () => {
  message.info('新增场地');
  // 这里可以跳转到新增页或打开新增抽屉/模态窗
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="venue-list-container">
    <!-- 查询和操作区域 -->
    <Card bordered class="mb-4 query-card">
      <Form layout="horizontal" :model="queryParams">
        <Row :gutter="16">
          <Col :span="8">
            <Form.Item label="场地名称" name="venueName">
              <Input v-model:value="queryParams.venueName" placeholder="请输入场地名称" allowClear />
            </Form.Item>
          </Col>
          <Col :span="8">
            <Form.Item label="状态" name="status">
              <Select v-model:value="queryParams.status" placeholder="请选择状态" allowClear>
                <Select.Option value="normal">正常</Select.Option>
                <Select.Option value="maintenance">维护中</Select.Option>
                <Select.Option value="disabled">停用</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col :span="8" class="text-right">
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
    <Card title="场地列表" bordered class="table-card">
      <template #extra>
        <Space>
          <Button type="primary" @click="addVenue">
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
        :rowKey="(record: Venue) => record.venueId"
        :row-selection="{ selectedRowKeys, onChange: rowSelection.onChange }"
        @change="handleTableChange"
        bordered
        size="middle"
        :scroll="{ x: 1200 }"
      >
      </Table>
    </Card>
  </div>
</template>

<style scoped>
.venue-list-container {
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
}
</style>
