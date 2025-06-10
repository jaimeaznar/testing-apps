import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import { NuxtError } from '@nuxt/types';
import Page403 from '~/components/error/Error403.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('403 error pages', () => {
  let wrapper403;
  let localVue;
  const error: NuxtError = {};

  beforeEach(() => {
    localVue = createLocalVue();
    wrapper403 = mount(Page403, {
      localVue,
      vuetify: new Vuetify(),
      stubs: { NuxtLink: true },
    });
  });

  afterEach(() => {
    wrapper403.destroy();
  });

  it('should be a vue instance', () => {
    expect(wrapper403.vm).toBeTruthy();
    expect(wrapper403.exists()).toBeTruthy();
  });

  it('should get the right error 403', async () => {
    error.message = 'This is a 403 error message';
    error.statusCode = 403;
    await wrapper403.setProps({
      error,
    });
    expect(wrapper403.vm.error.statusCode).toBe(error.statusCode);
    expect(wrapper403.vm.error.message).toBe(error.message);
  });
});
