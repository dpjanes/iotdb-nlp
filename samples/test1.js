/*
 *  samples/test1.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-29
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
const nlp = require("..")
const fs = require("iotdb-fs")

const path = require("path")

_.promise({
    nlp$path: {
        document_raw: null,
        document_encoded: null,
        document_encoding: null,
        editss: [],
    },
})
    .then(fs.read.buffer.p(path.join(__dirname, "..", "corpus", "conan", "TheTowerOfTheElephant.txt")))
    // .then(fs.read.buffer.p("/Volumes/gutenberg/3/3/3/5/33355/33355-8.txt"))
    .add("document:nlp$path/document_raw")

    .then(nlp.normalize.encoding)

    .make(sd => {
        sd.document = sd.document.substring(0, 2000)

        // detect newline pattern
        if (sd.document.indexOf('\n') > -1) {
            sd.edit = {
                find: /\r+/g,
                replace: "",
            }
        } else if (sd.document.indexOf('\r') > -1) {
            sd.edit = {
                find: /\r/g,
                replace: "",
            }
        } else {
            sd.edit = null
        }
    })
    .then(nlp.normalize.corpus.gutenberg)
    .then(nlp.normalize.edit.execute)
    .then(nlp.normalize.edit.commit)
    .make(sd => {
        // console.log(sd.nlp$path.editvs)
        // console.log(sd.document)
        // console.log(JSON.stringify(sd.document, 2000), null, 2))
    })

    .catch(error => {
        delete error.self
        console.log("#", error)
    })
