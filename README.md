# rttc
Runtime (recursive) type-checking for JavaScript.

## Installation

```sh
$ npm install rttc --save
```


## Quick Start


Want to coerce a value to match a particular type?

```javascript
var rttc = require('rttc');

rttc.coerce({ firstName: 'string'}, {firstName: 13375055});
// => { firstName: "13375055" }

rttc.coerce({ firstName: 'string'}, {something: 'totally incorrect'});
// => { firstName: "" }
// (when confronted with something totally weird, `.coerce()` returns the "base value" for the type)
```

Want to throw an Error if a value doesn't match a particular type?

```javascript
rttc.validateStrict({ firstName: 'string'}, {firstName: 13375055});
// throws error
// (`.validateStrict()` demands a value that is precisely the correct type)

rttc.validateStrict({ firstName: 'string'}, {firstName: '13375055'});
// does not throw
```

Or if you want to be a little more forgiving:

```javascript
rttc.validate({ firstName: 'string'}, {something: 'totally incorrect'});
// throws error

rttc.validate({ firstName: 'string'}, {firstName: 45});
// => "45"
// (when confronted with minor differences, `.validate()` coerces as needed to make stuff fit)
```


Not sure how to build a type schema for use with `.coerce()` or `.validate()`? Use `.infer()` to build one from an example value you've got laying around:

```javascript
rttc.infer({ firstName: 'Rosella', lastName: 'Graham', friends: ['Valencia', 'Edgar', 'Attis'] });
// => { firstName: 'string',  lastName: 'string', friends: ['string'] }
```

This special example value is called an **exemplar**.


> Note that when inferring the schema for an array in an exemplar, the array item is considered the _pattern_.  It is used to indicate the expected type of each item in the array.  Consequently, if an array in an exemplar has an item, that means it is homogeneous (i.e. all its items have the same schema).


You can use exemplars to specify just about any type-- here's a more advanced schema to show what I mean:

```javascript
rttc.infer([{ upstream: '===', fieldName: 'photos', files: [{getFile: '->', fileName: 'whatever', numBytes: 34353, meta: '*' }] }]);
// =>
// [
//  {
//    upstream: 'ref',
//    fieldName: 'string',
//    files: [
//      {
//        getFile: 'lamda',
//        fileName: 'string',
//        numBytes: 'number',
//        meta: 'json'
//      }
//    ]
// }
// ]
```

> Note that all of the validation and coercion strategies used in this modules are recursive through the keys of plain old JavaScript objects and the indices of arrays.



## Types &amp; terminology

> Each type can be validated or coerced against.  If coercion fails, the "base value" for the type will be used.

> Also note that all types below may be expressed recursively within faceted dictionaries and patterned arrays. If those words don't make sense, keep reading, you'll see what I mean.


There are 10 different types recognized by `rttc`:

| type                    | rttc example notation    | base value                          |
|-------------------------|--------------------------|-------------------------------------|
| string                  | `'any string like this'` | `''`
| number                  | `1337` _(any number)_    | `0`
| boolean                 | `false` _(or `true`)_    | `false`
| lamda                   | `'->'`                   | `function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); };`
| generic dictionary      | `{}`           | `{}` _(empty dictionary)_
| generic array           | `[]`          | `[]` _(empty array)_
| json                    | `'*'`                    | `null`
| ref                     | `'==='`                  | `null`
| faceted dictionary  (recursive)       | `{...}` _(i.e. w/ keys)_  | `{...}` (w/ all expected keys and _their_ base values)
| pattern array (recursive)    | `[...]` _(i.e. w/ 1 item)_  | `[]` _(empty array)_



### Strings

`example: 'stuff'`

The **string** type accepts any string.

### Numbers

`example: 323`

The **number** type accepts numbers like `0`, `-4`, or `235.3`.  Anathemas like `Infinity`, `-Infinity`, `NaN`, and `-0` are all coerced to zero.

### Booleans

`example: false`

The **boolean** type accepts `true` or `false`.

### Lamdas

`example: ->`

The **lamda** type accepts any function.

### Generic dictionaries

`example: {}`

The **generic dictionary** type accepts any JSON-serializable dictionary.

Dictionaries that have been validated/coerced against the generic dictionary type:
+ will have no prototypal properties, getters, or setters, as well as a complete deficit of any other sort of deceit, lies, or magic
+ are guaranteed to be JSON-serializable, with a few additional affordances:
  + normally, `Error` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings by reducing them to their `.stack` property (this includes the error message and the stack trace w/ line numbers)
  + normally, `RegExp` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings like `'/some regexp/gi'`
  + normally, `function()` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings like `'function doStuff (a,b) { console.log(\'wow I can actually read this!\'); }'`
+ keys with undefined values at any level will be stripped out
+ undefined items in nested arrays will be stripped out
+ keys with null values may be present
+ null items in nested arrays may be present

### Faceted dictionaries

`example: {...}`

The **faceted dictionary** type is any dictionary type schema with at least one key.  Extra keys in the actual value that are not in the type schema will be stripped out. Missing keys will cause `.validate()` to throw.

Dictionary type schemas (i.e. plain old JavaScript objects nested like `{a:{}}`) can be infinitely nested.  Type validation and coercion will proceed through the nested objects recursively.

```javascript
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



### Generic arrays

`example: []`

Arrays that have been validated/coerced against the generic array type:
+ _may_ be heterogeneous (have items with different types) - but it is generally best practice to avoid heterogeneous arrays in general.
+ are guaranteed to be JSON-serializable, with a few additional affordances:
  + normally, `Error` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings by reducing them to their `.stack` property (this includes the error message and the stack trace w/ line numbers)
  + normally, `RegExp` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings like `'/some regexp/gi'`
  + normally, `function()` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings like `'function doStuff (a,b) { console.log(\'wow I can actually read this!\'); }'`
+ keys of nested dictionaries with undefined values will be stripped out
+ undefined array items at any level will be stripped out
+ keys of nested dictionaries with null values may be present
+ null items in arrays at any level may be present

> Note: Generic array exemplar syntax is really just another way to write `['*']`.  The special empty array syntax will continue to be supported for backwards compatibility, but it may eventually be removed from documentation and tests to avoid potential confusion.


### Patterned arrays

`example: ['Margaret']`
`example: [123]`
`example: [true]`
`example: [[...]]`
`example: [{...}]`

Array type schemas may be infinitely nested and combined with dictionaries or any other types.

Runtime arrays being validated/coerced against array type schemas will be homogeneous (meaning every item in the array will have the same type).

Undefined items will always be stripped out of arrays.

> Also note that, because of this, when providing a type schema or type-inference-able example for an array, you only need to provide one item in the array, e.g.:

```javascript
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

### Generic JSON

`example: '*'`

This works pretty much like the generic array or generic dictionary type, with one major difference: the top-level value can be a string, boolean, number, dictionary, array, or null value.

Other than the aforementioned exception for `null`, the generic JSON type follows the JSON-serializability rules from generic arrays and generic dictionaries.



### Mutable reference ("ref")

`example: '==='`

This special type allows anything except `undefined` at the top level (undefined is permitted at any other level).  It also _does not rebuild objects_, which means it maintains the original reference (i.e. is `===`).  It does not guarantee JSON-serializability.




## Conventions and edge-cases

The following is a high-level overview of important conventions used by the `rttc` module. For detailed coverage of every permutation of validation and coercion, check out the declarative tests in the `spec/` folder of this repository.

##### `undefined` and `null` values

+ `undefined` _is never valid as a top-level value_ against ANY type, even mutable reference (`===`)
+ `undefined` IS, however, allowed as an item in a nested array or value in a nested dictionary, but only _within a dictionary or array_ being validated against the mutable reference type (`===`)
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



##### Base values

As mentioned above, every type has a base value.

+ For the "string" type, base value is `""`
+ For the "number" type, base value is `0`
+ For the "boolean" type, base value is `false`
+ For the "lamda" type (`'->'`), base value is a function that uses the standard machine fn signature and triggers its "error" callback w/ a message about being the rttc default (e.g. `function(inputs,exits,env) { return exits.error(new Error('not implemented')); }`)
+ For the generic dictionary type (`{}`) or a faceted dictionary type (e.g. `{foo:'bar'}`), the base value is `{}`.
+ For the generic array type (`[]`), or a faceted/homogenous array type (e.g. `[3]` or `[{age:48,name: 'Nico'}]`), the base value is `[]`
+ For the "json" type (`'*'`), base value is `null`.
+ For the "ref" type (`'==='`), base value is `null`.

> Note that, for both arrays and dictionaries, any keys in the schema will get the base value for their type (and their keys for their type, etc. -- recursive)





## Methods

This package exposes a number of different utility methods.  If you're interested in using any of these directly, we highly recommend you consider looking at [machinepack-rttc](http://node-machine.org/machinepack-rttc), which provides a higher-level abstraction with better documentation.

> The low-level reference below assumes you are willing/able to dig into the source code of this module for more information.  So continue at your own risk!

### Validation

##### .validateStrict(expectedTypeSchema, actualValue)

Throws if the provided value is not the right type (recursive).


##### .validate(expectedTypeSchema, actualValue)

Either returns a (potentially "lightly" coerced) version of the value that was accepted, or it throws.  The "lightly" coerced value turns `"3"` into `3`, `"true"` into `true`, `-4.5` into `"-4.5"`, etc.



### Munging


##### .coerce(expectedTypeSchema, actualValue)

ALWAYS returns an acceptable version of the value, even if it has to mangle it to get there (i.e. by using the "base value" for the expected type.  More on that below.)


##### .hydrate(value, [_typeSchema_=`undefined`])

This function will use the provided `typeSchema` to figure out where "lamda" values (functions) are expected, then will use `eval()` to bring them back to life.  Use with care.


##### .dehydrate(value, [_allowNull_=`false`], [_dontStringifyFunctions_=`false`])

This takes care of a few serialization edge-cases, such as:

+ stringifies regexps, errors (grabs the `.stack` property), and functions (unless `dontStringifyFunctions` is set)
+ replacing circular references with a string (e.g. `[Circular]`)
+ replaces `-Infinity`, `Infinity`, and `NaN` with 0
+ strips keys and array items with `undefined` or `null` values. If `allowNull` is set to true, `null` values will not be stripped from the encoded string.



##### .parse(stringifiedValue, [_typeSchema_=`undefined`], [_unsafeMode_=`false`])

Parse a stringified value back into a usable value.

This is basically just a variation on JSON.parse that calls `rttc.hydrate()` first if `unsafeMode` is enabled.


##### .stringify(value, [_allowNull_=`false`])

Encode a value into a string.

This is basically just a variation on JSON.stringify that calls `rttc.dehydrate()` first.


##### .parseHuman(stringFromHuman, [_typeSchema_=`undefined`], [_unsafeMode_=`false`])

Parse a string from a human into something usable.  If provided, `typeSchema` will be used to make a better guess.  If `unsafeMode` is enabled, lamda functions will be hydrated.


##### .stringifyHuman(value, typeSchema)

The inverse of `.parseHuman()`, this function encodes a string that, if run through `.parseHuman()` would result in the given value.



### Assertions

##### .isEqual(firstValue, secondValue, [_expectedTypeSchema_=`undefined`])

Determine whether two values are equivalent using `_.isEqual()`, but also look for expected `lamda` values in the optional type schema and call `toString()` on functions before comparing them.

> This is the method used by `rttc`'s own tests to validate that expected values and actual values match.


##### .infer(exampleValue)

Guess the type schema from an example value.

##### .isSpecific(typeSchemaOrExemplar, [recursive=false], [isExemplar=false])

Determine whether the given type schema is "specific".  String, number, boolean, lamda, faceted dictionary, or patterned array types are "specific".  Everything else is "generic".

If the second argument (`recursive`) is set to `true`, then also recursively check the subkeys of faceted dictionaries and patterns of arrays in the type schema.

If the third argument (`isExemplar`) is set to `true`, then treat the provided schema as an rttc example rather than a type schema.

For reference

| type                    | is specific?          |
|-------------------------|---------------------|
| string                  | yes _(always)_ |
| number                  | yes _(always)_ |
| boolean                 | yes _(always)_ |
| lamda                   | yes _(always)_ |
| `{}` (generic)          | no                 |
| `[]` (generic)          | no                 |
| `{...}` (faceted)       | yes _(maybe recursively)_  |
| `[...]` (patterned)     | yes _(maybe recursively)_  |
| json                    | no                 |
| ref                     | no                 |


### Utilities


##### .sample(typeSchema, [n=2])

Given a type schema, return an array of up to `n` unique sample values that would validate against it (in random order).  `n` defaults to 2 if left undefined.


##### .getDisplayType(value)

Given a value, return its type as a human-readable string (this is not limited to rttc types-- it can return strings like `"Error"` and `"Date"`).
If special rttc exemplar syntax is used, it is respected.


##### .compile(value)

Given a value, return a human-readable string which represents it.  This string is equivalent to a JavaScript code snippet which would accurately represent the value in code.

This is a lot like `util.inspect(val, {depth: null})` in the Node core util package. But there are a few differences. `rttc.compile()` also has special handling for Errors, Dates, and RegExps (using `dehydrate()` with `allowNull` enabled), as well as for Functions (making them `eval()`-ready.) The biggest difference is that the string you get back from `rttc.compile()` is ready for use as the right hand side of a variable initialization statement in JavaSript.

Useful for:
  + bootstrapping data on server-rendered views for access by client-side JavaScript
    + see [this gist](https://gist.github.com/mikermcneil/f8faae5903f049640d15) for a comprehensive example
  + generating code samples
  + error messages
  + debugging
  + user interfaces

Finally, here's a table listing notable differences between `util.inspect()` and `rttc.compile()` for reference:


| value                    | util.inspect()                            | rttc.compile()                       |
|--------------------------|-------------------------------------------|--------------------------------------|
| a function               | `[Function: foo]`                         | `function foo (){}`                  |
| a Date                   | `Tue May 26 2015 20:05:37 GMT-0500 (CDT)` | `'2015-05-27T01:06:37.072Z'`         |
| a RegExp                 | `/foo/gi`                                 | `'/foo/gi/'`                         |
| an Error                 | `[Error]`                                 | `'Error\n    at repl:1:24\n...'`     |
| a deeply nested thing    | `{ a: { b: { c: [Object] } } }`           | `{ a: { b: { c: { d: {} } } } }`     |
| a circular thing         | `{ y: { z: [Circular] } }`                | `{ y: { z: '[Circular ~]' } }`       |
| undefined                | `undefined`                               | `null`                               |
| [undefined]              | `[undefined]`                             | `[]`                                 |
| {foo: undefined}         | `{foo: undefined}`                        | `{}`                                 |
| Infinity                 | `Infinity`                                | `0`                                  |
| -Infinity                | `-Infinity`                               | `0`                                  |
| NaN                      | `NaN`                                     | `0`                                  |
| Readable (Node stream)   | `{ _readableState: { highWaterMar..}}`    | `null`                               |
| Buffer (Node bytestring) | `<Buffer 61 62 63>`                       | `null`                               |


> Note that undefined values in arrays and undefined values of keys in dictionaries will be stripped out, and circular references will be handled as they are in `util.inspect(val, {depth: null})`.





### Experimental

The following functions are newly implemented, experimental, and tend to be a bit more advanced. They may undergo frequent changes over the coming months, so use with care.  You have been warned!

##### .getDefaultExemplar(typeSchema)

Given a type schema, return an exemplar which accepts precisely the same set of values.

##### .coerceExemplar(value, [allowSpecialSyntax=false])

Convert a normal value into an exemplar representative of the _most specific_ type schema which would accept it.  In most cases, this leaves the value untouched-- however it does take care of a few special cases:

+ Empty dictionaries become generic dictionaries (`{}`).  The most specific exemplar which can accept an empty dictionary is the generic dictionary.
+ Empty arrays become generic arrays (`[]`).  Since we don't know the contents, we have to assume this array could be heterogeneous (i.e. have items with different types).
+ Multi-item arrays become pattern arrays, and any extra items (other than the first one) are lopped off.
+ Functions become '->'.
+ `null` becomes '*'.
+ If the top-level value is `undefined`, it becomes '==='. (however this behavior is subject to change in an upcoming release; since `undefined` is not supported by any exemplar)
+ '->' becomes the string: `'an arrow symbol'`.
+ '*' becomes the string: `'a star symbol'`.
+ '===' becomes the string: `'3 equal signs'`.
+ `NaN`, `Infinity`, `-Infinity`, and `-0` become 0.
+ Nested array items and keys with `undefined` values are stripped.
+ Other than the exceptions mentioned above, non-JSON-serializable things (like circular references) are boiled away when this calls `dehydrate` internally.

If the `allowSpecialSyntax` flag is enabled, then `*`, `->`, and `===` will be left untouched (allowing them to be intperpreted as special rttc exemplar syntax) instead of being replaced with string samples (e.g. "a star symbol" or "an arrow symbol").

```js
rttc.coerceExemplar([{a:null}, {b: [[74,39,'surprise string!']] }])
//   =>   [ {} ]

rttc.coerceExemplar([74,39,'surprise string!'])
//   =>   [ 'surprise string!' ]

rttc.coerceExemplar({x:'*'})
//   =>   { x: 'a star symbol' }

rttc.coerceExemplar({x:'*'}, true)
//   =>   { x: '*' }
```

##### .isInvalidExample(exemplar)

Return truthy if the provided value is NOT a valid rttc exemplar.

##### .getPathInfo(exemplar, path)

Given an exemplar schema and a keypath, return information about the specified segment.  If the path is inside of a generic, then the exemplar is '*',  and this path is optional. If the path is inside of a `ref`,  then the exemplar is '===', and this path is optional.  If the path is not reachable (i.e. inside of a string, or lamda... or something) then throw an error.

```js
var SOME_EXEMPLAR = {
  salutation: 'Mr.',
  hobbies: ['knitting'],
  medicalInfo: {
    numYearsBlueberryAbuse: 12.5,
    latestBloodWork: {}
  }
};

rttc.getPathInfo(SOME_EXEMPLAR, 'hobbies.238');
// =>
//     {
//       exemplar: 'knitting',
//       optional: false
//     }


rttc.getPathInfo(SOME_EXEMPLAR, 'medicalInfo.latestBloodWork.whiteBloodCellCount');
// =>
//     {
//       exemplar: '*',
//       optional: true
//     }
```

##### .union(schema0, schema1, [isExemplar=false], [isStrict=false])

Given two rttc schemas (e.g. `A` and `B`), return the most specific schema that would accept the superset of what both schemas accept normally (`A ∪ B`).

+ _schema0_ - the first schema
+ _schema1_ - the second schema (order doesn't matter)
+ _isExemplar_ - if set, the schemas will be treated as exemplars (rather than type schemas)
+ _isStrict_ - if set, the schemas will be unioned using strict validation rules (i.e. like `validateStrict()`)


##### .intersection(schema0, schema1, [isExemplar=false], [isStrict=false])

Given two rttc schemas, return the most specific schema that accepts the shared subset of values accepted by both. Formally, this subset is the intersection of A and B (A ∩ B), where A is the set of values accepted by `schema0` and B is the set of values accepted by `schema1`.  If `A ∩ B` is the empty set, then this function will return `null`.  Otherwise it will return the schema that precisely accepts `A ∩ B`.

+ _schema0_ - the first schema
+ _schema1_ - the second schema (order doesn't matter)
+ _isExemplar_ - if set, the schemas will be treated as exemplars (rather than type schemas)
+ _isStrict_ - if set, the schemas will be intersected using strict validation rules (i.e. like `validateStrict()`)


##### .reify(typeSchema)

Given a type schema, strip out generics ("ref", "json", {}, and []) to convert it into a "specific" type. In other words, the result of this function always passes `rttc.isSpecific()`.


##### .getBaseVal(exemplar)

A convenience method to return the base value for the given exemplar.

##### .cast(exemplar, actualValue)

A convenience method that calls `rttc.infer()` on the provided exemplar to get the type schema, then uses it to `rttc.coerce()` the `actualValue` provided.


## License

MIT

&copy; 2014 Mike McNeil, Cody Stoltman;  &copy; 2015 The Treeline Company
