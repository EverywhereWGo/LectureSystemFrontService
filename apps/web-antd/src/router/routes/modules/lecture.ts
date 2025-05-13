import type { AppRouteModule } from '@/router/types';
import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

/**
 * 讲座模块路由
 */
const lecture: AppRouteModule = {
  path: '/lecture',
  name: 'Lecture',
  component: LAYOUT,
  redirect: '/lecture/recommend',
  meta: {
    orderNo: 50,
    icon: 'ion:school-outline',
    title: t('routes.demo.lecture.moduleName'),
    ignoreAuth: false,
  },
  children: [
    {
      path: 'lecture',
      name: 'LectureMgr',
      component: () => import('@/views/lecture/lecture/index.vue'),
      meta: {
        title: t('routes.demo.lecture.lecture'),
        ignoreKeepAlive: false,
        roles: [RoleEnum.ADMIN, RoleEnum.SUPER],
      },
    },
    {
      path: 'venue',
      name: 'LectureVenue',
      component: () => import('@/views/lecture/venue/index.vue'),
      meta: {
        title: t('routes.demo.lecture.venue'),
        ignoreKeepAlive: false,
        roles: [RoleEnum.ADMIN, RoleEnum.SUPER],
      },
    },
    {
      path: 'reservation',
      name: 'LectureReservation',
      component: () => import('@/views/lecture/reservation/index.vue'),
      meta: {
        title: t('routes.demo.lecture.reservation'),
        ignoreKeepAlive: false,
      },
    },
    {
      path: 'check-in',
      name: 'LectureCheckIn',
      component: () => import('@/views/lecture/checkIn/index.vue'),
      meta: {
        title: t('routes.demo.lecture.checkIn'),
        ignoreKeepAlive: false,
      },
    },
    {
      path: 'feedback',
      name: 'LectureFeedback',
      component: () => import('@/views/lecture/feedback/index.vue'),
      meta: {
        title: t('routes.demo.lecture.feedback'),
        ignoreKeepAlive: false,
      },
    },
    {
      path: 'recommend',
      name: 'LectureRecommend',
      component: () => import('@/views/lecture/recommend/index.vue'),
      meta: {
        title: t('routes.demo.lecture.recommend'),
        ignoreKeepAlive: false,
        roles: [RoleEnum.TEST],
      },
    },
    {
      path: 'lecture/detail/:id',
      name: 'LectureDetail',
      component: () => import('@/views/lecture/recommend/detail.vue'),
      meta: {
        title: t('routes.demo.lecture.detail'),
        ignoreKeepAlive: false,
        hideMenu: true,
        showMenu: false,
        hideTab: false,
        currentActiveMenu: '/lecture/recommend',
      },
    },
    {
      path: 'stats',
      name: 'LectureStats',
      component: () => import('@/views/lecture/stats/index.vue'),
      meta: {
        title: t('routes.demo.lecture.stats'),
        ignoreKeepAlive: false,
        roles: [RoleEnum.ADMIN, RoleEnum.SUPER],
      },
    },
    {
      path: 'schedule',
      name: 'LectureSchedule',
      component: () => import('@/views/lecture/schedule/index.vue'),
      meta: {
        title: t('routes.demo.lecture.schedule'),
        ignoreKeepAlive: false,
        roles: [RoleEnum.ADMIN],
      },
    },
    {
      path: 'notification',
      name: 'LectureNotification',
      component: () => import('@/views/lecture/notification/index.vue'),
      meta: {
        title: t('routes.demo.lecture.notification'),
        ignoreKeepAlive: false,
      },
    },
    {
      path: 'recommender',
      name: 'LectureRecommender',
      component: () => import('@/views/lecture/recommender/index.vue'),
      meta: {
        title: t('routes.demo.lecture.recommender'),
        ignoreKeepAlive: false,
        roles: [RoleEnum.ADMIN, RoleEnum.SUPER],
      },
    },
  ],
};

export default lecture; 