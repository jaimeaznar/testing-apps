<template>
  <div>
    <v-card elevation="2" class="d-inline-flex pa-2 ma-6" style="height: 380px">
      <ApexChart
        :width="width"
        height="300"
        type="line"
        :options="chartOptions"
        :series="chartSeries"
      />
      <v-progress-circular
        v-if="!chartShowState"
        :size="100"
        color="primary"
        indeterminate
        class="loading"
      />
    </v-card>
    <div class="input-chart">
      <input
        :id="`days-${chartId}`"
        type="radio"
        :name="`app-statistics-chart-days-${chartId}-days`"
        value="days"
        :checked="selectedPeriodOnChange('days')"
        :disabled="!chartShowState"
        @change="onChange($event)"
      />
      <label :for="`days-${chartId}`">Days</label>&nbsp; &nbsp;
      <input
        :id="`weeks-${chartId}`"
        type="radio"
        :name="`app-statistics-chart-weeks-${chartId}`"
        value="weeks"
        :checked="selectedPeriodOnChange('weeks')"
        :disabled="!chartShowState"
        @change="onChange($event)"
      />
      <label :for="`weeks-${chartId}`">Weeks</label>&nbsp; &nbsp;
      <input
        :id="`months-${chartId}`"
        type="radio"
        :name="`app-statistics-chart-months-${chartId}`"
        value="months"
        :checked="selectedPeriodOnChange('months')"
        :disabled="!chartShowState"
        @change="onChange($event)"
      />
      <label :for="`months-${chartId}`">Months</label>
    </div>
  </div>
</template>

<script lang="ts">
import { ApexOptions } from 'apexcharts';
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class AppStatisticsChart extends Vue {
  @Prop({ required: true })
  appId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  value!: string;

  @Prop({ required: true })
  show!: boolean;

  @Prop({ required: true })
  data!: any[];

  @Prop({ required: true })
  labels!: any[];

  @Prop({ required: true })
  onChange: (event: any) => void;

  get chartSeries() {
    return this.data;
  }

  get chartId() {
    return this.appId;
  }

  get chartName() {
    return this.name;
  }

  get chartLabels() {
    return this.labels ?? [];
  }

  get chartShowState() {
    return this.show;
  }

  get chartOptions(): ApexOptions {
    return {
      chart: {
        id: `appStatisticsChart-${this.chartId}`,
        dropShadow: {
          enabled: false,
          color: '#000',
          top: 4,
          left: 2,
          blur: 6,
          opacity: 0.2,
        },
      },
      title: {
        text: `Statistics ${this.chartName}`,
        align: 'left',
      },
      xaxis: {
        categories: this.chartLabels,
        type: 'datetime',
      },
      grid: {
        strokeDashArray: 5,
        xaxis: {
          lines: { show: false },
        },
        yaxis: {
          lines: { show: true },
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      markers: { size: 4 },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        floating: true,
        offsetY: -15,
        offsetX: -5,
      },
      theme: {
        mode: `${localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}`,
      },
    };
  }

  get width(): string {
    return this.$vuetify.breakpoint.mdAndUp ? '500px' : '100%';
  }

  selectedPeriodOnChange(value: string) {
    return this.value === value;
  }
}
</script>

<style lang="scss" scoped>
.input-chart {
  font-size: smaller;
  position: relative;
  margin-top: -60px;
  margin-left: 40px;
}

label {
  color: #696969;
  vertical-align: middle;

  .theme--dark & {
    color: white;
  }
}

input[type='radio'] {
  vertical-align: middle;
}

.loading {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  display: block;
}
</style>
