<!-- TOC -->

- [1. 集成依赖`eslint-config-alloy`：typescript + prettier 自动格式化](#1-集成依赖eslint-config-alloytypescript--prettier-自动格式化)
- [2. axios 简单基于本地业务进行封装](#2-axios-简单基于本地业务进行封装)
- [3. vh-check: 处理 safari/chrome 浏览器工具栏 100vh 问题](#3-vh-check-处理-safarichrome-浏览器工具栏-100vh-问题)
- [4. postcss-px-to-viewport vw => viewport 移动端适配](#4-postcss-px-to-viewport-vw--viewport-移动端适配)
- [5. vant:](#5-vant)
- [6. tailwind.css CSS UI 框架](#6-tailwindcss-css-ui-框架)
- [7. store2 本地存储插件](#7-store2-本地存储插件)
- [8. dayjs 日期格式化插件](#8-dayjs-日期格式化插件)
- [9. 代码压缩`gzip`: compression-webpack-plugin](#9-代码压缩gzip-compression-webpack-plugin)
- [10. VConsole](#10-vconsole)

<!-- /TOC -->

### 1. 集成依赖`eslint-config-alloy`：typescript + prettier 自动格式化

- [git 地址](https://github.com/AlloyTeam/eslint-config-alloy/blob/master/README.zh-CN.md#typescript)

### 2. axios 简单基于本地业务进行封装

- 简单的 cancelToken 封装

### 3. vh-check: 处理 safari/chrome 浏览器工具栏 100vh 问题

- [git 地址](https://github.com/Hiswe/vh-check)

```javascript
// 全局应用
vhCheck('browser-address-bar');
// css中使用
main {
  min-height: 100vh;
  /* 兼容不支持 var 变量的浏览器 (<= IE11) */
  min-height: calc(100vh - var(--browser-address-bar, 0px));
  /* 修正后的 100vh */
}
```

### 4. postcss-px-to-viewport vw => viewport 移动端适配

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      // 视窗的宽度，对应的是我们设计稿的宽度，我们公司用的是375
      viewportWidth: 375,
      // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      // viewportHeight: 1334,
      // 指定`px`转换为视窗单位值的小数位数
      unitPrecision: 3,
      // 指定需要转换成的视窗单位，建议使用vw
      viewportUnit: 'vw',
      // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      selectorBlackList: ['.ignore', '.van-'],
      // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      minPixelValue: 1,
      // 允许在媒体查询中转换`px`
      mediaQuery: false,
    },
  },
};
```

### 5. vant:

- [中文文档](https://youzan.github.io/vant/v3/#/zh-CN/quickstart)
- 注意: 如果 vant 组件样式兼容问题 需配置 postcss-px-to-viewport => selectorBlackList 白名单 ['.van-']
- 由于使用了 typescript，按需加载需使用`ts-import-plugin`插件

```typescript
import { Row, Col, Icon, Cell, CellGroup } from 'vant';
export default defineComponent({
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
  },
});
```

### 6. tailwind.css CSS UI 框架

- 开发后台管理项目极力推荐使用，减少 css 的开发工作量
- 自带样式重置方案
- 为防止设置样式跟 vant 组件样式冲突，可设置`{ important: true }`配置项
- [官方地址](https://tailwindcss.com/docs/installation)
- [掘金博客](https://juejin.cn/post/6883874356041252878)

- 响应式

```scss
// md:text-lg
/* Small (sm) */
@media (min-width: 640px) {
  /* ... */
}

/* Medium (md) */
@media (min-width: 768px) {
  /* ... */
}

/* Large (lg) */
@media (min-width: 1024px) {
  /* ... */
}

/* Extra Large (xl) */
@media (min-width: 1280px) {
  /* ... */
}
```

### 7. store2 本地存储插件

- [github](https://github.com/nbubna/store#readme)

### 8. dayjs 日期格式化插件

- [github](https://github.com/iamkun/dayjs/blob/dev/docs/zh-cn/README.zh-CN.md)

### 9. 代码压缩`gzip`: compression-webpack-plugin

- 备注：该插件最新版会有兼容性问题，需安装 6.1.1 版本
- `yarn add compression-webpack-plugin@6.1.1 -D`

```javascript
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.export = {
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 1、压缩html中的css
      config.plugin('html').tap((args) => {
        args[0].minify.minifyCSS = true;
        return args;
      });
      // 2、去除console.log 、debugger
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        return args;
      });

      // 3、gzip需要nginx进行配合
      config
        .plugin('compression')
        .use(CompressionWebpackPlugin)
        .tap(() => [
          {
            algorithm: 'gzip',
            minRatio: 0.8,
            test: /\.js$|\.html$|\.css/, // 匹配文件名
            threshold: 10240, // 超过10k进行压缩
            deleteOriginalAssets: true, // 是否删除源文件
          },
        ]);
    }
  },
};
```

```yaml
# nginx GZIP配置
gzip  on;
gzip_min_length 1k;
gzip_buffers 4 16k;
gzip_comp_level 2;
gzip_types text/plain application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
gzip_vary on;
gzip_static on;
```

### 10. VConsole

- CDN: https://cdn.bootcdn.net/ajax/libs/vConsole/3.3.4/vconsole.min.js
