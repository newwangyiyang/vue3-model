/**
 * typescript
 * 类型定义
 * 存放一些公用的 interface 及 type
 */
// 接口入参
export interface IRequestParams<T> {
  [key: string]: T;
}

// 接口返回值类型
export interface IResponseData<T = any> {
  msg?: string;
  code?: number;
  data: T;
  fileName?: string;
  count?: number; // 数据总条数
}

// 待处理请求定义
export interface IPendingRequest {
  (...params: any[]): void;
}

// 基础module项
export interface IModule {
  [key: string]: any;
}

// 用户个人信息类型
export type userInfoType = {
  token: string;
  userID: string;
  profilePicture: string;
  username: string;
};
