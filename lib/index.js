/*
 *  index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-02
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

module.exports = Object.assign(
    {},
    require("./initialize"),
    require("./checkpoints"),
    {
        tokenize: {
            sentences: require("./tokenize.sentences").tokenize_sentences,
            words: require("./tokenize.words").tokenize_words,
            paragraphs: require("./tokenize.paragraphs").tokenize_paragraphs,
            entities: require("./tokenize.entities").tokenize_entities,
            syntax: require("./tokenize.syntax").tokenize_syntax,
            wordnet: require("./tokenize.wordnet").tokenize_wordnet,
        },
        extract: {
            persons: require("./extract.persons").extract_persons,
            organizations: require("./extract.organizations").extract_organizations,
            places: require("./extract.places").extract_places,
        },
        entities: {
            merge: require("./entities.merge").entities_merge,
        },
        vector: {
            contained: require("./vector.contained").vector_contained,
        },
        tokens: {
            merge: require("./tokens.merge").tokens_merge,
            sort: require("./tokens.sort").tokens_sort,
            group: require("./tokens.group").tokens_group,
            accumulate: require("./tokens.accumulate").tokens_accumulate,
        },
    },
    require("./normalize"),
    {}
)
