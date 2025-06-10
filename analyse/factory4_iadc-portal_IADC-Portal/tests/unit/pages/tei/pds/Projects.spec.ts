import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import Projects from '@/pages/tei/pds/projects.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

jest.mock('axios', () => ({
  get: () =>
    Promise.resolve({
      data: {
        meta: { totalSize: 1 },
        categories: [{ id: 0, name: 'Test' }],
      },
    }),
}));

describe('Projects.vue', () => {
  let wrapper;
  let localVue;
  const OLD_ENV = process.env;

  beforeEach(() => {
    localVue = createLocalVue();
    jest.resetModules();
    process.env = {
      iadc: "{baseURLDocsApi : 'https://docs-dev.sanofi.com/cpv/api'}",
    };
    wrapper = shallowMount(Projects, {
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

  it('should return total categories', () => {
    expect(wrapper.vm.totalCategories).toEqual(1);
  });

  it('should return projects title', () => {
    expect(wrapper.vm.title).toBe('Jira Projects');
  });
  it('should return a description with ...', () => {
    const description =
      'Description with less than 250 character, we have embarked on a large-scale digital transformation with short- and long-term goals that reflects the Play to Win strategy and drive growth for the company to allow the reinvestment the Play to Win strategy and drive growth for the company to allow the reinvestment the Play to Win strategy and drive growth for the company to allow the reinvestment';
    expect(wrapper.vm.shortenDescription(description)).toEqual(
      'Description with less than 250 character, we have embarked on a large-scale digital transformation with short- and long-term goals that reflects the Play to Win strategy and drive growth for the company to allow the reinvestment the Play to Win...',
    );
  });
});
