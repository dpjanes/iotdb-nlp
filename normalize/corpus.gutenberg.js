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
const document = require("iotdb-document")

const path = require("path")
const iconv = require('iconv')

const logger = require("../logger")(__filename)

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
const _load_metadata = _.promise(self => {
    self.metadata = {}
    self.lines
        .map(line => line.split(": ", 2))
        .filter(lines => lines.length === 2)
        .forEach(lines => {
            lines[0] = lines[0].toLowerCase().trim()
            lines[1] = lines[1].trim()

            self.metadata[lines[0]] = lines[1]
        })
})

_load_metadata.method = "_load_metadata"
_load_metadata.description = ``
_load_metadata.requires = {
    lines: _.is.Array,
}
_load_metadata.accepts = {
}
_load_metadata.produces = {
    metadata: _.is.Dictionary,
}

/**
 */
const gutenberg = _.promise((self, done) => {
    const _metadata = d => {
    }

    _.promise(self)
        .validate(gutenberg)

        .then(_load_knowns)
        .make(sd => {
            const preamble = sd.document.substring(0, 2000)
                .replace(/\r+/g, "")
            if (preamble.indexOf("Project Gutenberg") === -1) {
                return _.promise.bail()
            }

            sd.lines = preamble.split("\n")
        })
        .then(_load_metadata)
        .make(sd => {
            let document_encoding
            let value = sd.metadata['character set encoding']
            if (value.match(/\bISO-8859-1\b/i)) {
                document_encoding = "latin1"
            } else if (value.match(/\bLatin-?1\b/i)) {
                document_encoding = "latin1"
            } else if (value.match(/\bASCII\b/i)) {
                document_encoding = "ascii"
            } else if (value.match(/\bUTF-?8\b/i)) {
                document_encoding = "utf8"
            }

            if (!document_encoding && (document_encoding === self.nlp$path.document_encoding)) {
                return
            }

            sd.document = sd.nlp$path.document_raw
            sd.document_encoding = document_encoding
            sd.document = document.to.string.i(sd).document

            sd.nlp$path.document_encoding = document_encoding
            sd.nlp$path.document_encoded = sd.document

            sd.lines = sd.document.substring(0, 2000)
                .replace(/\r+/g, "")
                .split("\n")
        })
        .then(_load_metadata)

        // first edit of document - normalize newlines
        .make(sd => {
            if (sd.document.indexOf('\n') > -1) {
                sd.edit = {
                    find: /\r+/g,
                    replace: "",
                }
            } else if (sd.document.indexOf('\r') > -1) {
                sd.edit = {
                    find: /\r/g,
                    replace: "",
                }
            } else {
                sd.edit = null
            }
        })
        .then(nlp.normalize.edit.execute)

        // document metadata
        .make(sd => {
            _.mapObject(sd.metadata, (value, key) => {
                key = key.toLowerCase().trim()
                value = value.trim()

                switch (key) {
                case 'title':
                    _metadata({
                        key: "dc:title",
                        value: value,
                        score: 1,
                    })
                    break

                case 'author':
                    _metadata({
                        key: "dc:creator",
                        value: value,
                        score: 1,
                    })
                    break

                case 'ebook no.': // '0600831.txt' ]
                case 'edition': // '1' ]
                case 'language': // 'English' ]
                    console.log("META", key, value)
                    break

                case 'date first posted': // 'May 2006' ]
                case 'date most recently updated': // 'May 2006' ]
                    break

                // ignore
                case 'character set encoding': 
                    break
                }
            })
        })

        // find end of header/preamble
        .make(sd => {
            let max = 0
            let done = false
            let nlc = 0
            sd.lines.forEach((line, linex) => {
                if (done) {
                    return
                }

                if (line === "") {
                    if (++nlc === 6) { // sigh, they use lots of blank lines in preamble
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
                } else if (line.match(/(gutenberg|e-book|ebook|e-text|etext|Distributed Proofreading|Proofreading Teams|Proofreaders)/i)) {
                    console.log(linex, line, "MAGIC-1")
                    max = linex
                } else if (line.match(/^[*]/)) {
                    console.log(linex, line, "MAGIC-2")
                    max = linex
                } else if (line.match(/[[]Illustration/g)) {
                    done = true
                }
            })

            console.log("MAX", max)
            
            sd.edit = {
                find: new RegExp(`^([^\n]*\n){${max+1}}\n*`),
                replace: "",
            }
        })
        .then(nlp.normalize.edit.execute)
        .then(nlp.normalize.edit.commit)

        .end(done, self, gutenberg)

})

gutenberg.method = "normalize.corpus.gutenberg"
gutenberg.description = ``
gutenberg.requires = {
    document: _.is.String,
    nlp$path: {
    },
}
gutenberg.accepts = {
}
gutenberg.produces = {
    document: _.is.String,
    nlp$path: {
    },
}

/**
 */
exports.gutenberg = gutenberg
