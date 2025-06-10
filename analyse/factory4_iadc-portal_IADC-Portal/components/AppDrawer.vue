<template>
  <v-navigation-drawer
    v-model="drawer"
    :clipped="navigation.clipped"
    :width="navigation.width"
    fixed
    app
  >
    <v-list dense>
      <template v-for="(item, i) in menus">
        <template
          v-if="
            !item.restrictedTo || item.visibleToAnonymous || canAccess(item)
          "
        >
          <!-- MAIN LEVEL MENUS WITH CHILDREN (with item.items) -->
          <v-list-group
            v-if="item.items"
            :key="item.group + i"
            :group="item.group"
            no-action="no-action"
            :class="{ menu__list: !$vuetify.theme.dark }"
          >
            <template
              v-if="
                !item.restrictedTo || item.visibleToAnonymous || canAccess(item)
              "
              #activator
            >
              <!-- parent of the group with prepend icon -->
              <IadcIcon :icon="item.icon" class="menu__icon" />
              <v-list-item-title class="menu__title">
                {{ item.title }}
              </v-list-item-title>
              <!-- let's mark with a lock the items without access but visible to everybody -->
              <v-icon
                v-if="!canAccess(item) && item.visibleToAnonymous"
                class="menu__icon"
              >
                mdi-lock
              </v-icon>
            </template>

            <!-- LIST OF SUBITEMS (LEVEL 2) -->
            <template v-for="(subItem, j) in item.items">
              <!-- without access to the parent the subitems will not be visible -->
              <v-list-item
                v-if="canAccess(item)"
                :key="subItem.title + j"
                v-bind="linkProps(subItem.href)"
                :disabled="subItem.disabled"
                :target="subItem.target"
                class="submenu__list"
                @click.native="
                  clickHandler(
                    subItem.href ? subItem.href : null,
                    $event,
                    subItem,
                    item,
                  )
                "
              >
                <!-- title of each subitem in the list -->
                <v-list-item-title class="submenu__title">
                  {{ subItem.title }}
                </v-list-item-title>
                <div>
                  <!-- chip badge with extra info about the subitem menu -->
                  <v-chip
                    v-if="subItem.badge"
                    color="primary"
                    outlined
                    pill
                    x-small
                  >
                    {{ subItem.badge }}
                  </v-chip>
                </div>
              </v-list-item>
            </template>
            <!-- ------------------------- -->
          </v-list-group>

          <!-- HEADER OF GROUPS OF MENU ITEMS -->
          <v-subheader v-else-if="item.header" :key="i">
            {{ item.header }}
          </v-subheader>

          <!-- DIVIDER BETWEEN MENU ITEMS -->
          <v-divider v-else-if="item.divider" :key="i" />

          <!-- MAIN LEVEL MENUS WITHOUT CHILDREN (without item.items) -->
          <v-list-item
            v-else
            :key="item.group + i"
            v-bind="linkProps(item.href)"
            :disabled="item.disabled"
            :target="item.target"
            class="menu__list"
            rel="noopener"
            @click="onHandleNavigationWithoutChildren(item)"
          >
            <IadcIcon :icon="item.icon" class="menu__icon" />
            <v-list-item-title class="menu__title">
              {{ item.title }}
            </v-list-item-title>
            <!-- let's mark with a lock the items without access but visible to everybody -->
            <v-icon
              v-if="!canAccess(item) && item.visibleToAnonymous"
              class="menu__icon"
            >
              mdi-lock
            </v-icon>
          </v-list-item>
        </template>
      </template>
      <v-subheader v-if="loggedIn"> User </v-subheader>
      <v-divider v-if="loggedIn" />
      <v-list-group v-if="loggedIn" no-action="no-action">
        <template #activator>
          <IadcIcon :icon="'mdi-account'" class="menu__icon" />
          <v-list-item-title class="menu__title">
            {{ userNickname }}
          </v-list-item-title>
        </template>
        <v-list-item @click="logout()">
          <v-list-item-title> Logout </v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import IadcIcon from '@/components/IadcIcon.vue';
import { MenuItem } from '~/api/models/menu-item.model';

@Component({
  components: {
    IadcIcon,
  },
})
export default class NavigationDrawer extends Vue {
  // --------------- //
  // Passed Properties //
  // --------------- //
  @Prop({ required: false, default: () => [] }) private menus!: MenuItem[];
  @Prop({ required: false, default: 280 }) private width = 280;

  // --------------- //
  // Data Properties //
  // --------------- //
  private navigation = {
    width: this.width,
    clipped: true,
  };

  private currentRoute: string | null = null;

  // ------------------- //
  // Computed Properties //
  // ------------------- //
  get userNameInitials(): string | null {
    if (!this.$auth.user) {
      return null;
    }
    return `${(this.$auth.user.given_name as string)[0]}${
      (this.$auth.user.family_name as string)[0]
    }`;
  }

  get userNickname(): string | null {
    return (this.$auth.user?.nickname as string) ?? null;
  }

  get drawer() {
    return this.$store.state.drawer;
  }

  set drawer(val) {
    this.$store.commit('drawer', val);
  }

  get loggedIn() {
    return this.$auth?.loggedIn;
  }

  // --------------- //
  // Lifecycle hooks //
  // --------------- //
  created() {
    this.currentRoute = this.$route?.fullPath ?? '';
  }

  // --------------- //
  // Methods         //
  // --------------- //
  toggleFeedback() {
    this.$store.commit('toggleFeedback');
  }

  logout() {
    this.$router.push({ path: '/' });
  }

  // This function returs the proper binding with :href for external URL or :to for nuxt route
  linkProps(url: string) {
    if (url.match(/^(http(s)?|ftp):\/\//)) {
      return {
        href: url || null,
      };
    }
    return {
      to: url,
    };
  }

  clickHandler(
    to: any,
    $event: any,
    subItem: { title: string },
    item: { title: string },
  ) {
    this.hidePageInformation();
    // This routine is called by
    // @click.native="clickHandler(subItem.href ? subItem.href : null, $event)"
    // so we force a page reload when navigation is to the same route
    if (!($event.ctrlKey || $event.metaKey) && this.currentRoute === to) {
      this.$router.go(to);
    } else {
      this.currentRoute = to;
    }
    // Add a new object to the queue in the GTM structure after changing the routing
    setTimeout(() => {
      this.$pushGTMEventInQueue({
        event: 'navigation',
        user: this.$auth.user,
        additionalParameters: this.prepareOnNavigateGTMParams(item, subItem),
      });
    }, 0);
  }

  prepareOnNavigateGTMParams(
    item: { title: string },
    subItem: { title: string },
  ) {
    const preparedParameters = [
      { key: 'section', value: 'menu' },
      { key: 'sub_section', value: item.title },
      { key: 'element', value: subItem.title },
    ].filter(({ value }) => value);

    return preparedParameters.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  onHandleNavigationWithoutChildren(item: { title: string }) {
    this.$pushGTMEventInQueue({
      event: 'navigation',
      user: this.$auth.user,
      additionalParameters: {
        section: 'menu',
        sub_section: '',
        element: item.title,
      },
    });
    this.hidePageInformation();
  }

  // disable metadata on each click on a menu item so the metadata indicator won't be displayed on a page without metadata
  hidePageInformation() {
    this.$store.commit('iframeData', {
      ...this.$store.state.iframeData,
      showMetadata: false,
    });
  }

  canAccess(item: any) {
    let result = true;
    const user = this.$auth.$state.user;
    if (item.restrictedTo) {
      if (user && user.profile) {
        let profileArray = user.profile.replace('[', '');
        profileArray = profileArray.replace(']', '');
        profileArray = profileArray.split(', ');
        result = profileArray.some((role: string) =>
          item.restrictedTo.includes(role),
        );
      } else {
        result = false;
      }
    }
    return result;
  }
}
</script>

<style lang="scss" scoped>
%dark-theme {
  background-color: #363636;
  color: white;
}

.menu__icon {
  margin-right: 5px;
}

.menu__list,
.v-list-item {
  background-color: #fbf9fc;
  &.theme--dark {
    @extend %dark-theme;
  }
}

.menu__title {
  text-align: left;
  white-space: normal;
  font-size: 15px !important;
  color: purple;
  .v-list-item.theme--dark & {
    @extend %dark-theme;
  }
}

.submenu__list {
  min-height: 20px !important;
  background-color: #f9f4fa;
  &.theme--dark {
    @extend %dark-theme;
  }
  &:hover {
    background-color: #e1bee7;
  }
}

.submenu__title {
  font-size: 12px !important;
  margin-left: -25px;
}
</style>
