/*
 *  samples/group.js
 *
 *  David Janes
 *  IOTDB.org
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

const nlp = require("..")
const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

_.promise({
})
    .then(nlp.tokens.accumulate.initialize)

    .then(fs.read.yaml.p("../test/data/tokenize.entities/sherlock.yaml"))
    .then(nlp.tokens.accumulate.json)

    .then(fs.read.yaml.p("../test/data/tokenize.syntax/sherlock.yaml"))
    .then(nlp.tokens.accumulate.json)

    .then(fs.read.yaml.p("../test/data/checkpoints/sherlock.yaml"))
    .then(nlp.tokens.accumulate.json)

    .then(nlp.tokens.accumulate.release)

    .then(nlp.tokens.group.p({
        "token": "checkpoint",
        "tag": "paragraph",
    }))

    .make(sd => {
        console.log(JSON.stringify(sd.groups, null, 2))
    })

    .catch(error => {
        delete error.self
        console.log("#", error)
    })
