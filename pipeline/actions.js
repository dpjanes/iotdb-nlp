/*
 *  pipeline/actions.js
 *
 *  David Janes
 *  IOTDB.org
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
const _one = _.promise((self, done) => {
    const nlp = require("..")

    _.promise(self)
        .validate(_one)

        .make(sd => {
            if (_.is.Array(sd.action)) {
                sd.actions = sd.action
                sd.action = null
            }
        })
        .conditional(sd => sd.action, nlp.pipeline.action, nlp.pipeline.actions)

        .end(done, self, _one)
})

_one.method = "yyy._one"
_one.description = ``
_one.requires = {
    action: [ _.is.String, _.is.Array ],
}
_one.accepts = {
}
_one.produces = {
}


/**
 */
const actions = _.promise((self, done) => {
    _.promise(self)
        .validate(actions)

        .each({
            method: _one,
            inputs: "actions:action",
        })

        .end(done, self, actions)
})

actions.method = "pipeline.actions"
actions.description = ``
actions.requires = {
    actions: _.is.Array,
    document: [ _.is.String, _.is.Buffer, _.is.Null ],
}
actions.accepts = {
}
actions.produces = {
}

/**
 *  API
 */
exports.actions = actions
