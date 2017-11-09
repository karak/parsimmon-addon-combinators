import * as P from 'parsimmon';
import addon from '../src';
addon(P);

describe('endBy1', () => {
  it('should success to parse independent tokens as then()', () => {
    const result = P.string('AB').before(P.string('CD')).parse('ABCD');

    expect(result).toHaveProperty('status', true);
    expect(result).toHaveProperty('value', ['AB', 'CD']);
  });

  it('should success with prefering the latter parser', () => {
    const result = P.regexp(/AB?/).before(P.regexp(/B?C/)).parse('ABC');

    expect(result).toHaveProperty('status', true);
    expect(result).toHaveProperty('value', ['A', 'BC']);
  });

  it('should fail on the former parser because the latter has consumed, and then failed on the latter', () => {
    const result = P.regexp(/AB/).before(P.regexp(/BC/)).parse('ABC');

    expect(result).toHaveProperty('status', false);
    expect(result).toHaveProperty('expected', ["/BC/"]);
    expect(result).toHaveProperty('index.offset', 2);
    expect(result).toHaveProperty('index.line', 1);
    expect(result).toHaveProperty('index.column', 3);
  });

  it('should not fail on the former parser because the latter has failed', () => {
    const action = jest.fn().mockReturnValue(P.makeSuccess(0, ''));
    const result = P(action).before(P.regexp(/ABCD/)).parse('ABC');

    expect(result).toHaveProperty('status', false);
    expect(result).toHaveProperty('expected', ["/ABCD/"]);
    expect(result).toHaveProperty('index.offset', 2);
    expect(result).toHaveProperty('index.line', 1);
    expect(result).toHaveProperty('index.column', 3);
    expect(action).not.toBeCalled();
  });

  it('should fail on appending characters', () => {
    const result = P.string('AB').before(P.string('CD')).parse('ABCDE');

    expect(result).toHaveProperty('status', false);
    expect(result).toHaveProperty('index.offset', 4);
    expect(result).toHaveProperty('index.line', 1);
    expect(result).toHaveProperty('index.column', 5);
  });

  it('should fail on prepending characters', () => {
    const result = P.string('AB').before(P.string('CD')).parse('ZABCD');

    expect(result).toHaveProperty('status', false);
    expect(result).toHaveProperty('index.offset', 4);
    expect(result).toHaveProperty('index.line', 1);
    expect(result).toHaveProperty('index.column', 5);
  });
});
