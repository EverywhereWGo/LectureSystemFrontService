import { defHttp } from '@/utils/http/axios';
import { RequestParam } from '@/types/axios';

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
  return defHttp.get(
    {
      url: `${Api.PENDING}/${userId}`,
    },
    {
      errorMessageMode: silent ? 'none' : 'message',
    }
  );
}

/**
 * 获取用户评价列表
 * @param userId 用户ID
 * @param silent 是否显示错误信息
 * @returns 用户评价列表
 */
export function getMyFeedbacksApi(userId: number, silent = false) {
  return defHttp.get(
    {
      url: `${Api.MY_FEEDBACKS}/${userId}`,
    },
    {
      errorMessageMode: silent ? 'none' : 'message',
    }
  );
}

/**
 * 获取讲座评价列表
 * @param lectureId 讲座ID，如果为0则获取所有讲座评价
 * @param params 分页参数
 * @param silent 是否显示错误信息
 * @returns 讲座评价列表
 */
export function getLectureFeedbacksApi(lectureId: number, params?: RequestParam, silent = false) {
  return defHttp.get(
    {
      url: `${Api.LECTURE_FEEDBACKS}/${lectureId}`,
      params,
    },
    {
      errorMessageMode: silent ? 'none' : 'message',
    }
  );
}

/**
 * 提交讲座评价
 * @param params 评价参数
 * @param silent 是否显示错误信息
 * @returns 操作结果
 */
export function submitFeedbackApi(params: FeedbackParams, silent = false) {
  return defHttp.post(
    {
      url: Api.ADD,
      params,
    },
    {
      errorMessageMode: silent ? 'none' : 'message',
    }
  );
}

/**
 * 更新讲座评价
 * @param feedbackId 评价ID
 * @param params 评价参数
 * @param silent 是否显示错误信息
 * @returns 操作结果
 */
export function updateFeedbackApi(feedbackId: number, params: Partial<FeedbackParams>, silent = false) {
  return defHttp.put(
    {
      url: `${Api.UPDATE}/${feedbackId}`,
      params,
    },
    {
      errorMessageMode: silent ? 'none' : 'message',
    }
  );
}

/**
 * 删除讲座评价
 * @param feedbackId 评价ID
 * @param silent 是否显示错误信息
 * @returns 操作结果
 */
export function deleteFeedbackApi(feedbackId: number, silent = false) {
  return defHttp.delete(
    {
      url: `${Api.DELETE}/${feedbackId}`,
    },
    {
      errorMessageMode: silent ? 'none' : 'message',
    }
  );
}

// 创建模拟数据函数，用于开发测试
export function _mock_getPendingFeedbacksApi() {
  return {
    code: 200,
    data: [
      {
        lectureId: 1,
        title: '人工智能与未来社会发展',
        speaker: '张教授',
        startTime: '2025-05-15 14:00:00',
        endTime: '2025-05-15 16:00:00',
        venueName: '综合楼报告厅',
        checkTime: '2025-05-15 14:05:23'
      },
      {
        lectureId: 2,
        title: '高等数学在工程中的应用',
        speaker: '李教授',
        startTime: '2025-05-20 10:00:00',
        endTime: '2025-05-20 12:00:00',
        venueName: '理学院报告厅',
        checkTime: '2025-05-20 09:55:12'
      }
    ]
  };
}

export function _mock_getMyFeedbacksApi() {
  return {
    code: 200,
    data: [
      {
        feedbackId: 1001,
        lectureId: 3,
        title: '经济全球化的机遇与挑战',
        speaker: '王教授',
        content: '讲座内容非常丰富，对经济全球化的分析很有深度，受益匪浅。',
        rating: 5,
        createTime: '2025-05-25 17:15:32',
        isAnonymous: false
      },
      {
        feedbackId: 1002,
        lectureId: 4,
        title: '现代文学赏析',
        speaker: '赵教授',
        content: '赵教授讲解生动，举例丰富，但内容偏基础，希望能有更深入的内容。',
        rating: 4,
        createTime: '2025-05-10 16:45:23',
        isAnonymous: true
      }
    ]
  };
}

export function _mock_getLectureFeedbacksApi() {
  return {
    code: 200,
    data: {
      rows: [
        {
          feedbackId: 1001,
          lectureId: 3,
          title: '经济全球化的机遇与挑战',
          speaker: '王教授',
          content: '讲座内容非常丰富，对经济全球化的分析很有深度，受益匪浅。',
          rating: 5,
          createTime: '2025-05-25 17:15:32',
          username: '张三',
          isAnonymous: false
        },
        {
          feedbackId: 1002,
          lectureId: 4,
          title: '现代文学赏析',
          speaker: '赵教授',
          content: '赵教授讲解生动，举例丰富，但内容偏基础，希望能有更深入的内容。',
          rating: 4,
          createTime: '2025-05-10 16:45:23',
          username: '匿名用户',
          isAnonymous: true
        },
        {
          feedbackId: 1003,
          lectureId: 3,
          title: '经济全球化的机遇与挑战',
          speaker: '王教授',
          content: '王教授讲解很清晰，但希望能有更多的案例分析。',
          rating: 4,
          createTime: '2025-05-26 09:12:45',
          username: '李四',
          isAnonymous: false
        },
        {
          feedbackId: 1004,
          lectureId: 4,
          title: '现代文学赏析',
          speaker: '赵教授',
          content: '很精彩的讲座，对我理解现代文学有很大帮助。',
          rating: 5,
          createTime: '2025-05-11 10:32:18',
          username: '匿名用户',
          isAnonymous: true
        }
      ],
      total: 4
    }
  };
} 