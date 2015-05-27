// var util = require('util');
// var assert = require('assert');
// var _ = require('lodash');
// var rttc = require('../');

// describe('.sample()', function() {


//   it('should generate a type that matches', function() {

//     assert(  rttc.stringifyHuman('foo', 'string')       );
//     assert(  rttc.stringifyHuman('', 'string')       );
//     assert(  rttc.stringifyHuman('4', 'string')       );
//     assert(  rttc.stringifyHuman('-99', 'string')       );
//     assert(  rttc.stringifyHuman('Infinity', 'string')       );
//     assert(  rttc.stringifyHuman('-Infinity', 'string')       );
//     assert(  rttc.stringifyHuman('NaN', 'string')       );
//     assert(  rttc.stringifyHuman('true', 'string')       );
//     assert(  rttc.stringifyHuman('false', 'string')       );
//     assert(  rttc.stringifyHuman('foo', 'json')       );
//     assert(  rttc.stringifyHuman('', 'json')       );
//     assert(  rttc.stringifyHuman('4', 'json')       );
//     assert(  rttc.stringifyHuman('-99', 'json')       );
//     assert(  rttc.stringifyHuman('true', 'json')       );
//     assert(  rttc.stringifyHuman('false', 'json')       );
//     assert(  rttc.stringifyHuman('null', 'json')       );
//     assert(  rttc.stringifyHuman('foo', 'ref')       );
//     assert(  rttc.stringifyHuman('', 'ref')       );
//     assert(  rttc.stringifyHuman('4', 'ref')       );
//     assert(  rttc.stringifyHuman('-99', 'ref')       );
//     assert(  rttc.stringifyHuman('true', 'ref')       );
//     assert(  rttc.stringifyHuman('false', 'ref')       );
//     assert(  rttc.stringifyHuman('null', 'ref')       );

//     assert(  rttc.stringifyHuman(4, 'number')       );
//     assert(  rttc.stringifyHuman(10.345, 'number')       );
//     assert(  rttc.stringifyHuman(-99, 'number')       );
//     assert(  rttc.stringifyHuman(Math.PI, 'number')       );
//     assert(  rttc.stringifyHuman(4, 'json')       );
//     assert(  rttc.stringifyHuman(10.345, 'json')       );
//     assert(  rttc.stringifyHuman(-99, 'json')       );
//     assert(  rttc.stringifyHuman(Math.PI, 'json')       );
//     assert(  rttc.stringifyHuman(4, 'ref')       );
//     assert(  rttc.stringifyHuman(10.345, 'ref')       );
//     assert(  rttc.stringifyHuman(-99, 'ref')       );
//     assert(  rttc.stringifyHuman(Math.PI, 'ref')       );

//     assert(  rttc.stringifyHuman(false, 'boolean')       );
//     assert(  rttc.stringifyHuman(true, 'boolean')       );
//     assert(  rttc.stringifyHuman(true, 'json')       );
//     assert(  rttc.stringifyHuman(false, 'json')       );
//     assert(  rttc.stringifyHuman(true, 'ref')       );
//     assert(  rttc.stringifyHuman(false, 'ref')       );

//     assert(  rttc.stringifyHuman({}, {})       );
//     assert(  rttc.stringifyHuman({}, 'json')       );
//     assert(  rttc.stringifyHuman({}, 'ref')       );

//     assert(  rttc.stringifyHuman([], [])       );
//     assert(  rttc.stringifyHuman([], 'json')       );
//     assert(  rttc.stringifyHuman([], 'ref')       );

//     assert(  rttc.stringifyHuman(function asdf(){}, 'lamda')       );

//     assert(  rttc.stringifyHuman(null, 'json')       );
//     assert(  rttc.stringifyHuman(null, 'ref')       );
//   });
// });
