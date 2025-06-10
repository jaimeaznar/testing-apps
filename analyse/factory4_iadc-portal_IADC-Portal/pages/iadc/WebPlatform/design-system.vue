<template>
  <div class="app--content">
    <iframe
      id="design-system-iframe"
      title="IADC Design System"
      class="app--frame"
      src="https://factory4.emea-aws-gitlab-pages.service.cloud.local:4001/digital-foundation/iadc-styles-library/?path=/story/generaldocumentation--page"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({ layout: 'iadc' })
export default class DesignSystem extends Vue {
  head() {
    return { title: 'Design System' };
  }
}
</script>

<style lang="scss" scoped>
iframe.app--frame {
  display: flex;
  background: transparent;
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  height: 100%;
  position: absolute;
}

.app--content {
  position: absolute;
  background: transparent;
  margin: 0;
  padding: 0;
  border: none;
  left: 0%;
  right: 0%;
  top: 0;
  bottom: 40px;
}
</style>
