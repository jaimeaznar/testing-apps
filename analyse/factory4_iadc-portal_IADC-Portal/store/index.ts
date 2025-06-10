import { LandingPageModel } from '~/api/models/landing-page.model';
import { Version, IframeData } from '~/api/models/interface.model';

interface Store {
  drawer: boolean;
  feedback: boolean;
  search: boolean;
  spaceKeys: string[];
  spaceTitles: string[];
  targetUrl: string;
  iframeData: IframeData;
  metadata: boolean;
  landingPageData: LandingPageModel[];
}

const konviwCreatedVersion: Version = {
  versionNumber: 1,
  when: '',
  friendlyWhen: '',
  modificationBy: {
    displayName: '',
    email: '',
    profilePicture: '',
  },
};

const konviwLastVersion: Version = Object.create(konviwCreatedVersion);

const iframeData: IframeData = {
  konviwFrameUrl: '',
  konviwSpaceKey: '',
  konviwPageId: '',
  konviwTitle: '',
  konviwExcerpt: '',
  labels: [],
  readTime: 0,
  konviwCreatedVersion,
  konviwLastVersion,
};

export const state = () =>
  ({
    drawer: true,
    feedback: false,
    search: false,
    spaceKeys: [],
    spaceTitles: [],
    targetUrl: '',
    iframeData,
    metadata: false,
    landingPageData: [],
  } as Store);

export const mutations = {
  toggleDrawer(state: any) {
    state.drawer = !state.drawer;
  },

  drawer(state: any, val: boolean) {
    state.drawer = val;
  },

  toggleFeedback(state: any) {
    state.feedback = !state.feedback;
  },

  toggleMetadata(state: any) {
    state.metadata = !state.metadata;
  },

  feedback(state: any, val: boolean) {
    state.feedback = val;
  },

  toggleSearch(state: any) {
    state.search = !state.search;
  },

  search(state: any, val: boolean) {
    state.search = val;
  },

  spaceKeys(state: any, val: string[]) {
    state.spaceKeys = val;
  },

  spaceTitles(state: any, val: string[]) {
    state.spaceTitles = val;
  },

  targetUrl(state: any, val: string) {
    state.targetUrl = val;
  },

  iframeData(state: any, val: IframeData) {
    state.iframeData = val;
  },

  landingPageData(state: any, value: LandingPageModel[]) {
    state.landingPageData = value;
  },
};
