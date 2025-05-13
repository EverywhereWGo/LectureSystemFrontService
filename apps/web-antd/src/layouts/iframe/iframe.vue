<template>
  <div class="iframe-view" v-loading="loading">
    <iframe
      :src="frameSrc"
      :frameborder="0"
      :scrolling="scrolling"
      ref="frameRef"
      @load="onFrameLoad"
      class="w-full h-full"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  frameSrc: {
    type: String,
    default: '',
  },
  scrolling: {
    type: String,
    default: 'auto',
  },
});

const loading = ref(true);
const frameRef = ref<HTMLFrameElement | null>(null);
const route = useRoute();

const frameSrc = computed(() => {
  const routeParams = unref(route).params;
  const { frameSrc: propFrameSrc } = props;
  if (propFrameSrc) {
    return propFrameSrc;
  }
  if (routeParams?.frameSrc) {
    return routeParams.frameSrc as string;
  }
  return '';
});

function onFrameLoad() {
  loading.value = false;
}

onMounted(() => {
  loading.value = true;
});
</script>

<style lang="less" scoped>
.iframe-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 