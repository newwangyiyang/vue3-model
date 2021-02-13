/**
 * 对axios稍作封装
 * 1. 设置请求超时时间
 * 2. 添加请求拦截器，在每个请求的头部添加token
 * 3. 添加响应拦截器，根据服务器返回状态进行相应的结果返回
 * 4. 基于Promise的http请求
 * 5. 由于await会阻塞代码，推荐使用then方法解决回调地狱
 */
import axiosObj, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';
import store from '@/store';
import { storeMutations } from '@/store/contant';
import websiteManageAPI from '@/api/websiteManageApi';
import { IResponseData, IPendingRequest } from '@/type/ComponentDataType';
import axios from 'axios';
import useAxiosCancel from '@/utils/useAxiosCancel';

const defaultConfig = {
  // baseURL在此处省略配置,考虑到项目可能由多人协作完成开发，域名也各不相同，此处通过对api的抽离，域名单独配置在@/api/base.ts中
  // 请求超时时间 60s
  timeout: 60 * 1000,
  // 跨域请求时是否需要凭证
  // withCredentials: true, // Check cross-site Access-Control
  headers: {
    get: {
      // 设置默认请求头，当需要特殊请求头时，将其作为参数传入，即可覆盖此处的默认参数
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    post: {
      // 设置默认请求头，当需要特殊请求头时，将其作为参数传入，即可覆盖此处的默认参数(第三个参数即config)
      // 例如：
      //     services.post(`${base.lkBaseURL}/uploads/singleFileUpload`, file, {
      //       headers: { "Content-Type": "multipart/form-data" }
      //     });
      'Content-Type': 'application/json;charset=utf-8',
    },
  },
  // 在向服务器发送请求前，对数据进行处理，axios默认会序列化数据
  // transformRequest:[function(data){
  //
  // }],
  // 在传递给 then/catch 前，修改响应数据
  // transformResponse:[function(data){
  //
  // }]
};

// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests: IPendingRequest[] = [];

// 创建实例
const _axios: AxiosInstance = axiosObj.create(defaultConfig);
// 取消请求队列
const { cancelQueue } = useAxiosCancel();
// 请求拦截器
_axios.interceptors.request.use(
  function(config: AxiosRequestConfig) {
    // 对已发出的请求进行缓存
    config.cancelToken = new axios.CancelToken((c: Canceler) => {
      // 此处也可以做一些专门的逻辑处理
      cancelQueue.value.push(c);
    });
    // 从vuex里获取token
    const token = store.getters.token;
    // 如果token存在就在请求头里添加，用户用户的鉴权操作
    token && (config.headers.token = token);
    return config;
  },
  function(error) {
    // Do something with request error
    error.data = {};
    error.data.msg = '服务器异常';
    return Promise.reject(error);
  },
);
// 响应拦截器
_axios.interceptors.response.use(
  function(response: AxiosResponse) {
    // token过期，续期token，跟后台约定好token失效的code值
    if (response.data?.code === 401) {
      // 原请求的配置
      const config = response.config;
      if (!isRefreshing) {
        // 开始刷新token
        isRefreshing = true;
        // 重新请求并更新token，执行未执行完的请求
        return websiteManageAPI
          .tokenRenew({
            userId: store.getters.userID,
            token: store.getters.token,
          })
          .then((res: IResponseData) => {
            if (res.code === 0) {
              const token = res.data.token;
              // 刷新未执行请求中的token
              config.headers.token = token;
              config.baseURL = '';
              // 更新vuex中的token
              store.commit(storeMutations.user.updateToken, token);
              // 执行队列中的请求
              requests.forEach((cb: IPendingRequest) => cb(token));
              // 清空队列
              requests = [];
              // 重试当前请求并返回promise | _axios(config) => 返回当前的请求实例
              return _axios(config);
            } else {
              // 修改登录状态
              websiteManageAPI
                .updateOnlineStatus({
                  userId: store.getters.userID,
                  status: false,
                })
                .then(() => {
                  // 清除本地存储，刷新当前页面
                  store.commit(storeMutations.user.resetUserState);
                  localStorage.clear();
                  location.reload();
                });
            }
          })
          .catch((reason: any) => {
            throw reason;
          })
          .finally(() => {
            // 改变刷新状态
            isRefreshing = false;
          });
      } else {
        // 正在刷新token，返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push((token: string) => {
            config.headers.token = token;
            config.baseURL = '';
            resolve(_axios(config));
          });
        });
      }
    }
    if (response.status === 200) {
      // 处理接口中的data
      if (response.data?.data) {
        try {
          const dataObj = JSON.parse(response.data.data);
          if (typeof dataObj == 'object' && dataObj) {
            // 为json字符串将其转为json对象
            response.data.data = dataObj;
          }
        } catch (e) {
          // 不是json字符串就不处理
          return response.data;
        }
      }
      return response.data;
    }
    response.data.code = 1;
    response.data.msg = '服务器错误';
    return response.data;
  },
  function(error) {
    return Promise.reject(error);
  },
);

export default _axios;
