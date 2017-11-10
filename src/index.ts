import * as P from 'parsimmon';

declare module 'parsimmon' {
  interface Parser<T> {
    many1(): P.Parser<T[]>;
    endBy(): P.Parser<T[]>;
    endBy1(): P.Parser<T[]>;
    manyTill<U>(end: P.Parser<T[]>): P.Parser<T[]>;

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
  p.prototype.endBy = function<T>(sep: P.Parser<T>) {
    return this.skip(sep).many();
  };

  /**
   * similar to `sepBy1` but expect to terminate with the separator.
   *
   * @param {Parsimmon.Parser} sep separator
   */
  p.prototype.endBy1 = function<T>(sep: P.Parser<T>) {
    return this.skip(sep).many1();
  };

  /**
   * parse iteratively till end.Parse() successes.
   *
   * @param {Parsimmon.Parser} end terminator
   */
  p.prototype.manyTill = function<T>(end: P.Parser<T>) {
    if (!P.isParser(end)) throw new Error('end must be a Parser.');

    let scan: P.Parser<T[]>;
    scan =
      end.map(() => []).or(p.seqMap(this as P.Parser<T>, p.lazy(() => scan), (x, xs) => [x].concat(xs)));

    // `this as P.Parser<T>` should be removed after fixing d.ts.  Actually P is a class and P.Parser<T> is P itself.

    // Implemntation by functional style.
    // NOTE: We could have more efficient one with Parsimmon() and mergeReplies(), a private function.

    return scan;
  };
}
