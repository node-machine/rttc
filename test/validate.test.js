var assert = require('assert');
var validate = require('../lib/validate');

describe('Runtime type checking', function() {

  describe('.validate()', function() {

    describe('to string', function() {
      it('should fail on null', function (){
        assert.throws(function (){
          validate('string', null);
        });
      });
      it('should fail on NaN', function (){
        assert.throws(function (){
          validate('string', NaN);
        });
      });
      it('should fail on Infinity', function (){
        assert.throws(function (){
          validate('string', Infinity);
        });
      });
      it('should fail on -Infinity', function (){
        assert.throws(function (){
          validate('string', -Infinity);
        });
      });
      it('should coerce undefined to base type', function() {
        assert.strictEqual(validate('string', undefined), '');
      });
      it('should not touch arbitrary string', function() {
        assert.strictEqual(validate('string', 'foo'), 'foo');
      });
      it('should not touch empty string', function() {
        assert.strictEqual(validate('string', ''), '');
      });
      it('should not touch integerish string', function() {
        assert.strictEqual(validate('string', '2382'), '2382');
      });
      it('should not touch negative integerish string', function() {
        assert.strictEqual(validate('string', '-2382'), '-2382');
      });
      it('should not touch negative zeroish string', function() {
        assert.strictEqual(validate('string', '0'), '0');
      });
      it('should not touch decimalish string', function() {
        assert.strictEqual(validate('string', '1.325'), '1.325');
      });
      it('should not touch negative decimalish string', function() {
        assert.strictEqual(validate('string', '-1.325'), '-1.325');
      });
      it('should coerce numbers to strings', function() {
        assert.strictEqual(validate('string', 2382), '2382');
        assert.strictEqual(validate('string', -2382), '-2382');
        assert.strictEqual(validate('string', 0), '0');
        assert.strictEqual(validate('string', 1.325), '1.325');
        assert.strictEqual(validate('string', -1.325), '-1.325');
      });

    });

    describe('to number', function (){
      it('should fail on null', function (){
        assert.throws(function (){
          validate('number', null);
        });
      });
      it('should fail on NaN', function (){
        assert.throws(function (){
          validate('number', NaN);
        });
      });
      it('should fail on Infinity', function (){
        assert.throws(function (){
          validate('number', Infinity);
        });
      });
      it('should fail on -Infinity', function (){
        assert.throws(function (){
          validate('number', -Infinity);
        });
      });
      it('should coerce undefined to base type', function() {
        assert.strictEqual(validate('number', undefined), 0);
      });
      it('should not touch positive integer', function (){
        assert.strictEqual(validate('number', 3), 3);
      });
      it('should not touch negative integer', function (){
        assert.strictEqual(validate('number', -3), -3);
      });
      it('should not touch negative decimal', function (){
        assert.strictEqual(validate('number', -3.2), -3.2);
      });
      it('should not touch zero', function (){
        assert.strictEqual(validate('number', 0), 0);
      });
      it('should coerce "3.25" to 3.25', function() {
        assert.strictEqual(validate('number', '3.25'), 3.25);
      });
      it('should coerce "-3.25" to -3.25', function() {
        assert.strictEqual(validate('number', '-3.25'), -3.25);
      });
      it('should coerce "0" to 0', function() {
        assert.strictEqual(validate('number', '0'), 0);
      });
    });

    describe('to boolean', function (){
      it('should fail on null', function (){
        assert.throws(function (){
          validate('boolean', null);
        });
      });
      it('should fail on NaN', function (){
        assert.throws(function (){
          validate('boolean', NaN);
        });
      });
      it('should fail on Infinity', function (){
        assert.throws(function (){
          validate('boolean', Infinity);
        });
      });
      it('should fail on -Infinity', function (){
        assert.throws(function (){
          validate('boolean', -Infinity);
        });
      });
      it('should coerce undefined to base type', function() {
        assert.strictEqual(validate('boolean', undefined), false);
      });
      it('should not touch true', function() {
        assert.strictEqual(validate('boolean', true), true);
      });
      it('should not touch false', function() {
        assert.strictEqual(validate('boolean', false), false);
      });
      it('should coerce "true" to true', function() {
        assert.strictEqual(validate('boolean', 'true'), true);
      });
      it('should coerce "false" to false', function() {
        assert.strictEqual(validate('boolean', 'false'), false);
      });
    });

  });

});

