import { LandingPageModel } from '~/api/models/landing-page.model';
import global from '~/mixins/global';

describe('Mixin functions ', function () {
  describe('Tests global function', function () {
    const url = 'http://localhost:8080/iadc';
    const path = '/iadc/feedback-dashboard';
    const iadcId = 'iadc';
    const hompageId = 'iadc';
    it('should return a portal id from url', () => {
      expect(global.methods.getPortalIdFromUrl(url)).toEqual(iadcId);
    });

    it('should return a portal id from path', () => {
      expect(global.methods.getPortalIdFromPath(path)).toEqual(iadcId);
    });

    it('should return a portal hompageId from path', () => {
      expect(
        global.methods.getHomepageId(
          [{ targetUrl: 'iadc', homepageId: 'iadc' }] as LandingPageModel[],
          'iadc',
        ),
      ).toEqual(hompageId);
    });

    it('should return boolean based on path url', () => {
      expect(global.methods.isAssetConfluenceSelfServiceUrl('iadc')).toBe(
        false,
      );
      expect(
        global.methods.isAssetConfluenceSelfServiceUrl('data:image/png'),
      ).toBe(true);
    });
  });
});
