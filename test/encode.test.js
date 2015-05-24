var util = require('util');
var assert = require('assert');
var _ = require('lodash');
var rttc = require('../');

describe('.encode()', function() {


  it('should return a string in the general case', function() {
    assert.strictEqual(typeof rttc.encode('foo'), 'string');
    assert.strictEqual(typeof rttc.encode(''), 'string');
    assert.strictEqual(typeof rttc.encode(2323), 'string');
    assert.strictEqual(typeof rttc.encode(true), 'string');
    assert.strictEqual(typeof rttc.encode(null), 'string');
    assert.strictEqual(typeof rttc.encode(Infinity), 'string');
    assert.strictEqual(typeof rttc.encode(-Infinity), 'string');
    assert.strictEqual(typeof rttc.encode(NaN), 'string');
    assert.strictEqual(typeof rttc.encode(new Error('wat')), 'string');
    assert.strictEqual(typeof rttc.encode(new Buffer('stuff')), 'string');
    assert.strictEqual(typeof rttc.encode({x:'foo',z: [{a:4}]}), 'string');
  });

  it('should return `"null"` (as a string) when attempting to encode `undefined` with `allowNull` enabled', function() {
    assert.strictEqual(rttc.encode(undefined, true), 'null');
  });

  it('should return `undefined` when attempting to encode `undefined` with `allowNull` disabled (or unspecified)', function() {
    assert(_.isUndefined(rttc.encode(undefined, false)));
    assert(_.isUndefined(rttc.encode(undefined)));
  });

});
