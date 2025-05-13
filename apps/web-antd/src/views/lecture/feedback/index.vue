<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Card, Tabs, Form, Input, Button, List, Avatar, Spin, Rate, Empty, message, Modal, Checkbox } from 'ant-design-vue';
import { UserOutlined, ClockCircleOutlined, CommentOutlined, StarFilled } from '@ant-design/icons-vue';
import { formatToDateTime } from '@/utils/dateUtil';
import { useGo } from '@/hooks/web/usePage';
import { getPendingFeedbacksApi, getMyFeedbacksApi, getLectureFeedbacksApi, submitFeedbackApi } from '@/api/lecture/feedback';
import { recordUserBehaviorApi, BehaviorType } from '@/api/lecture/user-behavior';
import { useUserStore } from '@/store/modules/user';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const activeTab = ref('pending');
const loading = ref(false);
const go = useGo();
const formRef = ref();
const userStore = useUserStore();

// 用户数据
const userData = reactive({
  userId: userStore.getUserInfo?.userId || 1001, // 默认ID，实际应使用登录用户ID
  username: userStore.getUserInfo?.username || '张三',
  avatar: userStore.getUserInfo?.avatar || '',
});

// 表单数据
const formState = reactive({
  lectureId: null as number | null,
  content: '',
  rating: 5,
  isAnonymous: false
});

// 当前选中的讲座
const currentLecture = ref<any>(null);
const feedbackModalVisible = ref(false);

// 待评价讲座列表（已签到但未评价的讲座）
const pendingFeedbacks = reactive({
  loading: false,
  data: [] as any[]
});

// 已评价讲座列表
const myFeedbacks = reactive({
  loading: false,
  data: [] as any[]
});

// 所有讲座评价列表
const allFeedbacks = reactive({
  loading: false,
  data: [] as any[],
  pageNum: 1,
  pageSize: 10,
  total: 0
});

// 打开评价对话框
const openFeedbackModal = (lecture: any) => {
  currentLecture.value = lecture;
  formState.lectureId = lecture.lectureId;
  formState.content = '';
  formState.rating = 5;
  formState.isAnonymous = false;
  feedbackModalVisible.value = true;
  
  // 记录用户行为
  recordUserBehaviorApi({
    userId: userData.userId,
    lectureId: lecture.lectureId,
    behaviorType: BehaviorType.VIEW,
  }, false);
};

// 提交评价
const submitFeedback = async () => {
  if (!formState.content.trim()) {
    message.error('请填写评价内容');
    return;
  }
  
  if (!currentLecture.value) return;
  
  loading.value = true;
  try {
    const res = await submitFeedbackApi({
      lectureId: formState.lectureId!,
      userId: userData.userId,
      content: formState.content,
      rating: formState.rating,
      isAnonymous: formState.isAnonymous
    });
    
    if (res.code === 200) {
      message.success('评价提交成功！');
      
      // 记录用户反馈行为
      recordUserBehaviorApi({
        userId: userData.userId,
        lectureId: formState.lectureId!,
        behaviorType: BehaviorType.FEEDBACK,
      }, false);
      
      // 刷新数据
      loadData();
      feedbackModalVisible.value = false;
    } else {
      message.error(res.msg || '评价提交失败！');
    }
  } catch (error) {
    console.error('评价提交失败', error);
    message.error('评价提交失败，请稍后重试！');
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
};

// 查看讲座详情
const viewLectureDetail = (lectureId: number) => {
  go(`/lecture/lecture/detail/${lectureId}`);
};

// 切换选项卡
const handleTabChange = (key: string) => {
  activeTab.value = key;
};

// 加载数据
const loadData = async () => {
  // 加载待评价讲座
  pendingFeedbacks.loading = true;
  try {
    const res = await getPendingFeedbacksApi(userData.userId);
    if (res.code === 200) {
      pendingFeedbacks.data = res.data || [];
    }
  } catch (error) {
    console.error('获取待评价讲座失败', error);
  } finally {
    pendingFeedbacks.loading = false;
  }

  // 加载我的评价
  myFeedbacks.loading = true;
  try {
    const res = await getMyFeedbacksApi(userData.userId);
    if (res.code === 200) {
      myFeedbacks.data = res.data || [];
    }
  } catch (error) {
    console.error('获取我的评价失败', error);
  } finally {
    myFeedbacks.loading = false;
  }

  // 加载所有评价
  allFeedbacks.loading = true;
  try {
    // 这里应该是一个分页查询，所以应该获取一个特定讲座的评价列表
    // 因为没有指定特定讲座，可以根据实际业务调整
    const res = await getLectureFeedbacksApi(0, {
      pageNum: allFeedbacks.pageNum,
      pageSize: allFeedbacks.pageSize
    });
    if (res.code === 200) {
      if (res.data && res.data.rows) {
        allFeedbacks.data = res.data.rows;
        allFeedbacks.total = res.data.total;
      } else {
        allFeedbacks.data = res.data || [];
      }
    }
  } catch (error) {
    console.error('获取评价列表失败', error);
  } finally {
    allFeedbacks.loading = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="feedback-container">
    <Card :bordered="false" class="feedback-card">
      <Tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <TabPane key="pending" tab="待评价讲座">
          <Spin :spinning="pendingFeedbacks.loading">
            <div class="lecture-list">
              <Empty v-if="pendingFeedbacks.data.length === 0" description="暂无待评价讲座" />
              <List 
                v-else
                itemLayout="horizontal" 
                :dataSource="pendingFeedbacks.data"
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
                      </div>
                    </div>
                    <div class="lecture-actions">
                      <Button 
                        type="primary" 
                        @click.stop="openFeedbackModal(item)"
                      >
                        <template #icon><CommentOutlined /></template>
                        评价讲座
                      </Button>
                    </div>
                  </List.Item>
                </template>
              </List>
            </div>
          </Spin>
        </TabPane>
        
        <TabPane key="my" tab="我的评价">
          <Spin :spinning="myFeedbacks.loading">
            <div class="feedback-list">
              <Empty v-if="myFeedbacks.data.length === 0" description="暂无评价记录" />
              <List 
                v-else
                itemLayout="vertical" 
                :dataSource="myFeedbacks.data"
              >
                <template #renderItem="{ item }">
                  <List.Item class="feedback-item">
                    <div class="feedback-content">
                      <div class="feedback-header">
                        <div class="feedback-title" @click="viewLectureDetail(item.lectureId)">{{ item.title }}</div>
                        <div class="feedback-rating">
                          <Rate :value="item.rating" disabled />
                          <span>{{ item.rating }}分</span>
                        </div>
                      </div>
                      <div class="lecture-info">
                        <div class="info-item">
                          <UserOutlined />
                          <span>{{ item.speaker }}</span>
                        </div>
                      </div>
                      <div class="feedback-comment">{{ item.content }}</div>
                      <div class="feedback-meta">
                        <span>{{ formatToDateTime(item.createTime) }}</span>
                        <span v-if="item.isAnonymous" class="anonymous-tag">匿名评价</span>
                      </div>
                    </div>
                  </List.Item>
                </template>
              </List>
            </div>
          </Spin>
        </TabPane>
        
        <TabPane key="all" tab="全部评价">
          <Spin :spinning="allFeedbacks.loading">
            <div class="feedback-list">
              <Empty v-if="allFeedbacks.data.length === 0" description="暂无评价记录" />
              <List 
                v-else
                itemLayout="vertical" 
                :dataSource="allFeedbacks.data"
              >
                <template #renderItem="{ item }">
                  <List.Item class="feedback-item">
                    <div class="feedback-content">
                      <div class="feedback-header">
                        <div class="feedback-title" @click="viewLectureDetail(item.lectureId)">{{ item.title }}</div>
                        <div class="feedback-rating">
                          <Rate :value="item.rating" disabled />
                          <span>{{ item.rating }}分</span>
                        </div>
                      </div>
                      <div class="lecture-info">
                        <div class="info-item">
                          <UserOutlined />
                          <span>{{ item.speaker }}</span>
                        </div>
                      </div>
                      <div class="feedback-comment">{{ item.content }}</div>
                      <div class="feedback-meta">
                        <span>{{ item.username || '匿名用户' }}</span>
                        <span>{{ formatToDateTime(item.createTime) }}</span>
                      </div>
                    </div>
                  </List.Item>
                </template>
              </List>
            </div>
          </Spin>
        </TabPane>
      </Tabs>
    </Card>
    
    <!-- 评价对话框 -->
    <Modal
      title="讲座评价"
      :visible="feedbackModalVisible"
      :confirmLoading="loading"
      @ok="submitFeedback"
      @cancel="feedbackModalVisible = false"
    >
      <div v-if="currentLecture" class="lecture-info-modal">
        <h3>{{ currentLecture.title }}</h3>
        <p>主讲人: {{ currentLecture.speaker }}</p>
      </div>
      <Form ref="formRef" :model="formState" layout="vertical">
        <FormItem label="评分">
          <Rate v-model:value="formState.rating" :tooltips="['很差', '较差', '一般', '较好', '很好']" />
        </FormItem>
        <FormItem label="评价内容" required>
          <TextArea 
            v-model:value="formState.content" 
            placeholder="请输入您对讲座的评价和建议..."
            :rows="4"
            :maxlength="500"
            show-count
          />
        </FormItem>
        <FormItem>
          <div class="anonymous-option">
            <Checkbox v-model:checked="formState.isAnonymous">匿名评价</Checkbox>
          </div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<style lang="less" scoped>
.feedback-container {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100%;
  
  .feedback-card {
    background-color: #fff;
    
    .lecture-list,
    .feedback-list {
      .lecture-item,
      .feedback-item {
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background-color: #f0f8ff;
        }
        
        .lecture-content,
        .feedback-content {
          flex: 1;
          padding: 16px 0;
          
          .lecture-title,
          .feedback-title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
          }
          
          .feedback-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          
          .lecture-info {
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
            }
          }
          
          .feedback-comment {
            color: #333;
            margin-bottom: 8px;
            line-height: 1.5;
          }
          
          .feedback-meta {
            display: flex;
            justify-content: space-between;
            color: #999;
            font-size: 12px;
            
            .anonymous-tag {
              color: #1890ff;
            }
          }
        }
        
        .lecture-actions,
        .feedback-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
  }
  
  .lecture-info-modal {
    margin-bottom: 16px;
    
    h3 {
      margin-bottom: 8px;
    }
    
    p {
      color: #666;
    }
  }
  
  .anonymous-option {
    margin-top: 8px;
  }
}
</style> 