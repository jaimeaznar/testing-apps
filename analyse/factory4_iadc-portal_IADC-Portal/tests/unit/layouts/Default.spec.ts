import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import defaultVue from '@/layouts/default.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);

const $auth = { push: jest.fn() };
describe('Default.vue Layout', () => {
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

    const currentPortal = {
      search: true,
      glisten: true,
    };

    wrapper = shallowMount(defaultVue, {
      localVue,
      store,
      vuetify: new Vuetify(),
      mocks: { $auth, currentPortal },
      stubs: ['svg-icon', 'NuxtLink', 'GlistenClient', 'nuxt', 'nuxt-link'],
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
