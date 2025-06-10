import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import Certificate from '@/pages/tei/pds/certificate.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

const certificate = '1234';
const userId = 'I0000000';
const userEmail = 'name.lastname@gmail.com';
const userGivenName = 'name';
const userFamilyName = 'lastname';
const userCountry = 'FR';
const userSite = 'Paris';
const userDepartment = 'department';
const trainingTitle = 'title';

jest.mock('axios', () => ({
  get: () => Promise.resolve({ data: { certificate } }),
}));

const $route = {
  query: { msgTitle: 'title' },
};

const authMock = {
  $state: {
    loggedIn: true,
    user: {
      identities: JSON.stringify([{ userId, providerName: 'sso' }]),
      address: userSite,
      locale: userCountry,
      email: userEmail,
      given_name: userGivenName,
      family_name: userFamilyName,
      zoneinfo: userDepartment,
      trainingTitle,
    },
  },
};

describe('Certificate.vue', () => {
  let wrapper;
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    jest.resetModules();
    wrapper = mount(Certificate, {
      localVue,
      mocks: { $axios: axios, $auth: authMock, $route },
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

  it('should get the User Data logged in', () => {
    expect(wrapper.vm.userName).toEqual(`${userGivenName} ${userFamilyName}`);
    expect(wrapper.vm.userId).toEqual(userId);
    expect(wrapper.vm.userEmail).toEqual(userEmail);
    expect(wrapper.vm.userCountry).toEqual(userCountry);
    expect(wrapper.vm.userSite).toEqual(userSite);
    expect(wrapper.vm.userDepartment).toEqual(userDepartment);
    expect(wrapper.vm.trainingTitle).toEqual(trainingTitle);
  });

  it('should return a training certificate', () => {
    expect(wrapper.vm.trainingCertificate).toEqual(certificate);
  });

  it('should display a canvas with id #qrcode', () => {
    expect(wrapper.find('#qrcode')).toBeTruthy();
  });

  it('should build a Url to verify a Certificate', () => {
    expect(wrapper.vm.buildUrlCertificate()).toEqual(
      `${window.location.origin}/api/certificate/verify/${certificate}?userId=${userId}&userEmail=${userEmail}`,
    );
  });

  it('should button exists', () => {
    const buttonInput = wrapper.find('button[type="button"]');
    expect(buttonInput.exists()).toBe(true);
  });
});
