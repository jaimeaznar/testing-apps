<template>
  <v-app class="error-403">
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6">
          <h1>403</h1>
          <p>
            I'm afraid that you don't have access to this page. You don't have
            the required AD groups Sorry about that. If you wish, please send us
            a comment of what does not work via the
            <NuxtLink to="#" @click.native="toggleFeedback()">
              feedback
            </NuxtLink>
            form or go <NuxtLink to="/"> back to Home </NuxtLink>.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script lang="ts">
import { NuxtError } from '@nuxt/types';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class Error403 extends Vue {
  @Prop({ type: Object, required: false })
  readonly error!: NuxtError;

  toggleFeedback() {
    this.$store.commit('toggleFeedback');
  }
}
</script>
