# Filesystem Data Storage

Data storage engine that utilizes file system to store documents in plain text or JSON documents, allowing querying data as text or via XPath.

### Dependencies

- fs
- path
- find-in-files
- JSONpath
- defiant.js

### Initializing

Initializing data storage with default configuration:

```js
const storage = new (require('./framework/storage/filesystem'));
```

This will create a data store in _/data/_ folder of your application. If you want to specify a different location for your files, you need to path configuration object with _path_ property in it:

```js
const storage = new (require('./framework/storage/filesystem')({path: '/users/me/data'});
```

### Methods

#### get(id)
Getting data document by its _id_.

```js
storage.get(id)
```

#### put(data)
Stores data on disk and returns _id_ of the document. _data_ can be plain text or object. If object is passed as _data_ parameter, it will be converted into JSON string automatically.

```js
storage.put(data)
```

#### update(id, data)
Updating data document by its _id_. Returns document _id_ if succeed.

```js
storage.update(id, data)
```

#### delete(id)
Deleting data document by its _id_.

```js
storage.delete(id)
```

#### search(query)
Searching for data within entire data store. _query_ parameter can be a string or object.

```js
storage.search(query)
```

If _query_ is string, all data files will be considered as plain text and search will be done via regexp rules. For example, the following will look for word _data_ in all files.

```js
storage.search('data')
```

For more complex queries, over JSON data documents, you would want to use _jsonpath_ or _defiant_ engines and pass your _query_ configuration as object like this:

```js
{
    engine: 'defiant',
    query: '//node()[data/text()="ok"]/data'
}
```

More details on querying data described below.

### Querying data

There is number of query engines supported by this storage that allows you to query simple text files, JSON documents and XML. Default engine is _text_.


| Engine | npm | Data type | Notes |
|:------------:|:------------:|:------------:|------------|
| text | find-in-files | plain text | Uses regular expressions to search through the data files.  See npm module details at [find-in-files](https://www.npmjs.com/package/find-in-files) |
| jsonpath | JSONpath| JSON documents | See [JSONpath](https://www.npmjs.com/package/JSONPath) for details on how to query your data|
| defiant | defiant.js | JSON documents | Allows using XPath query over your entire data set. Uses [defiant.js](https://www.defiantjs.com) that has dependency on [puppeteer](https://github.com/GoogleChrome/puppeteer)|

The following example will run search query on your dataset with using defiant engine and XPath:

```js
const storage = new (require('./framework/storage/filesystem'));
storage.search({
    engine: 'defiant',
    query: '//node()[data/text()="ok"]/data'
}).then(r =>
{
    console.log('\n\nResult:');
    console.log(r);
}).catch(e =>
{
    console.error(e.message);
});

```
