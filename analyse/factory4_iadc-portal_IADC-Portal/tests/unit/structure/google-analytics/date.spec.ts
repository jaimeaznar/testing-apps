import {
  getDatesBetweenRange,
  getWeeksBetweenRange,
  subtractDate,
  getMonthsBetween,
  fillSingleNumberInDate,
  getDateOfWeek,
} from '@/structure/google-analytics/date';

describe('google-analytics/date.ts', () => {
  it('getDatesBetweenRange should generate date collection', () => {
    const result = getDatesBetweenRange(
      new Date('2023-05-07'),
      new Date('2023-05-02'),
    );
    expect(result.length > 0).toBe(true);
  });
  it('getDatesBetweenRange should not generate date collection', () => {
    const result = getDatesBetweenRange(
      new Date('2023-05-02'),
      new Date('2023-05-07'),
    );
    expect(result.length > 0).toBe(false);
  });

  it('getWeeksBetweenRange should generate date collection', () => {
    const result = getWeeksBetweenRange(
      new Date('2023-05-07'),
      new Date('2023-05-02'),
    );
    expect(result.length > 0).toBe(true);
  });
  it('getWeeksBetweenRange should not generate date collection', () => {
    const result = getWeeksBetweenRange(
      new Date('2023-05-02'),
      new Date('2023-05-07'),
    );
    expect(result.length > 0).toBe(false);
  });

  it('subtractDate should subtract date', () => {
    const result = subtractDate(new Date('2023-05-02'), 1);
    expect(result < new Date('2023-05-02')).toBe(true);
  });
  it('subtractDate should not subtract date', () => {
    const result = subtractDate(new Date('2023-05-02'), -1);
    expect(result < new Date('2023-05-02')).toBe(false);
  });

  it('getMonthsBetween should generate date collection', () => {
    const result = getMonthsBetween(
      new Date('2023-05-02'),
      new Date('2023-05-04'),
    );
    expect(result.length > 0).toBe(true);
  });

  it('fillSingleNumberInDate should not update value', () => {
    const result = fillSingleNumberInDate(21);
    expect(result).toBe('21');
  });

  it('fillSingleNumberInDate should update value', () => {
    const result = fillSingleNumberInDate(9);
    expect(result).toBe(`09`);
  });

  it('getDateOfWeek should generate date based on week value', () => {
    const result = getDateOfWeek(2023, 15);
    expect(result).toBeDefined();
  });
});
