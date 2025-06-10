<template>
  <div class="mb-10">
    <v-timeline align-center>
      <v-timeline-item
        v-for="(event, i) in timeline"
        :key="i"
        :color="event.color"
        fill-dot
        medium
      >
        <!-- eslint-disable-next-line vue/no-useless-template-attributes -->
        <template #opposite align-top>
          <span :class="`headline font-weight-bold ${event.color}--text`">{{
            event.year
          }}</span>
        </template>
        <v-card elevation="4" class="mx-auto" max-width="500">
          <v-img
            class="white--text align-end"
            height="125px"
            :src="require(`@/pages/iadc/assets/images/bootcamps/${event.img}`)"
            :alt="event.title"
            style="filter: brightness(75%)"
          />
          <v-card-title>
            <h4 style="word-break: normal">
              {{ event.title }}
            </h4>
          </v-card-title>
          <v-card-text class="text--primary">
            <div>
              {{ event.summary }}
            </div>
            <v-col class="text-right">
              <v-btn class="mx-0 mt-4 text-lowercase" outlined :to="event.url">
                Read more
              </v-btn>
            </v-col>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Bootcamps from '~/pages/iadc/data/data-bootcamps';

@Component({ layout: 'iadc' })
export default class Bootcmaps extends Vue {
  timeline = Bootcamps;

  head() {
    return { title: 'Bootcamps Timeline' };
  }
}
</script>
