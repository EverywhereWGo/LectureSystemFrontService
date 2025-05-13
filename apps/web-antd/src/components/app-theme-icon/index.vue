<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import { computed, unref, watch } from 'vue';

import { NIcon } from 'naive-ui';
import { get, isString } from 'lodash-es';

import { DarkModeToggle } from '../dark-mode';
import { useDesign } from '../../hooks/web/useDesign';
import { useRootSetting } from '../../hooks/setting/useRootSetting';
import { useAppStore } from '../../store/modules/app';

// 添加调试函数和初始化动作
const forceShowMenu = () => {
  // 获取存储在localStorage中的访问令牌
  const token = localStorage.getItem('Access-Token');
  
  if (token) {
    // 在控制台显示当前访问令牌
    console.log('当前访问令牌:', token);
    
    // 修改路由配置
    try {
      // 查找所有讲座模块路由
      const lectureRoutes = document.querySelectorAll('[data-lecture-route]');
      if (lectureRoutes.length > 0) {
        console.log('发现讲座路由元素:', lectureRoutes.length);
        // 强制显示讲座路由
        lectureRoutes.forEach(el => {
          (el as HTMLElement).style.display = 'block';
        });
      }
      
      // 强制刷新菜单
      const menuContainer = document.querySelector('.layout-menu');
      if (menuContainer) {
        console.log('刷新菜单容器');
        (menuContainer as HTMLElement).style.display = 'none';
        setTimeout(() => {
          (menuContainer as HTMLElement).style.display = 'block';
        }, 100);
      }
    } catch (error) {
      console.error('菜单操作失败:', error);
    }
  }
};

// 在组件挂载后执行
setTimeout(() => {
  forceShowMenu();
}, 3000);

const props = defineProps({
  // 字符串图标
  icon: {
    type: String,
    default: '',
  },
  // 前缀
  prefix: {
    type: String,
    default: '',
  },
  // 颜色
  color: {
    type: String,
    default: '',
  },
  // 大小
  size: {
    type: [Number, String],
    default: 16,
  },
});

const { prefixCls } = useDesign('app-icon');
const appStore = useAppStore();
const { getDarkMode } = useRootSetting();

const wrapStyleRef = computed((): CSSProperties => {
  const { size, color } = props;
  let fs = size;
  if (isString(size)) {
    fs = parseInt(size, 10);
  }

  return {
    color: color,
    fontSize: `${fs}px`,
  };
});

// 控制单独组件的亮暗模式
const getIconTheme = computed(() => {
  const appTheme = appStore.getTheme;
  return appTheme;
});

watch(
  () => getDarkMode.value,
  (theme) => {
    if (theme === 'dark') {
      document.body.setAttribute('theme', 'dark');
    } else {
      document.body.removeAttribute('theme');
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <span v-if="icon" :class="prefixCls" :style="wrapStyleRef">
    <slot v-if="$slots.default"></slot>
    <DarkModeToggle v-else-if="icon === 'DarkModeToggle'" />
    <NIcon v-else>
      <svg
        aria-hidden="true"
        class="vben-svg-icon"
        :style="{ width: size + 'px', height: size + 'px' }"
      >
        <use :xlink:href="`#icon-${icon}`" />
      </svg>
    </NIcon>
  </span>
</template> 