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

+ For the "string" type, base value is `""`
+ For the "number" type, base value is `0`
+ For the "boolean" type, base value is `false`
+ For the "lamda" type (`'->'`), base value is a function that uses the standard machine fn signature and triggers its "error" callback w/ a message about being the rttc default (e.g. `function(inputs,exits,env) { return exits.error(new Error('not implemented')); }`)
+ For the generic "dictionary" type (`{}`) or a faceted dictionary type (e.g. `{foo:'bar'}`), the base value is `{}`.
+ For the generic "array" type (`[]`), or a faceted/homogenous array type (e.g. `[3]` or `[{age:48,name: 'Nico'}]`), the base value is `[]`
+ For the "json" type (`'*'`), base value is `null`.
+ For the "ref" type (`'==='`), base value is `undefined`.

> Note that, for both arrays and dictionaries, any keys in the schema will get the base value for their type (and their keys for their type, etc. -- recursive)



## Types

#### Strings

`example: 'stuff'`


#### Numbers

`example: 323`


#### Booleans

`example: {}`


#### Generic dictionaries

`example: {}`

The **generic dictionary** type is a dictionary type schema with no keys.


Dictionaries that have been validated/coerced against the generic dictionary type:
+ will have no prototypal properties, getters, or setters, as well as a complete deficit of any other sort of deceit, lies, or magic
+ are guaranteed to be JSON-serializable, with a few additional affordances:
  + normally, stringified JSON may contain `null` values.  Instead, rttc removes `null` items from arrays and removes keys with `null` values from objects.
  + normally, `Error` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings by reducing them to their `.stack` property (this includes the error message and the stack trace w/ line numbers)
  + normally, `RegExp` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings like `'/some regexp/gi'`
  + normally, `function()` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings like `'function doStuff (a,b) { console.log(\'wow I can actually read this!\'); }'`


#### Faceted dictionaries

`example: {...}`

The **faceted dictionary** type is any dictionary type schema with at least one key.
Extra keys in the actual value that are not in the type schema will be stripped out.

Dictionary type schemas (i.e. plain old JavaScript objects nested like `{a:{}}`) can be infinitely nested.  Type validation and coercion will proceed through the nested objects recursively.

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



#### Generic arrays

`example: []`

Arrays that have been validated/coerced against the generic array type:
+ _may_ be heterogeneous (have items with different types) - but it is generally best practice to avoid heterogeneous arrays in general.
+ are guaranteed to be JSON-serializable, with a few additional affordances:
  + normally, stringified JSON may contain `null` values.  Instead, rttc removes `null` items from arrays and removes keys with `null` values from objects.
  + normally, `Error` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings by reducing them to their `.stack` property (this includes the error message and the stack trace w/ line numbers)
  + normally, `RegExp` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings like `'/some regexp/gi'`
  + normally, `function()` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings like `'function doStuff (a,b) { console.log(\'wow I can actually read this!\'); }'`

#### Homogeneous arrays

`example: ['Margaret']`
`example: [123]`
`example: [true]`
`example: [[...]]`
`example: [{...}]`

Array type schemas may be infinitely nested and combined with dictionaries or any other types.

Runtime arrays being validated/coerced against array type schemas will be homogeneous (meaning every item in the array will have the same type).

> Also note that, because of this, when providing a type schema or type-inference-able example for an array, you only need to provide one item in the array, e.g.:

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

#### Generic JSON

`example: '*'`

This works pretty much like the generic array or generic dictionary type, with two major differences: (1) the top-level value can be a string, boolean, number, dictionary, array, or null value. (2) `null` is permitted, both as a top-level value and recursively in nested arrays and dictionaries (and as you might expect, `null` values are NOT stripped from nested arrays and dictionaries when performing type coercion)

Other than the aforementioned exception for `null`, the generic JSON type follows the JSON-serializability rules from generic arrays and generic dictionaries.



#### Mutable references

`example: '==='`

This special type allows anything except `undefined`.  It also _does not rebuild objects_, which means it maintains the original reference (i.e. is `===`).  It does not guarantee JSON-serializability.



#### Edge-case cheat sheet

The following notes are a high-level overview of important conventions used by the `rttc` module. For detailed coverage of every permutation of validation and coercion, check out the declarative tests in the `spec/` folder of this repository.

##### `undefined` and `null` values

+ `undefined` _is never valid as a top-level value_ against ANY type, even mutable reference (`===`)
+ `undefined` IS, however, allowed as an item in a nested array or value in a nested dictionary, but only against the mutable reference type (`===`)
+ `null` is only valid against the JSON (`*`) and mutable reference (`===`) types.

##### Weird psuedo-numeric values

+ `NaN` is only valid against the mutable reference type (`'==='`)
+ `Infinity` and `-Infinity` is only valid against the mutable reference type (`'==='`)
+ `Infinity` and `-Infinity` are only valid against `example: '==='`
+ `+0` and `-0` are always coerced to `0` (except against the mutable reference type)

##### Instances of ECMAScript core classes

When coerced against the generic dictionary, generic array, or the generic json types, the following is true:
+ `Error` instances are coerced to the string value of their `.stack` property (i.e. the message + stack trace you're used to seeing in the terminal)
+ `Date` instances are coerced to the string value of running their `.toJSON()` method (a ISO-8601 timestamp, e.g. `'2015-05-24T15:16:48.999Z'`.  This reflects the Date in GMT/UTC time, so is therefore timezone-agnostic).
+ `RegExp` instances are coerced to the string value you get from running their `.toString()` method (e.g. `'/foo/'` or `'/^bar/gi'`)
+ Functions are coerced to the string value you get from running their `.toString()` method (e.g. `'function someFunction (some,args,like,this,maybe){ /* and some kind of implementation in here prbly */ }'`)

##### Instances of Node.js core classes

+ `Stream` and `Buffer` instances (from Node.js) are only valid against the mutable reference type.
+ Streams and Buffers are coerced to `null` against the generic dictionary, generic array, or the generic json types.


## Examples

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

