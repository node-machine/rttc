module.exports = {
  validate: require('./lib/validate'),
  validateStrict: require('./lib/validate-strict'),
  coerce: require('./lib/coerce'),
  infer: require('./lib/infer'),
  isEqual: require('./lib/is-equal'),
  getDisplayType: require('./lib/get-display-type'),
  stringify: require('./lib/stringify'),
  parse: require('./lib/parse'),
  parseHuman: require('./lib/parse-human'),
  hydrate: require('./lib/hydrate'),
  dehydrate: require('./lib/dehydrate'),
  inspect: require('./lib/inspect'),
};


// Backwards compatibility
module.exports.encode = module.exports.stringify;
module.exports.decode = module.exports.parse;
