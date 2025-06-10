import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import { LandingPageModel } from '@/api/models/landing-page.model';
import indexPage from '@/pages/index.vue';
import landingPageData from '~/tests/mocks/landing-page-data';

Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('Index.vue from Landing Page', () => {
  let wrapper;
  let localVue;
  let windowSpy;
  let store;

  const landingpage: LandingPageModel[] = landingPageData;
  const url = 'http://localhost:8080/';
  const onClick = jest.fn();

  beforeEach(async () => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    windowSpy = jest.spyOn(window, 'window', 'get');

    // eslint-disable-next-line import/no-named-as-default-member
    store = new Vuex.Store({
      state: {
        landingPageData: [],
      },
      actions: {},
      mutations: {
        landingPageData(state: any, value: LandingPageModel[]) {
          state.landingPageData = value;
        },
      },
    });

    wrapper = shallowMount(indexPage, {
      localVue,
      store,
      vuetify: new Vuetify(),
      listeners: {
        click: onClick,
      },
    });
    await wrapper.setProps({
      landingPages: landingpage,
    });
  });

  afterEach(() => {
    wrapper?.destroy();
    windowSpy?.mockRestore();
  });

  it('should be a vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should return a description text', () => {
    const str = wrapper.vm.shortenDescription(landingpage[2].description);
    const strLen = str.length;
    expect(str).toEqual(landingpage[2].description);
    expect(strLen).toBeLessThanOrEqual(125);
  });

  it('should return a description text with ...', () => {
    const str = wrapper.vm.shortenDescription(landingpage[0].description);
    const strLen = str.length;
    expect(str).toEqual(
      'Description with more than 125 character, we have embarked on a large-scale digital transformation with short- and long-term...',
    );
    expect(strLen).toBeGreaterThanOrEqual(125);
  });

  it('should be undefined.', () => {
    windowSpy.mockImplementation(() => ({
      location: {
        origin: url,
      },
      open: jest.fn(),
    }));
    const openUrl = wrapper.vm.open('iadc');
    expect(openUrl).toBeUndefined();
  });

  it('should return an order array with enabled entities and sorted by title', () => {
    const orderLandingPage: LandingPageModel[] =
      wrapper.vm.sortPages(landingpage);
    expect(orderLandingPage.length).toBe(2);
    expect(orderLandingPage.length).toBeLessThanOrEqual(3);
    expect(orderLandingPage[0]).toEqual(landingpage[2]);
    expect(orderLandingPage[1]).toEqual(landingpage[0]);
    expect(orderLandingPage[2]).toBeUndefined();
  });

  it('should have the correct elevation class on hover', () => {
    const classes = wrapper.classes();
    expect(classes).toContain('card');
    expect(classes).not.toContain('elevation-8');
  });
});
