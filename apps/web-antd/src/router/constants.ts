export const USER = 'user';
export const ADMIN = 'admin';
export const SUPER_ADMIN = 'super_admin';

export const LAYOUT = () => import('../layouts/basic.vue');
export const IFRAME = () => import('../layouts/iframe/iframe.vue');
export const BLANK = () => import('../layouts/auth.vue');

export const PARENT_LAYOUT = () =>
  Promise.resolve({
    name: 'ParentLayout',
  });

// 路由白名单
export const whitePathList: string[] = ['/login', '/register']; 