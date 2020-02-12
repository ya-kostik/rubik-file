const Provider = require('../classes/Provider');

/**
 * Check is Constructor inherited from Provider
 * @param  {Function} Constructor
 * @return {Boolean}
 */
module.exports = function isProvider(Constructor) {
  return Object.prototype.isPrototypeOf.call(Provider, Constructor);
};
