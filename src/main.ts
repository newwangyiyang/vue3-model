import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 引入全局配置
import { globalConfig } from './config/globalConfig';

createApp(App)
  .use(store)
  .use(router)
  .use(globalConfig.globalComponent)
  .use(globalConfig.globalProvider)
  .mount('#app');

console.log('first - commit');
console.log('second - commit');
console.log('third - commit');
