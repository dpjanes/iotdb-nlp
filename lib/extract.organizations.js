/*
 *  lib/extract.organizations.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-05
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
const extract_organizations = _.promise((self, done) => {
    const nlp = require("..")

    _.promise(self)
        .validate(extract_organizations)

        .make(sd => {
            const rawvs = sd.tokens
                .filter(token => token.tag === "ORGANIZATION")
                .map(token => nlp.normalize.split(token.document, []))
                .filter(token => token.length)

            // bonus for longer names
            const countd = {}
            rawvs.forEach(v => {
                const word = v.join(" ")
                countd[word] = (countd[word] || v.length) + 1
            })

            // order
            const entries = _.entries(countd)
            entries.sort((a, b) => b[1] - a[1])

            sd.entities = entries.map(entry => ({
                name: entry[0],
                token: "organization",
                score: entry[1] / entries[0][1],
                vectors: [ entry[0].split(" "), ],
            }))

            sd.VERSION = extract_organizations.VERSION
        })

        .end(done, self, extract_organizations)
})

extract_organizations.method = "extract.organizations"
extract_organizations.VERSION = "1.0.0"
extract_organizations.description = ``
extract_organizations.requires = {
    tokens: _.is.Array.of.Dictionary,
}
extract_organizations.accepts = {
}
extract_organizations.produces = {
    entities: _.is.Array,
    VERSION: _.is.String,
}

/**
 */
exports.extract_organizations = extract_organizations
