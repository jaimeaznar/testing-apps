<template>
  <div>
    <v-alert
      v-if="!$vuetify.breakpoint.mdAndUp"
      :value="copyAlert"
      class="copy-alert"
      icon="mdi-content-copy"
      elevation="24"
      transition="slide-y-transition"
    >
      URL copied to clipboard
    </v-alert>
    <v-btn v-if="!$vuetify.breakpoint.mdAndUp" icon @click="share()">
      <v-icon>mdi-export-variant</v-icon>
    </v-btn>

    <v-tooltip v-if="$vuetify.breakpoint.mdAndUp" v-model="copyAlert" bottom>
      <template #activator="{}">
        <v-btn icon @click="share()">
          <v-icon>mdi-export-variant</v-icon>
        </v-btn>
      </template>
      <span>URL copied to clipboard</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class ShareButton extends Vue {
  @Prop() readonly url!: string;
  @Prop() readonly title!: string;
  @Prop() readonly description!: string;

  copyAlert = false;

  // Methods functions
  getPageId(url: string): string {
    let pageId = '';
    if (url != null) {
      if (url.split('pages/')[1] != null) {
        pageId = url.split('pages/')[1].split('/')[0];
      }
    }
    return pageId;
  }

  share() {
    this.$pushGTMEventInQueue({
      event: 'navigation',
      user: this.$auth.user,
      additionalParameters: {
        section: 'header',
        sub_section: 'features',
        element: 'copy page url',
      },
    });
    const iframeUrl = this.$store.state.iframeData?.konviwFrameUrl;
    const currentUrl = window.location.href;
    let sharedUrl = '';

    if (this.$route.params.id === undefined) {
      // if ther eis no pageId then we just copy the current portal URL
      sharedUrl = currentUrl;
    } else {
      // otherwise we create a proper URL with the portal root and the pageId
      for (let i = 0; i < currentUrl.split('/').length - 1; i++) {
        sharedUrl = `${sharedUrl + currentUrl.split('/')[i]}/`;
      }
      sharedUrl = sharedUrl + this.getPageId(iframeUrl);
    }
    if (navigator.share) {
      // if we are in a mobile device
      navigator
        .share({
          title: this.title,
          text: this.description,
          url: sharedUrl,
        })
        .catch((err) => {
          this.$nuxt.error({
            statusCode: 500,
            message: err.message,
          });
        });
    } else {
      // otherwise we copy the clipboard from the browser API
      navigator.clipboard.writeText(sharedUrl);
      this.copyAlert = true;
      setTimeout(() => {
        this.copyAlert = false;
      }, 2000);
    }
  }
}
</script>

<style lang="scss" scoped>
.copy-alert {
  position: fixed;
  z-index: 9999;
  width: 100%;
  top: 56px;
  left: 0;
}
#copy {
  position: fixed;
  opacity: 0;
  cursor: default;
}
</style>
