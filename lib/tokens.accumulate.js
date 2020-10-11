/*
 *  lib/tokens.accumulate.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-11
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
const query = require("iotdb-query")
const logger = require("../logger")(__filename)

/**
 */
const tokens_accumulate = _.promise(self => {
    _.promise.validate(self, tokens_accumulate)

    self.accumulator = [].concat(self.accumulator, self[self.accumulate_key || "tokens"] || [])

    // reverse order to make sure everything looks OK
    _.promise.validate(self, tokens_accumulate)
})

tokens_accumulate.method = "tokens.accumulate"
tokens_accumulate.description = ``
tokens_accumulate.requires = {
    accumulator: _.is.Array,
}
tokens_accumulate.accepts = {
    accumulate_key: _.is.String,
}
tokens_accumulate.produces = {
    accumulator: _.is.Array,
}
tokens_accumulate.params = {
    accumulate_key: _.p.normal,
}
tokens_accumulate.p = _.p(tokens_accumulate)

/**
 */
const tokens_initialize = _.promise(self => {
    _.promise.validate(self, tokens_initialize)

    self.accumulator = []
})

tokens_initialize.method = "tokens.accumulate.initialize"
tokens_initialize.description = ``
tokens_initialize.requires = {
}
tokens_initialize.accepts = {
}
tokens_initialize.produces = {
    accumulator: _.is.Array,
}

/**
 */
const tokens_release = _.promise(self => {
    _.promise.validate(self, tokens_release)

    self.tokens = self.accumulator
    self.tokens.sort((a, b) => a.start - b.start)
    self.accumulator = []
})

tokens_release.method = "tokens.accumulate.release"
tokens_release.description = ``
tokens_release.requires = {
    accumulator: _.is.Array,
}
tokens_release.accepts = {
}
tokens_release.produces = {
    tokens: _.is.Array,
}

/**
 *  API
 */
exports.tokens_accumulate = tokens_accumulate
exports.tokens_accumulate.json = tokens_accumulate.p("json")
exports.tokens_accumulate.tokens = tokens_accumulate.p("tokens")
exports.tokens_accumulate.release = tokens_release
exports.tokens_accumulate.initialize = tokens_initialize
