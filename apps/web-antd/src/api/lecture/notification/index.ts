/**
 * 讲座通知API接口
 */
import { request } from '../../../utils/request';

// API前缀枚举
export enum Api {
  LIST = '/lecture/notification/list',
  GET = '/lecture/notification',
  ADD = '/lecture/notification',
  EDIT = '/lecture/notification',
  DELETE = '/lecture/notification',
  READ = '/lecture/notification/read',
  UNREAD_COUNT = '/lecture/notification/unread/count',
  USER_NOTIFICATIONS = '/lecture/notification/user',
}

/**
 * 讲座通知对象接口
 */
export interface NotificationModel {
  notificationId?: number;
  title: string;
  content: string;
  type: string; // 通知类型：system=系统通知, lecture=讲座通知
  lectureId?: number; // 关联的讲座ID，可选
  senderId?: number; // 发送者ID
  sendTime?: string; // 发送时间
  isRead?: string; // 是否已读：Y=已读, N=未读
  status?: string; // 通知状态：0=待发送, 1=已发送, 2=已撤回
  receiverIds?: number[]; // 接收者ID列表
  createTime?: string;
  updateTime?: string;
}

/**
 * 查询通知列表
 * @param params 查询参数
 * @returns 通知列表
 */
export function getNotificationListApi(params?: any) {
  return request({
    url: Api.LIST,
    method: 'get',
    params,
  });
}

/**
 * 获取通知详情
 * @param notificationId 通知ID
 * @returns 通知详情
 */
export function getNotificationDetailApi(notificationId: number) {
  return request({
    url: `${Api.GET}/${notificationId}`,
    method: 'get',
  });
}

/**
 * 新增通知
 * @param data 通知数据
 * @returns 操作结果
 */
export function addNotificationApi(data: NotificationModel) {
  return request({
    url: Api.ADD,
    method: 'post',
    data,
  });
}

/**
 * 修改通知
 * @param data 通知数据
 * @returns 操作结果
 */
export function updateNotificationApi(data: NotificationModel) {
  return request({
    url: Api.EDIT,
    method: 'put',
    data,
  });
}

/**
 * 删除通知
 * @param notificationIds 通知ID数组
 * @returns 操作结果
 */
export function deleteNotificationApi(notificationIds: number[]) {
  return request({
    url: `${Api.DELETE}/${notificationIds}`,
    method: 'delete',
  });
}

/**
 * 获取用户通知列表
 * @param params 查询参数
 * @returns
 */
export function getUserNotificationsApi(params?: any) {
  return request({
    url: Api.USER_NOTIFICATIONS,
    method: 'get',
    params,
  });
}

/**
 * 标记通知为已读
 * @param notificationId 通知ID
 * @returns 操作结果
 */
export function markNotificationReadApi(notificationId: number) {
  return request({
    url: `${Api.READ}/${notificationId}`,
    method: 'put',
  });
}

/**
 * 获取未读通知数量
 * @returns 未读通知数量
 */
export function getUnreadNotificationCountApi() {
  return request({
    url: Api.UNREAD_COUNT,
    method: 'get',
  });
} 