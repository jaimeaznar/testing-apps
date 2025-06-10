<template>
  <GlistenDashboard :admin-access-rights="adminAccessRights" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { restrictedCognitoAdminGroups } from '~/util/user';

@Component({
  layout: 'iadc',
})
export default class FeedbackDashboard extends Vue {
  head() {
    return { title: 'Feedback Dashboard' };
  }

  get adminAccessRights() {
    const cognitoGroups = this.$auth?.user?.profile as string | Array<string>;
    if (Array.isArray(cognitoGroups)) {
      return cognitoGroups.some((group: string) =>
        restrictedCognitoAdminGroups.includes(group),
      );
    }
    return restrictedCognitoAdminGroups.includes(cognitoGroups);
  }
}
</script>
