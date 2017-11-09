import * as P from 'parsimmon';
import addon from '../src';
addon(P);

describe('endBy1', () => {
  const p = P.string('A').endBy(P.string(';'));

  it('should success to parse empty or more tokens', () => {
    for (let i = 0; i < 5; i += 1) {
      const xs = new Array(i).fill('A', 0, i);
      const result = p.parse(xs.join('').replace(/A/g, 'A;'));

      expect(result).toHaveProperty('status', true);
      expect(result).toHaveProperty('value', xs);
    }
  });

  it('should fail to parse 1 or more tokens without the last terminator', () => {
    for (let i = 1; i < 5; i += 1) {
      const xs = new Array(i).fill('A', 0, i);
      const result = p.parse(xs.join(';'));

      expect(result).toHaveProperty('status', false);
      expect(result).toHaveProperty('index.offset', 2 * i - 1);
      expect(result).toHaveProperty('expected', ["';'"]);
    }
  });
});
