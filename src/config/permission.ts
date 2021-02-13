/**
 * 简易版登录校验，某些页面查看必须在登录状态下进行查看
 * store2 可接口本地持久化插件，对登录态进行逻辑处理
 * 需要在路由声明中确认当前路由是否需要登录态 => meta: { isLogin: true }
 */
import router from '@/router';
import store from '@/store';
import s from 'store2';
import useAxiosCancel from '@/utils/useAxiosCancel';

import { storeMutations } from '@/store/contant';

const whiteList = ['/Login']; // 白名单列表
const openPermissionLogin = true; // 是否开启登录态校验

const { cancelCallback } = useAxiosCancel();

router.beforeEach(async (to, from, next) => {
  const { title, isLogin } = to.meta;
  document.title = title || 'vue3-model';
  // 取消缓存队列中未执行的请求
  cancelCallback();
  // 开启权限校验
  if (openPermissionLogin && isLogin) {
    // to.path === '/Login' => 防止用户重复登陆
    const token = s('token');
    if (token) {
      if (to.path === '/Login') {
        // 已经登录，跳转到首页
        next({
          path: '/',
        });
      } else {
        // 获取用户信息
        const hasGetUserToken = store.getters?.user?.token;
        if (hasGetUserToken) {
          next();
        } else {
          try {
            // TODO: 接口连调验证 get user info
            // await store.dispatch(`user/${getUesrStateByTokenAsync}`, token);
            store.commit(`user/${storeMutations.user.updateToken}`, s('token'));
            next();
          } catch (error) {
            // 清除用户信息，退出登录，跳转登录页
            store.commit(`user/${storeMutations.user.resetUserState}`);
            next(`/Login?redirect=${to.path}`);
          }
        }
      }
    } else {
      /* has no token */
      if (whiteList.indexOf(to.path) !== -1) {
        // 白名单中，无需验证
        next();
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/Login?redirect=${to.path}`);
      }
    }
  } else {
    // 未开启权限，放开所有
    next();
  }
});
