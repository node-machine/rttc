var util = require('util');
var assert = require('assert');
var _ = require('lodash');
var rttc = require('../');

describe('.getDisplayType()', function() {


  it('should always return a string', function() {
    assert.strictEqual(typeof rttc.getDisplayType('foo'), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(''), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(2323), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(true), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(null), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(Infinity), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(-Infinity), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(NaN), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(new Error('wat')), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(new Buffer('stuff')), 'string');
    assert.strictEqual(typeof rttc.getDisplayType({x:'foo',z: [{a:4}]}), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(undefined, true), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(undefined, false), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(undefined), 'string');
  });

});
