<template>
  <van-swipe :autoplay="20000" lazy-render @change="swiperChange">
    <van-swipe-item v-for="image in swiperImg" :key="image">
      <img :src="image" class="inline-block" />
    </van-swipe-item>
    <template #indicator>
      <div class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
        <div
          v-for="(image, index) in swiperImg"
          :key="image"
          :class="['bg-white h-6-px w-6-px rounded', { 'bg-blue-400 w-16-px': swiperCurrent === index }]"
        />
      </div>
    </template>
  </van-swipe>
  <div class="flex bg-gray-200 py-10-px justify-center items-center">
    <span class="text-gray-400 leading-none text-sm mr-10-px">剩余登录时间:</span>
    <van-count-down class="w-120-px text-blue-300 italic" millisecond :time="countTime" format="HH:mm:ss:SS" />
  </div>
  <van-divider class="text-blue-400 border-blue-400 px-16-px">
    马上登录
  </van-divider>
  <div>{{ demoKey }}</div>
  <div class="px-20-px">
    <van-form @submit="onSubmit">
      <van-field
        v-model="state.username"
        :error="false"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="state.password"
        type="password"
        name="密码"
        label="密码"
        :error="false"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="success" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
  <div class="px-38-px">
    <van-button round block type="warning" @click="onOfflineLogin">用户下线</van-button>
  </div>
  <div class="px-38-px mt-20-px">
    <van-button round block type="default" to="/404">测试取消请求</van-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, inject, computed, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { storeActions } from '@/store/contant';
import { moduleState } from '@/config/globalContant';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { IResponseData, IModule } from '@/type/ComponentDataType';

export default defineComponent({
  setup() {
    const swiperImg = [
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg',
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg',
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg',
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg',
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg',
    ];
    const { dispatch } = useStore();
    const { push } = useRouter();
    const Toast = inject<Toast>('Toast');
    const data: IModule = reactive({
      swiperCurrent: 0,
      countTime: 6 * 30 * 60 * 1000,
      state: {
        username: '',
        password: '',
      },
      demoKey: process.env.VUE_APP_DEMO_KEY, // env 环境变量获取示例
    });
    const methods = {
      swiperChange(index: number) {
        data.swiperCurrent = index;
      },
      onSubmit() {
        dispatch(`user/${storeActions.user.initUserState}`, {
          userName: data.state.username,
          password: data.state.password,
        }).then((res: IResponseData) => {
          if (res.code === moduleState.SUCCESS) {
            Toast?.('登录成功~');
            push('/');
          } else {
            Toast?.(res?.msg || '系统异常～');
          }
        });
      },
      onOfflineLogin() {
        dispatch(`user/${storeActions.user.updateOnlineStatus}`).then((res: boolean) => {
          if (res) {
            Toast?.('已成功退出登录～');
          }
        });
      },
    };
    onUnmounted(() => {
      console.log('trigger onUnmounted >>>');
    });
    return {
      swiperImg,
      ...toRefs(data),
      ...methods,
    };
  },
});
</script>
