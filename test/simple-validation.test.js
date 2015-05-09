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
      it('should choke on `undefined`', function() {
        assert.throws(function (){
          validate('string', undefined);
        });
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
      it('should choke on numbers', function() {
        assert.throws(function (){
          validate('string', undefined);
        });
        assert.throws(function (){
          validate('string', 2382);
        });
        assert.throws(function (){
          validate('string', -2382);
        });
        assert.throws(function (){
          validate('string', 0);
        });
        assert.throws(function (){
          validate('string', 1.325);
        });
        assert.throws(function (){
          validate('string', -1.325);
        });
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
      it('should choke on `undefined`', function() {
        assert.throws(function (){
          validate('number', undefined);
        });
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
      it('should choke on "3.25"', function() {
        assert.throws(function(){
          validate('number', '3.25');
        });
      });
      it('should choke on "-3.25"', function() {
        assert.throws(function(){
          validate('number', '-3.25');
        });
      });
      it('should choke on "0"', function() {
        assert.throws(function(){
          validate('number', '0');
        });
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
      it('should choke on `undefined`', function() {
        assert.throws(function (){
          validate('boolean', undefined);
        });
      });
      it('should not touch true', function() {
        assert.strictEqual(validate('boolean', true), true);
      });
      it('should not touch false', function() {
        assert.strictEqual(validate('boolean', false), false);
      });
      it('should choke on "true"', function() {
        assert.throws(function (){
          validate('boolean', 'true');
        });
      });
      it('should choke on "false"', function() {
        assert.throws(function (){
          validate('boolean', 'false');
        });
      });
    });

  });

});

