<template>
  <div>
    <ConfluencePage
      :path-route="pathRoute"
      :page-id="pageId"
      :page-type="pageType"
      :show-border="false"
      :full-page="true"
      :show-metadata="true"
      :page-theme="theme"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import ConfluencePage from '~/components/ConfluencePage.vue';

@Component({
  // The path of the route will define the layout to be used
  // root path will use 'default.vue' layout
  // 'iadc/' path will use 'iadc.vue' layout
  // layout: (context) => context.route.path.split('/')[1] ?? 'default',
  layout: 'default',
  components: {
    ConfluencePage,
  },
})
export default class KonviwPage extends Vue {
  get pathRoute(): string {
    return this.$route.params.name;
  }

  get pageType() {
    return this.$route.query.type;
  }

  get pageId(): string {
    return this.$route.params.id;
  }

  get theme() {
    return this.$vuetify.theme.dark ? 'dark' : 'light';
  }
}
</script>

<style lang="scss" scoped></style>
