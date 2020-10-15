/**
 *  test/tokens.merge.js
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

describe("tokens.merge", function() {
    it("tokens.merge.p", function(done) {
        const FOLDER = "tokens.merge.p"
        const FILENAME = "sherlock"

        _.promise({
        })
            .then(fs.read.yaml.p(path.join(__dirname, "/data/tokenize.entities.aws/sherlock.yaml")))
            .add("json:entities")

            .then(fs.read.yaml.p(path.join(__dirname, "/data/tokenize.syntax/sherlock.yaml")))
            .add("json:syntax")

            .then(fs.read.yaml.p(path.join(__dirname, "/data/checkpoints/sherlock.yaml")))
            .add("json:checkpoints")

            .then(nlp.tokens.merge.p([ "entities", "syntax", "checkpoints" ]))

            .conditional(WRITE, _util.write_yaml(FOLDER, FILENAME, "tokens"))
            .conditional(DUMP, _.promise.log("tokens", "tokens"))
            .then(_util.read_yaml(FOLDER, FILENAME, "want_tokens"))
            .make(sd => {
                const got = sd.tokens
                const want = sd.want_tokens
                assert.deepEqual(got, want)
                assert.ok(_util.is_sorted(sd.tokens))
            })

            .end(done, {})
    })
})
