/*
 *  lib/tokenize.paragraphs.js
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

/**
 */
const tokenize_paragraphs = _.promise(self => {
    _.promise.validate(self, tokenize_paragraphs)

    self.tokens = []

    const rex = /\n\n+/mg
    let match
    let current = 0

    const _add = _end => {
        if (current === _end) {
            return
        }

        self.tokens.push({
            document: self.document.substring(current, _end),
            token: "paragraph",
            start: current,
            end: _end,
        })
    }

    while (match = rex.exec(self.document)) {
        _add(match.index)

        current = match.index + match[0].length
    }

    _add(self.document.length)

    self.VERSION = tokenize_paragraphs.VERSION
})

tokenize_paragraphs.method = "tokenize.paragraphs"
tokenize_paragraphs.VERSION = "1.0.0"
tokenize_paragraphs.description = ``
tokenize_paragraphs.requires = {
    document: _.is.String,
}
tokenize_paragraphs.accepts = {
}
tokenize_paragraphs.produces = {
    tokens: _.is.Array.of.Dictionary,
    VERSION: _.is.String,
}
tokenize_paragraphs.params = {
    document: _.p.normal,
}
tokenize_paragraphs.p = _.p(tokenize_paragraphs)

/**
 *  API
 */
exports.tokenize_paragraphs = tokenize_paragraphs
