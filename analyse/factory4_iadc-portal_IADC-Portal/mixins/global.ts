import { LandingPageModel } from '~/api/models/landing-page.model';

export default {
  methods: {
    getPortalIdFromUrl(url: string) {
      return url.split('/')[3];
    },

    getPortalIdFromPath(path: string) {
      return path.split('/')[1];
    },

    getHomepageId(
      landingPageData: LandingPageModel[],
      targetUrl: string,
    ): string {
      const currentPortal = landingPageData.find(
        (page) => page.targetUrl === targetUrl,
      );
      return currentPortal?.homepageId || '';
    },

    checkPortal(
      landingPageData: LandingPageModel[],
      portalid: string,
    ): LandingPageModel | undefined {
      return landingPageData.find((data) => data.targetUrl === portalid);
    },

    isAssetConfluenceSelfServiceUrl(path: string) {
      return path && path.includes('data:image');
    },
  },
};
