/* global describe test expect */
const Memory = require('./File/Memory');
const doAfterUp = require('./File/doAfterUp');
const prepareP2P = require('./File/prepareP2P');
const write = require('./File/write');
const testCopyOrMove = require('./File/testCopyOrMove');
const checkFileIntersection = require('./File/checkFileIntersection');
const readBuffer = require('./lib/readBuffer');

const DEFAULT_NAME = 'file';

describe('File Kubik', () => {
  test('created and upped with default name', async () => {
    await doAfterUp((file, app) => {
      expect(file.name).toBe(DEFAULT_NAME);
      expect(app[DEFAULT_NAME]).toBe(file);
      expect(file.provider).toBeInstanceOf(Memory);
    });
  });

  test('writes file', async () => {
    await doAfterUp(async (file) => {
      const { key } = await write(file);

      expect(await file.has({ key })).toBe(true);
    });
  });

  test('reads file', async () => {
    await doAfterUp(async (file) => {
      const { key, buffer: bufferIn } = await write(file);
      const bufferOut = await readBuffer(await file.read({ key }));

      expect(bufferIn).toEqual(bufferOut);
    });
  });

  test('removes file', async () => {
    await doAfterUp(async (file) => {
      const { key } = await write(file);
      await file.remove({ key });
      expect(await file.has({ key })).toBe(false);
    });
  });

  test('copy file', async () => {
    await doAfterUp(async (file) => {
      await testCopyOrMove('copy', file);
    });
  });

  test('move file', async () => {
    await doAfterUp(async (file) => {
      await testCopyOrMove('move', file);
    });
  });

  test('copy from one provider to other', async () => {
    await doAfterUp(async (file) => {
      const { from, to, buffer } = await prepareP2P(file);

      await file.copy(from, to);

      const bufferFrom = await readBuffer(await file.read(from));
      const bufferTo = await readBuffer(await file.read(to));

      expect(bufferFrom).toEqual(buffer);
      expect(bufferTo).toEqual(buffer);

      await checkFileIntersection(file, from, to);
    });
  });

  test('move from one provider to other', async () => {
    await doAfterUp(async (file) => {
      const { from, to, buffer } = await prepareP2P(file);

      await file.move(from, to);

      const bufferTo = await readBuffer(await file.read(to));

      expect(await file.has(from)).toBe(false);
      expect(await file.has(to)).toBe(true);

      expect(bufferTo).toEqual(buffer);

      await checkFileIntersection(file, from, to);
    });
  });
});
