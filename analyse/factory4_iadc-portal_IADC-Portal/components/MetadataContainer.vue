<template>
  <v-bottom-sheet
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="1200"
  >
    <v-card>
      <v-card-title>
        <div>
          <v-icon color="primary"> mdi-information </v-icon>
          Page Information
        </div>
      </v-card-title>
      <v-card-text class="metadata-content">
        <ul>
          <li>
            <span class="metadata-header">Created</span>
            <AuthorProfile
              :name="metadata.konviwCreatedVersion.modificationBy.displayName"
              :email="metadata.konviwCreatedVersion.modificationBy.email"
              :image="
                metadata.konviwCreatedVersion.modificationBy.profilePicture
              "
              :version="metadata.konviwCreatedVersion.versionNumber"
              :when="metadata.konviwCreatedVersion.when"
              :friendly-when="metadata.konviwCreatedVersion.friendlyWhen"
            />
          </li>
          <li>
            <span class="metadata-header">Modified</span>
            <AuthorProfile
              :name="metadata.konviwLastVersion.modificationBy.displayName"
              :email="metadata.konviwLastVersion.modificationBy.email"
              :image="metadata.konviwLastVersion.modificationBy.profilePicture"
              :version="metadata.konviwLastVersion.versionNumber"
              :when="metadata.konviwLastVersion.when"
              :friendly-when="metadata.konviwLastVersion.friendlyWhen"
            />
          </li>
          <li>
            <span class="metadata-header">Version</span>
            {{ metadata.konviwLastVersion.versionNumber }}
          </li>
          <li>
            <span class="metadata-header">Title</span>
            {{ metadata.konviwTitle }}
          </li>
          <li>
            <span class="metadata-header">Excerpt</span>
            {{ excerpt }}
          </li>
          <li>
            <span class="metadata-header">Read time</span>
            {{ metadata.readTime }} min
          </li>
          <li>
            <span class="metadata-header">URL</span>
            <a :href="metadata.konviwFrameUrl">
              {{ metadata.konviwFrameUrl }}
            </a>
          </li>
          <li>
            <span class="metadata-header">Page ID</span>
            {{ metadata.konviwPageId }}
          </li>
          <li>
            <span class="metadata-header">Space Key</span>
            {{ metadata.konviwSpaceKey }}
          </li>
          <li v-if="metadata.labels">
            <span class="metadata-header">Labels</span>
            <span
              v-for="label in metadata.labels"
              :key="label"
              :class="$vuetify.theme.dark ? 'primary' : 'primary lighten-5'"
              class="label"
            >
              {{ label }}
            </span>
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import AuthorProfile from '@/components/AuthorProfile.vue';

@Component({
  layout: 'default',
  components: {
    AuthorProfile,
  },
})
export default class MetadataContainer extends Vue {
  get dialog() {
    return this.$store.state.metadata;
  }

  set dialog(val) {
    this.$store.commit('toggleMetadata', val);
  }

  get metadata() {
    return this.$store.state.iframeData;
  }

  get excerpt() {
    const { konviwExcerpt: excerpt } = this.metadata;
    const limit = 500;
    return excerpt.length > limit
      ? excerpt.substring(0, limit) + '...'
      : excerpt;
  }
}
</script>

<style lang="scss" scoped>
.metadata-content {
  padding-left: 10px;
  font-size: 1em;
  li {
    margin: 0 0 10px 20px;
    list-style: none;
  }
  .metadata-header {
    display: inline-block;
    width: 100px;
    font-weight: 600;
    &::after {
      content: ' : ';
    }
  }
  .label {
    font-size: 0.8rem;
    background-color: var(--v-primary-lighten1);
    border-radius: 5px;
    padding: 0 5px;
    line-height: 1.5rem;
    margin: 5px 5px 5px 0;
    display: inline-block;
  }
}
.v-card__title i {
  vertical-align: text-bottom;
}
</style>
