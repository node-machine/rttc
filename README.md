# rttc
Runtime (recursive) type-checking for JavaScript.

## Installation

```sh
$ npm install rttc --save
```


## Quick Start

```js
var rttc = require('rttc');

rttc.coerce({ firstName: 'string'}, {firstName: 45});
// => { firstName: "45" }

rttc.coerce({ firstName: 'string'}, {something: 'totally incorrect'});
// => { firstName: "" }
// (when confronted with something totally weird, `.coerce()` returns the "base value" for the type)

rttc.validate({ firstName: 'string'}, {something: 'totally incorrect'});
// throws error

rttc.validate({ firstName: 'string'}, {firstName: 45});
// => "45"
// (when confronted with minor differences, `.validate()` coerces as needed to make stuff fit)

rttc.validateStrict({ firstName: 'string'}, {firstName: 45});
// throws error
// (`.validateStrict()` demands a value that is precisely the correct type)

rttc.validateStrict({ firstName: 'string'}, {firstName: '45'});
// does not throw, returns undefined
```


## Philosophy

All of the validation and coercion strategies used in this modules are recursive through the keys of plain old JavaScript objects and the indices of arrays.

#### Coercion vs. Validation

+ `.validateStrict()` throws if the provided value is not the right type (recursive).
+ `.validate()` either returns a (potentially "lightly" coerced) version of the value that was accepted, or it throws.  The "lightly" coerced value turns `"3"` into `3`, `"true"` into `true`, `-4.5` into `"-4.5"`, etc.
+ `.coerce()` ALWAYS returns an acceptable version of the value, even if it has to mangle it to get there (i.e. by using the "base value" for the expected type.)

#### Base values

+ For "string", base value is `""`
+ For "number", base value is `0`
+ For "boolean", base value is `false`
+ For any "dictionary" (`{}`), base value is `{}`, with whatever keys are expected (recursive)
+ For a generic "array" (`[]`), base value is `[]`, with a single archetypal item matching the expectation (recursive)
+ For "*", base value is `"undefined"`.


<!--
TODO:
+ For "stream", base value is an empty readable buffer stream (i.e. not in object mode)
+ For "machine", base value is a no-op machine that calls its success exit.
-->

#### Edge cases

+ `undefined` is never valid.
+ `null` is never valid.
+ `NaN` is never valid.
+ `Infinity` is never valid.
+ `-Infinity` is never valid.


#### Dictionaries

+ Dictionaries (i.e. plain old JavaScript objects like `{}`) in type schemas can be infinitely nested.  Type validation and coercion will proceed through the nested objects recursively.

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

When validating against a dictionary schema with at least one key, extra keys in the actual value will be stripped out.  If the dictionary schema is empty, all actual keys will be left alone.


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



#### rttc.validate(expected, actual)

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

#### rttc.coerce(expected, actual)

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


If value can't be properly coerced, the "base value" for the type will be used:

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

