export default {
  path: '/Vue3Demo',
  name: 'Vue3Demo',
  component: () => import(/* webpackChunkName: "Vue3Demo" */ '@/views/Vue3Demo/index.vue'),
  meta: {
    title: 'Vue3Demo',
    isLogin: false,
  },
};