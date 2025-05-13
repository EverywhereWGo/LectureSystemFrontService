import type { BaseEntity, ID, PageQuery } from '../common';

/**
 * 讲座查询参数
 */
export interface LectureQuery extends PageQuery {
  /** 讲座标题 */
  title?: string;
  /** 讲者 */
  speaker?: string;
  /** 讲座类型 */
  lectureType?: string;
  /** 状态 */
  status?: string;
  /** 审核状态 */
  reviewStatus?: string;
  /** 是否推荐 */
  isRecommend?: string;
  /** 场地ID */
  venueId?: ID;
}

/**
 * 讲座对象
 */
export interface Lecture extends BaseEntity {
  /** 讲座ID */
  lectureId: ID;
  /** 讲座标题 */
  title: string;
  /** 讲座内容（富文本） */
  content?: string;
  /** 讲者 */
  speaker: string;
  /** 讲者简介 */
  speakerIntro?: string;
  /** 讲座类型 */
  lectureType?: string;
  /** 讲座类型名称 */
  lectureTypeName?: string;
  /** 开始时间 */
  startTime: string;
  /** 结束时间 */
  endTime: string;
  /** 场地ID */
  venueId: ID;
  /** 场地名称 */
  venueName?: string;
  /** 容量 */
  capacity?: number;
  /** 状态（draft草稿、waiting待审核、finish已发布等） */
  status: string;
  /** 审核状态 */
  reviewStatus?: string;
  /** 关键词（用于搜索） */
  keywords?: string;
  /** 预计参与人数 */
  expectedAttendance?: number;
  /** 所需设备（JSON格式） */
  requiredEquipment?: string;
  /** 是否推荐（Y是 N否） */
  isRecommend?: string;
  /** 浏览次数 */
  viewCount?: number;
}

/**
 * 讲座表单对象
 */
export interface LectureForm extends Omit<Lecture, 'lectureId'> {
  lectureId?: ID;
}

/**
 * 场地对象
 */
export interface Venue extends BaseEntity {
  /** 场地ID */
  venueId: ID;
  /** 场地名称 */
  venueName: string;
  /** 场地地址 */
  address?: string;
  /** 容量 */
  capacity: number;
  /** 设备信息 */
  equipment?: string;
  /** 场地状态 */
  status: string;
  /** 场地描述 */
  description?: string;
}

/**
 * 场地查询参数
 */
export interface VenueQuery extends PageQuery {
  /** 场地名称 */
  venueName?: string;
  /** 场地状态 */
  status?: string;
}

/**
 * 场地表单对象
 */
export interface VenueForm extends Omit<Venue, 'venueId'> {
  venueId?: ID;
} 