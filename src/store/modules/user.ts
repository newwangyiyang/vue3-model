/**
 * 用户模块
 *
 */
import websiteManageApi from '@/api/websiteManageApi';
import { moduleState } from '@/config/globalContant';
import { IRequestParams, IResponseData } from '@/type/ComponentDataType';
import { ActionContext } from 'vuex';
import s from 'store2';
import { storeMutations, storeActions } from '../contant';
import IState, { IUserModule } from '../storeDataType';

const {
  user: { updatedUsername, updateAvatarSrc, updateUserState, resetUserState, updateToken },
} = storeMutations;
const {
  user: { initUserState, updateOnlineStatus },
} = storeActions;

// avatarSrc: "https://www.kaisir.cn/uploads/858c0efb60f640b7b17adad1f16d6441.png"
// token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTA4OTQxNzMsInVzZXJJZCI6ImY3MTAyZDcwM2VkNjRkN2RiMzhkNGZkZThmNjYyYmYwIiwidXNlcm5hbWUiOiJsaW11emkxIn0.d2rS4IvXC0OTjYioONxEJ-FXdhDLlARRcotIMuc4Vj8"
// userID: "f7102d703ed64d7db38d4fde8f662bf0"
// username: "limuzi1"

const userState: IUserModule = {
  token: '',
  userID: '',
  username: '',
  avatarSrc: '',
};

export default {
  namespaced: true,
  state: userState,
  mutations: {
    [resetUserState](state: IUserModule) {
      Object.keys(state).forEach((key) => {
        state[key as keyof IUserModule] = '';
      });
      s.clear();
    },
    [updateUserState](state: IUserModule, user: IUserModule) {
      Object.keys(state).forEach((key) => {
        const k = key as keyof IUserModule;
        state[k] = user[k];
        if (key === 'token') {
          s('token', user[k]);
        }
      });
    },
    [updatedUsername](state: IUserModule, username: string) {
      state.username = username;
    },
    [updateAvatarSrc](state: IUserModule, avatarSrc: string) {
      state.avatarSrc = avatarSrc;
    },
    [updateToken](state: IUserModule, token: string) {
      state.token = token;
    },
  },
  actions: {
    [initUserState](context: ActionContext<IUserModule, IState>, params: IRequestParams<string>) {
      return websiteManageApi.login(params).then((res: IResponseData) => {
        if (res.code === moduleState.SUCCESS) {
          context.commit(updateUserState, res.data);
        }
        return res;
      });
    },
    [updateOnlineStatus](context: ActionContext<IUserModule, IState>) {
      return websiteManageApi
        .updateOnlineStatus({
          userId: context.state.userID,
          status: false,
        })
        .then((res: IResponseData) => {
          if (res.code === moduleState.SUCCESS) {
            context.commit(resetUserState);
            return true;
          }
        });
    },
  },
};
