/*
 * Generagic Storage skeleton
 * @author: skitsanos
 * @version: 1.0.1
 */

const uuidv1 = require('uuid/v1');
const moment = require('moment');
const path = require('path');

class GenericDataStorage
{
    constructor(config)
    {
        if (!config)
        {
            config = {};
        }

        this.config = config;
        const pkg = require(path.join(path.dirname(module.parent.id), 'package'));
        this.version = pkg.version;
        this.toString = () =>
        {
            return `${pkg.name} v.${pkg.version}`;
        };
    }

    static logi()
    {
        if (global.log.info === undefined)
        {
            console.log.apply(null, arguments);
        }
        else
        {
            global.log.info.apply(null, arguments);
        }
    }

    static logw()
    {
        if (global.log.warn === undefined)
        {
            console.warn.apply(null, arguments);
        }
        else
        {
            global.log.warn.apply(null, arguments);
        }
    }

    static loge()
    {
        if (global.log.error === undefined)
        {
            console.error.apply(null, arguments);
        }
        else
        {
            global.log.error.apply(null, arguments);
        }
    }

    getUuid()
    {
        return uuidv1();
    }

    getTimestamp()
    {
        return new Date().getTime();
    }

    getTimestampString()
    {
        return moment().format('YYYY-MM-DD HH:mm:ss.SSSS');
    }

    /**
     * Checks the storage
     */
    ping()
    {
        return new Promise((resolve, reject) =>
        {
            resolve(true);
        });
    }

    get(id)
    {
    }

    put(data)
    {
    }

    update(id, data)
    {
    }

    delete(id)
    {
    }

    search(query)
    {
    }
}

module.exports = GenericDataStorage;
