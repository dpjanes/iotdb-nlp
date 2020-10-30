/*
 *  normalize/edit.execute.js
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
const execute = _.promise(self => {
    _.promise.validate(self, execute)

    const edits = []

    const rex = new RegExp(self.edit.find, "g")
    let match
    while (match = rex.exec(self.document)) {
        edits.push([ match.index, self.edit.replace.length - match[0].length ])
    }

    self.document = self.document.replace(self.edit.find, self.edit.replace)
    self.nlp$path.editss.push(edits)
})

execute.method = "normalize._util.execute"
execute.description = ``
execute.requires = {
    document: _.is.String,
    edit: [ _.is.Null, _.is.Dictionary ],
    nlp$path: {
        editss: _.is.Array,
    },
}
execute.accepts = {
    edit: {
        find: _.is.RegExp,
        replace: _.is.String,
    },
}
execute.produces = {
    document: _.is.String,
    nlp$path: {
        editss: _.is.Array,
    },
}

/**
 */
exports.execute = execute
