<template>
  <div>
    <ConfluencePage
      :path-route="targetUrl"
      :page-id="landingPageID"
      :show-border="false"
      :full-page="true"
      :show-metadata="false"
      page-type="notitle"
    />
  </div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator';
import ConfluencePage from '@/components/ConfluencePage.vue';
import { LandingPageModel } from '~/api/models/landing-page.model';
import global from '~/mixins/global';

Vue.mixin(global);

@Component({
  components: {
    ConfluencePage,
  },
})
export default class Index extends Vue {
  public homepageId: string;

  @State('landingPageData')
  public landingPageData: LandingPageModel[];

  @State('targetUrl')
  public targetUrl: string;

  get landingPageID() {
    return this.homepageId;
  }

  set landingPageID(value: string) {
    this.homepageId = value;
  }

  fetch() {
    this.homepageId = global.methods.getHomepageId(
      this.landingPageData,
      this.targetUrl,
    );
  }
}
</script>
