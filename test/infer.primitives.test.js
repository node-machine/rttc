var assert = require('assert');
var infer = require('../lib/infer');

describe('Inferring types from example', function() {

  describe('when primitive values are used', function() {

    it('should set type "string"', function() {
      var type = infer('foo');
      assert.strictEqual(type, 'string');

      type = infer('');
      assert.strictEqual(type, 'string');
    });

    it('should set type "number"', function() {
      var type = infer(5);
      assert.strictEqual(type, 'number');

      infer(-5);
      assert.strictEqual(type, 'number');

      infer(0);
      assert.strictEqual(type, 'number');

      infer(5.3);
      assert.strictEqual(type, 'number');

      infer(-5.2);
      assert.strictEqual(type, 'number');
    });

    it('should set type "boolean"', function() {
      var type = infer(false);
      assert.strictEqual(type, 'boolean');

      type = infer(true);
      assert.strictEqual(type, 'boolean');
    });

  });

});
