/*
 *  stanford/tokenize.syntax.js
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
            sd.url = sd.nlp$cfg.stanford.url + "/pos"
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

_fetch.method = "stanford.tokenize.syntax/_fetch"
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
    _.promise(self)
        .validate(_one)

        .make(sd => {
            sd.rule = {
                key: `/stanford.syntax/${_.hash.md5(sd.itoken.document)}`,
                values: "json",
                method: _fetch,
            }
        })
        .then(cache.execute)
        .make(sd => {
            sd.tokens = sd.json.items

            sd.tokens.forEach(otoken => {
                otoken.start += sd.itoken.start
                otoken.end += sd.itoken.start
            })
        })

        .end(done, self, _one)
})

_one.method = "stanford.tokenize.syntax/_one"
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
const tokenize_syntax = _.promise((self, done) => {
    _.promise.validate(self, tokenize_syntax)

    const nlp = require("..")

    _.promise(self)
        .validate(tokenize_syntax)

        .then(nlp.tokenize.paragraphs)
        .each({
            method: _one,
            inputs: "tokens:itoken",
            outputs: "tokens",
            output_selector: sd => sd.tokens,
            output_flatten: _.flatten,
        })
        .make(sd => {
            sd.VERSION = tokenize_syntax.VERSION
        })

        .end(done, self, tokenize_syntax)
})

tokenize_syntax.method = "stanford.tokenize.syntax"
tokenize_syntax.VERSION = "4.1.0"
tokenize_syntax.description = ``
tokenize_syntax.requires = {
    nlp$cfg: {
        stanford: {
            url: _.is.AbsoluteURL,
        },
    },
    document: _.is.String,
}
tokenize_syntax.accepts = {
    nlp$cfg: {
        stanford: {
            token: _.is.String,
        },
    },
    cache: _.is.Dictionary,
}
tokenize_syntax.produces = {
    tokens: _.is.Array.of.Dictionary,
    VERSION: _.is.String,
}
tokenize_syntax.params = {
    document: _.p.normal,
}
tokenize_syntax.p = _.p(tokenize_syntax)

/**
 *  API
 */
exports.tokenize_syntax = tokenize_syntax
