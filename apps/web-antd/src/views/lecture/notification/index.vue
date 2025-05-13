<script setup lang="ts">
import { ref, reactive, onMounted, computed, createVNode, h } from 'vue';
import { Card, Tabs, List, Badge, Tag, Button, Spin, Empty, Modal, message } from 'ant-design-vue';
import { 
  BellOutlined, 
  InfoCircleOutlined, 
  DeleteOutlined, 
  CheckOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

import { 
  getUserNotificationsApi, 
  markNotificationReadApi, 
  deleteNotificationApi, 
  getUnreadNotificationCountApi,
  getNotificationDetailApi
} from '../../../api/lecture/notification';

// 通知类型枚举
enum NotificationType {
  SYSTEM = 'system',
  LECTURE = 'lecture'
}

const TabPane = Tabs.TabPane;
const activeTab = ref('all');
const loading = ref(false);
const detailModal = ref(false);
const router = useRouter();

// 当前选中的通知
const currentNotification = ref<any>(null);

// 通知列表
const notifications = reactive({
  loading: false,
  data: [] as any[],
  pageNum: 1,
  pageSize: 10,
  total: 0
});

// 统计数据
const stats = reactive({
  total: 0,
  unread: 0
});

// 计算未读通知列表
const unreadNotifications = computed(() => {
  return notifications.data.filter(item => item.isRead === 'N');
});

// 计算已读通知列表
const readNotifications = computed(() => {
  return notifications.data.filter(item => item.isRead === 'Y');
});

// 切换选项卡
const handleTabChange = (key: any) => {
  activeTab.value = key as string;
  loadNotifications();
};

// 获取通知类型图标
const getNotificationIcon = (type: string) => {
  switch (type) {
    case NotificationType.LECTURE:
      return InfoCircleOutlined;
    case NotificationType.SYSTEM:
      return BellOutlined;
    default:
      return BellOutlined;
  }
};

// 获取通知类型标签
const getNotificationTag = (type: string) => {
  switch (type) {
    case NotificationType.LECTURE:
      return { color: 'blue', text: '讲座通知' };
    case NotificationType.SYSTEM:
      return { color: 'purple', text: '系统通知' };
    default:
      return { color: 'default', text: '其他通知' };
  }
};

// 获取图标颜色
const getIconColor = (type: string) => {
  switch (type) {
    case NotificationType.LECTURE:
      return "#1890ff";
    case NotificationType.SYSTEM:
      return "#722ed1";
    default:
      return "#1890ff";
  }
};

// 查看通知详情
const viewNotificationDetail = async (notification: any) => {
  try {
    const res = await getNotificationDetailApi(notification.notificationId);
    if (res.code === 200) {
      currentNotification.value = res.data;
      detailModal.value = true;
      
      // 如果未读，标记为已读
      if (notification.isRead === 'N') {
        markNotificationRead(notification.notificationId);
      }
    }
  } catch (error) {
    console.error('获取通知详情失败', error);
    message.error('获取通知详情失败');
  }
};

// 标记通知为已读
const markNotificationRead = async (notificationId: number) => {
  try {
    const res = await markNotificationReadApi(notificationId);
    if (res.code === 200) {
      // 更新本地数据
      const index = notifications.data.findIndex(item => item.notificationId === notificationId);
      if (index !== -1) {
        notifications.data[index].isRead = 'Y';
      }
      
      // 更新统计数据
      if (stats.unread > 0) {
        stats.unread--;
      }
      
      // 如果在未读标签页，刷新列表
      if (activeTab.value === 'unread') {
        loadNotifications();
      }
    }
  } catch (error) {
    console.error('标记通知已读失败', error);
  }
};

// 删除通知
const deleteNotification = (notificationId: number) => {
  Modal.confirm({
    title: '确认删除',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要删除此通知吗？删除后无法恢复。',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteNotificationApi([notificationId]);
        if (res.code === 200) {
          // 更新本地数据
          const index = notifications.data.findIndex(item => item.notificationId === notificationId);
          if (index !== -1) {
            const isUnread = notifications.data[index].isRead === 'N';
            notifications.data.splice(index, 1);
            
            // 更新统计数据
            stats.total--;
            if (isUnread && stats.unread > 0) {
              stats.unread--;
            }
          }
          
          message.success('删除成功');
          
          // 如果是在详情模态框中删除，则关闭模态框
          if (detailModal.value && currentNotification.value?.notificationId === notificationId) {
            detailModal.value = false;
          }
        }
      } catch (error) {
        console.error('删除通知失败', error);
        message.error('删除失败，请稍后重试');
      }
    },
  });
};

// 跳转到相关页面
const goToTarget = (notification: any) => {
  if (!notification.lectureId) {
    return;
  }
  
  router.push(`/lecture/lecture/detail/${notification.lectureId}`);
  
  // 关闭详情模态框
  detailModal.value = false;
};

// 创建新通知
const createNotification = () => {
  router.push('/lecture/notification/create');
};

// 格式化日期时间
const formatToDateTime = (date?: string | Date | null) => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

// 加载通知列表
const loadNotifications = async () => {
  notifications.loading = true;
  try {
    const params: Record<string, any> = {
      pageNum: notifications.pageNum,
      pageSize: notifications.pageSize
    };
    
    // 根据当前标签页筛选
    if (activeTab.value === 'unread') {
      params.isRead = 'N';
    } else if (activeTab.value === 'read') {
      params.isRead = 'Y';
    }
    
    const res = await getUserNotificationsApi(params);
    
    if (res.code === 200) {
      notifications.data = res.rows || [];
      notifications.total = res.total || 0;
      stats.total = res.total || 0;
    }
  } catch (error) {
    console.error('获取通知列表失败', error);
  } finally {
    notifications.loading = false;
  }
};

// 加载未读通知数量
const loadUnreadCount = async () => {
  try {
    const res = await getUnreadNotificationCountApi();
    if (res.code === 200) {
      stats.unread = res.data || 0;
    }
  } catch (error) {
    console.error('获取未读通知数量失败', error);
  }
};

onMounted(() => {
  loadNotifications();
  loadUnreadCount();
});
</script>

<template>
  <div class="notification-container">
    <Card :bordered="false" class="notification-card">
      <template #title>
        <div class="card-title">
          <span><BellOutlined /> 我的通知</span>
          <div class="card-actions">
            <div class="notification-stats">
              <Badge :count="stats.unread" :offset="[0, 0]" />
              <span class="stats-label">未读通知</span>
            </div>
            <Button type="primary" @click="createNotification">
              <PlusOutlined /> 发布通知
            </Button>
          </div>
        </div>
      </template>
      
      <Tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <TabPane key="all" :tab="`全部通知(${stats.total})`">
          <Spin :spinning="notifications.loading">
            <div class="notification-list">
              <Empty v-if="notifications.data.length === 0" description="暂无通知" />
              <List 
                v-else
                itemLayout="horizontal" 
                :dataSource="notifications.data"
              >
                <template #renderItem="{ item }">
                  <List.Item class="notification-item">
                    <List.Item.Meta
                      :avatar="h(getNotificationIcon(item.type), { style: { color: getIconColor(item.type) } })"
                      :title="item.title"
                      :description="item.content"
                      @click="viewNotificationDetail(item)"
                    />
                    <div class="notification-meta">
                      <div>
                        <Badge v-if="item.isRead === 'N'" dot color="red" />
                        <Tag :color="getNotificationTag(item.type).color">
                          {{ getNotificationTag(item.type).text }}
                        </Tag>
                      </div>
                      <span>{{ formatToDateTime(item.createTime) }}</span>
                    </div>
                    <div class="notification-actions">
                      <Button 
                        v-if="item.isRead === 'N'"
                        type="link" 
                        @click.stop="markNotificationRead(item.notificationId)"
                      >
                        <CheckOutlined />
                      </Button>
                      <Button 
                        type="text" 
                        danger
                        @click.stop="deleteNotification(item.notificationId)"
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </List.Item>
                </template>
              </List>
            </div>
          </Spin>
        </TabPane>
        
        <TabPane key="unread" :tab="`未读通知(${stats.unread})`">
          <Spin :spinning="notifications.loading">
            <div class="notification-list">
              <Empty v-if="unreadNotifications.length === 0" description="暂无未读通知" />
              <List 
                v-else
                itemLayout="horizontal" 
                :dataSource="unreadNotifications"
              >
                <template #renderItem="{ item }">
                  <List.Item class="notification-item">
                    <List.Item.Meta
                      :avatar="h(getNotificationIcon(item.type), { style: { color: getIconColor(item.type) } })"
                      :title="item.title"
                      :description="item.content"
                      @click="viewNotificationDetail(item)"
                    />
                    <div class="notification-meta">
                      <div>
                        <Badge dot color="red" />
                        <Tag :color="getNotificationTag(item.type).color">
                          {{ getNotificationTag(item.type).text }}
                        </Tag>
                      </div>
                      <span>{{ formatToDateTime(item.createTime) }}</span>
                    </div>
                    <div class="notification-actions">
                      <Button 
                        type="link" 
                        @click.stop="markNotificationRead(item.notificationId)"
                      >
                        <CheckOutlined />
                      </Button>
                      <Button 
                        type="text" 
                        danger
                        @click.stop="deleteNotification(item.notificationId)"
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </List.Item>
                </template>
              </List>
            </div>
          </Spin>
        </TabPane>
        
        <TabPane key="read" :tab="`已读通知(${stats.total - stats.unread})`">
          <Spin :spinning="notifications.loading">
            <div class="notification-list">
              <Empty v-if="readNotifications.length === 0" description="暂无已读通知" />
              <List 
                v-else
                itemLayout="horizontal" 
                :dataSource="readNotifications"
              >
                <template #renderItem="{ item }">
                  <List.Item class="notification-item">
                    <List.Item.Meta
                      :avatar="h(getNotificationIcon(item.type), { style: { color: getIconColor(item.type) } })"
                      :title="item.title"
                      :description="item.content"
                      @click="viewNotificationDetail(item)"
                    />
                    <div class="notification-meta">
                      <div>
                        <Tag :color="getNotificationTag(item.type).color">
                          {{ getNotificationTag(item.type).text }}
                        </Tag>
                      </div>
                      <span>{{ formatToDateTime(item.createTime) }}</span>
                    </div>
                    <div class="notification-actions">
                      <Button 
                        type="text" 
                        danger
                        @click.stop="deleteNotification(item.notificationId)"
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </List.Item>
                </template>
              </List>
            </div>
          </Spin>
        </TabPane>
      </Tabs>
    </Card>
    
    <!-- 通知详情模态框 -->
    <Modal
      v-model:visible="detailModal"
      title="通知详情"
      :footer="null"
      width="700px"
    >
      <div v-if="currentNotification" class="notification-detail">
        <div class="detail-header">
          <h2 class="detail-title">{{ currentNotification.title }}</h2>
          <div class="detail-meta">
            <Tag :color="getNotificationTag(currentNotification.type).color">
              {{ getNotificationTag(currentNotification.type).text }}
            </Tag>
            <span class="detail-time">{{ formatToDateTime(currentNotification.createTime) }}</span>
          </div>
        </div>
        
        <div class="detail-content">
          <p>{{ currentNotification.content }}</p>
        </div>
        
        <div v-if="currentNotification.lectureId" class="detail-actions">
          <Button type="primary" @click="goToTarget(currentNotification)">
            查看相关讲座
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style lang="less" scoped>
.notification-container {
  padding: 16px;
  
  .notification-card {
    margin-bottom: 16px;
    
    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .card-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .notification-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .stats-label {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
          }
        }
      }
    }
  }
  
  .notification-list {
    margin-top: 8px;
    
    .notification-item {
      cursor: pointer;
      padding: 16px;
      transition: background-color 0.3s;
      border-radius: 4px;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
      
      .notification-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        margin-right: 16px;
      }
      
      .notification-actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }
  }
  
  .notification-detail {
    .detail-header {
      margin-bottom: 24px;
      
      .detail-title {
        margin-bottom: 8px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
      }
      
      .detail-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        color: rgba(0, 0, 0, 0.45);
        
        .detail-time {
          font-size: 14px;
        }
      }
    }
    
    .detail-content {
      margin-bottom: 24px;
      font-size: 16px;
      line-height: 1.6;
      color: rgba(0, 0, 0, 0.65);
    }
    
    .detail-actions {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }
  }
}
</style> 