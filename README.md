# rubik-file
File storage Kubik, for Rubik's applications


# Using example
This module is designed to be used with `rubik-main`.

```js
const { App, Kubiks } = require('rubik-main');
const File = require('rubik-file');
const FileFS = require('rubik-file-fs');

// Creating application instance
const app = new App();
// Creating config kubik, add path to the config directory
// Config kubik is a depedency of File kubik
const config = new Kubiks.Config(path.join(__dirname, '../config/'));
// Creating file kubik
const file = new File({
  provider: 'FS',
  bucket: 'main'
});

// Add filesystem provider constructor
File.addProvider('FS', FileFS);

app.add([config, file]);

app.up().
then(async () => {
  console.info('Application started');

  const rs = fs.createReadStream(path.join(__dirname, './in/file.txt'));

  // Write to the storage
  await app.file.write({ key: 'some-file.txt' }, rs);
  // Read from the storage
  const stream = await app.file.read({ key: 'some-file.txt' });

  const ws = fs.createWriteStream(path.join(__dirname, './out/file.txt'));
  stream.pipe(ws);
}).
catch((err) => {
  console.error(err);
  process.exit(1);
});
```

# Providers
To make it easier to extend File kubik with different storages,
the logic for working with them must be placed in classes called Providers.

A provider is a Class-child of the Provider class.
The Provider should has an implementation of the `write`,` has`, `read`, and` remove` methods.
Optionally, there may also be a `copy` method - for copying files inside storage.

## Source
I will use this type bellow for some methods' arguments and params

Basically it is an Object with two keys:
- `key` is an file identifier inside storage
- `bucket` is an abstraction of Drive in some kind of storages

More about [keys](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html)
and [buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html)
you can read in the [AWS documentation](https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html).

## Implementing of methods

## write(to, readableStream)
Writes stream to a storage

There two required arguments:
- `to` is a `Source` object, `key` and `bucket` inside storage for new file
- `readableStream` is a Readable Stream

It should return `Promise` (or be `async`) that resolves nothing
If an error occurs, an exception must be thrown.

## has(source)
Checks file in the storage

There only one required argument:
- `source` is a `Source` object, key and bucket inside storage

It should return `Promise` (or be `async`) that resolves `Boolean`,
- `true`, when file exists;
- `false`, when file does not exists;

If an error occurs, an exception must be thrown.

## read(from)
Reads file from the storage

There only one required argument:
- `from` is a `Source` object, key and bucket inside storage

It should return `Promise` (or be `async`) that resolves Readable Stream,

If an error occurs, an exception must be thrown.

## remove(source)
Removes file from the storage

There only one required argument:
- `source` is a `Source` object, key and bucket inside storage

It should return `Promise` (or be `async`) that resolves nothing

If an error occurs, an exception must be thrown.

## copy(from, to) — optional method
Copies file from one destination to other. Inside the storage.
It is an optional method. If it is not exists,
File kubik just calls `read(from)` and `write(to, streamFrom)`.

There two required arguments:
- `from` is a `Source` object, `key` and `bucket` inside storage for existing file
- `to` is a `Source` object, `key` and `bucket` inside storage for new file

It should return `Promise` (or be `async`) that resolves nothing
If an error occurs, an exception must be thrown.

# Configuration

# Kubik's instance API
## file.addProvider(name, Provider[, isDefault]);
## file.createProvider(name[, options]);
## file.write(to, readableStream);
## file.has(source);
## file.read(from);
## file.remove(source);
## file.copy(from, to);
## file.move(from, to);
## file.isKeySafe(key);
## file.isKeyValid(key);

# Class API
## File.isKeySafe(key);
## File.isKeyValid(key);
## File.addProvider(name, Provider);
## File.getProvider(name);
## File.createProvider(name, options);
