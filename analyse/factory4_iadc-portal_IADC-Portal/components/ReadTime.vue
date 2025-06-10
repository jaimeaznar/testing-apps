<template>
  <span>{{ readTime }} min read</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class ReadTime extends Vue {
  @Prop() readonly content!: string;

  get readTime(): number {
    let minutes = 0;
    const contentText = JSON.stringify(this.content);
    const words = contentText.split(' ').length;
    const wordsPerMinute = 200;
    minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  }
}
</script>
