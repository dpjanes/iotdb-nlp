/*
 *  samples/persons.js
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
    path: "../test/data/tokenize.entities/study-in-scarlet.yaml",
})
    .then(fs.read.yaml)
    .add("json:tokens")

    .then(nlp.extract.organizations)
    .make(sd => {
        console.log(JSON.stringify(sd.organizations, null, 2))
        console.log("+", "fin")
    })

    .catch(error => {
        delete error.self
        console.log("#", error)
    })
