/**
 *  test/checkpoints.js
 *
 *  David Janes
 *  IOTDB
 *  2020-10-02
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

describe("checkpoints", function() {
    const _test = _.promise((self, done) => {
        _.promise(self)
            .add("path", path.join(__dirname, "data", self.test))
            .then(fs.read.utf8)
            .then(nlp.checkpoints)
            .make(sd => {
                console.log(JSON.stringify(sd.tokens, null, 2))
            })
            .end(done, {})
    })

    it("works (plain text)", function(done) {
        _.promise({
            document_media_type: "text/plain",
            tests: [
                "study-in-scarlet.txt",
            ],
            nlp$cfg: {
                checkpoints: [
                    {
                        "key": "part",
                        "rex": new RegExp("\n\n^(PART [A-Z]*)", "mgi"),
                    },
                    {
                        "key": "chapter",
                        "rex": new RegExp("\n\n^(Chapter [A-Z]*)[.]$", "mgi"),
                    },
                    {
                        "key": "paragraph",
                        "rex": new RegExp("\n\n(.*)?", "mgi"),
                        "excerpt": 30,
                    }
                ],
            }
        })
            .each({
                method: _test,
                inputs: "tests:test",
            })
            .end(done, {})
    })
})