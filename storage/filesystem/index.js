/*
 * FileSystem Storage
 * @author: skitsanos
 * @version: 1.0.1
 */

const fs = require('fs');
const path = require('path');
const findInFiles = require('find-in-files');
const jp = require('JSONPath');
const defiant = require('defiant.js');
const moment = require('moment');

const DataStorage = require('../generic/');

class storage extends DataStorage
{
    constructor(config)
    {
        if (!config)
        {
            config = {path: path.join(process.cwd(), '/data/')};
        }

        super(config);

        if (!fs.existsSync(this.config.path))
        {
            fs.mkdir(this.config.path, err =>
            {
                if (err)
                {
                    storage.loge(err);
                }
            });
        }
    }

    /**
     * Creates new file to hold the data in it
     * @param data
     * @returns {Promise<any>}
     */
    put(data)
    {
        return new Promise((resolve, reject) =>
        {
            const id = this.getUuid();
            const f = path.join(this.config.path, (id + '.txt'));

            if (!(typeof data === 'string') || !(data instanceof String))
            {
                data = JSON.stringify(data);
            }

            fs.writeFile(f, data, (err) =>
            {
                if (err)
                {
                    storage.loge(err);
                    return reject(err);
                }

                return resolve(id);
            });
        });
    }

    /**
     * Updates file content
     * @param id
     * @param data
     * @returns {Promise<any>}
     */
    update(id, data)
    {
        return new Promise((resolve, reject) =>
        {
            const f = path.join(this.config.path, (id + '.txt'));

            if (!(typeof data === 'string') && !(data instanceof String))
            {
                data = JSON.stringify(data);
            }

            fs.writeFile(f, data, (err) =>
            {
                if (err)
                {
                    storage.loge(err);
                    return reject(err);
                }

                return resolve(id);
            });
        });
    }

    /**
     * Removes file from storage folder
     * @param id
     * @returns {Promise<any>}
     */
    delete(id)
    {
        return new Promise((resolve, reject) =>
        {
            const f = path.join(this.config.path, (id + '.txt'));

            if (fs.existsSync(f))
            {
                fs.unlink(path, (err) =>
                {
                    if (err)
                    {
                        storage.loge(err);
                        return reject(err);
                    }

                    return resolve(id);
                });
            }
            else
            {
                return reject({message: 'Path not found'});
            }
        });
    }

    get(id)
    {
        return new Promise((resolve, reject) =>
        {

            const f = path.join(this.config.path, (id + '.txt'));
            if (!fs.existsSync(f))
            {
                return reject({id: id, message: 'Not found'});
            }

            fs.readFile(f, (err, data) =>
            {
                if (err)
                {
                    return reject(err);
                }

                try
                {
                    const o = JSON.parse(data);
                    return resolve(o);
                }
                catch (e)
                {
                    return reject(e);
                }
            });

        });
    }

    searchAsString(query)
    {
        return new Promise((resolve, reject) =>
        {
            findInFiles.find({term: query, flags: 'ig'}, this.config.path, '.txt$')
                .then(function (results)
                {
                    return resolve(results);
                }).catch(err =>
            {
                return reject(err);
            });
        });
    }

    /**
     *
     * https://www.npmjs.com/package/JSONPath
     * @param options object {data: {}, query: ''}
     * @returns {Promise<any>}
     */
    searchAsJson(options)
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                const result = jp({
                    json: options.data,
                    path: options.query
                });
                return resolve(result);
            }
            catch (e)
            {
                return reject(e);
            }
        });
    }

    async buildDataset(files)
    {
        let data = {};
        for (const file of files)
        {
            const id = path.parse(file).name;
            try
            {
                data[id] = await this.get(id);
            }
            catch (e)
            {
                console.log(`${e.message} on '${id}'`);
            }
        }

        return data;
    }

    /**
     * Search for the data within File Storage
     * @param query described on https://github.com/kaesetoast/find-in-files or config object
     * @returns {Promise<any>}
     */
    async search(query)
    {
        if ((typeof query === 'string') || (query instanceof String))
        {
            return this.searchAsString(query);
        }
        else
        {
            return new Promise((resolve, reject) =>
            {
                const _self = this;
                fs.readdir(this.config.path, async (err, files) =>
                {
                    if (err)
                    {
                        return reject(err);
                    }

                    if (!query.engine)
                    {
                        query.engine = 'text';
                    }

                    if (!query.query)
                    {
                        return reject({message: 'Missing .query parameter'});
                    }

                    switch (query.engine.toLowerCase())
                    {
                        case 'text':
                        {
                            try
                            {
                                const result = await this.searchAsString(query.query);
                                return resolve(result);
                            }
                            catch (e)
                            {
                                return reject(e);
                            }
                        }

                        case 'defiant':
                        {
                            let options = {
                                data: await this.buildDataset(files),
                                query: query.query
                            };

                            /*
                             //prior to v.2.2.4 the following code was the only way to get it working:
                             defiant.init().then(async (page) =>
                             {
                             const ev_search = await defiant.page.evaluate(`defiant.json.search(${JSON.stringify(options.data)}, \'${options.query}\')`);
                             return resolve(ev_search);
                             }).catch(e =>
                             {
                             return reject(e);
                             });*/

                            const snapshot_id = await defiant.create_snapshot(options.data);

                            try
                            {
                                const query_result = await defiant.search(snapshot_id, options.query);
                                return resolve(query_result);
                            }
                            catch (e)
                            {
                                return reject(e);
                            }
                        }

                        case 'jsonpath':
                        {
                            let options = {
                                data: await this.buildDataset(files),
                                query: query.query
                            };

                            try
                            {
                                const result = await this.searchAsJson(options);
                                return resolve(result);
                            }
                            catch (e)
                            {
                                return reject(e);
                            }
                        }
                        default:
                        {
                            reject({message: 'Unsupported query engine'});
                        }
                    }
                });
            });
        }

    }
}

module.exports = storage;
