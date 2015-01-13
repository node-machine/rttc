var assert = require('assert');
var coerce = require('../lib/coerce');

describe('Run-time type checking', function() {

  describe('type coercion', function() {

    it.skip('should coerce primitive value', function() {
      assert.strictEqual(coerce('string', 'string'), 'foo');
    });

  });

});
