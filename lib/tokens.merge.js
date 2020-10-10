/*
 *  lib/tokens.merge.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-10
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
const tokens_merge = _.promise((self, done) => {
    _.promise(self)
        .validate(tokens_merge)

        .make(sd => {
            sd.tokens = _.flatten(sd.keys.map(key => sd[key]).filter(tokens => _.is.Array(tokens)))
            sd.tokens.sort((a, b) => a.start - b.start)
        })
        .end(done, self, tokens_merge)
})

tokens_merge.method = "merge"
tokens_merge.description = ``
tokens_merge.requires = {
    keys: _.is.Array.of.String,
}
tokens_merge.accepts = {
}
tokens_merge.produces = {
    tokens: _.is.Array.of.Dictionary,
}
tokens_merge.params = {
    keys: _.p.normal,
}
tokens_merge.p = _.p(tokens_merge)

/**
 *  API
 */
exports.tokens_merge = tokens_merge
