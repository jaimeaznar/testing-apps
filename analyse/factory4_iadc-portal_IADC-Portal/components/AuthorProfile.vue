<template>
  <div class="author__section">
    <v-img
      v-if="image"
      class="author__section-image"
      :alt="name"
      :src="image"
    />
    <div class="author__section-text">
      <p class="author__section-name">
        <span v-if="name" class="bold">{{ nameNormalized }}</span>
        <span v-if="when" class="author__section-date">
          on {{ whenHumanReadable }}
        </span>
      </p>
      <p v-if="email" class="author__section-email">
        <a :href="`mailto:${email}`">{{ email }}</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class AuthorProfile extends Vue {
  // --------------- //
  // Data Props      //
  // --------------- //
  @Prop() readonly name!: string;
  @Prop() readonly image!: string;

  @Prop() readonly email: string;
  @Prop() readonly version: number;
  @Prop() readonly when: string;
  @Prop() readonly friendlyWhen: string;

  // --------------- //
  // Computed        //
  // --------------- //
  get whenHumanReadable() {
    return new Date(this.when)?.toLocaleDateString('eng-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Remove the word '(Deactivated)' from the name'
  get nameNormalized() {
    let sanitizedName;
    if (this.name.indexOf('(Deactivated)') > 0) {
      sanitizedName = this.name.substring(
        0,
        this.name.indexOf('(Deactivated)') - 1,
      );
    } else {
      sanitizedName = this.name;
    }
    return sanitizedName;
  }
}
</script>

<style scoped lang="scss">
.author__section {
  display: inline;
  vertical-align: top;
  &-image {
    max-width: 40px;
    border-radius: 99px;
    margin: 0 10px 0 0;
    display: inline-block;
  }
  &-text {
    display: inline-block;
    vertical-align: top;
    .bold {
      font-weight: 600;
    }
    p {
      margin: 0;
    }
  }
}
</style>
