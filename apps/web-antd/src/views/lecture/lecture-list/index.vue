<script lang="ts" setup>
import { ref } from 'vue';

import { Card, Table } from 'ant-design-vue';

const dataSource = ref([
  {
    key: '1',
    title: '2023年度学术讲座',
    speaker: '张教授',
    date: '2023-05-15',
    venue: '大礼堂',
    status: '已完成',
  },
  {
    key: '2',
    title: '人工智能发展前沿',
    speaker: '李研究员',
    date: '2023-06-20',
    venue: '科技报告厅',
    status: '已发布',
  },
  {
    key: '3',
    title: '数据科学与应用',
    speaker: '王博士',
    date: '2023-07-10',
    venue: '理学院报告厅',
    status: '待审核',
  },
]);

const columns = [
  {
    title: '讲座标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '主讲人',
    dataIndex: 'speaker',
    key: 'speaker',
  },
  {
    title: '讲座日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '讲座地点',
    dataIndex: 'venue',
    key: 'venue',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
];
</script>

<template>
  <Card title="讲座列表" class="mb-4">
    <p>这里是讲座列表页面，您可以在此管理所有讲座信息。</p>
    <p>即将开发的功能包括：</p>
    <ul>
      <li>讲座列表展示</li>
      <li>讲座新增/编辑/删除</li>
      <li>讲座审批流程</li>
      <li>讲座发布/撤销</li>
    </ul>
    <Table :data-source="dataSource" :columns="columns" />
  </Card>
</template>
