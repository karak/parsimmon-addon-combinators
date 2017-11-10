/// <reference types="parsimmon" />

declare module 'parsimmon' {
  interface Parser<T> {
    many1(): Parsimmon.Parser<T[]>;
    endBy(): Parsimmon.Parser<T[]>;
    endBy1(): Parsimmon.Parser<T[]>;
    manyTill<U>(end: Parsimmon.Parser<T[]>): Parsimmon.Parser<T[]>;

    /**
     * Stored action that passed to `Parsimmon()`
     *
     * @private
     */
    _: (input: string, i: number) => Parsimmon.Reply<T>;
  }
}

export default function addon(p: typeof Parsimmon): void {
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
  p.prototype.endBy = function<T>(sep: Parsimmon.Parser<T>) {
    return this.skip(sep).many();
  };

  /**
   * similar to `sepBy1` but expect to terminate with the separator.
   *
   * @param {Parsimmon.Parser} sep separator
   */
  p.prototype.endBy1 = function<T>(sep: Parsimmon.Parser<T>) {
    return this.skip(sep).many1();
  };

  /**
   * parse iteratively till end.Parse() successes.
   *
   * @param {Parsimmon.Parser} end terminator
   */
  p.prototype.manyTill = function<T>(end: Parsimmon.Parser<T>) {
    if (!p.isParser(end)) throw new Error('end must be a Parser.');

    let scan: Parsimmon.Parser<T[]>;
    scan =
      end.map(() => []).or(p.seqMap(this as Parsimmon.Parser<T>, p.lazy(() => scan), (x, xs) => [x].concat(xs)));

    // `this as P.Parser<T>` should be removed after fixing d.ts.  Actually P is a class and P.Parser<T> is P itself.

    // Implemntation by functional style.
    // NOTE: We could have more efficient one with Parsimmon() and mergeReplies(), a private function.

    return scan;
  };
}
