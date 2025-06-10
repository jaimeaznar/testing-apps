import axios from 'axios';

interface Cheerio {
  load: (element: HTMLElement | string) => any;
}

export const getTrElementsByContentKey = (
  data: {
    body: {
      view: { value: string };
    };
  },
  cheerio: Cheerio,
  key: string,
): HTMLElement[] => {
  const $ = cheerio.load(data.body.view.value);
  return Array.from($(`tbody:contains('${key}')`).find('tr').get());
};

export const excludeUnnecessaryRowsFromTableStructure = (
  array: HTMLElement[],
  value: number,
) => array.filter((_, index) => index > value);

export const mapHTMLElementToInnerText = (
  element: HTMLElement,
  cheerio: Cheerio,
) => cheerio.load(element).text().trim();

export const covertStringToBoolean = (value: string) =>
  value.toLowerCase() === 'true';

export const createConditionalElementType = (...values: string[]) =>
  values.every((value) => value.length > 0);

export const convertStringToArray = (
  value: string,
  defaultValue: boolean | string[],
) => (value && value.length > 0 ? value.split(',') : defaultValue);

export const fetchAssetsFromConfluence = async (assets: string[]) => {
  try {
    const assetsPromises = assets.map(async (asset) => {
      try {
        const { data } = await axios.get(asset, {
          responseType: 'arraybuffer',
          auth: {
            username: process.env.VUE_APP_CONFLUENCE_API_USERNAME || '',
            password: process.env.VUE_APP_CONFLUENCE_API_TOKEN || '',
          },
          proxy: false,
        });
        return `data:image/png;base64,${Buffer.from(data, 'binary').toString(
          'base64',
        )}`;
      } catch (error) {
        /* eslint-disable no-console */
        console.error(`Error fetching asset ${asset}:`, error);
        return null;
      }
    });

    return await Promise.all(assetsPromises);
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Unexpected error:', error);
    throw error;
  }
};

export const convertTrHTMLElementToObjectStructureMenuItems =
  (cheerio: Cheerio) => (trElement: HTMLElement) => {
    const $ = cheerio.load(trElement);
    const valuesAsText = $('td').map((_, element: HTMLElement) =>
      mapHTMLElementToInnerText(element, cheerio),
    );

    const [
      divider,
      header,
      title,
      group,
      icon,
      target,
      href,
      disabled,
      restrictedTo,
      visibleToAnonymous,
      subTitle,
      subTarget,
      subHref,
      subBadge,
      subDisabled,
    ] = valuesAsText;

    if (createConditionalElementType(subTitle, subHref)) {
      return {
        title: subTitle,
        target: subTarget,
        href: subHref,
        badge: subBadge,
        disabled: covertStringToBoolean(subDisabled),
        isSubItem: true,
      };
    } else if (createConditionalElementType(title, group)) {
      return {
        title,
        group,
        icon,
        target,
        href,
        disabled: covertStringToBoolean(disabled),
        restrictedTo: convertStringToArray(restrictedTo, false),
        visibleToAnonymous: covertStringToBoolean(visibleToAnonymous),
        isItem: true,
        items: [],
      };
    } else if (createConditionalElementType(header)) {
      return {
        header,
        isHeader: true,
      };
    } else if (createConditionalElementType(divider)) {
      return {
        divider: covertStringToBoolean(divider),
        isDivider: true,
      };
    }
  };

export const convertTrHTMLElementToObjectStructureLandingPage =
  (cheerio: Cheerio, id: string) => async (trElement: HTMLElement) => {
    const $ = cheerio.load(trElement);
    const valuesAsText = $('td').map((_, element: HTMLElement) => {
      const value = mapHTMLElementToInnerText(element, cheerio);
      if (!value) {
        const cheerioElement = cheerio.load(element);
        const existIamge = cheerioElement('img')['0'];
        if (existIamge) {
          return existIamge.attribs.src;
        }
        return '';
      }
      return value;
    });

    const [
      title,
      responsible,
      description,
      img,
      logo,
      icon,
      targetUrl,
      glisten,
      disabled,
      search,
      spaceKeys,
      spaceTitles,
      homepageId,
    ] = valuesAsText;

    const [imageAsset, logoAsset, iconAsset] = await fetchAssetsFromConfluence([
      img,
      logo,
      icon,
    ]);

    return {
      title,
      responsible,
      description,
      img: imageAsset,
      logo: logoAsset,
      icon: iconAsset,
      targetUrl,
      glisten: covertStringToBoolean(glisten),
      disabled: covertStringToBoolean(disabled),
      search: covertStringToBoolean(search),
      spaceKeys: convertStringToArray(spaceKeys, []),
      spaceTitles: convertStringToArray(spaceTitles, []),
      structurePageId: id,
      homepageId,
    };
  };

export const groupMenuItemsStructure = (structure: any[]) => {
  const groupedStructure = structure.filter(Boolean).reduce((acc, value) => {
    if (value.isDivider || value.isHeader || value.isItem) {
      acc.push(value);
    } else if (value.isSubItem) {
      acc[acc.length - 1].items.push(value);
    }
    return acc;
  }, [] as any[]);

  return groupedStructure.map((element) => ({
    ...element,
    items: element.items?.length > 0 ? element.items : undefined,
  }));
};
