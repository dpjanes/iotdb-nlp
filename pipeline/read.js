/*
 *  pipeline/read.js
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
const read = _.promise((self, done) => {
    _.promise(self)
        .validate(read)

        .make(sd => {
            sd.VERSION = read.VERSION
        })

        .end(done, self, read)
})

read.method = "pipeline.read"
read.version = "1.0.0"
read.description = ``
read.requires = {
    source_path: _.is.String,
}
read.accepts = {
}
read.produces = {
    VERSION: _.is.String,
}

/**
 *  API
 */
exports.read = read
