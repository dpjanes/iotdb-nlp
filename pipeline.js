/*
 *  document/write.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-19
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const _util = require("../pipeline/_util")

/**
 */
const write_json = _.promise((self, done) => {
    _.promise(self)
        .validate(write_json)

        .make(sd => {
            sd.json = _.d.transform.json(sd[sd.action.key])
            sd.path = _util.join(sd, sd.data_path, sd.action.name)
        })
        .conditional(sd => sd.path.endsWith(".yaml"), fs.write.yaml, fs.write.json)
        .log("document.write.json", "path")

        .end(done, self, write_json)
})

write_json.method = "document.write_json"
write_json.description = `Write data to disk`
write_json.requires = {
    data_path: _.is.String,
    action: {
        key: _.is.String,
        name: _.is.String,
    },
}
write_json.accepts = {
}
write_json.produces = {
}

/**
 *  API
 */
exports.write = {
    json: write_json
}
