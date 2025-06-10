import {
  subtractDate,
  getDatesBetweenRange,
  getWeeksBetweenRange,
  getMonthsBetween,
  getDateOfWeek,
  fillSingleNumberInDate,
} from './date';

export const dateRangeFactory = (key: string) => {
  const startDate = new Date();
  const endDate = subtractDate(new Date(), 365);

  const mapping = {
    days: () => getDatesBetweenRange(startDate, endDate),
    weeks: () => getWeeksBetweenRange(startDate, endDate),
    months: () => getMonthsBetween(endDate, startDate),
  };
  return mapping[key]();
};

export const labelsFactory = (dateRange: string[], key: string) => {
  const mapping = {
    days: () => dateRange,
    weeks: () => dateRange.map((dateCollection) => dateCollection[0]),
    months: () => dateRange,
  };
  return mapping[key]();
};

const googleAnalyticsObjectFactory = (date: string) => ({
  dateNumber: date,
  value: 0,
});

const replaceDateFormat = (date: string[]) => {
  const regex = /-/g;
  return date.map((value) => value.replace(regex, ''));
};

const dateNumberFactory = (
  dimensionsObject: { value: string }[],
  name: string,
  dimensions: string,
) => {
  if (name === 'Users') {
    if (dimensions === 'month,year') {
      return `${dimensionsObject[1].value}${dimensionsObject[0].value}01`;
    } else if (dimensions === 'week,year') {
      const date = getDateOfWeek(
        Number(dimensionsObject[0].value),
        Number(dimensionsObject[1].value),
      );
      return `${date.getFullYear()}${fillSingleNumberInDate(
        date.getMonth() + 1,
      )}${fillSingleNumberInDate(date.getDate())}`;
    }
    return dimensionsObject[0].value;
  }
  return dimensionsObject[0].value;
};

export const mapBasicGoogleAnalyticsStructure = (data: {
  rows: any[];
  name: string;
  dimensions: string;
}) => {
  return data.rows.map((object: any) => ({
    dateNumber: dateNumberFactory(
      object.dimensionValues,
      data.name,
      data.dimensions,
    ),
    value: object.metricValues.reduce(
      (acc, { value }) => (acc += Number(value)),
      0,
    ),
  }));
};

const googleAnalyticsObjectPeriodFactory = (
  collection: any[],
  date: string,
) => {
  const calculatedValue = collection.reduce((acc, object) => {
    acc += Number(object.value);
    return acc;
  }, 0);
  return {
    dateNumber: date,
    value: calculatedValue,
  };
};

export const chartDataDaysFactory = (dateRange: string[], data: any) => {
  const modifiedDateRangeAsValue = replaceDateFormat(dateRange);
  return modifiedDateRangeAsValue.map((date) => {
    const foundCollection = data.filter(
      ({ dateNumber }) => dateNumber === date,
    );
    if (foundCollection.length > 0) {
      return googleAnalyticsObjectPeriodFactory(foundCollection, date);
    }
    return googleAnalyticsObjectFactory(date);
  });
};

export const chartDataWeeksFactory = (dateRange: [string][], data: any) =>
  dateRange.map((weekData) => {
    const mapWeekDataToFindCollection = replaceDateFormat(weekData);
    const foundCollection = data.filter(({ dateNumber }) =>
      mapWeekDataToFindCollection.includes(dateNumber),
    );
    if (foundCollection.length > 0) {
      return googleAnalyticsObjectPeriodFactory(
        foundCollection,
        mapWeekDataToFindCollection[0],
      );
    }
    return googleAnalyticsObjectFactory(mapWeekDataToFindCollection[0]);
  });

export const chartDataMonthsFactory = (dateRange: string[], data: any) => {
  const mapMonthDataToFindCollection = replaceDateFormat(dateRange);
  return mapMonthDataToFindCollection.reduce((acc, date) => {
    const foundCollection = data.filter(
      ({ dateNumber }) => date === dateNumber.slice(0, -2),
    );
    if (foundCollection.length > 0) {
      acc.push(googleAnalyticsObjectPeriodFactory(foundCollection, date));
    } else {
      acc.push(googleAnalyticsObjectFactory(date));
    }
    return acc;
  }, [] as any);
};

export const dataFactory = (
  dateRange: string[] | [string][],
  key: string,
  payload: any[],
) => {
  return payload.map((data) => {
    const mappedData = mapBasicGoogleAnalyticsStructure(data);

    const mapping = {
      days: () => chartDataDaysFactory(dateRange as string[], mappedData),
      weeks: () => chartDataWeeksFactory(dateRange as [string][], mappedData),
      months: () => chartDataMonthsFactory(dateRange as string[], mappedData),
    };
    return {
      name: data.name,
      data: mapping[key]().map(({ value }) => value),
    };
  });
};
