import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  getTrElementsByContentKey,
  groupMenuItemsStructure,
  excludeUnnecessaryRowsFromTableStructure,
  convertTrHTMLElementToObjectStructureMenuItems,
  convertTrHTMLElementToObjectStructureLandingPage,
} from '../structure/self-service/self-service';
import {
  LANDING_PAGE_STRUCTURE_KEY,
  MENU_ITEMS_STRUCTURE_KEY,
} from '../structure/self-service/constants';

const app = express();
app.disable('x-powered-by');
app.use(express.json()); // eslint-disable-line import/no-named-as-default-member
app.use(express.urlencoded({ extended: true })); // eslint-disable-line import/no-named-as-default-member

interface Cheerio {
  load: (element: HTMLElement | string) => any;
}

/**
 * Route to retrieve the self-service portals
 * @name GET /portals
 */
app.get('/portals', async (_, res) => {
  try {
    const maxResult = 100;

    const { data } = await axios.get(
      `${process.env.VUE_APP_CONFLUENCE_BASE_URL}/wiki/rest/api/content/search?cql=parent=${process.env.VUE_APP_SELF_SERVICE_STRUCTURE_PAGE_ID}`,
      {
        params: {
          limit: maxResult,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: process.env.VUE_APP_CONFLUENCE_API_USERNAME ?? '',
          password: process.env.VUE_APP_CONFLUENCE_API_TOKEN ?? '',
        },
      },
    );

    const ids = data.results.map(({ id }) => id);

    res.json(ids);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

/**
 * Route to retrieve the portal menu items
 * @name GET /menu-items/:id
 * @param id {string}
 */
app.get('/menu-items/:id', async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const { data } = await axios.get(
      `${process.env.VUE_APP_CONFLUENCE_BASE_URL}/wiki/api/v2/pages/${id}`,
      {
        params: {
          'body-format': 'view',
        },
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: process.env.VUE_APP_CONFLUENCE_API_USERNAME ?? '',
          password: process.env.VUE_APP_CONFLUENCE_API_TOKEN ?? '',
        },
      },
    );

    const tableContentHTMLElement = excludeUnnecessaryRowsFromTableStructure(
      getTrElementsByContentKey(
        data as {
          body: {
            view: { value: string };
          };
        },
        cheerio as Cheerio,
        MENU_ITEMS_STRUCTURE_KEY,
      ),
      3,
    );
    const convertedStructure = tableContentHTMLElement.map(
      convertTrHTMLElementToObjectStructureMenuItems(cheerio as Cheerio),
    );
    res.json(groupMenuItemsStructure(convertedStructure));
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

/**
 * Route to retrieve the portal landing page data
 * @name GET /landing-page/:id
 * @param id {string}
 */
app.get('/landing-page/:id', async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const { data } = await axios.get(
      `${process.env.VUE_APP_CONFLUENCE_BASE_URL}/wiki/api/v2/pages/${id}`,
      {
        params: {
          'body-format': 'view',
        },
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: process.env.VUE_APP_CONFLUENCE_API_USERNAME ?? '',
          password: process.env.VUE_APP_CONFLUENCE_API_TOKEN ?? '',
        },
      },
    );

    const tableContentHTMLElement = excludeUnnecessaryRowsFromTableStructure(
      getTrElementsByContentKey(
        data as {
          body: {
            view: { value: string };
          };
        },
        cheerio as Cheerio,
        LANDING_PAGE_STRUCTURE_KEY,
      ),
      1,
    );
    const convertedStructurePromises = tableContentHTMLElement.map(
      await convertTrHTMLElementToObjectStructureLandingPage(
        cheerio as Cheerio,
        id,
      ),
    );
    const convertedStructure = await Promise.all(convertedStructurePromises);
    res.json(convertedStructure[0]);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

export default app;
