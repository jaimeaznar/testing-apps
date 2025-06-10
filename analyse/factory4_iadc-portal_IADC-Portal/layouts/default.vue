<template>
  <v-app>
    <!-- Application drawer with menu items -->
    <!-- Main Toolbar -->
    <NavigationDrawer v-if="portalId" :menus="menus" />
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon v-if="portalId" @click.stop="toggleDrawer()" />
      <!-- Link to the home directory of the respective Portal -->
      <NuxtLink :to="`/${portalId}`">
        <!-- Logo for this Portal -->
        <img
          v-if="portalId"
          :src="createIconAsset()"
          height="36"
          alt="IADC for Digital Factory 4.0"
        />
      </NuxtLink>

      <v-spacer />
      <!-- Insert the Search component  -->
      <SearchBar v-if="currentPortalData && currentPortalData.search" />
      <v-btn
        v-if="currentPortalData && currentPortalData.glisten"
        icon
        @click.stop="toggleFeedback()"
      >
        <IadcIcon icon="iadc-glisten" class="icon--iadc" />
      </v-btn>
      <ShareButton
        :url="pageURL"
        :title="pageTitle"
        :description="pageDescription"
      ></ShareButton>
      <v-btn
        v-if="showMetadata && iframeData"
        icon
        @click.stop="toggleMetadata()"
      >
        <v-icon>mdi-information</v-icon>
      </v-btn>
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
        <GlistenClient
          v-if="userNickname && currentPortalData && currentPortalData.glisten"
          :sheet="sheet"
          application-id="iadc-portal"
          :user-name="userNickname"
          :custom-tracker="customTracker"
          @close="toggleFeedback"
        />
        <MetadataContainer v-if="iframeData" />
      </v-container>

      <!-- App Footer -->
      <PageFooter editor="IADC" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import NavigationDrawer from '~/components/AppDrawer.vue';
import PageFooter from '@/components/PageFooter.vue';
import SearchBar from '@/components/SearchBar.vue';
import IadcIcon from '@/components/IadcIcon.vue';
import ShareButton from '@/components/ShareButton.vue';
import MetadataContainer from '@/components/MetadataContainer.vue';
import Util from '@/util';
import global from '~/mixins/global';
import { LandingPageModel } from '~/api/models/landing-page.model';

Vue.mixin(global);

@Component({
  components: {
    NavigationDrawer,
    PageFooter,
    SearchBar,
    ShareButton,
    IadcIcon,
    MetadataContainer,
  },
})
export default class DefaultLayout extends Vue {
  clipped = true;
  pageURL: string = window.location.href;
  portalId = '';
  currentPortal: LandingPageModel | undefined;

  head() {
    this.portalId = global.methods.getPortalIdFromUrl(this.pageURL);
    const landingPageData = this.$store.state.landingPageData;
    if (global.methods.checkPortal(landingPageData, this.portalId)) {
      this.currentPortalData = landingPageData.find(
        (page) => page.targetUrl === this.portalId,
      );
      this.$store.commit('spaceKeys', this.currentPortalData?.spaceKeys);
      this.$store.commit('spaceTitles', this.currentPortalData?.spaceTitles);
      this.$store.commit('targetUrl', this.currentPortalData?.targetUrl);
    } else {
      this.portalId = '';
    }
    if (localStorage.getItem('theme') === 'dark') {
      this.setDarkTheme(true);
    }
  }

  get currentPortalData() {
    return this.currentPortal;
  }

  set currentPortalData(value) {
    this.currentPortal = value;
  }

  get menus() {
    return this.currentPortalData?.menus ?? [];
  }

  get theme() {
    return this.$vuetify.theme.dark ? 'dark' : 'light';
  }

  get sheet(): any {
    return this.$store.state.feedback;
  }

  set sheet(val) {
    this.$store.commit('feedback', val);
  }

  get userNameInitials(): string | null {
    if (!this.$auth.user) {
      return null;
    } else {
      return `${(this.$auth.user.given_name as string)[0]}${
        (this.$auth.user.family_name as string)[0]
      }`;
    }
  }

  get userNickname(): string | null {
    return (this.$auth.user?.nickname as string) ?? null;
  }

  get pageTitle() {
    return this.$store.state.iframeData?.konviwTitle ?? 'IADC Portal';
  }

  get pageDescription() {
    return this.$store.state.iframeData?.konviwExcerpt ?? 'IADC Portal';
  }

  get pagePublicURL() {
    return this.$store.state.iframeData?.konviwFrameUrl ?? window.location.href;
  }

  get customTracker() {
    return { contextPage: this.pageTitle, contextPortal: this.pagePublicURL };
  }

  get iframeData() {
    return this.$store.state.iframeData;
  }

  get showMetadata() {
    return this.iframeData?.showMetadata ?? false;
  }

  toggleDrawer() {
    this.$store.commit('toggleDrawer');
  }

  createIconAsset() {
    const isConfluenceAsset =
      this.currentPortalData &&
      global.methods.isAssetConfluenceSelfServiceUrl(
        this.currentPortalData.icon as string,
      );

    if (isConfluenceAsset) {
      return this.currentPortalData?.icon ?? '';
    }
    if (this.currentPortalData?.targetUrl) {
      return require(`@/pages/${this.currentPortalData?.targetUrl}/assets/images/icon.png`);
    }
    return '';
  }

  handleFullScreen() {
    this.$pushGTMEventInQueue({
      event: 'navigation',
      user: this.$auth.user,
      additionalParameters: {
        section: 'header',
        sub_section: 'features',
        element: 'Fullscreen',
      },
    });
    Util.toggleFullScreen();
  }

  toggleFeedback() {
    this.$store.commit('toggleFeedback');
    this.$pushGTMEventInQueue({
      event: 'navigation',
      user: this.$auth.user,
      additionalParameters: {
        section: 'header',
        sub_section: 'features',
        element: 'Feedback',
      },
    });
  }

  toggleMetadata() {
    this.$store.commit('toggleMetadata');
    this.$pushGTMEventInQueue({
      event: 'navigation',
      user: this.$auth.user,
      additionalParameters: {
        section: 'header',
        sub_section: 'features',
        element: 'Page information',
      },
    });
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
        sub_section: 'features',
        element: 'Dark mode',
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
