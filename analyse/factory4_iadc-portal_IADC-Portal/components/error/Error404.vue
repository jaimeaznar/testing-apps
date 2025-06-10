<template>
  <v-app class="error-404">
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6">
          <img
            width="250px"
            src="@/assets/images/404-error.png"
            alt="403 Error"
            contain
          />
          <h1>404</h1>
          <p>
            I'm afraid you've found a page that doesn't exist. That can happen
            when you follow a link to something that has since been deleted. Or
            the link was incorrect to begin with.
            <br />
            Sorry about that. If you wish, please send us a comment of what does
            not work via the
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
export default class Error404 extends Vue {
  @Prop({ type: Object, required: false })
  readonly error!: NuxtError;

  toggleFeedback() {
    this.$store.commit('toggleFeedback');
  }
}
</script>
