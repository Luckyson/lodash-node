/**
 * Lo-Dash 3.0.0-pre (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2014 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.6.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayEach = require('./arrayEach'),
    baseAssign = require('./baseAssign'),
    baseForOwn = require('./baseForOwn'),
    cloneBuffer = require('./cloneBuffer'),
    isArray = require('../object/isArray'),
    isFunction = require('../object/isFunction'),
    isObject = require('../object/isObject'),
    slice = require('../array/slice');

/** Used to match `RegExp` flags from their coerced string values */
var reFlags = /\w*$/;

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    errorClass = '[object Error]',
    funcClass = '[object Function]',
    mapClass = '[object Map]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    setClass = '[object Set]',
    stringClass = '[object String]',
    weakMapClass = '[object WeakMap]';

var arrayBufferClass = '[object ArrayBuffer]',
    float32Class = '[object Float32Array]',
    float64Class = '[object Float64Array]',
    int8Class = '[object Int8Array]',
    int16Class = '[object Int16Array]',
    int32Class = '[object Int32Array]',
    uint8Class = '[object Uint8Array]',
    uint8ClampedClass = '[object Uint8ClampedArray]',
    uint16Class = '[object Uint16Array]',
    uint32Class = '[object Uint32Array]';

/** Used to identify object classifications that `_.clone` supports */
var cloneableClasses = {};
cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
cloneableClasses[arrayBufferClass] = cloneableClasses[boolClass] =
cloneableClasses[dateClass] = cloneableClasses[float32Class] =
cloneableClasses[float64Class] = cloneableClasses[int8Class] =
cloneableClasses[int16Class] = cloneableClasses[int32Class] =
cloneableClasses[numberClass] = cloneableClasses[objectClass] =
cloneableClasses[regexpClass] = cloneableClasses[stringClass] =
cloneableClasses[uint8Class] = cloneableClasses[uint8ClampedClass] =
cloneableClasses[uint16Class] = cloneableClasses[uint32Class] = true;
cloneableClasses[errorClass] =
cloneableClasses[funcClass] = cloneableClasses[mapClass] =
cloneableClasses[setClass] = cloneableClasses[weakMapClass] = false;

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal `[[Class]]` of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.clone` without support for argument juggling
 * and `this` binding.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep=false] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, customizer, stackA, stackB) {
  var result = customizer ? customizer(value) : undefined;
  if (typeof result != 'undefined') {
    return result;
  }
  var isObj = isObject(value);
  if (isObj) {
    var className = toString.call(value);
    if (!cloneableClasses[className]) {
      return value;
    }
    var Ctor = value.constructor;
    if (className == objectClass && !(isFunction(Ctor) && (Ctor instanceof Ctor))) {
      Ctor = Object;
    }
    switch (className) {
      case arrayBufferClass:
        return cloneBuffer(value);

      case boolClass:
      case dateClass:
        return new Ctor(+value);

      case float32Class: case float64Class:
      case int8Class: case int16Class: case int32Class:
      case uint8Class: case uint8ClampedClass: case uint16Class: case uint32Class:
        return new Ctor(cloneBuffer(value.buffer));

      case numberClass:
      case stringClass:
        return new Ctor(value);

      case regexpClass:
        result = Ctor(value.source, reFlags.exec(value));
        result.lastIndex = value.lastIndex;
        return result;
    }
  } else {
    return value;
  }
  var isArr = isArray(value);
  if (isDeep) {
    // check for circular references and return corresponding clone
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == value) {
        return stackB[length];
      }
    }
    result = isArr ? Ctor(value.length) : new Ctor;
  }
  else {
    result = isArr ? slice(value) : baseAssign({}, value);
  }
  if (className == argsClass) {
    result.length = value.length;
  }
  // add array properties assigned by `RegExp#exec`
  else if (isArr) {
    if (hasOwnProperty.call(value, 'index')) {
      result.index = value.index;
    }
    if (hasOwnProperty.call(value, 'input')) {
      result.input = value.input;
    }
  }
  // exit for shallow clone
  if (!isDeep) {
    return result;
  }
  // add the source value to the stack of traversed objects
  // and associate it with its clone
  stackA.push(value);
  stackB.push(result);

  // recursively populate clone (susceptible to call stack limits)
  (isArr ? arrayEach : baseForOwn)(value, function(valValue, key) {
    var valClone = customizer ? customizer(valValue, key) : undefined;
    result[key] = typeof valClone == 'undefined'
      ? baseClone(valValue, isDeep, null, stackA, stackB)
      : valClone;
  });

  return result;
}

module.exports = baseClone;