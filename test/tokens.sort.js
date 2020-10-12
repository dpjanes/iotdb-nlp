/**
 *  test/tokens.sort.js
 *
 *  David Janes
 *  IOTDB
 *  2020-10-12
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
const fs = require("iotdb-fs")

const assert = require("assert")
const path = require("path")

const nlp = require("..")
const _util = require("./_util")

const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("tokens.sort", function() {
    it("tokens.sort", function(done) {
        _.promise({
        })
            .then(fs.read.yaml.p(path.join(__dirname, "/data/tokenize.entities/sherlock.yaml")))
            .make(sd => {
                sd.tokens = sd.json
                sd.tokens.reverse()

                assert.ok(sd.tokens.length > 10)
                assert.ok(!_util.is_sorted(sd.tokens))
            })
            .then(nlp.tokens.sort)
            .make(sd => {
                assert.ok(_util.is_sorted(sd.tokens))
            })

            .end(done, {})
    })
})
