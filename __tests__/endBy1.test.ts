import * as P from 'parsimmon';
import '../src';

describe('endBy1', () => {
  const p = P.string('A').endBy1(P.string(';'));

  it('should fail to parse empty tokens', () => {
    expect(p.parse('')).toHaveProperty('status', false);
  });

  it('should success to parse 1 or more tokens', () => {
    for (let i = 1; i < 5; i += 1) {
      const xs = new Array(i).fill('A', 0, i);
      const result = p.parse(xs.join(';') + ';');

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
