import { mount, createLocalVue } from '@vue/test-utils';
import axios from 'axios';
import Vue from 'vue';
import Vuetify from 'vuetify';
import MatomoChart from '@/components/MatomoChart.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

jest.mock('axios', () => ({
  get: () => Promise.resolve({ data: {} }),
}));

describe('MatomoChart.vue', () => {
  let wrapper;
  let localVue;
  const OLD_ENV = process.env;

  beforeEach(() => {
    localVue = createLocalVue();
    jest.resetModules();
    process.env = {
      matomo: "{baseURL : 'https://iadc-matomo-dev.sanofi.com/?module=API'}",
    };
    wrapper = mount(MatomoChart, {
      localVue,
      mocks: { $axios: axios },
      vuetify: new Vuetify(),
    });
  });

  afterEach(() => {
    wrapper?.destroy();
    process.env = OLD_ENV;
  });

  it('should be a vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have days, weeks and months selection', () => {
    const labels = wrapper.findAll('.input-chart label');

    const days = labels.at(0);
    expect(days.text()).toBe('Days');

    const weeks = labels.at(1);
    expect(weeks.text()).toBe('Weeks');

    const months = labels.at(2);
    expect(months.text()).toBe('Months');
  });
});
