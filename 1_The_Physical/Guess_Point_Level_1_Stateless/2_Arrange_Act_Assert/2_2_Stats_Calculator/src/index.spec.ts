import { StatsCalculator } from './index';

describe('stats calculator', () => {
  const firstSequence = [13, 3, 7, 15, 11, 5, 9];
  const secondSequence = [601, 101, 401, 701, 501, 201, 301];
  it('exists', () => {
    expect(StatsCalculator).toBeDefined();
  });

  it('returns an object', () => {
    const result = StatsCalculator.calculateStats([3, 4, 5, 6]);
    expect(typeof result).toBe('object');
  });

  it('returns an object with 4 statistical keys', () => {
    const result = StatsCalculator.calculateStats([1]);
    expect(result).toHaveProperty('minimum');
    expect(result).toHaveProperty('maximum');
    expect(result).toHaveProperty('count');
    expect(result).toHaveProperty('average');
  });

  describe('Calculate minimum value in a sequence', () => {
    it(`knows that 3 is the minimum value in this sequence ${firstSequence}`, () => {
      let result = StatsCalculator.calculateStats(firstSequence);
      expect(result.minimum).toBe(3);
    });

    it(`knows that 101 is the minimum value in this sequence ${secondSequence}`, () => {
      let result = StatsCalculator.calculateStats(secondSequence);
      expect(result.minimum).toBe(101);
    });
  });
});

