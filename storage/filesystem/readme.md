# Filesystem Data Storage

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
