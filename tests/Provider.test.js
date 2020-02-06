/* global describe test expect */
const FileError = require('../classes/FileError');
const Provider = require('../classes/Provider');

class TestProvider extends Provider {}

describe('Provider class', () => {
  test.each(
    TestProvider.REQUIRED_METHODS
  )(
    'throws an error when calling an unimplemented method %s',
    async (method) => {
      const provider = new TestProvider();

      await expect(provider[method]()).rejects.toThrow(
        FileError.METHOD_IS_NOT_IMPLEMENTED
      );
    }
  );
});
