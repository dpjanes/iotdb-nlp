/*
 *  pipeline/action.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-18
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
const fs = require("iotdb-fs")

const _util = require("./_util")
const logger = require("../logger")(__filename)

/**
 */
const action = _.promise((self, done) => {
    _.promise.validate(self, action)

    const nlp = require("..")

    let next = nlp
    self.action.method.split(".").forEach(part => {
        if (next) {
            next = next[part]
        }
    })

    if (!_.is.Function(next)) {
        logger.error({
            method: action.method,
            action: self.action,
        }, "could not find action")

        return done(null, self)
    }
    
    _.promise(self)
        .validate(action)

        .make(sd => {
            if (!self.action.inject) {
                return
            }

            _.mapObject(self.action.inject, (value, key) => {
                _.d.set(sd, key, value)
            })
        })

        .then(next)
        .make(sd => {
            console.log("ACTION", sd.action, sd.VERSION)

            sd.RESULT = null

            const key = _.keys(next.produces || [])[0]
            if (key) {
                sd.RESULT = sd[key] || null
                console.log("RESULT", sd.RESULT)
            }
        })

        .make(sd => {
            if (self.action.save) {
                self[self.action.method] = sd.RESULT
            }
        })

        .end(done, self, next || null)
})

action.method = "pipeline.action"
action.description = ``
action.requires = {
    action: _.is.Dictionary,
    /*
    action: {
        method: _.is.String,
    },
    */
}
action.accepts = {
}
action.produces = {
}

/**
 *  API
 */
exports.action = action
