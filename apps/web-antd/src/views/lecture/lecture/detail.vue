<template>
  <div>
    <a-card title="讲座详情">
      <p>讲座详情页面</p>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const lectureId = route.params.id;
// 讲座详情组件逻辑
</script>

<style scoped>
/* 讲座详情样式 */
</style> 