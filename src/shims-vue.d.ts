/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// / <reference types="node" />
// / <reference types="react" />
// / <reference types="react-dom" />

interface Date {
  Format: (fmt?: string) => string;
}

interface Window {
  fullScreen: boolean,
  TCPlayer: any,
  BeaconAction: any,
  pgvMain: any,
  Raven: any,
  moment: any,
  QRCode: any,
  VConsole: any,
  wx: any,
  setShareInfo: any,
  // WeMeetJSBridge: WeMeetJSBridgeType,
  $util: any,
  emonitorIns: {
    log: Function,
  },
  handleResume: any,
}

interface Document {
  msExitFullscreen: Function,
  mozCancelFullScreen: Function,
  webkitExitFullscreen: Function,
  mozFullScreenElement: Element | null,
  webkitFullscreenElement: Element | null,
  msFullscreenElement: Element | null,
  webkitIsFullScreen: boolean,
  msFullscreenEnabled: boolean,
  mozFullScreen: boolean,
  webkitFullScreen: boolean,
  msFullScreen: boolean,
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// https://stackoverflow.com/questions/46501297/typescript-cant-find-module-less/46501346
declare module '*.less' {
  // const styles: any;
  // export = styles;
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
