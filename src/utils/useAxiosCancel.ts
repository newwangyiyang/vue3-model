import { ref } from 'vue';
import { Canceler } from 'axios';

// 缓存当前取消队列
const cancelQueue = ref<Canceler[]>([]);
// canCelToken回调
const cancelCallback = (data?: string) => {
  if (!cancelQueue.value.length) return;
  for (const callabck of cancelQueue.value) {
    callabck(data);
  }
};

export default () => ({
  cancelQueue,
  cancelCallback,
});
