import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Page404 from '@/views/404.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      isLogin: true,
    },
  },
];

const routerContext = require.context('./views', false, /\.ts$/);
routerContext.keys().forEach((route) => {
  const routerModule = routerContext(route);
  // 兼容 import export 和 require module.export 两种规范
  routes.push(routerModule.default || routerModule);
});
// 注入404页面
routes.push({ path: '/:pathMatch(.*)*', name: 'not-found', component: Page404 });

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
