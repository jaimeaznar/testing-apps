import { mount, createLocalVue } from '@vue/test-utils';
import axios from 'axios';
import Vue from 'vue';
import Vuetify from 'vuetify';
import AppStatistics from '@/pages/iadc/app-statistics.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);

jest.mock('axios', () => ({
  get: () => Promise.resolve({ data: {} }),
}));

describe('AppStatistics.vue', () => {
  let wrapper;
  let localVue;
  const OLD_ENV = process.env;

  beforeEach(() => {
    localVue = createLocalVue();
    jest.resetModules();
    process.env = {
      iadc: "{baseURLDocsApi : 'https://docs-dev.sanofi.com/cpv/api'}",
      matomo: "{baseURL : 'https://iadc-matomo-dev.sanofi.com/?module=API'}",
    };
    wrapper = mount(AppStatistics, {
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
});
