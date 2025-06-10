import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import { NuxtError } from '@nuxt/types';
import Page500 from '~/components/error/Error500.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('500 error pages', () => {
  let wrapper500;
  let localVue;
  const error: NuxtError = {};

  beforeEach(() => {
    localVue = createLocalVue();
    wrapper500 = mount(Page500, {
      localVue,
      vuetify: new Vuetify(),
      stubs: { NuxtLink: true },
    });
  });

  afterEach(() => {
    wrapper500.destroy();
  });

  it('should be a vue instance', () => {
    expect(wrapper500.vm).toBeTruthy();
    expect(wrapper500.exists()).toBeTruthy();
  });

  it('should get the right error 500', async () => {
    error.message = 'This is a 500 error message';
    error.statusCode = 500;
    await wrapper500.setProps({
      error,
    });
    expect(wrapper500.vm.error.statusCode).toBe(error.statusCode);
    expect(wrapper500.vm.error.message).toBe(error.message);
  });
});
