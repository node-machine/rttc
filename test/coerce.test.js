/**
 * Module dependencies
 */

var TEST_SUITE = require('./spec/coercion.spec');
var runSuite = require('./helpers/run-suite');
var toRunTestWith = require('./helpers/to-run-test-with');
var coerce = require('../').coerce;

describe('.coerce()', function (){
  runSuite(TEST_SUITE, toRunTestWith(coerce) );
});
