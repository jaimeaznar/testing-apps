<template>
  <div>
    <form
      v-shortkey="['ctrl', 'k']"
      @shortkey="toggleSearch()"
      @submit.prevent="doSearch"
    >
      <SearchDropDown
        v-if="search"
        ref="searchInput"
        v-model="searchTerms"
        autofocus
        width="500px"
        hide-details
        solo
        rounded
        flat
        dense
        single-line
        placeholder="What're we looking for?"
      />
    </form>

    <v-btn v-if="!search" icon @click="toggleSearch()">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" absolute>
      <v-card>
        <v-card-title>
          <div class="headline">
            {{ searchResults }}
          </div>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import SearchDropDown from '@/components/SearchDropdown.vue';

@Component({
  components: {
    SearchDropDown,
  },
})
export default class SearchBar extends Vue {
  dialog = false;
  searchTerms = '';
  searchResults = [];

  get search() {
    return this.$store.state.search;
  }

  set search(val) {
    this.$store.commit('search', val);
  }

  toggleSearch() {
    this.$store.commit('toggleSearch');
  }

  doSearch() {
    if (this.searchTerms) {
      this.$router.push({
        name: 'searchResults',
        query: { q: this.searchTerms },
      });
    }
  }
}
</script>

<style scoped>
.v-text-field {
  width: 50vw;
  min-width: 180px;
}
</style>
