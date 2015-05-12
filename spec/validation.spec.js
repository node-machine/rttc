// Export the array of tests below
module.exports = [


  ////////////////////////////////////////////
  // STRINGS
  ////////////////////////////////////////////

  { example: 'foo', actual: 'bar', result: 'bar' },
  { example: 'foo', actual: '', result: '' },

  { example: 'foo', actual: 0, result: '0' },
  { example: 'foo', actual: 1, result: '1' },
  { example: 'foo', actual: -1.1, result: '-1.1' },

  { example: 'foo', actual: true, result: 'true' },
  { example: 'foo', actual: false, result: 'false' },

  { example: 'foo', actual: {}, error: true },
  { example: 'foo', actual: {foo:'bar'}, error: true },
  { example: 'foo', actual: {foo:{bar:{baz:{}}}}, error: true },
  { example: 'foo', actual: {foo:['bar']}, error: true },
  { example: 'foo', actual: {foo:{bar:{baz:[{}]}}}, error: true },

  { example: 'foo', actual: [], error: true },
  { example: 'foo', actual: ['asdf'], error: true },
  { example: 'foo', actual: [''], error: true },
  { example: 'foo', actual: [235], error: true },
  { example: 'foo', actual: [false], error: true },
  { example: 'foo', actual: [{}], error: true },
  { example: 'foo', actual: [{foo:'bar'}], error: true },

  { example: 'foo', actual: undefined, error: true },

  { example: 'foo', actual: NaN, error: true },
  { example: 'foo', actual: Infinity, error: true },
  { example: 'foo', actual: -Infinity, error: true },
  { example: 'foo', actual: null, error: true },

  { example: 'foo', actual: /some regexp/, error: true },
  { example: 'foo', actual: function(){}, error: true },
  { example: 'foo', actual: new Date('November 5, 1605 GMT'), result: '1605-11-05T00:00:00.000Z' },
  { example: 'foo', actual: new (require('stream').Readable)(), error: true },
  { example: 'foo', actual: new Buffer('asdf'), error: true },
  { example: 'foo', actual: new Error('asdf'), error: true },

  ////////////////////////////////////////////
  // NUMBERS
  ////////////////////////////////////////////

  { example: 123, actual: 'bar', error: true },
  { example: 123, actual: '', error: true },
  { example: 123, actual: '0', result: 0 },
  { example: 123, actual: '1', result: 1 },
  { example: 123, actual: '-1.1', result: -1.1 },
  { example: 123, actual: 'NaN', error: true },
  { example: 123, actual: 'undefined', error: true },
  { example: 123, actual: 'null', error: true },
  { example: 123, actual: '-Infinity', error: true },
  { example: 123, actual: 'Infinity', error: true },

  { example: 123, actual: 0, result: 0 },
  { example: 123, actual: 1, result: 1 },
  { example: 123, actual: -1.1, result: -1.1 },

  { example: 123, actual: true, result: 1 },
  { example: 123, actual: false, result: 0 },

  { example: 123, actual: {}, error: true },
  { example: 123, actual: {foo:'bar'}, error: true },
  { example: 123, actual: {foo:{bar:{baz:{}}}}, error: true },
  { example: 123, actual: {foo:['bar']}, error: true },
  { example: 123, actual: {foo:{bar:{baz:[{}]}}}, error: true },

  { example: 123, actual: [], error: true },
  { example: 123, actual: ['asdf'], error: true },
  { example: 123, actual: [''], error: true },
  { example: 123, actual: [235], error: true },
  { example: 123, actual: [false], error: true },
  { example: 123, actual: [{}], error: true },
  { example: 123, actual: [{foo:'bar'}], error: true },

  { example: 123, actual: undefined, error: true },

  { example: 123, actual: NaN, error: true },
  { example: 123, actual: Infinity, error: true },
  { example: 123, actual: -Infinity, error: true },
  { example: 123, actual: null, error: true },

  { example: 123, actual: /some regexp/, error: true },
  { example: 123, actual: function(){}, error: true },
  { example: 123, actual: new Date('November 5, 1605 GMT'), error: true },
  { example: 123, actual: new (require('stream').Readable)(), error: true },
  { example: 123, actual: new Buffer('asdf'), error: true },
  { example: 123, actual: new Error('asdf'), error: true },

  ////////////////////////////////////////////
  // BOOLEANS
  ////////////////////////////////////////////
  { example: true, actual: 'bar', error: true },
  { example: true, actual: '', error: true },
  { example: true, actual: '-1.1', error: true },
  { example: true, actual: 'NaN', error: true },
  { example: true, actual: 'undefined', error: true },
  { example: true, actual: 'null', error: true },
  { example: true, actual: '-Infinity', error: true },
  { example: true, actual: 'Infinity', error: true },
  { example: true, actual: 'true', result: true },
  { example: true, actual: 'false', result: false },
  { example: true, actual: '0', result: false },
  { example: true, actual: '1', result: true },

  { example: true, actual: 0, result: false },
  { example: true, actual: 1, result: true },
  { example: true, actual: -1.1, error: true },

  { example: true, actual: true, result: true },
  { example: true, actual: false, result: false },

  { example: true, actual: {}, error: true },
  { example: true, actual: {foo:'bar'}, error: true },
  { example: true, actual: {foo:{bar:{baz:{}}}}, error: true },
  { example: true, actual: {foo:['bar']}, error: true },
  { example: true, actual: {foo:{bar:{baz:[{}]}}}, error: true },

  { example: true, actual: [], error: true },
  { example: true, actual: ['asdf'], error: true },
  { example: true, actual: [''], error: true },
  { example: true, actual: [235], error: true },
  { example: true, actual: [false], error: true },
  { example: true, actual: [{}], error: true },
  { example: true, actual: [{foo:'bar'}], error: true },

  { example: true, actual: undefined, error: true },

  { example: true, actual: NaN, error: true },
  { example: true, actual: Infinity, error: true },
  { example: true, actual: -Infinity, error: true },
  { example: true, actual: null, error: true },

  { example: true, actual: /some regexp/, error: true },
  { example: true, actual: function(){}, error: true },
  { example: true, actual: new Date('November 5, 1605 GMT'), error: true },
  { example: true, actual: new (require('stream').Readable)(), error: true },
  { example: true, actual: new Buffer('asdf'), error: true },
  { example: true, actual: new Error('asdf'), error: true },

  ////////////////////////////////////////////
  // DICTIONARIES
  ////////////////////////////////////////////

  { example: {}, actual: 'bar', error: true },
  { example: {}, actual: 123, error: true },
  { example: {}, actual: true, error: true },

  { example: {}, actual: {}, result: {} },
  { example: {}, actual: {foo:'bar'}, result: {foo:'bar'} },
  { example: {}, actual: {foo:{bar:{baz:{}}}}, result: {foo:{bar:{baz:{}}}} },
  { example: {}, actual: {foo:['bar']}, result: {foo:['bar']} },
  { example: {}, actual: {foo:{bar:{baz:[{}]}}}, result: {foo:{bar:{baz:[{}]}}} },

  { example: {}, actual: [], error: true },
  { example: {}, actual: ['asdf'], error: true },
  { example: {}, actual: [''], error: true },
  { example: {}, actual: [235], error: true },
  { example: {}, actual: [false], error: true },
  { example: {}, actual: [{}], error: true },
  { example: {}, actual: [{foo:'bar'}], error: true },

  { example: {}, actual: undefined, error: true },

  { example: {}, actual: NaN, error: true },
  { example: {}, actual: Infinity, error: true },
  { example: {}, actual: -Infinity, error: true },
  { example: {}, actual: null, error: true },

  { example: {}, actual: /some regexp/, error: true },
  { example: {}, actual: function(){}, error: true },
  { example: {}, actual: new Date('November 5, 1605 GMT'), error: true },

  // Skip Readable stream tests for now since the enumerable properties vary between Node.js versions.
  // { example: {}, actual: new (require('stream').Readable)(), result: { _readableState: { highWaterMark: 16384, buffer: [], length: 0, pipes: null, pipesCount: 0, flowing: false, ended: false, endEmitted: false, reading: false, calledRead: false, sync: true, needReadable: false, emittedReadable: false, readableListening: false, objectMode: false, defaultEncoding: 'utf8', ranOut: false, awaitDrain: 0, readingMore: false, decoder: null, encoding: null }, readable: true, domain: null, _events: {}, _maxListeners: 10 } },
  // Note: we could bring back support for this by explicitly filtering properties of streams in `.exec()`...
  // TODO: but actually, this should cause an error- use `example: '*'` for things like this.

  // Skip Buffer tests for now since the enumerable properties vary between Node.js versions.
  // { example: {}, actual: new Buffer('asdf'), error: true },
  // Note: we could bring back support for this by explicitly filtering properties of buffers in `.exec()`
  // TODO: but actually, this should cause an error- use `example: '*'` for things like this.

  { example: {}, actual: new Error('asdf'), result: {} },  // TODO: consider enhancing this behavior to guarantee e.g. `.message` (string), `.stack` (string), `.code` (string), and `.status` (number).  Needs community discussion


  ////////////////////////////////////////////
  // ARRAYS
  // (all of the tests below pass w/ either [] or ['*']
  //  however note they do have subtle differences re: strictEq)
  ////////////////////////////////////////////

  { example: [], actual: 'bar', error: true },
  { example: [], actual: 123, error: true },
  { example: [], actual: true, error: true },

  { example: [], actual: {}, error: true },
  { example: [], actual: {foo:'bar'}, error: true },
  { example: [], actual: {foo:{bar:{baz:{}}}}, error: true },
  { example: [], actual: {foo:['bar']}, error: true },
  { example: [], actual: {foo:{bar:{baz:[{}]}}}, error: true },

  { example: [], actual: [], result: [] },
  { example: [], actual: ['asdf'], result: ['asdf'] },
  { example: [], actual: [''], result: [''] },
  { example: [], actual: [235], result: [235] },
  { example: [], actual: [false], result: [false] },
  { example: [], actual: [{}], result: [{}] },
  { example: [], actual: [{foo:'bar'}], result: [{foo: 'bar'}] },

  { example: [], actual: undefined, error: true },

  { example: [], actual: NaN, error: true },
  { example: [], actual: Infinity, error: true },
  { example: [], actual: -Infinity, error: true },
  { example: [], actual: null, error: true },

  { example: [], actual: /some regexp/, error: true },
  { example: [], actual: function(){}, error: true },
  { example: [], actual: new Date('November 5, 1605 GMT'), error: true },
  { example: [], actual: new (require('stream').Readable)(), error: true }, // TODO: consider enhancing this behavior to concat the stream contents? Needs community discussion.
  // Skip Buffer tests for now since the enumerable properties vary between Node.js versions.
  // { example: [], actual: new Buffer('asdf'), result: [ 97, 115, 100, 102 ] },
  // Note: we could bring back support for this by explicitly filtering properties of buffers in `.exec()`
  // TODO: but actually, this should cause an error- use `example: '*'` for things like this.
  { example: [], actual: new Error('asdf'), error: true },

  ////////////////////////////////////////////
  // RECURSIVE OBJECTS
  ////////////////////////////////////////////

  // Missing keys (general case)
  { example: {a:1, b:'hi', c: false}, actual: {a: 11}, error: true  },
  { example: {a:1, b:'hi', c: false}, actual: {a: 23, b: undefined, c: undefined}, error: true  },
  { example: {a:1}, actual: {a: undefined}, error: true  },
  { example: {a:1}, actual: {}, error: true  },

  // Missing keys (`*` case)
  { example: {a:'*'}, actual: {a: undefined}, error: true  },
  { example: {a:'*'}, actual: {}, error: true  },

  // Strip keys with `undefined` values (`{}` case)
  { example: {}, actual: {a: undefined, b: 3}, result: {b: 3}  },
  { example: [{}], actual: [{a: undefined, b: 3}], result: [{b: 3}]  },
  { example: {x:{}}, actual: {x:{a: undefined, b: 3}}, result: {x:{b: 3}}  },

  // Don't strip keys with `undefined` values (`*` case)
  { example: '*', actual: {a: undefined, b: 3}, result: {a: undefined, b: 3}  },

  // Extra keys:
  { example: {a:1, b:'hi'}, actual: {a: 23, b: 'stuff', d: true}, result: {a: 23, b: 'stuff'}  },
  { example: {a:1, b:'hi'}, actual: {a: 23, b: 'stuff', d: undefined}, result: {a: 23, b: 'stuff'}  },

  ////////////////////////////////////////////
  // example: *
  ////////////////////////////////////////////

  { example: '*', actual: 'bar', result: 'bar',  },
  { example: '*', actual: '', result: '',  },
  { example: '*', actual: '-1.1', result: '-1.1',  },
  { example: '*', actual: 'NaN', result: 'NaN',  },
  { example: '*', actual: 'undefined', result: 'undefined',  },
  { example: '*', actual: 'null', result: 'null',  },
  { example: '*', actual: '-Infinity', result: '-Infinity',  },
  { example: '*', actual: 'Infinity', result: 'Infinity',  },
  { example: '*', actual: 'true', result: 'true',  },
  { example: '*', actual: 'false', result: 'false',  },
  { example: '*', actual: '0', result: '0',  },
  { example: '*', actual: '1', result: '1',  },

  { example: '*', actual: 0, result: 0,  },
  { example: '*', actual: 1, result: 1,  },
  { example: '*', actual: -1.1, result: -1.1,  },

  { example: '*', actual: true, result: true,  },
  { example: '*', actual: false, result: false,  },

  { example: '*', actual: {}, result: {},  },
  { example: '*', actual: {foo:'bar'}, result: {foo:'bar'},  },
  { example: '*', actual: {foo:{bar:{baz:{}}}}, result: {foo:{bar:{baz:{}}}},  },
  { example: '*', actual: {foo:['bar']}, result: {foo:['bar']},  },
  { example: '*', actual: {foo:{bar:{baz:[{}]}}}, result: {foo:{bar:{baz:[{}]}}},  },

  { example: '*', actual: [], result: [],  },
  { example: '*', actual: ['asdf'], result: ['asdf'],  },
  { example: '*', actual: [''], result: [''],  },
  { example: '*', actual: [235], result: [235],  },
  { example: '*', actual: [false], result: [false],  },
  { example: '*', actual: [{}], result: [{}],  },
  { example: '*', actual: [{foo:'bar'}], result: [{foo:'bar'}],  },

  { example: '*', actual: undefined, error: true  },

  { example: '*', actual: NaN, result: NaN,  },
  { example: '*', actual: Infinity, result: Infinity,  },
  { example: '*', actual: -Infinity, result: -Infinity,  },
  { example: '*', actual: null, result: null,  },






  //              $$\               $$\             $$\                                       $$$\               $$$\
  //              $$ |              \__|            $$ |                                     $$  _|               \$$\
  //   $$$$$$$\ $$$$$$\    $$$$$$\  $$\  $$$$$$$\ $$$$$$\          $$$$$$\   $$$$$$\        $$  /$$$$\ $$$$\ $$$$\ \$$\
  //  $$  _____|\_$$  _|  $$  __$$\ $$ |$$  _____|\_$$  _|        $$  __$$\ $$  __$$\       $$ | \____|\____|\____| $$ |
  //  \$$$$$$\    $$ |    $$ |  \__|$$ |$$ /        $$ |          $$$$$$$$ |$$ /  $$ |      $$ | $$$$\ $$$$\ $$$$\  $$ |
  //   \____$$\   $$ |$$\ $$ |      $$ |$$ |        $$ |$$\       $$   ____|$$ |  $$ |      \$$\ \____|\____|\____|$$  |
  //  $$$$$$$  |  \$$$$  |$$ |      $$ |\$$$$$$$\   \$$$$  |      \$$$$$$$\ \$$$$$$$ |       \$$$\               $$$  /
  //  \_______/    \____/ \__|      \__| \_______|   \____/        \_______| \____$$ |        \___|              \___/
  //                                                                              $$ |
  //                                                                              $$ |
  //                                                                              \__|
  //
  // (strictEq / isNew checks to assert for and
  //  against passing-by-reference in different
  //  situations)
  ////////////////////////////////////////////////

  { example: '*', actual: /some regexp/, strictEq: true },
  { example: '*', actual: function (){}, strictEq: true },
  { example: '*', actual: new Date('November 5, 1605 GMT'), strictEq: true },
  { example: '*', actual: new (require('stream').Readable)(), strictEq: true },
  { example: '*', actual: new Buffer('asdf'), strictEq: true },
  { example: '*', actual: new Error('asdf'), strictEq: true },


];


