<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="20">
      <div class="text-center">
        <img
          alt="Sanofi Data Modeling"
          width="600px"
          src="@/pages/mtech/assets/images/background_portal_mtech_ds.jpg"
        />
      </div>
      <p />
      <v-card>
        <v-card-title class="headline">
          Sanofi Pasteur Manufacturing Technology Digital Initiatives
        </v-card-title>
        <v-card-text>
          <p>Welcome to the MTech Digital Portal</p>
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
