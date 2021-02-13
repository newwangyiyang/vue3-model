export default {
  path: '/Login',
  name: 'Login',
  component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/index.vue'),
  meta: {
    title: '登录页',
    isLogin: false,
  },
};
