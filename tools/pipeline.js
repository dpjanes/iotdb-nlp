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
        "cfg"
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
usage: ${NAME} <file>

feed each file into the pipeline

options:
--cfg <cfg>       configuration file
`)

    process.exit(message ? 1 : 0)
}

if (ad.help) {
    help()
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
})
    // read configuration and merge into self
    .then(fs.read.json.magic.p(ad.cfg))
    .then(sd => _.d.compose(sd, sd.json, {
        nlp$cfg: {},
        pipeline: [],
    }))

    // initialize NLP
    .then(nlp.initialize)
    
    .make(sd => {
        console.log(sd)
    })

    .except(_.promise.unbail)
    .except(error => {
        console.log("#", _.error.message(error))

        if (ad.verbose) {
            delete error.self
            console.log(error)
        }
    })

