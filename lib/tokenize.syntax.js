/*
 *  lib/tokenize.syntax.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-16
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
const tokenize_syntax = _.promise((self, done) => {
    _.promise.validate(self, tokenize_syntax)

    const nlp = require("..")

    _.promise(self)
        .then(self.nlp$cfg.tokenize_syntax)
        .end(done, self, tokenize_syntax)
})

tokenize_syntax.method = "tokenize.syntax"
tokenize_syntax.description = ``
tokenize_syntax.requires = {
    nlp$cfg: {
        tokenize_syntax: _.is.Function,
    },
    document: _.is.String,
}
tokenize_syntax.accepts = {
}
tokenize_syntax.produces = {
    tokens: _.is.Array.of.Dictionary,
}
tokenize_syntax.params = {
    document: _.p.normal,
}
tokenize_syntax.p = _.p(tokenize_syntax)

/**
 *  API
 */
exports.tokenize_syntax = tokenize_syntax
