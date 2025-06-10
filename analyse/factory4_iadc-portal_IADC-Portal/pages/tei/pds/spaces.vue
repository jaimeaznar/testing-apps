<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { DataTableHeader } from 'vuetify/types';
import { Space } from '~/pages/tei/data/models/space.model';

@Component({ layout: 'tei' })
export default class Spaces extends Vue {
  // --------------- //
  // Data            //
  // --------------- //
  loading = true;
  limit = 25;
  totalSpaces = 0;
  totalSpacesNextLink = '';
  totalSpacesLastScrollTop = 0;
  search = '';
  spaces: Array<Space> = [];
  headers: DataTableHeader[] = [
    { text: '', value: 'icon', sortable: false },
    { text: 'Key', align: 'start', value: 'key' },
    { text: 'Space', value: 'name' },
    { text: 'Description', value: 'description', sortable: false },
    { text: 'Owners', value: 'leads' },
    { text: 'Labels', value: 'labels' },
  ];

  // --------------- //
  // Lifecycle hooks //
  // --------------- //
  async mounted() {
    await this.getTotalSpaces();
    await this.getSpaces();
    window.addEventListener('scroll', this.onLoadMore);
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.onLoadMore);
  }

  // --------------- //
  // Methods         //
  // --------------- //

  private changeTotalSpacesNextLink(value: string) {
    this.totalSpacesNextLink = value;
  }

  private async onLoadMore() {
    if (
      typeof this.totalSpacesNextLink === 'string' &&
      !this.loading &&
      window.scrollY > this.totalSpacesLastScrollTop
    ) {
      await this.getSpaces();
    }
    this.totalSpacesLastScrollTop = window.scrollY;
  }

  // Get the total number of Spaces in Confluence
  // This is a pre-requisite to build the axios promises
  // to retrieve all fields from all spaces in multiple gets
  private async getTotalSpaces() {
    try {
      const { data } = await this.$axios.get(
        `${(process.env.iadc as any).baseURLDocsApi}/spaces/global/meta`,
      );
      this.totalSpaces = data.meta.total;
    } catch (err: any) {
      this.$nuxt.error({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  private async getSpaces() {
    this.loading = true;
    try {
      const { spaces, meta } = await this.getSpacesFromApi(
        this.limit,
        this.totalSpacesNextLink,
      );
      const mappedSpacesStructure = spaces.map((space) => ({
        key: space.key,
        name: space.name,
        description: space.description,
        icon: space.icon,
        leads: space.permissions
          .map((permission): string =>
            permission.operation.key === 'administer' &&
            permission.operation.targetType === 'space'
              ? ' ' + permission.name
              : '',
          )
          // filter null, undefined or blank
          .filter((name) => name),
        labels: space.labels.map((label): string => ' ' + label),
      }));
      this.spaces.push(...mappedSpacesStructure);
      this.changeTotalSpacesNextLink(meta.next);
    } catch (err: any) {
      this.$nuxt.error({
        statusCode: 500,
        message: err.message,
      });
    } finally {
      this.loading = false;
    }
  }

  // Call konviw API to retrieve ranges of Spaces
  private async getSpacesFromApi(limit: number, next: string) {
    try {
      const { data } = await this.$axios.get(
        `${(process.env.iadc as any).baseURLDocsApi}/spaces/global`,
        {
          params: {
            next,
            limit,
          },
        },
      );
      return data;
    } catch (err: any) {
      this.$nuxt.error({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  public shortenDescription(str: string): string {
    const maxLen = 200;
    if (str.length <= maxLen) {
      return str;
    }
    return str.substr(0, str.lastIndexOf(' ', maxLen)) + '...';
  }

  // --------------- //
  // Head method     //
  // --------------- //
  head() {
    return { title: 'Confluence Spaces' };
  }
}
</script>

<template>
  <v-container>
    <h2 class="text-center">Central Confluence Global Spaces</h2>
    <v-card class="mx-auto my-4 mb-6">
      <v-card-title>
        {{ totalSpaces }} Spaces
        <v-spacer />
        <v-tooltip bottom color="default">
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" class="pr-1 pb-1" v-on="on">
              <v-icon color="default">mdi-chat-question-outline</v-icon>
            </v-btn>
          </template>
          <span>
            The search works based on the retrieved records. By scrolling down,
            the list completes automatically
          </span>
        </v-tooltip>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          class="search__field"
        />
      </v-card-title>

      <v-flex>
        <v-data-table
          :headers="headers"
          :items="spaces"
          :items-per-page="totalSpaces"
          hide-default-footer
          :loading="loading"
          :search="search"
        >
          <!-- eslint-disable-next-line -->
          <template v-slot:item.icon="{ item }">
            <div class="p-2">
              <v-img :src="item.icon" :alt="item.name" width="24px" />
            </div>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.description="{ item }">
            <div class="p-2">
              {{ shortenDescription(item.description) }}
            </div>
          </template>
        </v-data-table>
      </v-flex>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.search__field {
  width: 20%;
}
</style>
