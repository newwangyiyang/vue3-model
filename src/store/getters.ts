import IState from './storeDataType';

/**
 * 定义vuex导出数据
 *
 */
export default {
  user: (state: IState) => state.user,
  userId: (state: IState) => state.user.userID,
  token: (state: IState) => state.user.token,
};
