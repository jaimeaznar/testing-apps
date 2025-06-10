<template>
  <AppStatisticsChart
    :app-id="siteId"
    :name="siteName"
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

@Component({
  components: {
    AppStatisticsChart,
  },
})
export default class MatomoChart extends Vue {
  API_MATOMO_URL = `${(process.env.matomo as any).baseURL}`;
  API_METHOD = 'module=API&method=VisitsSummary.get';
  DEFAULT_DATE_DAY = 'previous365';
  DEFAULT_DATE_WEEK = 'previous52';
  DEFAULT_DATE_MONTH = 'previous12';
  API_PARAMS_DAYS = 'period=day';
  API_PARAMS_WEEKS = 'period=week';
  API_PARAMS_MONTHS = 'period=month';
  COMMON_PARAMS = 'format=json&filter_limit=-1';
  // API Token from generic read-only user iadc-portal
  API_TOKEN = `token_auth=${(process.env.matomo as any).apiToken}`;

  @Prop({ default: '' })
  siteName!: string;

  @Prop({ default: '0' })
  siteId!: string;

  @Prop({ default: '' })
  segment!: string;

  @Prop({ default: '' })
  startDate!: string;

  @Prop({ default: new Date().toISOString().split('T').shift() }) // default: current date at format 'YYYY-mm-dd'
  endDate!: string;

  @Prop({
    default: () => {
      return { Visits: 'nb_visits', Users: 'nb_users' };
    },
  })
  series!: Object;

  get paramsDay() {
    const dateParam = this.startDate
      ? `${this.startDate},${this.endDate}`
      : this.DEFAULT_DATE_DAY;
    return `date=${dateParam}&${this.API_PARAMS_DAYS}&${this.COMMON_PARAMS}`;
  }

  get paramsWeek() {
    const dateParam = this.startDate
      ? `${this.startDate},${this.endDate}`
      : this.DEFAULT_DATE_WEEK;
    return `date=${dateParam}&${this.API_PARAMS_WEEKS}&${this.COMMON_PARAMS}`;
  }

  get paramsMonth() {
    const dateParam = this.startDate
      ? `${this.startDate},${this.endDate}`
      : this.DEFAULT_DATE_MONTH;
    return `date=${dateParam}&${this.API_PARAMS_MONTHS}&${this.COMMON_PARAMS}`;
  }

  period = 'weeks';
  isVisible = false;

  chartLabels: string[] = [];
  chartData: any[] = [];

  URL_DAYS = `${this.API_MATOMO_URL}?${this.API_METHOD}&${this.paramsDay}&${this.API_TOKEN}&idSite=${this.siteId}${this.segmentUrlParam}`;
  URL_WEEKS = `${this.API_MATOMO_URL}?${this.API_METHOD}&${this.paramsWeek}&${this.API_TOKEN}&idSite=${this.siteId}${this.segmentUrlParam}`;
  URL_MONTHS = `${this.API_MATOMO_URL}?${this.API_METHOD}&${this.paramsMonth}&${this.API_TOKEN}&idSite=${this.siteId}${this.segmentUrlParam}`;

  get segmentUrlParam() {
    return this.segment ? `&segment=${this.segment}` : '';
  }

  async loadChart(url: string) {
    const { data } = await this.$axios.get(url);
    this.chart(data);
  }

  async onChange(event) {
    this.isVisible = false;
    const value = event.target.value;
    let url;
    switch (value) {
      case 'days':
        url = this.URL_DAYS;
        break;
      case 'weeks':
        url = this.URL_WEEKS;
        break;
      case 'months':
        url = this.URL_MONTHS;
        break;
    }
    this.period = value;
    await this.loadChart(url);
  }

  async fetch() {
    await this.loadChart(this.URL_WEEKS);
  }

  chart(data) {
    try {
      this.chartLabels = Object.keys(data).map((key) => {
        return key.substring(0, 10);
      });
      this.chartData = Object.entries(this.series).map(([name, identifier]) => {
        const series = Object.values(data).map((value: any) => {
          const ret = value[identifier] === undefined ? 0 : value[identifier];
          return identifier === 'avg_time_on_site'
            ? Math.ceil(ret / 60) // unit: minutes ( instead of seconds )
            : ret;
        });
        return { name, data: series };
      });
      this.isVisible = true;
    } catch (err) {
      this.$nuxt.error({
        statusCode: 500,
        message: (err as Error).message,
      });
    }
  }
}
</script>
