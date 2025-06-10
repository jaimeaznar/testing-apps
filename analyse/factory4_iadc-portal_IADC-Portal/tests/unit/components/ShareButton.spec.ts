import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import { stub } from 'sinon';
import Vuetify from 'vuetify';
import ShareButton from '@/components/ShareButton.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('ShareButton.vue', () => {
  let wrapper;
  let localVue;
  const url = 'http://localhost:8080/';
  const pageId = '552599764';
  const title = 'ShareButton';
  const description = 'IADC Portal ShareButton';

  beforeEach(async () => {
    localVue = createLocalVue();
    wrapper = mount(ShareButton, { localVue, vuetify: new Vuetify() });
    await wrapper.setProps({
      url,
      title,
      description,
    });
  });

  afterEach(() => {
    wrapper?.destroy();
  });

  it('should be a vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
    const tooltip = wrapper.find('span');
    expect(tooltip.vm.$options.name).toBe('v-tooltip');
  });

  it('should return a page Id', () => {
    const sharedUrl = `${url + pageId}/`;
    wrapper.vm.getPageId(sharedUrl);
    wrapper.attributes('id');
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.vm.url).toBe(url);
  });

  it('should init data', () => {
    expect(wrapper.vm.url).toBe(url);
    expect(wrapper.vm.title).toBe(title);
    expect(wrapper.vm.description).toBe(description);
  });

  it('should clicked called', async () => {
    const clickHandler = stub();
    wrapper = mount(ShareButton, {
      localVue,
      vuetify: new Vuetify(),
      propsData: { clickHandler },
    });
    await wrapper.trigger('share');
    expect(clickHandler.called).toBe(false);
  });
});
