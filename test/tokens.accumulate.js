/**
 *  test/tokens.accumulate.js
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

describe("tokens.accumulate", function() {
    it("tokens.accumulate.initialize", function(done) {
        _.promise({
        })
            .make(sd => {
                assert.ok(_.is.Undefined(sd.accumulator))
            })
            .then(nlp.tokens.accumulate.initialize)
            .make(sd => {
                const got = sd.accumulator
                const want = []
                assert.deepEqual(got, want)
            })

            .end(done, {})
    })

    it("tokens.accumulate.json", function(done) {
        const FOLDER = "tokens.accumulate.json"
        const FILENAME = "sherlock"

        _.promise({
        })
            .then(nlp.tokens.accumulate.initialize)

            .then(fs.read.yaml.p(path.join(__dirname, "/data/tokenize.entities/sherlock.yaml")))
            .then(nlp.tokens.accumulate.json)

            .conditional(WRITE, _util.write_yaml(FOLDER, FILENAME, "accumulator"))
            .conditional(DUMP, _.promise.log("accumulator", "accumulator"))
            .then(_util.read_yaml(FOLDER, FILENAME, "want_accumulator"))
            .make(sd => {
                const got = sd.accumulator
                const want = sd.want_accumulator
                assert.deepEqual(got, want)
            })

            .end(done, {})
    })

    it("tokens.accumulate.release", function(done) {
        const FOLDER = "tokens.accumulate.release"
        const FILENAME = "sherlock"

        _.promise({
        })
            .then(nlp.tokens.accumulate.initialize)

            .then(fs.read.yaml.p(path.join(__dirname, "/data/tokenize.entities/sherlock.yaml")))
            .then(nlp.tokens.accumulate.json)

            .then(fs.read.yaml.p(path.join(__dirname, "/data/tokenize.syntax/sherlock.yaml")))
            .then(nlp.tokens.accumulate.json)

            .then(fs.read.yaml.p(path.join(__dirname, "/data/checkpoints/sherlock.yaml")))
            .then(nlp.tokens.accumulate.json)

            .then(fs.read.yaml.p(path.join(__dirname, "/data/tokenize.sentences/sherlock.yaml")))
            .then(nlp.tokens.accumulate.json)

            .then(nlp.tokens.accumulate.release)

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
