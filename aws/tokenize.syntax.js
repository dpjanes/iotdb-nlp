/*
 *  aws/tokenize.syntax.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-03
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

/**
 */
const _sentence = _.promise((self, done) => {
    const aws = require("iotdb-awslib")

    _.promise(self)
        .validate(_sentence)
        .make(sd => {
            sd.documents = sd.itokens.map(itoken => itoken.document)
            sd.rule = {
                key: `/aws.comprehend.syntax/${_.hash.md5(sd.documents)}`,
                values: "tokenss",
                method: aws.comprehend.syntax.batch,
            }
        })
        .then(cache.execute)
        .make(sd => {
            sd.itokens.forEach((itoken, index) => {
                sd.tokenss[index].forEach(otoken => {
                    otoken.start += itoken.start
                    otoken.end += itoken.end
                })
            })
        })

        .end(done, self, _sentence)
})

_sentence.method = "aws.tokenize.syntax/_sentence"
_sentence.description = ``
_sentence.requires = {
    itokens: _.is.Array.of.Dictionary,
    cache: _.is.Dictionary,
}
_sentence.accepts = {
}
_sentence.produces = {
    tokenss: _.is.Array,
}

/**
 */
const tokenize_syntax = _.promise((self, done) => {
    _.promise.validate(self, tokenize_syntax)

    const nlp = require("..")

    _.promise(self)
        .validate(tokenize_syntax)

        .then(nlp.tokenize.sentences)
        .make(sd => {
            sd.itokenss = _.chunk(sd.tokens, 25)
        })
        .each({
            method: _sentence,
            inputs: "itokenss:itokens",
            outputs: "tokens",
            output_selector: sd => sd.tokenss,
            output_flatten: _.flattenDeep,
        })
        .make(sd => {
            sd.VERSION = tokenize_syntax.VERSION
        })

        .end(done, self, tokenize_syntax)
})

tokenize_syntax.method = "aws.tokenize.syntax"
tokenize_syntax.VERSION = "1.0.0"
tokenize_syntax.description = ``
tokenize_syntax.requires = {
    aws$comprehend: _.is.Object,
    document: _.is.String,
}
tokenize_syntax.accepts = {
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
