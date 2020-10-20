/**
 *  test/tokenize.entities.js
 *
 *  David Janes
 *  IOTDB
 *  2020-10-16
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
    it("fail - requires more setup", function(done) {
        this.timeout(20 * 1000)

        _.promise({
            verbose: true,

            aws$cfg: require("../.cfg/aws.json"),
            cache$cfg: {
                path: path.join(__dirname, "..", ".fs-cache"),
            },
            nlp$cfg: {
            },

            document_media_type: "text/plain",
            tests: [
                "harry",
            ],
        })
            .then(nlp.initialize)

            .then(_util.read_utf8("../../corpus", "harry", "document"))
            .then(nlp.tokenize.entities)

            .then(_util.auto_fail(done))
            .catch(_util.ok_error(done))
    })
})
