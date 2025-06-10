<template>
  <v-container mb-10>
    <h2 class="text-center">Matomo Data Applications statistics</h2>
    <br />
    <div class="d-flex flex-wrap justify-center">
      <MatomoChart site-name="Voyager" site-id="21" />
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
export default class MatomoDataPage extends Vue {
  head() {
    return { title: 'Data Products Statistics' };
  }
}
</script>
