import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import CentralJiraTraining from '@/pages/tei/pds/CentralJiraTraining.vue';
import ConfluenceSlides from '@/components/ConfluenceSlides.vue';
import ConfluencePage from '@/components/ConfluencePage.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('CentralJiraTraining.vue', () => {
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
    jest.resetModules();
    wrapper = mount(CentralJiraTraining, {
      localVue,
      store,
      vuetify: new Vuetify(),
      stubs: ['ConfluencePage', 'ConfluenceSlides', 'VBtn'],
    });
  });

  afterEach(() => {
    wrapper?.destroy();
  });

  it('should be a vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have a component ConfluenceSlides', () => {
    expect(wrapper.findComponent(ConfluenceSlides).exists()).toBeTruthy();
  });

  it('should have a component ConfluencePage', () => {
    expect(wrapper.findComponent(ConfluencePage).exists()).toBeTruthy();
  });

  describe('Checkbox and button behavior', () => {
    it('should button deactivated when checkbox is checked and konviw IFrame data is not loaded', async () => {
      const checkboxInput = wrapper.find('input[type="checkbox"]');
      const buttonInput = wrapper.findComponent({ name: 'v-btn' });
      expect(checkboxInput.exists()).toBe(true);
      expect(buttonInput.exists()).toBe(true);
      expect(wrapper.vm.hasAccepted).toBe(false);
      expect(buttonInput.props('disabled')).toBe(true);
      await checkboxInput.setChecked(true);
      expect(checkboxInput.element.checked).toBe(true);
      expect(wrapper.vm.hasAccepted).toBe(true);
      expect(wrapper.vm.hasAccepted).toBe(true);
      expect(buttonInput.props('disabled')).toBe(true);
    });
    it('should button deactivated when checkbox is unchecked', async () => {
      const checkboxInput = wrapper.find('input[type="checkbox"]');
      const buttonInput = wrapper.findComponent({ name: 'v-btn' });
      await checkboxInput.setChecked(false);
      expect(checkboxInput.element.checked).toBe(false);
      expect(wrapper.vm.hasAccepted).toBe(false);
      expect(wrapper.vm.hasAccepted).toBe(false);
      expect(buttonInput.props('disabled')).toBe(true);
    });
  });
});
