<template>
  <div>
    <v-container>
      <!--// TODO: Add filters based on the labels or tags from the blogs -->

      <div class="d-flex flex-wrap justify-center post">
        <div v-for="post of sortBlogs(posts)" :key="post.docId">
          <v-hover v-slot="{ hover }" open-delay="100">
            <v-card
              class="ma-5"
              :class="{ 'on-hover': hover }"
              :elevation="hover ? 8 : 2"
              width="300px"
              height="450px"
            >
              <!-- NuxtLink to open the blog post link using the konviw
                  viewer passing the Confluence Page ID and blog as type -->
              <NuxtLink
                class="post__link"
                :to="{
                  name: 'page-konviw',
                  params: {
                    portal: pathPortal,
                    name: 'blog',
                    id: post.docId,
                  },
                  query: { space: 'iadc', type: 'blog' },
                }"
              >
                <v-img height="150" :src="post.imgblog" contain> </v-img>
                <v-card-title class="post__title">{{
                  shortenText(post.title, 50)
                }}</v-card-title>
                <v-card-subtitle class="pt-2 pb-3"
                  >{{ shortenText(post.summary, 225) }}
                </v-card-subtitle>
                <v-card-subtitle class="post__profile">
                  <AuthorProfile
                    :name="post.createdBy"
                    :image="post.createdByAvatar"
                  />
                </v-card-subtitle>
                <div class="post__readtime mb-3">
                  <ReadTime :content="post.body" />
                </div>
                <div class="post__readmore ml-4 mb-3">Read More ...</div>
              </NuxtLink>
            </v-card>
          </v-hover>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import _ from 'lodash';
import ReadTime from '~/components/ReadTime.vue';
import AuthorProfile from '~/components/AuthorProfile.vue';

@Component({
  layout: 'default',
  components: {
    ReadTime,
    AuthorProfile,
  },
})
export default class Blog extends Vue {
  // --------------- //
  // Data            //
  // --------------- //
  space = '';
  posts = [];

  // --------------- //
  // Lifecycle hooks //
  // --------------- //
  async fetch() {
    this.space = this.$route.query.space as string;
    const { data } = await this.$axios.get(
      `${(process.env.iadc as any).baseURLDocsApi}/BlogPosts/${this.space}/`,
    );
    this.posts = data.results;
  }

  // --------------- //
  // Methods         //
  // --------------- //
  shortenDescription(str: string): string {
    const maxLen = 150;
    if (str.length <= maxLen) {
      return str;
    }
    return str.substr(0, str.lastIndexOf(' ', maxLen)) + '...';
  }

  shortenText(str: string, maxLen: number): string {
    if (str.length <= maxLen) {
      return str;
    }
    return str.substr(0, str.lastIndexOf(' ', maxLen)) + '...';
  }

  sortBlogs(items: {}): any {
    return _.orderBy(items, 'createdAt', 'desc');
  }

  // --------------- //
  // Computed        //
  // --------------- //
  get pathPortal(): string {
    return this.$route.params.portal;
  }

  // --------------- //
  // Head method     //
  // --------------- //
  head() {
    return { title: `${this.$route.params.portal.toUpperCase()} Blog` };
  }
}
</script>

<style lang="scss" scoped>
.blog--header {
  text-align: center;
  margin-top: 0px;
  margin-bottom: 0px;
}

.post {
  padding-top: 1rem;
  color: rgb(148, 6, 167);
  &__title {
    color: rgb(107, 1, 121);
    font-size: 1.2rem;
    line-height: 1.3rem;
    // margin-bottom: 0.1rem;
    word-break: initial;
    font-weight: 900;
    // height: 150px;
  }
  &__link {
    text-decoration: none;
  }
  &__readmore {
    color: rgb(78, 57, 77);
    padding: 15px;
    display: inline-block;
    position: absolute;
    text-align: right;
    bottom: 0;
    width: 100%;
    right: 0px;
    height: 15px;
  }
  &__readtime {
    color: rgb(78, 57, 77);
    padding: 15px;
    display: inline-block;
    position: absolute;
    text-align: left;
    bottom: 0;
    width: 100%;
    height: 15px;
  }
  &__profile {
    color: rgb(78, 57, 77);
    padding: 10px;
    display: inline-block;
    position: absolute;
    bottom: 70px;
    width: 100%;
    height: 15px;
  }
}
</style>
