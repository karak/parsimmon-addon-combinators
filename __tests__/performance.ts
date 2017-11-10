import * as P from 'parsimmon';
import * as Benchmark from 'benchmark';
import '../src';

describe('performance', () => {
  const TIMEOUT_MILLISECONDS = 20000;

  const suite = new Benchmark.Suite('manyTill');
  const xByComma = P.sepBy(P.string('x'), P.string(','));
  const xBySemicolon = P.string('x').endBy(P.string(';'));
  const xTillPeriod = P.string('x').manyTill(P.string('.'));

  it ('Both of endBy and manyTill shoul not much slower than sepBy', () => {
    suite
      .on('cycle', function(event) {
        console.log(String(event.target));
      })
      .add('sep "x" by ","', () => {
        xByComma.parse('x,x,x');
      })
      .add('end "x" by ";"', () => {
        xByComma.parse('x;x;x');
      })
      .add('many "x" till "."', () => {
        xTillPeriod.parse('xxx.');
      })
      .run({
        maxTime: TIMEOUT_MILLISECONDS * 0.5 * 0.001 /* sec */,
      });

    const means = suite.map(x => x.stats.mean);

    expect(means[1] / means[0]).toBeLessThan(1.5);

    expect(means[2] / means[0]).toBeLessThan(1.75);

  }, TIMEOUT_MILLISECONDS);
});
