<template>
  <v-footer height="40px" class="light-grey pa-3 app--footer">
    <span class="caption">&copy; {{ new Date().getFullYear() }}</span>
    <v-spacer />
    <span class="caption mr-1"> Made with </span>
    <v-icon color="green" small> mdi-heart-outline </v-icon>
    <span id="editor" class="caption mr-1"> &nbsp;by {{ editor }} </span>
  </v-footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class PageFooter extends Vue {
  @Prop() readonly editor!: string;
}
</script>

<style lang="scss" scoped>
.app--footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
