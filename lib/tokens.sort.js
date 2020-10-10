/*
 *  lib/tokens.sort.js
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
const tokens_sort = _.promise(self => {
    _.promise.validate(self, tokens_sort)

    self.tokens.sort((a, b) => a.start - b.start)
})

tokens_sort.method = "tokens.sort"
tokens_sort.description = ``
tokens_sort.requires = {
    tokens: _.is.Array.of.Dictionary,
}
tokens_sort.accepts = {
}
tokens_sort.produces = {
    tokens: _.is.Array.of.Dictionary,
}

/**
 *  API
 */
exports.tokens_sort = tokens_sort
