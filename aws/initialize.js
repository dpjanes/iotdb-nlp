/*
 *  aws/initialize.js
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

/**
 */
const initialize = _.promise(self => {
    const nlp = require("..")

    _.promise.validate(self, initialize)

    self.nlp$cfg.tokenize_entities = self.nlp$cfg.tokenize_entities || nlp.aws.tokenize.entities
    self.nlp$cfg.tokenize_syntax = self.nlp$cfg.tokenize_syntax || nlp.aws.tokenize.syntax
})

initialize.method = "aws.initialize"
initialize.description = `Initialize AWS NLP interface

    Note that you must have already initialized comprehend
    from iotdb-awslib first
`
initialize.requires = {
    aws$comprehend: _.is.Object,
    nlp$cfg: _.is.Dictionary,
}
initialize.accepts = {
}
initialize.produces = {
    nlp$cfg: {
        tokenize_entities: _.is.Function,
    },
}

/**
 *  API
 */
exports.initialize = initialize
