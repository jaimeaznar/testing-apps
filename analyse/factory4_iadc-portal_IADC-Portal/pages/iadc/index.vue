<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="20">
      <div class="text-center">
        <FactoryLogo />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to the Digital Factory 4.0 Home
        </v-card-title>
        <v-card-text class="key--message">
          <p>
            Digital is one of the biggest transformations in the coming years:
            it will boost our efficiency with real time management of all our
            data and operations, leading to further improve our service to
            customers and patients. It will also transform all our industrial
            jobs, in each department and at every level of the organization,
            making them even more exciting than they are already.
          </p>
          <p>
            We have built over the last months a strong Global team, and
            deployed digital solutions for proof of concept in some of our
            Lighthouse sites. Now it is time to accelerate and move from
            lighthouses to massive deployments across our network. We have 18
            months to become the first fully digitalized Industrial network of
            the industry. This is a top priority for Sanofi and Industrial
            Affairs teams.
          </p>
          <p>
            We will succeed in our deployment because we continue to train and
            upskill our people to increase our digital capabilities, but also
            upgrade our ways of working and standards. All our team members,
            wherever they are, expect a lot from this journey because it is a
            unique opportunity to experience at work what we already enjoy in
            our personal life, for example with connected devices and equipment.
          </p>
          <p>
            More than ever we are building the future of our company, and I wish
            to all of us a lot of success in this very exciting journey.
          </p>
          <!-- <p>-- Philippe Luscan</p> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import FactoryLogo from '~/pages/iadc/components/FactoryLogo.vue';

@Component({
  components: {
    FactoryLogo,
  },
})
export default class Index extends Vue {}
</script>

<style scoped>
.key--message {
  font-size: 1.1em;
}
</style>
