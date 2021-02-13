const merge = require('webpack-merge');
const tsImportPluginFactory = require('ts-import-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/vue3Model' : '/', // 设置output.publicPath，区分生产环境和开发环境
  outputDir: 'vue3Model',
  productionSourceMap: false,
  devServer: {
    // 配置 webpack-dev-server 行为。
    open: process.env.NODE_ENV === 'development',
    host: 'localhost',
    port: 8080,
    https: false,
    hot: true,
    hotOnly: true,
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://127.0.0.1:${process.env.VUE_APP_BASE_API_PORT}/api`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
      },
    }, // string | Object
    before: (app) => {},
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: !!process.env.NODE_ENV === 'production',
    // 开启 CSS source maps?
    sourceMap: false,
  },
  parallel: false,
  chainWebpack: (config) => {
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap((options) => {
        return merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true,
              }),
            ],
          }),
          compilerOptions: {
            module: 'es2015',
          },
        });
      });
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
            test: /\.js$|\.html$|\.css$/, // 匹配文件名
            threshold: 4096, // 超过4k进行压缩
            deleteOriginalAssets: false, // 是否删除源文件
          },
        ]);
    }
  },
};
