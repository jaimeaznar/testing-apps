/* eslint-disable space-before-function-paren */
/* eslint-disable operator-linebreak */
/* eslint-disable wrap-iife */
/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable no-unused-expressions */
if (process.env.instana) {
  (function (s, t, a, n) {
    s[t] ||
      ((s[t] = a),
      (n = s[a] =
        function () {
          n.q.push(arguments);
        }),
      (n.q = []),
      (n.v = 2),
      (n.l = 1 * new Date().valueOf()));
  })(window, 'InstanaEumObject', 'ineum');

  window.ineum('reportingUrl', 'https://eum-green-saas.instana.io');
  window.ineum('key', process.env.instana);
  window.ineum('trackSessions');
}
