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

  // NaN
  nan: {
    is: _.isNaN,
    to: function () { return NaN; }
  },

  // Null
  'null': {
    is: _.isNull,
    to: function () { return null; }
  },

  // Undefined
  'undefined': {
    is: _.isUndefined,
    to: function () { return undefined; }
  },

  // Boolean
  bool: {
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
    base: false,
    getBase: function (){
      return false;
    }
  },

  // Defined
  defined: {
    is: function(v) {
      return !( type.nan.is(v) || type.undefined.is(v) || type.null.is(v) );
    },
    to: function(v) {
      return (type.defined.is(v)) ? v : true;
    }
  },

  // Integer
  'int': {
    is: function(v) { return (v == v + 0 && v == ~~v); },
    to: function(v) {
      var value = parseInt(v, 10);
      if (!isNaN(value)) return value;
      return 1;
    },
    base: 0,
    getBase: function (){
      return 0;
    }
  },

  // String
  str: {
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

      if(v === null) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(type.defined.is(v)) return String(v);
      return '';
    },
    base: '',
    getBase: function (){
      return '';
    }
  },

  // Object
  obj: {
    is: function(v) {
      return _.isObject(v) && !type.arr.is(v);
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

      return {};
    },
    base: {},
    getBase: function (){
      return {};
    }
  },

  // Array
  arr: {
    is: _.isArray,
    to: function(v) {
      if (_.isString(v)){
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      if (_.isNumber(v)){
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      if (_.isNaN(v)){
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      return _.toArray(v);
    },
    base: [],
    getBase: function (){
      return [];
    }
  },

  // Date
  'date': {
    is: _.isDate,
    to: function(v) {
      return new Date(v);
    },
    base: new Date(),
    getBase: function (){
      return new Date();
    }
  },

  // Numeric
  'number': {
    is: function(v) {
      return _.isNumber(v) && !type.nan.is(parseFloat(v)) && v!==Infinity && v!==-Infinity;
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
      if(type.bool.is(v)) return v ? 1 : 0;
      if(type.str.is(v)) {

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
    base: 0,
    getBase: function (){
      return 0;
    }
  },

};



// Aliases
type.string = type.email = type.url = type.str;
type.boolean = type.bool;
type.integer = type.int;
type.float = type.number;

module.exports = type;



