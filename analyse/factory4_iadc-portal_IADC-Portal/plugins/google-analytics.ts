import {
  userParamsFactory,
  GoogleAnalyticsUser,
  routeParamsFactory,
} from '../middleware/google-analytics';

declare module 'vue/types/vue' {
  interface Vue {
    $pushGTMEventInQueue: Function;
  }
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const googleAnalyticsHeadFactory = (id: string) => {
  const script = document.createElement('script');
  script.innerHTML = `(function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', '${id}');`;
  return script;
};

const googleAnalyticsBodyFactory = (id: string) => {
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${id}`;
  iframe.style.height = '0';
  iframe.style.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'none';
  noscript.appendChild(iframe);
  return noscript;
};

export default (
  { route, env },
  inject: <T>(key: string, handler: T) => void,
) => {
  inject(
    'pushGTMEventInQueue',
    ({ event, user, additionalParameters = {} }) => {
      window.dataLayer.push({
        event,
        ...userParamsFactory(user as GoogleAnalyticsUser),
        ...routeParamsFactory(route),
        ...additionalParameters,
      });
    },
  );

  const head = document.getElementsByTagName('head')[0];
  const body = document.getElementsByTagName('body')[0];

  head.insertBefore(
    googleAnalyticsHeadFactory(env.googleAnalytics.gtmId),
    head.firstElementChild,
  );
  body.insertBefore(
    googleAnalyticsBodyFactory(env.googleAnalytics.gtmId),
    body.firstElementChild,
  );
};
