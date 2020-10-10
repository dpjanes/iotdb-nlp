/**
 *  test/_util.js
 *
 *  David Janes
 *  IOTDB
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
const fs = require("iotdb-fs")

const assert = require("assert")
const path = require("path")

const nlp = require("..")

const auto_fail = done => _.promise(self => done(new Error("didn't expect to get here")))
const ok_error = (done, code) => error => {
    if (code && (_.error.code(error) !== code)) {
        return done(error)
    }

    done(null)
}

/**
 */
const read_yaml = (_folder, _filename, _variable) => _.promise((self, done) => {
    _.promise(self)
        .validate(read_yaml)

        .make(sd => {
            sd.path = path.join(__dirname, "data", _folder, _filename + ".yaml")
        })
        .then(fs.read.json.magic)
        .make(sd => {
            sd[_variable] = sd.json
            assert.ok(_.is.JSON(sd[_variable]))
        })

        .end(done, self, _variable)
})

read_yaml.method = "_util.read_yaml"
read_yaml.description = ``
read_yaml.requires = {
}
read_yaml.accepts = {
}
read_yaml.produces = {
}

/**
 */
const read_utf8 = (_folder, _filename, _variable) => _.promise((self, done) => {
    _.promise(self)
        .validate(read_utf8)

        .make(sd => {
            sd.path = path.join(__dirname, "data", _folder, _filename + ".txt")
        })
        .then(fs.read.utf8)
        .make(sd => {
            sd[_variable] = sd.document
        })

        .end(done, self, _variable)
})

read_utf8.method = "_util.read_utf8"
read_utf8.description = ``
read_utf8.requires = {
}
read_utf8.accepts = {
}
read_utf8.produces = {
}

/**
 */
const write_yaml = (_folder, _filename, _variable) => _.promise((self, done) => {
    self.json = self[_variable]

    _.promise(self)
        .validate(write_yaml)

        .make(sd => {
            sd.path = path.join(__dirname, "data", _folder, _filename + ".yaml")
        })
        .then(fs.make.directory.parent)
        .then(fs.write.yaml)
        .log("wrote", "path")

        .end(done, self, write_yaml)
})

write_yaml.method = "_util.write_yaml"
write_yaml.description = ``
write_yaml.requires = {
    json: _.is.JSON,
}
write_yaml.accepts = {
}
write_yaml.produces = {
}

exports.write_yaml = write_yaml

/**
 *  API
 */
exports.auto_fail = auto_fail
exports.ok_error = ok_error

exports.read_yaml = read_yaml
exports.read_utf8 = read_utf8
exports.write_yaml = write_yaml
