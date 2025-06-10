import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import AppDrawer from '@/components/AppDrawer.vue';
import { LandingPageModel } from '~/api/models/landing-page.model';
import landingPageData from '~/tests/mocks/landing-page-data';

Vue.config.productionTip = false;
Vue.use(Vuetify);

describe('AppDrawer.vue', () => {
  let wrapper;
  let localVue;
  let store;
  const menus = [];

  beforeEach(async () => {
    localVue = createLocalVue();
    localVue.use(Vuex);

    // eslint-disable-next-line import/no-named-as-default-member
    store = new Vuex.Store({
      state: {
        drawer: '',
        iframeData: {
          showMetadata: true,
        },
        landingPageData,
      },
      actions: {},
      mutations: {
        drawer(state: any, val: any) {
          state.drawer = val;
        },
        iframeData(state: any) {
          state.iframeData.showMetadata = false;
        },
        landingPageData(state: any, value: LandingPageModel[]) {
          state.landingPageData = value;
        },
      },
    });

    wrapper = mount(AppDrawer, { localVue, store, vuetify: new Vuetify() });
    await wrapper.setProps({
      menus,
    });
  });

  afterEach(() => {
    wrapper?.destroy();
  });

  it('should be a vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should hide page information', () => {
    wrapper.vm.hidePageInformation();
    expect(store.state.iframeData.showMetadata).toEqual(false);
  });
});
