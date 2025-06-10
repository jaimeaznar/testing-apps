import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import Categories from '@/pages/tei/pds/categories.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

jest.mock('axios', () => ({
  get: () =>
    Promise.resolve({
      data: {
        meta: { totalSize: 4, server: 'System Jira' },
        categories: [
          {
            id: 0,
            name: 'Group 1 > Subgroup 1.1 > Category 1',
            description: 'Category 1 Description',
          },
          {
            id: 1,
            name: 'Group 1 > Subgroup 1.2 > Category 2',
            description: 'Category 2 Description',
          },
          {
            id: 2,
            name: 'Group 2 > Subgroup 2.1 > Category 3',
            description: 'Category 3 Description',
          },
          {
            id: 3,
            name: 'Group 3 > Subgroup 3.1 > Category 4',
            description: 'Category 4 Description',
          },
        ],
      },
    }),
}));

describe('Categories.vue', () => {
  let wrapper;
  let localVue;
  const OLD_ENV = process.env;

  beforeEach(() => {
    localVue = createLocalVue();
    jest.resetModules();
    process.env = {
      iadc: "{baseURLDocsApi : 'https://docs-dev.sanofi.com/cpv/api'}",
    };
    wrapper = mount(Categories, {
      localVue,
      mocks: { $axios: axios },
      vuetify: new Vuetify(),
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

  it('should return total categories', () => {
    expect(wrapper.vm.totalCategories).toEqual(4);
  });

  describe('Categories.vue loads the data in filters', () => {
    it('load global functions in select globalFunction__field', () => {
      const selectInputGlobalFunctions = wrapper.find(
        '.v-select.globalFunction__field',
      );

      expect(selectInputGlobalFunctions.exists()).toBe(true);
      expect(selectInputGlobalFunctions.props('items')[0].text).toBe('All');
      expect(selectInputGlobalFunctions.props('items')[1]).toBe('Group 1');
      expect(selectInputGlobalFunctions.props('items')[2]).toBe('Group 1');
      expect(selectInputGlobalFunctions.props('items')[3]).toBe('Group 2');
      expect(selectInputGlobalFunctions.props('items')[4]).toBe('Group 3');
    });

    it('load units in select unit__field', () => {
      const selectInputUnits = wrapper.find('.v-select.unit__field');

      expect(selectInputUnits.exists()).toBe(true);
      expect(selectInputUnits.props('items')[0].text).toBe('All');
      expect(selectInputUnits.props('items')[1]).toBe('Group 1 > Subgroup 1.1');
      expect(selectInputUnits.props('items')[2]).toBe('Group 1 > Subgroup 1.2');
      expect(selectInputUnits.props('items')[3]).toBe('Group 2 > Subgroup 2.1');
      expect(selectInputUnits.props('items')[4]).toBe('Group 3 > Subgroup 3.1');
    });

    it('load categories in select category__field', () => {
      const selectInputCategories = wrapper.find('.v-select.category__field');

      expect(selectInputCategories.exists()).toBe(true);
      expect(selectInputCategories.props('items')[0].text).toBe('All');
      expect(selectInputCategories.props('items')[1]).toBe(
        'Group 1 > Subgroup 1.1 > Category 1',
      );
      expect(selectInputCategories.props('items')[2]).toBe(
        'Group 1 > Subgroup 1.2 > Category 2',
      );
      expect(selectInputCategories.props('items')[3]).toBe(
        'Group 2 > Subgroup 2.1 > Category 3',
      );
      expect(selectInputCategories.props('items')[4]).toBe(
        'Group 3 > Subgroup 3.1 > Category 4',
      );
    });
  });
});
