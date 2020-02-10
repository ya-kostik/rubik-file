const { Kubik } = require('rubik-main');

const isBucket = require('../lib/isBucket');
const isKey = require('../lib/isKey');
const isKeySafe = require('../lib/isKeySafe');

const FileError = require('./FileError');
const Provider = require('./Provider');

/**
 * Source of a file
 * @typedef {Object} Source
 * @prop {String} key — is a key of the file in the storage
 * @prop {String} bucket — is a bucket's name of the file in the storage
 * @prop {Provider} [provider] — is an optional provider of storage
 */


/**
 * Filestorage Kubik for Rubik
 * @prop {Object} options — is options of kubik
 * @prop {Provider} [provider] — is a Provider's instance
 */
class File extends Kubik {
  /**
   * Add provider
   * @param {String} name — is a name of provider, for example FS
   * @param {Provider} Provider — is a Provider's Constructor
   */
  static addProvider(name, Provider) {
    if (!this._providers) {
      this._providers = Object.create(null);
    }
    this._providers[name] = Provider;
  }

  /**
   * Get Povider Constructor
   * @param  {String} name — is a name of Provider's existing Constructor
   * @return {Function} is a Provider's Constructor
   * @throws {FileError} when Provider's Constructor not found or invalid
   */
  static getProvider(name) {
    const Constructor = this._providers && this._providers[name];
    FileError.is(
      Object.prototype.isPrototypeOf.call(
        Provider, Constructor
      ),
      FileError.INVALID_PROVIDER_CLASS
    );
    return Constructor;
  }

  /**
   * Create Provider's instance by name
   * @param  {String} name — is a name of Provider's Constructor
   * @param  {Object} [options={}] — is an instance options
   * @return {Provider} is an instance of Provider
   */
  static createProvider(name, options = {}) {
    const Provider = this.getProvider(name);
    return new Provider(options);
  }

  constructor(options) {
    super();
    this.provider = null;
    this.options = {};
    this._updateOptions(options);
  }

  _updateOptions(options = {}) {
    Object.assign(this.options, options);
  }

  addProvider(name, Constructor, isDefault = false) {
    this.constructor.addProvider(name, Constructor);
    if (!isDefault) return;
    this.options.provider = name;
  }

  createProvider(name, options) {
    return this.constructor.createProvider(name, options);
  }

  _initProvider(name) {
    const providerOptions = this.options[name] || {};

    this.provider = this.constructor.createProvider(
      name,
      Object.assign({}, this.options, providerOptions)
    );
  }

  /**
   * Up Kubik
   * @param  {Object} dependencies
   * @param  {Rubik.Config} dependencies.config
   * @return {Promise}
   */
  async up({ config }) {
    Object.assign(this, { config });
    this._updateOptions(this.config.get(this.name));

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
      isBucket(bucket),
      FileError.INVALID_BUCKET
    );
    return bucket;
  }

  _validateKey(key) {
    FileError.is(
      this.options.strict
        ? isKeySafe(key)
        : isKey(key),
      FileError.INVALID_KEY
    );
  }

  _parseSource(source) {
    let { key, bucket, provider } = source;
    this._validateKey(key);
    bucket = this._getBucket(bucket);
    provider = this._getProvider(provider);

    return { key, bucket, provider };
  }

  _minifySource({ key, bucket  }) {
    return { key, bucket };
  }

  async _call(method, hooks, source, ...args) {
    const parsedSource = this._parseSource(source);
    const { key, bucket, provider } = parsedSource;

    hooks && await this.processHooksAsync(`before-${method}`, parsedSource, ...args);
    const result = await provider[method]({ key, bucket }, ...args);
    hooks && await this.processHooksAsync(`after-${method}`, parsedSource, result);

    return result;
  }

  async _write(to, stream, hooks = false) {
    return this._call('write', hooks, to, stream);
  }

  /**
   * Write stream to storage
   * @param  {Source} to — is a destination of file
   * @param  {ReadableStream} stream — readable stream to write
   * @return {Promise}
   */
  async write(to, stream) {
    return this._write(to, stream, true)
  }

  /**
   * Check file exists
   * @param  {Source}  source — is a location of file
   * @return {Promise<Boolean>}
   */
  async has(source) {
    return this._call('has', true, source);
  }

  async _read(from, hooks = false) {
    const has = await this._call('has', false, from);
    if (!has) throw new FileError(FileError.FILE_DOES_NOT_EXIST);
    return this._call('read', hooks, from);
  }

  /**
   * Read file
   * @param  {Source} from — is a location of file
   * @return {Promise<ReadableStream>}
   */
  async read(from) {
    return this._read(from, true)
  }

  async _remove(source, hooks = false) {
    return this._call('remove', hooks, source);
  }

  /**
   * Remove file
   * @param  {Source} source — is a location of file
   * @return {Promise}
   */
  async remove(source) {
    return this._remove(source, true);
  }

  async _copy(from, to, hooks = false) {
    const parsedFrom = this._parseSource(from);
    const parsedTo = this._parseSource(to);

    from = this._minifySource(parsedFrom);
    to = this._minifySource(parsedTo);

    hooks && await this.processHooksAsync('before-copy', parsedFrom, parsedTo);

    if (parsedFrom.provider === parsedTo.provider && parsedFrom.provider.copy) {
      await parsedFrom.provider.copy(from, to);
    } else {
      const streamFrom = await this._read(parsedFrom);
      await this._write(parsedTo, streamFrom);
    }

    hooks && await this.processHooksAsync('after-copy', parsedFrom, parsedTo);
  }

  /**
   * Copy file
   * @param  {Source} from — is a location of file
   * @param  {Source} to — is a destination of file
   * @return {Promise}
   */
  async copy(from, to) {
    return this._copy(from, to, true);
  }

  /**
   * Move file
   * @param  {Source} from — is a location of file
   * @param  {Source} to — is a destination of file
   * @return {Promise}
   */
  async move(from, to) {
    const parsedFrom = this._parseSource(from);
    const parsedTo = this._parseSource(to);

    await this.processHooksAsync('before-move', parsedFrom, parsedTo);
    await this._copy(from, to, false);
    await this._remove(from, false);
    await this.processHooksAsync('after-move', parsedFrom, parsedTo);
  }
}

File.isKeySafe = isKeySafe;
File.isKeyValid = isKey;
File.prototype.isKeySafe = isKeySafe;
File.prototype.isKeyValid = isKey;
File.prototype.dependencies = Object.freeze(['config']);
module.exports = File;
