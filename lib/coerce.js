/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var rttc = require('./rttc');
var infer = require('./infer');
var types = require('./types');



/**
 * Coerce value to type schema.
 *
 * @param  {~Schema} expected   type schema
 * @param  {*} actual           "mystery meat"
 * @return {<expected>}
 */
module.exports = function coerce (expected, actual){

  var errors = [];
  var result = _coerceRecursive(expected, actual, errors);

  if (errors.length) {
    throw (function (){
      var err = new Error(util.format('%d error(s) coercing value:\n', errors.length, errors));
      err.code = errors[0].code;
      err.errors = errors;
      return err;
    })();
  }

  return result;
};


function _coerceRecursive (expected, actual, errors){
  var err = new Error();

  // Look up expected type from `types` object using `expected`.
  var expectedType;
  var isExpectingArray;
  var isExpectingDictionary;

  // Arrays
  if (_.isArray(expected)) {
    expectedType = types.arr;
    isExpectingArray = true;
  }
  // Dictionaries
  else if (_.isObject(expected)) {
    expectedType = types.obj;
    isExpectingDictionary = true;
  }
  // Primitives
  else {
    expectedType = types[expected];

    // If this refers to an unknown type, throw an error
    if (_.isUndefined(expectedType)) {
      throw (function (){
        var err = new Error('Unknown type: '+expected);
        err.code = 'E_UNKNOWN_TYPE';
        return err;
      })();
    }
  }

  // If the actual value is undefined, fill in with the
  // appropriate base type.
  if(types.undefined.is(actual)) {
    return expectedType.getBase();
  }

  // Default the coercedValue to the actual value.
  var coercedValue = actual;

  // Check `actual` value against expectedType
  if (!expectedType.is(actual)){

    // Invalid expected type.  Try to coerce:
    try {
      coercedValue = expectedType.to(actual);
    }
    catch (e) {
      // If that doesn't work...
      errors.push((function (){
        var err = new Error(util.format(
          'An invalid value was specified: \n' + util.inspect(actual, false, null) + '\n\n' +
          'This doesn\'t match the specified type: \n' + util.inspect(expected, false, null)
        ));
        err.code = 'E_INVALID_TYPE';
        return err;
      })());
      coercedValue = expectedType.getBase();
    }
  }

  // Clone and return results
  // (taking recursive step if necessary)
  if (isExpectingArray) {
    var arrayItemTpl = expected[0];
    return _.cloneDeep(_coerceRecursive(arrayItemTpl, coercedValue[0], errors));
  }
  if (isExpectingDictionary) {
    return _.cloneDeep(_.reduce(expected, function (memo, expectedVal, expectedKey) {
      memo[expectedKey] = _coerceRecursive(expected[expectedKey], coercedValue[expectedKey], errors);
      return memo;
    }, {}));
  }
  return _.cloneDeep(coercedValue);




  // // If the type schema is an array, parse each item:
  // if(_.isArray(expected)) {
  //   // if(actual && !types.arr.is(actual)) {
  //   //   err.code = 'E_INVALID_TYPE';
  //   //   err.message = util.format(
  //   //     'An invalid value was specified. The value ' + value + ' was used \n' +
  //   //     'and doesn\'t match the specified type: ' + expected
  //   //   );

  //   //   errors.push(err);
  //   //   return;
  //   // }

  //   // if the input is a ['*'] this is a typeclass array and we can build a schema
  //   // based on the first item in the array.
  //   if(expected[0] === '*') {
  //     var type = value.length ? _.cloneDeep(value[0]) : 'foo';

  //     // Infer the type
  //     var inferred = infer(type);
  //     expected = [inferred];
  //   }

  //   _.each(value, function(item) {

  //     // Handle an array of objects
  //     if(types.obj.is(expected[0])) {
  //       try {
  //         item = validateAndOrCoerceObject(expected[0], item, { coerce: coerce, baseType: baseType });
  //       }
  //       catch (err) {
  //         err.code = 'E_INVALID_TYPE';
  //         err.message = util.format(
  //           'An invalid value was specified: \n' + util.inspect(item, false, null) + '\n\n' +
  //           'This doesn\'t match the specified type: \n' + util.inspect(expected[0], false, null)
  //         );

  //         errors.push(err);
  //         return;
  //       }
  //     }

  //     // Handle an array of primitive values
  //     else {
  //       try {
  //         item = coercePrimitive(expected[0], item, { coerce: coerce, baseType: baseType });
  //         var valid = validatePrimitive(expected[0], item);
  //         if(!valid) {
  //           errors.push('Invalid type for input: ' + inputName);
  //           return;
  //         }
  //       }
  //       catch (e) {
  //         errors.push(e, inputName);
  //         return;
  //       }
  //     }
  //   });

  //   val[inputName] = value;
  //   return;
  // }

  // // if the type schema is an object, parse it recursively:
  // if(types.obj.is(expected)) {

  //   // If the schema is an empty object any object values are allowed to validate
  //   if(!_.keys(expected).length) {
  //     if(_.isPlainObject(value)) return val;
  //     errors.push('Invalid type for input: ' + inputName);
  //   }

  //   try {
  //     value = validateAndOrCoerceObject(expected, value, { coerce: coerce, baseType: baseType });
  //   }
  //   catch (e) {
  //     errors.push('Invalid type for input: ' + inputName);
  //     return;
  //   }

  //   val[inputName] = value;
  //   return;
  // }

  // // If the input type isn't an object or array we can just do a simple type check
  // try {

  //   // If a value is optional and not required and we don't need a baseType then
  //   // we can just return the undefined value
  //   if(_.isUndefined(value) && !input.required && !baseType) {
  //     return;
  //   }

  //   // If the input has type "*", it is always valid.
  //   if(expected === '*') {
  //     return;
  //   }

  //   value = coercePrimitive(expected, value, { coerce: coerce, baseType: baseType });
  //   var valid = validatePrimitive(expected, value);
  //   if(!valid) {
  //     errors.push('Invalid type for input: ' + inputName);
  //     return;
  //   }
  // }
  // catch (e) {
  //   errors.push(e, inputName);
  //   return;
  // }

  // val[inputName] = value;
  // return;
}


/**
 * first pass impl
 * @param  {[type]} expected [description]
 * @param  {[type]} actual   [description]
 * @return {[type]}          [description]
 */
function _wrapperVersion (expected, actual) {

  // Transform `expected` into rttc-compatible schema
  // e.g. {
  //   foo: { type: 'string', required: false },
  //   bar: { type: { baz: 'number' }, required: false }
  // }
  var rttcSchema = {
    x: {
      type: expected
    }
  };

  // Transform `actual` into rttc-compatible value set
  // e.g. {
  //   foo: 'asdga'
  //   bar: { baz: 32 }
  // }
  var rttcValueSet = {
    x: actual
  };

  return rttc(rttcSchema, rttcValueSet, {
    coerce: true
  }).x;
}
