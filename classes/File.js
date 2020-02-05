const isString = require('lodash/isString');
const { Kubik } = require('rubik-main');

const FileError = require('./FileError');
const Provider = require('./Provider');

/**
 * Filestorage for Rubik
 */
class File extends Kubik {

  static addProvider(name, Provider) {
    if (!this._providers) {
      this._providers = Object.create(null);
    }
    this._providers[name] = Provider;
  }

  static getProvider(name) {
    const Provider = this._providers && this._providers[name];
    FileError.is(
      Provider,
      FileError.INVALID_PROVIDER_CLASS
    );
    return Provider;
  }

  static createProvider(name, options) {
    const Provider = this.getProvider(name);
    return new Provider(options);
  }

  constructor() {
    super(...arguments);
    this.provider = null;
    this.options = {};
  }

  _initProvider(name) {
    const providerOptions = this.options[name] || {};

    this.provider = this.constructor.createProvider(
      name,
      Object.assign({}, this.options, providerOptions)
    );
  }

  async up({ config }) {
    Object.assign(this, { config });
    this.options = this.config.get(this.name);

    this._initProvider(this.options.provider);
  }

  _getProvider(provider) {
    provider =  provider || this.provider;
    FileError.is(
      provider instanceof Provider,
      FileError.INVALID_PROVIDER
    );
    return provider;
  }

  _getBucket(bucket) {
    bucket = bucket || this.options.bucket;
    FileError.is(
      bucket && isString(bucket),
      FileError.INVALID_BUCKET
    );
    return bucket;
  }

  isIdValid(id) {
    FileError.is(
      id && isString(id),
      FileError.INVALID_ID
    );
  }

  async _call(method, { id, bucket, provider }, ...args) {
    await this.processHooksAsync(
      `before-${method}`,
      { id, bucket, provider },
      ...args
    );
    this.isIdValid(id);
    bucket = this._getBucket(bucket);
    provider = this._getProvider(provider);
    const result = await provider[method]({ id, bucket }, ...args);
    await this.processHooksAsync(
      `after-${method}`,
      { id, bucket, provider },
      result
    );
    return result;
  }

  async write(to, stream) {
    return this._call('write', to, stream);
  }

  async has(source) {
    return this._call('has', source);
  }

  async read(from) {
    return this._call('read', from);
  }

  async remove(source) {
    return this._call('remove', source);
  }
}

File.prototype.dependencies = Object.freeze(['config']);
module.exports = File;
