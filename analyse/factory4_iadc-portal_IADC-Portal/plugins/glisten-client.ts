import Vue from 'vue';
import Glisten, { GlistenClient, GlistenDashboard } from '@sanofi-iadc/glisten';

Vue.component('GlistenClient', GlistenClient);
Vue.component('GlistenDashboard', GlistenDashboard);

Vue.use(Glisten);
