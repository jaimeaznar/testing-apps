import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import ConfluencePage from '@/components/ConfluencePage.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('ConfluencePage.vue', () => {
  let wrapper;
  let localVue;
  const OLD_ENV = process.env;
  const pathRoute = 'konviw';
  const pageId = '552599764';
  const pageType = 'title';
  const pageTheme = 'dark';
  const showMetadata = true;
  const showBorder = true;
  const fullPage = true;

  const wrongStyle = 'iadccc';
  const wrongCache = 'no-cacheee';

  beforeEach(async () => {
    localVue = createLocalVue();
    jest.resetModules();
    process.env = {
      iadc: "{baseURLDocs : 'http://localhost:8080/'}",
    };
    wrapper = mount(ConfluencePage, {
      localVue,
      mocks: {
        $route: {
          fullPath: `/cpv/wiki/spaces/konviw/pages/${552599764}?style=${wrongStyle}&cache=${wrongCache}`,
        },
      },
      vuetify: new Vuetify(),
      stubs: [],
    });
    await wrapper.setProps({
      pathRoute,
      pageId,
      pageType,
      pageTheme,
      showMetadata,
      showBorder,
      fullPage,
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
    expect(wrapper.vm.pageType).toBe(pageType);
    expect(wrapper.vm.pageTheme).toBe(pageTheme);
    expect(wrapper.vm.showMetadata).toBe(showMetadata);
    expect(wrapper.vm.showBorder).toBe(showBorder);
    expect(wrapper.vm.fullPage).toBe(fullPage);
  });

  it('should return an url', () => {
    const url = wrapper.vm.url;
    expect(url).toBeTruthy();
    expect(wrapper.vm.url).toContain(
      '/spaces/konviw/pages/' +
        pageId +
        '?theme=' +
        pageTheme +
        '&type=' +
        pageType +
        '',
    );
  });

  it('should load an iframe', () => {
    const iframe = wrapper.find('iframe');
    expect(wrapper.find('iframe').exists()).toBeTruthy();
    expect(iframe.attributes('id')).toContain('konviw-page');
    expect(iframe.attributes('src')).toContain('pages/552599764');
    expect(iframe.attributes('title')).toContain('Page iframe');
  });

  it('should not pass incorrect parameters', () => {
    const iframe = wrapper.find('iframe');
    expect(iframe.attributes('src')).not.toContain(wrongStyle);
    expect(iframe.attributes('src')).not.toContain(wrongCache);
  });

  describe('URL update after cicking a link', () => {
    // helper to avoid long lines
    function getUrl(currentUrl, newPageId) {
      return wrapper.vm.getURLFromPageId(currentUrl, newPageId);
    }
    it('updates the URL when at the root', () => {
      expect(getUrl('/portal', 123)).toEqual('/portal/123');
      expect(getUrl('/portal/', 123)).toEqual('/portal/123');
    });
    it('does not update the URL at the root if it is already the current page', async () => {
      // because the iframeLoaded() method is called even when loading the portal homepage
      // and the homepage would auto-reload, losing and customisations from Index.vue
      await wrapper.setProps({ pageId: 123 });
      expect(getUrl('/portal', 123)).toEqual('/portal');
      expect(getUrl('/portal/', 123)).toEqual('/portal/');
    });
    it('updates the URL when there is no current group', () => {
      expect(getUrl('/portal/123', 456)).toEqual('/portal/456');
      expect(getUrl('/portal/123/', 456)).toEqual('/portal/456');
    });
    it('updates the URL when there is an existing group', () => {
      expect(getUrl('/portal/group/123', 456)).toEqual('/portal/group/456');
      expect(getUrl('/portal/group/123/', 456)).toEqual('/portal/group/456');
    });
  });
});
