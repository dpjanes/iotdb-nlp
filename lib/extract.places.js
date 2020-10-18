/*
 *  lib/extract.places.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-08
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
const extract_places = _.promise((self, done) => {
    const nlp = require("..")

    _.promise(self)
        .validate(extract_places)
        .make(sd => {
            const rawvs = sd.tokens
                .filter(token => token.tag === "LOCATION")
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

            sd.places = entries.map(entry => ({
                name: entry[0],
                token: "place",
                score: entry[1] / entries[0][1],
                vectors: [ entry[0].split(" "), ],
            }))

            sd.VERSION = extract_places.VERSION
        })

        .end(done, self, extract_places)
})

extract_places.method = "place.extract"
extract_places.VERSION = "1.0.0"
extract_places.description = ``
extract_places.requires = {
    tokens: _.is.Array.of.Dictionary,
}
extract_places.accepts = {
}
extract_places.produces = {
    places: _.is.Array,
    VERSION: _.is.String,
}

/**
 */
exports.extract_places = extract_places
