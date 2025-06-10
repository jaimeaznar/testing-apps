<template>
  <div class="container d-flex flex-column justify-center align-center">
    <h1>You need to login to access this page</h1>
    <v-btn class="ma-2 px-16" rounded large color="primary" @click="login()">
      <v-icon left> mdi-lock-open </v-icon>
      Login
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class DefaultLayout extends Vue {
  head() {
    return { title: 'Login' };
  }

  login() {
    this.$auth.loginWith('cognito', {
      params: {
        identity_provider: (process.env.iadc as any).cognitoProviderName,
      },
    });
  }
}
</script>
<style scoped>
.container {
  height: 100%;
}
</style>
