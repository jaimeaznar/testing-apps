<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import ConfluenceSlides from '@/components/ConfluenceSlides.vue';
import ConfluencePage from '@/components/ConfluencePage.vue';

@Component({
  components: {
    ConfluenceSlides,
    ConfluencePage,
  },
})
export default class CentralJiraTraining extends Vue {
  // flag to activate button when read and understood has been checked
  public hasAccepted = false;
  public trainingPageID = '1681428453';
  public iFrameLoadedStatus = false;

  // --------------- //
  // Lifecycle hooks //
  // --------------- //
  fetch() {
    if (this.$route.query.trainingPageID) {
      this.trainingPageID = this.$route.query.trainingPageID as string;
    }
  }

  // Computed functions -------------- //

  // retrieve the title of the document loaded in the iframe
  get pageTitle(): string {
    return (
      this.$store.state.iframeData?.konviwTitle ??
      '00 Training • Central Jira Overview'
    );
  }

  get iFrameKonviwData() {
    return this.$store.state.iframeData;
  }

  @Watch('iFrameKonviwData')
  iFrameKonviwDataHandler(payload) {
    if (payload.konviwTitle) {
      this.iFrameLoadedStatus = true;
    }
  }

  getCertificate() {
    this.$router.push({
      path: '/tei/pds/certificate/',
      query: {
        msgTitle: this.$store.state.iframeData?.konviwTitle,
        msgVersion: this.$store.state.iframeData?.konviwVersion,
      },
    });
  }
}
</script>

<template>
  <div>
    <v-row class="d-flex flex-column justify-space-between align-center">
      <v-col
        class="d-flex flex-column justify-space-between align-center"
        cols="12"
      >
        <v-img
          :src="require('@/pages/tei/assets/images/pds-logo.png')"
          class="mr-4"
          max-width="200px"
          center
        />
        <v-img
          :src="require('@/pages/tei/assets/images/digital-learning.png')"
          class="mr-4"
          max-width="500px"
          center
        />
        <h2 class="subtitle mb-5 blue--text text--darken-4">
          {{ pageTitle }}
        </h2>
      </v-col>
    </v-row>

    <ConfluenceSlides
      style-id="digital"
      :page-id="trainingPageID"
      height-slide="900px"
    />

    <ConfluencePage
      path-route="iadc"
      :page-id="trainingPageID"
      page-type="notitle"
      :show-border="false"
      :full-page="false"
    />

    <v-card class="px-5 my-10 ml-auto mr-auto" max-width="700px">
      <v-card-title class="d-flex justify-center">
        Training Certification
      </v-card-title>

      <v-card-text class="text--primary mt-2">
        The training certificate will be generated automatically for GxP
        training requirements but no data is stored in this server about you and
        the training. For this reason you have to download the certificate and
        attach it to your ServiceNow access request.

        <v-checkbox
          v-model="hasAccepted"
          hide-details
          label="I confirm to have read and understood the training"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          class="mb-10 ml-3"
          :disabled="!hasAccepted || !iFrameLoadedStatus"
          @click.native="getCertificate"
        >
          Get your Certificate
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
