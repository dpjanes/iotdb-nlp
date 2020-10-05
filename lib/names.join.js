/*
 *  lib/names.join.js
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

/**
 */
const names_join = _.promise(self => {
    _.promise.validate(self, names_join)

    self.names = self.namevs.map(v => v.join(" "))
})

names_join.method = "name.join"
names_join.description = ``
names_join.requires = {
    namevs: _.is.Array,
}
names_join.produces = {
    namevs: _.is.Array.of.String,
}

/**
 */
exports.names_join = names_join
