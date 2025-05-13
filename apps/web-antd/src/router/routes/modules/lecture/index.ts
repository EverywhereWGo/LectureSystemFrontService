import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ant-design:team-outlined',
      order: 20,
      title: '讲座管理',
    },
    name: 'LectureManagement',
    path: '/lecture',
    component: () => import('#/layouts/basic.vue'),
    redirect: '/lecture/list',
    children: [
      {
        name: 'LectureList',
        path: 'list',
        component: () => import('#/views/lecture/lecture-list/index.vue'),
        meta: {
          icon: 'ant-design:profile-outlined',
          keepAlive: true,
          title: '讲座列表',
        },
      },
      {
        name: 'VenueManagement',
        path: 'venue',
        component: () => import('#/views/lecture/venue/index.vue'),
        meta: {
          icon: 'ant-design:environment-outlined',
          keepAlive: true,
          title: '场地管理',
        },
      },
      {
        name: 'ReservationManagement',
        path: 'reservation',
        component: () => import('#/views/lecture/reservation/index.vue'),
        meta: {
          icon: 'ant-design:schedule-outlined',
          keepAlive: true,
          title: '预约管理',
        },
      },
      {
        name: 'CheckInManagement',
        path: 'check-in',
        component: () => import('#/views/lecture/check-in/index.vue'),
        meta: {
          icon: 'ant-design:check-circle-outlined',
          keepAlive: true,
          title: '签到管理',
        },
      },
      {
        name: 'LectureStatistics',
        path: 'statistics',
        component: () => import('#/views/lecture/statistics/index.vue'),
        meta: {
          icon: 'ant-design:bar-chart-outlined',
          keepAlive: true,
          title: '统计分析',
        },
      },
    ],
  },
];

export default routes;
