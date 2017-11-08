import * as P from 'parsimmon';

declare module 'parsimmon' {
  interface Parser<T> {
    many1(): P.Parser<T[]>;
  }
}

export default function addon(p: typeof P): void {
  p.prototype.many1 = function<T>() {
    return p.seqMap(this, this.many(), (x: T, xs: T[]) => [x].concat(xs));
  }
}

