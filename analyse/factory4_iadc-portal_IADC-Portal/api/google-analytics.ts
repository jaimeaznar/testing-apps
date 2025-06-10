import express from 'express';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from '@google-analytics/data/build/protos/protos';

const app = express();
app.disable('x-powered-by');
app.use(express.json()); // eslint-disable-line import/no-named-as-default-member
app.use(express.urlencoded({ extended: true })); // eslint-disable-line import/no-named-as-default-member

/**
 * Route to retrieve the google analytics report
 * @name GET /:id/report
 * @return Promise {GetGoogleAnalyticsReport} 'google-analytics' - google analytics report object
 * @param id {string}
 * @param params {GoogleAnalyticsReportParams}
 */
app.get('/:id/report', async (req, res) => {
  const transformQueries = (value: any) =>
    value.split(',').map((name: string) => ({ name }));
  const transformStringify = (value: any) => JSON.parse(value);

  try {
    const googleAnalyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        private_key: process.env.VUE_APP_GOOGLE_ANALYTICS_PRIVATE_KEY,
        client_email: process.env.VUE_APP_GOOGLE_ANALYTICS_CLIENT_EMAIL,
      },
    });

    const {
      params: { id },
      query: { startDate, endDate, metrics, dimensions, dimensionFilter },
    } = req;

    const response = (await googleAnalyticsClient.runReport({
      property: `properties/${id}`,
      dateRanges: [
        {
          startDate,
          endDate,
        } as { startDate: string; endDate: string },
      ],
      metrics: transformQueries(metrics),
      dimensions: transformQueries(dimensions),
      dimensionFilter: transformStringify(dimensionFilter),
    })) as google.analytics.data.v1beta.IRunReportResponse;

    res.json(response[0]);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

export default app;
