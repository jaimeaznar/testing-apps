import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import Issues from '@/pages/tei/pds/Issues.vue';
import { IssueType } from '~/pages/tei/data/models/issueType.model';
import { Status } from '~/pages/tei/data/models/status.model';
Vue.config.productionTip = false;
Vue.use(Vuetify);

jest.mock('axios', () => ({
  get: () =>
    Promise.resolve({
      data: {
        meta: { totalSize: 1, cred: {} },
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
        ],
        projects: [
          {
            id: 1,
            key: 'testProjectKey',
            name: 'testPestProjectName',
            totalIssueCount: 1,
            categoryId: 1,
            categoryName: 'testProjeestCategoryName',
          },
        ],
        issueTypeWithStatuses: [
          {
            id: 1,
            name: 'testIssueTypeWithStatuses',
            statuses: [
              {
                id: 1,
                name: 'testStatus',
              },
            ],
          },
        ],
        issues: [
          {
            key: 'TEST123',
            fields: [
              'key',
              'issuetype',
              'summary',
              'reporter',
              'assignee',
              'status',
              'fixVersions',
              'customfield_10020',
            ],
            id: 1,
          },
        ],
        users: [],
        fixVersions: [],
      },
    }),
}));

describe('Issues.vue', () => {
  let wrapper;
  let localVue;
  const OLD_ENV = process.env;
  const $route = {
    query: {
      server: 'System JIRA',
      startAt: '0',
      maxResults: '30',
      jqlSearch:
        'project = "PRJ-1" AND key = FACT-5272 AND Sprint IN ("FACT - Sprint 85")',
      fields: '*all',
      reader: 'true',
      categoryId: '0',
    },
  };

  beforeEach(() => {
    localVue = createLocalVue();
    jest.resetModules();
    process.env = {
      iadc: "{baseURLDocsApi : 'https://docs-dev.sanofi.com/cpv/api'}",
      features: '{centralJiraIssueEnabled: "enable"}',
    };
    wrapper = shallowMount(Issues, {
      localVue,
      mocks: { $axios: axios, $route },
      vuetify: new Vuetify(),
    });
    wrapper.vm.preload = false;
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

  it('should return issues title', () => {
    expect(wrapper.vm.title).toBe('Jira Issues Search Dashboard');
  });

  it('should return total projects', () => {
    expect(wrapper.vm.totalProjects).toEqual(1);
  });

  it('should return an empty array for empty input', () => {
    expect(wrapper.vm.findUniqueStatusTypes([])).toEqual([]);
  });

  it('should return unique status types', () => {
    const issueTypes: IssueType[] = [
      {
        id: 1,
        name: 'Bug',
        statuses: [
          { id: 1, name: 'Open' },
          { id: 2, name: 'In Progress' },
        ],
      },
      {
        id: 2,
        name: 'Feature',
        statuses: [
          { id: 1, name: 'Open' },
          { id: 2, name: 'In Progress' },
          { id: 3, name: 'Resolved' },
        ],
      },
      {
        id: 3,
        name: 'Epic',
        statuses: [
          { id: 1, name: 'Open' },
          { id: 2, name: 'In Progress' },
        ],
      },
    ];

    const expectedStatuses: Status[] = [
      { id: 1, name: 'Open' },
      { id: 2, name: 'In Progress' },
      { id: 3, name: 'Resolved' },
    ];

    expect(wrapper.vm.findUniqueStatusTypes(issueTypes)).toEqual(
      expectedStatuses,
    );
  });

  it('should return a description with ...', () => {
    const description =
      'Description with less than 250 character, we have embarked on a large-scale digital transformation with short- and long-term goals that reflects the Play to Win strategy and drive growth for the company to allow the reinvestment the Play to Win strategy and drive growth for the company to allow the reinvestment the Play to Win strategy and drive growth for the company to allow the reinvestment';
    expect(wrapper.vm.shortenDescription(description)).toEqual(
      'Description with less than 250 character, we have embarked on a large-scale digital transformation with short- and long-term goals that reflects the Play to Win strategy and drive growth for the company to allow the reinvestment the Play to Win...',
    );
  });

  it('should generate JQL with project key', () => {
    const result = wrapper.vm.generateJQL();
    expect(result).toContain(`project = "${wrapper.vm.selectedProject.key}"`);
  });

  it('should generate JQL with issue types', () => {
    wrapper.vm.selectedIssueTypes = [{ name: 'Task' }, { name: 'Bug' }];
    const result = wrapper.vm.generateJQL();
    expect(result).toContain(`AND issuetype IN ("Task","Bug")`);
  });

  it('should generate JQL with statuses', () => {
    wrapper.vm.selectedStatuses = [{ name: 'Open' }, { name: 'In Progress' }];
    const result = wrapper.vm.generateJQL();
    expect(result).toContain(`AND status IN ("Open","In Progress")`);
  });

  it('should generate JQL with summary search', () => {
    wrapper.vm.summarySearch = 'test';
    const result = wrapper.vm.generateJQL();
    expect(result).toContain(`AND summary ~ "${wrapper.vm.summarySearch}"`);
  });

  it('should not generate JQL without selected project or issuekey', () => {
    wrapper.vm.selectedProject.key = '';
    wrapper.vm.issueKeySearch = '';
    const result = wrapper.vm.generateJQL();
    expect(result).toEqual('');
  });
});
