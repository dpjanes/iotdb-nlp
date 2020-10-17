/*
 *  samples/stanford-entities.js
 *
 *  David Janes
 *  IOTDB.org
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
const fetch = require("iotdb-fetch")
const fs = require("iotdb-fs")
const path = require("path")

_.promise()
    .add("path", path.join(__dirname, "../test/data/corpus/sherlock.txt"))
    .then(fs.read.utf8)
    .make(sd => {
        sd.url = "http://media.local:18081/entities"
        sd.json = {
            document: sd.document,
        }
        sd.headers = {
            "Authorization": "Bearer sample-token"
        }
    })
    .then(fetch.json.post({
        url: true,
        json: true,
        headers: true,
    }))
    .make(sd => {
        console.log(JSON.stringify(sd.json, null, 2))
    })
    .catch(error => {
        delete error.self
        console.log("#", _.error.message(error))
    })
