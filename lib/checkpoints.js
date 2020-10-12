/*
 *  lib/checkpoints.js
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

const _ = require("iotdb-helpers")
const logger = require("../logger")(__filename)

/**
 */
const checkpoints = _.promise(self => {
    _.promise.validate(self, checkpoints)

    self.tokens = []

    const size = self.nlp$cfg.checkpoints.length

    // find all the checkpoints
    _.each(self.nlp$cfg.checkpoints, (checkpoint, index) => {
        const rex = new RegExp(checkpoint.rex)
        let match
        for (let mi = 0; match = rex.exec(self.document); mi++) {
            let label = match[1]
            if (label && checkpoint.excerpt) {
                label = label.substring(0, checkpoint.excerpt)
                label = label.replace(/\b[A-Za-z0-9]*$/, "").trim()
            }

            const d = {
                start: match.index,
                end: self.document.length,
                _order: new Array(size).fill(null),
                _index: index,
                token: "checkpoint",
                tag: checkpoint.key,
                labels: {
                    [ checkpoint.key ]: label,
                },
            }
            d._order[index] = mi + 1
            self.tokens.push(d)
        }
    })

    // order actual checkpoints from beginning to end
    self.tokens.sort((a, b) => (a.start - b.start) || (a._index - b._index))

    // delete lower prior
    let last_token = null
    let deletes = false
    self.tokens.forEach(token => {
        if (last_token && (token.start === last_token.start)) {
            token._delete = true
            deletes = true
        }
        last_token = token
    })

    if (deletes) {
        self.tokens = self.tokens.filter(token => !token._delete)
    }

    // create the "order" based on changes to checkpoint 
    let last = {
        labels: {},
        _order: new Array(size).fill(0),
    }

    let counter = new Array(size).fill(0)
    self.tokens.forEach(part => {
        part.labels = Object.assign({}, last.labels, part.labels)
        part._order = part._order.map((o, ox) => o === null ? last._order[ox] : o)

        let increment = counter.length - 1
        for (let ci = 0; ci < counter.length; ci++) {
            if (part._order[ci] !== last._order[ci]) {
                increment = ci
                break
            }
        }

        counter[increment] += 1
        for (let ci = increment + 1; ci < counter.length; ci++) {
            counter[ci] = 0
        }

        part.order = [].concat(counter)
    })

    // find the end of each section
    const starts = new Array(size).fill(-1)

    self.tokens.forEach((token, tx) => {
        for (let ti = token._index; ti < size; ti++) {
            const sx = starts[ti]
            if (sx !== -1) {
                self.tokens[sx].end = token.start
            }

            starts[ti] = -1
        }

        starts[token._index] = tx
    })

    // cleanup
    self.tokens.forEach(part => {
        delete part._order
        delete part._index
    })
})

checkpoints.method = "checkpoints"
checkpoints.description = ``
checkpoints.requires = {
    document: _.is.String,
    nlp$cfg: {
        checkpoints: _.is.Array,
    },
}
checkpoints.accepts = {
}
checkpoints.produces = {
    tokens: _.is.Array.of.Dictionary,
}
checkpoints.params = {
    document: _.p.normal,
}
checkpoints.p = _.p(checkpoints)

/**
 *  API
 */
exports.checkpoints = checkpoints
