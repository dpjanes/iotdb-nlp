/*
 *  pipeline/_util.js
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

const path = require("path")
const os = require("os")

/**
 */
const expand = (self, p) => {
    if (p === "~") {
        return os.homedir();
    } else if (p.startsWith("~/")) {
        return path.join(os.homedir(), p.substring(2))
    } else {
        return p
    }
}

/**
 */
const join = (self, a, b) => {
    a = expand(self, a)
    b = expand(self, b)

    if (path.isAbsolute(b)) {
        return b
    } else {
        return path.join(a, b)
    }
}

/**
 */
const path_info = (self, p) => {
    const source_path = path.resolve(p)

    const relative = source_path.startsWith(self.pipeline.root) ? 
        path.dirname(source_path.substring(self.pipeline.root.length)) : "."
    const basename = path.basename(source_path).replace(/[.].*$/, "")

    return {
        source_path: source_path,
        data_path: join(self, self.pipeline.folder, path.join(relative, basename))
    }
}

/**
 *  API
 */
exports.expand = expand
exports.join = join
exports.path_info = path_info
