var assert = require('assert');
var infer = require('../../lib/infer');
var rttc = require('../../lib/rttc');

describe('Runtime type checking', function() {
  describe('input coercion', function() {

    describe('with boolean', function() {

      // Build an example input schema
      var inputSchema = {
        foo: {
          type: 'boolean',
        }
      };

      ////////////////////////////////
      // Valid
      ////////////////////////////////

      it('should validate and coerce when the boolean true is used', function() {
        var test = {
          foo: true
        };

        assert.doesNotThrow(function() {
          rttc(inputSchema, test, {coerce: true});
        });
      });

      it('should validate and coerce when the boolean false is used', function() {
        var test = {
          foo: true
        };

        assert.doesNotThrow(function() {
          rttc(inputSchema, test, {coerce: true});
        });
      });

      it('should validate and coerce when the string "true" is used', function() {
        var test = {
          foo: 'true'
        };

        assert.doesNotThrow(function() {
          rttc(inputSchema, test, {coerce: true});
        });
      });

      it('should validate and coerce when the string "false" is used', function() {
        var test = {
          foo: 'false'
        };

        assert.doesNotThrow(function() {
          rttc(inputSchema, test, {coerce: true});
        });
      });

      it('should validate and coerce when the string "1" is used', function() {
        var test = {
          foo: '1'
        };

        assert.doesNotThrow(function() {
          rttc(inputSchema, test, {coerce: true});
        });
      });

      it('should validate and coerce when the string "0" is used', function() {
        var test = {
          foo: '0'
        };

        assert.doesNotThrow(function() {
          rttc(inputSchema, test, {coerce: true});
        });
      });

      it('should validate and coerce when the number 1 is used', function() {
        var test = {
          foo: 1
        };

        assert.doesNotThrow(function() {
          rttc(inputSchema, test, {coerce: true});
        });
      });

      it('should validate and coerce when the number 0 is used', function() {
        var test = {
          foo: 0
        };

        assert.doesNotThrow(function() {
          rttc(inputSchema, test, {coerce: true});
        });
      });

      it('should validate and coerce when the number 1 is used', function() {
        var test = {
          foo: 1
        };

        assert.doesNotThrow(function() {
          rttc(inputSchema, test, {coerce: true});
        });
      });


      ////////////////////////////////
      // Invalid
      ////////////////////////////////

      it('should not validate when the number 2 is used', function() {
        var test = {
          foo: 2
        };

        assert.throws(function() {
          rttc(inputSchema, test, {coerce: true});
        }, Error);
      });

      it('should not validate when null is used', function() {
        var test = {
          foo: null
        };

        assert.throws(function() {
          rttc(inputSchema, test, {coerce: true});
        }, Error);
      });

      it('should not validate when the string "T" is used', function() {
        var test = {
          foo: 'T'
        };

        assert.throws(function() {
          rttc(inputSchema, test, {coerce: true});
        }, Error);
      });

      it('should not validate when the string "t" is used', function() {
        var test = {
          foo: 't'
        };

        assert.throws(function() {
          rttc(inputSchema, test, {coerce: true});
        }, Error);
      });

      it('should not validate when the string "F" is used', function() {
        var test = {
          foo: 'F'
        };

        assert.throws(function() {
          rttc(inputSchema, test, {coerce: true});
        }, Error);
      });

      it('should not validate when the string "f" is used', function() {
        var test = {
          foo: 'f'
        };

        assert.throws(function() {
          rttc(inputSchema, test, {coerce: true});
        }, Error);
      });

      it('should not validate when the string "TRUE" is used', function() {
        var test = {
          foo: 'TRUE'
        };

        assert.throws(function() {
          rttc(inputSchema, test, {coerce: true});
        }, Error);
      });

      it('should not validate when the string "FALSE" is used', function() {
        var test = {
          foo: 'FALSE'
        };

        assert.throws(function() {
          rttc(inputSchema, test, {coerce: true});
        }, Error);
      });


    });
  });
});
