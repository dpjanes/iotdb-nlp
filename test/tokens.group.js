/**
 *  test/tokens.group.js
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

describe("tokens.group", function() {
    it("tokens.group", function(done) {
        const FOLDER = "tokens.group"
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
            .then(nlp.tokens.group.p({
                "token": "checkpoint",
                "tag": "paragraph",
            }))
            .make(sd => {
                assert.ok(_.is.Array(sd.groups))
                sd.groups.forEach(tokens => assert.ok(_.is.Array.of.Dictionary(tokens)))
                sd.groups.forEach(tokens => assert.ok(_util.is_sorted(tokens)))
            })

            .conditional(WRITE, _util.write_yaml(FOLDER, FILENAME, "groups"))
            .conditional(DUMP, _.promise.log("groups", "groups"))
            .then(_util.read_yaml(FOLDER, FILENAME, "want_groups"))
            .make(sd => {
                const got = sd.groups
                const want = sd.want_groups
                assert.deepEqual(got, want)
            })

            .end(done, {})
    })

    it("tokens.group (", function(done) {
        const FOLDER = "tokens.group"
        const FILENAME = "checkpoints-only"

        _.promise({
        })
            .then(nlp.tokens.accumulate.initialize)

            .then(fs.read.yaml.p(path.join(__dirname, "/data/checkpoints/sherlock.yaml")))
            .then(nlp.tokens.accumulate.json)

            .then(fs.read.yaml.p(path.join(__dirname, "/data/tokenize.sentences/sherlock.yaml")))
            .then(nlp.tokens.accumulate.json)

            .then(nlp.tokens.accumulate.release)
            .then(nlp.tokens.group.p("checkpoint")) // becomes { token: "checkpoint" }
            .make(sd => {
                assert.ok(_.is.Array(sd.groups))
                sd.groups.forEach(tokens => assert.ok(_.is.Array.of.Dictionary(tokens)))
                sd.groups.forEach(tokens => assert.ok(_util.is_sorted(tokens)))
            })

            .conditional(WRITE, _util.write_yaml(FOLDER, FILENAME, "groups"))
            .conditional(DUMP, _.promise.log("groups", "groups"))
            .then(_util.read_yaml(FOLDER, FILENAME, "want_groups"))
            .make(sd => {
                const got = sd.groups
                const want = sd.want_groups
                assert.deepEqual(got, want)
            })

            .end(done, {})
    })
})
