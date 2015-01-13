var assert = require('assert');
var infer = require('../lib/infer');

describe('Inferring schema from example', function() {

  describe('when an array of primitives is used', function() {

    it('should parse an array with a single string', function() {
      var arr = ['foo'];
      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert.strictEqual(schema[0], 'string');
    });

    it('should parse an array with a single number', function() {
      var arr = [1];
      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert.strictEqual(schema[0], 'number');
    });

    it('should parse an array with a single `true`', function() {
      var arr = [true];
      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert.strictEqual(schema[0], 'boolean');
    });

    it('should parse an array with a single `false`', function() {
      var arr = [false];
      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert.strictEqual(schema[0], 'boolean');
    });

  });

  describe('when an array of objects is used', function() {

    it('should parse an array with a single level object', function() {
      var arr = [{
        foo: 'bar',
        bar: 3,
        baz: false
      }];

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(schema[0].foo);
      assert(schema[0].bar);
      assert(schema[0].baz);
      assert.strictEqual(schema[0].foo, 'string');
      assert.strictEqual(schema[0].bar, 'number');
      assert.strictEqual(schema[0].baz, 'boolean');
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

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(schema[0].foo);
      assert(schema[0].bar);
      assert(schema[0].bar.foo);
      assert(schema[0].bar.baz);
      assert(schema[0].bar.baz.foo);

      assert.strictEqual(schema[0].foo, 'string');
      assert.strictEqual(schema[0].bar.foo, 'boolean');
      assert.strictEqual(schema[0].bar.baz.foo, 'number');
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

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(schema[0].foo);
      assert(schema[0].bar);
      assert(schema[0].bar.foo);
      assert(schema[0].bar.baz);
      assert(schema[0].bar.baz.foo);
      assert(schema[0].bar.baz.bar);
      assert(schema[0].bar.baz.bar.baz);

      assert.strictEqual(schema[0].foo, 'string');
      assert.strictEqual(schema[0].bar.foo, 'boolean');
      assert.strictEqual(schema[0].bar.baz.foo, 'number');
      assert.strictEqual(schema[0].bar.baz.bar.baz, 'string');
    });

    it('should parse an array with a nested array', function() {
      var arr = [['foo']];

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(Array.isArray(schema[0]));
      assert.strictEqual(schema[0].length, 1);

      assert(schema[0][0].foo);

      assert.strictEqual(schema[0][0].foo, 'string');
    });

    it('should parse an array with a nested array of nested objects', function() {
      var arr = [
        [{
          foo: {
            baz: 235,
            mom: {
              name: 'Melinda'
            }
          },
          bar: false
        }]
      ];

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(Array.isArray(schema[0]));
      assert.strictEqual(schema[0].length, 1);

      assert(schema[0][0].bar);
      assert(schema[0][0].foo);
      assert(schema[0][0].foo.baz);
      assert(schema[0][0].foo.mom);
      assert(schema[0][0].foo.mom.name);

      assert.strictEqual(schema[0][0].bar, 'boolean');
      assert.strictEqual(schema[0][0].foo.baz, 'number');
      assert.strictEqual(schema[0][0].foo.mom, 'string');
    });

  });

});
