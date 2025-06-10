<template>
  <section id="about">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="10">
          <v-row align="center" justify="center">
            <v-col cols="12" md="7">
              <v-row>
                <v-col cols="12" class="d-flex align-center">
                  <v-img
                    :src="require('@/pages/iadc/assets/images/konviw-docs.svg')"
                    class="mr-8"
                    max-width="60px"
                    contain
                  />
                  <p class="text-justify mr-8">
                    Page content formated with configurable CSS stylesheets,
                    zoomable images, draw.io diagrams preview, web statistics,
                    code with syntax highlighted, reading progress bar...
                  </p>
                </v-col>
                <v-col cols="12" class="d-flex align-center">
                  <v-img
                    :src="require('@/pages/iadc/assets/images/konviw-api.svg')"
                    class="mr-8"
                    max-width="60px"
                    contain
                  />
                  <p class="text-justify mr-8">
                    Simplified REST API providing a read-only access to search
                    pages and retrieve page content.
                  </p>
                </v-col>
                <v-col cols="12" class="d-flex align-center">
                  <v-img
                    :src="
                      require('@/pages/iadc/assets/images/konviw-slides.svg')
                    "
                    class="mr-8"
                    max-width="60px"
                    contain
                  />
                  <p class="text-justify mr-8">
                    Web slides deck directly from your Confluence pages. Thanks
                    to the awesome job done by reveal.js
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="5" class="d-none d-md-flex">
              <v-hover v-slot="{ hover }">
                <v-card
                  class="card"
                  shaped
                  :elevation="hover ? 10 : 4"
                  :class="{ up: hover }"
                >
                  <v-img
                    :src="
                      require('@/pages/iadc/assets/images/konviw-screenshot.png')
                    "
                    class="d-block ml-auto mr-auto konviw--screenshot"
                    max-width="400px"
                    :class="{ 'zoom-efect': hover }"
                  />
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped lang="scss">
#about {
  background-color: #fafafa;
  border: 1px solid lightgray;
  border-radius: 5px;
}

.konviw--screenshot {
  max-width: 350px;
}

.card {
  min-height: 300px;
  padding: 10px;
  transition: 0.5s ease-out;
}
.card .v-image {
  margin-bottom: 15px;
  transition: 0.75s;
}
.card h1 {
  margin-bottom: 10px;
}
.zoom-efect {
  transform: scale(1.15);
}
.up {
  transform: translateY(-10px);
  transition: 0.5s ease-out;
}
</style>
