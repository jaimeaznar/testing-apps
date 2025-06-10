<script lang="ts">
/* eslint-disable no-console */
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import { DataTableHeader } from 'vuetify/types';
import { Category } from '~/pages/tei/data/models/category.model';

@Component({})
export default class Categories extends Vue {
  // --------------- //
  // Data Properties //
  // --------------- //
  loading = true;
  search = '';
  totalCategories = 0;
  categories: Array<Category> = [];
  functionFilterValue = '';
  functionList: Array<{}> = [];
  unitFilterValue = '';
  unitList: Array<{}> = [];
  categoryFilterValue = '';
  categoryList: Array<{}> = [];

  // ------------------- //
  // Computed Properties //
  // ------------------- //
  get headers(): DataTableHeader[] {
    return [
      {
        text: 'Category',
        value: 'name',
        sortable: true,
        filter: this.handlerFilters,
      },
      {
        text: 'Description',
        value: 'description',
        sortable: true,
      },
    ];
  }

  // --------------- //
  // Watchers        //
  // --------------- //
  @Watch('functionFilterValue', { immediate: true, deep: true })
  functionFilterChanged() {
    this.unitList = [];
    this.unitList.push({ text: 'All', value: '' });
    this.categories.map((category: Category) => {
      const [globalOrg, orgFunction, orgDepartment] =
        category.name.split(' > ');
      const matchFunction = this.checkMatchFunction(category.name);
      if (matchFunction && orgDepartment !== undefined) {
        this.unitList.push(`${globalOrg} > ${orgFunction}`);
      }
      return true;
    });
  }

  // --------------- //
  // Lifecycle hooks //
  // --------------- //
  async mounted() {
    await this.getCategoriesFromApi();
    this.loadOrganization();
  }

  // --------------- //
  // Methods         //
  // --------------- //

  private checkMatchFunction(value: any): boolean {
    // check if value matches the Global Function selected
    return this.functionFilterValue.toLowerCase() === ''
      ? true
      : value
          .toLowerCase()
          .startsWith(`${this.functionFilterValue.toLowerCase()} > `);
  }

  private checkMatchUnit(value: any): boolean {
    // check if value matches the Unit selected
    return value.toLowerCase().includes(this.unitFilterValue.toLowerCase());
  }

  private checkMatchCategory(value: any): boolean {
    // check if value matches the Department selected
    return value.toLowerCase().includes(this.categoryFilterValue.toLowerCase());
  }

  // Handler when user input something at the "Filter" select fields.
  handlerFilters(value) {
    const matchFunction = this.checkMatchFunction(value);
    const matchUnit = this.checkMatchUnit(value);
    const matchDepartment = this.checkMatchCategory(value);

    return matchFunction && matchUnit && matchDepartment;
  }

  // Get the Jira project Categories from the API
  private async getCategoriesFromApi() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `${(process.env.iadc as any).baseURLDocsApi}/projects/categories`,
        { params: { server: 'System Jira' } },
      );
      this.categories = data.categories;
      this.totalCategories = data.meta.totalSize;
    } catch (err: any) {
      this.$nuxt.error({
        statusCode: 500,
        message: err.message,
      });
    } finally {
      this.loading = false;
    }
  }

  // Load all organization fields based on the list of categories retrieved from the API
  private loadOrganization() {
    this.functionList.push({ text: 'All', value: '' });
    this.categoryList.push({ text: 'All', value: '' });
    this.categories.map((category: Category) => {
      // Category names are structure in 3 sections split by ' > '
      // [Global Function] > [Unit] > [Department]
      const [globalOrg, orgFunction, orgDepartment] =
        category.name.split(' > ');
      if (orgFunction !== undefined) {
        this.functionList.push(globalOrg);
      }
      if (orgDepartment !== undefined) {
        this.unitList.push(`${globalOrg} > ${orgFunction}`);
      }
      if (orgDepartment !== undefined) {
        this.categoryList.push(category.name);
      }
      // To display entries in the Department field when the proper naming structure is not used
      if (orgDepartment === undefined && orgFunction === undefined) {
        this.categoryList.push(category.name);
      }
      return true;
    });
  }

  // --------------- //
  // Head method     //
  // --------------- //
  head() {
    return { title: 'Project Jira Categories' };
  }
}
</script>

<template>
  <v-container>
    <h2 class="text-center">Central Jira Global Project Categories</h2>
    <v-card class="mx-auto my-4 mb-6">
      <v-card-title>
        {{ totalCategories }} Categories
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search description"
          class="search__field"
        />

        <v-spacer />
        <v-select
          v-model="functionFilterValue"
          :items="functionList"
          label="Global Functions"
          class="globalFunction__field"
        />
        <v-spacer />
        <v-select
          v-model="unitFilterValue"
          :items="unitList"
          label="Units"
          class="unit__field"
        />
        <v-spacer />
        <v-select
          v-model="categoryFilterValue"
          :items="categoryList"
          label="Categories"
          class="category__field"
        />
      </v-card-title>

      <v-flex>
        <v-data-table
          item-key="id"
          :headers="headers"
          :items="categories"
          :items-per-page="totalCategories"
          :loading="loading"
          :search="search"
          hide-default-footer
        />
      </v-flex>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.search__field {
  width: 20%;
}

.globalFunction__field {
  width: 10%;
}

.unit__field {
  width: 10%;
}

.category__field {
  width: 20%;
}
</style>
