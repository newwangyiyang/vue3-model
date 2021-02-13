<template>
  <div class="home">
    <van-button type="primary" size="large" @click="handleUserLogin">登录</van-button>
    <van-button size="large" @click="handleUserOutLogin">推出登录</van-button>
    <div v-for="(item, key) in user" :key="key">{{ key }} => {{ item }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, inject, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';
import { moduleState } from '@/config/globalContant';
import { storeActions } from '@/store/contant';
import { IResponseData } from '@/type/ComponentDataType';
import { Toast } from 'vant';

export default defineComponent({
  name: 'Home',
  setup() {
    const { dispatch, getters } = useStore();
    const Toast = inject<Toast>('Toast');
    const data = reactive({
      user: getters.user,
    });
    const methods = {
      // 用户登录测试
      handleUserLogin() {
        dispatch(`user/${storeActions.user.initUserState}`, {
          userName: 'limuzi2',
          password: '111111',
        }).then((res: IResponseData) => {
          if (res.code !== moduleState.SUCCESS) {
            Toast?.(res.msg || '系统异常');
          }
        });
      },
      // 推出登录
      handleUserOutLogin() {
        dispatch(`user/${storeActions.user.updateOnlineStatus}`);
      },
    };
    return {
      ...toRefs(data),
      ...methods,
    };
  },
});
</script>
<style lang="scss" src="./../assets/scss/views/home.scss" scoped />
