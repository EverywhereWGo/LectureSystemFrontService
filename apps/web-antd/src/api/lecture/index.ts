import type { PageResult } from '../common';
import type { Lecture, LectureForm, LectureQuery, Venue, VenueForm, VenueQuery } from './model';

import { requestClient } from '#/api/request';

/**
 * 讲座相关的API
 */

// 讲座列表API路径前缀
const LECTURE_API = '/api/lecture/schedule';

/**
 * 获取讲座列表
 * @param query 查询参数
 * @returns 讲座列表
 */
export function getLectureList(query: LectureQuery) {
  return requestClient.get<PageResult<Lecture>>(`${LECTURE_API}/list`, { params: query });
}

/**
 * 获取讲座详情
 * @param lectureId 讲座ID
 * @returns 讲座详情
 */
export function getLecture(lectureId: string | number) {
  return requestClient.get<Lecture>(`${LECTURE_API}/${lectureId}`);
}

/**
 * 新增讲座
 * @param data 讲座数据
 * @returns 结果
 */
export function addLecture(data: LectureForm) {
  return requestClient.post<void>(`${LECTURE_API}`, data);
}

/**
 * 修改讲座
 * @param data 讲座数据
 * @returns 结果
 */
export function updateLecture(data: LectureForm) {
  return requestClient.put<void>(`${LECTURE_API}`, data);
}

/**
 * 删除讲座
 * @param lectureIds 讲座ID列表
 * @returns 结果
 */
export function deleteLecture(lectureIds: (string | number)[]) {
  return requestClient.delete<void>(`${LECTURE_API}/${lectureIds.join(',')}`);
}

/**
 * 获取热门讲座列表
 * @param limit 限制数量
 * @returns 讲座列表
 */
export function getHotLectures(limit: number = 5) {
  return requestClient.get<Lecture[]>(`${LECTURE_API}/hot`, { params: { limit } });
}

/**
 * 获取推荐讲座列表
 * @param limit 限制数量
 * @returns 讲座列表
 */
export function getRecommendLectures(limit: number = 5) {
  return requestClient.get<Lecture[]>(`${LECTURE_API}/recommend`, { params: { limit } });
}

/**
 * 场地管理API路径前缀
 */
const VENUE_API = '/system/lecture/venue';

/**
 * 获取场地列表
 * @param query 查询参数
 * @returns 场地列表
 */
export function getVenueList(query: VenueQuery) {
  return requestClient.get<PageResult<Venue>>(`${VENUE_API}/list`, { params: query });
}

/**
 * 获取场地详情
 * @param venueId 场地ID
 * @returns 场地详情
 */
export function getVenue(venueId: string | number) {
  return requestClient.get<Venue>(`${VENUE_API}/${venueId}`);
}

/**
 * 新增场地
 * @param data 场地数据
 * @returns 结果
 */
export function addVenue(data: VenueForm) {
  return requestClient.post<void>(`${VENUE_API}`, data);
}

/**
 * 修改场地
 * @param data 场地数据
 * @returns 结果
 */
export function updateVenue(data: VenueForm) {
  return requestClient.put<void>(`${VENUE_API}`, data);
}

/**
 * 删除场地
 * @param venueIds 场地ID列表
 * @returns 结果
 */
export function deleteVenue(venueIds: (string | number)[]) {
  return requestClient.delete<void>(`${VENUE_API}/${venueIds.join(',')}`);
}
