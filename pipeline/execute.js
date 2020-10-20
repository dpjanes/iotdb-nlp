/*
 *  pipeline/execute.js
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
const path = require("path")

const logger = require("../logger")(__filename)

/**
 */
const execute = _.promise((self, done) => {
    const nlp = require("..")

    _.promise(self)
        .validate(execute)

        .make(sd => {
            sd.source_path = sd.path
            sd.data_path = _util.join(sd, sd.pipeline.folder, path.basename(sd.source_path).replace(/[.].*$/, ""))
            sd.state_path = path.join(sd.data_path, "state.yaml")
            
            sd.pipeline = _.d.clone(sd.pipeline)
            sd.pipeline.actions = sd.pipeline.actions || []
            sd.pipeline.handlers = sd.pipeline.handlers || []
        })

        // make sure there is a handler for the file type
        .make(sd => {
            const extension = path.extname(sd.source_path)

            sd.handler = sd.pipeline.handlers
                .find(handler => {
                    const extensions = _.d.list(handler, "extensions", [])
                    if (extensions.indexOf(extension) > -1) {
                        return true
                    }
                })

            if (!sd.handler) {
                logger.warn({
                    method: execute.method,
                    path: sd.source_path,
                }, "no handler - ignorning this file");

                _.promise.bail()
            }
        })

        // read state
        .add("fs$otherwise_json", {})
        .add("path", sd => sd.state_path)
        .then(fs.make.directory.parent)
        .then(fs.read.yaml)
        .add("json:state")
        .make(sd => {
            sd.state.created = sd.state.created || _.timestamp.make()
            sd.state.updated = sd.state.updated || sd.state.created 
            sd.state.source = sd.source_path
            sd.state.actions = sd.state.actions || {}
        })

        // read the document to get the ball rolling
        .add("source_path:path")
        .then(fs.read.buffer)
        .make(sd => {
            sd.VERSION = _.hash.sha256(sd.document)
        })
        
        // do all the actions in the pipeline
        .each({
            method: nlp.pipeline.action,
            inputs: "pipeline/actions:action",
            roll_self: true,
        })

        // write the state
        .make(sd => {
            sd.state.updated = _.timestamp.make()
            sd.json = sd.state
            sd.path = sd.state_path
        })
        .then(fs.write.yaml)
        .log("wrote", "state_path")

        .end(done, self, execute)
})

execute.method = "pipeline.execute"
execute.description = ``
execute.requires = {
    nlp$cfg: _.is.Dictionary,
    pipeline: {
        folder: _.is.String,
    },
    path: _.is.String,
}
execute.accepts = {
}
execute.produces = {
}

/**
 *  API
 */
exports.execute = execute
