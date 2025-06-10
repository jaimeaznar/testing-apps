import { LandingPageModel } from '~/api/models/landing-page.model';

interface PromiseSettledLandingPageModel {
  value: LandingPageModel;
  status: string;
}

const mapPromiseSettled = (
  promises: PromiseSettledLandingPageModel[],
): LandingPageModel[] =>
  promises
    .filter((promise) => promise.status !== 'rejected')
    .map(({ value }) => value);

export default async ({ store, $axios }) => {
  try {
    const { data: selfServiceLandingPageStructure } = await $axios.get(
      `${window.location.origin}/api/self-service/portals`,
    );

    const selfServiceLandingPagePromises = selfServiceLandingPageStructure.map(
      async (id: string) => {
        const [{ data: landingPage }, { data: menus }] = await Promise.all([
          $axios.get(
            `${window.location.origin}/api/self-service/landing-page/${id}`,
          ),
          $axios.get(
            `${window.location.origin}/api/self-service/menu-items/${id}`,
          ),
        ]);
        return {
          ...landingPage,
          menus,
        };
      },
    );

    const selfServiceLandingPage = await Promise.allSettled(
      selfServiceLandingPagePromises,
    );

    const fulfilledSelfServiceLandingPage = mapPromiseSettled(
      selfServiceLandingPage as PromiseSettledLandingPageModel[],
    );

    store.commit('landingPageData', [...fulfilledSelfServiceLandingPage]);
  } catch (_) {
    store.commit('landingPageData', []);
  }
};
