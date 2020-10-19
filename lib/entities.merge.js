/*
 *  lib/entities.merge.js
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
const logger = require("../logger")(__filename)

/**
 */
const entities_merge = _.promise((self, done) => {
    _.promise(self)
        .validate(entities_merge)

        .make(sd => {
            sd.entities = _.flatten(sd.keys.map(key => sd[key]).filter(entities => _.is.Array(entities)))
        })
        .end(done, self, entities_merge)
})

entities_merge.method = "entities.merge"
entities_merge.description = ``
entities_merge.requires = {
    keys: _.is.Array.of.String,
}
entities_merge.accepts = {
}
entities_merge.produces = {
    entities: _.is.Array.of.Dictionary,
}
entities_merge.params = {
    keys: _.p.normal,
}
entities_merge.p = _.p(entities_merge)

/**
 *  API
 */
exports.entities_merge = entities_merge
