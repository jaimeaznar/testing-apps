import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import { NuxtError } from '@nuxt/types';
import Page404 from '~/components/error/Error404.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('404 error pages', () => {
  let wrapper404;
  let localVue;
  const error: NuxtError = {};

  beforeEach(() => {
    localVue = createLocalVue();
    wrapper404 = mount(Page404, {
      localVue,
      vuetify: new Vuetify(),
      stubs: { NuxtLink: true },
    });
  });

  afterEach(() => {
    wrapper404.destroy();
  });

  it('should be a vue instance', () => {
    expect(wrapper404.vm).toBeTruthy();
    expect(wrapper404.exists()).toBeTruthy();
  });

  it('should get the right error 404', async () => {
    error.message = 'This is a 404 error message';
    error.statusCode = 404;
    await wrapper404.setProps({
      error,
    });
    expect(wrapper404.vm.error.statusCode).toBe(error.statusCode);
    expect(wrapper404.vm.error.message).toBe(error.message);
  });
});
