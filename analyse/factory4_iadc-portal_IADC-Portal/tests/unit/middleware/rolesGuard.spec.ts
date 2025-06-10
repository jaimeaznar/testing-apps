import {
  stringToArray,
  checkCommonAccess,
  checkUserProfile,
  handlePostLoginRedirection,
  checkAccess,
} from '../../../middleware/rolesGuard';

import { mockLocalStorage } from '../../test-utils';

import landingPageData from '~/tests/mocks/landing-page-data';

const { getItemMock } = mockLocalStorage();

describe('Tests stringToArray', function () {
  it('should return an array when input is an array', () => {
    const input = '[iadc_portal_admin_dev, iadc_portal_admin_prd]';
    const result = stringToArray(input);
    const expectedResult = ['iadc_portal_admin_dev', 'iadc_portal_admin_prd'];
    expect(result).toEqual(expectedResult);
  });

  it('should return an array when input is a single value', () => {
    const input = 'iadc_portal_admin_dev';
    const result = stringToArray(input);
    const expectedResult = ['iadc_portal_admin_dev'];
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty array when input is empty', () => {
    const input = '';
    const result = stringToArray(input);
    const expectedResult = [''];
    expect(result).toEqual(expectedResult);
  });
});

describe('Tests checkCommonAccess', function () {
  it('should return true if at least one common group', () => {
    const inputA = ['iadc_portal_admin_dev', 'iadc_portal_admin_prd'];
    const inputB = ['iadc_portal_admin_prd'];
    const result = checkCommonAccess(inputA, inputB);
    const expectedResult = true;

    expect(result).toEqual(expectedResult);
  });

  it('should return false if empty userRoles', () => {
    const inputA = [];
    const inputB = ['iadc_portal_admin_dev', 'iadc_portal_admin_prd'];
    const result = checkCommonAccess(inputA, inputB);
    const expectedResult = false;

    expect(result).toEqual(expectedResult);
  });

  it('should return false if there is no common group', () => {
    const inputA = ['iadc_portal_admin_devb', 'iadc_portal_admin_prdb'];
    const inputB = ['iadc_portal_admin_dev', 'iadc_portal_admin_prd'];
    const result = checkCommonAccess(inputA, inputB);
    const expectedResult = false;

    expect(result).toEqual(expectedResult);
  });
});

describe('Tests checkUserProfile', function () {
  it("should returns false if user profile doesn't have proper access", () => {
    const inputUser = {
      profile: 'iadc_portal_admin_devb, iadc_portal_admin_prdb',
    };
    const inputMenuItem = {
      restrictedTo: ['iadc_portal_admin_dev', 'iadc_portal_admin_prd'],
    };
    const result = checkUserProfile(inputUser, inputMenuItem);
    const expectedResult = false;

    expect(result).toEqual(expectedResult);
  });

  it('should return true if user profile has proper access', () => {
    const inputUser = {
      profile: 'iadc_portal_admin_dev, iadc_portal_admin_prd',
    };
    const inputMenuItem = {
      restrictedTo: ['iadc_portal_admin_dev', 'iadc_portal_admin_prd'],
    };
    const result = checkUserProfile(inputUser, inputMenuItem);
    const expectedResult = true;

    expect(result).toEqual(expectedResult);
  });
});

describe('Tests handlePostLoginRedirection', function () {
  let ctx;
  beforeEach(() => {
    ctx = {
      redirect: jest.fn(),
      route: {
        path: '/',
      },
    };
  });

  it('should redirect if there is a cachedRoute in localstorage', () => {
    getItemMock.mockReturnValue('/iadc/feedback-dashboard');
    handlePostLoginRedirection(ctx);
    expect(ctx.redirect).toHaveBeenCalled();
  });

  it('should not redirect if the cachedRoute in localstorage is the same as the current route', () => {
    getItemMock.mockReturnValue('/');
    handlePostLoginRedirection(ctx);
    expect(ctx.redirect).not.toHaveBeenCalled();
  });

  it('should not redirect if there is not any cachedRoute in localstorage', () => {
    handlePostLoginRedirection(ctx);
    expect(ctx.redirect).not.toHaveBeenCalled();
  });
});

describe('Tests checkAccess', function () {
  let ctx;
  beforeEach(() => {
    ctx = {
      redirect: jest.fn(),
      route: {
        path: '/iadc/feedback-dashboard',
      },
      error: jest.fn(),
      store: {
        state: {
          landingPageData,
        },
      },
    };
  });

  it('should not return an error if the user has proper ad groups', () => {
    const inputUser = {
      profile: 'iadc_portal_admin_dev, iadc_portal_admin_prd',
    };
    checkAccess(ctx, inputUser);
    expect(ctx.error).not.toHaveBeenCalled();
  });

  it('should return an error if the user does not have proper ad groups', () => {
    const inputUser = {
      profile:
        'iadc_portal_admin_dev_incorrect, iadc_portal_admin_prd_incorrect',
    };

    const errorCtx = {
      route: { path: '/iadc/feedback-dashboard' },
      error: jest.fn(),
      store: {
        state: {
          landingPageData: landingPageData.map((element) => ({
            ...element,
            menus: element.menus?.map((menu) => ({
              ...menu,
              restrictedTo: ['test'],
            })),
          })),
        },
      },
    };
    checkAccess(errorCtx, inputUser);
    expect(errorCtx.error).toHaveBeenCalled();
  });
});
