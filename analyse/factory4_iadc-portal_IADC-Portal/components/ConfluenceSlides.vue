<template>
  <div class="container">
    <iframe
      :id="iframeId"
      :src="url"
      :height="heightSlide"
      :width="widthSlide"
      class="konviw--page"
      title="Slides iframe"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class ConfluenceSlides extends Vue {
  @Prop() readonly pageId!: string;
  @Prop() readonly styleId!: string;
  @Prop() readonly heightSlide!: string;
  @Prop() readonly widthSlide!: string;

  // TODO: pathRoute may be better a Prop
  pathRoute = 'konviw';
  iframeId = `konviw-slide-${this.pageId}`;

  // Computed functions -------------- //
  get url(): string {
    const tempUrl = `${(process.env.iadc as any).baseURLDocs}/slides/${
      this.pathRoute
    }/${this.pageId}`;
    return tempUrl + `?style=${this.styleId}`;
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  left: 0px;
  top: 0;
  width: 100%;
}
iframe.konviw--page {
  position: relative;
  min-width: 100%;
  overflow: hidden;
  border: 1px solid lightgray;
  border-radius: 5px;
}
</style>
