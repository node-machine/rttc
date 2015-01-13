var assert = require('assert');
var coerce = require('../lib/coerce');

describe('Runtime type checking', function() {

  describe('.coerce()', function() {

    describe('to string', function() {
      it('should coerce undefined to base type', function() {
        assert.strictEqual(coerce('string', undefined), '');
      });
      it('should fail on null', function (){
        assert.throws(function (){
          coerce('string', null);
        });
      });
      it('should fail on NaN', function (){
        assert.throws(function (){
          coerce('string', NaN);
        });
      });
      it('should fail on Infinity', function (){
        assert.throws(function (){
          coerce('string', Infinity);
        });
      });
      it('should fail on -Infinity', function (){
        assert.throws(function (){
          coerce('string', -Infinity);
        });
      });
      it('should not touch arbitrary string', function() {
        assert.strictEqual(coerce('string', 'foo'), 'foo');
      });
      it('should not touch empty string', function() {
        assert.strictEqual(coerce('string', ''), '');
      });
      it('should not touch integerish string', function() {
        assert.strictEqual(coerce('string', '2382'), '2382');
      });
      it('should not touch negative integerish string', function() {
        assert.strictEqual(coerce('string', '-2382'), '-2382');
      });
      it('should not touch negative zeroish string', function() {
        assert.strictEqual(coerce('string', '0'), '0');
      });
      it('should not touch decimalish string', function() {
        assert.strictEqual(coerce('string', '1.325'), '1.325');
      });
      it('should not touch negative decimalish string', function() {
        assert.strictEqual(coerce('string', '-1.325'), '-1.325');
      });
      it('should coerce numbers to strings', function() {
        assert.strictEqual(coerce('string', 2382), '2382');
        assert.strictEqual(coerce('string', -2382), '-2382');
        assert.strictEqual(coerce('string', 0), '0');
        assert.strictEqual(coerce('string', 1.325), '1.325');
        assert.strictEqual(coerce('string', -1.325), '-1.325');
      });

    });

    describe('to number', function (){
      it('should fail on null', function (){
        assert.throws(function (){
          coerce('number', null);
        });
      });
      it('should fail on NaN', function (){
        assert.throws(function (){
          coerce('number', NaN);
        });
      });
      it('should fail on Infinity', function (){
        assert.throws(function (){
          coerce('number', Infinity);
        });
      });
      it('should fail on -Infinity', function (){
        assert.throws(function (){
          coerce('number', -Infinity);
        });
      });
      it('should not touch positive integer', function (){
        assert.strictEqual(coerce('number', 3), 3);
      });
      it('should not touch negative integer', function (){
        assert.strictEqual(coerce('number', -3), -3);
      });
      it('should not touch negative decimal', function (){
        assert.strictEqual(coerce('number', -3.2), -3.2);
      });
      it('should not touch zero', function (){
        assert.strictEqual(coerce('number', 0), 0);
      });
      it('should coerce "3.25" to 3.25', function() {
        assert.strictEqual(coerce('number', '3.25'), 3.25);
      });
      it('should coerce "-3.25" to -3.25', function() {
        assert.strictEqual(coerce('number', '-3.25'), -3.25);
      });
      it('should coerce "0" to 0', function() {
        assert.strictEqual(coerce('number', '0'), 0);
      });
    });

    describe('to boolean', function (){
      it('should fail on null', function (){
        assert.throws(function (){
          coerce('boolean', null);
        });
      });
      it('should fail on NaN', function (){
        assert.throws(function (){
          coerce('boolean', NaN);
        });
      });
      it('should fail on Infinity', function (){
        assert.throws(function (){
          coerce('boolean', Infinity);
        });
      });
      it('should fail on -Infinity', function (){
        assert.throws(function (){
          coerce('boolean', -Infinity);
        });
      });
      it('should not touch true', function() {
        assert.strictEqual(coerce('boolean', true), true);
      });
      it('should not touch false', function() {
        assert.strictEqual(coerce('boolean', false), false);
      });
      it('should coerce "true" to true', function() {
        assert.strictEqual(coerce('boolean', 'true'), true);
      });
      it('should coerce "false" to false', function() {
        assert.strictEqual(coerce('boolean', 'false'), false);
      });
    });

  });

});
