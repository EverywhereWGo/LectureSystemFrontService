/**
 * 讲座推荐API接口
 */
import { request } from '../../utils/request';

// 定义讲座类型
export interface LectureVo {
  lectureId: string | number;
  title: string;
  content?: string;
  speaker: string;
  startTime: string;
  endTime?: string;
  registrationDeadline?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  venueName?: string;
  venueLocation?: string;
  keywords?: string;
  status?: string | number;
}

enum Api {
  GetHotRecommend = '/lecture/recommend/hot',
  GetContentRecommend = '/lecture/recommend/content',
  GetUserCFRecommend = '/lecture/recommend/userCF',
  GetItemCFRecommend = '/lecture/recommend/itemCF',
  GetHybridRecommend = '/lecture/recommend/hybrid',
  GetUserTags = '/lecture/recommend/userTags',
  GetHotTags = '/lecture/recommend/hotTags',
  GetByTags = '/lecture/recommend/byTags',
  GetInterestScore = '/lecture/recommend/interestScore',
}

/**
 * 获取热门推荐讲座
 */
export function getHotRecommendApi(params: { days?: number; limit?: number }) {
  return request({
    url: '/lecture/recommend/hot',
    method: 'get',
    params,
  });
}

/**
 * 获取基于内容的推荐讲座
 */
export function getContentRecommendApi(params: { tags?: string[]; limit?: number }) {
  return request({
    url: '/lecture/recommend/content',
    method: 'get',
    params,
  });
}

/**
 * 获取基于用户协同过滤的推荐讲座
 */
export function getUserCFRecommendApi(params: { limit?: number }) {
  return request({
    url: '/lecture/recommend/userCF',
    method: 'get',
    params,
  });
}

/**
 * 获取基于物品协同过滤的推荐讲座
 */
export function getItemCFRecommendApi(params: { limit?: number }) {
  return request({
    url: '/lecture/recommend/itemCF',
    method: 'get',
    params,
  });
}

/**
 * 获取混合推荐讲座
 */
export function getHybridRecommendApi(params: { limit?: number }) {
  return request({
    url: '/lecture/recommend/hybrid',
    method: 'get',
    params,
  });
}

/**
 * 获取用户偏好标签
 */
export function getUserTagsApi() {
  return request({
    url: '/lecture/recommend/userTags',
    method: 'get',
  });
}

/**
 * 获取热门标签
 */
export function getHotTagsApi(params?: {
  limit?: number;
}) {
  return request({
    url: '/lecture/recommend/hotTags',
    method: 'get',
    params,
  });
}

/**
 * 根据标签获取推荐讲座
 */
export function getByTagsApi(data: string[], params?: {
  limit?: number;
}) {
  return request({
    url: '/lecture/recommend/byTags',
    method: 'post',
    data,
    params,
  });
}

/**
 * 获取用户对讲座的兴趣分数
 */
export function getInterestScoreApi(lectureId: number | string) {
  return request({
    url: `/lecture/recommend/interestScore/${lectureId}`,
    method: 'get',
  });
} 