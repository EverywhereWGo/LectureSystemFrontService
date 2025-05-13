import { useRouter } from 'vue-router';
import { PageEnum } from '@/enums/pageEnum';

/**
 * 页面跳转 hook
 * @returns 页面跳转相关方法
 */
export function usePage() {
  const router = useRouter();

  function openWindow(url: string, opt?: { target?: '_self' | '_blank' | string; noopener?: boolean; noreferrer?: boolean }) {
    const { target = '_blank', noopener = true, noreferrer = true } = opt || {};
    const features: string[] = [];

    noopener && features.push('noopener=yes');
    noreferrer && features.push('noreferrer=yes');

    window.open(url, target, features.join(','));
  }

  /**
   * 切换到指定页面
   * @param path 路径
   * @param params 参数
   * @param replace 是否替换当前页面
   */
  function go(path: string, params?: Record<string, any>, replace = false) {
    if (params) {
      router[replace ? 'replace' : 'push']({
        path,
        query: params,
      });
    } else {
      router[replace ? 'replace' : 'push']({ path });
    }
  }

  /**
   * 重定向到指定页面
   * @param path 路径
   * @param params 参数
   */
  function redirect(path: string, params?: Record<string, any>) {
    go(path, params, true);
  }

  /**
   * 重定向到登录页
   */
  function toLogin() {
    router.push({ path: PageEnum.BASE_LOGIN });
  }

  /**
   * 重定向到404页面
   */
  function to404() {
    router.push({ path: PageEnum.ERROR_PAGE });
  }

  /**
   * 重定向到首页
   */
  function toHome() {
    router.push({ path: PageEnum.BASE_HOME });
  }

  /**
   * 重新加载页面
   */
  function reload() {
    router.go(0);
  }

  /**
   * 返回上一页
   */
  function goBack() {
    router.go(-1);
  }

  return {
    go,
    redirect,
    toLogin,
    to404,
    toHome,
    openWindow,
    reload,
    goBack,
  };
}

/**
 * 页面跳转 hook 的 go 方法
 * @returns go 方法
 */
export function useGo() {
  const { go } = usePage();
  return go;
}

/**
 * 页面重定向 hook
 * @returns redirect 方法
 */
export function useRedirect() {
  const { redirect } = usePage();
  return redirect;
} 