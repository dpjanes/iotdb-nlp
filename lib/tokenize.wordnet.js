/*
 *  lib/tokenize.wordnet.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-20
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
    _.promise.validate(self, _lookup)

    let pos = null
    switch (self.itoken.tag) {
    case "NOUN":
    case "NNP":
    case "NNPS":
        pos = "n"
        break

    case "VBD":
    case "VERB":
        pos = "v"
        break
    }

    self.tokens = []

    self.wordnet.lookup(self.itoken.document, results => {
        results = results
            .filter(result => result.pos === pos)
            .forEach((result, x, rs) => {
                delete result.ptrs

                const token = _.d.clone(self.itoken)
                token.wordnet = result
                token.score = (1 / (x + 1)) / 5 + .8

                self.tokens.push(token)
            })

        done(null, self)
    })
})

_lookup.method = "tokenize.wordnet/_one_token"
_lookup.description = ``
_lookup.requires = {
    wordnet: _.is.Object,
    itoken: _.is.Dictionary,
}
_lookup.accepts = {
}
_lookup.produces = {
    tokens: _.is.Array.of.Dictionary,
}

/**
 */
const tokenize_wordnet = _.promise((self, done) => {
    _.promise(self)
        .validate(tokenize_wordnet)

        .make(sd => {
            const WordNet = require("node-wordnet")
            sd.wordnet = new WordNet(self.nlp$cfg.wordnet.folder)
            sd.itokens = sd.tokens.filter(token => 
                [ "NOUN", "NNP", "NNPS", "VBD", "VERB" ].indexOf(token.tag) > -1
            )
            sd.VERSION = tokenize_wordnet.VERSION
        })
        .each({
            method: _lookup,
            inputs: "itokens:itoken",
            outputs: "tokens",
            output_selector: sd => sd.tokens,
            output_flatten: true,
        })

        .end(done, self, tokenize_wordnet)
})

tokenize_wordnet.method = "tokenize.wordnet"
tokenize_wordnet.VERSION = "1.0.0"
tokenize_wordnet.description = `
    Run WordNet on every token, returning
    a new set of tokens, one for every WordNet meaning.

    The new token will have the same document,
    begin, end, etc. but will have "wordnet" attached.
    There will (likely) be multiple tokens with the
    same begin/end pairs.

    The input tokens should be the result of
    "tokenize.syntax" (or similar) and in particular
    should have normalized documents and the POS
    marked in the tag. 
    
    You can specify "nlp$cfg/wordnet/stemmer" to 
    transform the word before WordNet is called.

    Make sure to have the WordNet package installed

        npm install node-wordnet

    To get the WordNet database, do

        npm install wordnet-db

    And specifiy the path to data directory like (which
    yes is kinda horrible)

        nlp$cfg: {
            wordnet: {
                folder: path.join(__dirname, "../node_modules/wordnet-db/dict"),
            },
        }

    https://dpjanes.medium.com/wordnet-with-node-js-7b05741de0c2
`
tokenize_wordnet.requires = {
    tokens: _.is.Array.of.Dictionary,
    nlp$cfg: {
        wordnet: {
            folder: _.is.String,
        },
    },
}
tokenize_wordnet.accepts = {
    nlp$cfg: {
        wordnet: {
            stemmer: _.is.Function,
        },
    },
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
