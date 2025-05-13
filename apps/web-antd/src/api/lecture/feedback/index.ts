/**
 * 讲座反馈API接口
 */
import { request } from '../../../utils/request';

// API前缀枚举
export enum Api {
  LIST = '/lecture/feedback/list',
  GET = '/lecture/feedback',
  ADD = '/lecture/feedback',
  UPDATE = '/lecture/feedback',
  DELETE = '/lecture/feedback',
  EXPORT = '/lecture/feedback/export',
  PENDING = '/lecture/feedback/pending',
  MY_FEEDBACKS = '/lecture/feedback/my',
  LECTURE_FEEDBACKS = '/lecture/feedback/lecture',
}

/**
 * 讲座反馈参数接口
 */
export interface FeedbackParams {
  lectureId: number;
  userId: number;
  content: string;
  rating: number;
  isAnonymous: boolean;
}

/**
 * 获取待评价讲座列表
 * @param userId 用户ID
 * @param silent 是否显示错误信息
 * @returns 待评价讲座列表
 */
export function getPendingFeedbacksApi(userId: number, silent = false) {
  return request({
    url: `${Api.PENDING}/${userId}`,
    method: 'get',
  });
}

/**
 * 获取用户评价列表
 * @param userId 用户ID
 * @param silent 是否显示错误信息
 * @returns 用户评价列表
 */
export function getMyFeedbacksApi(userId: number, silent = false) {
  return request({
    url: `${Api.MY_FEEDBACKS}/${userId}`,
    method: 'get',
  });
}

/**
 * 获取讲座评价列表
 * @param lectureId 讲座ID，如果为0则获取所有讲座评价
 * @param params 分页参数
 * @param silent 是否显示错误信息
 * @returns 讲座评价列表
 */
export function getLectureFeedbacksApi(lectureId: number, params?: any, silent = false) {
  return request({
    url: `${Api.LECTURE_FEEDBACKS}/${lectureId}`,
    method: 'get',
    params,
  });
}

/**
 * 提交讲座评价
 * @param params 评价参数
 * @param silent 是否显示错误信息
 * @returns 操作结果
 */
export function submitFeedbackApi(params: FeedbackParams, silent = false) {
  return request({
    url: Api.ADD,
    method: 'post',
    data: params,
  });
}

/**
 * 更新讲座评价
 * @param feedbackId 评价ID
 * @param params 评价参数
 * @param silent 是否显示错误信息
 * @returns 操作结果
 */
export function updateFeedbackApi(feedbackId: number, params: Partial<FeedbackParams>, silent = false) {
  return request({
    url: `${Api.UPDATE}/${feedbackId}`,
    method: 'put',
    data: params,
  });
}

/**
 * 删除讲座评价
 * @param feedbackId 评价ID
 * @param silent 是否显示错误信息
 * @returns 操作结果
 */
export function deleteFeedbackApi(feedbackId: number, silent = false) {
  return request({
    url: `${Api.DELETE}/${feedbackId}`,
    method: 'delete',
  });
} 