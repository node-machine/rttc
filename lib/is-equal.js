/**
 * Module dependencies
 */

var _ = require('lodash');


/**
 * A variation on the lodash equality check that uses the expected typeSchema
 * for additional context (it stringifies lamdas and compares them that way)
 *
 * If no typeSchema is provided, this is currently just the same thing as `_.isEqual`
 *
 * @param  {===} firstValue
 * @param  {===} secondValue
 * @param  {*} typeSchema
 * @return {Boolean}
 */
module.exports = function isEqual (firstValue, secondValue, typeSchema) {

  // If typeSchema is not provided, use `_.isEqual`
  if (_.isUndefined(typeSchema)) {
    return _.isEqual(firstValue, secondValue);
  }


  // Otherwise recursively crawl the type schema and ensure that `firstValue`
  // and `secondValue` are equivalent to one another in all the places.
  //
  // The following code returns the result via calling a self-calling
  // (but *named*) recursive function.

  /**
   * [_isEqualRecursive description]
   * @param  {[type]}  firstValue  [description]
   * @param  {[type]}  secondValue [description]
   * @param  {[type]}  typeSchemaHere  [description]
   * @param  {[type]}  keypathArray  [description]
   * @param  {[type]}  keyOrIndex  [description]
   * @return {Boolean}             [description]
   */
  return (function _isEqualRecursive(firstValue, secondValue, typeSchemaHere, keypathArray, keyOrIndex){

    // If the key or index is a string and contains `.`, then fail with an error.
    if ((''+keyOrIndex).match(/\./)) {
      throw new Error('Keys containing dots (`.`) are not currently supported in values provided to `rttc.isEqual` when the 3rd argument is being used.');
    }

    // Clone (shallow) the keypath array so we can mutate it.
    if (_.isArray(keypathArray)){
      keypathArray = _.clone(keypathArray);
    }

    console.log('--');
    // console.log(' ('+keypathArray.join('.')+') \n•',firstValue,'vs', secondValue);

    // Attempt to look up the appropriate keypath within the type schema, or
    // use the top-level type schema if we haven't tracked any key/indices traversed
    // yet.
    // var typeToCompareAgainst;

    // If `keyOrIndex` is undefined, then this is the initial pass.
    if (_.isUndefined(keyOrIndex)){

      // // And set typeToCompareAgainst to the initial type schema.
      // typeToCompareAgainst = typeSchema;
    }
    // Otherwise it's a subsequent pass.
    else {
      // Keep track of indices/keys already traversed in order to dereference the appropriate part
      // of the type schema (`indexOrKey` will be undefined if this is the top-level)
      keypathArray.push(keyOrIndex);

      // // Get the parent keypath.
      // var parentKeypath = keypathArray.slice(0,-1).join('.');
      // // Special case for situation where parent path is the root path.
      // if (!parentKeypath) {
      //   parentKeypath = '';
      // }

      // // Look up the type schema for this path.
      // var lastTypeToCompareAgainst;
      // // Special case for situation where parent path is the root path.
      // if (!parentKeypath) { lastTypeToCompareAgainst = typeSchema; }
      // else { lastTypeToCompareAgainst = _.get(typeSchema, parentKeypath); }
      // console.log('lastTypeToCompareAgainst (@`%s`) :: ',parentKeypath, lastTypeToCompareAgainst);

      // // If previous comparison type was a homogenous array type (i.e. any array at this point)
      // // ensure that we use the first item of the type schema as our type-- because otherwise
      // // it won't exist!
      // if (_.isArray(lastTypeToCompareAgainst)) {
      //   var patternKeypath = parentKeypath + '.0';
      //   console.log('PREVIOUS COMPARISON TYPE WAS HOMO ARRAY! patternKeypath:',patternKeypath);
      //   typeToCompareAgainst = _.get(typeSchema, patternKeypath);
      // }
      // // Otherwise, just grab the type to compare against normally:
      // else {
      //   typeToCompareAgainst = _.get(typeSchema, keypathArray.join('.'));
      // }
    }

    // Now look up the two value segments we'll be comparing below.
    var firstValueSegment = keypathArray.length === 0 ? firstValue : _.get(firstValue, keypathArray.join('.'));
    var secondValueSegment = keypathArray.length === 0 ? secondValue : _.get(secondValue, keypathArray.join('.'));


    console.log('(for key (`%s`), keypathArray:',keyOrIndex, keypathArray,'typeSchemaHere:', typeSchemaHere,')');
    console.log('at `%s`, comparing:',keypathArray.join('.'), firstValueSegment,'vs',secondValueSegment);



    if (_.isArray(typeSchemaHere)) {
      // If this path expects a generic array (i.e. `['*']` or `[]` for short),
      // then just use lodash.
      if (_.isEqual(typeSchemaHere, [])){
        return _.isEqual(firstValueSegment, secondValueSegment);
      }
      // Otherwise, this is a homogeneous array so take the recursive step.
      return _.all(firstValueSegment, function checkEachItemIn1stArray(unused, i){
        return _isEqualRecursive(firstValue, secondValue, typeSchemaHere[0], keypathArray, i);
      }) &&
      _.all(secondValueSegment, function checkEachItemIn2ndArray(unused, i){
        return _isEqualRecursive(firstValue, secondValue, typeSchemaHere[0], keypathArray, i);
      });
    }
    else if (_.isObject(typeSchemaHere)) {
      // If this path expects a generic dictionary (i.e. `{}`), then just use lodash.
      if (_.isEqual(typeSchemaHere, {})){
        return _.isEqual(firstValueSegment, secondValueSegment);
      }
      // // Only take the recursive step for faceted dictionaries
      // // (but first check that both segments are dictionaries too, otherwise we know they don't match the type schema)
      // if (!_.isArray(firstValueSegment) && _.isObject(firstValueSegment) && !_.isArray(secondValueSegment) && _.isObject(secondValueSegment)) {
      //   return false;
      // }
      return _.all(firstValueSegment, function checkEachItemIn1stDict(unused, key){
        return _isEqualRecursive(firstValue, secondValue, typeSchemaHere[key], keypathArray, key);
      }) &&
      _.all(secondValueSegment, function checkEachItemIn2ndDict(unused, key){
        return _isEqualRecursive(firstValue, secondValue, typeSchemaHere[key], keypathArray, key);
      });
    }
    // If this type is a lamda, `.toString()` the functions and compare
    // them that way.
    else if (typeSchemaHere === 'lamda') {
      // console.log('Comparing lamdas...');
      // Look for any obvious mismatches and return false if they are encountered.
      if (!firstValueSegment || !secondValueSegment || !_.isFunction(firstValueSegment.toString) || !_.isFunction(secondValueSegment.toString)) {
        return false;
      }
      return (firstValueSegment.toString() === secondValueSegment.toString());
    }
    // Miscellaneous thing.
    else {
      // console.log('not lamda, its:', typeSchemaHere);
      return _.isEqual(firstValueSegment, secondValueSegment);
    }

  })(firstValue, secondValue, typeSchema, []);//</self-calling recursive fn>
};
