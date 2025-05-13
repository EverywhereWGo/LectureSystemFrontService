<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Card, Tabs, Form, Input, Button, List, Avatar, Spin, Badge, Modal, Tag, Empty, message } from 'ant-design-vue';
import { UserOutlined, ClockCircleOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons-vue';
import { formatToDateTime } from '@/utils/dateUtil';
import { useGo } from '@/hooks/web/usePage';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const activeTab = ref('available');
const loading = ref(false);
const go = useGo();
const cancelModalVisible = ref(false);
const currentReservation = ref<any>(null);
const cancelReason = ref('');

// 模拟可预约讲座数据
const availableLectures = reactive({
  loading: false,
  data: [
    {
      lectureId: 1,
      title: '人工智能与未来社会发展',
      speaker: '张教授',
      startTime: '2025-05-15 14:00:00',
      endTime: '2025-05-15 16:00:00',
      venueName: '综合楼报告厅',
      maxAttendees: 200,
      currentAttendees: 156,
      status: 'upcoming'
    },
    {
      lectureId: 2,
      title: '高等数学在工程中的应用',
      speaker: '李教授',
      startTime: '2025-05-20 10:00:00',
      endTime: '2025-05-20 12:00:00',
      venueName: '理学院报告厅',
      maxAttendees: 150,
      currentAttendees: 150, // 已满
      status: 'upcoming'
    },
    {
      lectureId: 3,
      title: '经济全球化的机遇与挑战',
      speaker: '王教授',
      startTime: '2025-05-25 14:30:00',
      endTime: '2025-05-25 16:30:00',
      venueName: '经管学院报告厅',
      maxAttendees: 180,
      currentAttendees: 120,
      status: 'upcoming'
    }
  ]
});

// 模拟我的预约数据
const myReservations = reactive({
  loading: false,
  data: [
    {
      reservationId: 1001,
      lectureId: 1,
      title: '人工智能与未来社会发展',
      speaker: '张教授',
      startTime: '2025-05-15 14:00:00',
      endTime: '2025-05-15 16:00:00',
      venueName: '综合楼报告厅',
      status: 'waiting', // 预约中
      reservationCode: 'RSV00001',
      reservationTime: '2025-05-01 10:23:45'
    },
    {
      reservationId: 1002,
      lectureId: 4,
      title: '现代文学赏析',
      speaker: '赵教授',
      startTime: '2025-05-10 14:00:00',
      endTime: '2025-05-10 16:00:00',
      venueName: '文学院报告厅',
      status: 'checked', // 已签到
      reservationCode: 'RSV00002',
      reservationTime: '2025-05-01 15:42:18',
      checkTime: '2025-05-10 13:55:34'
    },
    {
      reservationId: 1003,
      lectureId: 5,
      title: '大数据分析与应用',
      speaker: '刘教授',
      startTime: '2025-05-05 10:00:00',
      endTime: '2025-05-05 12:00:00',
      venueName: '计算机学院报告厅',
      status: 'cancel', // 已取消
      reservationCode: 'RSV00003',
      reservationTime: '2025-04-28 09:12:54',
      cancelTime: '2025-05-01 16:23:45',
      cancelReason: '时间冲突，无法参加'
    }
  ]
});

// 预约讲座
const reserveLecture = (lectureId: number) => {
  loading.value = true;
  // 模拟API请求
  setTimeout(() => {
    // 找到对应讲座
    const lectureIndex = availableLectures.data.findIndex(item => item.lectureId === lectureId);
    if (lectureIndex !== -1) {
      const lecture = availableLectures.data[lectureIndex];
      
      // 增加预约人数
      lecture.currentAttendees += 1;
      
      // 创建新预约
      const newReservation = {
        reservationId: Date.now(),
        lectureId: lecture.lectureId,
        title: lecture.title,
        speaker: lecture.speaker,
        startTime: lecture.startTime,
        endTime: lecture.endTime,
        venueName: lecture.venueName,
        status: 'waiting',
        reservationCode: `RSV${String(Date.now()).substring(6)}`,
        reservationTime: formatToDateTime(new Date())
      };
      
      // 添加到我的预约列表
      myReservations.data.unshift(newReservation);
      
      message.success('讲座预约成功！');
    }
    
    loading.value = false;
  }, 1000);
};

// 显示取消预约对话框
const showCancelModal = (reservation: any) => {
  currentReservation.value = reservation;
  cancelReason.value = '';
  cancelModalVisible.value = true;
};

// 取消预约
const handleCancelReservation = () => {
  if (!currentReservation.value) return;
  
  loading.value = true;
  // 模拟API请求
  setTimeout(() => {
    // 更新预约状态
    const index = myReservations.data.findIndex(item => item.reservationId === currentReservation.value.reservationId);
    if (index !== -1) {
      myReservations.data[index].status = 'cancel';
      myReservations.data[index].cancelTime = formatToDateTime(new Date());
      myReservations.data[index].cancelReason = cancelReason.value;
      
      // 减少讲座预约人数
      const lectureIndex = availableLectures.data.findIndex(item => item.lectureId === currentReservation.value.lectureId);
      if (lectureIndex !== -1) {
        availableLectures.data[lectureIndex].currentAttendees -= 1;
      }
      
      message.success('已成功取消预约');
    }
    
    cancelModalVisible.value = false;
    loading.value = false;
  }, 1000);
};

// 查看讲座详情
const viewLectureDetail = (lectureId: number) => {
  go(`/lecture/lecture/detail/${lectureId}`);
};

// 获取状态标签
const getStatusTag = (status: string) => {
  switch (status) {
    case 'waiting':
      return { color: 'blue', text: '预约中' };
    case 'checked':
      return { color: 'green', text: '已签到' };
    case 'cancel':
      return { color: 'red', text: '已取消' };
    default:
      return { color: 'default', text: '未知' };
  }
};

// 切换选项卡
const handleTabChange = (key: string) => {
  activeTab.value = key;
};

onMounted(() => {
  // 模拟获取数据
  availableLectures.loading = true;
  myReservations.loading = true;
  
  setTimeout(() => {
    availableLectures.loading = false;
    myReservations.loading = false;
  }, 500);
});
</script>

<template>
  <div class="reservation-container">
    <Card :bordered="false" class="reservation-card">
      <Tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <TabPane key="available" tab="可预约讲座">
          <Spin :spinning="availableLectures.loading">
            <div class="lecture-list">
              <Empty v-if="availableLectures.data.length === 0" description="暂无可预约讲座" />
              <List 
                v-else
                itemLayout="horizontal" 
                :dataSource="availableLectures.data"
              >
                <template #renderItem="{ item }">
                  <List.Item class="lecture-item">
                    <div class="lecture-content" @click="viewLectureDetail(item.lectureId)">
                      <div class="lecture-title">{{ item.title }}</div>
                      <div class="lecture-info">
                        <div class="info-item">
                          <UserOutlined />
                          <span>{{ item.speaker }}</span>
                        </div>
                        <div class="info-item">
                          <ClockCircleOutlined />
                          <span>{{ formatToDateTime(item.startTime) }} - {{ formatToDateTime(item.endTime, 'HH:mm') }}</span>
                        </div>
                        <div class="info-item">
                          <EnvironmentOutlined />
                          <span>{{ item.venueName }}</span>
                        </div>
                      </div>
                      <div class="lecture-attendance">
                        <Badge 
                          :status="item.currentAttendees >= item.maxAttendees ? 'error' : 'success'" 
                          :text="`已预约 ${item.currentAttendees}/${item.maxAttendees}`" 
                        />
                      </div>
                    </div>
                    <div class="lecture-actions">
                      <Button 
                        type="primary" 
                        :disabled="item.currentAttendees >= item.maxAttendees"
                        @click="reserveLecture(item.lectureId)"
                      >
                        {{ item.currentAttendees >= item.maxAttendees ? '已满' : '预约' }}
                      </Button>
                    </div>
                  </List.Item>
                </template>
              </List>
            </div>
          </Spin>
        </TabPane>
        
        <TabPane key="my" tab="我的预约">
          <Spin :spinning="myReservations.loading">
            <div class="reservation-list">
              <Empty v-if="myReservations.data.length === 0" description="暂无预约记录" />
              <List 
                v-else
                itemLayout="horizontal" 
                :dataSource="myReservations.data"
              >
                <template #renderItem="{ item }">
                  <List.Item class="reservation-item">
                    <div class="reservation-content" @click="viewLectureDetail(item.lectureId)">
                      <div class="reservation-header">
                        <div class="reservation-title">{{ item.title }}</div>
                        <Tag :color="getStatusTag(item.status).color">{{ getStatusTag(item.status).text }}</Tag>
                      </div>
                      <div class="reservation-info">
                        <div class="info-item">
                          <UserOutlined />
                          <span>{{ item.speaker }}</span>
                        </div>
                        <div class="info-item">
                          <ClockCircleOutlined />
                          <span>{{ formatToDateTime(item.startTime) }} - {{ formatToDateTime(item.endTime, 'HH:mm') }}</span>
                        </div>
                        <div class="info-item">
                          <EnvironmentOutlined />
                          <span>{{ item.venueName }}</span>
                        </div>
                        <div class="info-item">
                          <CalendarOutlined />
                          <span>预约时间: {{ item.reservationTime }}</span>
                        </div>
                        <div v-if="item.status === 'cancel'" class="info-item cancel-reason">
                          <span>取消原因: {{ item.cancelReason }}</span>
                        </div>
                      </div>
                      <div class="reservation-code">
                        <span>预约码: {{ item.reservationCode }}</span>
                      </div>
                    </div>
                    <div class="reservation-actions">
                      <Button 
                        v-if="item.status === 'waiting'" 
                        danger
                        @click="showCancelModal(item)"
                      >
                        取消预约
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
    
    <!-- 取消预约对话框 -->
    <Modal
      v-model:visible="cancelModalVisible"
      title="取消预约"
      :confirmLoading="loading"
      @ok="handleCancelReservation"
    >
      <p>确定要取消以下讲座的预约吗？</p>
      <p v-if="currentReservation"><strong>{{ currentReservation.title }}</strong></p>
      <p>取消后将无法恢复，如需参加请重新预约。</p>
      <Form layout="vertical">
        <FormItem label="取消原因">
          <Input v-model:value="cancelReason" placeholder="请简要说明取消原因（选填）" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<style lang="less" scoped>
.reservation-container {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100%;
  
  .reservation-card {
    background-color: #fff;
    
    .lecture-list,
    .reservation-list {
      .lecture-item,
      .reservation-item {
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background-color: #f0f8ff;
        }
        
        .lecture-content,
        .reservation-content {
          flex: 1;
          padding: 16px 0;
          
          .lecture-title,
          .reservation-title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
          }
          
          .reservation-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          
          .lecture-info,
          .reservation-info {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 8px;
            
            .info-item {
              display: flex;
              align-items: center;
              margin-right: 16px;
              margin-bottom: 8px;
              color: #666;
              
              span {
                margin-left: 4px;
              }
              
              &.cancel-reason {
                color: #ff4d4f;
                width: 100%;
              }
            }
          }
          
          .lecture-attendance {
            margin-top: 8px;
          }
          
          .reservation-code {
            font-family: monospace;
            color: #1890ff;
            margin-top: 8px;
          }
        }
        
        .lecture-actions,
        .reservation-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style> 