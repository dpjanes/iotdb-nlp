/*
 *  lib/tokenize.words.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-01
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
    const rex = /(\n\n+)/mg

    self.document.split(rex)
        .forEach(text => {
            if (!text.match(rex)) {
                console.log("TEXT", text)
            }

            current += text.length
        })
})

tokenize_words.method = "tokenize.words"
tokenize_words.description = ``
tokenize_words.requires = {
    document: _.is.String,
}
tokenize_words.accepts = {
}
tokenize_words.produces = {
    tokens: _.is.Array.of.Dictionary,
}
tokenize_words.params = {
    document: _.p.normal,
}
tokenize_words.p = _.p(tokenize_words)

/**
 *  API
 */
exports.tokenize_words = tokenize_words
