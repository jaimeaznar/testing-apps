<template>
  <v-container>
    <v-row no-gutters>
      <v-col md="6" offset-md="3">
        <h2 class="text-center">{{ title }}</h2>
        <h4 class="text-center">v{{ jiraIssuevVersion }}</h4>
      </v-col>
      <v-col align-self="end">
        <v-btn
          rounded
          dark
          :disabled="!totalIssues"
          color="primary"
          class="ma-2 pa-2 d-flex flex-grow-1 white--text"
          @click="copyToClipboard"
        >
          Share Search
          <v-icon right dark> mdi-share-variant </v-icon>
        </v-btn>
        <v-snackbar
          id="snackbar"
          v-model="snackbarVisible"
          :timeout="snackbarTimeout"
          :color="snackbarColor"
        >
          <div class="sb-message">{{ snackbarMessage }}</div>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-card v-if="featureEnabled" class="mx-auto my-6 mb-6">
      <v-card-title class="pa-7">
        <v-container>
          <v-row
            justify="space-around"
            align="center"
            class="top__row__filters"
          >
            <!-- First column -->
            <v-col cols="2">
              <v-row>
                <v-col cols="10">
                  <v-chip
                    v-if="totalIssues"
                    class="ma-1 pa-4 text-center d-flex flex-grow-1"
                  >
                    <h4>{{ totalIssues }} Issues</h4></v-chip
                  >
                </v-col>
              </v-row>
            </v-col>
            <!-- Second Column -->
            <v-col cols="10">
              <v-row justify="center" align="center">
                <v-autocomplete
                  v-if="selectServer"
                  v-model="selectedCategory"
                  label="Project Category"
                  :items="categoryList"
                  item-value="key"
                  item-text="name"
                  item-id="id"
                  class="top__field"
                  :search-input.sync="searchCategory"
                  prepend-icon="mdi-shape-plus-outline"
                  hide-no-data
                  dense
                  return-object
                />
                <v-spacer />
                <v-autocomplete
                  v-if="selectServer"
                  v-model="selectedProject"
                  :items="projectsList"
                  item-value="key"
                  item-text="name"
                  item-id="id"
                  class="top__field"
                  :search-input.sync="searchProject"
                  prepend-icon="mdi-database-search"
                  hide-no-data
                  dense
                  return-object
                  clearable
                  reqiured
                >
                  <template #label>
                    <span>Project <v-icon color="primary">*</v-icon></span>
                  </template>
                </v-autocomplete>
                <v-col>
                  <v-divider vertical class="bold" role="presentation" />
                </v-col>
                <v-text-field
                  v-model="issueKeySearch"
                  prepend-icon="mdi-identifier"
                  class="top__field"
                  dense
                >
                  <template #label>
                    <span>Issue Key <v-icon color="primary">*</v-icon></span>
                  </template>
                </v-text-field>
              </v-row>
            </v-col>
          </v-row>
          <v-divider />
          <v-row>
            <v-col>
              <v-divider light />
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-col cols="2">
              <v-spacer />
            </v-col>
            <v-col cols="10">
              <!-- Expansion Panel -->
              <v-row justify="center" align="center">
                <v-expansion-panels accordion>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      <strong>{{ `More Filters` }}</strong>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row justify="center" align="center">
                        <v-autocomplete
                          v-model="selectedIssueTypes"
                          :items="issueTypes"
                          prepend-icon="mdi-format-list-bulleted-type"
                          item-value="id"
                          item-text="name"
                          label="Issue Type"
                          return-object
                          class="status__field"
                          dense
                          multiple
                          clearable
                          hide-no-data
                        />
                        <v-spacer />
                        <v-text-field
                          v-model="summarySearch"
                          prepend-icon="mdi-text-short"
                          label="Summary"
                          class="search__field"
                          dense
                        />
                        <v-spacer />
                        <v-autocomplete
                          v-model="selectedAssignee"
                          label="Assignee"
                          :items="assigneesList"
                          item-value="id"
                          item-text="name"
                          item-id="id"
                          class="status__field"
                          prepend-icon="mdi-target-account"
                          hide-no-data
                          dense
                          clearable
                        />
                      </v-row>
                      <v-row justify="center" align="center">
                        <v-autocomplete
                          v-model="selectedStatuses"
                          :items="statuses"
                          prepend-icon="mdi-list-status"
                          item-value="id"
                          item-text="name"
                          label="Status"
                          return-object
                          class="status__field"
                          dense
                          multiple
                          clearable
                          hide-no-data
                        />
                        <v-spacer />
                        <v-autocomplete
                          v-model="selectedFixVersion"
                          label="FixVersion"
                          :items="fixVersionsList"
                          item-value="id"
                          item-text="name"
                          item-id="id"
                          class="status__field"
                          prepend-icon="mdi-tools"
                          hide-no-data
                          dense
                          clearable
                        />
                        <v-spacer />
                        <v-autocomplete
                          v-model="selectedReporter"
                          label="Reporter"
                          :items="reportersList"
                          item-value="id"
                          item-text="name"
                          item-id="id"
                          class="status__field"
                          prepend-icon="mdi-account-plus"
                          hide-no-data
                          dense
                          clearable
                        />
                      </v-row>
                      <v-row justify="center" align="center">
                        <v-col cols="4"></v-col>
                        <v-col cols="4">
                          <v-text-field
                            v-model="sprintSearch"
                            prepend-icon="mdi-sigma"
                            label="Sprint"
                            class="sprint__field"
                            dense
                          />
                        </v-col>
                        <v-col cols="4"></v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>
      <v-flex
        v-if="
          totalIssues > 0 || (selectedProject !== null && selectedProject.key)
        "
      >
        <v-data-table
          v-if="totalIssues > 0"
          :headers="headers"
          fixed-header
          :items="issues"
          :page="page"
          :page-count="numberOfPages"
          :items-per-page="itemsPerPage"
          :options.sync="options"
          :server-items-length="totalIssues"
          :footer-props="{
            'items-per-page-options': [15, 30, 50],
            showFirstLastPage: true,
          }"
          :loading="loading"
          disable-sort
          dense
          height="100vh"
        >
          <!-- eslint-disable-next-line -->
          <template v-slot:item.key="{ item }">
            <div class="p-2">
              <IssueDetails
                :key="issueDetailsKey"
                :issue="item"
                :project="selectedProject"
                @shareIssue="handleJiraIssueDetailsShare"
                >{{ item.key }}
              </IssueDetails>
            </div>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.typeAvatar="{ item }">
            <div class="p-2">
              <v-img
                v-if="item.fields.issuetype"
                :src="item.fields.issuetype.iconUrl"
                :alt="item.key"
                width="20px"
              />
            </div>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.status="{ item }">
            <div class="p-2">
              <v-chip
                class="status__color"
                :color="calculateIssueStatusColor(item)"
                label
              >
                <strong class="issue__status__text">{{
                  item.fields.status.name.toUpperCase()
                }}</strong>
              </v-chip>
            </div>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.reporterAvatar="{ item }">
            <div class="p-2">
              <v-img
                v-if="item.fields.reporter"
                :src="item.fields.reporter.avatarUrls['24x24']"
                :alt="item.key"
                width="20px"
              />
            </div>
          </template>
          <!-- eslint-disable-next-line -->
         <template v-slot:item.summary="{ item }">
            <div class="p-2">
              {{ shortenDescription(item.fields.summary) }}
            </div>
          </template>
          <!-- eslint-disable-next-line -->
         <template v-slot:item.assigneeAvatar="{ item }">
            <v-img
              v-if="item.fields.assignee"
              :src="item.fields.assignee.avatarUrls['24x24']"
              class="rounded-circle"
              width="20px"
            />
          </template>
          <!-- eslint-disable-next-line -->
         <template v-slot:item.sprints="{ item }">
            <div
              v-if="
                item.fields.customfield_10020 &&
                item.fields.customfield_10020.length > 0
              "
            >
              <div>
                <template
                  v-for="(sprint, index) in item.fields.customfield_10020"
                >
                  <label :key="sprint.id + index">
                    {{
                      `${sprint.name.trim()}${
                        index < item.fields.customfield_10020.length - 1
                          ? ','
                          : ''
                      }`
                    }}
                  </label>
                </template>
              </div>
            </div>
          </template>
          <!-- eslint-disable-next-line -->
         <template v-slot:item.fixVersions="{ item }">
            <div
              v-if="
                item.fields.fixVersions && item.fields.fixVersions.length > 0
              "
            >
              <div>
                <template
                  v-for="(fixVersion, index) in item.fields.fixVersions"
                >
                  <label :key="fixVersion.id + index">
                    {{
                      `${fixVersion.name.trim()}${
                        index < item.fields.fixVersions.length - 1 ? ',' : ''
                      }`
                    }}
                  </label>
                </template>
              </div>
            </div>
          </template>
        </v-data-table>
        <v-row v-else justify="center" align="center">
          <v-col cols="12" md="12">
            <v-row justify="center">
              <v-col cols="12" md="6">
                <v-chip class="pa-8 ma-10" color="primary" outlined>
                  {{ noIssueMessage }}
                </v-chip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-flex>
      <v-container v-else>
        <v-row justify="center" align="center">
          <v-col cols="12" md="12">
            <v-row justify="center">
              <v-col cols="12" md="6">
                <v-chip class="pa-8 ma-10" color="primary" outlined>
                  {{ selectProjectMessage }}
                </v-chip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card v-else>
      <div class="coming-soon">
        <h4 class="coming-soon-title">Coming Soon ...</h4>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'nuxt-property-decorator';
import { DataOptions, DataTableHeader } from 'vuetify/types';
import { Project } from '~/pages/tei/data/models/project.model';
import { FixVersion, Issue } from '~/pages/tei/data/models/issue.model';
import { IssueType } from '~/pages/tei/data/models/issueType.model';
import { Status } from '~/pages/tei/data/models/status.model';
import { Category } from '~/pages/tei/data/models/category.model';
import IssueDetails from '~/pages/tei/pds/issueDetails.vue';

const NO_ISSUE_MESSAGE = `No issue Found! Try a different issue key or review search criteria!`;
const ISSUE_FETCH_ERROR = `No issue Found! Try a different issue key or review search criteria!`;
const SELECT_PROJECT_MESSAGE = `Please select a project or specify an Issue Key to list the issues.`;
const SHARE_URL_COPIED_MESSAGE = `Jira Issue Search URL copied to clipboard.`;
const SHARE_URL_COPY_FAILED_MESSAGE = `Failed to copy Search URL to clipboard!`;
const VERSION = '1.2.1';
enum COLOR {
  'blue-gray' = 'gray',
  'yellow' = '#6699CC',
}
@Component({
  layout: 'tei',
  components: {
    IssueDetails,
  },
})
export default class Issues extends Vue {
  title = 'Jira Issues Search Dashboard';
  servers = ['System JIRA', 'MCE JIRA'];
  selectServer = 'System JIRA';
  loading = true;
  issueDetailsKey = 0;
  totalProjects = 0;
  searchProject = '';
  searchCategory = '';
  issueKeySearch = '';
  summarySearch = '';
  sprintSearch = '';
  noIssueMessage = NO_ISSUE_MESSAGE;
  selectProjectMessage = SELECT_PROJECT_MESSAGE;
  copyMessage = SHARE_URL_COPIED_MESSAGE;
  copyFailedMessage = SHARE_URL_COPY_FAILED_MESSAGE;
  page = 1;
  numberOfPages = 0;
  itemsPerPage = 15;
  assigneesList = [];
  reportersList = [];
  fixVersionsList: Array<FixVersion> = [];
  projectsList: Array<Project> = [];
  issues: Array<Issue> = [];
  issueTypes: Array<IssueType> = [];
  statuses: Array<Status> = [];
  selectedIssueTypes: Array<IssueType> = [];
  selectedStatuses: Array<Status> = [];
  selectedCategory: Category = { id: 0, name: '' };
  selectedAssignee = '';
  selectedReporter = '';
  selectedFixVersion = '';
  categoryList: Array<Category> = [];
  totalCategories = 0;
  snackbarVisible = false;
  snackbarTimeout = 3000;
  snackbarMessage = '';
  snackbarColor = 'success';
  searchUrl = '';
  preload: boolean = false;
  params: Record<string, any>;

  selectedProject: Project = {
    id: 0,
    key: '',
    name: '',
    totalIssueCount: 0,
    categoryId: '',
    categoryName: '',
  };

  totalIssues = 0;
  totalIssueTypes = 0;
  totalStatuses = 0;
  attrs: {
    class: 'mb-6';
    boilerplate: true;
    elevation: 2;
  };

  options: DataOptions = {
    page: 1,
    itemsPerPage: 30,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    groupDesc: [],
    multiSort: false,
    mustSort: false,
  };

  headers: DataTableHeader[] = [
    { text: '', value: 'typeAvatar' },
    { text: 'Type', value: 'fields.issuetype.name' },
    { text: 'Key', align: 'start', value: 'key' },
    { text: 'Status', value: 'status' },
    { text: 'Summary', value: 'summary' },
    { text: '', value: 'reporterAvatar' },
    { text: 'Reporter', value: 'fields.reporter.displayName' },
    { text: '', value: 'assigneeAvatar' },
    { text: 'Assignee', value: 'fields.assignee.displayName' },
    { text: 'Fix Versions', value: 'fixVersions' },
    { text: 'Sprints', value: 'sprints' },
  ];

  @Provide()
  calculateIssueStatusColor(issue: Issue): string {
    const color: string = issue?.fields.status.statusCategory.colorName;
    const normalizedColor = color.toLowerCase();

    if (COLOR[normalizedColor]) {
      return COLOR[normalizedColor];
    }
    return color;
  }

  @Watch('options', { immediate: true, deep: true })
  async optionsChanged() {
    await this.getIssuesFromApi();
  }

  @Watch('searchProject', { immediate: true, deep: true })
  searchProjectChanged() {
    this.resetPage();
    this.getProjectsFromApi();
  }

  @Watch('searchCategory', { immediate: true, deep: true })
  async searchCategoryChanged() {
    if (this.searchCategory === '' || this.searchCategory === 'All') {
      this.resetAll();
      this.selectedCategory = { id: 0, name: '' };
    } else if (this.selectedProject?.key !== '') {
      this.projectsList.length = 0;
      this.searchProject = '';
      await this.getProjectsFromApi();
      const project = this.projectsList.find(
        (p) => p.key === this.selectedProject.key,
      );
      if (project?.key) {
        this.searchProject = project.name;
      } else {
        this.resetAll();
      }
    } else {
      this.resetAll();
    }
    await this.getProjectsFromApi();
  }

  @Watch('issueKeySearch', { immediate: true, deep: true })
  async issueKeySearchChanged() {
    this.totalIssues = 0;
    this.resetPage();
    await this.getIssuesFromApi();
  }

  @Watch('summarySearch', { immediate: true, deep: true })
  async searchSummaryChanged() {
    this.resetPage();
    await this.getIssuesFromApi();
  }

  @Watch('sprintSearch', { immediate: true, deep: true })
  async sprintSearchChanged() {
    this.resetPage();
    await this.getIssuesFromApi();
  }

  @Watch('selectedIssueTypes', { immediate: true, deep: true })
  async selectedIssueTypesChanged() {
    this.resetPage();
    await this.getIssuesFromApi();
  }

  @Watch('selectedStatuses', { immediate: true, deep: true })
  async selectedStatusesChanged() {
    this.resetPage();
    await this.getIssuesFromApi();
  }

  @Watch('selectedReporter', { immediate: true, deep: true })
  async selectedReporterChanged() {
    this.resetPage();
    await this.getIssuesFromApi();
  }

  @Watch('selectedAssignee', { immediate: true, deep: true })
  async selectedAssigneeChanged() {
    this.resetPage();
    await this.getIssuesFromApi();
  }

  @Watch('selectedFixVersion', { immediate: true, deep: true })
  async selectedFixVersionChanged() {
    this.resetPage();
    await this.getIssuesFromApi();
  }

  @Watch('selectedProject', { immediate: true, deep: true })
  async selectedProjectChanged() {
    if (this.selectedProject !== null && this.selectedProject?.key !== '') {
      this.resetPage();
      this.selectedIssueTypes.length = 0;
      this.selectedStatuses.length = 0;
      await this.getIssueTypesWithStatusFromApi();
      await this.getIssuesFromApi();
      await this.getUsersFromApi();
      await this.getProjectVersionsFromApi();
    }
    if (this.selectedProject === null) {
      this.totalIssues = 0;
      this.resetAll();
    }
  }

  get featureEnabled() {
    return this.$config?.features?.centralJiraIssueEnabled === 'enable';
  }

  get jiraIssuevVersion() {
    return VERSION; // to be refined
  }

  head() {
    const version = this.jiraIssuevVersion;
    return {
      title: 'Jira Issues',
      meta: [
        {
          hid: 'version',
          name: 'version',
          content: version,
        },
      ],
    };
  }

  async mounted() {
    this.searchUrl = '';
    this.getCategoriesFromApi();
    if (Object.keys(this.$route.query).length > 0) {
      await this.preloadFilters();
    } else {
      await this.getProjectsFromApi();
      this.resetAll();
    }
  }

  private reloadIssueDetails() {
    // Increment the componentKey to trigger a reload
    this.issueDetailsKey += 1;
  }

  private async preloadFilters() {
    const { categoryId, jqlSearch } = this.$route.query;
    const params = (jqlSearch as string).split(' AND ');

    let categoryKey = categoryId || '';
    let projectKey = '';
    let issueKey = '';
    let reporterKey = '';
    let assigneeKey = '';
    let summaryText = '';
    let sprintText = '';
    let fixVersionText = '';
    const issuetypesArr: Array<string> = [];
    const statusesArr: Array<string> = [];

    // Extract filter values from params
    params.forEach((param) => {
      if (param.toLowerCase().includes('project')) {
        const [_p, projectValue] = param.split('=');
        projectKey = projectValue
          .slice(2, projectValue.length - 1)
          .replace(/"/g, "'");
      }
      if (param.toLowerCase().includes('key')) {
        const [_i, issueKeyId] = param.split('=');
        issueKey = issueKeyId.trim();
      }
      if (param.toLowerCase().includes('issuetype')) {
        const [_i, issueTypes] = param.split('IN');
        this.correctValues(issueTypes, issuetypesArr);
      }
      if (param.toLowerCase().includes('status')) {
        const [_s, statuses] = param.split('IN');
        this.correctValues(statuses, statusesArr);
      }
      if (param.toLowerCase().includes('reporter')) {
        const [_r, reporter] = param.split('IN');
        reporterKey = reporter.replace(/[()]/g, '').trim();
      }
      if (param.toLowerCase().includes('assignee')) {
        const [_r, assignee] = param.split('IN');
        assigneeKey = assignee.replace(/[()]/g, '').trim();
      }
      if (param.toLowerCase().includes('summary')) {
        const [_s, summary] = param.split('~');
        summaryText = summary.replace(/"/g, '').trim();
      }
      if (param.toLowerCase().includes('sprint')) {
        const [_s, sprint] = param.split('IN');
        sprintText = sprint.replace(/[()]/g, '').replace(/"/g, '').trim();
      }
      if (param.toLowerCase().includes('fixversion')) {
        const [_s, fixVersion] = param.split('IN');
        fixVersionText = fixVersion
          .replace(/\(|\)/g, '')
          .replace(/"/g, '')
          .trim();
      }
    });

    // Assign filters on the UI
    try {
      this.preload = true;
      if (projectKey !== '') {
        if (categoryKey !== '') {
          await this.getCategoriesFromApi();
          const categoryObj = this.categoryList.find(
            (cat) => (cat.id as unknown as string) === (categoryKey as string),
          );
          if (categoryObj !== undefined) {
            this.searchCategory = categoryObj.name;
            this.selectedCategory = categoryObj;
          }
        }
        await this.applyProjectFilters(
          projectKey,
          summaryText,
          sprintText,
          issueKey,
        );
        await this.applyIssueTypeAndStatusFilters(issuetypesArr, statusesArr);
        await this.applyReporterAndAssigneeFilters(reporterKey, assigneeKey);
        await this.applyFixVersionFilter(fixVersionText);
      }
    } finally {
      this.preload = false;
      await this.getIssuesFromApi();
    }
  }

  private async applyProjectFilters(
    projectKey: string,
    summaryText: string,
    sprintText: string,
    issueKey: string,
  ) {
    this.searchProject = projectKey;
    await this.getProjectsFromApi();

    const projObj = this.projectsList.find((proj) => proj.key === projectKey);
    if (projObj !== undefined) {
      this.selectedProject = projObj;
    }
    if (issueKey !== '') {
      this.issueKeySearch = issueKey as string;
    }
    if (summaryText !== '') {
      this.summarySearch = summaryText;
    }
    if (sprintText !== '') {
      this.sprintSearch = sprintText;
    }
  }

  private async applyFixVersionFilter(fixVersionText: string) {
    if (fixVersionText !== '') {
      await this.getProjectVersionsFromApi();
      const fixVersionObj = this.fixVersionsList.find(
        (fixVersion) => fixVersion.id === fixVersionText,
      );
      if (fixVersionObj !== undefined) {
        this.selectedFixVersion = (fixVersionObj as any).id as string;
      }
    }
  }

  private async applyIssueTypeAndStatusFilters(
    issuetypesArr: string[],
    statusesArr: string[],
  ) {
    if (issuetypesArr.length > 0 || statusesArr.length > 0) {
      await this.getIssueTypesWithStatusFromApi();
      issuetypesArr.forEach((issueTypeName) => {
        const issueTypeObj = this.issueTypes.find(
          (issueType) => issueType.name === issueTypeName,
        );
        if (issueTypeObj !== undefined) {
          this.selectedIssueTypes.push(issueTypeObj);
        }
      });
      statusesArr.forEach((statusName) => {
        const statusObj = this.statuses.find(
          (status) => status.name === statusName,
        );
        if (statusObj !== undefined) {
          this.selectedStatuses.push(statusObj);
        }
      });
    }
  }

  private async applyReporterAndAssigneeFilters(
    reporterKey: string,
    assigneeKey: string,
  ) {
    if (reporterKey !== '' || assigneeKey !== '') {
      await this.getUsersFromApi();
      const reporterObj = this.reportersList.find(
        (reporter) => (reporter as any).id === reporterKey,
      );
      if (reporterObj !== undefined) {
        this.selectedReporter = (reporterObj as any).id;
      }
      const assigneeObj = this.assigneesList.find(
        (assignee) => (assignee as any).id === assigneeKey,
      );
      if (assigneeObj !== undefined) {
        this.selectedAssignee = (assigneeObj as any).id;
      }
    }
  }

  private correctValues(values: string, targetArr: string[]) {
    const filterValues = values.split(',');
    for (const filterValue of filterValues) {
      const start = filterValue.indexOf('"');
      const end = filterValue.lastIndexOf('"');
      const filter = filterValue.substring(start + 1, end);
      targetArr.push(filter);
    }
  }

  private buildShareUrl(issueDetailsKey: string = '') {
    // check if issue key already exists
    const issueKeyPresent = this.params.jqlSearch.includes('key');
    if (issueDetailsKey !== '' && !issueKeyPresent) {
      this.params.jqlSearch += ` AND key = ${issueDetailsKey}`;
    }
    const urlObj = new URL(window.location.href);
    // Build the base URL
    const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    // Build share URL
    const shareParams = { ...this.params };
    shareParams.categoryId = this.selectedCategory.id;
    this.searchUrl = `${baseUrl}?${new URLSearchParams(
      shareParams,
    ).toString()}`;
    window.history.pushState({ url: baseUrl }, '', baseUrl);
  }

  copyToClipboard() {
    navigator.clipboard
      .writeText(this.searchUrl)
      .then(() => {
        this.snackbarMessage = this.copyMessage;
        this.snackbarColor = 'primary';
        this.snackbarVisible = true;
      })
      .catch((_err) => {
        this.snackbarMessage = this.copyFailedMessage;
        this.snackbarColor = 'error';
        this.snackbarVisible = true;
      });
  }

  handleJiraIssueDetailsShare(event: { value: string }) {
    this.buildShareUrl(event.value);
    this.copyToClipboard();
  }

  private resetPage() {
    this.options.page = 1;
  }

  private async getProjectsFromApi() {
    this.loading = true;
    const search = this.searchProject ?? ''.trim().toLowerCase();
    const categoryId = this.selectedCategory.id;
    const itemsPerPage = 30;
    const startAt = 0;
    try {
      const { data } = await this.$axios.get(
        `${(process.env.iadc as any).baseURLDocsApi}/projects`,
        {
          params: {
            server: this.selectServer,
            search,
            startAt,
            maxResults: itemsPerPage,
            categoryId,
            reader: true,
          },
        },
      );
      this.projectsList = this.projectsList.concat(data.projects);
      this.projectsList.sort((a, b) => a.name.localeCompare(b.name));
      this.totalProjects = data.meta.totalSize;
    } catch (err: any) {
      this.$nuxt.error({
        statusCode: 500,
        message: err.message,
      });
    } finally {
      this.loading = false;
    }
  }

  private async getCategoriesFromApi() {
    try {
      const { data } = await this.$axios.get(
        `${(process.env.iadc as any).baseURLDocsApi}/projects/categories`,
        {
          params: {
            server: this.selectServer,
          },
        },
      );
      this.categoryList = data.categories;
      const anyCategory: Category = { id: 0, name: 'All' };
      this.categoryList.push(anyCategory);
      this.totalCategories = data.meta.totalSize;
    } catch (err: any) {
      this.$nuxt.error({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  private async getIssuesFromApi() {
    if (
      !this.preload &&
      (this.selectedProject?.key !== '' || this.issueKeySearch !== '')
    ) {
      let params: Record<string, any> = {};
      const page = this.options.page ?? this.page;
      const itemsPerPage = this.options.itemsPerPage ?? this.itemsPerPage;
      const startAt = (page - 1) * itemsPerPage;
      const jqlSearch = this.generateJQL(); // project = "ARM" AND summary ~ "check" AND status IN ("Done") AND issuetype IN ("Story")
      params = {
        server: this.selectServer,
        startAt,
        maxResults: itemsPerPage,
        jqlSearch,
        fields: '*all', // 'key, issuetype, summary, reporter, assignee, status',
        reader: true,
      };
      const apiUrl = `${
        (process.env.iadc as any).baseURLDocsApi
      }/projects/issues`;

      try {
        this.loading = true;
        const { data } = await this.$axios.get(apiUrl, { params });
        this.issues = data.issues;
        this.totalIssues = data.meta.totalSize;
        this.noIssueMessage = NO_ISSUE_MESSAGE;
        this.numberOfPages = Math.ceil(this.totalIssues / itemsPerPage);
        // If no project is selected but issue key search is done then populate the appr. project filter
        if (this.selectedProject?.key === '' || this.issueKeySearch !== '') {
          await this.applyProjectFilters(
            this.issues[0].fields.project.key,
            '',
            '',
            this.issueKeySearch,
          );
          this.reloadIssueDetails();
        }
      } catch (error: any) {
        this.totalIssues = 0;
        this.noIssueMessage = ISSUE_FETCH_ERROR;
      } finally {
        this.loading = false;
        this.params = params;
        this.buildShareUrl();
      }
    }
  }

  private async getUsersFromApi() {
    this.selectedAssignee = '';
    this.selectedReporter = '';
    this.reportersList = [];
    this.assigneesList = [];
    if (this.selectedProject?.key !== '') {
      const assigneeQuery = `is assignee of ${this.selectedProject.key}`;
      const reporterQuery = `is reporter of ${this.selectedProject.key}`;
      try {
        const assigneeData = await this.$axios.get(
          `${(process.env.iadc as any).baseURLDocsApi}/projects/users`,
          {
            params: {
              query: assigneeQuery,
            },
          },
        );
        const reporterData = await this.$axios.get(
          `${(process.env.iadc as any).baseURLDocsApi}/projects/users`,
          {
            params: {
              query: reporterQuery,
            },
          },
        );
        this.assigneesList = (assigneeData as any).data.users;
        this.reportersList = (reporterData as any).data.users;
      } catch (err: any) {
        this.$nuxt.error({
          statusCode: 500,
          message: err.message,
        });
      } finally {
        this.loading = false;
      }
    }
  }

  private async getProjectVersionsFromApi() {
    this.fixVersionsList = [];
    this.selectedFixVersion = '';
    if (this.selectedProject?.key !== '') {
      try {
        const { data } = await this.$axios.get(
          `${(process.env.iadc as any).baseURLDocsApi}/projects/versions`,
          {
            params: {
              projectIdOrKey: this.selectedProject.key,
            },
          },
        );
        const unreleased: any[] = [{ header: 'Unreleased' }];
        const released: any[] = [{ header: 'Released' }];
        for (const item of data.fixVersions) {
          // As we need Unreleased versions first, so negative checking is done
          if (!item.released) {
            unreleased.push(item);
          } else {
            released.push(item);
          }
        }
        unreleased.push({ divider: true });
        this.fixVersionsList.push(...unreleased);
        this.fixVersionsList.push(...released);
      } catch (err: any) {
        this.$nuxt.error({
          statusCode: 500,
          message: err.message,
        });
      } finally {
        this.loading = false;
      }
    }
  }

  private async getIssueTypesWithStatusFromApi() {
    if (this.selectedProject?.key !== '') {
      this.issueTypes.length = 0;
      this.statuses.length = 0;
      this.totalIssueTypes = 0;
      this.totalStatuses = 0;
      try {
        const { data } = await this.$axios.get(
          `${(process.env.iadc as any).baseURLDocsApi}/projects/statuses`,
          {
            params: {
              server: this.selectServer,
              projectIdOrKey: this.selectedProject.key,
            },
          },
        );
        this.issueTypes = data.issueTypeWithStatuses;
        this.issueTypes.sort((a, b) => a.name.localeCompare(b.name));
        this.statuses = this.findUniqueStatusTypes(this.issueTypes);
        this.statuses.sort((a, b) => a.name.localeCompare(b.name));
        this.totalIssueTypes = data.meta.totalSize;
        this.totalStatuses = this.statuses.length;
      } catch (err: any) {
        this.$nuxt.error({
          statusCode: 500,
          message: err.message,
        });
      }
    }
  }

  shortenDescription(str: string): string {
    const maxLen = 250;
    if (str) {
      if (str.length <= maxLen) {
        return str;
      }
      return str.substring(0, str.lastIndexOf(' ', maxLen)) + '...';
    } else {
      return 'N/A';
    }
  }

  private findUniqueStatusTypes(issueTypes: IssueType[]): Status[] {
    const statusList: Status[] = [];

    for (const issueType of issueTypes) {
      for (const status of issueType.statuses) {
        if (!statusList.some((s) => s.id === status.id)) {
          statusList.push(status);
        }
      }
    }

    return statusList;
  }

  private generateJQL() {
    let jql = '';
    if (this.selectedProject?.key !== '') {
      jql = `project = "${this.selectedProject.key}"`;

      if (this.selectedIssueTypes?.length > 0) {
        const issueTypesString = this.selectedIssueTypes
          .map((issuetype) => `"${issuetype.name}"`)
          .join(',');
        jql += ` AND issuetype IN (${issueTypesString})`;
      }

      if (this.selectedStatuses?.length > 0) {
        const statusesString = this.selectedStatuses
          .map((status) => `"${status.name}"`)
          .join(',');
        jql += ` AND status IN (${statusesString})`;
      }

      if (this.selectedAssignee?.length > 0) {
        jql += ` AND assignee IN (${this.selectedAssignee})`;
      }

      if (this.selectedReporter?.length > 0) {
        jql += ` AND reporter IN (${this.selectedReporter})`;
      }

      if (this.selectedFixVersion?.length > 0) {
        jql += ` AND fixVersion IN (${this.selectedFixVersion})`;
      }

      if (this.issueKeySearch !== '') {
        let issueKey = this.sanitizeInput(this.issueKeySearch);
        jql += ` AND key = ${issueKey}`;
      }

      if (this.summarySearch !== '') {
        let summary = this.sanitizeInput(this.summarySearch);
        if (summary !== '') {
          jql += ` AND summary ~ "${summary}"`;
        }
      }

      if (this.sprintSearch !== '') {
        let sprint = this.sanitizeInput(this.sprintSearch);
        if (sprint !== '') {
          jql += ` AND Sprint IN ("${sprint}")`;
        }
      }
    } else if (this.issueKeySearch !== '') {
      let issueKey = this.sanitizeInput(this.issueKeySearch);
      jql += `key = ${issueKey}`;
    }
    return jql;
  }

  private resetAll() {
    this.selectedProject = {
      id: 0,
      key: '',
      name: '',
      totalIssueCount: 0,
      categoryId: '',
      categoryName: '',
    };
    this.selectedIssueTypes.length = 0;
    this.selectedStatuses.length = 0;
    this.issueKeySearch = '';
    this.summarySearch = '';
    this.sprintSearch = '';
    this.projectsList.length = 0;
    this.totalIssues = 0;
    this.issueTypes = [];
    this.statuses = [];
    this.totalIssueTypes = 0;
    this.totalStatuses = 0;
    this.selectedAssignee = '';
    this.selectedReporter = '';
    this.reportersList = [];
    this.assigneesList = [];
    this.fixVersionsList = [];
    this.selectedFixVersion = '';
  }

  private sanitizeInput(input: string): string {
    // List of SQL keywords to check for
    const sqlKeywords = [
      'SELECT',
      'INSERT',
      'UPDATE',
      'DELETE',
      'DROP',
      'CREATE',
      'ALTER',
      'EXECUTE',
      'TRUNCATE',
      'UNION',
      'JOIN',
      'WHERE',
      'FROM',
      'INTO',
      'VALUES',
      'TABLE',
      // Add more SQL keywords as needed
    ];

    // Remove characters that may be used in SQL injection
    let sanitizedInput = input.replace(/[;'"`\\]/g, '');
    sanitizedInput = sanitizedInput.replace(/[^a-zA-Z0-9\s-]/g, '');

    // Check if the input contains any SQL keywords
    const containsSqlKeyword = sqlKeywords.some((keyword) =>
      sanitizedInput.toUpperCase().includes(keyword),
    );

    if (containsSqlKeyword) {
      // Input contains SQL keywords, return sanitized input or handle accordingly
      return ''; // or throw an error, log a warning, or take appropriate action
    }

    // Input is safe, return sanitized input
    return sanitizedInput;
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 15px 0px 0px 5px !important;
}
.search__field {
  width: 15%;
}

.status__field {
  width: 15%;
}

.sprint__field {
  width: 86%;
  margin: -3% 3% -5% 7%;
}

.top__fields {
  width: 25%;
}

.top__row__filters {
  margin: -3% 0% 0% 0%;
}

.status__color {
  height: 28px;
}

.issue__status__text {
  font-size: 12.5px;
}

.status__field ::v-deep .v-select__selections {
  max-height: 30px !important;
  overflow-y: auto !important;
}

.coming-soon {
  text-align: center;
  margin-top: 50px;
}

.coming-soon-title {
  color: #333;
  animation: pulse 2s ease-in-out infinite;
}

#snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}
#snackbar .sb-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.bold.theme--light.v-divider::v-deep {
  border-color: rgba(0, 0, 0, 0.12);
  border-width: 0 3px 0 0 !important;
  padding: 20% 30% 55% 25% !important;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
