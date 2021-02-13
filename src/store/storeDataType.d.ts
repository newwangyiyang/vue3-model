/**
 * 定义vuex => store的模块类型
 *
 */

/**
 * 用户模块接口定义
 */
export interface IUserModule {
  token: string;
  userID: string;
  username: string;
  avatarSrc: string;
}

export interface IMutations {}

/**
 * Store 接口定义汇总
 */
export default interface IState {
  user: IUserModule;
}
