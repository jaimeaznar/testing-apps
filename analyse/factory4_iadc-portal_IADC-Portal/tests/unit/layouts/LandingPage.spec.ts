import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import LandingPage from '@/layouts/landingpage.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

const $auth = { push: jest.fn() };

describe('LandingPage.vue', () => {
  let wrapper;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    // eslint-disable-next-line import/no-named-as-default-member
    const store = new Vuex.Store({
      state: [{}],
      actions: {},
    });
    wrapper = mount(LandingPage, {
      localVue,
      store,
      vuetify: new Vuetify(),
      mocks: { $auth },
      stubs: ['svg-icon', 'NuxtLink', 'nuxt', 'nuxt-link'],
    });
  });

  afterEach(() => {
    wrapper?.destroy();
  });

  it('should be a vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
  });
});
