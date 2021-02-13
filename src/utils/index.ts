/**
 * 异步加载插件
 * @param src
 * 在线cdn链接
 */
export const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve();
    };
    // 发生在脚本加载期间的 error 会被 error 事件跟踪到。
    script.onerror = (err) => {
      reject(err);
    };
    document.body.appendChild(script);
  });

/**
 * 开发环境加载VConsole
 */
export const loadVConsoleScript = () =>
  new Promise((resolve, reject) => {
    if (window.VConsole) {
      resolve(window.VConsole);
    } else {
      loadScript('https://cdn.bootcdn.net/ajax/libs/vConsole/3.3.4/vconsole.min.js')
        .then((res) => {
          console.log('>>> loadScript:', res);
          if (window.VConsole) {
            // eslint-disable-next-line no-new
            new window.VConsole();
          }
          resolve(window.VConsole);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    }
  });
