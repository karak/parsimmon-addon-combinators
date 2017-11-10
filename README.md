Parsimmon Combinators Add-on ![Build Status](https://travis-ci.org/karak/parsimmon-addon-combinators.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/karak/parsimmon-addon-combinators/badge.svg?branch=master)](https://coveralls.io/github/karak/parsimmon-addon-combinators?branch=master)
==========================

An extension module to `Parsimmon` to add Parsec-like combinators.

API
----

This introduces following combinators:

* endBy
* endBy1
* many1
* manyTill

Usage
-----

Install via `npm` or `yarn`.

```bash
npm install parsimmon-addon-combinators
```

Then, import and wrap at the top of your code.

```javascript
import * as P from 'parsimmon';
import addon from 'parsimmon-addon-combinators';
addon(P);

P.any.endBy1(P.string(';')).parse('a;b;c;');
```
