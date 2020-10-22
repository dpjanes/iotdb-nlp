/*
 *  stanford/tokenize.entities.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-17
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
const cache = require("iotdb-cache")
const logger = require("../logger")(__filename)
const fetch = require("iotdb-fetch")

/**
 */
const _fetch = _.promise((self, done) => {
    _.promise(self)
        .validate(_fetch)

        .make(sd => {
            sd.json = {
                document: sd.itoken.document,
            }
            sd.url = sd.nlp$cfg.stanford.url + "/entities"
            sd.headers = {}
            if (sd.nlp$cfg.stanford.token) {
                sd.headers.authorization = `Bearer ${sd.nlp$cfg.stanford.token}`
            }
        })
        .then(fetch.json.post({
            url: true,
            headers: true,
            json: true,
        }))

        .end(done, self, _fetch)
})

_fetch.method = "stanford.tokenize.entities/_fetch"
_fetch.description = ``
_fetch.requires = {
}
_fetch.accepts = {
}
_fetch.produces = {
    json: _.is.JSON,
}

/**
 */
const _one = _.promise((self, done) => {
    const stanford = require("iotdb-awslib")

    _.promise(self)
        .validate(_one)

        .make(sd => {
            sd.rule = {
                key: `/stanford.entities/${_.hash.md5(sd.itoken.document)}`,
                values: "json",
                method: _fetch,
            }
        })
        .then(cache.execute)
        .make(sd => {
            sd.tokens = sd.json.items

            let clean = false
            let last = null
            sd.tokens.forEach(otoken => {
                otoken.start += sd.itoken.start
                otoken.end += sd.itoken.start

                let join = false
                if (!last) {
                } else if (otoken.tag !== last.tag) {
                } else if ((otoken.tag === "PERSON") &&
                    sd.document.substring(last.end, otoken.start).match(/^\s*$/)) {
                    join = true
                } else if ((otoken.tag === "ORGANIZATION") &&
                    sd.document.substring(last.end, otoken.start).match(/^\s*$/)) {
                    join = true
                } else if ((otoken.tag === "LOCATION") &&
                    sd.document.substring(last.end, otoken.start).match(/^[\s,]+$/)) {
                    join = true
                } 

                if (join) {
                    last._remove = true
                    otoken.score = Math.max(otoken.score, last.score)
                    otoken.start = last.start
                    otoken.document = sd.document.substring(otoken.start, otoken.end)
                    clean = true
                }

                last = otoken
            })

            if (clean) {
                sd.tokens = sd.tokens.filter(token => !token._remove)
            }
        })

        .end(done, self, _one)
})

_one.method = "stanford.tokenize.entities/_one"
_one.description = ``
_one.requires = {
    itoken: _.is.Dictionary,
}
_one.accepts = {
    cache: _.is.Dictionary,
}
_one.produces = {
    tokens: _.is.Array,
}

/**
 */
const tokenize_entities = _.promise((self, done) => {
    _.promise.validate(self, tokenize_entities)

    const nlp = require("..")

    _.promise(self)
        .validate(tokenize_entities)

        .then(nlp.tokenize.paragraphs)
        .each({
            method: _one,
            inputs: "tokens:itoken",
            outputs: "tokens",
            output_selector: sd => sd.tokens,
            output_flatten: _.flatten,
        })
        .make(sd => {
            sd.VERSION = tokenize_entities.VERSION
        })

        .end(done, self, tokenize_entities)
})

tokenize_entities.method = "stanford.tokenize.entities"
tokenize_entities.VERSION = "4.0.0"
tokenize_entities.description = ``
tokenize_entities.requires = {
    nlp$cfg: {
        stanford: {
            url: _.is.AbsoluteURL,
        },
    },
    document: _.is.String,
}
tokenize_entities.accepts = {
    nlp$cfg: {
        stanford: {
            token: _.is.String,
        },
    },
    cache: _.is.Dictionary,
}
tokenize_entities.produces = {
    tokens: _.is.Array.of.Dictionary,
    VERSION: _.is.String,
}
tokenize_entities.params = {
    document: _.p.normal,
}
tokenize_entities.p = _.p(tokenize_entities)

/**
 *  API
 */
exports.tokenize_entities = tokenize_entities
