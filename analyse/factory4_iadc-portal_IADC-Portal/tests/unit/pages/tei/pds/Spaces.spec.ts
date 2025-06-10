import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import Spaces from '@/pages/tei/pds/spaces.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

jest.mock('axios', () => ({
  get: () => Promise.resolve({ data: { meta: { total: 1 }, spaces: [] } }),
}));

describe('Spaces.vue', () => {
  let wrapper;
  let localVue;
  const OLD_ENV = process.env;

  beforeEach(() => {
    localVue = createLocalVue();
    jest.resetModules();
    process.env = {
      iadc: "{baseURLDocsApi : 'https://docs-dev.sanofi.com/cpv/api'}",
    };
    wrapper = shallowMount(Spaces, {
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

  it('should return a total spaces', () => {
    expect(wrapper.vm.totalSpaces).toEqual(1);
  });

  it('should return a empty array space', () => {
    expect(wrapper.vm.spaces.length).toEqual(0);
  });

  it('should return a description with ...', () => {
    const description =
      'Description with more than 125 character, we have embarked on a large-scale digital transformation with short- and long-term goals that reflects the Play to Win strategy and drive growth for the company to allow the reinvestment';
    expect(wrapper.vm.shortenDescription(description)).toEqual(
      'Description with more than 125 character, we have embarked on a large-scale digital transformation with short- and long-term goals that reflects the Play to Win strategy and drive growth for the...',
    );
  });
});
