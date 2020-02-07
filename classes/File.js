const { Kubik } = require('rubik-main');

const isBucket = require('../lib/isBucket');
const isKey = require('../lib/isKey');

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
      isBucket(bucket),
      FileError.INVALID_BUCKET
    );
    return bucket;
  }

  isKeyValid(key) {
    FileError.is(
      isKey(key),
      FileError.INVALID_KEY
    );
  }

  _parseSource(source) {
    let { key, bucket, provider } = source;
    this.isKeyValid(key);
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

  async write(to, stream) {
    return this._write(to, stream, true)
  }

  async has(source) {
    return this._call('has', true, source);
  }

  async _read(from, hooks = false) {
    const has = await this._call('has', false, from);
    if (!has) throw new FileError(FileError.FILE_DOES_NOT_EXIST);
    return this._call('read', hooks, from);
  }

  async read(from) {
    return this._read(from, true)
  }

  async _remove(source, hooks = false) {
    return this._call('remove', hooks, source);
  }

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

  async copy(from, to) {
    return this._copy(from, to, true);
  }

  async move(from, to) {
    const parsedFrom = this._parseSource(from);
    const parsedTo = this._parseSource(to);

    await this.processHooksAsync('before-move', parsedFrom, parsedTo);
    await this._copy(from, to, false);
    await this._remove(from, false);
    await this.processHooksAsync('after-move', parsedFrom, parsedTo);
  }
}

File.prototype.dependencies = Object.freeze(['config']);
module.exports = File;
