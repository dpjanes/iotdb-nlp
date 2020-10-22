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
const _action = _.promise((self, done) => {
    _.promise.validate(self, _action)

    const nlp = require("..")

    let action = self.action
    if (_.is.String(action)) {
        action = {
            method: action,
        }
    }

    let next = nlp
    action.method.split(".").forEach(part => {
        if (next) {
            next = next[part]
        }
    })

    if (!_.is.Function(next)) {
        logger.error({
            method: _action.method,
            action: action,
        }, "could not find action")

        return done(null, self)
    }
    
    _.promise(self)
        .make(sd => {
            if (!action.inject) {
                return
            }

            _.mapObject(action.inject, (value, key) => {
                _.d.set(sd, key, value)
            })
        })

        .then(next)
        .make(sd => {
            sd.RESULT = null

            const key = _.keys(next.produces || [])[0] || null
            if (key) {
                sd.RESULT = sd[key] || null
            }

            logger.debug({
                method: _action.method,
                action: sd.action,
                result_key: key,
            }, "action")

            if (_.d.first(action, "save", true)) {
                self[action.method] = sd.RESULT
            }

            self.state.versions[action.method] = next.VERSION || null
        })

        .end(done, self, next || null)
})

_action.method = "pipeline.action"
_action.description = ``
_action.requires = {
    action: [ _.is.Dictionary, _.is.String ],
    state: {
        versions: _.is.Dictionary,
    },
}
_action.accepts = {
}
_action.produces = {
}

/**
 *  Sadly duplicated code from above,
 *  but not easy to collapse
 */
const version = _.promise(self => {
    _.promise.validate(self, _action)

    const nlp = require("..")

    let action = self.action
    if (_.is.String(action)) {
        action = {
            method: action,
        }
    }

    let next = nlp
    action.method.split(".").forEach(part => {
        if (next) {
            next = next[part]
        }
    })

    if (_.is.Function(next)) {
        self.versions[action.method] = next.VERSION || null
    }
})

version.method = "pipeline.action.version"
version.description = `Compute versions of actions`
version.requires = {
    action: [ _.is.Dictionary, _.is.String ],
    versions: _.is.Dictionary,
}
version.accepts = {
}
version.produces = {
    versions: _.is.Dictionary,
}

/**
 *  API
 */
exports.action = _action
exports.action.version = version
