/*
 *  lib/extract.persons.js
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
const extract_persons = _.promise((self, done) => {
    const nlp = require("..")

    _.promise(self)
        .validate(extract_persons)
        .make(sd => {
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
                .filter(token => token.length)

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

            sd.persons = []
            const blocked = {}

            const topvs = scores
                .map(score => uwordss[score[1]])
                
            topvs.forEach((av, ax) => {
                if (blocked[ax]) {
                    return
                }
                
                if (av.length <= 1) {
                    return
                }

                const named = {
                    name: av.join(" "),
                    token: "person",
                    score: scores[ax][0] / scores[0][0],
                    vectors: [ av ],
                }
                sd.persons.push(named)

                topvs.forEach((bv, bx) => {
                    if (ax === bx) {
                        return
                    } 

                    if (!nlp.vector.contained(av, bv) && !nlp.vector.contained(bv, av)) {
                        return
                    }

                    blocked[bx] = true

                    if (bv.length > 1) { // long word - ok
                        named.vectors.push(bv)
                    } else if (bv[0].length === 1) { // one letter - ignore
                    } else if (bv[0] === av[0]) { // first name - ignore (I think)
                        // named.vectors.push(bv)
                    } else if (bv[0] === av[av.length - 1]) { // last name - use
                        named.vectors.push(bv)
                    }
                })
            })
        })

        .end(done, self, extract_persons)
})

extract_persons.method = "name.extract"
extract_persons.description = ``
extract_persons.requires = {
    tokens: _.is.Array.of.Dictionary,
}
extract_persons.accepts = {
}
extract_persons.produces = {
    persons: _.is.Array,
}

/**
 */
exports.extract_persons = extract_persons
