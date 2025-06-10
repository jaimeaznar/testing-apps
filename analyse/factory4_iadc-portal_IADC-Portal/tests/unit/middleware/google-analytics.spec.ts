import {
  userParamsFactory,
  routeParamsFactory,
  GoogleAnalyticsUser,
  hash,
} from '../../../middleware/google-analytics';

describe('GA4 Tracking', () => {
  let user: GoogleAnalyticsUser;

  beforeEach(() => {
    user = {
      address: 'example adress',
      identities: '[{"userId":"E0495490"}]',
    };
  });

  it('should return correct user information', async () => {
    const paramsFactoryResult = await userParamsFactory(user);
    expect(paramsFactoryResult.user_id).not.toBe(
      JSON.parse(user.identities)[0].userId,
    );
    expect(paramsFactoryResult.user_id).not.toBe(user.address);
  });

  it('should return correct route information', () => {
    const paramsFactoryResult = routeParamsFactory({
      state: { targetUrl: 'Digital' },
    });
    expect(paramsFactoryResult).toEqual({
      portal_name: 'Digital',
    });
  });

  it('should return hashed value', async () => {
    const exampleValue = 'value';
    const hashedValue = await hash(exampleValue);
    expect(hashedValue).not.toBe(exampleValue);
  });
});
