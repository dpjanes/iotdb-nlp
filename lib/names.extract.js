/*
 *  lib/names.extract.js
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
const names_extract = _.promise((self, done) => {
    const nlp = require("..")

    _.promise(self)
        .validate(names_extract)
        .make(sd => {
            sd.names = []

            const trimlist = [
                "dr",
                "the",
                "mr",
                "mrs",
                "ms",
            ]

            const rawvs = sd.tokens
                .filter(token => token.tag === "PERSON")
                .map(token => nlp.normalize.split(token.document, trimlist))

            const countd = {}
            rawvs.forEach(v => {
                v.forEach(word => {
                    countd[word] = (countd[word] || 0) + 1
                })
            })

            // uniq rawvs - javascript isn't great for this
            const seend = {}
            const uwordss = []
            rawvs.forEach(v => {
                const phrase = v.join(" ")

                if (!seend[phrase]) {
                    seend[phrase] = true
                    uwordss.push(v)
                }
            })

            // score each of the rawvs words
            const scores = uwordss
                .map(tokens => tokens.map(word => countd[word]))
                .map(scores => scores.reduce((a, b) => a + b, 0))
                .map((score, x) => [ score, x ])

            scores.sort((a, b) => b[0] - a[0])

            const topvs = scores
                .map(score => uwordss[score[1]])
                .filter(vector => vector.length > 1)
                
            const blocked = {}
            topvs.forEach((av, ax) => {
                if (blocked[ax]) {
                    return
                }

                sd.names.push(av)

                topvs.forEach((bv, bx) => {
                    if (ax === bx) {
                        return
                    } 

                    if (nlp.names.contained(av, bv)) {
                        blocked[bx] = true
                        // console.log(av, bv)
                    } else if (nlp.names.contained(bv, av)) {
                        blocked[bx] = true
                        // console.log(av, bv)
                    }
                })
            })
        })

        .end(done, self, names_extract)
})

names_extract.method = "name.extract"
names_extract.description = ``
names_extract.requires = {
    tokens: _.is.Array.of.Dictionary,
}
names_extract.accepts = {
}
names_extract.produces = {
    names: _.is.Array,
}

/**
 */
exports.names_extract = names_extract
