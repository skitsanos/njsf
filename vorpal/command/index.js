class VorpalCommand
{
    constructor(instance, name, description)
    {
        this.vorpal = instance;
        this.name = name;
        this.description = description;
        this.options = [];

        this.command = this.vorpal.command(name, description);
    }

    log()
    {
        vorpal.log.apply(vorpal, arguments);
        return vorpal.log;
    }

    addOption(name, description)
    {
        this.options.push({name: name, description: description});
    }

    action(args, callback)
    {
        callback();
    }

    build()
    {
        for (const item of this.options)
        {
            this.command.option(item.name, item.description);
        }

        this.command.action(this.action);
    }
}

module.exports = VorpalCommand;
