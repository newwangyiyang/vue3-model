import { App } from 'vue';
import { Button, Toast, Swipe, SwipeItem, CountDown, Divider, Field, Cell, CellGroup, Form } from 'vant';
import vhCheck from 'vh-check';
import service from './axios';
import { AxiosInstance } from 'axios';
// 1、引入样式: tailwind.css & vant组件样式
import 'tailwindcss/tailwind.css';
import 'vant/lib/index.css';
// 1.1 登录校验
import '@/config/permission';
// 1.2 开发环境下加载VConsole
import { loadVConsoleScript } from '@/utils';
process.env.NODE_ENV === 'development' && loadVConsoleScript();
// 2、处理100vh问题
vhCheck('browser-address-bar');
// 3、导出基础全局配置 => 配置依赖Vue全局实例 const app = createApp();
export const globalConfig = {
  globalComponent: {
    install(app: App) {
      // 4、声明引入全局vant组件
      app
        .use(Button)
        .use(Toast)
        .use(Swipe)
        .use(SwipeItem)
        .use(CountDown)
        .use(Divider)
        .use(Field)
        .use(Cell)
        .use(CellGroup)
        .use(Form);
    },
  },
  globalProvider: {
    install(app: App) {
      // 5、全局provid，使用需inject，替代Vue2.0时代的Vue.prototype时绑定全局属性
      app.provide<Toast>('Toast', Toast).provide<AxiosInstance>('service', service);
    },
  },
};
