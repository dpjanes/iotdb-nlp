/**
 *  pipeline/pipeline.js
 *
 *  David Janes
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

const path = require("path")

const nlp = require("..")
const _util = require("./_util")

const minimist = require("minimist")
const NAME = path.basename(__filename)
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "debug", "trace",
        "force",
    ],
    string: [
        "cfg",
        "command",
        "_",
    ],
    alias: {
    },
    default: {
        "cfg": null,
    },
})

const help = message => {
    if (message) {
        console.log(`${NAME}: ${message}`)
        console.log()
    }

    console.log(`\
usage: ${NAME} [options] <command> <file...>

commands are:

process - feed each file into the pipeline processor
entities - list entities in the file

options:
--cfg <cfg>       configuration file.
                  if not specified, it will look in every folder 
                  upwards from the first file argument.
                  if there is no file argument, use the current folder

--force           force processing, even though it is not needed
`)

    process.exit(message ? 1 : 0)
}

if (ad._.length) {
}

if (ad.help) {
    help()
} else if (!ad._.length) {
    help("<command> is required")
}

let command = null
const command_name = ad._.shift()
switch (command_name) {
case "process":
case "preprocess":
    command = nlp.pipeline.cli.preprocess
    break

case "entities":
    command = nlp.pipeline.cli.entities
    break
}

if (!command) {
    help(`did not recognize command: ${command_name}`)
}

if (!ad.cfg) {
    let p
    if (ad._.length) {
        p = path.dirname(ad._[0])
    } else {
        let p = process.cwd()
    }

    do {
        const fp = path.join(p, "Pipeline.yaml")
        if (fs.fs.existsSync(fp)) {
            ad.cfg = fp
            break
        }

        const np = path.dirname(p)
        if ((p === "/") || (p === np)) {
            break
        }

        p = np // proved!
    } while (1)

    if (!ad.cfg) {
        help("could not find Pipeline.yaml")
    }
}

_.logger.levels({
    debug: ad.verbose,
    trace: ad.trace,
})

/**
 */
_.promise({
    ad: ad,
    verbose: ad.verbose,

    // this needs to be done in Pipeline
    cache$cfg: {
        path: path.join(__dirname, "..", ".fs-cache"),
    },

    paths: ad._,
})
    .then(fs.cache)

    // read configuration and merge into self
    .then(fs.read.json.magic.p(ad.cfg))
    .then(sd => _.d.compose(sd, sd.json))
    .make(sd => {
        sd.pipeline.actions = sd.pipeline.actions || []
        sd.pipeline.handlers = sd.pipeline.handlers || []

        sd.pipeline.root = sd.pipeline.root || path.dirname(ad.cfg)
        sd.pipeline.root = path.resolve(sd.pipeline.root).replace(/[/]*$/, "") + "/"
        sd.pipeline.folder = path.resolve(_util.join(sd, sd.pipeline.root, sd.pipeline.folder)).replace(/[/]*$/, "") + "/"
    })


    // initialize NLP
    .then(nlp.initialize)
    .then(nlp.pipeline.initialize)

    .then(command)
    
    .except(_.promise.unbail)
    .except(error => {
        console.log("#", _.error.message(error))

        if (ad.verbose) {
            delete error.self
            console.log(error)
        }
    })

