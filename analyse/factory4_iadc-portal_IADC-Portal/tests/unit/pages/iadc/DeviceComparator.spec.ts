import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import DeviceComparator from '@/pages/iadc/iot/DeviceComparator.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

jest.mock('axios', () => ({
  get: () =>
    Promise.resolve({
      data: {
        results: [
          {
            docId: '12345',
            title: 'IoT Device #1',
          },
          {
            docId: '12346',
            title: 'IoT Device #2',
          },
          {
            docId: '12347',
            title: 'IoT Device #3',
          },
        ],
      },
    }),
}));

const routeMock = {
  query: { choosenDevice: '12347' },
};

describe('DeviceComparator.vue', () => {
  let wrapper;
  let localVue;
  const OLD_ENV = process.env;

  beforeEach(() => {
    localVue = createLocalVue();
    jest.resetModules();
    process.env = {
      iadc: "{baseURLDocsApi : 'https://docs-dev.sanofi.com/cpv/api'}",
    };
    wrapper = mount(DeviceComparator, {
      localVue,
      mocks: { $axios: axios, $route: routeMock },
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

  it('should return 3 devices', () => {
    expect(wrapper.vm.pagesDevices.length).toEqual(3);
  });

  describe('Load both v-select with list of devices', () => {
    it('load devices in first v-select', () => {
      const firstSelectDevice = wrapper.find('.v-select.firstSelect');
      expect(firstSelectDevice.exists()).toBe(true);
      expect(firstSelectDevice.props('items')[0].text).toBe('IoT Device #1');
      expect(firstSelectDevice.props('items')[0].value).toBe('12345');
      expect(firstSelectDevice.props('items')[1].text).toBe('IoT Device #2');
      expect(firstSelectDevice.props('items')[1].value).toBe('12346');
      expect(firstSelectDevice.props('items')[2].text).toBe('IoT Device #3');
      expect(firstSelectDevice.props('items')[2].value).toBe('12347');
    });

    it('load devices in second v-select', () => {
      const secondSelectDevice = wrapper.find('.v-select.secondSelect');
      expect(secondSelectDevice.exists()).toBe(true);
      expect(secondSelectDevice.props('items')[0].text).toBe('IoT Device #1');
      expect(secondSelectDevice.props('items')[0].value).toBe('12345');
      expect(secondSelectDevice.props('items')[1].text).toBe('IoT Device #2');
      expect(secondSelectDevice.props('items')[1].value).toBe('12346');
      expect(secondSelectDevice.props('items')[2].text).toBe('IoT Device #3');
      expect(secondSelectDevice.props('items')[2].value).toBe('12347');
    });
  });
});
