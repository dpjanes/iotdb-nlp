/*
 *  lib/tokens.group.js
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
const query = require("iotdb-query")
const logger = require("../logger")(__filename)

/**
 */
const tokens_group = _.promise(self => {
    _.promise.validate(self, tokens_group)

    self.groups = []

    let grouping = self.grouping
    if (_.is.String(grouping)) {
        grouping = {
            token: grouping,
        }
    }

    let group = null
    let group_token = null

    self.tokens.forEach(token => {
        if (query.test(token, grouping)) {
            group_token = token

            self.groups.push(group = [])
        } 

        if (group_token && (token.start >= group_token.start) && (token.start < group_token.end)) {
            group.push(token)
        }
    })
})

tokens_group.method = "tokens.group"
tokens_group.description = ``
tokens_group.requires = {
    tokens: _.is.Array.of.Dictionary,
    grouping: [ _.is.String, _.is.Dictionary ],
}
tokens_group.accepts = {
}
tokens_group.produces = {
    groups: _.is.Array.of.Array,
}
tokens_group.params = {
    grouping: _.p.normal,
}
tokens_group.p = _.p(tokens_group)

/**
 *  API
 */
exports.tokens_group = tokens_group
