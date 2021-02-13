<script lang="ts">
import { defineComponent, h, onMounted } from 'vue';

const dom = h('h1', {}, 'this is h1 title');

export default defineComponent({
  name: 'Vue3Demo',
  setup() {
    onMounted(() => {
      console.log('this is onMounte done');
    });
    return {};
  },
  render() {
    return dom;
  },
});
</script>
