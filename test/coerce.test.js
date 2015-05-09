/**
 * Module dependencies
 */

var runSuite = require('./helpers/run-suite');
var coerce = require('../').coerce;
var TEST_SUITE = require('./spec/coercion.spec');

describe('.coerce()', function (){
  runSuite(TEST_SUITE, coerce);
});
