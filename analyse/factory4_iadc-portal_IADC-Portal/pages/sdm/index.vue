<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="20">
      <div class="text-center">
        <img
          alt="Sanofi Data Modeling"
          width="600px"
          src="@/pages/sdm/assets/images/play-to-win.png"
        />
      </div>
      <p />
      <v-card>
        <v-card-title class="headline">
          Sanofi Data Modeling & Definition - Digital IA & CF
        </v-card-title>
        <v-card-text>
          <p>
            This space is created to publish and share Conceptual Business Data
            Models about Business Objects used by Digital IA & Corporate
            Functions.
          </p>
          <p>
            In this space, you can find Diagram & Glossary of Conceptual
            Business Data Models, List of Values organized through Reference
            Data, Illustrations of concrete example using data models, and,
            recorded presentation of our deliverables in the Webinar Folder.
            Visit us regularly because we expanding the content step by step
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
