<template>
  <div class="card">
    <v-snackbar
      :timeout="-1"
      :value="notificationVisible"
      top
      color="info"
      outlined
      centered
      :multi-line="true"
    >
      Portals shown below are exclusively from Playground. Sites from the
      production environment connected to the development environment were
      discontinued because it introduced many confusion and duplication
      opportunities.
      <template #action="{ attrs }">
        <div
          v-bind="attrs"
          class="notification-action"
          @click="onCloseNotification"
        >
          <v-icon>mdi-close</v-icon>
        </div>
      </template>
    </v-snackbar>
    <div class="d-flex flex-wrap justify-center post" style="padding-top: 0px">
      <div v-for="item in sortPages(landingPageData)" :key="item.title">
        <v-hover v-slot="{ hover }" open-delay="100">
          <v-card
            class="ma-5 rounded-card"
            :class="{ 'on-hover': hover }"
            :elevation="hover ? 8 : 2"
            width="345px"
            height="300px"
          >
            <v-img
              height="150"
              class="rounded-image"
              :src="createImageAsset(item)"
              contain
            />

            <v-img
              height="60"
              class="rounded-image rounded-logo"
              :src="createLogoAsset(item)"
              contain
            />

            <v-card-title class="post__title firstTitle">
              {{ item.title }}
            </v-card-title>

            <v-card-title class="name">
              {{ item.responsible }}
            </v-card-title>

            <v-card-subtitle class="pt-2 pb-3 description">
              {{ shortenDescription(item.description) }}
            </v-card-subtitle>

            <v-btn rounded large color="primary" @click="open(item.targetUrl)">
              Open
            </v-btn>
          </v-card>
        </v-hover>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import _ from 'lodash';
import { LandingPageModel } from '~/api/models/landing-page.model';
import global from '~/mixins/global';

Vue.mixin(global);

@Component({
  layout: 'landingpage',
})
export default class LandingPage extends Vue {
  title = 'Welcome to the IADC Portal';
  notificationVisible = false;

  head() {
    return { title: 'Digital Docs sites' };
  }

  get landingPageData(): LandingPageModel[] {
    return this.$store.state.landingPageData;
  }

  createLogoAsset(item: LandingPageModel) {
    const isConfluenceAsset =
      item.logo &&
      global.methods.isAssetConfluenceSelfServiceUrl(item.logo as string);

    if (isConfluenceAsset) {
      return item.logo;
    }
    if (item.targetUrl && item.logo) {
      return require(`~/pages/${item.targetUrl}/assets/images/${item.logo}`);
    }
    return '';
  }

  createImageAsset(item: LandingPageModel) {
    const isConfluenceAsset =
      item.img &&
      global.methods.isAssetConfluenceSelfServiceUrl(item.img as string);

    if (isConfluenceAsset) {
      return item.img;
    }
    if (item.targetUrl && item.img) {
      return require(`~/pages/${item.targetUrl}/assets/images/${item.img}`);
    }
    return '';
  }

  shortenDescription(str: string): string {
    const maxLen = 125;
    if (str.length <= maxLen) {
      return str;
    }
    return str.substr(0, str.lastIndexOf(' ', maxLen)) + '...';
  }

  open(targetURL): any {
    const url = window.location.href;
    const openURL = `${url + targetURL}`;
    window.open(openURL, '_self');
  }

  sortPages(items: LandingPageModel[]): any {
    return _.orderBy(_.filter(items, { disabled: false }), 'title', 'asc');
  }

  onCloseNotification() {
    this.notificationVisible = false;
    localStorage.setItem('self-service-notification-accepted', String(true));
  }

  mounted() {
    const isDevelopmentEnvironemnt = window.location.href.includes('dev');
    const isLocalEnvironment = window.location.href.includes('localhost');
    const selfServiceNotificationAccepted = localStorage.getItem(
      'self-service-notification-accepted',
    );
    if (
      !selfServiceNotificationAccepted &&
      (isDevelopmentEnvironemnt || isLocalEnvironment)
    ) {
      this.notificationVisible = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0px !important;
}

.rounded-card {
  border-style: solid;
  border-width: 2px;
}

.rounded-logo {
  width: 25%;
  margin-left: 70% !important;
  position: absolute;
  margin-top: 10%;
}

.firstTitle {
  font-size: 20px !important;
  font-weight: bold !important;
  margin-top: -20px !important;
  padding-left: 20px !important;
  white-space: nowrap;
  overflow: hidden;
}

.name {
  color: darkgray;
  font-size: 13px !important;
  margin-top: -75px !important;
  padding-left: 20px !important;
}

.description {
  position: absolute;
  width: 70%;
  padding-left: 20px !important;
  font-size: 13px;
  text-justify: inter-word;
  font-style: normal;
  font-weight: 400;
  margin-top: -6%;
  line-height: 18px;
}
.theme--light .description {
  color: black !important;
}

.notification-action {
  cursor: pointer;
}

button {
  position: relative;
  margin-left: 68% !important;
  width: 30% !important;
  margin-top: 35px !important;
  height: 12% !important;
  padding-left: 10% !important;
  padding-right: 10% !important;
  border: 1px solid #ddd;
  color: #333;
  background-color: #fff;
  border-radius: 4px;
  font-family: '微软雅黑', arail, sans-serif;
  cursor: pointer;
  &[disabled] {
    cursor: not-allowed;
  }
  &.success {
    background-color: #13ce66;
    color: #fff;
  }
}

.icon-input {
  margin-bottom: 10px;
  position: relative;
  max-width: 300px;
  &__text-field {
    width: 100%;
    padding: 5px 30px 5px 5px;
  }
  &__icon {
    color: rgba(0, 0, 0, 1);
    position: absolute;
    top: 50%;
    right: -2rem;
    transform: translateY(-50%);
  }
  &__text-field:focus + &__icon {
    color: #ff8400;
  }
}

.post {
  padding-top: 1rem;
  &__title {
    margin-bottom: 3rem;
    word-break: initial;
    font-weight: 300;
    height: 50px;
  }
  &__link {
    color: rgb(92, 148, 252);
    text-decoration: none;
  }
  &__readmore {
    padding: 15px;
    display: inline-block;
    position: absolute;
    text-align: right;
    bottom: 0;
    width: 100%;
    right: 0px;
    height: 15px;
  }
  &__readtime {
    padding: 15px;
    display: inline-block;
    position: absolute;
    text-align: left;
    bottom: 0;
    width: 100%;
    height: 15px;
  }
  &__profile {
    padding: 10px;
    display: inline-block;
    position: absolute;
    bottom: 70px;
    width: 100%;
    height: 15px;
  }
}
</style>
