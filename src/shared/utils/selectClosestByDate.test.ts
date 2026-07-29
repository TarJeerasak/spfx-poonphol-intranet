import { selectClosestByDate } from './selectClosestByDate';

const NOW = new Date(2026, 6, 24).getTime();

interface Sample {
  id: number;
  date?: string;
}

describe('selectClosestByDate', () => {
  it('orders items by how close their date is to now, nearest first', () => {
    const items: Sample[] = [
      { id: 1, date: '2026-05-01T00:00:00Z' },
      { id: 2, date: '2026-07-24T00:00:00Z' },
      { id: 3, date: '2026-08-10T00:00:00Z' }
    ];

    const result = selectClosestByDate(items, item => item.date, NOW, 3);

    expect(result.map(item => item.id)).toEqual([2, 3, 1]);
  });

  it('limits the result to maxCount items', () => {
    const items: Sample[] = [
      { id: 1, date: '2026-07-24T00:00:00Z' },
      { id: 2, date: '2026-07-23T00:00:00Z' },
      { id: 3, date: '2026-07-22T00:00:00Z' }
    ];

    const result = selectClosestByDate(items, item => item.date, NOW, 2);

    expect(result).toHaveLength(2);
  });

  it('pushes items without a date to the end', () => {
    const items: Sample[] = [{ id: 1 }, { id: 2, date: '2026-07-24T00:00:00Z' }];

    const result = selectClosestByDate(items, item => item.date, NOW, 2);

    expect(result.map(item => item.id)).toEqual([2, 1]);
  });
});
