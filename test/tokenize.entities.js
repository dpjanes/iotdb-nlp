/**
 *  test/tokenize.entities.js
 *
 *  David Janes
 *  IOTDB
 *  2020-10-03
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
const aws = require("iotdb-awslib")

const assert = require("assert")
const path = require("path")

const nlp = require("..")
const _util = require("./_util")

const WRITE = process.env.WRITE === "1"
const DUMP = process.env.DUMP === "1"

describe("tokenize.entities", function() {
    const _test = _.promise((self, done) => {
        const FOLDER = "tokenize.entities"

        _.promise(self)
            .then(_util.read_utf8("corpus", self.filename, "document"))
            .then(nlp.tokenize.entities)
            .conditional(WRITE, _util.write_yaml(FOLDER, self.filename, "tokens"))
            .conditional(DUMP, _.promise.log("tokens", "tokens"))
            .then(_util.read_yaml(FOLDER, self.filename, "want_tokens"))

            .make(sd => {
                const got = sd.tokens
                const want = sd.want_tokens
                assert.deepEqual(got, want)
            })
            .end(done, {})
    })

    it("works (plain text)", function(done) {
        this.timeout(20 * 1000)

        _.promise({
            verbose: true,

            aws$cfg: require("../.cfg/aws.json").aws$cfg,
            cache$cfg: {
                path: path.join(__dirname, "..", ".fs-cache"),
            },

            document_media_type: "text/plain",
            tests: [
                "study-in-scarlet",
            ],
        })
            .then(aws.initialize)
            .then(aws.comprehend.initialize)
            .then(fs.cache)
            .each({
                method: _test,
                inputs: "tests:filename",
            })
            .end(done, {})
    })
})
