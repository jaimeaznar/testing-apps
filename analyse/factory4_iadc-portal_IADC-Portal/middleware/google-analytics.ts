import { SHA3 } from 'sha3';

export interface GoogleAnalyticsUser {
  identities: string;
  address: string;
}

export const userParamsFactory = (user: GoogleAnalyticsUser) => ({
  user_id: hash(JSON.parse(user.identities)[0].userId),
  user_site: user.address,
});

export const routePathName = () => {
  const pathname = window.location.pathname;
  const [, path] = pathname.split('/');
  return path || 'index';
};

export const routeParamsFactory = (store: {
  state: { targetUrl: string };
}) => ({
  portal_name: store?.state?.targetUrl || routePathName(),
});

const googleAnalytics = ({ $auth, store }) => {
  const user = $auth.$state.user;
  if (user) {
    window.dataLayer.push({
      event: 'page_view',
      ...userParamsFactory(user),
      ...routeParamsFactory(store),
    });
  }
};

export const hash = (value: string) => {
  const hash = new SHA3(512);
  hash.update(value);
  const hashArray = Array.from(new Uint8Array(hash.digest()));
  return hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
};

export default googleAnalytics;
