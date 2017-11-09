import * as P from 'parsimmon';

declare module 'parsimmon' {
  interface Parser<T> {
    many1(): P.Parser<T[]>;
    endBy(): P.Parser<T[]>;
    endBy1(): P.Parser<T[]>;
    before<U>(): P.Parser<[T, U]>;

    /**
     * Stored action that passed to `Parsimmon()`
     *
     * @private
     */
    _: (input: string, i: number) => P.Reply<T>;
  }
}

export default function addon(p: typeof P): void {
  /**
   * equivalent to `atLeast(1)`
   */
  p.prototype.many1 = function<T>() {
    return p.seqMap(this, this.many(), (x: T, xs: T[]) => [x].concat(xs));
  }

  /**
   * similar to `sepBy` but expect to terminate with the separator.
   *
   * @param {Parsimmon.Parser} sep separator
   */
  P.prototype.endBy = function<T>(sep: P.Parser<T>) {
    return this.skip(sep).many();
  };

  /**
   * similar to `sepBy1` but expect to terminate with the separator.
   *
   * @param {Parsimmon.Parser} sep separator
   */
  P.prototype.endBy1 = function<T>(sep: P.Parser<T>) {
    return this.skip(sep).many1();
  };

  /**
   * `a.before(b)` similar to `seq(a, b)` but prefer `b` being greedy.
   *
   * NOTE: seq/then doesn't backtrack unless greedy this.parse() fails.
   *
   * @param {Parsimmon.Parser} otherParser following parser
   */
  P.prototype.before = function<T, U>(otherParser: P.Parser<U>): P.Parser<[T, U]> {
    return P((input, i) => {
      let last: FurthestTuple = {
        furthest: -1,
        expected: `${this} before ${otherParser}`,
      };
      for (let j = i; j < input.length; j += 1) {
        const result2 = otherParser._(input, j); // TODO: this called many times with varying (i, j).
        if (!result2.status) {
          last = updateFurthest(last, {
            furthest: result2.furthest + i,
            expected: result2.expected[0],
          });
          continue;
        }
        const result1 = this._(input.substring(0, j), i);
        if (!result1.status) {
          last = updateFurthest(last, {
            furthest: result1.furthest + i,
            expected: result1.expected[0],
          });
          continue;
        }
        // Success
        return P.makeSuccess<[T, U]>(result2.index, [result1.value, result2.value]);
      }

      // NOTE: This could be better by private function `mergeReplies()`
      return P.makeFailure(last.furthest, last.expected);
    });
  };
}

interface FurthestTuple {
  furthest: number,
  expected: string,
}

function updateFurthest(current: FurthestTuple, next: FurthestTuple) {
  return (next.furthest > current.furthest) ? next : current;
}
