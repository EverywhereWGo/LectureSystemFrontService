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
    orderNo: 5000,
    icon: 'ion:apps-outline',
    title: '讲座管理',
  },
  children: [
    {
      path: 'lecture',
      name: 'LectureManagement',
      component: () => import('#/views/lecture/lecture/index.vue'),
      meta: {
        title: '讲座管理',
      },
    },
    {
      path: 'venue',
      name: 'VenueManagement',
      component: () => import('#/views/lecture/venue/index.vue'),
      meta: {
        title: '场地管理',
      },
    },
    {
      path: 'reservation',
      name: 'ReservationManagement',
      component: () => import('#/views/lecture/reservation/index.vue'),
      meta: {
        title: '预约管理',
      },
    },
    {
      path: 'checkin',
      name: 'CheckInManagement',
      component: () => import('#/views/lecture/checkin/index.vue'),
      meta: {
        title: '签到管理',
      },
    },
    {
      path: 'feedback',
      name: 'FeedbackManagement',
      component: () => import('#/views/lecture/feedback/index.vue'),
      meta: {
        title: '评价管理',
      },
    },
    {
      path: 'recommend',
      name: 'RecommendManagement',
      component: () => import('#/views/lecture/recommend/index.vue'),
      meta: {
        title: '推荐管理',
      },
    },
    {
      path: 'lecture/detail/:id',
      name: 'LectureDetail',
      component: () => import('#/views/lecture/lecture/detail.vue'),
      meta: {
        title: '讲座详情',
        hideMenu: true,
        ignoreAuth: true,
      },
    },
    {
      path: 'stats',
      name: 'StatsManagement',
      component: () => import('#/views/lecture/stats/index.vue'),
      meta: {
        title: '统计分析',
      },
    },
    {
      path: 'schedule',
      name: 'ScheduleManagement',
      component: () => import('#/views/lecture/schedule/index.vue'),
      meta: {
        title: '智能排期',
      },
    },
    {
      path: 'notification',
      name: 'NotificationManagement',
      component: () => import('#/views/lecture/notification/index.vue'),
      meta: {
        title: '通知管理',
      },
    },
    {
      path: 'notification/create',
      name: 'NotificationCreate',
      component: () => import('#/views/lecture/notification/create.vue'),
      meta: {
        title: '创建通知',
        hideMenu: true,
      },
    },
  ],
};

export default lecture; 