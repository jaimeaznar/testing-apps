<template>
  <v-container mb-10>
    <h2 class="text-center">Usage KPI</h2>
    <br />
    <div class="d-flex flex-wrap justify-center">
      <MatomoChart
        site-name="Medvi Vaccine"
        :site-id="siteId"
        :segment="`${segmentPrefix}F04_medvi%25252F`"
        :start-date="startDate"
        :series="series"
      />
      <MatomoChart
        site-name="Sightlink Vaccine"
        :site-id="siteId"
        :segment="`${segmentPrefix}F05_sightlink%25252F`"
        :start-date="startDate"
        :series="series"
      />
      <MatomoChart
        site-name="Medvi Genmed"
        :site-id="siteId"
        :segment="`${segmentPrefix}F08_medvi_genmed%25252F`"
        :start-date="startDate"
        :series="series"
      />
      <MatomoChart
        site-name="Sightlink Genmed"
        :site-id="siteId"
        :segment="`${segmentPrefix}F09_sightlink-genmed%25252F`"
        :start-date="startDate"
        :series="series"
      />
      <MatomoChart
        site-name="Medvi Genzyme"
        :site-id="siteId"
        :segment="`${segmentPrefix}F11_medvi-genzyme%25252F`"
        :start-date="startDate"
        :series="series"
      />
      <MatomoChart
        site-name="Sightlink Genzyme"
        :site-id="siteId"
        :segment="`${segmentPrefix}F12_sightlink-genzyme%25252F`"
        :start-date="startDate"
        :series="series"
      />
      <MatomoChart
        site-name="Medvi Commercial"
        :site-id="siteId"
        :segment="`${segmentPrefix}F13_crm-compliance-engine%25252F`"
        :start-date="startDate"
        :series="series"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import MatomoChart from '~/components/MatomoChart.vue';

@Component({
  components: {
    MatomoChart,
  },
})
export default class MatomoIADCPage extends Vue {
  head() {
    return { title: 'NLP Engine Statistics' };
  }

  siteId = 21;
  startDate = '2022-01-01';
  segmentPrefix =
    'pageUrl%3D%3Dhttps%25253A%25252F%25252Fdashboards-voyager.sanofi.com%25252Fapp_direct%25252';

  series = {
    Visits: 'nb_visits',
    Users: 'nb_uniq_visitors',
    'Average Time Spent (in minutes)': 'avg_time_on_site',
  };
}
</script>
