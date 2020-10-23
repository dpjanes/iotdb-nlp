/**
 *  pipeline/preprocess.js
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
const fs = require("iotdb-fs")

const path = require("path")

const nlp = require("..")

/**
 */
const preprocess = _.promise((self, done) => {
    _.promise(self)
        .validate(preprocess)

        .each({
            method: nlp.pipeline.execute,
            inputs: "paths:path",
        })

        .end(done, self, preprocess)
})

preprocess.method = "cli.preprocess"
preprocess.description = ``
preprocess.requires = {
    paths: _.is.Array,
    nlp$cfg: _.is.Dictionary,
}
preprocess.accepts = {
}
preprocess.produces = {
}

/*
 *  API
 */
exports.preprocess = preprocess
