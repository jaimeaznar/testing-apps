import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import FeedbackDashboard from '@/pages/iadc/feedback-dashboard.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('Feedback-Dashboard.vue', () => {
  let wrapper;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    wrapper = shallowMount(FeedbackDashboard, {
      localVue,
      vuetify: new Vuetify(),
      stubs: ['GlistenDashboard'],
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
