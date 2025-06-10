import {
  chartDataDaysFactory,
  chartDataMonthsFactory,
  chartDataWeeksFactory,
  dateRangeFactory,
  labelsFactory,
  mapBasicGoogleAnalyticsStructure,
} from '@/structure/google-analytics/structure';

describe('google-analytics/structure.ts', () => {
  const mockData = [
    {
      dimensionHeaders: [{ name: 'date' }],
      metricHeaders: [{ name: 'activeUsers', type: 'TYPE_INTEGER' }],
      rows: [
        {
          dimensionValues: [{ value: '20230109' }],
          metricValues: [{ value: '380' }],
        },
      ],
    },
  ];
  it('labelsFactory should generate date collection for days', () => {
    const dateRange = dateRangeFactory('days');
    const result = labelsFactory(dateRange, 'days');
    expect(result.length > 0).toBe(true);
  });
  it('labelsFactory should generate date collection for weeks', () => {
    const dateRange = dateRangeFactory('weeks');
    const result = labelsFactory(dateRange, 'weeks');
    expect(result.length > 0).toBe(true);
  });
  it('labelsFactory should generate date collection for months', () => {
    const dateRange = dateRangeFactory('months');
    const result = labelsFactory(dateRange, 'months');
    expect(result.length > 0).toBe(true);
  });

  it('chartDataWeeks should generate data collection for weeks', () => {
    const dateRange = dateRangeFactory('weeks');
    const mappedData = mapBasicGoogleAnalyticsStructure({
      ...mockData[0],
      dimensions: 'week,year',
      name: 'Example',
    });
    const result = chartDataWeeksFactory(dateRange, mappedData);
    expect(result.length > 0).toBe(true);
  });
  it('chartDataWeeks should generate data collection for days', () => {
    const dateRange = dateRangeFactory('days');
    const mappedData = mapBasicGoogleAnalyticsStructure({
      ...mockData[0],
      dimensions: 'date',
      name: 'Example',
    });
    const result = chartDataDaysFactory(dateRange, mappedData);
    expect(result.length > 0).toBe(true);
  });
  it('chartDataWeeks should generate data collection for months', () => {
    const dateRange = dateRangeFactory('months');
    const mappedData = mapBasicGoogleAnalyticsStructure({
      ...mockData[0],
      dimensions: 'month,year',
      name: 'Example',
    });
    const result = chartDataMonthsFactory(dateRange, mappedData);
    expect(result.length > 0).toBe(true);
  });
});
