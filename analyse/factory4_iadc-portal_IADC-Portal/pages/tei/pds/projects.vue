<template>
  <v-container>
    <h2 class="text-center">Jira Projects</h2>
    <v-card class="mx-auto my-4 mb-6">
      <v-card-title>
        {{ totalProjects }} Projects
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Project"
          class="search__field"
        />
        <v-spacer />
        <v-select
          v-model="selectCategory"
          :items="categories"
          item-value="id"
          item-text="name"
          label="Category"
          persistent-hint
          return-object
          class="category__field"
        />
        <v-spacer />
        <v-select
          v-model="selectServer"
          :items="servers"
          label="Server"
          class="server__field"
        />
      </v-card-title>

      <v-flex>
        <v-data-table
          :headers="headers"
          :items="projects"
          :page="page"
          :page-count="numberOfPages"
          :items-per-page="itemsPerPage"
          :options.sync="options"
          :server-items-length="totalProjects"
          :footer-props="{ 'items-per-page-options': [15, 30, 50] }"
          :loading="loading"
          disable-sort
          dense
        >
          <!-- eslint-disable-next-line -->
          <template v-slot:item.avatar24="{ item }">
            <div class="p-2">
              <v-img :src="item.avatar24" :alt="item.name" width="24px" />
            </div>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.description="{ item }">
            <div class="p-2">
              {{ shortenDescription(item.description) }}
            </div>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.leadAvatar24="{ item }">
            <v-img
              :src="item.leadAvatar24"
              class="rounded-circle"
              width="24px"
            />
          </template>
        </v-data-table>
      </v-flex>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import { DataOptions, DataTableHeader } from 'vuetify/types';
import { Category } from '~/pages/tei/data/models/category.model';

@Component({ layout: 'tei' })
export default class Projects extends Vue {
  title = 'Jira Projects';
  servers = ['System JIRA', 'MCE JIRA'];
  selectServer = 'System JIRA';
  loading = true;
  totalProjects = 0;
  search = '';
  page = 1;
  numberOfPages = 0;
  itemsPerPage = 15;
  projects = [];
  categories: Array<Category> = [];
  selectCategory: Category = { id: 0, name: 'All' };
  totalCategories = 0;
  options: DataOptions = {
    page: 1,
    itemsPerPage: 15,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    groupDesc: [],
    multiSort: false,
    mustSort: false,
  };

  headers: DataTableHeader[] = [
    { text: 'Category', value: 'categoryName' },
    { text: '', value: 'avatar24' },
    { text: 'Key', align: 'start', value: 'key' },
    { text: 'Name', value: 'name' },
    { text: 'Description', value: 'description' },
    { text: '', value: 'leadAvatar24' },
    { text: 'Lead', value: 'leadName' },
  ];

  @Watch('options', { immediate: true, deep: true })
  optionsChanged() {
    this.getProjectsFromApi();
  }

  @Watch('search', { immediate: true, deep: true })
  searchChanged() {
    this.getProjectsFromApi();
  }

  @Watch('selectCategory', { immediate: true, deep: true })
  selectCategoryChanged() {
    this.getProjectsFromApi();
  }

  @Watch('selectServer', { immediate: true, deep: true })
  selectServerChanged() {
    this.getCategoriesFromApi();
    this.getProjectsFromApi();
  }

  mounted() {
    this.getCategoriesFromApi();
    this.getProjectsFromApi();
  }

  private async getProjectsFromApi() {
    this.loading = true;
    const page = this.options.page ?? this.page;
    const itemsPerPage = this.options.itemsPerPage ?? this.itemsPerPage;
    const search = this.search ?? ''.trim().toLowerCase();
    const categoryId = this.selectCategory.id;

    const startAt = (page - 1) * itemsPerPage;
    try {
      const { data } = await this.$axios.get(
        `${(process.env.iadc as any).baseURLDocsApi}/projects`,
        {
          params: {
            server: this.selectServer,
            startAt,
            maxResults: itemsPerPage,
            search,
            categoryId,
          },
        },
      );
      this.projects = data.projects;
      this.totalProjects = data.meta.totalSize;
      this.numberOfPages = this.totalProjects / itemsPerPage;
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
      this.categories = data.categories;
      const anyCategory: Category = { id: 0, name: 'All' };
      this.categories.push(anyCategory);
      this.totalCategories = data.meta.totalSize;
    } catch (err: any) {
      this.$nuxt.error({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  head() {
    return { title: 'Jira Projects' };
  }

  shortenDescription(str: string): string {
    const maxLen = 250;
    if (str.length <= maxLen) {
      return str;
    }
    return str.substr(0, str.lastIndexOf(' ', maxLen)) + '...';
  }
}
</script>

<style lang="scss" scoped>
.search__field {
  width: 20%;
}

.category__field {
  width: 20%;
}

.server__field {
  width: 10%;
}
</style>
