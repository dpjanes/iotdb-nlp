/*
 *  lib/tokenize.sentences.js
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

let _once

/**
 */
const tokenize_sentences = _.promise(self => {
    _.promise.validate(self, tokenize_sentences)

    self.tokens = []

    let ss
    try {
        ss = require("sentence-splitter")
    } catch (x) {
        if (_once) {
            return
        }

        logger.warn({
            method: tokenize_sentences.method,
            module_name: "sentence-splitter",
        }, "optional module needs to be installed to use this method")

        _once = true

        self.VERSION = null
        return
    }

    let current = 0
    const rex = /(\n\n+)/mg

    self.document.split(rex)
        .forEach(text => {
            if (!text.match(rex)) {
                ss.split(text)
                    .filter(d => d.type === "Sentence")
                    .map(d => ({
                        document: d.raw,
                        token: "sentence",
                        start: d.range[0] + current,
                        end: d.range[1] + current,
                    }))
                    .forEach(d => self.tokens.push(d))
            }

            current += text.length
        })

    self.VERSION = tokenize_sentences.VERSION
})

tokenize_sentences.method = "tokenize.sentences"
tokenize_sentences.VERSION = "1.0.0"
tokenize_sentences.description = ``
tokenize_sentences.requires = {
    document: _.is.String,
}
tokenize_sentences.accepts = {
}
tokenize_sentences.produces = {
    tokens: _.is.Array.of.Dictionary,
    VERSION: _.is.String,
}
tokenize_sentences.params = {
    document: _.p.normal,
}
tokenize_sentences.p = _.p(tokenize_sentences)

/**
 *  API
 */
exports.tokenize_sentences = tokenize_sentences
