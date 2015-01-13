var assert = require('assert');
var infer = require('../lib/infer');

describe('Inferring types from example', function() {

  describe('when an object is used', function() {

    it('should parse a single level object', function() {
      var obj = {
        foo: 'bar',
        bar: 3,
        baz: false
      };

      var schema = infer(obj);

      assert(schema.foo);
      assert(schema.bar);
      assert(schema.baz);
      assert.strictEqual(schema.foo, 'string');
      assert.strictEqual(schema.bar, 'number');
      assert.strictEqual(schema.baz, 'boolean');
    });

    it('should parse a nested object', function() {
      var obj = {
        foo: 'bar',
        bar: {
          foo: false,
          baz: {
            foo: 3
          }
        }
      };

      var schema = infer(obj);

      assert(schema.foo);
      assert(schema.bar);
      assert(schema.bar.foo);
      assert(schema.bar.baz);
      assert(schema.bar.baz.foo);

      assert.strictEqual(schema.foo, 'string');
      assert.strictEqual(schema.bar.foo, 'boolean');
      assert.strictEqual(schema.bar.baz.foo, 'number');
    });

  });

});
