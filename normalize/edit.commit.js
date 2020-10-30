/*
 *  normalize/edit.commit.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-29
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
const nlp = require("..")
const fs = require("iotdb-fs")

const path = require("path")

/**
 */
const commit = _.promise(self => {
    _.promise.validate(self, commit)

    let adjustment = 0

    self.nlp$path.editvs = []
    self.nlp$path.editss.forEach(edits => {
        const vector = []
        let adjustment = 0

        edits.forEach(edit => {
            const position = edit[0]
            const change = edit[1]

            const n = -change + adjustment
            vector.push([ position - adjustment, n ])
            adjustment = n
        })

        self.nlp$path.editvs.unshift(vector)
    })

    self.nlp$path.editss = null
})

commit.method = "normalize._util.commit"
commit.description = ``
commit.requires = {
    nlp$path: {
        editss: _.is.Array,
    },
}
commit.accepts = {
}
commit.produces = {
    nlp$path: {
        editss: _.is.Null,
        editvs: _.is.Array,
    },
}

/**
 */
exports.commit = commit
