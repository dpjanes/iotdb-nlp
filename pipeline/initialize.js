/*
 *  pipeline/initialize.js
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
const fs = require("iotdb-fs")

const _util = require("./_util")

/**
 */
const initialize = _.promise((self, done) => {
    _.promise(self)
        .validate(initialize)

        .make(sd => {
            sd.pipeline.folder = _util.join(sd, sd.pipeline.root, sd.pipeline.folder)
            sd.path = sd.pipeline.folder 
        })
        .then(fs.make.directory)

        .end(done, self, initialize)
})

initialize.method = "pipeline.initialize"
initialize.description = ``
initialize.requires = {
    pipeline: {
        root: _.is.String,
        folder: _.is.String,
    },
}
initialize.accepts = {
}
initialize.produces = {
}

/**
 *  API
 */
exports.initialize = initialize
