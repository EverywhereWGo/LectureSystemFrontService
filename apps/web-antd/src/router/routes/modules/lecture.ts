import { LAYOUT } from '../../constants';

/**
 * 讲座管理模块路由
 */
const lecture = {
  path: '/lecture',
  name: 'Lecture',
  component: LAYOUT,
  redirect: '/lecture/lecture',
  meta: {
    orderNo: 100,
    icon: 'ion:calendar-outline',
    title: '讲座管理',
    ignoreAccess: true,
  },
  children: [
    {
      path: 'lecture',
      name: 'LectureManagement',
      component: () => import('@/views/lecture/lecture/index.vue'),
      meta: {
        title: '讲座管理',
        ignoreAccess: true,
      },
    },
    {
      path: 'venue',
      name: 'VenueManagement',
      component: () => import('@/views/lecture/venue/index.vue'),
      meta: {
        title: '场地管理',
        ignoreAccess: true,
      },
    },
    {
      path: 'reservation',
      name: 'ReservationManagement',
      component: () => import('@/views/lecture/reservation/index.vue'),
      meta: {
        title: '预约管理',
        ignoreAccess: true,
      },
    },
    {
      path: 'checkin',
      name: 'CheckInManagement',
      component: () => import('@/views/lecture/checkIn/index.vue'),
      meta: {
        title: '签到管理',
        ignoreAccess: true,
      },
    },
    {
      path: 'feedback',
      name: 'FeedbackManagement',
      component: () => import('@/views/lecture/feedback/index.vue'),
      meta: {
        title: '评价管理',
        ignoreAccess: true,
      },
    },
    {
      path: 'recommend',
      name: 'RecommendManagement',
      component: () => import('@/views/lecture/recommend/index.vue'),
      meta: {
        title: '推荐管理',
        ignoreAccess: true,
      },
    },
    {
      path: 'lecture/detail/:id',
      name: 'LectureDetail',
      component: () => import('@/views/lecture/detail/index.vue'),
      meta: {
        title: '讲座详情',
        hideMenu: true,
        ignoreAuth: true,
        ignoreAccess: true,
      },
    },
    {
      path: 'stats',
      name: 'StatsManagement',
      component: () => import('@/views/lecture/stats/index.vue'),
      meta: {
        title: '统计分析',
        ignoreAccess: true,
      },
    },
    {
      path: 'schedule',
      name: 'ScheduleManagement',
      component: () => import('@/views/lecture/schedule/index.vue'),
      meta: {
        title: '智能排期',
        ignoreAccess: true,
      },
    },
    {
      path: 'notification',
      name: 'NotificationManagement',
      component: () => import('@/views/lecture/notification/index.vue'),
      meta: {
        title: '通知管理',
        ignoreAccess: true,
      },
    },
    {
      path: 'notification/create',
      name: 'NotificationCreate',
      component: () => import('@/views/lecture/notification/create.vue'),
      meta: {
        title: '创建通知',
        hideMenu: true,
        ignoreAccess: true,
      },
    },
  ],
};

export default lecture; 