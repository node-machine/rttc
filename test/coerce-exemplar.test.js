var util = require('util');
var assert = require('assert');
var _ = require('lodash');
var rttc = require('../');

describe('.coerceExemplar()', function() {

  it('should coerce all `null` into "*"', function() {
    verifyDeep(rttc.coerceExemplar(null), '*');
  });

  it('should return "===" if `undefined` is specified at the top-level', function (){
    assert.equal(rttc.coerceExemplar(undefined), '===');
  });

  it('should strip nested keys and items w/ undefined values (but keep `null`)', function() {
    verifyDeep(rttc.coerceExemplar({numDandelions: 1, numAmaranth: 2, numLambsQuarters: undefined, numThistle: 4}), {numDandelions: 1, numAmaranth: 2, numThistle: 4});
    verifyDeep(rttc.coerceExemplar({numDandelions: [undefined], numAmaranth: 2, numLambsQuarters: undefined, numThistle: 4}), {numDandelions: [], numAmaranth: 2, numThistle: 4});
    verifyDeep(rttc.coerceExemplar({numDandelions: [null], numAmaranth: 2, numLambsQuarters: null, numThistle: 4}), {numDandelions: ['*'], numAmaranth: 2, numLambsQuarters: '*', numThistle: 4});
  });





});



/**
 * [verifyDeep description]
 * @param  {[type]} actual   [description]
 * @param  {[type]} expected [description]
 * @return {[type]}          [description]
 */
function verifyDeep(actual, expected){
  assert.deepEqual(actual, expected, util.format('got %s  but should have gotten %s', util.inspect(actual, {depth: null}), util.inspect(expected, {depth: null})) );
  assert.deepEqual({x: actual}, {x:expected}, util.format('got %s  but should have gotten %s', util.inspect({x: actual}, {depth: null}), util.inspect({x:expected}, {depth: null})) );
  assert.deepEqual({x: [actual]}, {x:[expected]}, util.format('got %s  but should have gotten %s', util.inspect({x: [actual]}, {depth: null}), util.inspect({x:[expected]}, {depth: null})) );
  assert.deepEqual([{x: actual}], [{x:expected}], util.format('got %s  but should have gotten %s', util.inspect([{x: actual}], {depth: null}), util.inspect([{x:expected}], {depth: null})) );
  assert.deepEqual([actual], [expected], util.format('got %s  but should have gotten %s', util.inspect([actual], {depth: null}), util.inspect([expected], {depth: null})) );
  assert.deepEqual([[actual]], [[expected]], util.format('got %s  but should have gotten %s', util.inspect([[actual]], {depth: null}), util.inspect([[expected]], {depth: null})) );
}
