var util = require('util');
var assert = require('assert');
var _  = require('lodash');
var rttc = require('../');

describe('.isEqual()', function() {

  // TODO: test that this doesn't go nuts given circular objects


  it('should accurately match strings', function() {
    assert(rttc.isEqual('stuff', 'stuff'));
    assert(rttc.isEqual('', ''));
  });

  it('should accurately match numbers', function (){
    assert(rttc.isEqual(8232, 8232));
    assert(rttc.isEqual(0, -0));
  });

  it('should accurately match booleans', function (){
    assert(rttc.isEqual(false, false));
    assert(rttc.isEqual(true, true));
  });

  it('should accurately match dictionaries', function (){
    assert(rttc.isEqual({}, {}));
    assert(rttc.isEqual({foo:'bar'}, {foo:'bar'}));
    assert(rttc.isEqual({foo:{bar:'baz'}}, {foo:{bar:'baz'}}));
    assert(rttc.isEqual({foo:{bar:['baz']}}, {foo:{bar:['baz']}}));
    assert(rttc.isEqual({foo:[{bar:['baz']}]}, {foo:[{bar:['baz']}]}));
  });

  it('should accurately match arrays', function (){
    assert(rttc.isEqual([], []));
    assert(rttc.isEqual(['Arya Stark', 'Jon Snow'], ['Arya Stark', 'Jon Snow']));
    assert(rttc.isEqual([2932,138,11,424], [2932,138,11,424]));
    assert(rttc.isEqual([true, true, false], [true, true, false]));
    assert(rttc.isEqual([true, true, false, false], [true, true, false, false]));
    assert(rttc.isEqual([{species: 'Hopidor maxim', weight: 23821394, isAvailable: true}], [{species: 'Hopidor maxim', weight: 23821394, isAvailable: true}]));
    assert(rttc.isEqual([['baz']], [['baz']]));
    assert(rttc.isEqual([{foo:[{bar:['baz']}]}], [{foo:[{bar:['baz']}]}]));
  });

  it('should fail to match functions when no type schema is provided (nested and at the top-level)', function (){
    assert.throws(function (){
      assert(rttc.isEqual(function (){}, function (){}));
    });
    assert.throws(function (){
      assert(rttc.isEqual(function foo(){}, function foo(){}));
    });
    assert.throws(function (){
      assert(rttc.isEqual(function foo(x){}, function foo(x){}));
    });
    assert.throws(function (){
      assert(rttc.isEqual(function foo(x){return x+1;}, function foo(x){return x+1;}));
    });
    assert.throws(function (){
      assert(rttc.isEqual([function foo(x){return x+1;}], [function foo(x){return x+1;}]));
    });
    assert.throws(function (){
      assert(rttc.isEqual([{fn: function foo(x){return x+1;}}, {fn: function bar(x){return x+1;}}], [{fn:function foo(x){return x+1;}}, {fn: function bar(x){return x+1;}}]));
    });
  });


  it('should accurately match functions (nested and at the top-level)', function (){
    assert(rttc.isEqual(function (){}, function (){}, 'lamda'));
    assert(rttc.isEqual(function foo(){}, function foo(){}, 'lamda'));
    assert(rttc.isEqual(function foo(x){}, function foo(x){}, 'lamda'));
    assert(rttc.isEqual(function foo(x){return x+1;}, function foo(x){return x+1;}, 'lamda'));
    assert(rttc.isEqual([function foo(x){return x+1;}], [function foo(x){return x+1;}], ['lamda']));


    assert(rttc.isEqual([{
      fn: function foo(x) {
        return x + 1;
      }
    }, {
      fn: function bar(x) {
        return x + 1;
      }
    }], [{
      fn: function foo(x) {
        return x + 1;
      }
    }, {
      fn: function bar(x) {
        return x + 1;
      }
    }], [{
      fn: 'lamda'
    }]), 'expected rttc.isEqual() to accurately declare nested lamda fns as equal when a type schema is provided');
  });

});

