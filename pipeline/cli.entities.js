/**
 *  pipeline/entities.js
 *
 *  David Janes
 *  2020-10-18
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
const _util = require("./_util")

/**
 */
const _entities = _.promise((self, done) => {
    _.promise(self)
        .validate(_entities)

        .make(sd => {
            const path_info = _util.path_info(sd, sd.path)
            console.log(path_info)
        })

        .end(done, self, _entities)
})

_entities.method = "pipeline.cli.entities/_entities"
_entities.description = ``
_entities.requires = {
}
_entities.accepts = {
}
_entities.produces = {
}


/**
 */
const entities = _.promise((self, done) => {
    const nlp = require("..")

    _.promise(self)
        .validate(entities)

        .each({
            method: _entities,
            inputs: "paths:path",
        })

        .end(done, self, entities)
})

entities.method = "cli.entities"
entities.description = ``
entities.requires = {
    paths: _.is.Array,
    nlp$cfg: _.is.Dictionary,
}
entities.accepts = {
}
entities.produces = {
}

/*
 *  API
 */
exports.entities = entities
