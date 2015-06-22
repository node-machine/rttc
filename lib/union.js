/**
 * Module dependencies
 */


var _ = require('lodash');
var buildTwoHeadedSchemaCursor = require('./helpers/build-two-headed-schema-cursor');



/**
 * union()
 *
 * Given two rttc type schemas, return the most specific type schema that
 * would accept the superset of what both type schemas accept normally.
 *
 *
 * @param  {*} schema0
 * @param  {*} schema1
 * @return {*}
 */

module.exports = function union (schema0, schema1) {


  // Configure two-headed type schema cursor and use it to recursively
  // determine the type schema intersection.
  var twoHeadedCursor = buildTwoHeadedSchemaCursor(
    function onFacetDict(schema0, schema1, parentKeyOrIndex, iterateRecursive){
      if (schema1 === 'ref' || schema1 === 'lamda') {
        return 'ref';
      }
      if (_.isArray(schema1) || !_.isObject(schema1)) {
        return 'json';
      }

      var sharedKeys = _.intersection(_.keys(schema0), _.keys(schema1));
      var xorKeys = _.difference(_.union(_.keys(schema0), _.keys(schema1)), sharedKeys);
      if (xorKeys.length > 0) {
        return {};
      }
      return _.reduce(sharedKeys, function (memo, key) {
        memo[key] = iterateRecursive(key);
        return memo;
      }, {});
    },
    function onPatternArray(schema0, schema1, parentKeyOrIndex, iterateRecursive){
      if (schema1 === 'ref' || schema1 === 'lamda') {
        return 'ref';
      }
      if (!_.isArray(schema1)) {
        return 'json';
      }
      if (_.isEqual(schema1, [])) {
        return [];
      }
      return [ iterateRecursive(0) ];
    },
    function onGenericDict(schema0, schema1, parentKeyOrIndex){
      if (schema1 === 'ref' || schema1 === 'lamda') {
        return 'ref';
      }
      if (!_.isArray(schema1) && _.isObject(schema1)) {
        return {};
      }
      return 'json';
    },
    function onGenericArray(schema0, schema1, parentKeyOrIndex){
      if (schema1 === 'ref' || schema1 === 'lamda') {
        return 'ref';
      }
      if (_.isArray(schema1)) {
        return [];
      }
      return 'json';
    },
    function onJson(schema0, schema1, parentKeyOrIndex) {
      if (schema1 === 'ref' || schema1 === 'lamda') {
        return 'ref';
      }
      return 'json';
    },
    function onRef(schema0, schema1, parentKeyOrIndex) {
      return 'ref';
    },
    function onLamda(schema0, schema1, parentKeyOrIndex) {
      if (schema1 === 'lamda') {
        return 'lamda';
      }

      return 'ref';
    },
    function onString(schema0, schema1, parentKeyOrIndex) {
      switch (schema1) {
        case 'string':
          return 'string';
        case 'boolean':
        case 'number':
        case 'json':
          return 'json';
      }
      if (_.isArray(schema1)) {
        return 'json';
      }
      if (_.isObject(schema1)) {
        return 'json';
      }
      return 'ref';
    },
    function onNumber(schema0, schema1, parentKeyOrIndex) {
      switch (schema1) {
        case 'number':
          return 'number';
        case 'string':
        case 'boolean':
        case 'json':
          return 'json';
      }
      if (_.isArray(schema1)) {
        return 'json';
      }
      if (_.isObject(schema1)) {
        return 'json';
      }
      return 'ref';
    },
    function onBoolean(schema0, schema1, parentKeyOrIndex) {
      switch (schema1) {
        case 'boolean':
          return 'boolean';
        case 'string':
        case 'number':
        case 'json':
          return 'json';
      }
      if (_.isArray(schema1)) {
        return 'json';
      }
      if (_.isObject(schema1)) {
        return 'json';
      }
      return 'ref';
    }
  );

  // Run the iterator to get the type schema intersection.
  return twoHeadedCursor(schema0, schema1);

};



