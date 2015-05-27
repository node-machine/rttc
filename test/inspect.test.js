var assert = require('assert');
var rttc = require('../');

describe('.inspect()', function() {


// *  |  actual                 |  util.inspect()                           |  rttc.inspect()                      |
// *  | ----------------------- | ----------------------------------------- | -------------------------------------|
// *  | a function              | `[Function: foo]`                         | `'function foo (){}'`                |
// *  | a Date                  | `Tue May 26 2015 20:05:37 GMT-0500 (CDT)` | `'2015-05-27T01:06:37.072Z'`         |
// *  | a RegExp                | `/foo/gi`                                 | `'/foo/gi/'`                         |
// *  | an Error                | `[Error]`                                 | `'Error\n    at repl:1:24\n...'`     |
// *  | a deeply nested thing   | `{ a: { b: { c: [Object] } } }`           | `{ a: { b: { c: { d: {} } } } }`     |
// *  | a circular thing        | `{ y: { z: [Circular] } }`                | `{ y: { z: '[Circular ~]' } }`       |
// *  | undefined               | `undefined`                               | `null`                               |
// *  | Readable (Node stream)  | `{ _readableState: { highWaterMar..}}`    | `null`                               |
// *  | Buffer (Node bytestring)| `<Buffer 61 62 63>`                       | `[ 97, 98, 99 ]`                     |

  it('should wrap strings in single quotes', function() {
    _assertInspectedResultIsCorrect({
      value: 'foo',
      expected: '\'foo\''
    });
    _assertInspectedResultIsCorrect({
      value: '"foo"',
      expected: '\'"foo"\''
    });
    _assertInspectedResultIsCorrect({
      value: '999999999',
      expected: '\'999999999\''
    });
  });

  it('should return string version of number', function() {
    _assertInspectedResultIsCorrect({
      value: 9999999999,
      expected: '9999999999'
    });
  });

  it('should return string version of boolean', function() {
    _assertInspectedResultIsCorrect({
      value: false,
      expected: 'false'
    });
    _assertInspectedResultIsCorrect({
      value: true,
      expected: 'true'
    });
  });


  it('should `.toString()` function and wrap it in single quotes', function() {
    _assertInspectedResultIsCorrect({
      value: function foobar(x,y){ return x+y; },
      expected: '\'function foobar(x,y){ return x+y; }\''
    });
  });

  it('should remove any whitespace between function name and arguments declaration', function() {
    _assertInspectedResultIsCorrect({
      value: function foobar   (x,y){ return x+y; },
      expected: '\'function foobar(x,y){ return x+y; }\''
    });
  });

  it('should get .stack property of Error and wrap it in single quotes', function() {
    var err = new Error('some passive aggressive message');
    err.stack = 'setting this stack property to something inane so that it\'s easy to compare, and so tests don\'t depend on file paths from the stack trace of my computer';

    _assertInspectedResultIsCorrect({
      value: err,
      expected: '\'setting this stack property to something inane so that it\\\'s easy to compare, and so tests don\\\'t depend on file paths from the stack trace of my computer\''
    });
  });

  it('should get timezone-agnostic ISO 6801 timestamp for Date and wrap it in single quotes', function() {
    _assertInspectedResultIsCorrect({
      value: new Date('November 5, 1605 GMT'),
      expected: '\'1605-11-05T00:00:00.000Z\''
    });
  });

  it('should call `.toString()` on RegExp, then wrap it in single quotes', function() {
    _assertInspectedResultIsCorrect({
      value: /waldo/gi,
      expected: '\'/waldo/gi\''
    });
  });

  it('should return string that looks like `null` for `undefined` and `null`', function() {
    _assertInspectedResultIsCorrect({
      value: undefined,
      expected: 'null'
    });
    _assertInspectedResultIsCorrect({
      value: null,
      expected: 'null'
    });
  });

  it('should return string that looks like `0` for weird values like Infinity, -Infinity, and NaN', function() {
    _assertInspectedResultIsCorrect({
      value: -Infinity,
      expected: '0'
    });
    _assertInspectedResultIsCorrect({
      value: Infinity,
      expected: '0'
    });
    _assertInspectedResultIsCorrect({
      value: NaN,
      expected: '0'
    });
  });

  it('should return string that looks like `null` for stream.Readable instances', function() {
    _assertInspectedResultIsCorrect({
      value: new (require('stream').Readable)(),
      expected: 'null'
    });
  });

  // TODO: make this work
  it.skip('should return string that looks like `null` for Buffer instances`', function() {
    _assertInspectedResultIsCorrect({
      value: new Buffer('alive with the glory of love'),
      expected: 'null'
    });
  });

  it('should return string that looks like dictionary for dictionary', function() {
    _assertInspectedResultIsCorrect({
      value: {},
      expected: '{}'
    });
    _assertInspectedResultIsCorrect({
      value: { a: 'b' },
      expected: '{ a: \'b\' }'
    });
  });

  it('should return string that looks like array for array', function() {
    _assertInspectedResultIsCorrect({
      value: [],
      expected: '[]'
    });
    _assertInspectedResultIsCorrect({
      value: [ 'a', 'b', 45 ],
      expected: '[ \'a\', \'b\', 45 ]'
    });
  });

  it('should put spaces on the insides of brackets/braces for arrays/dictionaries, and remove extraneous spaces between keys and values, and between array items', function() {
    _assertInspectedResultIsCorrect({
      value: {a: 'b'},
      expected: '{ a: \'b\' }'
    });
    _assertInspectedResultIsCorrect({
      value: ['a','b',45],
      expected: '[ \'a\', \'b\', 45 ]'
    });
    _assertInspectedResultIsCorrect({
      value: ['a','b',45,{x:    'stuff!'}],
      expected: '[ \'a\', \'b\', 45, { x: \'stuff!\' } ]'
    });
    _assertInspectedResultIsCorrect({
      value: ['a','b',45,[  {x:    'stuff!'}, null,    true]    ],
      expected: '[ \'a\', \'b\', 45, [ { x: \'stuff!\' }, null, true ] ]'
    });
  });

  it('should start using newlines when dictionaries have values that end up taking more characters when rendered (key length doesn\'t seem to matter)', function() {
    _assertInspectedResultIsCorrect({
      value: {a: 'b', c: 'dogfooddogfooddogfooddogfooddogfooddogfooddogfooddogfood' },
      expected: '{ a: \'b\',\n  c: \'dogfooddogfooddogfooddogfooddogfooddogfooddogfooddogfood\' }'
    });
    _assertInspectedResultIsCorrect({
      value: {a: 'b', catfoodcatfoodcatfoodcatfoodcatfood: 'd' },
      expected: '{ a: \'b\', catfoodcatfoodcatfoodcatfoodcatfood: \'d\' }'
    });
  });

  it('should act like `dehydrate` for nested values, and follow the same indentation/newline formatting rules as at the top-level', function() {

    _assertInspectedResultIsCorrect({
      value: [{
        someDate: new Date('November 5, 1605 GMT'),
        someRegExp: /waldo/gi,
        someError: (function(){
          var err = new Error('some passive aggressive message');
          err.stack = 'setting this stack property to something inane so that it\'s easy to compare, and so tests don\'t depend on file paths from the stack trace of my computer';
          return err;
        })(),
        someFunction: function foobar(x,y){ return x+y; },
        weirdNumbers: [Infinity, -Infinity, NaN, -0, 0],
        weirdExistentials: [null, undefined],
        nodejsThings: {
          stream: new (require('stream').Readable)()
        }
      }],
      expected: '[ { someDate: \'1605-11-05T00:00:00.000Z\',\n    someRegExp: \'/waldo/gi\',\n    someError: \'setting this stack property to something inane so that it\\\'s easy to compare, and so tests don\\\'t depend on file paths from the stack trace of my computer\',\n    someFunction: \'function foobar(x,y){ return x+y; }\',\n    weirdNumbers: [ 0, 0, 0, 0, 0 ],\n    weirdExistentials: [ null, null ],\n    nodejsThings: { stream: null } } ]'
    });

  });


});



function _assertInspectedResultIsCorrect(opts){
  assert.strictEqual(typeof rttc.inspect(opts.value), 'string');
  assert.strictEqual(rttc.inspect(opts.value), opts.expected);
}
