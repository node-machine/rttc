var util = require('util');
var assert = require('assert');
var _ = require('lodash');
var rttc = require('../');

describe('.stringifyHuman()', function() {


  it('should coerce things to match the type schema, but as strings', function() {

    assert.strictEqual(  rttc.stringifyHuman('foo', 'string'), 'foo');
    assert.strictEqual(  rttc.stringifyHuman('', 'string'), '');
    assert.strictEqual(  rttc.stringifyHuman('4', 'string'), '4');
    assert.strictEqual(  rttc.stringifyHuman('-99', 'string'), '-99');
    assert.strictEqual(  rttc.stringifyHuman('Infinity', 'string'), 'Infinity');
    assert.strictEqual(  rttc.stringifyHuman('-Infinity', 'string'), '-Infinity');
    assert.strictEqual(  rttc.stringifyHuman('NaN', 'string'), 'NaN');
    assert.strictEqual(  rttc.stringifyHuman('true', 'string'), 'true');
    assert.strictEqual(  rttc.stringifyHuman('false', 'string'), 'false');
    assert.strictEqual(  rttc.stringifyHuman('foo', 'json'), '"foo"');
    assert.strictEqual(  rttc.stringifyHuman('', 'json'), '""');
    assert.strictEqual(  rttc.stringifyHuman('4', 'json'), '"4"');
    assert.strictEqual(  rttc.stringifyHuman('-99', 'json'), '"-99"');
    assert.strictEqual(  rttc.stringifyHuman('true', 'json'), '"true"');
    assert.strictEqual(  rttc.stringifyHuman('false', 'json'), '"false"');
    assert.strictEqual(  rttc.stringifyHuman('null', 'json'), '"null"');
    assert.strictEqual(  rttc.stringifyHuman('foo', 'ref'), '"foo"');
    assert.strictEqual(  rttc.stringifyHuman('', 'ref'), '""');
    assert.strictEqual(  rttc.stringifyHuman('4', 'ref'), '"4"');
    assert.strictEqual(  rttc.stringifyHuman('-99', 'ref'), '"-99"');
    assert.strictEqual(  rttc.stringifyHuman('true', 'ref'), '"true"');
    assert.strictEqual(  rttc.stringifyHuman('false', 'ref'), '"false"');
    assert.strictEqual(  rttc.stringifyHuman('null', 'ref'), '"null"');

    assert.strictEqual(  rttc.stringifyHuman(4, 'number'), '4');
    assert.strictEqual(  rttc.stringifyHuman(10.345, 'number'), '10.345');
    assert.strictEqual(  rttc.stringifyHuman(-99, 'number'), '-99');
    assert.strictEqual(  rttc.stringifyHuman(Math.PI, 'number'), '3.141592653589793');
    assert.strictEqual(  rttc.stringifyHuman(4, 'json'), '4');
    assert.strictEqual(  rttc.stringifyHuman(10.345, 'json'), '10.345');
    assert.strictEqual(  rttc.stringifyHuman(-99, 'json'), '-99');
    assert.strictEqual(  rttc.stringifyHuman(Math.PI, 'json'), '3.141592653589793');
    assert.strictEqual(  rttc.stringifyHuman(4, 'ref'), '4');
    assert.strictEqual(  rttc.stringifyHuman(10.345, 'ref'), '10.345');
    assert.strictEqual(  rttc.stringifyHuman(-99, 'ref'), '-99');
    assert.strictEqual(  rttc.stringifyHuman(Math.PI, 'ref'), '3.141592653589793');

    assert.strictEqual(  rttc.stringifyHuman(false, 'boolean'), 'false');
    assert.strictEqual(  rttc.stringifyHuman(true, 'boolean'), 'true');
    assert.strictEqual(  rttc.stringifyHuman(true, 'json'), 'true');
    assert.strictEqual(  rttc.stringifyHuman(false, 'json'), 'false');
    assert.strictEqual(  rttc.stringifyHuman(true, 'ref'), 'true');
    assert.strictEqual(  rttc.stringifyHuman(false, 'ref'), 'false');

    assert.strictEqual(  rttc.stringifyHuman({}, {}),     '{}');
    assert.strictEqual(  rttc.stringifyHuman({}, 'json'), '{}');
    assert.strictEqual(  rttc.stringifyHuman({}, 'ref'),  '{}');

    assert.strictEqual(  rttc.stringifyHuman([], []),     '[]');
    assert.strictEqual(  rttc.stringifyHuman([], 'json'), '[]');
    assert.strictEqual(  rttc.stringifyHuman([], 'ref'),  '[]');

    assert.strictEqual(  rttc.stringifyHuman(function asdf(){}, 'lamda'), 'function asdf(){}');

    assert.strictEqual(  rttc.stringifyHuman(null, 'json'), 'null');
    assert.strictEqual(  rttc.stringifyHuman(null, 'ref'), 'null');
  });

  it('should add quotes to strings when type schema is "json"', function() {
    assert.strictEqual(rttc.stringifyHuman('stuff', 'json'), '"stuff"' );
  });

  it('should add NOT quotes to numbers, booleans, dictionaries, arrays, or `null` when type schema is "json"', function() {
    assert.strictEqual(rttc.stringifyHuman(3, 'json'), '3' );
    assert.strictEqual(rttc.stringifyHuman(true, 'json'), 'true' );
    assert.strictEqual(rttc.stringifyHuman({}, 'json'), '{}' );
    assert.strictEqual(rttc.stringifyHuman([], 'json'), '[]' );
    assert.strictEqual(rttc.stringifyHuman(null, 'json'), 'null' );
  });
  it('should tolerate `null` for "json" type schemas', function() {
    assert.strictEqual( rttc.stringifyHuman(null, 'json'), 'null');
    // assert.strictEqual( rttc.stringifyHuman([null], ['json']), ['null'] );
    // assert.strictEqual( rttc.stringifyHuman([null], ['ref']), ['null']);
    // assert.strictEqual( rttc.stringifyHuman({x:null}, {x:'json'}), {x:'null'} );
    // assert.strictEqual( rttc.stringifyHuman({x:null}, {x:'ref'}), {x:'null'} );
  });
  it('should tolerate `null` for "ref" type schemas', function() {
    assert.strictEqual( rttc.stringifyHuman(null, 'ref'), 'null' );
  });
  it('should tolerate `null` for type schemas w/ nested "json" types', function() {
    // assert.strictEqual( rttc.stringifyHuman([null], ['json']), ['null'] );
    // assert.strictEqual( rttc.stringifyHuman([null], ['ref']), ['null']);
  });
  it('should tolerate `null` for type schemas w/ nested "ref" types', function() {
    // assert.strictEqual( rttc.stringifyHuman({x:null}, {x:'json'}), {x:'null'} );
    // assert.strictEqual( rttc.stringifyHuman({x:null}, {x:'ref'}), {x:'null'} );
  });
  it('should NOT tolerate `null` for {} or [] type schemas', function() {
    assert.throws(function (){
      rttc.stringifyHuman(null, {});
    });
    assert.throws(function (){
      rttc.stringifyHuman(null, []);
    });
    assert.throws(function (){
      rttc.stringifyHuman([null], [{}]);
    });
    assert.throws(function (){
      rttc.stringifyHuman([null], [[]]);
    });
    assert.throws(function (){
      rttc.stringifyHuman({x:null}, {x:{}});
    });
    assert.throws(function (){
      rttc.stringifyHuman({x:null}, {x:[]});
    });
  });

  it('should dehydrate functions (if we have a lamda type schema)', function() {
    assert(
      rttc.isEqual(rttc.stringifyHuman(function foo (){}, 'lamda'), 'function foo(){}', 'lamda')
    );
  });


  it('should dehydrate nested functions (if we have a type schema w/ nested lamdas in the appropriate places)', function() {
    assert.equal(
      rttc.stringifyHuman({x:function foo (){}}, {x:'lamda'}),
      '{"x":"function foo(){}"}'
    );
    assert.equal(
      rttc.stringifyHuman({x:{y:function foo (){}}}, {x:{y:'lamda'}}),
      '{"x":{"y":"function foo(){}"}}'
    );
    assert.equal(
      rttc.stringifyHuman([{x:{y:function foo (){}}}], [{x:{y:'lamda'}}]),
      '[{"x":{"y":"function foo(){}"}}]'
    );
    assert.equal(
      rttc.stringifyHuman([function foo (){}], ['lamda']),
      '["function foo(){}"]'
    );
  });


  describe('edge-cases', function (){

    it('should refuse to work if not provided a type schema', function() {
      assert.throws(function (){
        rttc.stringifyHuman(4);
      });
    });

    describe('stringification cannot be safely reversed', function(){

      // Against `json`
      it('should throw when given a function against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(function asdf(){}, 'ref');
        });
      });
      it('should throw when given an Error against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Error('foo'), 'ref');
        });
      });
      it('should throw when given a Date against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Date('foo'), 'ref');
        });
      });
      it('should throw when given a RegExp against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(/sadg/g, 'ref');
        });
      });
      it('should throw when given a Stream against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new (require('stream').Readable)(), 'ref');
        });
        assert.throws(function (){
          rttc.stringifyHuman(new (require('stream').Stream)(), 'ref');
        });
      });
      it('should throw when given a Buffer against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Buffer(), 'ref');
        });
      });
      it('should throw when given Infinity, -Infinity, or NaN against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(Infinity, 'ref');
        });
        assert.throws(function (){
          rttc.stringifyHuman(-Infinity, 'ref');
        });
        assert.throws(function (){
          rttc.stringifyHuman(NaN, 'ref');
        });
      });

      // Against `json`
      it('should throw when given a function against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(function asdf(){}, 'json');
        });
      });
      it('should throw when given an Error against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Error('foo'), 'json');
        });
      });
      it('should throw when given a Date against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Date('foo'), 'json');
        });
      });
      it('should throw when given a RegExp against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(/sadg/g, 'json');
        });
      });
      it('should throw when given a Stream against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new (require('stream').Readable)(), 'json');
        });
        assert.throws(function (){
          rttc.stringifyHuman(new (require('stream').Stream)(), 'json');
        });
      });
      it('should throw when given a Buffer against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Buffer(), 'json');
        });
      });
      it('should throw when given Infinity, -Infinity, or NaN against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(Infinity, 'json');
        });
        assert.throws(function (){
          rttc.stringifyHuman(-Infinity, 'json');
        });
        assert.throws(function (){
          rttc.stringifyHuman(NaN, 'json');
        });
      });
    });

    it('should refuse to work if value does not strictly validate against type schema', function() {
      assert.throws(function (){
        rttc.stringifyHuman('whatever', 'lamda');
      });
      assert.throws(function (){
        rttc.stringifyHuman('whatever', 'boolean');
      });
      assert.throws(function (){
        rttc.stringifyHuman(4, 'boolean');
      });
      assert.throws(function (){
        rttc.stringifyHuman(4, 'string');
      });
      assert.throws(function (){
        rttc.stringifyHuman('4', 'number');
      });
      assert.throws(function(){
        rttc.stringifyHuman(function asdf(){}, 'json');
      });
    });

  });

});
