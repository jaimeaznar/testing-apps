<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="20">
      <div class="text-center">
        <img
          alt="Sanofi Data Modeling"
          width="600px"
          src="@/pages/mes/assets/images/Sanofi_MARS_Background1.jpg"
        />
      </div>
      <v-card>
        <v-card-title class="headline">
          Manufacturing Execution System Products
        </v-card-title>
        <v-card-text>
          <p>
            Welcome to this MES Products page, this page aggregates information
            link to the governance, roadmap, release notes & environment
            management of our MES Products
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Index extends Vue {}
</script>
