<template>
  <v-app>
    <!-- Application drawer with menu items -->
    <!-- Main Toolbar -->
    <v-app-bar :clipped-left="clipped" fixed app>
      <!-- Link to the home directory of the respective Portal -->
      <NuxtLink to="/">
        <!-- Logo for this Portal -->
        <img
          src="@/assets/images/digital.png"
          height="36"
          alt="IADC for Digital Factory 4.0"
        />
      </NuxtLink>

      <v-spacer />
      <!-- Share Button  -->
      <ShareButton
        :url="pageiadcURL"
        :title="pageTitle"
        :description="pageDescription"
      />
      <v-btn icon @click.stop="handleFullScreen()">
        <v-icon>mdi-fullscreen</v-icon>
      </v-btn>
      <v-btn
        id="mode-switcher"
        icon
        @click="onChangeDarkModeHandler(!$vuetify.theme.dark)"
      >
        <v-icon>
          {{ $vuetify.theme.dark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="page-wrapper">
        <!-- Here it's inserted the core of the Nuxt Application -->
        <nuxt />
      </v-container>

      <!-- App Footer -->
      <PageFooter editor="IADC" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import PageFooter from '@/components/PageFooter.vue';
import SearchBar from '@/components/SearchBar.vue';
import ShareButton from '@/components/ShareButton.vue';
import Util from '@/util';

@Component({
  components: {
    PageFooter,
    SearchBar,
    ShareButton,
  },
})
export default class DefaultLayout extends Vue {
  clipped = true;
  pageiadcURL: string = window.location.href;

  head() {
    if (localStorage.getItem('theme') === 'dark') {
      /* for some reason the 'background' color isn't set when immediately switching to dark mode at the landingpage loading, thus the timeout */
      setTimeout(() => {
        this.setDarkTheme(true);
      }, 50);
    }
  }

  get pageTitle() {
    return this.$store.state.iframeData?.konviwTitle ?? 'IADC Portal';
  }

  get pageDescription() {
    return this.$store.state.iframeData?.konviwExcerpt ?? 'IADC Portal';
  }

  get theme() {
    return this.$vuetify.theme.dark ? 'dark' : 'light';
  }

  handleFullScreen() {
    this.$pushGTMEventInQueue({
      event: 'navigation',
      user: this.$auth.user,
      additionalParameters: {
        section: 'header',
        sub_section: 'Fullscreen',
      },
    });
    Util.toggleFullScreen();
  }

  setDarkTheme(dark: boolean) {
    this.$vuetify.theme.dark = dark;
    localStorage.setItem('theme', this.theme);
  }

  onChangeDarkModeHandler(dark: boolean) {
    this.$pushGTMEventInQueue({
      event: 'navigation',
      user: this.$auth.user,
      additionalParameters: {
        section: 'header',
        sub_section: 'DarkMode',
      },
    });
    this.setDarkTheme(dark);
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  margin-bottom: 10px;
  height: 100%;
}
</style>
