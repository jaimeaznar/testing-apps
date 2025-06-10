<template>
  <div v-show="search" class="dropdown">
    <v-text-field
      v-show="!minimizeDropDown"
      ref="searchInput"
      :value="searchFilter"
      class="dropdown-input"
      :name="dropDownName"
      :placeholder="placeholder"
      autofocus
      hide-details
      solo
      rounded
      flat
      dense
      single-line
      @input="debounceSearch($event)"
    />
    <div v-show="showDropDown && !minimizeDropDown" class="dropdown-content">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" sm="6" class="filteredResults">
            <div v-if="searchInProgress" class="loading-page">
              <p>
                <v-alert color="blue" dense outlined text>
                  Search in progress
                  <v-progress-circular
                    :size="20"
                    color="primary"
                    indeterminate
                  />
                </v-alert>
              </p>
            </div>
            <template v-if="filteredResults && filteredResults.length > 0">
              <div
                v-for="item in filteredResults"
                :key="item.id"
                class="dropdown-item"
                @mousedown="goToPage(item.id, item.name)"
              >
                >
                {{ item.name }}
              </div>
            </template>
            <template v-else-if="!searchInProgress">
              <v-alert color="red" dense outlined text type="error">
                No results found.
              </v-alert>
            </template>
          </v-col>
          <v-col cols="12" md="6" sm="6">
            <v-row class="justify-end">
              <v-btn v-if="search" icon @click="toggleMinimizeDropDown()">
                <v-icon>mdi-window-minimize</v-icon>
              </v-btn>
              <v-btn v-if="search" icon @click="toggleSearch()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-row>
            <v-checkbox
              v-for="(el, index) in spaceKeys"
              :key="index"
              v-model="selectedSpaces[index]"
              :label="spaceTitles[index]"
              :value="spaceKeys[index]"
              hide-details
              @change="spacesChange()"
            /><br />
            <div class="labels">
              <v-combobox
                v-model="labels"
                outlined
                dense
                chips
                small-chips
                label="labels"
                multiple
                @change="labelsChange()"
              />
            </div>
            <div class="pages">
              <v-checkbox
                v-model="page"
                label="pages"
                :value="page"
                hide-details
                @change="pageTypeChange()"
              />
            </div>
            <div class="blog">
              <v-checkbox
                v-model="blog"
                label="blog"
                :value="blog"
                hide-details
                @change="pageTypeChange()"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-btn v-if="minimizeDropDown" icon @click="toggleMinimizeDropDown()">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class SearchDropDown extends Vue {
  maxItem: number;
  showDropDown: boolean;
  minimizeDropDown: boolean;
  searchInProgress: boolean;
  selectedSpaces: string[];
  spaceKeys: string[];
  spaceTitles: string[];
  spaceKey: string;
  filteredResults: { id: number; name: string }[];
  placeholder: string;
  searchFilter: string;
  blog: boolean;
  page: boolean;
  selectedPageType: string;
  labels: string[];
  searchTimeout: any;

  debounceSearch(input) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.searchFilter = input;
      this.searchPages();
    }, 1000);
  }

  get search() {
    return this.$store.state.search;
  }

  set search(val) {
    this.$store.commit('search', val);
  }

  toggleSearch() {
    this.$store.commit('toggleSearch');
  }

  toggleDropDown() {
    this.showDropDown = !this.showDropDown;
  }

  toggleMinimizeDropDown() {
    this.minimizeDropDown = !this.minimizeDropDown;
  }

  get targetUrl(): any {
    return this.$store.state.targetUrl;
  }

  data() {
    return {
      maxItem: 25, // max result for search results
      showDropDown: false,
      minimizeDropDown: false,
      searchInProgress: false,
      searchFilter: '',
      placeholder: 'What are we looking for? ',
      selectedSpaces: [],
      spaceKeys: this.$store.state.spaceKeys,
      spaceTitles: this.$store.state.spaceTitles,
      filteredResults: null,
      dropDownName: 'Search Dropdown',
      // for Page type search
      page: false,
      blog: false,
      selectedPageType: '',
      // for Labels Search
      labels: [],
      // for search debouncing
      searchTimeout: null,
    };
  }

  spacesChange() {
    this.spaceKey = this.selectedSpaces.filter((e) => e !== null).join('|');
    this.searchPages();
  }

  pageTypeChange() {
    if (this.blog && !this.page) {
      this.selectedPageType = 'blogpost';
    } else if (!this.blog && this.page) {
      this.selectedPageType = 'page';
    } else {
      this.selectedPageType = '';
    }
    this.searchPages();
  }

  labelsChange() {
    this.searchPages();
  }

  goToPage(pageId, pageName) {
    const path: string = `/${this.targetUrl}/konviw/${pageId}`;
    const fullPath: string = `${window.location.origin}${path}`;
    this.$pushGTMEventInQueue({
      event: 'search_success',
      user: this.$auth.user,
      additionalParameters: {
        search_term: this.searchFilter,
        name: pageName,
        url: fullPath,
      },
    });
    this.$router.push({
      path,
    });
  }

  trackSearching() {
    if (this.searchFilter) {
      this.$pushGTMEventInQueue({
        event: 'search',
        user: this.$auth.user,
        additionalParameters: {
          search_term: this.searchFilter,
          results: this.filteredResults.length,
        },
      });
    }
  }

  async searchPages() {
    this.showDropDown = true;
    this.searchInProgress = true;
    if (!this.spaceKey) {
      this.spaceKey = this.spaceKeys.join('|');
    }
    const { data } = await this.$axios.get(
      `${(process.env.iadc as any).baseURLDocsApi}/search`,
      {
        params: {
          spaceKey: this.spaceKey,
          query: this.searchFilter,
          maxResults: this.maxItem,
          type: this.selectedPageType,
          labels: this.labels.join(','),
        },
      },
    );
    this.searchInProgress = false;
    this.filteredResults = data.results.map((result) => ({
      id: result.docId,
      name: result.title,
    }));
    this.trackSearching();
  }
}
</script>
<style lang="scss" scoped>
.dropdown {
  display: flex;
  flex-flow: row-reverse wrap;
  margin: auto;
  .dropdown-content {
    margin-top: 40px;
    position: absolute;
    background-color: #fff;
    width: 50vw;
    min-width: 200px;
    height: auto;
    border: 1px solid #e7ecf5;
    border-radius: 20px;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.25);
    overflow-x: auto;
    z-index: 1;
    .dropdown-item {
      color: black;
      font-size: 0.8em;
      line-height: 1em;
      padding: 8px;
      text-decoration: none;
      display: block;
      cursor: pointer;
      &:hover {
        background-color: #e7ecf5;
        .theme--dark & {
          background-color: grey;
        }
      }
      .theme--dark & {
        color: white;
      }
    }
    .dropdown-filter {
      color: black;
      font-size: 0.7em;
      line-height: 1em;
      padding: 8px;
    }

    .theme--dark & {
      background-color: #363636;
    }
  }
  .dropdown:hover .dropdowncontent {
    display: block;
  }
}

.labels {
  padding-top: 10px;
}

.filteredResults {
  overflow-y: scroll;
  scrollbar-width: thin;
  height: 450px;
  border: none;
}

.v-text-field {
  width: 50vw;
  min-width: 180px;
}

@media screen and (max-width: 600px) {
  .filteredResults {
    height: 150px;
  }
  .dropdown {
    .dropdown-content {
      width: 300px;
    }
  }
}
</style>
