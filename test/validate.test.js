/**
 * Module dependencies
 */

var TEST_SUITE = require('./spec/validation.spec');
var runSuite = require('./helpers/run-suite');
var toRunTestWith = require('./helpers/to-run-test-with');
var validate = require('../').validate;

describe('.validate()', function (){

  runSuite(TEST_SUITE, toRunTestWith(validate));

});

