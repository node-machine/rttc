var assert = require('assert');
var coerce = require('../lib/coerce');

describe('Run-time type checking', function() {

  describe('.coerce()', function() {

    describe('to string', function() {
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
    });

    describe('to number', function (){
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
    });

    describe('to boolean', function (){
      it('should not touch true', function() {
        assert.strictEqual(coerce('boolean', true), true);
      });
      it('should not touch false', function() {
        assert.strictEqual(coerce('boolean', false), false);
      });
    });

  });

});
