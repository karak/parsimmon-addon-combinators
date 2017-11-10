import * as P from 'parsimmon';
import '../src';

describe('manyTill', () => {
  const end = P.string('.');
  const x = P.string('x');
  const any = P.any;
  const anyString = any.many();

  it('should success to be terminator', () => {
    const result = x.manyTill(end).parse('xxx.');

    expect(result).toHaveProperty('status', true);
    expect(result).toHaveProperty('value', ['x', 'x', 'x']);
  });

  it('should prefer terminator', () => {
    const result = any.manyTill(end).parse('xxx.');

    expect(result).toHaveProperty('status', true);
    expect(result).toHaveProperty('value', ['x', 'x', 'x']);
  });

  it('should stop at first terminator', () => {
    const result = any.manyTill(end).skip(anyString).parse('xxx.yy.z.');

    expect(result).toHaveProperty('status', true);
    expect(result).toHaveProperty('value', ['x', 'x', 'x']);
  });

  it('should check arguments', () => {
    expect(() => any.manyTill(<any>'x')).toThrowError('end must be a Parser');
  })
});
