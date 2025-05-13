import type { RouteRecordRaw } from 'vue-router';

// 定义模块类型
interface RouteModuleType {
  default: RouteRecordRaw | RouteRecordRaw[];
}

/**
 * 合并动态路由模块的默认导出
 * @param routeModules 动态导入的路由模块对象
 * @returns 合并后的路由配置数组
 */
function mergeRouteModules(
  routeModules: Record<string, unknown>,
): RouteRecordRaw[] {
  const mergedRoutes: RouteRecordRaw[] = [];

  // 添加调试日志
  console.log('合并路由模块:', Object.keys(routeModules));

  for (const routeModule of Object.values(routeModules)) {
    const moduleDefault = (routeModule as RouteModuleType)?.default;
    
    // 添加调试日志
    console.log('路由模块值:', moduleDefault);
    
    if (!moduleDefault) {
      console.warn('路由模块没有默认导出:', routeModule);
      continue;
    }
    
    if (Array.isArray(moduleDefault)) {
      console.log('合并数组路由:', moduleDefault.length);
      mergedRoutes.push(...moduleDefault);
    } else {
      console.log('合并单个路由:', moduleDefault.path);
      mergedRoutes.push(moduleDefault);
    }
  }

  console.log('合并后的路由总数:', mergedRoutes.length);
  return mergedRoutes;
}

export { mergeRouteModules };

export type { RouteModuleType };
