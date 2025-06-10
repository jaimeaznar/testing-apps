<template>
  <v-container mb-10>
    <h2 class="text-center">Digital Factory 4.0 applications statistics</h2>
    <br />
    <div class="d-flex flex-wrap justify-center">
      <GoogleAnalyticsChart
        property-id="351290988"
        name="DGBI"
        hostname="dgbi.sanofi.com"
      />
      <GoogleAnalyticsChart
        property-id="348910619"
        name="FaCT"
        hostname="fact.sanofi.com"
      />
      <GoogleAnalyticsChart
        property-id="351275915"
        name="iRelease"
        hostname="irelease.sanofi.com"
      />
      <GoogleAnalyticsChart
        property-id="351317615"
        name="Ignyte SPC"
        hostname="spc.sanofi.com"
      />
      <GoogleAnalyticsChart
        property-id="351212241"
        name="GoGemba"
        hostname="gogemba.sanofi.com"
      />
      <GoogleAnalyticsChart
        property-id="351261442"
        name="EDDi"
        hostname="eddi.sanofi.com"
      />
      <GoogleAnalyticsChart
        property-id="348109833"
        name="IADC Docs Viewer"
        hostname="docs.sanofi.com"
      />
      <GoogleAnalyticsChart
        property-id="347901472"
        name="IADC Portal"
        hostname="docs.sanofi.com"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import GoogleAnalyticsChart from '~/components/GoogleAnalyticsChart.vue';

@Component({
  components: {
    GoogleAnalyticsChart,
  },
})
export default class AppStatisticsPage extends Vue {
  head() {
    return { title: 'IADC Digital Products Statistics' };
  }
}
</script>
