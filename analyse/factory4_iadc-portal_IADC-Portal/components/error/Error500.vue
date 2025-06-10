<template>
  <v-app class="error-500">
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6">
          <img
            width="250px"
            src="@/assets/images/500-error.png"
            alt="500 Error"
            contain
          />
          <h1>Oops!</h1>
          <p>Something went wrong</p>
          <ul>
            <li><NuxtLink to="/"> Go back to home </NuxtLink>.</li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script lang="ts">
import { NuxtError } from '@nuxt/types';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class Error500 extends Vue {
  @Prop({ type: Object, required: false })
  readonly error!: NuxtError;
}
</script>
