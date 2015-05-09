/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var runTest = require('./run-test-transformation.helper');


module.exports = function runSuite( TEST_SUITE, transformationFn ){

  // For all `example: undefined` tests, also test `example: '*'`
  var starTests = [];
  _.each(TEST_SUITE, function (test){
    if (_.isUndefined(test.example)) {
      starTests.push({
        example: '*',
        actual: _.cloneDeep(test.actual),
        result: _.cloneDeep(test.result)
      });
    }
  });
  TEST_SUITE = TEST_SUITE.concat(starTests);


  // Inject an extra test for each existing test in order to ensure correct
  // behavior when recursive examples/values are provided
  var recursiveTests = [];
  _.each(TEST_SUITE, function (test){

    // ...but skip:
    //  • tests with example: `undefined`
    //  • tests that expect errors
    //  • tests that expect a result===`undefined`
    // (nested behavior is different in these cases^)
    if (!_.isUndefined(test.example) && !test.error && !_.isUndefined(test.result)) {

      // test one level of additional array nesting
      recursiveTests.push({
        example: [ _.cloneDeep(test.example) ],
        actual: [ _.cloneDeep(test.actual) ],
        result: [ _.cloneDeep(test.result) ],
        _meta: '+1 array depth'
      });

      // test one level of additional dictionary nesting
      recursiveTests.push({
        example: { xtra: _.cloneDeep(test.example) },
        actual: { xtra: _.cloneDeep(test.actual) },
        result: { xtra: _.cloneDeep(test.result) },
        _meta: '+1 dictionary depth'
      });

      // test one level of additional dictionary nesting AND 1 level of additional array nesting
      recursiveTests.push({
        example: [ { xtra: _.cloneDeep(test.example) } ],
        actual: [ { xtra: _.cloneDeep(test.actual) } ],
        result: [ { xtra: _.cloneDeep(test.result) } ],
        _meta: '+1 array depth, +1 dictionary depth'
      });

      // test two levels of additional dictionary nesting
      recursiveTests.push({
        example: { xtra: { xtra2: _.cloneDeep(test.example) } },
        actual: { xtra: { xtra2: _.cloneDeep(test.actual) } },
        result: { xtra:{ xtra2: _.cloneDeep(test.result) } },
        _meta: '+2 dictionary depth'
      });

      // test two levels of additional array nesting
      recursiveTests.push({
        example: [ [ _.cloneDeep(test.example) ] ],
        actual:  [ [ _.cloneDeep(test.actual) ] ],
        result:  [ [ _.cloneDeep(test.result) ] ],
        _meta: '+2 array depth'
      });

      // test two levels of additional dictionary nesting AND 1 level of array nesting
      recursiveTests.push({
        example: [ { xtra: { xtra2: _.cloneDeep(test.example) } } ],
        actual: [ { xtra: { xtra2: _.cloneDeep(test.actual) } } ],
        result: [ { xtra:{ xtra2: _.cloneDeep(test.result) } } ],
        _meta: '+1 array depth, +2 dictionary depth'
      });

      // test two levels of additional dictionary nesting and one level of array nesting, then WITHIN that, 1 level of array nesting
      recursiveTests.push({
        example: [ { xtra: { xtra2: [_.cloneDeep(test.example)] } } ],
        actual: [ { xtra: { xtra2: [_.cloneDeep(test.actual)] } } ],
        result: [ { xtra:{ xtra2: [_.cloneDeep(test.result)] } } ],
        _meta: '+1 array depth, +2 dictionary depth, +1 nested array depth'
      });

      // test two levels of additional dictionary nesting and one level of array nesting, then WITHIN that, 2 levels of array nesting
      recursiveTests.push({
        example: [ { xtra: { xtra2: [[_.cloneDeep(test.example)]] } } ],
        actual: [ { xtra: { xtra2: [[_.cloneDeep(test.actual)]] } } ],
        result: [ { xtra:{ xtra2: [[_.cloneDeep(test.result)]] } } ],
        _meta: '+1 array depth, +2 dictionary depth, +2 nested array depth'
      });
    }

  });
  TEST_SUITE = TEST_SUITE.concat(recursiveTests);


  // Now run each test.
  _.each(TEST_SUITE, function (test){
    describeAndExecuteTest(test, transformationFn);
  });

}

/**
 * Describe a mocha test based on the provided definition.
 *
 * @param  {[type]} test [description]
 * @return {[type]}      [description]
 */
function describeAndExecuteTest(test, transformationFn){
  var actualDisplayName = (_.isObject(test.actual)&&test.actual.constructor && test.actual.constructor.name !== 'Object' && test.actual.constructor.name !== 'Array')?test.actual.constructor.name:util.inspect(test.actual, false, null);

  describe((function _determineDescribeMsg(){
    var msg = '';

    if (test._meta) {
      msg += '['+test._meta+']';
    }
    else {
      msg += ' ';
    }

    if (!_.isUndefined(test.example)) {
      msg += 'with a '+getDisplayType(test.example)+' example ('+util.inspect(test.example,false, null)+')';
    }
    else {
      msg +='with example===`undefined`';
    }

    return msg;
  })(), function suite (){
    if (test.error) {
      it(util.format('should error when %s is provided', actualDisplayName), function (done){
        runTest(test, transformationFn, done);
      });
      return;
    }

    it(util.format('should coerce %s', actualDisplayName, 'into '+util.inspect(test.result, false, null)+''), function (done){
      runTest(test, transformationFn, done);
    });
  });
}


/**
 * private helper fn
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
function getDisplayType(x){
  var displayType;
  displayType = typeof x;
  try {
    displayType = x.constructor.name;
  }
  catch (e){}
  return displayType;
}
