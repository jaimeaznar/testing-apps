<template>
  <div>
    <v-row class="d-flex flex-column justify-space-between align-center">
      <v-col
        class="d-flex flex-column justify-space-between align-center"
        cols="12"
      >
        <v-img
          :src="require('@/pages/iadc/assets/images/konviw-logo.svg')"
          class="mr-4"
          max-width="600px"
          center
        />
        <h2 class="subtitle mb-5 blue--text text--darken-4">
          Enterprise public viewer for your Confluence pages
        </h2>
      </v-col>
    </v-row>

    <br />

    <About />

    <br />

    <Carousel3d
      :controls-visible="true"
      :controls-prev-html="'‹'"
      :controls-next-html="'›'"
      :controls-width="30"
      :controls-height="60"
      :clickable="false"
      :width="360"
      :height="600"
      :border="3"
    >
      <Slide v-for="(page, i) in pages" :key="i" :index="i">
        <iframe
          width="100%"
          height="600px"
          frameborder="0"
          :src="urlKonviwPage(page)"
        />
      </Slide>
    </Carousel3d>

    <ConfluencePage
      path-route="iadc"
      page-id="1727037734"
      page-type="notitle"
      :show-border="false"
      :full-page="false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Carousel3d, Slide } from 'vue-carousel-3d';
import About from '@/pages/iadc//WebPlatform/konviw/AboutSection.vue';
import ConfluencePage from '@/components/ConfluencePage.vue';

@Component({
  components: {
    About,
    ConfluencePage,
    Carousel3d,
    Slide,
  },
})
export default class Index extends Vue {
  pages = [
    '77627494',
    '77627428',
    '77561880',
    '77561890',
    '77660200',
    '77627467',
    '77660239',
    '77627557',
    '77561961',
    '77594849',
    '77627885',
    '77627925',
    '77660827',
    '185794678',
  ];

  urlKonviwPage(pageId: string) {
    return `https://konviw.vercel.app/cpv/wiki/spaces/konviw/pages/${pageId}`;
  }
}
</script>

<style lang="scss" scoped>
.carousel-3d-container {
  .carousel-3d-slide {
    padding: 0px;
    border-radius: 15px;
  }
}
</style>
