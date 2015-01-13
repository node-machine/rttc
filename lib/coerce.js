/**
 * Module dependencies
 */

var _ = require('lodash');
var rttc = require('./rttc');
var infer = require('./infer');


module.exports = function coerce (expected, actual) {

  // Transform `expected` into rttc-compatible schema
  // e.g. {
  //   foo: { type: 'string', required: false },
  //   bar: { type: { baz: 'number' }, required: false }
  // }
  var rttcSchema = {
    x: {
      type: infer(expected)
    }
  };

  // Transform `actual` into rttc-compatible value set
  // e.g. {
  //   foo: 'asdga'
  //   bar: { baz: 32 }
  // }
  var rttcValueSet = {
    x: actual
  };

  return rttc(rttcSchema, rttcValueSet, {
    coerce: true
  }).x;
};
