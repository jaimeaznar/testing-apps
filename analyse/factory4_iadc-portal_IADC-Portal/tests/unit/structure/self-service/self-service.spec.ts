import * as cheerio from 'cheerio';
import selfServiceMock from '../../../mocks/self-service.mock.json';
import {
  excludeUnnecessaryRowsFromTableStructure,
  mapHTMLElementToInnerText,
  covertStringToBoolean,
  createConditionalElementType,
  convertStringToArray,
  convertTrHTMLElementToObjectStructureMenuItems,
  groupMenuItemsStructure,
  getTrElementsByContentKey,
  fetchAssetsFromConfluence,
} from '../../../../structure/self-service/self-service';
import { LANDING_PAGE_STRUCTURE_KEY } from '~/structure/self-service/constants';

jest.mock('axios', () => ({
  get: () => ({
    data: 'TEST',
  }),
}));

describe('util/self-service.ts', () => {
  it('getTrElementsByContentKey should be defined', () => {
    expect(getTrElementsByContentKey).toBeDefined();
  });
  it('getTrElementsByContentKey should retrieve TR elements from Table', () => {
    const trElement = getTrElementsByContentKey(
      selfServiceMock,
      cheerio as any,
      LANDING_PAGE_STRUCTURE_KEY,
    );
    expect(trElement).toBeDefined();
    expect(trElement.length > 0).toBe(true);
  });
  it('excludeUnnecessaryRowsFromTableStructure should be defined', () => {
    expect(excludeUnnecessaryRowsFromTableStructure).toBeDefined();
  });
  it('excludeUnnecessaryRowsFromTableStructure should exclude first 5 rows', () => {
    const createHTMLElements = getTrElementsByContentKey(
      selfServiceMock,
      cheerio as any,
      LANDING_PAGE_STRUCTURE_KEY,
    );
    expect(createHTMLElements.length).toBe(19);
    const tableContentHTMLElement = excludeUnnecessaryRowsFromTableStructure(
      getTrElementsByContentKey(
        selfServiceMock,
        cheerio as any,
        LANDING_PAGE_STRUCTURE_KEY,
      ),
      4,
    );
    expect(tableContentHTMLElement.length).toBe(14);
  });
  it('mapHTMLElementToInnerText should be defined', () => {
    expect(mapHTMLElementToInnerText).toBeDefined();
  });
  it('mapHTMLElementToInnerText should trim value', () => {
    const elemenet = document.createElement('div');
    elemenet.innerHTML = ' Test ';
    const cheerio = {
      load: (elemenet: HTMLElement) => ({
        text: () => ({
          trim: () => elemenet.innerHTML.trim(),
        }),
      }),
    };
    expect(mapHTMLElementToInnerText(elemenet, cheerio as any)).toBe('Test');
  });
  it('covertStringToBoolean should be defined', () => {
    expect(covertStringToBoolean).toBeDefined();
  });
  it('covertStringToBoolean should retrieve true', () => {
    const value = covertStringToBoolean('true');
    expect(value).toBe(true);
  });
  it('covertStringToBoolean should retrieve false', () => {
    const value = covertStringToBoolean('false');
    expect(value).toBe(false);
  });
  it('createConditionalElementType should be defined', () => {
    expect(createConditionalElementType).toBeDefined();
  });
  it('createConditionalElementType should retrieve true value based on input', () => {
    expect(createConditionalElementType('test', 'test2')).toBe(true);
  });
  it('createConditionalElementType should retrieve false value based on input', () => {
    expect(createConditionalElementType('test', '')).toBe(false);
  });
  it('convertStringToRestrictedField should be defined', () => {
    expect(convertStringToArray).toBeDefined();
  });
  it('convertStringToRestrictedField should retrieve undefined based on input', () => {
    const value = convertStringToArray('test1,test2', []);
    expect(value).toEqual(['test1', 'test2']);
  });
  it('convertStringToRestrictedField should retrieve value based on default value', () => {
    const value = convertStringToArray('', false);
    expect(value).toBe(false);
  });
  it('convertTrHTMLElementToObjectStructureMenuItems should be defined', () => {
    expect(convertTrHTMLElementToObjectStructureMenuItems).toBeDefined();
  });
  it('groupMenuItemsStructure should be defined', () => {
    expect(groupMenuItemsStructure).toBeDefined();
  });
  it('groupMenuItemsStructure should retrieve final structure', () => {
    const elements = groupMenuItemsStructure([
      { isHeader: true, header: 'IADC' },
      { isDivider: true },
      { isItem: true, title: 'Test 1', group: 'test1', href: '', items: [] },
      { isSubItem: true, title: 'Test 2', href: '/iadc/test' },
    ]);
    expect(elements).toEqual([
      {
        header: 'IADC',
        isHeader: true,
        items: undefined,
      },
      {
        isDivider: true,
        items: undefined,
      },
      {
        group: 'test1',
        href: '',
        isItem: true,
        items: [{ href: '/iadc/test', isSubItem: true, title: 'Test 2' }],
        title: 'Test 1',
      },
    ]);
  });
  it('fetchAssetsFromConfluence should return base64', async () => {
    const response = await fetchAssetsFromConfluence(['http://localhost']);
    expect(response).toEqual(['data:image/png;base64,VEVTVA==']);
  });
});
