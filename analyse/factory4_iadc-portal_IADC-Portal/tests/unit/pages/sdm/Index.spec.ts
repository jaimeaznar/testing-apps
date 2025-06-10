import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import indexPage from '@/pages/sdm/index.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('Index.vue', () => {
  let wrapper;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    wrapper = shallowMount(indexPage, {
      localVue,
      vuetify: new Vuetify(),
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
