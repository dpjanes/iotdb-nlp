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

console.log("A")
    _.promise(self)
        .validate(names_extract)
        .make(sd => {
            const trimlist = [
                "dr",
                "the",
                "mr",
                "mrs",
                "ms",
            ]

            const _split = word => nlp.normalize(word)
                .replace(/[^A-Za-z ]/g, " ")
                .split(/\s+/)
                .filter(x => x.length)
                .filter(x => trimlist.indexOf(x) === -1)

            const wordss = sd.tokens
                .filter(token => token.tag === "PERSON")
                .map(token => token.document)
                .map(_split)

            const countd = {}
            wordss.forEach(tokens => {
                tokens.forEach(token => {
                    countd[token] = (countd[token] || 0) + 1
                })
            })

            // uniq wordss - javascript isn't great for this
            const seend = {}
            const utokenized = []
            wordss.forEach(tokens => {
                const phrase = tokens.join(" ")
                if (!seend[phrase]) {
                    seend[phrase] = true
                    utokenized.push(tokens)
                }
            })

            // score each of the wordss words
            const scores = utokenized
                .map(tokens => tokens.map(token => countd[token]))
                .map(scores => scores.reduce((a, b) => a + b, 0))
                .map((score, x) => [ score, x ])

            scores.sort((a, b) => b[0] - a[0])
            scores.forEach(score => {
                const phrase = utokenized[score[1]]
                const weight = score[0]

                if (phrase.length < 2) {
                    return
                }
            })

            const vectors = scores
                .map(score => utokenized[score[1]])
                .filter(vector => vector.length > 1)

            /**
             *  Return true if 'bv' is contained in 'av'.
             *  If any letter is initialized, this is considered
             *  a match
             */
            const is_contained = (av, bv) => {
                let bi = 0

                for (let ai = 0; ai < av.length; ai++) {
                    const a = av[ai]
                    const b = bv[bi]

                    if ((a === b) || 
                        (a.length === 1 && b.startsWith(a)) ||
                        (b.length === 1 && a.startsWith(b))) {
                        if (++bi === bv.length) {
                            return true
                        }
                    }
                }

                return false
            }

            sd.names = []
            const blocked = {}
            vectors.forEach((av, ax) => {
                if (blocked[ax]) {
                    return
                }

                sd.names.push(av)

                vectors.forEach((bv, bx) => {
                    if (ax === bx) {
                        return
                    } 

                    if (is_contained(av, bv)) {
                        blocked[bx] = true
                        // console.log(av, bv)
                    } else if (is_contained(bv, av)) {
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
