/*
 *  normalize/encoding.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-19
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
const document = require("iotdb-document")

const logger = require("../logger")(__filename)

/**
 */
const encoding = _.promise((self, done) => {
    const nlp = require("..")

    _.promise(self)
        .validate(encoding)

        .conditional(sd => !_.is.Buffer(sd.document), _.promise.bail)
        .then(document.identify.encoding)
        .then(document.to.string)
        .add("document_encoding:nlp$path/document_encoding")

        .end(done, self, encoding)
})

encoding.method = "document.encoding"
encoding.description = ``
encoding.requires = {
    document: [ _.is.String, _.is.Buffer ],
    nlp$path: {
    },
}
encoding.accepts = {
}
encoding.produces = {
    document: _.is.String,
    nlp$path: {
        document_encoding: _.is.String,
    },
}

/**
 *  API
 */
exports.encoding = encoding
