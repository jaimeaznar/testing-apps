import colors from 'vuetify/es5/util/colors';
import getFilename from './env.config';

require('dotenv').config({ path: `./environment/${getFilename()}` });

export default {
  // Nuxt target - See https://nuxtjs.org/api/configuration-target
  target: 'server',
  ssr: false,
  telemetry: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: 'Sanofi docs - %s',
    title: 'Home',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: process.env.npm_package_name,
        name: process.env.npm_package_name,
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://eum.instana.io/eum.min.js',
        crossOrigin: 'anonymous',
        defer: true,
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: true,
  loadingIndicator: {
    name: 'circle',
    color: 'grey',
    background: 'white',
  },

  // TODO: migrate env to privateRuntimeConfig in convination with dotenv package for libraries not part of nuxtjs
  publicRuntimeConfig: {
    features: {
      centralJiraIssueEnabled: process.env.VUE_APP_FEATURE_JIRA_ISSUE_ENABLED,
    },
  },
  // privateRuntimeConfig: {
  //   apiMatomoToken: process.env.API_MATOMO_TOKEN,
  // },

  env: {
    iadc: {
      baseURLDocs: process.env.VUE_APP_CONFLUENCE_READER_BASE_URL,
      baseURLDocsApi: process.env.VUE_APP_CONFLUENCE_READER_BASE_API,
      cognitoProviderName: process.env.VUE_APP_COGNITO_PROVIDER_NAME,
    },
    matomo: {
      apiToken: process.env.VUE_APP_API_MATOMO_TOKEN,
      baseURL: process.env.VUE_APP_MATOMO_BASE_URL,
    },
    roles: {
      list: process.env.ROLES,
    },
    whispr: {
      httpEndpoint: process.env.VUE_APP_WHISPR_BASE_URL,
      wsEndpoint: process.env.VUE_APP_WHISPR_BASE_WS,
    },
    googleAnalytics: {
      gtmId: process.env.VUE_APP_GOOGLE_ANALYTICS_ID,
    },

    // Enforce cache deletion for each build because we use placeholders to manage environment variables
    buildTime: new Date().getTime(),
    instana: process.env.VUE_APP_INSTANA_API_KEY,
  },
  apollo: {
    clientConfigs: {
      whispr: '~/plugins/whispr-auth-conf.js',
    },
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // { src: '@/plugins/confluence-client.js', mode: 'client' },
    { src: '@/plugins/instana', mode: 'client' },
    { src: '@/plugins/vue-shortkey', mode: 'client' },
    { src: '@/plugins/glisten-client', mode: 'client' },
    { src: '@/plugins/vue-apexcharts', mode: 'client' },
    { src: '@/plugins/google-analytics', mode: 'client' },
    { src: '@/plugins/self-service', mode: 'client' },
  ],

  // buildModules: [
  //   ['@nuxtjs/dotenv', { path: './environment/', filename: getFilename() }],
  // ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // https://github.com/nuxt-community/svg-sprite-module
    '@nuxtjs/svg-sprite',
    '@nuxtjs/apollo',
    '@nuxtjs/auth-next',
  ],

  auth: {
    strategies: {
      cognito: {
        scheme: 'oauth2',
        endpoints: {
          authorization: `https://${process.env.VUE_APP_COGNITO_APP_DOMAIN}/oauth2/authorize`,
          userInfo: `https://${process.env.VUE_APP_COGNITO_APP_DOMAIN}/oauth2/userInfo`,
          token: `https://${process.env.VUE_APP_COGNITO_APP_DOMAIN}/oauth2/token`,
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          global: false,
          maxAge: 1800,
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30,
        },
        responseType: 'code',
        grantType: 'authorization_code',
        accessType: 'offline',
        clientId: process.env.VUE_APP_COGNITO_CLIENT_ID,
        scope: ['openid', 'profile', 'email'],
        codeChallengeMethod: 'S256',
      },
    },
    redirect: {
      login: '/login',
      callback: '/callback',
      home: '/',
    },
  },

  typescript: {
    typeCheck: {
      eslint: {
        files: './**/*.{ts,js,vue}',
      },
    },
  },

  pwa: {
    meta: {
      title: 'IADC Portal',
      author: 'IADC Team',
    },
    manifest: {
      name: 'IADC Portal',
      short_name: 'IADC',
      lang: 'en',
      theme_color: '#3E52AB',
      background_color: '#000000',
      display: 'standalone',
      Scope: '/',
      start_url: '/',
    },
  },

  svgSprite: {
    // svpSprite module options
    input: '~/assets/svg-icons-svg/',
    output: '~/assets/svg-icons-gen/',
  },

  // Content module configuration (https://go.nuxtjs.dev/content-config)
  content: {},

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    // Main SCSS file in the project
    // '~/assets/rubik.scss',
    '~/assets/main',
  ],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      options: { customProperties: true },
      themes: {
        light: {
          primary: colors.purple,
          secondary: colors.purple.darken1,
          accent: colors.purple.darken4,
          error: colors.red.accent3,
          background: '#fafafa',
        },
        dark: {
          primary: colors.purple.lighten1,
          secondary: colors.purple.lighten3,
          accent: colors.purple.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          background: '#2a1245',
        },
      },
    },
  },

  // Each route resolves the konviw pages to the same generic page
  router: {
    middleware: ['rolesGuard', 'google-analytics'],
    extendRoutes(routes, resolve) {
      routes.push(
        {
          path: '/feedback-dashboard',
          redirect: '/iadc/feedback-dashboard',
        },
        {
          // generic route supported self service portal mechanism
          name: 'self-service',
          path: '/:portal',
          component: resolve(__dirname, 'pages/self-service-portal/index.vue'),
        },
        {
          // generic blog for any portal filtering posts for a given space
          // :portal+ to match routes with one or multiple sections
          name: 'page-blog',
          path: '/:portal/blog',
          component: resolve(__dirname, 'pages/blog/index.vue'),
        },
        {
          name: 'page-konviw',
          path: '/:portal/:name/:id',
          component: resolve(__dirname, 'pages/konviw/_id.vue'),
        },
        {
          name: '*',
          path: '/:name/:id',
          component: resolve(__dirname, 'pages/konviw/_id.vue'),
        },
      );
    },
  },

  serverMiddleware: [
    { path: '/api/certificate', handler: '~/api/certificate.ts' },
    { path: '/api/google-analytics', handler: '~/api/google-analytics.ts' },
    { path: '/api/self-service', handler: '~/api/self-service.ts' },
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
};
