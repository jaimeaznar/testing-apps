export default (ctx) => {
  return {
    httpEndpoint: ctx.env.whispr.httpEndpoint,
    wsEndpoint: ctx.env.whispr.wsEndpoint,
    getAuth: () => localStorage['auth._token.cognito'],
  };
};
