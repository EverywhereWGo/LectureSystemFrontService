import type { RouteRecordStringComponent } from '@vben/types';
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '@vben/locales';
import { BasicLayout } from '#/layouts';
import { AppRouteRecordRaw } from '@vben/types';

/**
 * 该文件放非后台返回的路由 比如个人中心 等需要跳转显示的页面
 */
const localRoutes: RouteRecordStringComponent[] = [
  {
    component: '/_core/profile/index',
    meta: {
      icon: 'mingcute:profile-line',
      title: $t('ui.widgets.profile'),
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'Profile',
    path: '/profile',
  },
  {
    component: '/system/oss-config/index',
    meta: {
      activePath: '/system/oss',
      icon: 'ant-design:setting-outlined',
      title: 'oss配置',
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'OssConfig',
    path: '/system/oss-config',
  },
  {
    component: '/tool/gen/edit-gen',
    meta: {
      activePath: '/tool/gen',
      icon: 'tabler:code',
      title: '生成配置',
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'GenConfig',
    path: '/code-gen/edit/:tableId',
  },
  {
    component: '/system/role-assign/index',
    meta: {
      activePath: '/system/role',
      icon: 'eos-icons:role-binding-outlined',
      title: '分配角色',
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'RoleAssign',
    path: '/system/role-assign/:roleId',
  },
  {
    component: '/workflow/components/flow-designer',
    meta: {
      activePath: '/workflow/processDefinition',
      icon: 'fluent-mdl2:flow',
      title: '流程设计',
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'WorkflowDesigner',
    path: '/workflow/designer',
  },
  /**
   * 需要添加iframe路由 同目录的./workflow-iframe.ts
   */
  {
    component: 'workflow/leave/leave-form',
    meta: {
      icon: 'flat-color-icons:leave',
      title: '请假申请',
      activePath: '/demo/leave',
      hideInMenu: true,
      requireHomeRedirect: true,
    },
    name: 'WorkflowLeaveIndex',
    path: '/workflow/leaveEdit/index',
  },
];

/**
 * 这里放本地路由
 */
export const localMenuList: AppRouteRecordRaw[] = [
  {
    component: 'BasicLayout',
    meta: {
      order: -1,
      title: 'page.dashboard.title',
      // 不使用基础布局（仅在顶级生效）
      noBasicLayout: true,
    },
    name: 'Dashboard',
    path: '/',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
      {
        name: 'VbenDocument',
        path: '/vben-admin/document',
        component: 'IFrameView',
        meta: {
          icon: 'lucide:book-open-text',
          iframeSrc: 'https://dapdap.top',
          keepAlive: true,
          title: $t('demos.vben.document'),
        },
      },
      {
        name: 'V5UpdateLog',
        path: '/changelog',
        component: '/演示使用自行删除/changelog/index',
        meta: {
          icon: 'lucide:book-open-text',
          keepAlive: true,
          title: '更新记录',
          badge: '1.3.0',
          badgeVariants: '#CC0033',
        },
      },
    ],
  },
  {
    component: '/_core/about/index',
    meta: {
      icon: 'lucide:copyright',
      order: 9999,
      title: $t('demos.vben.about'),
    },
    name: 'About',
    path: '/vben-admin/about',
  },
  ...localRoutes,
  {
    component: 'BasicLayout',
    meta: {
      hideChildrenInMenu: false,
      icon: 'ion:calendar-outline',
      title: '讲座管理平台',
      orderNo: 90,
    },
    name: 'LectureAdmin',
    path: '/lecture',
    children: [
      {
        component: '/views/lecture/lecture/index.vue',
        meta: {
          hideChildrenInMenu: false,
          icon: 'ion:calendar-outline',
          title: '讲座管理',
          ignoreAuth: true,
          ignoreAccess: true,
        },
        name: 'LectureManagement',
        path: 'lecture',
      },
      {
        component: '/views/lecture/venue/index.vue',
        meta: {
          hideChildrenInMenu: false,
          icon: 'ion:location-outline',
          title: '场地管理',
          ignoreAuth: true,
          ignoreAccess: true,
        },
        name: 'VenueManagement',
        path: 'venue',
      },
      {
        component: '/views/lecture/reservation/index.vue',
        meta: {
          hideChildrenInMenu: false,
          icon: 'ion:book-outline',
          title: '预约管理',
          ignoreAuth: true,
          ignoreAccess: true,
        },
        name: 'ReservationManagement',
        path: 'reservation',
      },
      {
        component: '/views/lecture/detail/index.vue',
        meta: {
          hideInMenu: true,
          title: '讲座详情',
          ignoreAuth: true,
          ignoreAccess: true,
        },
        name: 'LectureDetail',
        path: 'lecture/detail/:id',
      },
      {
        component: '/views/lecture/stats/index.vue',
        meta: {
          hideChildrenInMenu: false,
          icon: 'ion:stats-chart-outline',
          title: '统计分析',
          ignoreAuth: true,
          ignoreAccess: true,
        },
        name: 'StatsManagement',
        path: 'stats',
      },
      {
        component: '/views/lecture/recommend/index.vue',
        meta: {
          hideChildrenInMenu: false,
          icon: 'ion:thumbs-up-outline',
          title: '推荐管理',
          ignoreAuth: true,
          ignoreAccess: true,
        },
        name: 'RecommendManagement',
        path: 'recommend',
      },
    ],
  }
];
