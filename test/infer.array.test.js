var assert = require('assert');
var infer = require('../lib/infer');

describe('Inferring types from example', function() {

  describe('when an array of primitives is used', function() {

    it('should parse an array with a single string', function() {
      var arr = ['foo'];
      var types = infer(arr);

      assert(Array.isArray(types));
      assert.strictEqual(types.length, 1);

      assert.strictEqual(types[0], 'string');
    });

    it('should parse an array with a single number', function() {
      var arr = [1];
      var types = infer(arr);

      assert(Array.isArray(types));
      assert.strictEqual(types.length, 1);

      assert.strictEqual(types[0], 'number');
    });

    it('should parse an array with a single `true`', function() {
      var arr = [true];
      var types = infer(arr);

      assert(Array.isArray(types));
      assert.strictEqual(types.length, 1);

      assert.strictEqual(types[0], 'boolean');
    });

    it('should parse an array with a single `false`', function() {
      var arr = [false];
      var types = infer(arr);

      assert(Array.isArray(types));
      assert.strictEqual(types.length, 1);

      assert.strictEqual(types[0], 'boolean');
    });

  });

  describe('when an array of objects is used', function() {

    it('should parse an array with a single level object', function() {
      var arr = [{
        foo: 'bar',
        bar: 3,
        baz: false
      }];

      var types = infer(arr);

      assert(Array.isArray(types));
      assert.strictEqual(types.length, 1);

      assert(types[0].foo);
      assert(types[0].bar);
      assert(types[0].baz);
      assert.strictEqual(types[0].foo, 'string');
      assert.strictEqual(types[0].bar, 'number');
      assert.strictEqual(types[0].baz, 'boolean');
    });

    it('should parse an array with a nested object', function() {
      var arr = [{
        foo: 'bar',
        bar: {
          foo: false,
          baz: {
            foo: 3
          }
        }
      }];

      var types = infer(arr);

      assert(Array.isArray(types));
      assert.strictEqual(types.length, 1);

      assert(types[0].foo);
      assert(types[0].bar);
      assert(types[0].bar.foo);
      assert(types[0].bar.baz);
      assert(types[0].bar.baz.foo);

      assert.strictEqual(types[0].foo, 'string');
      assert.strictEqual(types[0].bar.foo, 'boolean');
      assert.strictEqual(types[0].bar.baz.foo, 'number');
    });

    it('should parse an array with many nested objects', function() {
      var arr = [{
        foo: 'bar',
        bar: {
          foo: false,
          baz: {
            foo: 3,
            bar: {
              baz: 'hi'
            }
          }
        }
      }];

      var types = infer(arr);

      assert(Array.isArray(types));
      assert.strictEqual(types.length, 1);

      assert(types[0].foo);
      assert(types[0].bar);
      assert(types[0].bar.foo);
      assert(types[0].bar.baz);
      assert(types[0].bar.baz.foo);
      assert(types[0].bar.baz.bar);
      assert(types[0].bar.baz.bar.baz);

      assert.strictEqual(types[0].foo, 'string');
      assert.strictEqual(types[0].bar.foo, 'boolean');
      assert.strictEqual(types[0].bar.baz.foo, 'number');
      assert.strictEqual(types[0].bar.baz.bar.baz, 'string');
    });

  });

});
