### Support for vorpal

> vorpal is Node's framework for interactive CLIs [http://vorpal.js.org](http://vorpal.js.org)

### Command module

Example on writing a command, bare minimum:

```js
const path = require('path');
const VorpalCommand = require(path.join(process.cwd(), 'njsf/vorpal/command'));

class Command extends VorpalCommand
{
    constructor(instance)
    {
        super(instance, 'test', 'Prints test string');
        this.addOption('-m, --message <message>', 'Adds a message');
    }

    action(args, callback)
    {
        this.log('This is a test message;');
        console.log(args.options);
        callback();
    }
}

module.exports = Command;
```

### Dynamic commands loading

Code below will load all your commands stored as modules (example above) in _/commands_ folder of your application

```js
loadCommands()
    {
        const p = path.join(__dirname, '/commands');
        if (fs.existsSync(p))
        {
            for (const f of fs.readdirSync(p, {withFileTypes: true}))
            {
                if (f.isFile())
                {
                    const Command = require(path.join(p, f.name));
                    const cmd = new Command(vorpal);
                    cmd.build();
                }
            }
        }
    }
```
