<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { Card, Tabs, List, Badge, Tag, Button, Spin, Empty, Modal, message, Tooltip } from 'ant-design-vue';
import { 
  BellOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  InfoCircleOutlined, 
  WarningOutlined, 
  DeleteOutlined, 
  CheckOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import { formatToDateTime } from '@/utils/dateUtil';
import { useGo } from '@/hooks/web/usePage';
import { useUserStore } from '@/store/modules/user';
import { 
  getNotificationsApi, 
  markNotificationReadApi, 
  markAllNotificationsReadApi, 
  deleteNotificationApi, 
  getNotificationStatsApi,
  NotificationType
} from '@/api/lecture/notification';

const TabPane = Tabs.TabPane;
const activeTab = ref('all');
const loading = ref(false);
const detailModal = ref(false);
const go = useGo();
const userStore = useUserStore();

// 用户数据
const userData = reactive({
  userId: userStore.getUserInfo?.userId || 1001,
  username: userStore.getUserInfo?.username || '张三',
});

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
  unread: 0,
  today: 0,
  expired: 0
});

// 计算未读通知列表
const unreadNotifications = computed(() => {
  return notifications.data.filter(item => !item.readStatus);
});

// 计算已读通知列表
const readNotifications = computed(() => {
  return notifications.data.filter(item => item.readStatus);
});

// 切换选项卡
const handleTabChange = (key: string) => {
  activeTab.value = key;
};

// 获取通知类型图标
const getNotificationIcon = (type: string) => {
  switch (type) {
    case NotificationType.LECTURE_REMINDER:
    case NotificationType.CHECK_IN_REMINDER:
      return <InfoCircleOutlined style="color: #1890ff" />;
    case NotificationType.RESERVATION_SUCCESS:
      return <CheckCircleOutlined style="color: #52c41a" />;
    case NotificationType.RESERVATION_CANCEL:
    case NotificationType.LECTURE_CANCEL:
      return <CloseCircleOutlined style="color: #f5222d" />;
    case NotificationType.LECTURE_CHANGE:
      return <WarningOutlined style="color: #faad14" />;
    case NotificationType.FEEDBACK_REMINDER:
      return <BellOutlined style="color: #722ed1" />;
    default:
      return <BellOutlined style="color: #1890ff" />;
  }
};

// 获取通知类型标签
const getNotificationTag = (type: string) => {
  switch (type) {
    case NotificationType.LECTURE_REMINDER:
      return { color: 'blue', text: '讲座提醒' };
    case NotificationType.CHECK_IN_REMINDER:
      return { color: 'geekblue', text: '签到提醒' };
    case NotificationType.RESERVATION_SUCCESS:
      return { color: 'green', text: '预约成功' };
    case NotificationType.RESERVATION_CANCEL:
      return { color: 'orange', text: '预约取消' };
    case NotificationType.LECTURE_CANCEL:
      return { color: 'red', text: '讲座取消' };
    case NotificationType.LECTURE_CHANGE:
      return { color: 'gold', text: '讲座变更' };
    case NotificationType.FEEDBACK_REMINDER:
      return { color: 'purple', text: '反馈提醒' };
    default:
      return { color: 'default', text: '系统通知' };
  }
};

// 获取通知优先级样式
const getPriorityStyle = (priority: number) => {
  switch (priority) {
    case 3:
      return { color: '#f5222d', text: '高' };
    case 2:
      return { color: '#faad14', text: '中' };
    case 1:
    default:
      return { color: '#52c41a', text: '低' };
  }
};

// 查看通知详情
const viewNotificationDetail = (notification: any) => {
  currentNotification.value = notification;
  detailModal.value = true;
  
  // 如果未读，标记为已读
  if (!notification.readStatus) {
    markNotificationRead(notification.id);
  }
};

// 标记通知为已读
const markNotificationRead = async (id: number) => {
  try {
    const res = await markNotificationReadApi(id);
    if (res.code === 200) {
      // 更新本地数据
      const index = notifications.data.findIndex(item => item.id === id);
      if (index !== -1) {
        notifications.data[index].readStatus = true;
      }
      
      // 更新统计数据
      if (stats.unread > 0) {
        stats.unread--;
      }
    }
  } catch (error) {
    console.error('标记通知已读失败', error);
  }
};

// 标记所有通知为已读
const markAllRead = async () => {
  if (stats.unread === 0) {
    message.info('没有未读通知');
    return;
  }
  
  try {
    const res = await markAllNotificationsReadApi(userData.userId);
    if (res.code === 200) {
      // 更新本地数据
      notifications.data.forEach(item => {
        item.readStatus = true;
      });
      
      // 更新统计数据
      stats.unread = 0;
      
      message.success('已将所有通知标记为已读');
    }
  } catch (error) {
    console.error('标记所有通知已读失败', error);
    message.error('操作失败，请稍后重试');
  }
};

// 删除通知
const deleteNotification = (id: number) => {
  Modal.confirm({
    title: '确认删除',
    icon: <ExclamationCircleOutlined />,
    content: '确定要删除此通知吗？删除后无法恢复。',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteNotificationApi(id);
        if (res.code === 200) {
          // 更新本地数据
          const index = notifications.data.findIndex(item => item.id === id);
          if (index !== -1) {
            const isUnread = !notifications.data[index].readStatus;
            notifications.data.splice(index, 1);
            
            // 更新统计数据
            stats.total--;
            if (isUnread && stats.unread > 0) {
              stats.unread--;
            }
          }
          
          message.success('删除成功');
          
          // 如果是在详情模态框中删除，则关闭模态框
          if (detailModal.value && currentNotification.value?.id === id) {
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
  if (!notification.targetId || !notification.targetType) {
    return;
  }
  
  switch (notification.targetType) {
    case 'lecture':
      go(`/lecture/lecture/detail/${notification.targetId}`);
      break;
    case 'check-in':
      go('/lecture/check-in');
      break;
    case 'reservation':
      go('/lecture/reservation');
      break;
    case 'feedback':
      go('/lecture/feedback');
      break;
    default:
      break;
  }
  
  // 关闭详情模态框
  detailModal.value = false;
};

// 检查通知是否已过期
const isExpired = (expireTime: string) => {
  if (!expireTime) return false;
  return new Date(expireTime) < new Date();
};

// 加载通知列表
const loadNotifications = async () => {
  notifications.loading = true;
  try {
    const res = await getNotificationsApi({
      userId: userData.userId,
      pageNum: notifications.pageNum,
      pageSize: notifications.pageSize
    });
    
    if (res.code === 200) {
      if (res.data && res.data.rows) {
        notifications.data = res.data.rows;
        notifications.total = res.data.total;
      } else {
        notifications.data = res.data || [];
      }
    }
  } catch (error) {
    console.error('获取通知列表失败', error);
  } finally {
    notifications.loading = false;
  }
};

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getNotificationStatsApi(userData.userId);
    if (res.code === 200) {
      stats.total = res.data.total;
      stats.unread = res.data.unread;
      stats.today = res.data.today;
      stats.expired = res.data.expired;
    }
  } catch (error) {
    console.error('获取通知统计数据失败', error);
  }
};

onMounted(() => {
  loadNotifications();
  loadStats();
});
</script>

<template>
  <div class="notification-container">
    <Card :bordered="false" class="notification-card">
      <template #title>
        <div class="card-title">
          <span><BellOutlined /> 我的通知</span>
          <div class="notification-stats">
            <Badge :count="stats.unread" :offset="[0, 0]" />
            <span class="stats-label">未读通知</span>
            <Badge :count="stats.today" :offset="[0, 0]" showZero />
            <span class="stats-label">今日通知</span>
          </div>
        </div>
      </template>
      <template #extra>
        <Button type="primary" @click="markAllRead">
          <template #icon><CheckOutlined /></template>
          全部已读
        </Button>
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
                      :avatar="getNotificationIcon(item.type)"
                      :title="
                        <div class='notification-title' @click='viewNotificationDetail(item)'>
                          <Badge :dot='!item.readStatus' color='red' />
                          <span>{{ item.title }}</span>
                          <Tag v-if='isExpired(item.expireTime)' color='default'>已过期</Tag>
                        </div>
                      "
                      :description="
                        <div class='notification-content'>
                          <div class='notification-text'>{{ item.content }}</div>
                          <div class='notification-meta'>
                            <div>
                              <Tag :color='getNotificationTag(item.type).color'>
                                {{ getNotificationTag(item.type).text }}
                              </Tag>
                              <Tooltip :title='`优先级: ${getPriorityStyle(item.priority).text}`'>
                                <span class='priority-dot' :style='{ backgroundColor: getPriorityStyle(item.priority).color }'></span>
                              </Tooltip>
                            </div>
                            <span>{{ formatToDateTime(item.createTime) }}</span>
                          </div>
                        </div>
                      "
                    />
                    <div class="notification-actions">
                      <Button 
                        type="text" 
                        danger
                        @click.stop="deleteNotification(item.id)"
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
                      :avatar="getNotificationIcon(item.type)"
                      :title="
                        <div class='notification-title' @click='viewNotificationDetail(item)'>
                          <Badge dot color='red' />
                          <span>{{ item.title }}</span>
                          <Tag v-if='isExpired(item.expireTime)' color='default'>已过期</Tag>
                        </div>
                      "
                      :description="
                        <div class='notification-content'>
                          <div class='notification-text'>{{ item.content }}</div>
                          <div class='notification-meta'>
                            <div>
                              <Tag :color='getNotificationTag(item.type).color'>
                                {{ getNotificationTag(item.type).text }}
                              </Tag>
                              <Tooltip :title='`优先级: ${getPriorityStyle(item.priority).text}`'>
                                <span class='priority-dot' :style='{ backgroundColor: getPriorityStyle(item.priority).color }'></span>
                              </Tooltip>
                            </div>
                            <span>{{ formatToDateTime(item.createTime) }}</span>
                          </div>
                        </div>
                      "
                    />
                    <div class="notification-actions">
                      <Button 
                        type="link" 
                        @click.stop="markNotificationRead(item.id)"
                      >
                        <CheckOutlined />
                      </Button>
                      <Button 
                        type="text" 
                        danger
                        @click.stop="deleteNotification(item.id)"
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
        
        <TabPane key="read" tab="已读通知">
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
                      :avatar="getNotificationIcon(item.type)"
                      :title="
                        <div class='notification-title' @click='viewNotificationDetail(item)'>
                          <span>{{ item.title }}</span>
                          <Tag v-if='isExpired(item.expireTime)' color='default'>已过期</Tag>
                        </div>
                      "
                      :description="
                        <div class='notification-content'>
                          <div class='notification-text'>{{ item.content }}</div>
                          <div class='notification-meta'>
                            <div>
                              <Tag :color='getNotificationTag(item.type).color'>
                                {{ getNotificationTag(item.type).text }}
                              </Tag>
                              <Tooltip :title='`优先级: ${getPriorityStyle(item.priority).text}`'>
                                <span class='priority-dot' :style='{ backgroundColor: getPriorityStyle(item.priority).color }'></span>
                              </Tooltip>
                            </div>
                            <span>{{ formatToDateTime(item.createTime) }}</span>
                          </div>
                        </div>
                      "
                    />
                    <div class="notification-actions">
                      <Button 
                        type="text" 
                        danger
                        @click.stop="deleteNotification(item.id)"
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
      title="通知详情"
      :visible="detailModal"
      @cancel="detailModal = false"
      :footer="null"
      width="600px"
    >
      <div v-if="currentNotification" class="notification-detail">
        <h2 class="detail-title">{{ currentNotification.title }}</h2>
        <div class="detail-meta">
          <div class="detail-tags">
            <Tag :color="getNotificationTag(currentNotification.type).color">
              {{ getNotificationTag(currentNotification.type).text }}
            </Tag>
            <Tag :color="currentNotification.readStatus ? 'default' : 'red'">
              {{ currentNotification.readStatus ? '已读' : '未读' }}
            </Tag>
            <Tag v-if="isExpired(currentNotification.expireTime)" color="default">已过期</Tag>
            <Tooltip :title="`优先级: ${getPriorityStyle(currentNotification.priority).text}`">
              <Tag :color="getPriorityStyle(currentNotification.priority).color">
                {{ getPriorityStyle(currentNotification.priority).text }}优先级
              </Tag>
            </Tooltip>
          </div>
          <div class="detail-time">
            <div>创建时间: {{ formatToDateTime(currentNotification.createTime) }}</div>
            <div v-if="currentNotification.expireTime">
              过期时间: {{ formatToDateTime(currentNotification.expireTime) }}
            </div>
          </div>
        </div>
        <div class="detail-content">
          <p>{{ currentNotification.content }}</p>
        </div>
        <div class="detail-actions">
          <Button 
            v-if="currentNotification.targetId && currentNotification.targetType"
            type="primary" 
            @click="goToTarget(currentNotification)"
          >
            查看相关内容
          </Button>
          <Button 
            type="default" 
            @click="detailModal = false"
          >
            关闭
          </Button>
          <Button 
            type="danger" 
            @click="deleteNotification(currentNotification.id)"
          >
            删除
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style lang="less" scoped>
.notification-container {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100%;
  
  .notification-card {
    background-color: #fff;
    
    .card-title {
      display: flex;
      align-items: center;
      
      .notification-stats {
        margin-left: 16px;
        display: flex;
        align-items: center;
        
        .stats-label {
          margin-left: 4px;
          margin-right: 16px;
          font-size: 12px;
          color: #888;
        }
      }
    }
    
    .notification-list {
      .notification-item {
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background-color: #f9f9f9;
        }
        
        .notification-title {
          display: flex;
          align-items: center;
          
          span {
            margin-left: 8px;
            margin-right: 8px;
          }
        }
        
        .notification-content {
          margin-left: 12px;
          
          .notification-text {
            color: #666;
            margin-bottom: 8px;
          }
          
          .notification-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #999;
            
            div {
              display: flex;
              align-items: center;
            }
            
            .priority-dot {
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-left: 8px;
            }
          }
        }
        
        .notification-actions {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  
  .notification-detail {
    padding: 0 16px;
    
    .detail-title {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 16px;
    }
    
    .detail-meta {
      margin-bottom: 16px;
      
      .detail-tags {
        margin-bottom: 8px;
      }
      
      .detail-time {
        font-size: 12px;
        color: #999;
      }
    }
    
    .detail-content {
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 4px;
      margin-bottom: 16px;
      min-height: 100px;
      
      p {
        margin: 0;
        line-height: 1.6;
      }
    }
    
    .detail-actions {
      display: flex;
      justify-content: flex-end;
      
      button {
        margin-left: 8px;
      }
    }
  }
}
</style> 