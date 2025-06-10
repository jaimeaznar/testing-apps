import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import IssueDetails from '@/pages/tei/pds/issueDetails.vue';
Vue.config.productionTip = false;
Vue.use(Vuetify);

jest.mock('axios', () => ({
  get: () =>
    Promise.resolve({
      data: {
        screenDetails: {},
      },
    }),
}));

const mockCalculateIssueStatusColor = jest.fn((_issue) => 'mocked-color');

describe('IssueDetails.vue', () => {
  let wrapper;
  let localVue;
  const propsData = {
    project: {
      id: 1,
      key: 'testProjectKey',
      name: 'testPestProjectName',
      totalIssueCount: 1,
      categoryId: 1,
      categoryName: 'testProjeestCategoryName',
    },
    issue: {
      key: 'TEST123',
      fields: {
        issuetype: { name: 'test-issueType' },
        summary: 'test-summary',
        reporter: 'test-reporter',
        assignee: 'test-assignee',
        status: 'test-status',
      },
      id: 1,
    },
  };
  const OLD_ENV = process.env;

  beforeEach(() => {
    localVue = createLocalVue();
    jest.resetModules();
    process.env = {
      iadc: "{baseURLDocsApi : 'https://docs-dev.sanofi.com/cpv/api'}",
      features: '{centralJiraIssueEnabled: "enable"}',
    };
    wrapper = shallowMount(IssueDetails, {
      localVue,
      mocks: { $axios: axios },
      vuetify: new Vuetify(),
      propsData,
    });
    // Set the method to your mock
    wrapper.vm.calculateIssueStatusColor = mockCalculateIssueStatusColor;
    wrapper.vm.selectedProject = { key: 'PRJ-1' };
  });

  afterEach(() => {
    wrapper?.destroy();
    process.env = OLD_ENV;
  });

  it('should be a vue instance', () => {
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.exists()).toBeTruthy();
  });

  describe('extractTextFromJsonField', () => {
    it('should return a string if the input is a string', () => {
      const jsonFieldValue = 'hello world';
      const result = wrapper.vm.extractTextFromJsonField(jsonFieldValue);
      expect(result).toEqual(jsonFieldValue);
    });

    it('should return a string if the input is a number', () => {
      const jsonFieldValue = 42;
      const result = wrapper.vm.extractTextFromJsonField(jsonFieldValue);
      expect(result).toEqual('42');
    });

    it('should return an empty string if the input is null or undefined', () => {
      const jsonFieldValue = null;
      const result = wrapper.vm.extractTextFromJsonField(jsonFieldValue);
      expect(result).toEqual('');
    });

    it('should return the name if it exists', () => {
      const jsonFieldValue = { name: 'John' };
      const result = wrapper.vm.removeLeadingTrailingSpacesAndCommas(
        wrapper.vm.extractTextFromJsonField(jsonFieldValue),
      );
      expect(result).toEqual('John');
    });

    it('should return the displayName if it exists', () => {
      const jsonFieldValue = { displayName: 'John' };
      const result = wrapper.vm.removeLeadingTrailingSpacesAndCommas(
        wrapper.vm.extractTextFromJsonField(jsonFieldValue),
      );
      expect(result).toEqual('John');
    });

    it('should return the inward issue and outward issue if they exist', () => {
      const inwardIssue = {
        key: 'IN-1',
        fields: {
          summary: 'Inward issue summary',
          status: { name: 'Inward issue status' },
        },
      };
      const outwardIssue = {
        key: 'OUT-1',
        fields: {
          summary: 'Outward issue summary',
          status: { name: 'Outward issue status' },
        },
      };
      const type = {
        id: '10108',
        name: 'Defect',
        inward: 'created by',
        outward: 'created',
      };
      const jsonFieldValue = { inwardIssue, outwardIssue, type };
      const result = wrapper.vm.extractTextFromJsonField(jsonFieldValue);
      expect(result).toContain(inwardIssue.key);
      expect(result).toContain(inwardIssue.fields.summary);
      expect(result).toContain(inwardIssue.fields.status.name);
      expect(result).toContain(outwardIssue.key);
      expect(result).toContain(outwardIssue.fields.summary);
      expect(result).toContain(outwardIssue.fields.status.name);
    });

    it('should return the flattened JSON if the input is an object', () => {
      const jsonFieldValue = { name: 'John', age: 30 };
      const result = wrapper.vm.removeLeadingTrailingSpacesAndCommas(
        wrapper.vm.extractTextFromJsonField(jsonFieldValue),
      );
      expect(result).toEqual('John');
    });

    it('should return the flattened JSON if the input is an array', () => {
      const jsonFieldValue = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];
      const result = wrapper.vm.removeLeadingTrailingSpacesAndCommas(
        wrapper.vm.extractTextFromJsonField(jsonFieldValue),
      );
      expect(result).toContain('John, Jane');
    });
  });

  describe('extractText', () => {
    // Test case when content is undefined
    it('should return an empty string when content is undefined', () => {
      const result = [];
      expect(wrapper.vm.extractText(undefined, result)).toBe('');
      expect(result).toEqual([]);
    });

    // Test case when content has text items
    it('should push each text item into the result array', () => {
      const doc = [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hello' },
            { type: 'text', text: 'world' },
          ],
        },
      ];
      const result = wrapper.vm.extractText(doc);
      expect(result).toEqual('Helloworld');
    });

    // Test case when content has link items
    it('should push each link item into the result array with a prefix of "~"', () => {
      const doc = [
        {
          type: 'paragraph',
          content: [
            { type: 'link', attrs: { href: 'https://www.test-1.com/' } },
          ],
        },
      ];
      const result = wrapper.vm.extractText(doc);
      expect(result).toEqual('~ https://www.test-1.com/');
    });
  });
});
