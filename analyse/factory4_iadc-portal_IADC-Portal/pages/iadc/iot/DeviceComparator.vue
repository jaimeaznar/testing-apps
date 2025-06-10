<template>
  <div>
    <v-container>
      <!-- Page header with title -->
      <v-row class="d-flexjustify-space-between align-center">
        <v-col class="d-flex flex-column align-center">
          <h1 class="subtitle mb-5 indigo--text text--darken-4">
            <v-icon large color="indigo darken-4"> mdi-radio-tower </v-icon>
            IoT Device Comparator
          </h1>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="container">
      <!-- Two v-select inputs to select the devices to compare-->
      <v-row class="d-flex flex-row justify-center">
        <v-col class="d-flex">
          <v-select
            v-model="firstSelectDevice"
            :items="pagesDevices"
            label="IoT Device One"
            class="firstSelect"
            outlined
          />
        </v-col>
        <v-col class="d-flex">
          <v-select
            v-model="secondSelectDevice"
            :items="pagesDevices"
            label="IoT Device Two"
            class="secondSelect"
            outlined
          />
        </v-col>
      </v-row>

      <!-- Two iframes displaying the page selected in the previous v-select inputs -->
      <v-row class="d-flex flex-row justify-center">
        <v-col class="d-flex">
          <iframe
            width="98%"
            height="800px"
            :src="urlFirstDevice"
            class="konviw__page"
          />
        </v-col>
        <v-col class="d-flex">
          <iframe
            width="98%"
            height="800px"
            :src="urlSecondDevice"
            class="konviw__page"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({})
export default class Index extends Vue {
  theme = `${this.$vuetify.theme.dark ? 'dark' : 'light'}`;
  baseUrl = `${(process.env.iadc as any).baseURLDocs}/spaces/PLANT/pages/`;
  firstSelectDevice = '';
  secondSelectDevice = '';
  pagesDevices = [];

  // ------------------- //
  // Computed Properties //
  // ------------------- //
  get urlFirstDevice(): string {
    if (this.firstSelectDevice === '') {
      return '';
    }
    return `${this.baseUrl}${this.firstSelectDevice}?theme=${this.theme}`;
  }

  get urlSecondDevice(): string {
    if (this.secondSelectDevice === '') {
      return '';
    }
    return `${this.baseUrl}${this.secondSelectDevice}?theme=${this.theme}`;
  }

  // --------------- //
  // Lifecycle hooks //
  // --------------- //
  async mounted() {
    if (this.$route.query.choosenDevice) {
      this.firstSelectDevice = this.$route.query.choosenDevice.toString();
    }
    await this.getDevices('iot-is-devices');
  }

  // --------------- //
  // Methods         //
  // --------------- //
  async getDevices(label: string) {
    const { data } = await this.$axios.get(
      `${(process.env.iadc as any).baseURLDocsApi}/search`,
      {
        params: { spaceKey: 'PLANT', type: 'page', labels: label },
      },
    );
    this.pagesDevices = data.results.map((document: any) => {
      return {
        text: document.title,
        value: document.docId,
      };
    });
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
}
iframe {
  &.konviw__page {
    position: relative;
    display: flex;
    margin: 0;
    padding: 0;
    border: 1px solid lightgray;
    border-radius: 5px;
  }
}
</style>
