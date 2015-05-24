var util = require('util');
var assert = require('assert');
var _  = require('lodash');
var rttc = require('../');

describe('.decode()', function() {


  it('should accurately recreate encoded strings', function() {
    checkSerialization('stuff');
  });

  it('should accurately recreate encoded numbers', function (){
    checkSerialization(8232);
  });

  it('should accurately recreate encoded booleans', function (){
    checkSerialization(false);
  });

  it('should accurately recreate encoded dictionaries', function (){
    checkSerialization({});
    checkSerialization({foo:'bar'});
    checkSerialization({foo:{bar:'baz'}});
    checkSerialization({foo:{bar:['baz']}});
    checkSerialization({foo:[{bar:['baz']}]});
  });

  it('should accurately recreate encoded arrays', function (){
    checkSerialization([]);
    checkSerialization(['Arya Stark', 'Jon Snow']);
    checkSerialization([2932,138,11,424]);
    checkSerialization([true, true, false]);
    checkSerialization([true, true, false, null, null, false]);
    checkSerialization([{species: 'Hopidor maxim', weight: 23821394, isAvailable: true}]);
    checkSerialization([['baz']]);
    checkSerialization([{foo:[{bar:['baz']}]}]);
  });

  it('should accurately recreate encoded functions if a "lamda" `typeSchema` was provided and `unsafeMode` was enabled', function (){
    var original = function someFn(x,y,z){ return x + y - z + x + Math.pow(y,z); };
    var encoded = rttc.encode(original);
    var decoded = rttc.decode(encoded, 'lamda', true);
    assert(_.isFunction(decoded));

    assert.strictEqual(original(4,5,6), decoded(4,5,6));
  });

  it('should NOT accurately recreate encoded functions in the general case', function (){
    var original = function someFn(x,y,z){ return x + y - z + x + Math.pow(y,z); };
    var encoded = rttc.encode(original);
    var decoded = rttc.decode(encoded);
    assert(_.isString(decoded));

    assert.strictEqual(decoded, original.toString());
  });

  it('should NOT accurately recreate encoded Error(s)', function (){

  });

  it('should NOT accurately recreate encoded Date(s)', function (){

  });

  it('should NOT accurately recreate encoded RegExp(s)', function (){

  });


});



function checkSerialization(original) {
  var encoded = rttc.encode(original);
  var decoded = rttc.decode(encoded);
  assert.equal(decoded, original);
}
