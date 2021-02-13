import { IModule } from '@/type/ComponentDataType';
import { createStore } from 'vuex';
import getters from './getters';

// 获取modules目录下所有的module(文件名即key值)
const files = require.context('./modules', false, /\.ts$/);
const modules: IModule = {};
files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.ts)/g, '')] = files(key).default;
});

export default createStore({
  getters,
  modules,
});
