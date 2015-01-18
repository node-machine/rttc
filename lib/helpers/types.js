/**
 * Module dependencies
 */

var _ = require('lodash');





/**
 * Basic type definitions.
 *
 * Roughly based on https://github.com/bishopZ/Typecast.js
 * ________________________________________________________________________________
 * @type {Object}
 */

var type = {

  // Boolean
  boolean: {
    is: _.isBoolean,
    to: function(v) {
      if (_.isUndefined(v)){ return false; }
      if(_.isBoolean(v)) return v;
      if (_.isNumber(v)){
        if(v === 1) return true;
        if(v === 0) return false;
      }
      if (_.isString(v)) {
        if(v === 'true') return true;
        if(v === 'false') return false;
        if(v === '1') return true;
        if(v === '0') return false;
      }

      throw new Error('E_runtimeInputTypeCoercionError');
    },
    getBase: function (){
      return false;
    }
  },

  // String
  string: {
    is: _.isString,
    to: function(v) {

      if (_.isUndefined(v)){
        return '';
      }

      if(_.isString(v)) return v;

      if(v instanceof Function) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(_.isDate(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v instanceof Function) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v instanceof Object) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v instanceof Array) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v === Infinity) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v === -Infinity) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(_.isNaN(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(_.isNull(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      return String(v);
    },
    getBase: function (){
      return '';
    }
  },

  // Dictionary
  dictionary: {
    is: function(v) {
      if (!_.isObject(v)) return false;
      if (type.arr.is(v)) return false;
      if (!_.isPlainObject(v)) return false;
      return true;
    },
    to: function(v) {
      if (_.isArray(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      if (!_.isObject(v)){
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      if (_.isPlainObject(v)){
        return v;
      }

      throw new Error('E_runtimeInputTypeCoercionError');
    },
    getBase: function (){
      return {};
    }
  },


  // Array
  array: {
    is: _.isArray,
    to: function(v) {
      if (!_.isArray(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      return v;
    },
    getBase: function (){
      return [];
    }
  },

  // Nuber
  number: {
    is: function(v) {
      return _.isNumber(v) && !_.isNaN(parseFloat(v)) && v!==Infinity && v!==-Infinity;
    },
    to: function(v) {

      if (_.isUndefined(v)){
        return 0;
      }

      // Check for Infinity and NaN
      if(v === Infinity || v === -Infinity) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      if (_.isNaN(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      if (_.isNull(v)){
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if (_.isObject(v)) return 0;

      if(type.number.is(v)) return v;
      if(type.boolean.is(v)) return v ? 1 : 0;
      if(type.string.is(v)) {

        // Is this a string that appears to be a number?
        var isStringThatAppearsToBeNumber = (function _getIsStringThatAppearsToBeNumber(value){
          if (!_.isString(value)) return false;

          // (this is an exception... apparently doing `+''` in javascript results in `0`)
          if (value === '') return false;

          // General case:
          if ( _.isNaN(+value) ) return false;
          if ( +value=== Infinity ) return false;
          if ( +value=== -Infinity ) return false;

          return true;
        })(v);

        if (!isStringThatAppearsToBeNumber) {
          throw new Error('E_runtimeInputTypeCoercionError');
        }


        // Check for Infinity
        if (v === 'Infinity' || v === '-Infinity') {
          throw new Error('E_runtimeInputTypeCoercionError');
        }

        return +v;
      }


      var num = v * 1;
      if(!_.isNumber(num)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if (_.isNaN(num)) {
        return 0;
      }

      return (num === 0 && !v.match(/^0+$/)) ? 0 : num;

    },
    getBase: function (){
      return 0;
    }
  },

};



// Aliases
type.str = type.email = type.url = type.string;
type.bool = type.boolean;
type.arr = type.array;
type.integer = type.int;
type.float = type.number;
type.object = type.obj = type.dictionary;

module.exports = type;



