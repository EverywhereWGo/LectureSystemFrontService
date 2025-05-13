<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Card, Descriptions, Tag, Button, Skeleton, Empty, Divider, Avatar, Comment } from 'ant-design-vue';
import { ClockCircleOutlined, EnvironmentOutlined, UserOutlined, LikeOutlined, DislikeOutlined, StarOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { formatToDateTime } from '@/utils/dateUtil';
import { useGo } from '@/hooks/web/usePage';

// 获取路由参数
const route = useRoute();
const go = useGo();
const lectureId = computed(() => route.params.id);
const loading = ref(true);

// 讲座数据
const lectureData = ref<any>({
  lectureId: lectureId.value,
  title: '人工智能与未来社会发展',
  content: `<p>人工智能（Artificial Intelligence，简称AI）是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。</p>
<p>本次讲座将深入探讨人工智能技术的最新发展，以及它对未来社会、经济和就业的潜在影响。主要内容包括：</p>
<ul>
  <li>人工智能的发展历程与关键突破</li>
  <li>深度学习、机器学习与神经网络</li>
  <li>人工智能在医疗、教育、金融等领域的应用</li>
  <li>人工智能带来的社会变革与伦理挑战</li>
  <li>未来就业市场的变化与应对策略</li>
</ul>
<p>这场讲座适合对人工智能感兴趣的各专业学生，无需技术背景，将以通俗易懂的方式介绍前沿科技。</p>`,
  speaker: '张教授',
  speakerInfo: '计算机科学与技术学院 人工智能研究中心主任',
  startTime: '2025-05-15 14:00:00',
  endTime: '2025-05-15 16:00:00',
  registrationDeadline: '2025-05-14 12:00:00',
  maxAttendees: 200,
  currentAttendees: 156,
  venueName: '综合楼报告厅',
  venueLocation: '综合楼B座3楼',
  keywords: '人工智能,社会发展,就业市场,伦理挑战',
  status: 1, // 1: 未开始, 2: 进行中, 3: 已结束
  isRegistered: true,
  likeCount: 45,
  dislikeCount: 3,
  favoriteCount: 36,
  commentCount: 12,
  userAction: {
    liked: false,
    disliked: false,
    favorited: false,
  }
});

// 评论数据
const comments = ref([
  {
    id: 1,
    content: '上次听了张教授的讲座收获很大，这次一定不能错过！',
    author: '李同学',
    avatar: '',
    createTime: '2025-05-10 14:23:45',
    likeCount: 12,
  },
  {
    id: 2,
    content: '人工智能确实是未来的趋势，希望能够了解更多相关知识。',
    author: '王同学',
    avatar: '',
    createTime: '2025-05-11 09:15:23',
    likeCount: 8,
  },
  {
    id: 3,
    content: '对伦理挑战这部分特别感兴趣，期待张教授的分享。',
    author: '赵同学',
    avatar: '',
    createTime: '2025-05-11 16:42:11',
    likeCount: 5,
  }
]);

// 讲座状态对应的标签
const statusTag = computed(() => {
  switch (lectureData.value.status) {
    case 1:
      return { color: 'blue', text: '未开始' };
    case 2:
      return { color: 'green', text: '进行中' };
    case 3:
      return { color: 'gray', text: '已结束' };
    default:
      return { color: 'default', text: '未知' };
  }
});

// 讲座关键词标签
const keywordTags = computed(() => {
  if (!lectureData.value.keywords) return [];
  return lectureData.value.keywords.split(',').map((tag: string) => tag.trim());
});

// 是否可以预约
const canRegister = computed(() => {
  if (lectureData.value.status !== 1) return false;
  if (lectureData.value.isRegistered) return false;
  if (lectureData.value.currentAttendees >= lectureData.value.maxAttendees) return false;
  return true;
});

// 是否显示签到按钮
const showCheckIn = computed(() => {
  return lectureData.value.status === 2 && lectureData.value.isRegistered;
});

// 预约讲座
const handleRegister = () => {
  // 调用预约API
  lectureData.value.isRegistered = true;
  lectureData.value.currentAttendees += 1;
};

// 取消预约
const handleCancelRegister = () => {
  // 调用取消预约API
  lectureData.value.isRegistered = false;
  lectureData.value.currentAttendees -= 1;
};

// 签到
const handleCheckIn = () => {
  // 调用签到API
};

// 点赞/取消点赞
const handleLike = () => {
  if (lectureData.value.userAction.liked) {
    lectureData.value.likeCount -= 1;
  } else {
    lectureData.value.likeCount += 1;
    if (lectureData.value.userAction.disliked) {
      lectureData.value.dislikeCount -= 1;
      lectureData.value.userAction.disliked = false;
    }
  }
  lectureData.value.userAction.liked = !lectureData.value.userAction.liked;
};

// 点踩/取消点踩
const handleDislike = () => {
  if (lectureData.value.userAction.disliked) {
    lectureData.value.dislikeCount -= 1;
  } else {
    lectureData.value.dislikeCount += 1;
    if (lectureData.value.userAction.liked) {
      lectureData.value.likeCount -= 1;
      lectureData.value.userAction.liked = false;
    }
  }
  lectureData.value.userAction.disliked = !lectureData.value.userAction.disliked;
};

// 收藏/取消收藏
const handleFavorite = () => {
  if (lectureData.value.userAction.favorited) {
    lectureData.value.favoriteCount -= 1;
  } else {
    lectureData.value.favoriteCount += 1;
  }
  lectureData.value.userAction.favorited = !lectureData.value.userAction.favorited;
};

// 返回列表
const goBack = () => {
  go('/lecture/lecture');
};

// 模拟加载数据
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 800);
});
</script>

<template>
  <div class="lecture-detail-container">
    <Card class="detail-card">
      <template #title>
        <div class="detail-header">
          <Button @click="goBack">返回列表</Button>
          <h1 class="lecture-title">{{ lectureData.title }}</h1>
          <Tag :color="statusTag.color">{{ statusTag.text }}</Tag>
        </div>
      </template>
      
      <Skeleton active :loading="loading">
        <div v-if="lectureData" class="lecture-content">
          <Descriptions bordered :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }">
            <Descriptions.Item label="讲座主题">{{ lectureData.title }}</Descriptions.Item>
            <Descriptions.Item label="主讲人">{{ lectureData.speaker }}</Descriptions.Item>
            <Descriptions.Item label="主讲人信息">{{ lectureData.speakerInfo }}</Descriptions.Item>
            <Descriptions.Item label="讲座时间">
              {{ formatToDateTime(lectureData.startTime) }} 至 {{ formatToDateTime(lectureData.endTime) }}
            </Descriptions.Item>
            <Descriptions.Item label="讲座地点">
              {{ lectureData.venueName }} ({{ lectureData.venueLocation }})
            </Descriptions.Item>
            <Descriptions.Item label="预约截止时间">
              {{ formatToDateTime(lectureData.registrationDeadline) }}
            </Descriptions.Item>
            <Descriptions.Item label="座位情况">
              已预约 {{ lectureData.currentAttendees }}/{{ lectureData.maxAttendees }}
            </Descriptions.Item>
            <Descriptions.Item label="讲座标签">
              <div class="tag-container">
                <Tag v-for="tag in keywordTags" :key="tag" color="blue">{{ tag }}</Tag>
              </div>
            </Descriptions.Item>
          </Descriptions>
          
          <div class="lecture-action">
            <!-- 根据状态显示不同按钮 -->
            <div v-if="lectureData.status === 1" class="register-action">
              <Button 
                v-if="!lectureData.isRegistered" 
                type="primary" 
                :disabled="!canRegister"
                @click="handleRegister"
              >
                预约讲座
              </Button>
              <Button 
                v-else 
                danger
                @click="handleCancelRegister"
              >
                取消预约
              </Button>
              <span v-if="!canRegister && !lectureData.isRegistered" class="notice">
                讲座已满员，无法预约
              </span>
            </div>
            
            <Button 
              v-if="showCheckIn"
              type="primary" 
              @click="handleCheckIn"
            >
              立即签到
            </Button>
            
            <div class="social-actions">
              <Button 
                type="text" 
                :class="{ active: lectureData.userAction.liked }"
                @click="handleLike"
              >
                <LikeOutlined /> {{ lectureData.likeCount }}
              </Button>
              <Button 
                type="text" 
                :class="{ active: lectureData.userAction.disliked }"
                @click="handleDislike"
              >
                <DislikeOutlined /> {{ lectureData.dislikeCount }}
              </Button>
              <Button 
                type="text" 
                :class="{ active: lectureData.userAction.favorited }"
                @click="handleFavorite"
              >
                <StarOutlined /> {{ lectureData.favoriteCount }}
              </Button>
              <Button type="text">
                <MessageOutlined /> {{ lectureData.commentCount }}
              </Button>
            </div>
          </div>
          
          <Divider orientation="left">讲座详情</Divider>
          
          <div class="detail-content" v-html="lectureData.content"></div>
          
          <Divider orientation="left">讲座评论 ({{ comments.length }})</Divider>
          
          <div class="comment-section">
            <Comment 
              v-for="comment in comments" 
              :key="comment.id"
              :author="comment.author"
              :content="comment.content"
              :datetime="comment.createTime"
            >
              <template #avatar>
                <Avatar :src="comment.avatar" :alt="comment.author">
                  {{ comment.author.charAt(0) }}
                </Avatar>
              </template>
              <template #actions>
                <span><LikeOutlined /> {{ comment.likeCount }}</span>
              </template>
            </Comment>
          </div>
        </div>
        <Empty v-else description="讲座信息不存在" />
      </Skeleton>
    </Card>
  </div>
</template>

<style lang="less" scoped>
.lecture-detail-container {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: 100%;
  
  .detail-card {
    background-color: #fff;
    
    .detail-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      .lecture-title {
        margin: 0 16px;
        flex: 1;
        font-size: 20px;
        font-weight: 600;
      }
    }
    
    .lecture-content {
      .tag-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .lecture-action {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 24px 0;
        
        .register-action {
          display: flex;
          align-items: center;
          
          .notice {
            margin-left: 16px;
            color: #ff4d4f;
          }
        }
        
        .social-actions {
          display: flex;
          gap: 16px;
          
          .active {
            color: #1890ff;
          }
        }
      }
      
      .detail-content {
        line-height: 1.8;
        color: #333;
        
        p {
          margin-bottom: 16px;
        }
        
        ul, ol {
          margin-left: 16px;
          margin-bottom: 16px;
        }
      }
      
      .comment-section {
        background-color: #fafafa;
        padding: 16px;
        border-radius: 8px;
      }
    }
  }
}
</style> 