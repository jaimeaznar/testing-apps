<template>
  <div>
    <svg-icon v-if="iadc" :name="iconName" class="icon--iadc" />
    <v-icon v-else>
      {{ iconName }}
    </v-icon>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class IadcIcon extends Vue {
  @Prop() readonly icon!: string;

  // Computed functions
  get iadc(): string | undefined {
    return this.icon.match(/(^iadc-)/)?.toString();
  }

  get iconName(): string {
    if (this.icon.match(/(^iadc-)/)) {
      return this.icon.replace(/(^iadc-)/, '');
    } else {
      return this.icon;
    }
  }
}
</script>

<style lang="scss" scoped>
.icon--iadc {
  width: 24px;
  height: 24px;
  .theme--dark & {
    stroke: white;
  }
}
</style>
