/**
 * Module dependencies
 */

var util = require('util');
var assert = require('assert');
var _ = require('lodash');
var rttc = require('../');



describe('.intersection()', function() {

  // Shortcut used below for convenience:
  var intersection = function (exemplar0, exemplar1){
    // Perform the standard, usual call to `rttc.intersection()`.
    return rttc.intersection(exemplar0, exemplar1, true, false);
  };


  describe('Type intersection: (using strict validation rules)', function() {


    // Types always intersect with themselves, with an identity result.
    describe('when intersected with the same type', function (){
      it('should result in an exemplar with the same type schema', function (){

        // 'string'  ∩  'string'          <====> 'string'
        assert.deepEqual('bar', intersection('foo', 'bar'));
        assert.deepEqual('foo', intersection('bar', 'foo'));

        // 'number'  ∩  'number'          <====> 'number'
        // 'boolean'  ∩  'boolean'        <====> 'boolean'
        // 'lamda'  ∩  'lamda'            <====> 'lamda'
        // {}  ∩  {}                      <====> {}
        // []  ∩  []                      <====> []
        // 'json'  ∩  'json'              <====> 'json'
        // 'ref'  ∩  'ref'                <====> 'ref'
      });
    });//</when intersected with the same type>


    // Every type intersects with "ref", with an identity result.
    describe('when intersected with "ref"', function (){
      it('every type should result in an identity result', function (){
        // 'string'     ∩  'ref'           <====> 'string'
        // 'number'     ∩  'ref'           <====> 'number'
        // 'boolean'    ∩  'ref'           <====> 'boolean'
        // {}           ∩  'ref'           <====> {}
        // []           ∩  'ref'           <====> []
        // {x:'string'} ∩  'ref'           <====> {x:'string'}
        // ['string']   ∩  'ref'           <====> ['string']
        // 'lamda'      ∩  'ref'           <====> 'lamda'
        // 'json'       ∩  'ref'           <====> 'json'
      });
    });


    // Every type except "ref" and "lamda" intersects with "json", with an identity result.
    describe('when intersected with "json"', function (){
      it('every type except "ref" and "lamda" should result in an identity result', function (){
        // 'string'     ∩  'json'          <====> 'string'
        // 'number'     ∩  'json'          <====> 'number'
        // 'boolean'    ∩  'json'          <====> 'boolean'
        // {}           ∩  'json'          <====> {}
        // []           ∩  'json'          <====> []
        // {x:'string'} ∩  'json'          <====> {x:'string'}
        // ['string']   ∩  'json'          <====> ['string']
      });
    });


    // // Strings, numbers, booleans, and lamdas do not intersect with each other,
    // // or with any sort of dictionary or array type.
    // 'string'  ∩  (anything else)    <==/==> (ERROR)
    // 'number'  ∩  (anything else)    <==/==> (ERROR)
    // 'boolean' ∩  (anything else)    <==/==> (ERROR)
    // 'lamda'   ∩  (anything else)    <==/==> (ERROR)

    // // Faceted dictionaries intersect with generic dictionaries, with an identity result.
    // {a:'string'} ∩ {}               <====> {a:'string'}
    // {a:{}} ∩ {}                     <====> {a:{}}

    // // Patterned arrays intersect with generic arrays, with an identity result.
    // ['string']  ∩  []               <====> ['string']
    // [[{}]]  ∩  []                   <====> [[{}]]
    // [{}]  ∩  ['string']             <====> ['string']

    // // Faceted dictionaries intersect with other faceted dictionaries as long as recursive
    // // types also successfully intersect. The result is the merged schema.
    // // (extra keys are ok, since they'll just be ignored)
    // {a:'string'} ∩ {a:'string',b:'string'}         <====> {a:'string', b: 'string'}
    // {x:'string'} ∩ {a:'string',b:'string'}         <====> {a:'string', b: 'string', x: 'string'}
    // {x:'string', a:'number'} ∩ {a:'string',b:'string'} <==/=> (ERROR)
    // {x:'string', a:'json'}   ∩ {a:'string',b:'string'} <====> {a:'string', b: 'string', x: 'string'}

    // // Patterned arrays intersect with other patterned arrays as long as the recursive
    // // types also successfully intersect.  The result is the merged schema.
    // ['number'] ∩ ['json']           <====> ['number']
    // ['number'] ∩ ['string']         <==/=> (ERROR)
    // [{a:'number'}] ∩ [{}]           <====> [{a:'number'}]

    // // Exceptions when NOT using strict validation:
    // 'number'    ∩  'string'        <====> 'number'
    // 'boolean'   ∩  'string'        <====> 'boolean'
    // 'number'    ∩  'boolean'       <====> 'boolean'


    // Special cases:
    describe('special cases', function (){
      it('inside a generic dictionary keypath: should act like `json`', function (){
        assert.deepEqual({ x: 'foo' }, intersection({ x: 'foo' }, {}));
        assert.deepEqual({ x: 'foo' }, intersection({}, { x: 'foo' }));
      });
      it('inside a generic array keypath: should act like `json`', function (){
        assert.deepEqual({ x: 'foo' }, intersection({ x: 'foo' }, []));
        assert.deepEqual({ x: 'foo' }, intersection({ x: 'foo' }, ['*']));
        assert.deepEqual({ x: 'foo' }, intersection([], { x: 'foo' }));
        assert.deepEqual({ x: 'foo' }, intersection(['*'], { x: 'foo' }));
      });
      it('inside a JSON keypath: should act like `json`', function (){
        assert.deepEqual({ x: 'foo' }, intersection({ x: 'foo' }, '*'));
        assert.deepEqual({ x: 'foo' }, intersection('*', { x: 'foo' }));
      });
      it('inside a ref keypath: should act like `ref`', function (){
        assert.deepEqual({ x: 'foo' }, intersection({ x: 'foo' }, '==='));
        assert.deepEqual({ x: 'foo' }, intersection('===', { x: 'foo' }));
      });
      it('inside any other keypath: should throw an error', function (){
        // TODO: come back to this
      });
    });//</special cases>


  });//</Type intersection: (using strict validation rules)>

});//</.intersection()>
