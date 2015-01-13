module.exports = {
  // Expose `validate()` and `coerce()` methods.
  validate: require('./lib/validate'),
  coerce: require('./lib/coerce'),

  // Support for rttc() and infer()
  // (these are here for compatibility and will likely
  //  be removed in a future version)
  rttc: require('./lib/rttc'),
  infer: require('./lib/rttc'),

  // Also expose `types` object for compat.
  types: require('./lib/types')
};
