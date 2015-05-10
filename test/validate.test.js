/**
 * Module dependencies
 */

var TEST_SUITE = require('../spec/validation.spec');
var runSuite = require('./helpers/run-suite');
var toRunTestWith = require('./helpers/to-run-test-with');
var rttc = require('../');

describe('.validate()', function (){

  runSuite(TEST_SUITE, toRunTestWith(rttc.validate));

});

