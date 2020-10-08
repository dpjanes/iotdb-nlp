/**
 *  test/extract.places.js
 *
 *  David Janes
 *  IOTDB
 *  2020-10-08
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

describe("extract.places", function() {
    const _test = _.promise((self, done) => {
        const FOLDER = "extract.places"

        _.promise(self)
            .then(_util.read_yaml("tokenize.entities", self.filename, "tokens"))
            .then(nlp.extract.places)
            .conditional(WRITE, _util.write_yaml(FOLDER, self.filename, "places"))
            .then(_util.read_yaml(FOLDER, self.filename, "want_places"))

            .make(sd => {
                const got = sd.places
                const want = sd.want_places
                assert.deepEqual(got, want)
            })
            .end(done, {})
    })

    it("works (plain text)", function(done) {
        this.timeout(20 * 1000)

        _.promise({
            verbose: true,

            document_media_type: "text/plain",
            tests: [
                "study-in-scarlet",
            ],
        })
            .each({
                method: _test,
                inputs: "tests:filename",
            })
            .end(done, {})
    })
})
