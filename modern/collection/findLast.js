/**
 * Lo-Dash 3.0.0-pre (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2014 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.6.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseEachRight = require('../internal/baseEachRight'),
    baseFind = require('../internal/baseFind'),
    callback = require('../utility/callback');

/**
 * This method is like `_.find` except that it iterates over elements of a
 * collection from right to left.
 *
 * @static
 * @memberOf _
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function|Object|string} [predicate=identity] The function called
 *  per iteration. If a property name or object is provided it is used to
 *  create a "_.pluck" or "_.where" style callback respectively.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * _.findLast([1, 2, 3, 4], function(n) { return n % 2 == 1; });
 * // => 3
 */
function findLast(collection, predicate, thisArg) {
  predicate = callback(predicate, thisArg, 3);
  return baseFind(collection, predicate, baseEachRight);
}

module.exports = findLast;