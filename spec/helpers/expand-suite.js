/**
 * Module dependencies
 */

var _ = require('lodash');


/**
 * Expand the provided test suite with more tests automatically.
 *
 * @param  {Array} testSuite
 * @return {Array}
 */
module.exports = function expandSuite ( testSuite ) {

  // For all `example: undefined` tests, also test `example: '*'`
  var starTests = [];
  _.each(testSuite, function (test){
    if (_.isUndefined(test.example)) {
      var newTest = {
        example: '*',
        actual: test.actual
      };
      if (test.hasOwnProperty('result')) {
        newTest.result = test.result;
      }
      if (test.hasOwnProperty('strictEq')) {
        newTest.strictEq = _.cloneDeep(test.strictEq);
      }
      if (test.hasOwnProperty('isNew')) {
        newTest.isNew = _.cloneDeep(test.isNew);
      }
      starTests.push(newTest);
    }
  });
  testSuite = testSuite.concat(starTests);


  // Inject an extra test for each existing test in order to ensure correct
  // behavior when recursive examples/values are provided
  var recursiveTests = [];
  _.each(testSuite, function (test){

    // ...but skip:
    //  • tests with example: `undefined`
    //  • tests that expect errors
    //  • tests that expect a result===`undefined`
    //  • tests that verify `strictEq` or `isNew`
    // (nested behavior is different in these cases^)
    if (!test.error && !_.isUndefined(test.result) && !test.hasOwnProperty('strictEq') && !test.hasOwnProperty('isNew')) {

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
  testSuite = testSuite.concat(recursiveTests);

  return testSuite;
};
