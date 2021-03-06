/*
 *  normalize/utf8.js
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
const utf8 = _.promise((self, done) => {
    const nlp = require("..")

    _.promise(self)
        .validate(utf8)

        .conditional(sd => !_.is.Buffer(sd.document), _.promise.bail)
        .then(document.to.string)

        .end(done, self, utf8)
})

utf8.method = "document.utf8"
utf8.description = ``
utf8.requires = {
    document: [ _.is.String, _.is.Buffer ],
}
utf8.accepts = {
}
utf8.produces = {
    document: _.is.String,
}

/**
 *  API
 */
exports.utf8 = utf8
