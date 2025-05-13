/**
 * 用户行为跟踪API接口
 */
import { request } from '../../utils/request';

// 定义行为类型枚举
export enum BehaviorType {
  VIEW = 'view', // 查看讲座
  RESERVE = 'reserve', // 预约讲座
  CHECKIN = 'checkin', // 签到
  FEEDBACK = 'feedback', // 评价
  SEARCH = 'search', // 搜索
  SHARE = 'share', // 分享
}

// 用户行为参数接口
export interface UserBehaviorParams {
  userId: number;
  lectureId: number;
  behaviorType: BehaviorType;
  detail?: string; // 额外详情，例如搜索内容
  weight?: number; // 行为权重，默认由后端设置
}

// API前缀枚举
export enum Api {
  RECORD = '/lecture/behavior/record',
  GET_USER_BEHAVIOR = '/lecture/behavior/user',
  GET_LECTURE_BEHAVIOR = '/lecture/behavior/lecture',
  GET_BEHAVIOR_STATS = '/lecture/behavior/stats',
}

/**
 * 记录用户行为
 * @param params 用户行为参数
 * @param silent 是否显示错误信息
 * @returns 操作结果
 */
export function recordUserBehaviorApi(params: UserBehaviorParams, silent = false) {
  return request({
    url: Api.RECORD,
    method: 'post',
    data: params,
  });
}

/**
 * 获取用户行为记录
 * @param userId 用户ID
 * @param params 分页参数
 * @param silent 是否显示错误信息
 * @returns 用户行为记录列表
 */
export function getUserBehaviorApi(userId: number, params?: any, silent = false) {
  return request({
    url: `${Api.GET_USER_BEHAVIOR}/${userId}`,
    method: 'get',
    params,
  });
}

/**
 * 获取讲座行为统计
 * @param lectureId 讲座ID
 * @param silent 是否显示错误信息
 * @returns 讲座行为统计数据
 */
export function getLectureBehaviorStatsApi(lectureId: number, silent = false) {
  return request({
    url: `${Api.GET_LECTURE_BEHAVIOR}/${lectureId}`,
    method: 'get',
  });
}

/**
 * 获取全局行为统计数据
 * @param params 查询参数
 * @param silent 是否显示错误信息
 * @returns 全局行为统计数据
 */
export function getBehaviorStatsApi(params?: any, silent = false) {
  return request({
    url: Api.GET_BEHAVIOR_STATS,
    method: 'get',
    params,
  });
} 