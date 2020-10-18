/*
 *  lib/tokenize.words.js
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
const tokenize_words = _.promise(self => {
    _.promise.validate(self, tokenize_words)

    self.tokens = []

    let current = 0
    const para_rex = /(\n\n+)/mg
    const word_rex = /\s+/mg

    self.document.split(para_rex).forEach(text => {
        if (text.match(para_rex)) {
            current += text.length
            return
        }

        // this has to mirror "normalize"
        text = text.toLowerCase()
        text = text.replace(/[\u0300-\u036f]/g, " ")
        text = text.normalize("NFD")
        text = text.replace(/[\u0300-\u036f]/g, "")
        text = text.replace(/[^A-Za-z0-9 ]/g, " ")

        let word_current = 0
        text.split(word_rex).forEach(word => {
            if (word.match(word_rex)) {
            } else if (!word.length) {
            } else {
                self.tokens.push({
                    document: word,
                    token: "word",
                    start: current,
                    end: current + word.length,
                })
            }

            current += word.length
        })

        current += text.length
    })

    self.VERSION = tokenize_words.VERSION
})

tokenize_words.method = "tokenize.words"
tokenize_words.VERSION = "1.0.0"
tokenize_words.description = ``
tokenize_words.requires = {
    document: _.is.String,
}
tokenize_words.accepts = {
}
tokenize_words.produces = {
    tokens: _.is.Array.of.Dictionary,
    VERSION: _.is.String,
}
tokenize_words.params = {
    document: _.p.normal,
}
tokenize_words.p = _.p(tokenize_words)

/**
 *  API
 */
exports.tokenize_words = tokenize_words
