# rttc
Runtime type-checking for JavaScript.

## Installation

```sh
$ npm install rttc --save
```


## Rules


#### General

+ `null` is never allowed.
+ `NaN` is never allowed.
+ `Infinity` is never allowed.
+ `-Infinity` is never allowed.



## Legacy Usage

The usage of this module is changing, but backwards compatibility will be maintained up until the first major version bump (v1.0.0).
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
