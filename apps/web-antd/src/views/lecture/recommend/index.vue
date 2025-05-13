<script setup lang="ts">
import { ref, onMounted, reactive, h } from 'vue';
import { Card, Tabs, Empty, Spin, Avatar, Tag, Tooltip } from 'ant-design-vue';
import { getHotRecommendApi, getContentRecommendApi, getUserCFRecommendApi, getItemCFRecommendApi, getHybridRecommendApi, getUserTagsApi } from '@/api/lecture/recommend';
import { formatToDateTime } from '@/utils/dateUtil';
import { useGo } from '@/hooks/web/usePage';
import { ClockCircleOutlined, EnvironmentOutlined, UserOutlined, TagsOutlined } from '@ant-design/icons-vue';

interface LectureItem {
  lectureId: string | number;
  title: string;
  content?: string;
  speaker: string;
  startTime: string;
  venueName?: string;
  keywords?: string;
}

const TabPane = Tabs.TabPane;
const loading = ref(false);
const lectures = ref<LectureItem[]>([]);
const activeTab = ref('hot');
const userTags = ref<Record<string, number>>({});
const go = useGo();

const cardList = reactive<{
  list: LectureItem[];
}>({
  list: [],
});

// 获取用户标签偏好
const fetchUserTags = async () => {
  try {
    const res = await getUserTagsApi();
    if (res.code === 200) {
      userTags.value = res.data || {};
    }
  } catch (error) {
    console.error('获取用户标签失败:', error);
  }
};

// 根据标签计算卡片颜色
const getCardStyle = (lecture: LectureItem) => {
  if (!lecture.keywords) return {};
  
  const keywords = lecture.keywords.split(',');
  let maxScore = 0;
  
  for (const keyword of keywords) {
    const score = userTags.value[keyword.trim()] || 0;
    if (score > maxScore) {
      maxScore = score;
    }
  }
  
  // 根据相关性设置不同的背景颜色
  if (maxScore > 0.7) {
    return { borderLeft: '4px solid #52c41a' };
  } else if (maxScore > 0.4) {
    return { borderLeft: '4px solid #1890ff' };
  }
  
  return {};
};

// 处理标签点击
const handleTagClick = async (tag: string) => {
  try {
    loading.value = true;
    const res = await getContentRecommendApi({ tags: [tag], limit: 12 });
    if (res.code === 200) {
      lectures.value = res.data || [];
      cardList.list = lectures.value;
    }
    activeTab.value = 'content';
  } catch (error) {
    console.error('根据标签获取讲座失败:', error);
  } finally {
    loading.value = false;
  }
};

// 获取讲座推荐列表
const fetchLectures = async (tab: string = 'hot') => {
  try {
    loading.value = true;
    let res;
    
    switch (tab) {
      case 'hot':
        res = await getHotRecommendApi({ days: 30, limit: 12 });
        break;
      case 'content':
        res = await getContentRecommendApi({ limit: 12 });
        break;
      case 'userCF':
        res = await getUserCFRecommendApi({ limit: 12 });
        break;
      case 'itemCF':
        res = await getItemCFRecommendApi({ limit: 12 });
        break;
      case 'hybrid':
        res = await getHybridRecommendApi({ limit: 12 });
        break;
      default:
        res = await getHotRecommendApi({ days: 30, limit: 12 });
    }
    
    if (res.code === 200) {
      lectures.value = res.data || [];
      cardList.list = lectures.value;
    }
  } catch (error) {
    console.error('获取推荐讲座失败:', error);
  } finally {
    loading.value = false;
  }
};

// 查看讲座详情
const viewLectureDetail = (lectureId: string | number) => {
  go(`/lecture/lecture/detail/${lectureId}`);
};

// Tab切换
const handleTabChange = (key: string) => {
  activeTab.value = key;
  fetchLectures(key);
};

// 生成讲座标签
const renderTags = (keywords: string) => {
  if (!keywords) return null;
  
  const tags = keywords.split(',').filter(Boolean).map((tag: string) => {
    const tagText = tag.trim();
    const score = userTags.value[tagText] || 0;
    
    // 根据用户标签偏好设置不同的颜色
    let color = 'default';
    if (score > 0.7) {
      color = 'success';
    } else if (score > 0.4) {
      color = 'processing';
    } else if (score > 0) {
      color = 'warning';
    }
    
    return h(Tag, {
      color,
      onClick: (e: Event) => {
        e.stopPropagation();
        handleTagClick(tagText);
      },
      style: { cursor: 'pointer', margin: '2px' },
    }, () => tagText);
  });
  
  return tags;
};

onMounted(() => {
  fetchUserTags();
  fetchLectures('hot');
});
</script>

<template>
  <div class="lecture-recommend-container">
    <Card :bordered="false" class="recommend-header">
      <div class="header-content">
        <div class="title">讲座推荐</div>
        <div class="subtitle">根据您的兴趣为您推荐相关讲座</div>
      </div>
    </Card>

    <Card :bordered="false" class="recommend-content">
      <Tabs :activeKey="activeTab" @change="handleTabChange">
        <TabPane key="hot" tab="热门推荐">
          <Spin :spinning="loading">
            <div v-if="cardList.list.length > 0" class="card-list">
              <Card 
                v-for="item in cardList.list" 
                :key="item.lectureId" 
                hoverable 
                class="lecture-card"
                :style="getCardStyle(item)"
                @click="viewLectureDetail(item.lectureId)"
              >
                <div class="card-content">
                  <div class="lecture-title">{{ item.title }}</div>
                  <div class="lecture-speaker">
                    <Avatar :size="24" icon={<UserOutlined />} />
                    <span>{{ item.speaker }}</span>
                  </div>
                  <div class="lecture-info">
                    <Tooltip title="讲座时间">
                      <div class="info-item">
                        <ClockCircleOutlined />
                        <span>{{ formatToDateTime(item.startTime) }}</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="讲座地点">
                      <div class="info-item">
                        <EnvironmentOutlined />
                        <span>{{ item.venueName || '待定' }}</span>
                      </div>
                    </Tooltip>
                  </div>
                  <div class="lecture-tags">
                    <TagsOutlined />
                    <div class="tags-container">
                      <template v-if="item.keywords">
                        {{ renderTags(item.keywords) }}
                      </template>
                      <span v-else>暂无标签</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <Empty v-else description="暂无推荐讲座" />
          </Spin>
        </TabPane>
        <TabPane key="content" tab="内容推荐">
          <Spin :spinning="loading">
            <div v-if="cardList.list.length > 0" class="card-list">
              <Card 
                v-for="item in cardList.list" 
                :key="item.lectureId" 
                hoverable 
                class="lecture-card"
                :style="getCardStyle(item)"
                @click="viewLectureDetail(item.lectureId)"
              >
                <div class="card-content">
                  <div class="lecture-title">{{ item.title }}</div>
                  <div class="lecture-speaker">
                    <Avatar :size="24" icon={<UserOutlined />} />
                    <span>{{ item.speaker }}</span>
                  </div>
                  <div class="lecture-info">
                    <Tooltip title="讲座时间">
                      <div class="info-item">
                        <ClockCircleOutlined />
                        <span>{{ formatToDateTime(item.startTime) }}</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="讲座地点">
                      <div class="info-item">
                        <EnvironmentOutlined />
                        <span>{{ item.venueName || '待定' }}</span>
                      </div>
                    </Tooltip>
                  </div>
                  <div class="lecture-tags">
                    <TagsOutlined />
                    <div class="tags-container">
                      <template v-if="item.keywords">
                        {{ renderTags(item.keywords) }}
                      </template>
                      <span v-else>暂无标签</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <Empty v-else description="暂无推荐讲座" />
          </Spin>
        </TabPane>
        <TabPane key="userCF" tab="用户协同推荐">
          <Spin :spinning="loading">
            <div v-if="cardList.list.length > 0" class="card-list">
              <Card 
                v-for="item in cardList.list" 
                :key="item.lectureId" 
                hoverable 
                class="lecture-card"
                :style="getCardStyle(item)"
                @click="viewLectureDetail(item.lectureId)"
              >
                <div class="card-content">
                  <div class="lecture-title">{{ item.title }}</div>
                  <div class="lecture-speaker">
                    <Avatar :size="24" icon={<UserOutlined />} />
                    <span>{{ item.speaker }}</span>
                  </div>
                  <div class="lecture-info">
                    <Tooltip title="讲座时间">
                      <div class="info-item">
                        <ClockCircleOutlined />
                        <span>{{ formatToDateTime(item.startTime) }}</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="讲座地点">
                      <div class="info-item">
                        <EnvironmentOutlined />
                        <span>{{ item.venueName || '待定' }}</span>
                      </div>
                    </Tooltip>
                  </div>
                  <div class="lecture-tags">
                    <TagsOutlined />
                    <div class="tags-container">
                      <template v-if="item.keywords">
                        {{ renderTags(item.keywords) }}
                      </template>
                      <span v-else>暂无标签</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <Empty v-else description="暂无推荐讲座" />
          </Spin>
        </TabPane>
        <TabPane key="itemCF" tab="讲座协同推荐">
          <Spin :spinning="loading">
            <div v-if="cardList.list.length > 0" class="card-list">
              <Card 
                v-for="item in cardList.list" 
                :key="item.lectureId" 
                hoverable 
                class="lecture-card"
                :style="getCardStyle(item)"
                @click="viewLectureDetail(item.lectureId)"
              >
                <div class="card-content">
                  <div class="lecture-title">{{ item.title }}</div>
                  <div class="lecture-speaker">
                    <Avatar :size="24" icon={<UserOutlined />} />
                    <span>{{ item.speaker }}</span>
                  </div>
                  <div class="lecture-info">
                    <Tooltip title="讲座时间">
                      <div class="info-item">
                        <ClockCircleOutlined />
                        <span>{{ formatToDateTime(item.startTime) }}</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="讲座地点">
                      <div class="info-item">
                        <EnvironmentOutlined />
                        <span>{{ item.venueName || '待定' }}</span>
                      </div>
                    </Tooltip>
                  </div>
                  <div class="lecture-tags">
                    <TagsOutlined />
                    <div class="tags-container">
                      <template v-if="item.keywords">
                        {{ renderTags(item.keywords) }}
                      </template>
                      <span v-else>暂无标签</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <Empty v-else description="暂无推荐讲座" />
          </Spin>
        </TabPane>
        <TabPane key="hybrid" tab="混合推荐">
          <Spin :spinning="loading">
            <div v-if="cardList.list.length > 0" class="card-list">
              <Card 
                v-for="item in cardList.list" 
                :key="item.lectureId" 
                hoverable 
                class="lecture-card"
                :style="getCardStyle(item)"
                @click="viewLectureDetail(item.lectureId)"
              >
                <div class="card-content">
                  <div class="lecture-title">{{ item.title }}</div>
                  <div class="lecture-speaker">
                    <Avatar :size="24" icon={<UserOutlined />} />
                    <span>{{ item.speaker }}</span>
                  </div>
                  <div class="lecture-info">
                    <Tooltip title="讲座时间">
                      <div class="info-item">
                        <ClockCircleOutlined />
                        <span>{{ formatToDateTime(item.startTime) }}</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="讲座地点">
                      <div class="info-item">
                        <EnvironmentOutlined />
                        <span>{{ item.venueName || '待定' }}</span>
                      </div>
                    </Tooltip>
                  </div>
                  <div class="lecture-tags">
                    <TagsOutlined />
                    <div class="tags-container">
                      <template v-if="item.keywords">
                        {{ renderTags(item.keywords) }}
                      </template>
                      <span v-else>暂无标签</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <Empty v-else description="暂无推荐讲座" />
          </Spin>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<style lang="less" scoped>
.lecture-recommend-container {
  padding: 12px;
  background-color: #f0f2f5;
  min-height: 100%;
  
  .recommend-header {
    margin-bottom: 16px;
    
    .header-content {
      padding: 8px 0;
      
      .title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      
      .subtitle {
        font-size: 14px;
        color: #666;
      }
    }
  }
  
  .recommend-content {
    .card-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      
      .lecture-card {
        width: calc(25% - 12px);
        transition: all 0.3s;
        
        @media (max-width: 1440px) {
          width: calc(33.33% - 12px);
        }
        
        @media (max-width: 992px) {
          width: calc(50% - 12px);
        }
        
        @media (max-width: 576px) {
          width: 100%;
        }
        
        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-4px);
        }
        
        .card-content {
          .lecture-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .lecture-speaker {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            
            span {
              margin-left: 8px;
              color: #666;
            }
          }
          
          .lecture-info {
            margin-bottom: 12px;
            
            .info-item {
              display: flex;
              align-items: center;
              margin-bottom: 4px;
              color: #666;
              
              span {
                margin-left: 8px;
              }
            }
          }
          
          .lecture-tags {
            display: flex;
            align-items: flex-start;
            
            .tags-container {
              display: flex;
              flex-wrap: wrap;
              margin-left: 8px;
            }
          }
        }
      }
    }
  }
}
</style> 