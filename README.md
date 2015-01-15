# rttc
Runtime (recursive) type-checking for JavaScript.

## Installation

```sh
$ npm install rttc --save
```

```js
var rttc = require('rttc');
```



## Philosophy

#### General

+ `null` is never allowed.
+ `NaN` is never allowed.
+ `Infinity` is never allowed.
+ `-Infinity` is never allowed.

#### Coercion vs. Validation

+ `.validate()` either returns a (potentially "lightly" coerced) version of the value that was accepted, or it throws.  The "lightly" coerced value might turn `"3"` into `3`, `"true"` into `true`, `-4.5` into `"-4.5"`, etc.
+ `.coerce()` ALWAYS returns an acceptable version of the value, even if it has to mangle it to get there.

#### Dictionaries

+ Dictionaries (i.e. plain old JavaScript objects) in type schemas can be infinitely nested.  Type validation and coercion will proceed through the nested objects recursively.

```js
{
  id: 'number',
  name: 'string',
  isAdmin: 'boolean',
  mom: {
    id: 'number',
    name: 'string',
    occupation: {
      title: 'string',
      workplace: 'string'
    }
  }
}
```

#### Arrays

+ Arrays in type schemas must be homogeneous and have exactly one item; that is, if you want to validate an array, you only need to provide the type/schema for the first item in the array, e.g.:

```js
[
  {
    id: 'number',
    name: 'string',
    email: 'string',
    age: 'number',
    isAdmin: 'boolean',
    favoriteColors: ['string'],
    friends: [
      {
        id: 'number',
        name: 'string'
      }
    ]
  }
]
```



## Usage

#### rttc.infer(value)

Infer the type/schema of the provided value.

```js
require('rttc').infer(false);
// => 'boolean'
```

```js
require('rttc').infer(0);
// => 'number'
```

```js
require('rttc').infer({
  foo: 'bar'
});
// => { foo: 'string' }
```

```js
require('rttc').infer({
  foo: 'whatever',
  bar: { baz: true }
});
// => { foo: 'string', bar: { baz: 'boolean' } }
```

```js
require('rttc').infer([{
  foo: ['bar']
}]);
// => [{ foo: ['string'] }]
```

```js
require('rttc').infer({
  user: {
    friends: [{
      name: 'Lenny',
      age: 77
    }]
});
// =>
/*
{
  user: {
    friends: [{
      name: 'Lenny',
      age: 77
    }]
}
*/
```



#### `.validate(expected, actual)`

```js
rttc.validate('string', 'foo');
// => 'foo'

rttc.validate('number', 4.5);
// => 4.5

rttc.validate('boolean', true);
// => true

rttc.validate('string', -2);
// => '-2'

rttc.validate('string', false);
// => 'false'

rttc.validate('number', '3');
// => 3

rttc.validate('boolean', 'true');
// => true

rttc.validate({
  user: {
    friends: [{
      name: 'Lenny',
      age: 77
    }]
}, {
  user: {
    friends: [{
      name: 'Lenny',
      age: '77'
    }]
  }
});
// =>
/*
{
  user: {
    friends: [{
      name: 'Lenny',
      age: 77
    }]
  }
}
 */
```

If value cannot be properly coerced, throws error with code=`E_INVALID_TYPE`:

```js
rttc.validate('number', 'asdf');
// throws E_INVALID_TYPE
```

#### `.coerce(expected, actual)`


```js
rttc.coerce('string', 'foo');
// => 'foo'

rttc.coerce('number', 4.5);
// => 4.5

rttc.coerce('boolean', true);
// => true

rttc.coerce('string', -2);
// => '-2'

rttc.coerce('string', false);
// => 'false'

rttc.coerce('number', '3');
// => 3

rttc.coerce('boolean', 'true');
// => true
```

If value cannot be properly coerced, defaults to base type:
```
rttc.coerce('number', 'asdf');
// => 0

rttc.coerce('boolean', 'asdf');
// => false

rttc.coerce({
  user: {
    friends: [{
      name: 'Lenny',
      age: 77
    }]
}, 'err... some dude who\'s friends with lenny?');
// =>
/*
{
  user: {
    friends: [{
      name: 'Lenny',
      age: 77
    }]
  }
}
 */
```




## Legacy Usage

The usage of this module has been extended considerably, but backwards compatibility will be maintained up until the first major version bump (v1.0.0).
See tests for more details.

#### rttc.rttc(expectations, inputValues, [options])

Validate and/or coerce a set of input values against a set of expectations (defined as input definitions.)

Two options may be provided:
+ `coerce` - before failing, attempt to coerce not-quite-right input values to their expected type.
+ `base` - if an input value is missing, fill in its place in the result to the "base type" (falsy value)

```js
require('rttc').rttc({
  foo: {
    type: 'string',
    required: true
  },
  bar: {
    type: { baz: {name: 'string'} },
    required: false
  }
}, {
  foo: 'hi',
  bar: {
    baz: {
      name: 'Rick'
    }
  }
});
```


#### rttc.types

```js
require('rttc').types;

// =>
/*

{ nan: { is: [Function: isNaN], to: [Function] },
  null: { is: [Function: isNull], to: [Function] },
  undefined:
   { is: [Function: isUndefined],
     to: [Function] },
  bool:
   { is: [Function: isBoolean],
     to: [Function],
     base: false },
  defined: { is: [Function], to: [Function] },
  int:
   { is: [Function],
     to: [Function],
     base: 0 },
  str:
   { is: [Function: isString],
     to: [Function],
     base: '' },
  obj: { is: [Function], to: [Function], base: {} },
  arr:
   { is: [Function: isArray],
     to: [Function],
     base: [] },
  date:
   { is: [Function: isDate],
     to: [Function],
     base: Tue Jan 13 2015 08:58:29 GMT-0800 (PST) },
  number:
   { is: [Function],
     to: [Function],
     base: 0 },
  url:
   { is: [Function: isString],
     to: [Function],
     base: '' },
  email:
   { is: [Function: isString],
     to: [Function],
     base: '' },
  string:
   { is: [Function: isString],
     to: [Function],
     base: '' },
  boolean:
   { is: [Function: isBoolean],
     to: [Function],
     base: false },
  integer:
   { is: [Function],
     to: [Function],
     base: 0 },
  float:
   { is: [Function],
     to: [Function],
     base: 0 } }
*/
```
