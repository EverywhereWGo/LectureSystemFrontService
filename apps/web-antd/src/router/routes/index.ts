import type { RouteRecordRaw } from 'vue-router';

import { mergeRouteModules, traverseTreeValues } from '@vben/utils';

import { coreRoutes, fallbackNotFoundRoute } from './core';
import { workflowIframeRoutes } from './workflow-iframe';

// 导入讲座管理模块
import lecture from './modules/lecture';

// 非懒加载方式导入路由模块
const dynamicRoutes: RouteRecordRaw[] = [lecture];

/** 外部路由列表，访问这些页面可以不需要Layout，可能用于内嵌在别的系统(不会显示在菜单中) */
const staticRoutes: RouteRecordRaw[] = [];
const externalRoutes: RouteRecordRaw[] = [];

/** 路由列表，由基本路由、外部路由和404兜底路由组成
 *  无需走权限验证（会一直显示在菜单中） */
const routes: RouteRecordRaw[] = [
  ...coreRoutes,
  ...externalRoutes,
  ...workflowIframeRoutes,
  fallbackNotFoundRoute,
];

/** 基本路由(登录, 第三方登录, 注册等) + workflowIframe路由不需要拦截  */
const basicRoutes = [...coreRoutes, ...workflowIframeRoutes];
/** 基本路由列表，这些路由不需要进入权限拦截 */
const coreRouteNames = traverseTreeValues(basicRoutes, (route) => route.name);

/** 有权限校验的路由列表，包含动态路由和静态路由 */
const accessRoutes = [...dynamicRoutes, ...staticRoutes];

/**
 * 加载路由模块
 */
function loadRouteModule() {
  const modules = import.meta.glob<{ default: RouteRecordRaw }>('./modules/**/*.ts', {
    eager: true,
  });

  return Object.keys(modules).reduce<RouteRecordRaw[]>((list, key) => {
    const mod = modules[key].default;
    if (mod) {
      list.push(mod);
    }
    return list;
  }, []);
}

export { accessRoutes, coreRouteNames, routes };
