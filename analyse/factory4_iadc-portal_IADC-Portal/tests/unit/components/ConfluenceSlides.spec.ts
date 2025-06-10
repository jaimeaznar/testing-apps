import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import ConfluenceSlides from '@/components/ConfluenceSlides.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('ConfluenceSlides.vue', () => {
  let wrapper;
  let localVue;
  const OLD_ENV = process.env;
  const pathRoute = 'konviw';
  const pageId = '552599764';
  const styleId = 'test';
  const heightSlide = '200';
  const widthSlide = '100';
  const title = 'Slides iframe';

  beforeEach(async () => {
    localVue = createLocalVue();
    jest.resetModules();
    process.env = {
      iadc: "{baseURLDocs : 'http://localhost:8080/'}",
    };
    wrapper = mount(ConfluenceSlides, {
      localVue,
      mocks: {},
      vuetify: new Vuetify(),
      stubs: [],
    });
    await wrapper.setProps({
      pathRoute,
      pageId,
      styleId,
      heightSlide,
      widthSlide,
    });
  });

  afterEach(() => {
    wrapper?.destroy();
    process.env = OLD_ENV;
  });

  it('should be a vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should init data', () => {
    expect(wrapper.vm.pathRoute).toBe(pathRoute);
    expect(wrapper.vm.pageId).toBe(pageId);
    expect(wrapper.vm.styleId).toBe(styleId);
    expect(wrapper.vm.heightSlide).toBe(heightSlide);
    expect(wrapper.vm.heightSlide).toBe(heightSlide);
  });

  it('should return an url', () => {
    const url = wrapper.vm.url;
    expect(url).toBeTruthy();
    expect(wrapper.vm.url).toContain(
      '/slides/konviw/' + pageId + '?style=' + styleId + '',
    );
  });

  it('should load an iframe', () => {
    const iframe = wrapper.find('iframe');
    expect(wrapper.find('iframe').exists()).toBeTruthy();
    expect(iframe.attributes('id')).toContain('konviw-slide');
    expect(iframe.attributes('src')).toContain(pageId);
    expect(iframe.attributes('title')).toContain(title);
    expect(iframe.attributes('height')).toEqual(heightSlide);
    expect(iframe.attributes('width')).toEqual(widthSlide);
  });
});
