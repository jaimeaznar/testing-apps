<template>
  <div class="app--content">
    <iframe
      id="cpv-iframe"
      class="app--frame"
      :src="url"
      title="Konviw iframe"
      @load="getMessage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import iFrameResize from 'iframe-resizer/js/iframeResizer';

@Component
export default class KonviwPage extends Vue {
  @Prop() readonly pathRoute!: string;
  @Prop() readonly pageId!: string;
  @Prop() readonly pageType!: string;

  scrollToTop() {
    return true;
  }

  head() {
    const pageSpace = this.pathRoute + ' - ';
    const pageTitle = this.$store.state.iframeData?.konviwTitle ?? 'Portal';
    const title = pageSpace + pageTitle;
    return {
      title,
    };
  }

  // Computed functions
  get url(): string {
    const url = `${(process.env.iadc as any).baseURLDocs}/spaces/${
      this.pathRoute
    }/pages/${this.pageId}`;
    const theme = `${
      this.$vuetify.theme.dark ? '?theme=dark' : '?theme=light'
    }`;
    let type = '';
    switch (this.pageType) {
      case 'blog':
        type = '&type=blog';
        break;
      case 'notitle':
        type = '&type=notitle';
        break;
    }
    return url + theme + type;
  }

  // listen to the messages sent by the iframe, using https://www.npmjs.com/package/iframe-resizer
  getMessage() {
    iFrameResize({
      log: false,
      checkOrigin: false,
      sizeHeight: false,
      scrolling: true,
      id: '#cpv-iframe',
      onMessage: (data) => {
        this.$store.commit('iframeData', data.message);
      },
    });
  }
}
</script>

<style lang="scss" scoped>
iframe.app--frame {
  display: flex;
  background: transparent;
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  height: 100%;
  position: absolute;
}

.app--content {
  position: absolute;
  background: transparent;
  margin: 0;
  padding: 0;
  border: none;
  left: 0%;
  right: 0%;
  top: 0;
  bottom: 40px;
}
</style>
