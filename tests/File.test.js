/* global jest describe test expect */


const createRandomStream = require('./lib/createRandomStream');
const Memory = require('./File/Memory');
const doAfterUp = require('./File/doAfterUp');
const createBufferList = require('./lib/createBufferList');

const DEFAULT_NAME = 'file';

async function write(file, bucket) {
  const stream = createRandomStream();
  const buffer = stream.slice();
  const id = 'test.png';
  await file.write({ id, bucket }, stream);
  return { id, bucket, file, stream, buffer };
}

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
      const { id } = await write(file);
      expect(await file.has({ id })).toBe(true);
    });
  });

  test('reads file', async () => {
    await doAfterUp(async (file) => {
      const { id, buffer: bufferIn } = await write(file);
      const streamOut = await file.read({ id });
      const bufferOut = (await createBufferList(streamOut)).slice();

      expect(bufferIn).toEqual(bufferOut);
    });
  });

  test('removes file', async () => {
    await doAfterUp(async (file) => {
      const { id } = await write(file);
      await file.remove({ id });
      expect(await file.has({ id })).toBe(false);
    });
  });

  test('copy file', () => {});
});
