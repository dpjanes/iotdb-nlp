/*
 *  lib/normalize.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-05
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

/**
 */
const normalize_case = s => s.toLowerCase()

/**
 */
const normalize_accents = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

/**
 */
const normalize = s =>
    normalize_case(normalize_accents(_.coerce.to.String(s, "")))

/**
 */
const normalize_split = (word, trimlist) => normalize(word)
    .replace(/[^A-Za-z ]/g, " ")
    .split(/\s+/)
    .filter(x => x.length)
    .filter(x => !trimlist || (trimlist.indexOf(x) === -1))

/**
 *  API
 */
exports.normalize = normalize
exports.normalize.case = normalize_case
exports.normalize.accents = normalize_accents
exports.normalize.split = normalize_split
