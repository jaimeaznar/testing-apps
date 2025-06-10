<!-- Component ConfluencePage.vue -->
<template>
  <div
    :class="{ container__fullpage: fullPage, container__relative: !fullPage }"
  >
    <iframe
      :id="iframeId"
      :key="url"
      :src="url"
      :class="{ konviw__page_border: showBorder }"
      class="konviw__page"
      title="Page iframe"
      @load="iframeLoaded(iframeId)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import iFrameResize from 'iframe-resizer/js/iframeResizer';

@Component
export default class ConfluencePage extends Vue {
  @Prop() readonly pathRoute!: string;
  @Prop() readonly pageId!: string;
  @Prop({ default: 'title' }) readonly pageType: string;
  @Prop() readonly pageTheme: string;
  @Prop({ default: true }) readonly showMetadata: boolean;
  @Prop({ default: false }) readonly showBorder: boolean;
  @Prop({ default: false }) readonly fullPage: boolean;

  iframeId = `konviw-page-${this.pageId}`;

  head() {
    const pageSpace = this.pathRoute + ' - ';
    const pageTitle = this.$store.state.iframeData?.konviwTitle ?? 'Portal';
    const title = pageSpace + pageTitle;
    return {
      title,
    };
  }

  // Computed functions -------------- //

  get url(): string {
    const url = `${(process.env.iadc as any).baseURLDocs}/spaces/${
      this.pathRoute
    }/pages/${this.pageId}`;
    const theme =
      this.pageTheme ?? `${this.$vuetify.theme.dark ? 'dark' : 'light'}`;
    const queryParams = this.$route?.query ?? {};
    const { view: viewParam } = queryParams;
    let view = '&view=iframe-resizer';
    if (['fullpage', 'iframe-resizer', 'debug'].includes(viewParam as string)) {
      view = `&view=${viewParam}`;
    } else if (this.fullPage) {
      view = '';
    }
    const additionalQueryParams = Object.entries(queryParams).reduce(
      // Add authorized params only to the konviw iframe to prevent error in case of unknown parameters and/or unauthorized values
      (acc, [key, val]) => {
        const validKonviwParams = {
          style: ['konviw', 'iadc'],
          cache: ['no-cache', 'clear-cache'],
        };
        if (!Object.keys(validKonviwParams).includes(key)) {
          return acc;
        }
        if (
          !Array.isArray(validKonviwParams[key]) &&
          validKonviwParams[key].includes(val)
        ) {
          return acc;
        }
        return `${acc}&${key}=${val}`;
      },
      '',
    );
    return `${url}?theme=${theme}&type=${this.pageType}${view}${additionalQueryParams}`;
  }

  // Methods ------------------------- //

  // listen to the messages sent by the iframe, using https://www.npmjs.com/package/iframe-resizer
  iframeLoaded(iframeId) {
    iFrameResize(
      {
        log: false,
        checkOrigin: false,
        // full screen ==> sizeHeight: false & scrolling: true,
        // relative screen ==> sizeHeight: true & scrolling: false,
        sizeHeight: !this.fullPage,
        scrolling: this.fullPage,
        onMessage: (messageData) => {
          // Callback fn when message is received
          // save message in the store
          const iframeData = { ...messageData.message };
          Object.entries(iframeData).forEach(([key, val]) => {
            try {
              iframeData[key] = JSON.parse(`${val}`);
            } catch (err) {}
          }); // parse any parseable object in the iframedata object
          this.$store.commit('iframeData', {
            ...iframeData,
            showMetadata: this.showMetadata,
          });
          // Automatically update the window URL when the iframe is loaded from an internal link
          const { konviwPageId: pageId } = iframeData;
          const currentUrl = window.location.pathname;
          const newUrl = this.getURLFromPageId(currentUrl, pageId);
          if (newUrl !== currentUrl) {
            window.history.pushState({}, '', newUrl);
          }
        },
      },
      `#${iframeId}`,
    );
  }

  getURLFromPageId(currentUrl: string, pageId: number): string {
    // remove leading and trailing slashes
    const trimmed = currentUrl.replace(/(^\/+)|(\/+$)/g, '');
    const elements = trimmed.split('/');
    if (elements.length === 1) {
      // http://example.com/portal
      const [portal] = elements;
      if (Number(this.pageId) !== pageId) {
        return `/${portal}/${pageId}`;
      }
    } else if (elements.length === 2) {
      // http://example.com/portal/123
      const [portal, urlPageId] = elements;
      if (Number(urlPageId) !== pageId) {
        return `/${portal}/${pageId}`;
      }
    } else if (elements.length === 3) {
      // http://example.com/portal/group/123
      const [portal, group, urlPageId] = elements;
      if (Number(urlPageId) !== pageId) {
        return `/${portal}/${group}/${pageId}`;
      }
    }
    return currentUrl;
  }
}
</script>

<style lang="scss" scoped>
.container__fullpage {
  position: absolute;
  display: flex;
  background: transparent;
  margin: 0;
  padding: 0;
  border: none;
  left: 0;
  right: 0;
  top: 0;
  bottom: 40px;
}
.container__relative {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
}
iframe {
  &.konviw__page {
    overflow: hidden;
    position: relative;
    display: flex;
    margin: 0;
    padding: 0;
    border: none;
    width: 100%;
    height: 100%;
  }
  &.konviw__page_border {
    border: 1px solid lightgray;
    border-radius: 5px;
  }
}
</style>
