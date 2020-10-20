/*
 *  lib/tokenize.wordnet.js
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

const _ = require("iotdb-helpers")
const logger = require("../logger")(__filename)

/**
 */
const _lookup = _.promise((self, done) => {
// tokenize.wordnet
/*
    self.wordnet.lookup(self.token.document, function(results) {
    results.forEach(function(result) {
        console.log(JSON.stringify(result, null, 2))
    });
    _.promise(self)
        .validate(_lookup)
        .end(done, self, _lookup)
*/
})

_lookup.method = "yyy._one_token"
_lookup.description = ``
_lookup.requires = {
}
_lookup.accepts = {
}
_lookup.produces = {
}

/**
 */
const tokenize_wordnet = _.promise(self => {
    _.promse(self)
        .validate(tokenize_wordnet)

        .make(sd => {
            const WordNet = require("node-wordnet")
            sd.wordnet = new WordNet(self.nlp$cfg.wordnet_folder)
            sd.tokens = sd.tokens.filter(token => 
                [ "NOUN", "NNP", "NNPS", "VBD", "VERB" ].indexOf(token.tag) > -1
            )
            self.VERSION = tokenize_wordnet.VERSION
        })
        .each({
            method: _lookup,
            inputs: "tokens:token",
            output: "tokens",
            output_selector: sd => sd.tokens,
            output_flatten: true,
        })

        .end(self, done, tokenize_wordnet)
})

tokenize_wordnet.method = "tokenize.wordnet"
tokenize_wordnet.VERSION = "1.0.0"
tokenize_wordnet.description = ``
tokenize_wordnet.requires = {
    tokens: _.is.Array.of.Dictionary,
    nlp$cfg: {
        wordnet_folder: _.is.String,
    },
}
tokenize_wordnet.accepts = {
}
tokenize_wordnet.produces = {
    tokens: _.is.Array.of.Dictionary,
    VERSION: _.is.String,
}
tokenize_wordnet.params = {
    tokens: _.p.normal,
}
tokenize_wordnet.p = _.p(tokenize_wordnet)

/**
 *  API
 */
exports.tokenize_wordnet = tokenize_wordnet
