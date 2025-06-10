<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="20">
      <div class="text-center">
        <img
          alt="Digital Team Header"
          width="600px"
          src="@/pages/digital/assets/images/Digital-Banner.png"
        />
      </div>
      <v-card>
        <v-card-title class="headline"> “Our Digital Ambition” </v-card-title>
        <v-card-text>
          <blockquote>
            <p>
              We have embarked on a large-scale digital transformation with
              short- and long-term goals that reflects the Play to Win strategy
              and drive growth for the company to allow the reinvestment in
              science and improve the lives of our patients.
            </p>
          </blockquote>
          <p>Be the leading digital healthcare platform</p>
          <ul>
            <li>… for employees, researchers, HCPs, HAs, and patients</li>
            <li>… by developing and delivering our products faster</li>
            <li>
              … and by leveraging data insights and engaging digital experiences
            </li>
          </ul>
          <p><br />-- Arnaud Robert</p>
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

@Component
export default class Index extends Vue {}
</script>
