<template>
  <AppStatisticsChart
    :app-id="propertyId"
    :name="name"
    :value="period"
    :show="isVisible"
    :data="chartData"
    :labels="chartLabels"
    :on-change="onChange"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import AppStatisticsChart from '@/components/AppStatisticsChart.vue';
import {
  dateRangeFactory,
  labelsFactory,
  dataFactory,
} from '@/structure/google-analytics/structure';

@Component({
  components: {
    AppStatisticsChart,
  },
})
export default class GoogleAnalyticsChart extends Vue {
  API_START_DATE = '365daysAgo';

  @Prop({ default: '', required: true })
  propertyId!: string;

  @Prop({ default: '', required: true })
  name!: string;

  @Prop({ default: '', required: true })
  hostname!: string;

  period = 'weeks';

  isVisible = false;

  chartLabels: string[] = [];
  chartData: any[] = [];

  get getDimensionsMetricByPeriod() {
    switch (this.period) {
      case 'weeks':
        return 'week,year';
      case 'days': {
        return 'date';
      }
      case 'months': {
        return 'month,year';
      }
      default: {
        return 'week';
      }
    }
  }

  get API_REQUESTS_PARAMS() {
    return [
      {
        name: 'Visits',
        metrics: 'sessions,engagedSessions',
        dimensions: 'date,pageLocation',
        dimensionFilter: {
          filter: {
            fieldName: 'hostname',
            stringFilter: {
              matchType: 'CONTAINS',
              value: this.hostname,
            },
          },
        },
      },
      {
        name: 'Users',
        metrics: 'activeUsers',
        dimensions: this.getDimensionsMetricByPeriod,
        dimensionFilter: {
          filter: {
            fieldName: 'hostname',
            stringFilter: {
              matchType: 'CONTAINS',
              value: this.hostname,
            },
          },
        },
      },
    ];
  }

  async loadChart(startDate: string, key: string) {
    try {
      const promises = this.API_REQUESTS_PARAMS.map(
        async ({ metrics, dimensions, dimensionFilter, name }) => {
          const { data } = await this.$axios.get(
            `${window.location.origin}/api/google-analytics/${this.propertyId}/report`,
            {
              params: {
                startDate,
                endDate: 'today',
                metrics,
                dimensions,
                dimensionFilter,
              },
            },
          );
          return {
            ...data,
            name,
            dimensions,
          };
        },
      );
      const results = await Promise.all(promises);
      this.chart(results, key);
    } catch (err) {
      this.$nuxt.error({
        statusCode: 500,
        message: (err as Error).message,
      });
    }
  }

  async onChange({ target: { value } }) {
    this.isVisible = false;
    this.period = value;
    await this.loadChart(this.API_START_DATE, value);
  }

  async fetch() {
    await this.loadChart(this.API_START_DATE, 'weeks');
  }

  chart(payload: any, key: string) {
    const dateRange = dateRangeFactory(key);
    const labels = labelsFactory(dateRange, key);
    const data = dataFactory(dateRange, key, payload);

    this.chartLabels = labels;
    this.chartData = data;
    this.isVisible = true;
  }
}
</script>
