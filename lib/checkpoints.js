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

    const parts = []
{
    const rex = new RegExp("\n\n^(PART [A-Z]*)", "mgi")
    let match

    for (let i = 0; match = rex.exec(self.document); i++) {
        const d = {
            start: match.index,
            order: [ i + 1, null, null ],
            labels: {
                part: match[1]
            },
        }
        parts.push(d)
        // console.log(d) // match.index, match[1], match[2])
    }
}
{
    const rex = new RegExp("\n\n^(Chapter [A-Z]*)[.]$", "mgi")
    let match

    for (let i = 0; match = rex.exec(self.document); i++) {
        const d = {
            start: match.index,
            order: [ null, i + 1, null ],
            labels: {
                chapter: match[1]
            },
        }
        parts.push(d)
        // console.log(d) // match.index, match[1])
    }
}
{
    const rex = new RegExp("\n\n(.*)?", "mgi")
    let match

    for (let i = 0; (match = rex.exec(self.document)) && i < 1000000; i++) {
        const d = {
            start: match.index,
            order: [ null, null, i + 1 ],
            labels: {
                text: (match[1] || "").substring(0, 20)
            },
        }
        parts.push(d)
        // console.log(d) // match.index, match[1])

        /*
        delete match.input
        console.log(match.index, (match[1] || "").substring(0, 20))
        */
    }
}

    parts.sort((a, b) => a.start - b.start)

    let last = {
        labels: {},
        order: [ 0, 0, 0 ],
    }

    let counter = [ 0, 0, 0 ]
    parts.forEach(part => {
        part.labels = Object.assign({}, last.labels, part.labels)
        part.order = part.order.map((o, ox) => o === null ? last.order[ox] : o)

        let increment = counter.length - 1
        for (let ci = 0; ci < counter.length; ci++) {
            if (part.order[ci] !== last.order[ci]) {
                increment = ci
                break
            }
        }

        counter[increment] += 1
        for (let ci = increment + 1; ci < counter.length; ci++) {
            counter[ci] = 0
        }

        part.counter = [].concat(counter)
    })


    self.tokens = parts

})

checkpoints.method = "checkpoints"
checkpoints.description = ``
checkpoints.requires = {
    document: _.is.String,
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
