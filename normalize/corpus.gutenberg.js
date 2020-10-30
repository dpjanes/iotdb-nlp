/*
 *  normalize/corpus.gutenberg.js
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
const _load_knowns = _.promise((self, done) => {
    _.promise(self)
        .validate(_load_knowns)

        .then(fs.read.utf8.p(path.join(__dirname, "..", "data", "gutenberg", "selected.txt")))
        .make(sd => {
            sd.knowns = new Set(sd.document.split("\n").filter(line => line.length))
        })

        .end(done, self, _load_knowns)
})

_load_knowns.method = "_load_knowns"
_load_knowns.description = ``
_load_knowns.requires = {
}
_load_knowns.accepts = {
}
_load_knowns.produces = {
    knowns: _.is.Set,
}

/**
 */
const gutenberg = _.promise((self, done) => {
    _.promise(self)
        .validate(gutenberg)


        .then(_load_knowns)
        .make(sd => {
            const document = sd.document.substring(0, 2000)
                .replace(/\r+/g, "")
            if (document.indexOf("Project Gutenberg") === -1) {
                return
            }

            const lines = document.split("\n")
            lines
                .map(line => line.split(": ", 2))
                .filter(parts => parts.length === 2)
                .forEach(parts => {
                    parts[0] = parts[0].toLowerCase().trim()
                    parts[1] = parts[1].trim()
                    console.log(parts)
                })

            let max = 0
            let done = false
            let nlc = 0
            lines.forEach((line, linex) => {
                if (done) {
                    return
                }

                if (line === "") {
                    if (++nlc === 3) {
                        done = true
                        max = linex
                    }
                    return
                } else {
                    nlc = 0
                }

                line = line.replace(/:.*$/, ": ")
                if (sd.knowns.has(line)) {
                    console.log(linex, line, "KNOWN")
                    max = linex
                } else if (line.match(/gutenberg|e-book|ebook|e-text|etext/i)) {
                    console.log(linex, line, "MAGIC-1")
                    max = linex
                } else if (line.match(/^[*]/)) {
                    console.log(linex, line, "MAGIC-2")
                    max = linex
                }
            })

            console.log("MAX", max)
        })

        .end(done, self, gutenberg)

})

gutenberg.method = "normalize.corpus.gutenberg"
gutenberg.description = ``
gutenberg.requires = {
    document: _.is.String,
    /*
    nlp$path: {
        editss: _.is.Array,
    },
    */
}
gutenberg.accepts = {
}
gutenberg.produces = {
    /*
    nlp$path: {
        editss: _.is.Null,
        editvs: _.is.Array,
    },
    */
}

/**
 */
exports.gutenberg = gutenberg
