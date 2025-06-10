<template>
  <div class="nuxt-error">
    <component :is="errorPage" :error="error" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import error404 from '~/components/error/Error404.vue';
import error500 from '~/components/error/Error500.vue';
import error403 from '~/components/error/Error403.vue';

@Component({
  layout: 'empty',
  components: {
    error403,
    error404,
    error500,
  },
})
export default class NuxtError extends Vue {
  @Prop()
  error!: any;

  get errorPage() {
    if (this.error.statusCode === 404) {
      return error404;
    }
    if (this.error.statusCode === 403) {
      return error403;
    }
    // catch everything else
    return error500;
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 50px;
}
</style>
