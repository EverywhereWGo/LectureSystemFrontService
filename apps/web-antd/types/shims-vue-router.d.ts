import 'vue-router';

declare module 'vue-router' {
  /**
   * 扩展路由元数据
   */
  interface RouteMeta {
    // 路由标题
    title?: string;
    // 是否忽略权限
    ignoreAuth?: boolean;
    // 权限角色列表
    roles?: string[];
    // 是否不缓存
    ignoreKeepAlive?: boolean;
    // Icon图标
    icon?: string;
    // 固定在标签页
    affix?: boolean;
    // 排序
    orderNo?: number;
    // 是否在tab中显示
    hideTab?: boolean;
    // 标签页是否可关闭
    closable?: boolean;
    // 是否在菜单中隐藏
    hideMenu?: boolean;
    // 是否展示全路径 例如完整的菜单路径
    showFullPath?: boolean;
    // 是否需要自动追加参数
    autoParamsAppend?: boolean;
    // 是否使用iframe展示
    frameSrc?: string;
    // iframe加载完成事件
    frameLoaded?: boolean;
    // 是否固定在选项卡上
    keepAlive?: boolean;
    // 所有父级路由
    allParentPath?: string[];
    // 当前激活的菜单
    currentActiveMenu?: string;
    // 使用动态路由
    dynamicLevel?: number;
    // 内部路由地址
    realPath?: string;
    // 外链
    isExternal?: boolean;
    // 是否忽略面包屑
    hideBreadcrumb?: boolean;
    // 是否单独拆分路由，提高权限控制粒度
    isSplitTabs?: boolean;
    // 当前路由的子路径是否使用缓存
    cacheChildrenPath?: string[];
    // 其他自定义元数据
    [key: string]: any;
  }
} 