# njsf
Nodejs Framework - Set of most frequently used components for web and cli applications


## Utils

### execTime

```js
const execTime = require(path.join(process.cwd(), 'njsf/utils/execTime'));
const et = new execTime();

//put some code to execute here

console.log(`execution time ${et.duration()}`);

```
