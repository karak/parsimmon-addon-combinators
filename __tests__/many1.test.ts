import * as P from 'parsimmon';
import addon from '../src';
addon(P);

describe('many1', () => {
  it('should fail to parse empty tokens', () => {
    expect(P.string('x').parse('')).toHaveProperty('status', false);
  });

  it('should success to parse 1 or more tokens', () => {
    for (let i = 1; i < 5; i += 1) {
      const xs = new Array(i).fill('x', 0, i);
      const result = P.string('x').many1().parse(xs.join(''));

      expect(result).toHaveProperty('status', true);
      expect(result).toHaveProperty('value', xs);
    }
  });

});
