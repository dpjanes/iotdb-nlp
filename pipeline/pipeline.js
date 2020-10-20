/**
 *  tools/pipeline.js
 *
 *  David Janes
 *  2020-10-18
 */

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const path = require("path")

const nlp = require("..")

const minimist = require("minimist")
const NAME = path.basename(__filename)
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "verbose", "debug", "trace",
    ],
    string: [
        "cfg",
        "command",
        "_",
    ],
    alias: {
    },
    default: {
        "cfg": "Pipeline.yaml",
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
--cfg <cfg>       configuration file
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

/**
 */
const _preprocess = _.promise((self, done) => {
    _.promise(self)
        .validate(_preprocess)
        .end(done, self, _preprocess)
})

_preprocess.method = "yyy._preprocess"
_preprocess.description = ``
_preprocess.requires = {
}
_preprocess.accepts = {
}
_preprocess.produces = {
}

/**
 */
const _entities = _.promise((self, done) => {
    _.promise(self)
        .validate(_entities)
        .end(done, self, _entities)
})

_entities.method = "yyy._entities"
_entities.description = ``
_entities.requires = {
}
_entities.accepts = {
}
_entities.produces = {
}

let command = null
const command_name = ad._.shift()
switch (command_name) {
case "process":
case "preprocess":
    command = _preprocess
    break

case "entities":
    command = _entities
    break
}

if (!command) {
    help(`did not recognize command: ${command_name}`)
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
})
    .then(fs.cache)

    // read configuration and merge into self
    .then(fs.read.json.magic.p(ad.cfg))
    .then(sd => _.d.compose(sd, sd.json))
    .make(sd => {
        sd.pipeline.root = sd.pipeline.root || path.dirname(ad.cfg)
    })

    // initialize NLP
    .then(nlp.initialize)
    .then(nlp.pipeline.initialize)

    .each({
        method: nlp.pipeline.execute,
        inputs: "ad/_:path",
    })
    
    .except(_.promise.unbail)
    .except(error => {
        console.log("#", _.error.message(error))

        if (ad.verbose) {
            delete error.self
            console.log(error)
        }
    })

