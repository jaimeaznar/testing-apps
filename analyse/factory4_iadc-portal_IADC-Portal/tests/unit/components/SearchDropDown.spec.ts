import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import axios from 'axios';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import SearchDropDown from '@/components/SearchDropdown.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);
let MOCK_SEARCH_RESULTS: any;

beforeEach(() => {
  MOCK_SEARCH_RESULTS = JSON.parse(
    JSON.stringify(require('../../mocks/searchResults.json')),
  );
});

jest.mock('axios', () => ({
  get: () => Promise.resolve({ data: { results: MOCK_SEARCH_RESULTS } }),
}));

describe('SearchDropDown.vue', () => {
  let wrapper;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    jest.resetModules();
    process.env = {
      iadc: "{baseURLDocsApi : 'https://iadc-dev.sanofi.com/cpv/api/'}",
    };
    // eslint-disable-next-line import/no-named-as-default-member
    const store = new Vuex.Store({
      state: {
        spaceKeys: ['iadc', 'eoee', 'fact', 'dgbi', 'smspc', 'dmdg', 'ms'],
        spaceTitles: [
          'IADC Program',
          'eOEE Product',
          'FaCT Product',
          'DGBI Product',
          'SMS Digital Cockpit',
          'Data Science Workbench',
          'GoGemba',
        ],
        search: false,
        targetUrl: 'iadc',
      },
      actions: {},
      mutations: {
        toggleSearch(state: any) {
          state.search = !state.search;
        },
      },
    });
    wrapper = mount(SearchDropDown, {
      localVue,
      store,
      mocks: { $axios: axios },
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

  it('should return an array of spaces', () => {
    const expectedKeys = [
      'iadc',
      'eoee',
      'fact',
      'dgbi',
      'smspc',
      'dmdg',
      'ms',
    ];
    const expectedTitles = [
      'IADC Program',
      'eOEE Product',
      'FaCT Product',
      'DGBI Product',
      'SMS Digital Cockpit',
      'Data Science Workbench',
      'GoGemba',
    ];
    expect(wrapper.vm.spaceKeys).toEqual(expectedKeys);
    expect(wrapper.vm.spaceTitles).toEqual(expectedTitles);
  });

  it('should toggle dropdown', () => {
    wrapper.vm.toggleDropDown();
    expect(wrapper.vm.showDropDown).toEqual(true);
    wrapper.vm.toggleDropDown();
    expect(wrapper.vm.showDropDown).toEqual(false);
  });

  it('should toggle search', () => {
    wrapper.vm.toggleSearch();
    expect(wrapper.vm.search).toEqual(true);
    wrapper.vm.toggleSearch();
    expect(wrapper.vm.search).toEqual(false);
  });

  it('should return target url', () => {
    expect(wrapper.vm.targetUrl).toEqual('iadc');
  });

  it('should set the selected page type', () => {
    wrapper.vm.blog = false;
    wrapper.vm.page = false;
    wrapper.vm.pageTypeChange();
    expect(wrapper.vm.selectedPageType).toEqual('');

    wrapper.vm.blog = true;
    wrapper.vm.page = true;
    wrapper.vm.pageTypeChange();
    expect(wrapper.vm.selectedPageType).toEqual('');

    wrapper.vm.blog = false;
    wrapper.vm.page = true;
    wrapper.vm.pageTypeChange();
    expect(wrapper.vm.selectedPageType).toEqual('page');

    wrapper.vm.blog = true;
    wrapper.vm.page = false;
    wrapper.vm.pageTypeChange();
    expect(wrapper.vm.selectedPageType).toEqual('blogpost');
  });
});
