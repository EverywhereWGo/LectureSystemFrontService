/**
 * 页面路径枚举
 */
export enum PageEnum {
  // 基础路由
  BASE_HOME = '/dashboard',
  BASE_LOGIN = '/login',
  
  // 错误页面
  ERROR_PAGE = '/exception/404',
  ERROR_PAGE_403 = '/exception/403',
  ERROR_PAGE_500 = '/exception/500',
  
  // 重定向页面
  REDIRECT = '/redirect',
  
  // 个人中心
  ACCOUNT_CENTER = '/account/center',
  ACCOUNT_SETTING = '/account/settings',
  
  // 讲座相关页面
  LECTURE_LIST = '/lecture/lecture',
  LECTURE_DETAIL = '/lecture/lecture/detail',
  LECTURE_RECOMMEND = '/lecture/recommend',
} 