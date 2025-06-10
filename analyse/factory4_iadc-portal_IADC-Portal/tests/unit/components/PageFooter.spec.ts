import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import PageFooter from '@/components/PageFooter.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('PageFooter.vue', () => {
  let wrapper;
  let localVue;
  const editor = 'IADC';

  beforeEach(async () => {
    localVue = createLocalVue();
    wrapper = mount(PageFooter, { localVue, vuetify: new Vuetify() });
    await wrapper.setProps({
      editor,
    });
  });

  afterEach(() => {
    wrapper?.destroy();
  });

  it('should be a vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should init data', () => {
    expect(wrapper.vm.editor).toBe(editor);
  });

  it('should input return url', () => {
    expect(wrapper.find('span[id="editor"]').text()).toBe('by IADC');
  });
});
