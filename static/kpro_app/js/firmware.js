/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@ethersproject/bytes/lib/_version.js":
/*!***********************************************************!*\
  !*** ./node_modules/@ethersproject/bytes/lib/_version.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.version = void 0;
exports.version = "bytes/5.7.0";
//# sourceMappingURL=_version.js.map

/***/ }),

/***/ "./node_modules/@ethersproject/bytes/lib/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@ethersproject/bytes/lib/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.joinSignature = exports.splitSignature = exports.hexZeroPad = exports.hexStripZeros = exports.hexValue = exports.hexConcat = exports.hexDataSlice = exports.hexDataLength = exports.hexlify = exports.isHexString = exports.zeroPad = exports.stripZeros = exports.concat = exports.arrayify = exports.isBytes = exports.isBytesLike = void 0;
var logger_1 = __webpack_require__(/*! @ethersproject/logger */ "./node_modules/@ethersproject/logger/lib/index.js");
var _version_1 = __webpack_require__(/*! ./_version */ "./node_modules/@ethersproject/bytes/lib/_version.js");
var logger = new logger_1.Logger(_version_1.version);
///////////////////////////////
function isHexable(value) {
    return !!(value.toHexString);
}
function addSlice(array) {
    if (array.slice) {
        return array;
    }
    array.slice = function () {
        var args = Array.prototype.slice.call(arguments);
        return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
    };
    return array;
}
function isBytesLike(value) {
    return ((isHexString(value) && !(value.length % 2)) || isBytes(value));
}
exports.isBytesLike = isBytesLike;
function isInteger(value) {
    return (typeof (value) === "number" && value == value && (value % 1) === 0);
}
function isBytes(value) {
    if (value == null) {
        return false;
    }
    if (value.constructor === Uint8Array) {
        return true;
    }
    if (typeof (value) === "string") {
        return false;
    }
    if (!isInteger(value.length) || value.length < 0) {
        return false;
    }
    for (var i = 0; i < value.length; i++) {
        var v = value[i];
        if (!isInteger(v) || v < 0 || v >= 256) {
            return false;
        }
    }
    return true;
}
exports.isBytes = isBytes;
function arrayify(value, options) {
    if (!options) {
        options = {};
    }
    if (typeof (value) === "number") {
        logger.checkSafeUint53(value, "invalid arrayify value");
        var result = [];
        while (value) {
            result.unshift(value & 0xff);
            value = parseInt(String(value / 256));
        }
        if (result.length === 0) {
            result.push(0);
        }
        return addSlice(new Uint8Array(result));
    }
    if (options.allowMissingPrefix && typeof (value) === "string" && value.substring(0, 2) !== "0x") {
        value = "0x" + value;
    }
    if (isHexable(value)) {
        value = value.toHexString();
    }
    if (isHexString(value)) {
        var hex = value.substring(2);
        if (hex.length % 2) {
            if (options.hexPad === "left") {
                hex = "0" + hex;
            }
            else if (options.hexPad === "right") {
                hex += "0";
            }
            else {
                logger.throwArgumentError("hex data is odd-length", "value", value);
            }
        }
        var result = [];
        for (var i = 0; i < hex.length; i += 2) {
            result.push(parseInt(hex.substring(i, i + 2), 16));
        }
        return addSlice(new Uint8Array(result));
    }
    if (isBytes(value)) {
        return addSlice(new Uint8Array(value));
    }
    return logger.throwArgumentError("invalid arrayify value", "value", value);
}
exports.arrayify = arrayify;
function concat(items) {
    var objects = items.map(function (item) { return arrayify(item); });
    var length = objects.reduce(function (accum, item) { return (accum + item.length); }, 0);
    var result = new Uint8Array(length);
    objects.reduce(function (offset, object) {
        result.set(object, offset);
        return offset + object.length;
    }, 0);
    return addSlice(result);
}
exports.concat = concat;
function stripZeros(value) {
    var result = arrayify(value);
    if (result.length === 0) {
        return result;
    }
    // Find the first non-zero entry
    var start = 0;
    while (start < result.length && result[start] === 0) {
        start++;
    }
    // If we started with zeros, strip them
    if (start) {
        result = result.slice(start);
    }
    return result;
}
exports.stripZeros = stripZeros;
function zeroPad(value, length) {
    value = arrayify(value);
    if (value.length > length) {
        logger.throwArgumentError("value out of range", "value", arguments[0]);
    }
    var result = new Uint8Array(length);
    result.set(value, length - value.length);
    return addSlice(result);
}
exports.zeroPad = zeroPad;
function isHexString(value, length) {
    if (typeof (value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (length && value.length !== 2 + 2 * length) {
        return false;
    }
    return true;
}
exports.isHexString = isHexString;
var HexCharacters = "0123456789abcdef";
function hexlify(value, options) {
    if (!options) {
        options = {};
    }
    if (typeof (value) === "number") {
        logger.checkSafeUint53(value, "invalid hexlify value");
        var hex = "";
        while (value) {
            hex = HexCharacters[value & 0xf] + hex;
            value = Math.floor(value / 16);
        }
        if (hex.length) {
            if (hex.length % 2) {
                hex = "0" + hex;
            }
            return "0x" + hex;
        }
        return "0x00";
    }
    if (typeof (value) === "bigint") {
        value = value.toString(16);
        if (value.length % 2) {
            return ("0x0" + value);
        }
        return "0x" + value;
    }
    if (options.allowMissingPrefix && typeof (value) === "string" && value.substring(0, 2) !== "0x") {
        value = "0x" + value;
    }
    if (isHexable(value)) {
        return value.toHexString();
    }
    if (isHexString(value)) {
        if (value.length % 2) {
            if (options.hexPad === "left") {
                value = "0x0" + value.substring(2);
            }
            else if (options.hexPad === "right") {
                value += "0";
            }
            else {
                logger.throwArgumentError("hex data is odd-length", "value", value);
            }
        }
        return value.toLowerCase();
    }
    if (isBytes(value)) {
        var result = "0x";
        for (var i = 0; i < value.length; i++) {
            var v = value[i];
            result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
        }
        return result;
    }
    return logger.throwArgumentError("invalid hexlify value", "value", value);
}
exports.hexlify = hexlify;
/*
function unoddify(value: BytesLike | Hexable | number): BytesLike | Hexable | number {
    if (typeof(value) === "string" && value.length % 2 && value.substring(0, 2) === "0x") {
        return "0x0" + value.substring(2);
    }
    return value;
}
*/
function hexDataLength(data) {
    if (typeof (data) !== "string") {
        data = hexlify(data);
    }
    else if (!isHexString(data) || (data.length % 2)) {
        return null;
    }
    return (data.length - 2) / 2;
}
exports.hexDataLength = hexDataLength;
function hexDataSlice(data, offset, endOffset) {
    if (typeof (data) !== "string") {
        data = hexlify(data);
    }
    else if (!isHexString(data) || (data.length % 2)) {
        logger.throwArgumentError("invalid hexData", "value", data);
    }
    offset = 2 + 2 * offset;
    if (endOffset != null) {
        return "0x" + data.substring(offset, 2 + 2 * endOffset);
    }
    return "0x" + data.substring(offset);
}
exports.hexDataSlice = hexDataSlice;
function hexConcat(items) {
    var result = "0x";
    items.forEach(function (item) {
        result += hexlify(item).substring(2);
    });
    return result;
}
exports.hexConcat = hexConcat;
function hexValue(value) {
    var trimmed = hexStripZeros(hexlify(value, { hexPad: "left" }));
    if (trimmed === "0x") {
        return "0x0";
    }
    return trimmed;
}
exports.hexValue = hexValue;
function hexStripZeros(value) {
    if (typeof (value) !== "string") {
        value = hexlify(value);
    }
    if (!isHexString(value)) {
        logger.throwArgumentError("invalid hex string", "value", value);
    }
    value = value.substring(2);
    var offset = 0;
    while (offset < value.length && value[offset] === "0") {
        offset++;
    }
    return "0x" + value.substring(offset);
}
exports.hexStripZeros = hexStripZeros;
function hexZeroPad(value, length) {
    if (typeof (value) !== "string") {
        value = hexlify(value);
    }
    else if (!isHexString(value)) {
        logger.throwArgumentError("invalid hex string", "value", value);
    }
    if (value.length > 2 * length + 2) {
        logger.throwArgumentError("value out of range", "value", arguments[1]);
    }
    while (value.length < 2 * length + 2) {
        value = "0x0" + value.substring(2);
    }
    return value;
}
exports.hexZeroPad = hexZeroPad;
function splitSignature(signature) {
    var result = {
        r: "0x",
        s: "0x",
        _vs: "0x",
        recoveryParam: 0,
        v: 0,
        yParityAndS: "0x",
        compact: "0x"
    };
    if (isBytesLike(signature)) {
        var bytes = arrayify(signature);
        // Get the r, s and v
        if (bytes.length === 64) {
            // EIP-2098; pull the v from the top bit of s and clear it
            result.v = 27 + (bytes[32] >> 7);
            bytes[32] &= 0x7f;
            result.r = hexlify(bytes.slice(0, 32));
            result.s = hexlify(bytes.slice(32, 64));
        }
        else if (bytes.length === 65) {
            result.r = hexlify(bytes.slice(0, 32));
            result.s = hexlify(bytes.slice(32, 64));
            result.v = bytes[64];
        }
        else {
            logger.throwArgumentError("invalid signature string", "signature", signature);
        }
        // Allow a recid to be used as the v
        if (result.v < 27) {
            if (result.v === 0 || result.v === 1) {
                result.v += 27;
            }
            else {
                logger.throwArgumentError("signature invalid v byte", "signature", signature);
            }
        }
        // Compute recoveryParam from v
        result.recoveryParam = 1 - (result.v % 2);
        // Compute _vs from recoveryParam and s
        if (result.recoveryParam) {
            bytes[32] |= 0x80;
        }
        result._vs = hexlify(bytes.slice(32, 64));
    }
    else {
        result.r = signature.r;
        result.s = signature.s;
        result.v = signature.v;
        result.recoveryParam = signature.recoveryParam;
        result._vs = signature._vs;
        // If the _vs is available, use it to populate missing s, v and recoveryParam
        // and verify non-missing s, v and recoveryParam
        if (result._vs != null) {
            var vs_1 = zeroPad(arrayify(result._vs), 32);
            result._vs = hexlify(vs_1);
            // Set or check the recid
            var recoveryParam = ((vs_1[0] >= 128) ? 1 : 0);
            if (result.recoveryParam == null) {
                result.recoveryParam = recoveryParam;
            }
            else if (result.recoveryParam !== recoveryParam) {
                logger.throwArgumentError("signature recoveryParam mismatch _vs", "signature", signature);
            }
            // Set or check the s
            vs_1[0] &= 0x7f;
            var s = hexlify(vs_1);
            if (result.s == null) {
                result.s = s;
            }
            else if (result.s !== s) {
                logger.throwArgumentError("signature v mismatch _vs", "signature", signature);
            }
        }
        // Use recid and v to populate each other
        if (result.recoveryParam == null) {
            if (result.v == null) {
                logger.throwArgumentError("signature missing v and recoveryParam", "signature", signature);
            }
            else if (result.v === 0 || result.v === 1) {
                result.recoveryParam = result.v;
            }
            else {
                result.recoveryParam = 1 - (result.v % 2);
            }
        }
        else {
            if (result.v == null) {
                result.v = 27 + result.recoveryParam;
            }
            else {
                var recId = (result.v === 0 || result.v === 1) ? result.v : (1 - (result.v % 2));
                if (result.recoveryParam !== recId) {
                    logger.throwArgumentError("signature recoveryParam mismatch v", "signature", signature);
                }
            }
        }
        if (result.r == null || !isHexString(result.r)) {
            logger.throwArgumentError("signature missing or invalid r", "signature", signature);
        }
        else {
            result.r = hexZeroPad(result.r, 32);
        }
        if (result.s == null || !isHexString(result.s)) {
            logger.throwArgumentError("signature missing or invalid s", "signature", signature);
        }
        else {
            result.s = hexZeroPad(result.s, 32);
        }
        var vs = arrayify(result.s);
        if (vs[0] >= 128) {
            logger.throwArgumentError("signature s out of range", "signature", signature);
        }
        if (result.recoveryParam) {
            vs[0] |= 0x80;
        }
        var _vs = hexlify(vs);
        if (result._vs) {
            if (!isHexString(result._vs)) {
                logger.throwArgumentError("signature invalid _vs", "signature", signature);
            }
            result._vs = hexZeroPad(result._vs, 32);
        }
        // Set or check the _vs
        if (result._vs == null) {
            result._vs = _vs;
        }
        else if (result._vs !== _vs) {
            logger.throwArgumentError("signature _vs mismatch v and s", "signature", signature);
        }
    }
    result.yParityAndS = result._vs;
    result.compact = result.r + result.yParityAndS.substring(2);
    return result;
}
exports.splitSignature = splitSignature;
function joinSignature(signature) {
    signature = splitSignature(signature);
    return hexlify(concat([
        signature.r,
        signature.s,
        (signature.recoveryParam ? "0x1c" : "0x1b")
    ]));
}
exports.joinSignature = joinSignature;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@ethersproject/logger/lib/_version.js":
/*!************************************************************!*\
  !*** ./node_modules/@ethersproject/logger/lib/_version.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.version = void 0;
exports.version = "logger/5.7.0";
//# sourceMappingURL=_version.js.map

/***/ }),

/***/ "./node_modules/@ethersproject/logger/lib/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@ethersproject/logger/lib/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = exports.ErrorCode = exports.LogLevel = void 0;
var _permanentCensorErrors = false;
var _censorErrors = false;
var LogLevels = { debug: 1, "default": 2, info: 2, warning: 3, error: 4, off: 5 };
var _logLevel = LogLevels["default"];
var _version_1 = __webpack_require__(/*! ./_version */ "./node_modules/@ethersproject/logger/lib/_version.js");
var _globalLogger = null;
function _checkNormalize() {
    try {
        var missing_1 = [];
        // Make sure all forms of normalization are supported
        ["NFD", "NFC", "NFKD", "NFKC"].forEach(function (form) {
            try {
                if ("test".normalize(form) !== "test") {
                    throw new Error("bad normalize");
                }
                ;
            }
            catch (error) {
                missing_1.push(form);
            }
        });
        if (missing_1.length) {
            throw new Error("missing " + missing_1.join(", "));
        }
        if (String.fromCharCode(0xe9).normalize("NFD") !== String.fromCharCode(0x65, 0x0301)) {
            throw new Error("broken implementation");
        }
    }
    catch (error) {
        return error.message;
    }
    return null;
}
var _normalizeError = _checkNormalize();
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARNING"] = "WARNING";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["OFF"] = "OFF";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var ErrorCode;
(function (ErrorCode) {
    ///////////////////
    // Generic Errors
    // Unknown Error
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    // Not Implemented
    ErrorCode["NOT_IMPLEMENTED"] = "NOT_IMPLEMENTED";
    // Unsupported Operation
    //   - operation
    ErrorCode["UNSUPPORTED_OPERATION"] = "UNSUPPORTED_OPERATION";
    // Network Error (i.e. Ethereum Network, such as an invalid chain ID)
    //   - event ("noNetwork" is not re-thrown in provider.ready; otherwise thrown)
    ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    // Some sort of bad response from the server
    ErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
    // Timeout
    ErrorCode["TIMEOUT"] = "TIMEOUT";
    ///////////////////
    // Operational  Errors
    // Buffer Overrun
    ErrorCode["BUFFER_OVERRUN"] = "BUFFER_OVERRUN";
    // Numeric Fault
    //   - operation: the operation being executed
    //   - fault: the reason this faulted
    ErrorCode["NUMERIC_FAULT"] = "NUMERIC_FAULT";
    ///////////////////
    // Argument Errors
    // Missing new operator to an object
    //  - name: The name of the class
    ErrorCode["MISSING_NEW"] = "MISSING_NEW";
    // Invalid argument (e.g. value is incompatible with type) to a function:
    //   - argument: The argument name that was invalid
    //   - value: The value of the argument
    ErrorCode["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
    // Missing argument to a function:
    //   - count: The number of arguments received
    //   - expectedCount: The number of arguments expected
    ErrorCode["MISSING_ARGUMENT"] = "MISSING_ARGUMENT";
    // Too many arguments
    //   - count: The number of arguments received
    //   - expectedCount: The number of arguments expected
    ErrorCode["UNEXPECTED_ARGUMENT"] = "UNEXPECTED_ARGUMENT";
    ///////////////////
    // Blockchain Errors
    // Call exception
    //  - transaction: the transaction
    //  - address?: the contract address
    //  - args?: The arguments passed into the function
    //  - method?: The Solidity method signature
    //  - errorSignature?: The EIP848 error signature
    //  - errorArgs?: The EIP848 error parameters
    //  - reason: The reason (only for EIP848 "Error(string)")
    ErrorCode["CALL_EXCEPTION"] = "CALL_EXCEPTION";
    // Insufficient funds (< value + gasLimit * gasPrice)
    //   - transaction: the transaction attempted
    ErrorCode["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
    // Nonce has already been used
    //   - transaction: the transaction attempted
    ErrorCode["NONCE_EXPIRED"] = "NONCE_EXPIRED";
    // The replacement fee for the transaction is too low
    //   - transaction: the transaction attempted
    ErrorCode["REPLACEMENT_UNDERPRICED"] = "REPLACEMENT_UNDERPRICED";
    // The gas limit could not be estimated
    //   - transaction: the transaction passed to estimateGas
    ErrorCode["UNPREDICTABLE_GAS_LIMIT"] = "UNPREDICTABLE_GAS_LIMIT";
    // The transaction was replaced by one with a higher gas price
    //   - reason: "cancelled", "replaced" or "repriced"
    //   - cancelled: true if reason == "cancelled" or reason == "replaced")
    //   - hash: original transaction hash
    //   - replacement: the full TransactionsResponse for the replacement
    //   - receipt: the receipt of the replacement
    ErrorCode["TRANSACTION_REPLACED"] = "TRANSACTION_REPLACED";
    ///////////////////
    // Interaction Errors
    // The user rejected the action, such as signing a message or sending
    // a transaction
    ErrorCode["ACTION_REJECTED"] = "ACTION_REJECTED";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
;
var HEX = "0123456789abcdef";
var Logger = /** @class */ (function () {
    function Logger(version) {
        Object.defineProperty(this, "version", {
            enumerable: true,
            value: version,
            writable: false
        });
    }
    Logger.prototype._log = function (logLevel, args) {
        var level = logLevel.toLowerCase();
        if (LogLevels[level] == null) {
            this.throwArgumentError("invalid log level name", "logLevel", logLevel);
        }
        if (_logLevel > LogLevels[level]) {
            return;
        }
        console.log.apply(console, args);
    };
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(Logger.levels.DEBUG, args);
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(Logger.levels.INFO, args);
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._log(Logger.levels.WARNING, args);
    };
    Logger.prototype.makeError = function (message, code, params) {
        // Errors are being censored
        if (_censorErrors) {
            return this.makeError("censored error", code, {});
        }
        if (!code) {
            code = Logger.errors.UNKNOWN_ERROR;
        }
        if (!params) {
            params = {};
        }
        var messageDetails = [];
        Object.keys(params).forEach(function (key) {
            var value = params[key];
            try {
                if (value instanceof Uint8Array) {
                    var hex = "";
                    for (var i = 0; i < value.length; i++) {
                        hex += HEX[value[i] >> 4];
                        hex += HEX[value[i] & 0x0f];
                    }
                    messageDetails.push(key + "=Uint8Array(0x" + hex + ")");
                }
                else {
                    messageDetails.push(key + "=" + JSON.stringify(value));
                }
            }
            catch (error) {
                messageDetails.push(key + "=" + JSON.stringify(params[key].toString()));
            }
        });
        messageDetails.push("code=" + code);
        messageDetails.push("version=" + this.version);
        var reason = message;
        var url = "";
        switch (code) {
            case ErrorCode.NUMERIC_FAULT: {
                url = "NUMERIC_FAULT";
                var fault = message;
                switch (fault) {
                    case "overflow":
                    case "underflow":
                    case "division-by-zero":
                        url += "-" + fault;
                        break;
                    case "negative-power":
                    case "negative-width":
                        url += "-unsupported";
                        break;
                    case "unbound-bitwise-result":
                        url += "-unbound-result";
                        break;
                }
                break;
            }
            case ErrorCode.CALL_EXCEPTION:
            case ErrorCode.INSUFFICIENT_FUNDS:
            case ErrorCode.MISSING_NEW:
            case ErrorCode.NONCE_EXPIRED:
            case ErrorCode.REPLACEMENT_UNDERPRICED:
            case ErrorCode.TRANSACTION_REPLACED:
            case ErrorCode.UNPREDICTABLE_GAS_LIMIT:
                url = code;
                break;
        }
        if (url) {
            message += " [ See: https:/\/links.ethers.org/v5-errors-" + url + " ]";
        }
        if (messageDetails.length) {
            message += " (" + messageDetails.join(", ") + ")";
        }
        // @TODO: Any??
        var error = new Error(message);
        error.reason = reason;
        error.code = code;
        Object.keys(params).forEach(function (key) {
            error[key] = params[key];
        });
        return error;
    };
    Logger.prototype.throwError = function (message, code, params) {
        throw this.makeError(message, code, params);
    };
    Logger.prototype.throwArgumentError = function (message, name, value) {
        return this.throwError(message, Logger.errors.INVALID_ARGUMENT, {
            argument: name,
            value: value
        });
    };
    Logger.prototype.assert = function (condition, message, code, params) {
        if (!!condition) {
            return;
        }
        this.throwError(message, code, params);
    };
    Logger.prototype.assertArgument = function (condition, message, name, value) {
        if (!!condition) {
            return;
        }
        this.throwArgumentError(message, name, value);
    };
    Logger.prototype.checkNormalize = function (message) {
        if (message == null) {
            message = "platform missing String.prototype.normalize";
        }
        if (_normalizeError) {
            this.throwError("platform missing String.prototype.normalize", Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "String.prototype.normalize", form: _normalizeError
            });
        }
    };
    Logger.prototype.checkSafeUint53 = function (value, message) {
        if (typeof (value) !== "number") {
            return;
        }
        if (message == null) {
            message = "value not safe";
        }
        if (value < 0 || value >= 0x1fffffffffffff) {
            this.throwError(message, Logger.errors.NUMERIC_FAULT, {
                operation: "checkSafeInteger",
                fault: "out-of-safe-range",
                value: value
            });
        }
        if (value % 1) {
            this.throwError(message, Logger.errors.NUMERIC_FAULT, {
                operation: "checkSafeInteger",
                fault: "non-integer",
                value: value
            });
        }
    };
    Logger.prototype.checkArgumentCount = function (count, expectedCount, message) {
        if (message) {
            message = ": " + message;
        }
        else {
            message = "";
        }
        if (count < expectedCount) {
            this.throwError("missing argument" + message, Logger.errors.MISSING_ARGUMENT, {
                count: count,
                expectedCount: expectedCount
            });
        }
        if (count > expectedCount) {
            this.throwError("too many arguments" + message, Logger.errors.UNEXPECTED_ARGUMENT, {
                count: count,
                expectedCount: expectedCount
            });
        }
    };
    Logger.prototype.checkNew = function (target, kind) {
        if (target === Object || target == null) {
            this.throwError("missing new", Logger.errors.MISSING_NEW, { name: kind.name });
        }
    };
    Logger.prototype.checkAbstract = function (target, kind) {
        if (target === kind) {
            this.throwError("cannot instantiate abstract class " + JSON.stringify(kind.name) + " directly; use a sub-class", Logger.errors.UNSUPPORTED_OPERATION, { name: target.name, operation: "new" });
        }
        else if (target === Object || target == null) {
            this.throwError("missing new", Logger.errors.MISSING_NEW, { name: kind.name });
        }
    };
    Logger.globalLogger = function () {
        if (!_globalLogger) {
            _globalLogger = new Logger(_version_1.version);
        }
        return _globalLogger;
    };
    Logger.setCensorship = function (censorship, permanent) {
        if (!censorship && permanent) {
            this.globalLogger().throwError("cannot permanently disable censorship", Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "setCensorship"
            });
        }
        if (_permanentCensorErrors) {
            if (!censorship) {
                return;
            }
            this.globalLogger().throwError("error censorship permanent", Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "setCensorship"
            });
        }
        _censorErrors = !!censorship;
        _permanentCensorErrors = !!permanent;
    };
    Logger.setLogLevel = function (logLevel) {
        var level = LogLevels[logLevel.toLowerCase()];
        if (level == null) {
            Logger.globalLogger().warn("invalid log level - " + logLevel);
            return;
        }
        _logLevel = level;
    };
    Logger.from = function (version) {
        return new Logger(version);
    };
    Logger.errors = ErrorCode;
    Logger.levels = LogLevel;
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@ethersproject/rlp/lib/_version.js":
/*!*********************************************************!*\
  !*** ./node_modules/@ethersproject/rlp/lib/_version.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.version = void 0;
exports.version = "rlp/5.7.0";
//# sourceMappingURL=_version.js.map

/***/ }),

/***/ "./node_modules/@ethersproject/rlp/lib/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@ethersproject/rlp/lib/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decode = exports.encode = void 0;
//See: https://github.com/ethereum/wiki/wiki/RLP
var bytes_1 = __webpack_require__(/*! @ethersproject/bytes */ "./node_modules/@ethersproject/bytes/lib/index.js");
var logger_1 = __webpack_require__(/*! @ethersproject/logger */ "./node_modules/@ethersproject/logger/lib/index.js");
var _version_1 = __webpack_require__(/*! ./_version */ "./node_modules/@ethersproject/rlp/lib/_version.js");
var logger = new logger_1.Logger(_version_1.version);
function arrayifyInteger(value) {
    var result = [];
    while (value) {
        result.unshift(value & 0xff);
        value >>= 8;
    }
    return result;
}
function unarrayifyInteger(data, offset, length) {
    var result = 0;
    for (var i = 0; i < length; i++) {
        result = (result * 256) + data[offset + i];
    }
    return result;
}
function _encode(object) {
    if (Array.isArray(object)) {
        var payload_1 = [];
        object.forEach(function (child) {
            payload_1 = payload_1.concat(_encode(child));
        });
        if (payload_1.length <= 55) {
            payload_1.unshift(0xc0 + payload_1.length);
            return payload_1;
        }
        var length_1 = arrayifyInteger(payload_1.length);
        length_1.unshift(0xf7 + length_1.length);
        return length_1.concat(payload_1);
    }
    if (!(0, bytes_1.isBytesLike)(object)) {
        logger.throwArgumentError("RLP object must be BytesLike", "object", object);
    }
    var data = Array.prototype.slice.call((0, bytes_1.arrayify)(object));
    if (data.length === 1 && data[0] <= 0x7f) {
        return data;
    }
    else if (data.length <= 55) {
        data.unshift(0x80 + data.length);
        return data;
    }
    var length = arrayifyInteger(data.length);
    length.unshift(0xb7 + length.length);
    return length.concat(data);
}
function encode(object) {
    return (0, bytes_1.hexlify)(_encode(object));
}
exports.encode = encode;
function _decodeChildren(data, offset, childOffset, length) {
    var result = [];
    while (childOffset < offset + 1 + length) {
        var decoded = _decode(data, childOffset);
        result.push(decoded.result);
        childOffset += decoded.consumed;
        if (childOffset > offset + 1 + length) {
            logger.throwError("child data too short", logger_1.Logger.errors.BUFFER_OVERRUN, {});
        }
    }
    return { consumed: (1 + length), result: result };
}
// returns { consumed: number, result: Object }
function _decode(data, offset) {
    if (data.length === 0) {
        logger.throwError("data too short", logger_1.Logger.errors.BUFFER_OVERRUN, {});
    }
    // Array with extra length prefix
    if (data[offset] >= 0xf8) {
        var lengthLength = data[offset] - 0xf7;
        if (offset + 1 + lengthLength > data.length) {
            logger.throwError("data short segment too short", logger_1.Logger.errors.BUFFER_OVERRUN, {});
        }
        var length_2 = unarrayifyInteger(data, offset + 1, lengthLength);
        if (offset + 1 + lengthLength + length_2 > data.length) {
            logger.throwError("data long segment too short", logger_1.Logger.errors.BUFFER_OVERRUN, {});
        }
        return _decodeChildren(data, offset, offset + 1 + lengthLength, lengthLength + length_2);
    }
    else if (data[offset] >= 0xc0) {
        var length_3 = data[offset] - 0xc0;
        if (offset + 1 + length_3 > data.length) {
            logger.throwError("data array too short", logger_1.Logger.errors.BUFFER_OVERRUN, {});
        }
        return _decodeChildren(data, offset, offset + 1, length_3);
    }
    else if (data[offset] >= 0xb8) {
        var lengthLength = data[offset] - 0xb7;
        if (offset + 1 + lengthLength > data.length) {
            logger.throwError("data array too short", logger_1.Logger.errors.BUFFER_OVERRUN, {});
        }
        var length_4 = unarrayifyInteger(data, offset + 1, lengthLength);
        if (offset + 1 + lengthLength + length_4 > data.length) {
            logger.throwError("data array too short", logger_1.Logger.errors.BUFFER_OVERRUN, {});
        }
        var result = (0, bytes_1.hexlify)(data.slice(offset + 1 + lengthLength, offset + 1 + lengthLength + length_4));
        return { consumed: (1 + lengthLength + length_4), result: result };
    }
    else if (data[offset] >= 0x80) {
        var length_5 = data[offset] - 0x80;
        if (offset + 1 + length_5 > data.length) {
            logger.throwError("data too short", logger_1.Logger.errors.BUFFER_OVERRUN, {});
        }
        var result = (0, bytes_1.hexlify)(data.slice(offset + 1, offset + 1 + length_5));
        return { consumed: (1 + length_5), result: result };
    }
    return { consumed: 1, result: (0, bytes_1.hexlify)(data[offset]) };
}
function decode(data) {
    var bytes = (0, bytes_1.arrayify)(data);
    var decoded = _decode(bytes, 0);
    if (decoded.consumed !== bytes.length) {
        logger.throwArgumentError("invalid rlp data", "data", data);
    }
    return decoded.result;
}
exports.decode = decode;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    var proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    var copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        Buffer.from(buf).copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (var i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
  var alphabet = '0123456789abcdef'
  var table = new Array(256)
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/kprojs-web-hid/lib-es/transport-web-hid.js":
/*!*****************************************************************!*\
  !*** ./node_modules/kprojs-web-hid/lib-es/transport-web-hid.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var kprojs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! kprojs */ "./node_modules/kprojs/lib-es/index.js");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const kproDevices = [
    {
        vendorId: kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].HIDFraming.kproUSBVendorId,
    },
];
const isSupported = () => Promise.resolve(!!(window.navigator && window.navigator.hid));
const getHID = () => {
    // $FlowFixMe
    const { hid } = navigator;
    if (!hid)
        throw new kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].KProError.TransportError("navigator.hid is not supported", "HIDNotSupported");
    return hid;
};
function requestKProDevices() {
    return __awaiter(this, void 0, void 0, function* () {
        const device = yield getHID().requestDevice({
            filters: kproDevices,
        });
        if (Array.isArray(device))
            return device;
        return [device];
    });
}
function getKProDevices() {
    return __awaiter(this, void 0, void 0, function* () {
        const devices = yield getHID().getDevices();
        return devices.filter(d => d.vendorId === kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].HIDFraming.kproUSBVendorId);
    });
}
function getFirstKProDevice() {
    return __awaiter(this, void 0, void 0, function* () {
        const existingDevices = yield getKProDevices();
        if (existingDevices.length > 0)
            return existingDevices[0];
        const devices = yield requestKProDevices();
        return devices[0];
    });
}
/**
 * WebHID Transport implementation
 * @example
 * import TransportWebHID from "transport-webhid";
 * ...
 * TransportWebHID.create().then(transport => ...)
 */
class TransportWebHID extends kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].Transport {
    constructor(device) {
        super();
        this.channel = Math.floor(Math.random() * 0xffff);
        this.packetSize = 64;
        this.inputs = [];
        this.read = () => {
            if (this.inputs.length) {
                return Promise.resolve(this.inputs.shift());
            }
            return new Promise(success => {
                this.inputCallback = success;
            });
        };
        this.onInputReport = (e) => {
            const buffer = Buffer.from(e.data.buffer);
            if (this.inputCallback) {
                this.inputCallback(buffer);
                this.inputCallback = null;
            }
            else {
                this.inputs.push(buffer);
            }
        };
        this._disconnectEmitted = false;
        this._emitDisconnect = (e) => {
            if (this._disconnectEmitted)
                return;
            this._disconnectEmitted = true;
            this.emit("disconnect", e);
        };
        /**
         * Exchange with the device using APDU protocol.
         * @param apdu
         * @returns a promise of apdu response
         */
        this.exchange = (apdu) => __awaiter(this, void 0, void 0, function* () {
            const b = yield this.exchangeAtomicImpl(() => __awaiter(this, void 0, void 0, function* () {
                const { channel, packetSize } = this;
                kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].KProLogs.log("apdu", "=> " + apdu.toString("hex"));
                const framing = kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].HIDFraming.hidFraming(channel, packetSize);
                // Write...
                const blocks = framing.makeBlocks(apdu);
                for (let i = 0; i < blocks.length; i++) {
                    yield this.device.sendReport(0, blocks[i]);
                }
                // Read...
                let result;
                let acc;
                while (!(result = framing.getReducedResult(acc))) {
                    const buffer = yield this.read();
                    acc = framing.reduceResponse(acc, buffer);
                }
                kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].KProLogs.log("apdu", "<= " + result.toString("hex"));
                return result;
            })).catch(e => {
                if (e && e.message && e.message.includes("write")) {
                    this._emitDisconnect(e);
                    throw new kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].KProError.DisconnectedDeviceDuringOperation(e.message);
                }
                throw e;
            });
            return b;
        });
        this.device = device;
        this.deviceModel =
            typeof device.productId === "number" ? kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].KProDevice.identifyUSBProductId(device.productId) : undefined;
        device.addEventListener("inputreport", this.onInputReport);
    }
    /**
     * Similar to create() except it will always display the device permission (even if some devices are already accepted).
     */
    static request() {
        return __awaiter(this, void 0, void 0, function* () {
            const [device] = yield requestKProDevices();
            return TransportWebHID.open(device);
        });
    }
    /**
     * Similar to create() except it will never display the device permission (it returns a Promise<?Transport>, null if it fails to find a device).
     */
    static openConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = yield getKProDevices();
            if (devices.length === 0)
                return null;
            return TransportWebHID.open(devices[0]);
        });
    }
    /**
     * Create a KPro transport with a HIDDevice
     */
    static open(device) {
        return __awaiter(this, void 0, void 0, function* () {
            yield device.open();
            const transport = new TransportWebHID(device);
            const onDisconnect = (e) => {
                if (device === e.device) {
                    getHID().removeEventListener("disconnect", onDisconnect);
                    transport._emitDisconnect(new kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].KProError.DisconnectedDevice());
                }
            };
            getHID().addEventListener("disconnect", onDisconnect);
            return transport;
        });
    }
    /**
     * Release the transport device
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.exchangeBusyPromise;
            this.device.removeEventListener("inputreport", this.onInputReport);
            yield this.device.close();
        });
    }
}
/**
 * Check if WebUSB transport is supported.
 */
TransportWebHID.isSupported = isSupported;
/**
 * List the WebUSB devices that was previously authorized by the user.
 */
TransportWebHID.list = getKProDevices;
/**
 * Actively listen to WebUSB devices and emit ONE device
 * that was either accepted before, if not it will trigger the native permission UI.
 *
 * Important: it must be called in the context of a UI click!
 */
TransportWebHID.listen = (observer) => {
    let unsubscribed = false;
    getFirstKProDevice().then(device => {
        if (!device) {
            observer.error(new kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].KProError.TransportOpenUserCancelled("Access denied to use KPro device"));
        }
        else if (!unsubscribed) {
            const deviceModel = typeof device.productId === "number"
                ? kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].KProDevice.identifyUSBProductId(device.productId)
                : undefined;
            observer.next({
                type: "add",
                descriptor: device,
                deviceModel,
            });
            observer.complete();
        }
    }, error => {
        observer.error(new kprojs__WEBPACK_IMPORTED_MODULE_0__["default"].KProError.TransportOpenUserCancelled(error.message));
    });
    function unsubscribe() {
        unsubscribed = true;
    }
    return {
        unsubscribe,
    };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TransportWebHID);
//# sourceMappingURL=transport-web-hid.js.map

/***/ }),

/***/ "./node_modules/kprojs/lib-es/device.js":
/*!**********************************************!*\
  !*** ./node_modules/kprojs/lib-es/device.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KProDevice: () => (/* binding */ KProDevice)
/* harmony export */ });
var KProDevice;
(function (KProDevice) {
    var device = {
        id: 0,
        productName: "Keycard Pro Wallet",
        productId: 0x0001
    };
    KProDevice.identifyUSBProductId = function (usbProductId) {
        return device.productId === usbProductId ? device : null;
    };
    KProDevice.identifyProductName = function (productName) {
        return (productName === device.productName) ? device : null;
    };
})(KProDevice || (KProDevice = {}));
//# sourceMappingURL=device.js.map

/***/ }),

/***/ "./node_modules/kprojs/lib-es/error-helpers.js":
/*!*****************************************************!*\
  !*** ./node_modules/kprojs/lib-es/error-helpers.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addCustomErrorDeserializer: () => (/* binding */ addCustomErrorDeserializer),
/* harmony export */   createCustomErrorClass: () => (/* binding */ createCustomErrorClass),
/* harmony export */   deserializeError: () => (/* binding */ deserializeError),
/* harmony export */   serializeError: () => (/* binding */ serializeError)
/* harmony export */ });
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var errorClasses = {};
var deserializers = {};
var isObject = function (value) {
    return typeof value === "object";
};
var addCustomErrorDeserializer = function (name, deserializer) {
    deserializers[name] = deserializer;
};
var createCustomErrorClass = function (name) {
    var CustomErrorClass = /** @class */ (function (_super) {
        __extends(CustomErrorClass, _super);
        function CustomErrorClass(message, fields, options) {
            var _this = 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _super.call(this, message || name, options) || this;
            // Set the prototype explicitly. See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
            Object.setPrototypeOf(_this, CustomErrorClass.prototype);
            _this.name = name;
            if (fields) {
                for (var k in fields) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    _this[k] = fields[k];
                }
            }
            if (options && isObject(options) && "cause" in options && !("cause" in _this)) {
                // .cause was specified but the superconstructor
                // did not create an instance property.
                var cause = options.cause;
                _this.cause = cause;
                if ("stack" in cause) {
                    _this.stack = _this.stack + "\nCAUSE: " + cause.stack;
                }
            }
            return _this;
        }
        return CustomErrorClass;
    }(Error));
    errorClasses[name] = CustomErrorClass;
    return CustomErrorClass;
};
// inspired from https://github.com/programble/errio/blob/master/index.js
var deserializeError = function (object) {
    if (object && typeof object === "object") {
        try {
            if (typeof object.message === "string") {
                var msg = JSON.parse(object.message);
                if (msg.message && msg.name) {
                    object = msg;
                }
            }
        }
        catch (e) {
            // nothing
        }
        var error = void 0;
        if (typeof object.name === "string") {
            var name_1 = object.name;
            var des = deserializers[name_1];
            if (des) {
                error = des(object);
            }
            else {
                var constructor = name_1 === "Error" ? Error : errorClasses[name_1];
                if (!constructor) {
                    console.warn("deserializing an unknown class '" + name_1 + "'");
                    constructor = createCustomErrorClass(name_1);
                }
                error = Object.create(constructor.prototype);
                try {
                    for (var prop in object) {
                        if (object.hasOwnProperty(prop)) {
                            error[prop] = object[prop];
                        }
                    }
                }
                catch (e) {
                    // sometimes setting a property can fail (e.g. .name)
                }
            }
        }
        else {
            if (typeof object.message === "string") {
                error = new Error(object.message);
            }
        }
        if (error && !error.stack && Error.captureStackTrace) {
            Error.captureStackTrace(error, deserializeError);
        }
        return error;
    }
    return new Error(String(object));
};
// inspired from https://github.com/sindresorhus/serialize-error/blob/master/index.js
var serializeError = function (value) {
    if (!value)
        return value;
    if (typeof value === "object") {
        return destroyCircular(value, []);
    }
    if (typeof value === "function") {
        return "[Function: ".concat(value.name || "anonymous", "]");
    }
    return value;
};
// https://www.npmjs.com/package/destroy-circular
var destroyCircular = function (from, seen) {
    var e_1, _a;
    var to = {};
    seen.push(from);
    try {
        for (var _b = __values(Object.keys(from)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            var value = from[key];
            if (typeof value === "function") {
                continue;
            }
            if (!value || typeof value !== "object") {
                to[key] = value;
                continue;
            }
            if (seen.indexOf(from[key]) === -1) {
                to[key] = destroyCircular(from[key], seen.slice(0));
                continue;
            }
            to[key] = "[Circular]";
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (typeof from.name === "string") {
        to.name = from.name;
    }
    if (typeof from.message === "string") {
        to.message = from.message;
    }
    if (typeof from.stack === "string") {
        to.stack = from.stack;
    }
    return to;
};
//# sourceMappingURL=error-helpers.js.map

/***/ }),

/***/ "./node_modules/kprojs/lib-es/errors.js":
/*!**********************************************!*\
  !*** ./node_modules/kprojs/lib-es/errors.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountNameRequiredError: () => (/* binding */ AccountNameRequiredError),
/* harmony export */   AccountNotSupported: () => (/* binding */ AccountNotSupported),
/* harmony export */   AmountRequired: () => (/* binding */ AmountRequired),
/* harmony export */   CantOpenDevice: () => (/* binding */ CantOpenDevice),
/* harmony export */   CantScanQRCode: () => (/* binding */ CantScanQRCode),
/* harmony export */   CashAddrNotSupported: () => (/* binding */ CashAddrNotSupported),
/* harmony export */   ClaimRewardsFeesWarning: () => (/* binding */ ClaimRewardsFeesWarning),
/* harmony export */   CurrencyNotSupported: () => (/* binding */ CurrencyNotSupported),
/* harmony export */   DBNotReset: () => (/* binding */ DBNotReset),
/* harmony export */   DBWrongPassword: () => (/* binding */ DBWrongPassword),
/* harmony export */   DeviceAppVerifyNotSupported: () => (/* binding */ DeviceAppVerifyNotSupported),
/* harmony export */   DeviceExtractOnboardingStateError: () => (/* binding */ DeviceExtractOnboardingStateError),
/* harmony export */   DeviceGenuineSocketEarlyClose: () => (/* binding */ DeviceGenuineSocketEarlyClose),
/* harmony export */   DeviceHalted: () => (/* binding */ DeviceHalted),
/* harmony export */   DeviceInOSUExpected: () => (/* binding */ DeviceInOSUExpected),
/* harmony export */   DeviceNameInvalid: () => (/* binding */ DeviceNameInvalid),
/* harmony export */   DeviceNotGenuineError: () => (/* binding */ DeviceNotGenuineError),
/* harmony export */   DeviceOnDashboardExpected: () => (/* binding */ DeviceOnDashboardExpected),
/* harmony export */   DeviceOnDashboardUnexpected: () => (/* binding */ DeviceOnDashboardUnexpected),
/* harmony export */   DeviceOnboardingStatePollingError: () => (/* binding */ DeviceOnboardingStatePollingError),
/* harmony export */   DeviceShouldStayInApp: () => (/* binding */ DeviceShouldStayInApp),
/* harmony export */   DeviceSocketFail: () => (/* binding */ DeviceSocketFail),
/* harmony export */   DeviceSocketNoBulkStatus: () => (/* binding */ DeviceSocketNoBulkStatus),
/* harmony export */   DisconnectedDevice: () => (/* binding */ DisconnectedDevice),
/* harmony export */   DisconnectedDeviceDuringOperation: () => (/* binding */ DisconnectedDeviceDuringOperation),
/* harmony export */   ETHAddressNonEIP: () => (/* binding */ ETHAddressNonEIP),
/* harmony export */   EnpointConfigError: () => (/* binding */ EnpointConfigError),
/* harmony export */   EthAppPleaseEnableContractData: () => (/* binding */ EthAppPleaseEnableContractData),
/* harmony export */   FeeEstimationFailed: () => (/* binding */ FeeEstimationFailed),
/* harmony export */   FeeNotLoaded: () => (/* binding */ FeeNotLoaded),
/* harmony export */   FeeRequired: () => (/* binding */ FeeRequired),
/* harmony export */   FeeTooHigh: () => (/* binding */ FeeTooHigh),
/* harmony export */   FirmwareNotRecognized: () => (/* binding */ FirmwareNotRecognized),
/* harmony export */   FirmwareOrAppUpdateRequired: () => (/* binding */ FirmwareOrAppUpdateRequired),
/* harmony export */   GasLessThanEstimate: () => (/* binding */ GasLessThanEstimate),
/* harmony export */   GenuineCheckFailed: () => (/* binding */ GenuineCheckFailed),
/* harmony export */   HardResetFail: () => (/* binding */ HardResetFail),
/* harmony export */   HwTransportError: () => (/* binding */ HwTransportError),
/* harmony export */   HwTransportErrorType: () => (/* binding */ HwTransportErrorType),
/* harmony export */   InvalidAddress: () => (/* binding */ InvalidAddress),
/* harmony export */   InvalidAddressBecauseDestinationIsAlsoSource: () => (/* binding */ InvalidAddressBecauseDestinationIsAlsoSource),
/* harmony export */   InvalidNonce: () => (/* binding */ InvalidNonce),
/* harmony export */   InvalidXRPTag: () => (/* binding */ InvalidXRPTag),
/* harmony export */   KProAPI: () => (/* binding */ KProAPI),
/* harmony export */   KProAPIError: () => (/* binding */ KProAPIError),
/* harmony export */   KProAPIErrorWithMessage: () => (/* binding */ KProAPIErrorWithMessage),
/* harmony export */   KProAPINotAvailable: () => (/* binding */ KProAPINotAvailable),
/* harmony export */   LanguageNotFound: () => (/* binding */ LanguageNotFound),
/* harmony export */   LatestMCUInstalledError: () => (/* binding */ LatestMCUInstalledError),
/* harmony export */   LockedDeviceError: () => (/* binding */ LockedDeviceError),
/* harmony export */   MCUNotGenuineToDashboard: () => (/* binding */ MCUNotGenuineToDashboard),
/* harmony export */   ManagerAppAlreadyInstalledError: () => (/* binding */ ManagerAppAlreadyInstalledError),
/* harmony export */   ManagerAppDepInstallRequired: () => (/* binding */ ManagerAppDepInstallRequired),
/* harmony export */   ManagerAppDepUninstallRequired: () => (/* binding */ ManagerAppDepUninstallRequired),
/* harmony export */   ManagerDeviceLockedError: () => (/* binding */ ManagerDeviceLockedError),
/* harmony export */   ManagerFirmwareNotEnoughSpaceError: () => (/* binding */ ManagerFirmwareNotEnoughSpaceError),
/* harmony export */   ManagerNotEnoughSpaceError: () => (/* binding */ ManagerNotEnoughSpaceError),
/* harmony export */   ManagerUninstallBTCDep: () => (/* binding */ ManagerUninstallBTCDep),
/* harmony export */   MaxFeeTooLow: () => (/* binding */ MaxFeeTooLow),
/* harmony export */   NetworkDown: () => (/* binding */ NetworkDown),
/* harmony export */   NoAccessToCamera: () => (/* binding */ NoAccessToCamera),
/* harmony export */   NoAddressesFound: () => (/* binding */ NoAddressesFound),
/* harmony export */   NoDBPathGiven: () => (/* binding */ NoDBPathGiven),
/* harmony export */   NotEnoughBalance: () => (/* binding */ NotEnoughBalance),
/* harmony export */   NotEnoughBalanceBecauseDestinationNotCreated: () => (/* binding */ NotEnoughBalanceBecauseDestinationNotCreated),
/* harmony export */   NotEnoughBalanceInParentAccount: () => (/* binding */ NotEnoughBalanceInParentAccount),
/* harmony export */   NotEnoughBalanceToDelegate: () => (/* binding */ NotEnoughBalanceToDelegate),
/* harmony export */   NotEnoughGas: () => (/* binding */ NotEnoughGas),
/* harmony export */   NotEnoughGasSwap: () => (/* binding */ NotEnoughGasSwap),
/* harmony export */   NotEnoughSpendableBalance: () => (/* binding */ NotEnoughSpendableBalance),
/* harmony export */   NotSupportedLegacyAddress: () => (/* binding */ NotSupportedLegacyAddress),
/* harmony export */   PairingFailed: () => (/* binding */ PairingFailed),
/* harmony export */   PasswordIncorrectError: () => (/* binding */ PasswordIncorrectError),
/* harmony export */   PasswordsDontMatchError: () => (/* binding */ PasswordsDontMatchError),
/* harmony export */   PeerRemovedPairing: () => (/* binding */ PeerRemovedPairing),
/* harmony export */   PendingOperation: () => (/* binding */ PendingOperation),
/* harmony export */   PriorityFeeHigherThanMaxFee: () => (/* binding */ PriorityFeeHigherThanMaxFee),
/* harmony export */   PriorityFeeTooHigh: () => (/* binding */ PriorityFeeTooHigh),
/* harmony export */   PriorityFeeTooLow: () => (/* binding */ PriorityFeeTooLow),
/* harmony export */   RecipientRequired: () => (/* binding */ RecipientRequired),
/* harmony export */   RecommendSubAccountsToEmpty: () => (/* binding */ RecommendSubAccountsToEmpty),
/* harmony export */   RecommendUndelegation: () => (/* binding */ RecommendUndelegation),
/* harmony export */   StatusCodes: () => (/* binding */ StatusCodes),
/* harmony export */   SyncError: () => (/* binding */ SyncError),
/* harmony export */   TimeoutTagged: () => (/* binding */ TimeoutTagged),
/* harmony export */   TransactionHasBeenValidatedError: () => (/* binding */ TransactionHasBeenValidatedError),
/* harmony export */   TransportError: () => (/* binding */ TransportError),
/* harmony export */   TransportInterfaceNotAvailable: () => (/* binding */ TransportInterfaceNotAvailable),
/* harmony export */   TransportOpenUserCancelled: () => (/* binding */ TransportOpenUserCancelled),
/* harmony export */   TransportRaceCondition: () => (/* binding */ TransportRaceCondition),
/* harmony export */   TransportStatusError: () => (/* binding */ TransportStatusError),
/* harmony export */   TransportWebUSBGestureRequired: () => (/* binding */ TransportWebUSBGestureRequired),
/* harmony export */   UnexpectedBootloader: () => (/* binding */ UnexpectedBootloader),
/* harmony export */   UnknownMCU: () => (/* binding */ UnknownMCU),
/* harmony export */   UnresponsiveDeviceError: () => (/* binding */ UnresponsiveDeviceError),
/* harmony export */   UpdateFetchFileFail: () => (/* binding */ UpdateFetchFileFail),
/* harmony export */   UpdateIncorrectHash: () => (/* binding */ UpdateIncorrectHash),
/* harmony export */   UpdateIncorrectSig: () => (/* binding */ UpdateIncorrectSig),
/* harmony export */   UpdateYourApp: () => (/* binding */ UpdateYourApp),
/* harmony export */   UserRefusedAddress: () => (/* binding */ UserRefusedAddress),
/* harmony export */   UserRefusedAllowManager: () => (/* binding */ UserRefusedAllowManager),
/* harmony export */   UserRefusedDeviceNameChange: () => (/* binding */ UserRefusedDeviceNameChange),
/* harmony export */   UserRefusedFirmwareUpdate: () => (/* binding */ UserRefusedFirmwareUpdate),
/* harmony export */   UserRefusedOnDevice: () => (/* binding */ UserRefusedOnDevice),
/* harmony export */   WebsocketConnectionError: () => (/* binding */ WebsocketConnectionError),
/* harmony export */   WebsocketConnectionFailed: () => (/* binding */ WebsocketConnectionFailed),
/* harmony export */   WrongAppForCurrency: () => (/* binding */ WrongAppForCurrency),
/* harmony export */   WrongDeviceForAccount: () => (/* binding */ WrongDeviceForAccount),
/* harmony export */   addCustomErrorDeserializer: () => (/* reexport safe */ _error_helpers__WEBPACK_IMPORTED_MODULE_0__.addCustomErrorDeserializer),
/* harmony export */   createCustomErrorClass: () => (/* reexport safe */ _error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass),
/* harmony export */   deserializeError: () => (/* reexport safe */ _error_helpers__WEBPACK_IMPORTED_MODULE_0__.deserializeError),
/* harmony export */   getAltStatusMessage: () => (/* binding */ getAltStatusMessage),
/* harmony export */   serializeError: () => (/* reexport safe */ _error_helpers__WEBPACK_IMPORTED_MODULE_0__.serializeError)
/* harmony export */ });
/* harmony import */ var _error_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error-helpers */ "./node_modules/kprojs/lib-es/error-helpers.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/


var AccountNameRequiredError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("AccountNameRequired");
var AccountNotSupported = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("AccountNotSupported");
var AmountRequired = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("AmountRequired");
var CantOpenDevice = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("CantOpenDevice");
var CashAddrNotSupported = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("CashAddrNotSupported");
var ClaimRewardsFeesWarning = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("ClaimRewardsFeesWarning");
var CurrencyNotSupported = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("CurrencyNotSupported");
var DeviceAppVerifyNotSupported = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceAppVerifyNotSupported");
var DeviceGenuineSocketEarlyClose = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceGenuineSocketEarlyClose");
var DeviceNotGenuineError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceNotGenuine");
var DeviceOnDashboardExpected = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceOnDashboardExpected");
var DeviceOnDashboardUnexpected = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceOnDashboardUnexpected");
var DeviceInOSUExpected = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceInOSUExpected");
var DeviceHalted = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceHalted");
var DeviceNameInvalid = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceNameInvalid");
var DeviceSocketFail = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceSocketFail");
var DeviceSocketNoBulkStatus = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceSocketNoBulkStatus");
var LockedDeviceError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("LockedDeviceError");
var UnresponsiveDeviceError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UnresponsiveDeviceError");
var DisconnectedDevice = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DisconnectedDevice");
var DisconnectedDeviceDuringOperation = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DisconnectedDeviceDuringOperation");
var DeviceExtractOnboardingStateError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceExtractOnboardingStateError");
var DeviceOnboardingStatePollingError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceOnboardingStatePollingError");
var EnpointConfigError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("EnpointConfig");
var EthAppPleaseEnableContractData = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("EthAppPleaseEnableContractData");
var FeeEstimationFailed = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("FeeEstimationFailed");
var FirmwareNotRecognized = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("FirmwareNotRecognized");
var HardResetFail = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("HardResetFail");
var InvalidXRPTag = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("InvalidXRPTag");
var InvalidAddress = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("InvalidAddress");
var InvalidNonce = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("InvalidNonce");
var InvalidAddressBecauseDestinationIsAlsoSource = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("InvalidAddressBecauseDestinationIsAlsoSource");
var LatestMCUInstalledError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("LatestMCUInstalledError");
var UnknownMCU = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UnknownMCU");
var KProAPIError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("KProAPIError");
var KProAPIErrorWithMessage = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("KProAPIErrorWithMessage");
var KProAPINotAvailable = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("KProAPINotAvailable");
var ManagerAppAlreadyInstalledError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("ManagerAppAlreadyInstalled");
var ManagerAppDepInstallRequired = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("ManagerAppDepInstallRequired");
var ManagerAppDepUninstallRequired = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("ManagerAppDepUninstallRequired");
var ManagerDeviceLockedError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("ManagerDeviceLocked");
var ManagerFirmwareNotEnoughSpaceError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("ManagerFirmwareNotEnoughSpace");
var ManagerNotEnoughSpaceError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("ManagerNotEnoughSpace");
var ManagerUninstallBTCDep = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("ManagerUninstallBTCDep");
var NetworkDown = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NetworkDown");
var NoAddressesFound = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NoAddressesFound");
var NotEnoughBalance = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NotEnoughBalance");
var NotEnoughBalanceToDelegate = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NotEnoughBalanceToDelegate");
var NotEnoughBalanceInParentAccount = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NotEnoughBalanceInParentAccount");
var NotEnoughSpendableBalance = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NotEnoughSpendableBalance");
var NotEnoughBalanceBecauseDestinationNotCreated = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NotEnoughBalanceBecauseDestinationNotCreated");
var NoAccessToCamera = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NoAccessToCamera");
var NotEnoughGas = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NotEnoughGas");
// Error message specifically for the PTX swap flow
var NotEnoughGasSwap = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NotEnoughGasSwap");
var NotSupportedLegacyAddress = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NotSupportedLegacyAddress");
var GasLessThanEstimate = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("GasLessThanEstimate");
var PriorityFeeTooLow = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("PriorityFeeTooLow");
var PriorityFeeTooHigh = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("PriorityFeeTooHigh");
var PriorityFeeHigherThanMaxFee = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("PriorityFeeHigherThanMaxFee");
var MaxFeeTooLow = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("MaxFeeTooLow");
var PasswordsDontMatchError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("PasswordsDontMatch");
var PasswordIncorrectError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("PasswordIncorrect");
var RecommendSubAccountsToEmpty = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("RecommendSubAccountsToEmpty");
var RecommendUndelegation = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("RecommendUndelegation");
var TimeoutTagged = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("TimeoutTagged");
var UnexpectedBootloader = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UnexpectedBootloader");
var MCUNotGenuineToDashboard = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("MCUNotGenuineToDashboard");
var RecipientRequired = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("RecipientRequired");
var UpdateFetchFileFail = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UpdateFetchFileFail");
var UpdateIncorrectHash = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UpdateIncorrectHash");
var UpdateIncorrectSig = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UpdateIncorrectSig");
var UpdateYourApp = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UpdateYourApp");
var UserRefusedDeviceNameChange = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UserRefusedDeviceNameChange");
var UserRefusedAddress = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UserRefusedAddress");
var UserRefusedFirmwareUpdate = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UserRefusedFirmwareUpdate");
var UserRefusedAllowManager = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UserRefusedAllowManager");
var UserRefusedOnDevice = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("UserRefusedOnDevice"); // TODO rename because it's just for transaction refusal
var TransportOpenUserCancelled = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("TransportOpenUserCancelled");
var TransportInterfaceNotAvailable = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("TransportInterfaceNotAvailable");
var TransportRaceCondition = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("TransportRaceCondition");
var TransportWebUSBGestureRequired = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("TransportWebUSBGestureRequired");
var TransactionHasBeenValidatedError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("TransactionHasBeenValidatedError");
var DeviceShouldStayInApp = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DeviceShouldStayInApp");
var WebsocketConnectionError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("WebsocketConnectionError");
var WebsocketConnectionFailed = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("WebsocketConnectionFailed");
var WrongDeviceForAccount = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("WrongDeviceForAccount");
var WrongAppForCurrency = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("WrongAppForCurrency");
var ETHAddressNonEIP = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("ETHAddressNonEIP");
var CantScanQRCode = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("CantScanQRCode");
var FeeNotLoaded = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("FeeNotLoaded");
var FeeRequired = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("FeeRequired");
var FeeTooHigh = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("FeeTooHigh");
var PendingOperation = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("PendingOperation");
var SyncError = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("SyncError");
var PairingFailed = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("PairingFailed");
var PeerRemovedPairing = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("PeerRemovedPairing");
var GenuineCheckFailed = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("GenuineCheckFailed");
var FirmwareOrAppUpdateRequired = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("FirmwareOrAppUpdateRequired");
var KProAPI = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("KProAPI");
// Language
var LanguageNotFound = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("LanguageNotFound");
// db stuff, no need to translate
var NoDBPathGiven = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("NoDBPathGiven");
var DBWrongPassword = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DBWrongPassword");
var DBNotReset = (0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.createCustomErrorClass)("DBNotReset");
/**
 * Type of a Transport error used to represent all equivalent errors coming from all possible implementation of Transport
 */
var HwTransportErrorType;
(function (HwTransportErrorType) {
    HwTransportErrorType["Unknown"] = "Unknown";
    HwTransportErrorType["LocationServicesDisabled"] = "LocationServicesDisabled";
    HwTransportErrorType["LocationServicesUnauthorized"] = "LocationServicesUnauthorized";
    HwTransportErrorType["BluetoothScanStartFailed"] = "BluetoothScanStartFailed";
})(HwTransportErrorType || (HwTransportErrorType = {}));
/**
 * Represents an error coming from the usage of any Transport implementation.
 *
 * Needed to map a specific implementation error into an error that
 * can be managed by any code unaware of the specific Transport implementation
 * that was used.
 */
var HwTransportError = /** @class */ (function (_super) {
    __extends(HwTransportError, _super);
    function HwTransportError(type, message) {
        var _this = _super.call(this, message) || this;
        _this.name = "HwTransportError";
        _this.type = type;
        // Needed as long as we target < ES6
        Object.setPrototypeOf(_this, HwTransportError.prototype);
        return _this;
    }
    return HwTransportError;
}(Error));

/**
 * TransportError is used for any generic transport errors.
 * e.g. Error thrown when data received by exchanges are incorrect or if exchanged failed to communicate with the device for various reason.
 */
var TransportError = /** @class */ (function (_super) {
    __extends(TransportError, _super);
    function TransportError(message, id) {
        var _this = this;
        var name = "TransportError";
        _this = _super.call(this, message || name) || this;
        _this.name = name;
        _this.message = message;
        _this.stack = new Error(message).stack;
        _this.id = id;
        return _this;
    }
    return TransportError;
}(Error));

(0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.addCustomErrorDeserializer)("TransportError", function (e) { return new TransportError(e.message, e.id); });
var StatusCodes = {
    ACCESS_CONDITION_NOT_FULFILLED: 0x9804,
    ALGORITHM_NOT_SUPPORTED: 0x9484,
    CLA_NOT_SUPPORTED: 0x6e00,
    CODE_BLOCKED: 0x9840,
    CODE_NOT_INITIALIZED: 0x9802,
    COMMAND_INCOMPATIBLE_FILE_STRUCTURE: 0x6981,
    CONDITIONS_OF_USE_NOT_SATISFIED: 0x6985,
    CONTRADICTION_INVALIDATION: 0x9810,
    CONTRADICTION_SECRET_CODE_STATUS: 0x9808,
    CUSTOM_IMAGE_BOOTLOADER: 0x662f,
    CUSTOM_IMAGE_EMPTY: 0x662e,
    FILE_ALREADY_EXISTS: 0x6a89,
    FILE_NOT_FOUND: 0x9404,
    GP_AUTH_FAILED: 0x6300,
    HALTED: 0x6faa,
    INCONSISTENT_FILE: 0x9408,
    INCORRECT_DATA: 0x6a80,
    INCORRECT_LENGTH: 0x6700,
    INCORRECT_P1_P2: 0x6b00,
    INS_NOT_SUPPORTED: 0x6d00,
    DEVICE_NOT_ONBOARDED: 0x6d07,
    DEVICE_NOT_ONBOARDED_2: 0x6611,
    INVALID_KCV: 0x9485,
    INVALID_OFFSET: 0x9402,
    LICENSING: 0x6f42,
    LOCKED_DEVICE: 0x5515,
    MAX_VALUE_REACHED: 0x9850,
    MEMORY_PROBLEM: 0x9240,
    MISSING_CRITICAL_PARAMETER: 0x6800,
    NO_EF_SELECTED: 0x9400,
    NOT_ENOUGH_MEMORY_SPACE: 0x6a84,
    OK: 0x9000,
    PIN_REMAINING_ATTEMPTS: 0x63c0,
    REFERENCED_DATA_NOT_FOUND: 0x6a88,
    SECURITY_STATUS_NOT_SATISFIED: 0x6982,
    TECHNICAL_PROBLEM: 0x6f00,
    UNKNOWN_APDU: 0x6d02,
    USER_REFUSED_ON_DEVICE: 0x5501,
    NOT_ENOUGH_SPACE: 0x5102,
};
var getAltStatusMessage = function (code) {
    switch (code) {
        // improve text of most common errors
        case 0x6700:
            return "Incorrect length";
        case 0x6800:
            return "Missing critical parameter";
        case 0x6982:
            return "Security not satisfied (dongle locked or have invalid access rights)";
        case 0x6985:
            return "Condition of use not satisfied (denied by the user?)";
        case 0x6a80:
            return "Invalid data received";
        case 0x6b00:
            return "Invalid parameter received";
        case 0x5515:
            return "Locked device";
    }
    if (0x6f00 <= code && code <= 0x6fff) {
        return "Internal error, please report";
    }
};
/**
 * Error thrown when a device returned a non success status.
 * the error.statusCode is one of the `StatusCodes` exported by this library.
 */
var TransportStatusError = /** @class */ (function (_super) {
    __extends(TransportStatusError, _super);
    function TransportStatusError(statusCode) {
        var _this = this;
        var statusText = Object.keys(StatusCodes).find(function (k) { return StatusCodes[k] === statusCode; }) || "UNKNOWN_ERROR";
        var smsg = getAltStatusMessage(statusCode) || statusText;
        var statusCodeStr = statusCode.toString(16);
        var message = "KPro device: ".concat(smsg, " (0x").concat(statusCodeStr, ")");
        // Maps to a LockedDeviceError
        if (statusCode === StatusCodes.LOCKED_DEVICE) {
            throw new LockedDeviceError(message);
        }
        _this = _super.call(this, message) || this;
        _this.name = "TransportStatusError";
        _this.message = message;
        _this.stack = new Error(message).stack;
        _this.statusCode = statusCode;
        _this.statusText = statusText;
        return _this;
    }
    return TransportStatusError;
}(Error));

(0,_error_helpers__WEBPACK_IMPORTED_MODULE_0__.addCustomErrorDeserializer)("TransportStatusError", function (e) { return new TransportStatusError(e.statusCode); });
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ "./node_modules/kprojs/lib-es/eth.js":
/*!*******************************************!*\
  !*** ./node_modules/kprojs/lib-es/eth.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ERC1155_CLEAR_SIGNED_SELECTORS: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.ERC1155_CLEAR_SIGNED_SELECTORS),
/* harmony export */   ERC20_CLEAR_SIGNED_SELECTORS: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.ERC20_CLEAR_SIGNED_SELECTORS),
/* harmony export */   ERC721_CLEAR_SIGNED_SELECTORS: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.ERC721_CLEAR_SIGNED_SELECTORS),
/* harmony export */   decodeTxInfo: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.decodeTxInfo),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   hexBuffer: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.hexBuffer),
/* harmony export */   intAsHexBytes: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.intAsHexBytes),
/* harmony export */   maybeHexBuffer: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.maybeHexBuffer),
/* harmony export */   nftSelectors: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.nftSelectors),
/* harmony export */   splitPath: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.splitPath),
/* harmony export */   tokenSelectors: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.tokenSelectors)
/* harmony export */ });
/* harmony import */ var _logs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logs */ "./node_modules/kprojs/lib-es/logs.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./node_modules/kprojs/lib-es/utils.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors */ "./node_modules/kprojs/lib-es/errors.js");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var remapTransactionRelatedErrors = function (e) {
    if (e && e.statusCode === 0x6a80) {
        return new _errors__WEBPACK_IMPORTED_MODULE_2__.EthAppPleaseEnableContractData("Please enable Blind signing or Contract data in the Ethereum app Settings");
    }
    return e;
};
/**
 * Ethereum API
 *
 * @example
 * import KProJS from "kprojs";
 * const eth = new KProJS.Eth(transport)
 */
var Eth = /** @class */ (function () {
    function Eth(transport) {
        this.transport = transport;
    }
    /**
     * get Ethereum address for a given BIP 32 path.
     * @param path a path in BIP 32 format
     * @option boolDisplay optionally enable or not the display
     * @option boolChaincode optionally enable or not the chaincode request
     * @return an object with a publicKey, address and (optionally) chainCode
     * @example
     * const resp = await eth.getAddress("44'/60'/0'/0/0");
     * console.log(resp.address);
     */
    Eth.prototype.getAddress = function (path, boolDisplay, boolChaincode) {
        return __awaiter(this, void 0, void 0, function () {
            var paths, buffer, response, publicKeyLength, addressLength, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paths = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.splitPath)(path);
                        buffer = Buffer.alloc(1 + paths.length * 4);
                        buffer[0] = paths.length;
                        paths.forEach(function (element, index) {
                            buffer.writeUInt32BE(element, 1 + 4 * index);
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.transport.send(0xe0, 0x02, boolDisplay ? 0x01 : 0x00, boolChaincode ? 0x01 : 0x00, buffer)];
                    case 2:
                        response = _a.sent();
                        publicKeyLength = response[0];
                        addressLength = response[1 + publicKeyLength];
                        return [2 /*return*/, {
                                publicKey: response.subarray(1, 1 + publicKeyLength).toString("hex"),
                                address: "0x" + response.subarray(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength).toString("ascii"),
                                chainCode: boolChaincode ? response.subarray(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32).toString("hex") : undefined
                            }];
                    case 3:
                        error_1 = _a.sent();
                        (0,_logs__WEBPACK_IMPORTED_MODULE_0__.log)("error", "Couldn't get address", error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * You can sign a transaction and retrieve v, r, s given the raw transaction and the BIP 32 path of the account to sign.
     *
     * @param path: the BIP32 path to sign the transaction on
     * @param rawTxHex: the raw ethereum transaction in hexadecimal to sign
     * @param resolution: resolution is an object with all "resolved" metadata necessary to allow the device to clear sign information. This includes: ERC20 token information, plugins, contracts, NFT signatures,... You must explicitly provide something to avoid having a warning. By default, you can use KPro's service or your own resolution service. See services/types.js for the contract. Setting the value to "null" will fallback everything to blind signing but will still allow the device to sign the transaction.
     * @example
     * import KProJS from "kprojs"
     * const tx = "e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080"; // raw tx to sign
     * const resp = await eth.signTransaction("44'/60'/0'/0/0", tx);
     * console.log(resp);
     */
    Eth.prototype.signTransaction = function (path, rawTxHex) {
        return __awaiter(this, void 0, void 0, function () {
            var rawTx, _a, vrsOffset, txType, chainId, chainIdTruncated, paths, response, offset, _loop_1, this_1, response_byte, v, oneByteChainId, ecc_parity, r, s;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        rawTx = Buffer.from(rawTxHex, "hex");
                        _a = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.decodeTxInfo)(rawTx), vrsOffset = _a.vrsOffset, txType = _a.txType, chainId = _a.chainId, chainIdTruncated = _a.chainIdTruncated;
                        paths = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.splitPath)(path);
                        offset = 0;
                        _loop_1 = function () {
                            var first, maxChunkSize, chunkSize, buffer;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        first = offset === 0;
                                        maxChunkSize = first ? 150 - 1 - paths.length * 4 : 150;
                                        chunkSize = offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize;
                                        if (vrsOffset != 0 && offset + chunkSize >= vrsOffset) {
                                            // Make sure that the chunk doesn't end right on the EIP 155 marker if set
                                            chunkSize = rawTx.length - offset;
                                        }
                                        buffer = Buffer.alloc(first ? 1 + paths.length * 4 + chunkSize : chunkSize);
                                        if (first) {
                                            buffer[0] = paths.length;
                                            paths.forEach(function (element, index) {
                                                buffer.writeUInt32BE(element, 1 + 4 * index);
                                            });
                                            rawTx.copy(buffer, 1 + 4 * paths.length, offset, offset + chunkSize);
                                        }
                                        else {
                                            rawTx.copy(buffer, 0, offset, offset + chunkSize);
                                        }
                                        return [4 /*yield*/, this_1.transport.send(0xe0, 0x04, first ? 0x00 : 0x80, 0x00, buffer).catch(function (e) {
                                                throw remapTransactionRelatedErrors(e);
                                            })];
                                    case 1:
                                        response = _c.sent();
                                        offset += chunkSize;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _b.label = 1;
                    case 1:
                        if (!(offset !== rawTx.length)) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_1()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        response_byte = response[0];
                        v = "";
                        if (chainId.times(2).plus(35).plus(1).isGreaterThan(255)) {
                            oneByteChainId = (chainIdTruncated * 2 + 35) % 256;
                            ecc_parity = Math.abs(response_byte - oneByteChainId);
                            if (txType != null) {
                                // For EIP2930 and EIP1559 tx, v is simply the parity.
                                v = ecc_parity % 2 == 1 ? "00" : "01";
                            }
                            else {
                                // Legacy type transaction with a big chain ID
                                v = chainId.times(2).plus(35).plus(ecc_parity).toString(16);
                            }
                        }
                        else {
                            v = response_byte.toString(16);
                        }
                        // Make sure v is prefixed with a 0 if its length is odd ("1" -> "01").
                        if (v.length % 2 == 1) {
                            v = "0" + v;
                        }
                        r = response.slice(1, 1 + 32).toString("hex");
                        s = response.slice(1 + 32, 1 + 32 + 32).toString("hex");
                        return [2 /*return*/, { v: v, r: r, s: s }];
                }
            });
        });
    };
    /**
     */
    Eth.prototype.getAppConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, fwVersion, erc20Version, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.transport.send(0xe0, 0x06, 0x00, 0x00)];
                    case 1:
                        response = _a.sent();
                        fwVersion = String(response[0]) + "." + String(response[1]) + "." + String(response[2]);
                        erc20Version = (response[3] << 24) | (response[4] << 16) | (response[5] << 8) | response[6];
                        return [2 /*return*/, { fwVersion: fwVersion, erc20Version: erc20Version }];
                    case 2:
                        error_2 = _a.sent();
                        (0,_logs__WEBPACK_IMPORTED_MODULE_0__.log)("error", "Couldn't get app configuration", error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Eth.prototype.sendChunks = function (path, m, cla, ins, p2, enc) {
        return __awaiter(this, void 0, void 0, function () {
            var paths, message, offset, response, _loop_2, this_2, v, r, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paths = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.splitPath)(path);
                        message = Buffer.from(m, enc);
                        offset = 0;
                        _loop_2 = function () {
                            var maxChunkSize, chunkSize, buffer;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        maxChunkSize = offset === 0 ? 255 - 1 - paths.length * 4 - 4 : 255;
                                        chunkSize = offset + maxChunkSize > message.length ? message.length - offset : maxChunkSize;
                                        buffer = Buffer.alloc(offset === 0 ? 1 + paths.length * 4 + 4 + chunkSize : chunkSize);
                                        if (offset === 0) {
                                            buffer[0] = paths.length;
                                            paths.forEach(function (element, index) {
                                                buffer.writeUInt32BE(element, 1 + 4 * index);
                                            });
                                            buffer.writeUInt32BE(message.length, 1 + 4 * paths.length);
                                            message.copy(buffer, 1 + 4 * paths.length + 4, offset, offset + chunkSize);
                                        }
                                        else {
                                            message.copy(buffer, 0, offset, offset + chunkSize);
                                        }
                                        return [4 /*yield*/, this_2.transport.send(cla, ins, offset === 0 ? 0x00 : 0x80, p2, buffer)];
                                    case 1:
                                        response = _b.sent();
                                        offset += chunkSize;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _a.label = 1;
                    case 1:
                        if (!(offset !== message.length)) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_2()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        v = response[0];
                        r = response.subarray(1, 1 + 32).toString("hex");
                        s = response.subarray(1 + 32, 1 + 32 + 32).toString("hex");
                        return [2 /*return*/, { v: v, r: r, s: s }];
                }
            });
        });
    };
    /**
    * You can sign a message according to eth_sign RPC call and retrieve v, r, s given the message and the BIP 32 path of the account to sign.
    * @example
    * const resp = await eth.signPersonalMessage("44'/60'/0'/0/0", Buffer.from("test").toString("hex");
    * let v = resp['v'] - 27;
    * v = v.toString(16);
    * if (v.length < 2) {
    *   v = "0" + v;
    * }
    * console.log("Signature 0x" + resp['r'] + resp['s'] + v);
     */
    Eth.prototype.signPersonalMessage = function (path, pMessage, enc) {
        if (enc === void 0) { enc = "utf-8"; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendChunks(path, pMessage, 0xe0, 0x08, 0x00, enc)];
            });
        });
    };
    /**
     * Sign an EIP-721 formatted message following the specification here:
     * https://github.com/KProHQ/app-ethereum/blob/develop/doc/ethapp.asc#sign-eth-eip-712
     * ⚠️ This method is not compatible with nano S (LNS). Make sure to use a try/catch to fallback on the signEIP712HashedMessage method ⚠️
     @example
     * const resp = await eth.signEIP721Message("44'/60'/0'/0/0", {
     *   domain: {
     *     chainId: 69,
     *     name: "Da Domain",
     *     verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
     *     version: "1"
     *   },
     *   types: {
     *     "EIP712Domain": [
     *           { name: "name", type: "string" },
     *           { name: "version", type: "string" },
     *           { name: "chainId", type: "uint256" },
     *           { name: "verifyingContract", type: "address" }
     *       ],
     *     "Test": [
     *       { name: "contents", type: "string" }
     *     ]
     *   },
     *   primaryType: "Test",
     *   message: {contents: "Hello, Bob!"},
     * });
     *
     * @param {String} path derivationPath
     * @param {Object} jsonMessage message to sign
     * @param {Boolean} fullImplem use the legacy implementation
     * @returns {Promise}
     */
    Eth.prototype.signEIP712Message = function (path, jsonMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var messageStr, APDU_FIELDS;
            return __generator(this, function (_a) {
                messageStr = JSON.stringify(jsonMessage);
                (function (APDU_FIELDS) {
                    APDU_FIELDS[APDU_FIELDS["CLA"] = 224] = "CLA";
                    APDU_FIELDS[APDU_FIELDS["INS"] = 12] = "INS";
                    APDU_FIELDS[APDU_FIELDS["P1"] = 0] = "P1";
                    APDU_FIELDS[APDU_FIELDS["P2"] = 1] = "P2";
                })(APDU_FIELDS || (APDU_FIELDS = {}));
                return [2 /*return*/, this.sendChunks(path, messageStr, APDU_FIELDS.CLA, APDU_FIELDS.INS, APDU_FIELDS.P2, "utf-8")];
            });
        });
    };
    Eth.prototype.load = function (data, ins) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, response, APDU_FIELDS, maxChunkSize, chunkSize, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offset = 0;
                        (function (APDU_FIELDS) {
                            APDU_FIELDS[APDU_FIELDS["CLA"] = 224] = "CLA";
                            APDU_FIELDS[APDU_FIELDS["INS"] = ins] = "INS";
                            APDU_FIELDS[APDU_FIELDS["P2"] = 0] = "P2";
                        })(APDU_FIELDS || (APDU_FIELDS = {}));
                        _a.label = 1;
                    case 1:
                        if (!(offset !== data.length)) return [3 /*break*/, 3];
                        maxChunkSize = offset === 0 ? 244 - 4 : 240;
                        chunkSize = offset + maxChunkSize > data.length ? data.length - offset : maxChunkSize;
                        buffer = Buffer.alloc(offset === 0 ? 4 + chunkSize : chunkSize);
                        if (offset === 0) {
                            buffer.writeUInt32BE(data.length, 0);
                            data.copy(buffer, 4, offset, offset + chunkSize);
                        }
                        else {
                            data.copy(buffer, 0, offset, offset + chunkSize);
                        }
                        return [4 /*yield*/, this.transport.send(APDU_FIELDS.CLA, APDU_FIELDS.INS, offset === 0 ? 0x00 : 0x80, APDU_FIELDS.P2, buffer)];
                    case 2:
                        response = _a.sent();
                        this.transport.emit("chunk-loaded", chunkSize);
                        offset += chunkSize;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, (response[0] << 8) | response[1]];
                }
            });
        });
    };
    /**
    * You can load a firmware
    * @example
    *
    * @param {String} fw firmware
    * @returns {Promise}
    */
    Eth.prototype.loadFirmware = function (fw) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load(Buffer.from(fw), 0xf2)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
    * You can load a ERC20 and Chain DB
    * @example
    *
    * @param {String} db database
    * @returns {Promise}
    */
    Eth.prototype.loadERC20DB = function (db) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load(Buffer.from(db), 0xf4)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Eth;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Eth);
//# sourceMappingURL=eth.js.map

/***/ }),

/***/ "./node_modules/kprojs/lib-es/hid-framing.js":
/*!***************************************************!*\
  !*** ./node_modules/kprojs/lib-es/hid-framing.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hidFraming: () => (/* binding */ hidFraming),
/* harmony export */   kproUSBVendorId: () => (/* binding */ kproUSBVendorId)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./node_modules/kprojs/lib-es/errors.js");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/

var Tag = 0x05;
var kproUSBVendorId = 0x1209;
var asUInt16BE = function (value) {
    var b = Buffer.alloc(2);
    b.writeUInt16BE(value, 0);
    return b;
};
var initialAcc = {
    data: Buffer.alloc(0),
    dataLength: 0,
    sequence: 0
};
/**
 *
 */
var hidFraming = function (channel, packetSize) {
    return {
        makeBlocks: function (apdu) {
            var data = Buffer.concat([asUInt16BE(apdu.length), apdu]);
            var blockSize = packetSize - 5;
            var nbBlocks = Math.ceil(data.length / blockSize);
            data = Buffer.concat([
                data,
                Buffer.alloc(nbBlocks * blockSize - data.length + 1).fill(0),
            ]);
            var blocks = [];
            for (var i = 0; i < nbBlocks; i++) {
                var head = Buffer.alloc(5);
                head.writeUInt16BE(channel, 0);
                head.writeUInt8(Tag, 2);
                head.writeUInt16BE(i, 3);
                var chunk = data.subarray(i * blockSize, (i + 1) * blockSize);
                blocks.push(Buffer.concat([head, chunk]));
            }
            return blocks;
        },
        reduceResponse: function (acc, chunk) {
            var _a = acc || initialAcc, data = _a.data, dataLength = _a.dataLength, sequence = _a.sequence;
            if (chunk.readUInt16BE(0) !== channel) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TransportError("Invalid channel", "InvalidChannel");
            }
            if (chunk.readUInt8(2) !== Tag) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TransportError("Invalid tag", "InvalidTag");
            }
            if (chunk.readUInt16BE(3) !== sequence) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_0__.TransportError("Invalid sequence", "InvalidSequence");
            }
            if (!acc) {
                dataLength = chunk.readUInt16BE(5);
            }
            sequence++;
            var chunkData = chunk.subarray(acc ? 5 : 7);
            data = Buffer.concat([data, chunkData]);
            if (data.length > dataLength) {
                data = data.subarray(0, dataLength);
            }
            return {
                data: data,
                dataLength: dataLength,
                sequence: sequence
            };
        },
        getReducedResult: function (acc) {
            if (acc && acc.dataLength === acc.data.length) {
                return acc.data;
            }
        },
    };
};
//# sourceMappingURL=hid-framing.js.map

/***/ }),

/***/ "./node_modules/kprojs/lib-es/index.js":
/*!*********************************************!*\
  !*** ./node_modules/kprojs/lib-es/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KProJS: () => (/* binding */ KProJS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eth */ "./node_modules/kprojs/lib-es/eth.js");
/* harmony import */ var _transport__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transport */ "./node_modules/kprojs/lib-es/transport.js");
/* harmony import */ var _device__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./device */ "./node_modules/kprojs/lib-es/device.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./errors */ "./node_modules/kprojs/lib-es/errors.js");
/* harmony import */ var _error_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./error-helpers */ "./node_modules/kprojs/lib-es/error-helpers.js");
/* harmony import */ var _hid_framing__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hid-framing */ "./node_modules/kprojs/lib-es/hid-framing.js");
/* harmony import */ var _logs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./logs */ "./node_modules/kprojs/lib-es/logs.js");
/* harmony import */ var _promise__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./promise */ "./node_modules/kprojs/lib-es/promise.js");








var KProJS = {
    Eth: _eth__WEBPACK_IMPORTED_MODULE_0__["default"],
    KProDevice: _device__WEBPACK_IMPORTED_MODULE_2__.KProDevice,
    KProError: _errors__WEBPACK_IMPORTED_MODULE_3__,
    KProErrorHelpers: _error_helpers__WEBPACK_IMPORTED_MODULE_4__,
    HIDFraming: _hid_framing__WEBPACK_IMPORTED_MODULE_5__,
    KProLogs: _logs__WEBPACK_IMPORTED_MODULE_6__,
    KProPromise: _promise__WEBPACK_IMPORTED_MODULE_7__,
    Transport: _transport__WEBPACK_IMPORTED_MODULE_1__["default"],
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KProJS);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/kprojs/lib-es/logs.js":
/*!********************************************!*\
  !*** ./node_modules/kprojs/lib-es/logs.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   listen: () => (/* binding */ listen),
/* harmony export */   log: () => (/* binding */ log)
/* harmony export */ });
/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/
var id = 0;
var subscribers = [];
/**
 * log something
 * @param type a namespaced identifier of the log (it is not a level like "debug", "error" but more like "apdu-in", "apdu-out", etc...)
 * @param message a clear message of the log associated to the type
 */
var log = function (type, message, data) {
    var obj = {
        type: type,
        id: String(++id),
        date: new Date(),
    };
    if (message)
        obj.message = message;
    if (data)
        obj.data = data;
    dispatch(obj);
};
/**
 * listen to logs.
 * @param cb that is called for each future log() with the Log object
 * @return a function that can be called to unsubscribe the listener
 */
var listen = function (cb) {
    subscribers.push(cb);
    return function () {
        var i = subscribers.indexOf(cb);
        if (i !== -1) {
            // equivalent of subscribers.splice(i, 1) // https://twitter.com/Rich_Harris/status/1125850391155965952
            subscribers[i] = subscribers[subscribers.length - 1];
            subscribers.pop();
        }
    };
};
var dispatch = function (log) {
    for (var i = 0; i < subscribers.length; i++) {
        try {
            subscribers[i](log);
        }
        catch (e) {
            console.error(e);
        }
    }
};
if (typeof window !== "undefined") {
    window.__kproLogsListen = listen;
}
//# sourceMappingURL=logs.js.map

/***/ }),

/***/ "./node_modules/kprojs/lib-es/promise.js":
/*!***********************************************!*\
  !*** ./node_modules/kprojs/lib-es/promise.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   atomicQueue: () => (/* binding */ atomicQueue),
/* harmony export */   delay: () => (/* binding */ delay),
/* harmony export */   execAndWaitAtLeast: () => (/* binding */ execAndWaitAtLeast),
/* harmony export */   promiseAllBatched: () => (/* binding */ promiseAllBatched),
/* harmony export */   retry: () => (/* binding */ retry)
/* harmony export */ });
/* harmony import */ var _logs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logs */ "./node_modules/kprojs/lib-es/logs.js");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/

var delay = function (ms) { return new Promise(function (f) { return setTimeout(f, ms); }); };
var defaults = {
    maxRetry: 4,
    interval: 300,
    intervalMultiplicator: 1.5,
    context: "",
};
var retry = function (f, options) {
    var _a = __assign(__assign({}, defaults), options), maxRetry = _a.maxRetry, interval = _a.interval, intervalMultiplicator = _a.intervalMultiplicator, context = _a.context;
    var rec = function (remainingTry, i) {
        var result = f();
        if (remainingTry <= 0) {
            return result;
        }
        // In case of failure, wait the interval, retry the action
        return result.catch(function (e) {
            (0,_logs__WEBPACK_IMPORTED_MODULE_0__.log)("promise-retry", context + " failed. " + remainingTry + " retry remain. " + String(e));
            return delay(i).then(function () { return rec(remainingTry - 1, i * intervalMultiplicator); });
        });
    };
    return rec(maxRetry, interval);
};
var atomicQueue = function (job, queueIdentifier) {
    if (queueIdentifier === void 0) { queueIdentifier = function () { return ""; }; }
    var queues = {};
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var id = queueIdentifier.apply(void 0, __spreadArray([], __read(args), false));
        var queue = queues[id] || Promise.resolve();
        var p = queue.then(function () { return job.apply(void 0, __spreadArray([], __read(args), false)); });
        queues[id] = p.catch(function () { });
        return p;
    };
};
var execAndWaitAtLeast = function (ms, cb) {
    var startTime = Date.now();
    return cb().then(function (r) {
        var remaining = ms - (Date.now() - startTime);
        if (remaining <= 0)
            return r;
        return delay(remaining).then(function () { return r; });
    });
};
/**
 * promiseAllBatched(n, items, i => f(i))
 * is essentially like
 * Promise.all(items.map(i => f(i)))
 * but with a guarantee that it will not create more than n concurrent call to f
 * where f is a function that returns a promise
 */
function promiseAllBatched(batch, items, fn) {
    return __awaiter(this, void 0, void 0, function () {
        function step() {
            return __awaiter(this, void 0, void 0, function () {
                var first, item, index, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (queue.length === 0)
                                return [2 /*return*/];
                            first = queue.shift();
                            if (!first) return [3 /*break*/, 2];
                            item = first.item, index = first.index;
                            _a = data;
                            _b = index;
                            return [4 /*yield*/, fn(item, index)];
                        case 1:
                            _a[_b] = _c.sent();
                            _c.label = 2;
                        case 2: return [4 /*yield*/, step()];
                        case 3:
                            _c.sent(); // each time an item redeem, we schedule another one
                            return [2 /*return*/];
                    }
                });
            });
        }
        var data, queue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = Array(items.length);
                    queue = items.map(function (item, index) { return ({
                        item: item,
                        index: index,
                    }); });
                    // initially, we schedule <batch> items in parallel
                    return [4 /*yield*/, Promise.all(Array(Math.min(batch, items.length)).fill(function () { return undefined; }).map(step))];
                case 1:
                    // initially, we schedule <batch> items in parallel
                    _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
//# sourceMappingURL=promise.js.map

/***/ }),

/***/ "./node_modules/kprojs/lib-es/transport.js":
/*!*************************************************!*\
  !*** ./node_modules/kprojs/lib-es/transport.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatusCodes: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_1__.StatusCodes),
/* harmony export */   TransportError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_1__.TransportError),
/* harmony export */   TransportStatusError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_1__.TransportStatusError),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getAltStatusMessage: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_1__.getAltStatusMessage)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors */ "./node_modules/kprojs/lib-es/errors.js");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/



/**
 * The Transport class defines a generic interface for communicating with a KPro hardware wallet.
 * There are different kind of transports based on the technology (channels like U2F, HID, Bluetooth, Webusb) and environment (Node, Web,...).
 * It is an abstract class that needs to be implemented.
 */
var Transport = /** @class */ (function () {
    function Transport() {
        var _this = this;
        this.exchangeTimeout = 30000;
        this.unresponsiveTimeout = 15000;
        this._events = new (events__WEBPACK_IMPORTED_MODULE_0___default())();
        /**
         * Send data to the device using the higher level API.
         * @param {number} cla - The instruction class for the command.
         * @param {number} ins - The instruction code for the command.
         * @param {number} p1 - The first parameter for the instruction.
         * @param {number} p2 - The second parameter for the instruction.
         * @param {Buffer} data - The data to be sent. Defaults to an empty buffer.
         * @param {Array<number>} statusList - A list of acceptable status codes for the response. Defaults to [StatusCodes.OK].
         * @returns {Promise<Buffer>} A promise that resolves with the response data from the device.
         */
        this.send = function (cla, ins, p1, p2, data, statusList) {
            if (data === void 0) { data = Buffer.alloc(0); }
            if (statusList === void 0) { statusList = [_errors__WEBPACK_IMPORTED_MODULE_1__.StatusCodes.OK]; }
            return __awaiter(_this, void 0, void 0, function () {
                var response, sw;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (data.length >= 256) {
                                throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TransportError("data.length exceed 256 bytes limit. Got: " + data.length, "DataLengthTooBig");
                            }
                            return [4 /*yield*/, this.exchange(Buffer.concat([Buffer.from([cla, ins, p1, p2]), Buffer.from([data.length]), data]))];
                        case 1:
                            response = _a.sent();
                            sw = response.readUInt16BE(response.length - 2);
                            if (!statusList.some(function (s) { return s === sw; })) {
                                throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TransportStatusError(sw);
                            }
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        this.exchangeAtomicImpl = function (f) { return __awaiter(_this, void 0, void 0, function () {
            var resolveBusy, busyPromise, unresponsiveReached, timeout, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.exchangeBusyPromise) {
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TransportRaceCondition("An action was already pending on the KPro device. Please deny or reconnect.");
                        }
                        busyPromise = new Promise(function (r) {
                            resolveBusy = r;
                        });
                        this.exchangeBusyPromise = busyPromise;
                        unresponsiveReached = false;
                        timeout = setTimeout(function () {
                            unresponsiveReached = true;
                            _this.emit("unresponsive");
                        }, this.unresponsiveTimeout);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, f()];
                    case 2:
                        res = _a.sent();
                        if (unresponsiveReached) {
                            this.emit("responsive");
                        }
                        return [2 /*return*/, res];
                    case 3:
                        clearTimeout(timeout);
                        if (resolveBusy)
                            resolveBusy();
                        this.exchangeBusyPromise = null;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    /**
     * Send data to the device using a low level API.
     * It's recommended to use the "send" method for a higher level API.
     * @param {Buffer} apdu - The data to send.
     * @returns {Promise<Buffer>} A promise that resolves with the response data from the device.
     */
    Transport.prototype.exchange = function (_apdu) {
        throw new Error("exchange not implemented");
    };
    /**
     * Send apdus in batch to the device using a low level API.
     * The default implementation is to call exchange for each apdu.
     * @param {Array<Buffer>} apdus - array of apdus to send.
     * @param {Observer<Buffer>} observer - an observer that will receive the response of each apdu.
     * @returns {Subscription} A Subscription object on which you can call ".unsubscribe()" to stop sending apdus.
     */
    Transport.prototype.exchangeBulk = function (apdus, observer) {
        var _this = this;
        var unsubscribed = false;
        var unsubscribe = function () {
            unsubscribed = true;
        };
        var main = function () { return __awaiter(_this, void 0, void 0, function () {
            var apdus_1, apdus_1_1, apdu, r, status_1, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (unsubscribed)
                            return [2 /*return*/];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        apdus_1 = __values(apdus), apdus_1_1 = apdus_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!apdus_1_1.done) return [3 /*break*/, 5];
                        apdu = apdus_1_1.value;
                        return [4 /*yield*/, this.exchange(apdu)];
                    case 3:
                        r = _b.sent();
                        if (unsubscribed)
                            return [2 /*return*/];
                        status_1 = r.readUInt16BE(r.length - 2);
                        if (status_1 !== _errors__WEBPACK_IMPORTED_MODULE_1__.StatusCodes.OK) {
                            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.TransportStatusError(status_1);
                        }
                        observer.next(r);
                        _b.label = 4;
                    case 4:
                        apdus_1_1 = apdus_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (apdus_1_1 && !apdus_1_1.done && (_a = apdus_1.return)) _a.call(apdus_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        main().then(function () { return !unsubscribed && observer.complete(); }, function (e) { return !unsubscribed && observer.error(e); });
        return { unsubscribe: unsubscribe };
    };
    /**
     * Close the connection with the device.
     * @returns {Promise<void>} A promise that resolves when the transport is closed.
     */
    Transport.prototype.close = function () {
        return Promise.resolve();
    };
    /**
     * Listen for an event on the transport instance.
     * Transport implementations may have specific events. Common events include:
     * "disconnect" : triggered when the transport is disconnected.
     * @param {string} eventName - The name of the event to listen for.
     * @param {(...args: Array<any>) => any} cb - The callback function to be invoked when the event occurs.
     */
    Transport.prototype.on = function (eventName, cb) {
        this._events.on(eventName, cb);
    };
    /**
     * Stop listening to an event on an instance of transport.
     */
    Transport.prototype.off = function (eventName, cb) {
        this._events.removeListener(eventName, cb);
    };
    Transport.prototype.emit = function (event) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this._events).emit.apply(_a, __spreadArray([event], __read(args), false));
    };
    /**
     * Set a timeout (in milliseconds) for the exchange call. Only some transport might implement it. (e.g. U2F)
     */
    Transport.prototype.setExchangeTimeout = function (exchangeTimeout) {
        this.exchangeTimeout = exchangeTimeout;
    };
    /**
     * Define the delay before emitting "unresponsive" on an exchange that does not respond
     */
    Transport.prototype.setExchangeUnresponsiveTimeout = function (unresponsiveTimeout) {
        this.unresponsiveTimeout = unresponsiveTimeout;
    };
    /**
     * create() allows to open the first descriptor available or
     * throw if there is none or if timeout is reached.
     * This is a light helper, alternative to using listen() and open() (that you may need for any more advanced usecase)
     * @example
    TransportFoo.create().then(transport => ...)
     */
    Transport.create = function (openTimeout, listenTimeout) {
        var _this = this;
        if (openTimeout === void 0) { openTimeout = 3000; }
        return new Promise(function (resolve, reject) {
            var found = false;
            var sub = _this.listen({
                next: function (e) {
                    found = true;
                    if (sub)
                        sub.unsubscribe();
                    if (listenTimeoutId)
                        clearTimeout(listenTimeoutId);
                    _this.open(e.descriptor, openTimeout).then(resolve, reject);
                },
                error: function (e) {
                    if (listenTimeoutId)
                        clearTimeout(listenTimeoutId);
                    reject(e);
                },
                complete: function () {
                    if (listenTimeoutId)
                        clearTimeout(listenTimeoutId);
                    if (!found) {
                        reject(new _errors__WEBPACK_IMPORTED_MODULE_1__.TransportError(_this.ErrorMessage_NoDeviceFound, "NoDeviceFound"));
                    }
                },
            });
            var listenTimeoutId = listenTimeout
                ? setTimeout(function () {
                    sub.unsubscribe();
                    reject(new _errors__WEBPACK_IMPORTED_MODULE_1__.TransportError(_this.ErrorMessage_ListenTimeout, "ListenTimeout"));
                }, listenTimeout)
                : null;
        });
    };
    Transport.ErrorMessage_ListenTimeout = "No KPro device found (timeout)";
    Transport.ErrorMessage_NoDeviceFound = "No KPro device found";
    return Transport;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Transport);
//# sourceMappingURL=transport.js.map

/***/ }),

/***/ "./node_modules/kprojs/lib-es/utils.js":
/*!*********************************************!*\
  !*** ./node_modules/kprojs/lib-es/utils.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ERC1155_CLEAR_SIGNED_SELECTORS: () => (/* binding */ ERC1155_CLEAR_SIGNED_SELECTORS),
/* harmony export */   ERC20_CLEAR_SIGNED_SELECTORS: () => (/* binding */ ERC20_CLEAR_SIGNED_SELECTORS),
/* harmony export */   ERC721_CLEAR_SIGNED_SELECTORS: () => (/* binding */ ERC721_CLEAR_SIGNED_SELECTORS),
/* harmony export */   decodeTxInfo: () => (/* binding */ decodeTxInfo),
/* harmony export */   hexBuffer: () => (/* binding */ hexBuffer),
/* harmony export */   intAsHexBytes: () => (/* binding */ intAsHexBytes),
/* harmony export */   maybeHexBuffer: () => (/* binding */ maybeHexBuffer),
/* harmony export */   nftSelectors: () => (/* binding */ nftSelectors),
/* harmony export */   splitPath: () => (/* binding */ splitPath),
/* harmony export */   tokenSelectors: () => (/* binding */ tokenSelectors)
/* harmony export */ });
/* harmony import */ var _ethersproject_rlp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ethersproject/rlp */ "./node_modules/@ethersproject/rlp/lib/index.js");
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.mjs");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/


var splitPath = function (path) {
    var result = [];
    var components = path.split("/");
    components.forEach(function (element) {
        var number = parseInt(element, 10);
        if (isNaN(number)) {
            return; // FIXME shouldn't it throws instead?
        }
        if (element.length > 1 && element[element.length - 1] === "'") {
            number += 0x80000000;
        }
        result.push(number);
    });
    return result;
};
var hexBuffer = function (str) {
    return Buffer.from(str.startsWith("0x") ? str.slice(2) : str, "hex");
};
var maybeHexBuffer = function (str) {
    if (!str)
        return null;
    return hexBuffer(str);
};
var decodeTxInfo = function (rawTx) {
    var VALID_TYPES = [1, 2];
    var txType = VALID_TYPES.includes(rawTx[0]) ? rawTx[0] : null;
    var rlpData = txType === null ? rawTx : rawTx.subarray(1);
    var rlpTx = (0,_ethersproject_rlp__WEBPACK_IMPORTED_MODULE_1__.decode)(rlpData).map(function (hex) { return Buffer.from(hex.slice(2), "hex"); });
    var chainIdTruncated = 0;
    var rlpDecoded = (0,_ethersproject_rlp__WEBPACK_IMPORTED_MODULE_1__.decode)(rlpData);
    var decodedTx;
    if (txType === 2) {
        // EIP1559
        decodedTx = {
            data: rlpDecoded[7],
            to: rlpDecoded[5],
            chainId: rlpTx[0],
        };
    }
    else if (txType === 1) {
        // EIP2930
        decodedTx = {
            data: rlpDecoded[6],
            to: rlpDecoded[4],
            chainId: rlpTx[0],
        };
    }
    else {
        // Legacy tx
        decodedTx = {
            data: rlpDecoded[5],
            to: rlpDecoded[3],
            // Default to 1 for non EIP 155 txs
            chainId: rlpTx.length > 6 ? rlpTx[6] : Buffer.from("0x01", "hex"),
        };
    }
    var chainIdSrc = decodedTx.chainId;
    var chainId = new bignumber_js__WEBPACK_IMPORTED_MODULE_0__.BigNumber(0);
    if (chainIdSrc) {
        // Using BigNumber because chainID could be any uint256.
        chainId = new bignumber_js__WEBPACK_IMPORTED_MODULE_0__.BigNumber(chainIdSrc.toString("hex"), 16);
        var chainIdTruncatedBuf = Buffer.alloc(4);
        if (chainIdSrc.length > 4) {
            chainIdSrc.copy(chainIdTruncatedBuf);
        }
        else {
            chainIdSrc.copy(chainIdTruncatedBuf, 4 - chainIdSrc.length);
        }
        chainIdTruncated = chainIdTruncatedBuf.readUInt32BE(0);
    }
    var vrsOffset = 0;
    if (txType === null && rlpTx.length > 6) {
        var rlpVrs = Buffer.from((0,_ethersproject_rlp__WEBPACK_IMPORTED_MODULE_1__.encode)(rlpTx.slice(-3)).slice(2), "hex");
        vrsOffset = rawTx.length - (rlpVrs.length - 1);
        // First byte > 0xf7 means the length of the list length doesn't fit in a single byte.
        if (rlpVrs[0] > 0xf7) {
            // Increment vrsOffset to account for that extra byte.
            vrsOffset++;
            // Compute size of the list length.
            var sizeOfListLen = rlpVrs[0] - 0xf7;
            // Increase rlpOffset by the size of the list length.
            vrsOffset += sizeOfListLen - 1;
        }
    }
    return {
        decodedTx: decodedTx,
        txType: txType,
        chainId: chainId,
        chainIdTruncated: chainIdTruncated,
        vrsOffset: vrsOffset,
    };
};
/**
 * @ignore for the README
 *
 * Helper to convert an integer as a hexadecimal string with the right amount of digits
 * to respect the number of bytes given as parameter
 *
 * @param int Integer
 * @param bytes Number of bytes it should be represented as (1 byte = 2 caraters)
 * @returns The given integer as an hexa string padded with the right number of 0
 */
var intAsHexBytes = function (int, bytes) {
    return int.toString(16).padStart(2 * bytes, "0");
};
/**
 * @ignore for the README
 *
 * List of selectors (hexadecimal representation of the used method's signature) related to
 * ERC20 (Tokens), ERC721/ERC1155 (NFT).
 * You can verify and/or get more info about them on http://4byte.directory
 */
var ERC20_CLEAR_SIGNED_SELECTORS;
(function (ERC20_CLEAR_SIGNED_SELECTORS) {
    ERC20_CLEAR_SIGNED_SELECTORS["APPROVE"] = "0x095ea7b3";
    ERC20_CLEAR_SIGNED_SELECTORS["TRANSFER"] = "0xa9059cbb";
})(ERC20_CLEAR_SIGNED_SELECTORS || (ERC20_CLEAR_SIGNED_SELECTORS = {}));
var ERC721_CLEAR_SIGNED_SELECTORS;
(function (ERC721_CLEAR_SIGNED_SELECTORS) {
    ERC721_CLEAR_SIGNED_SELECTORS["APPROVE"] = "0x095ea7b3";
    ERC721_CLEAR_SIGNED_SELECTORS["SET_APPROVAL_FOR_ALL"] = "0xa22cb465";
    ERC721_CLEAR_SIGNED_SELECTORS["TRANSFER_FROM"] = "0x23b872dd";
    ERC721_CLEAR_SIGNED_SELECTORS["SAFE_TRANSFER_FROM"] = "0x42842e0e";
    ERC721_CLEAR_SIGNED_SELECTORS["SAFE_TRANSFER_FROM_WITH_DATA"] = "0xb88d4fde";
})(ERC721_CLEAR_SIGNED_SELECTORS || (ERC721_CLEAR_SIGNED_SELECTORS = {}));
var ERC1155_CLEAR_SIGNED_SELECTORS;
(function (ERC1155_CLEAR_SIGNED_SELECTORS) {
    ERC1155_CLEAR_SIGNED_SELECTORS["SET_APPROVAL_FOR_ALL"] = "0xa22cb465";
    ERC1155_CLEAR_SIGNED_SELECTORS["SAFE_TRANSFER_FROM"] = "0xf242432a";
    ERC1155_CLEAR_SIGNED_SELECTORS["SAFE_BATCH_TRANSFER_FROM"] = "0x2eb2c2d6";
})(ERC1155_CLEAR_SIGNED_SELECTORS || (ERC1155_CLEAR_SIGNED_SELECTORS = {}));
var tokenSelectors = Object.values(ERC20_CLEAR_SIGNED_SELECTORS);
var nftSelectors = __spreadArray(__spreadArray([], __read(Object.values(ERC721_CLEAR_SIGNED_SELECTORS)), false), __read(Object.values(ERC1155_CLEAR_SIGNED_SELECTORS)), false);
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./assets/javascript/firmware.ts":
/*!***************************************!*\
  !*** ./assets/javascript/firmware.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var kprojs_1 = __webpack_require__(/*! kprojs */ "./node_modules/kprojs/lib-es/index.js");
var kprojs_web_hid_1 = __webpack_require__(/*! kprojs-web-hid */ "./node_modules/kprojs-web-hid/lib-es/transport-web-hid.js");
if (!('process' in window)) {
    // @ts-ignore
    window.process = {};
}
function handleFirmwareUpdate() {
    return __awaiter(this, void 0, Promise, function () {
        function handleFWLoadProgress(transport, loadBar) {
            if (fwI == 0) {
                fwI = 1;
                var pBarProgress_1 = 0;
                transport.on("chunk-loaded", function (progress) {
                    if (progress >= loadBar.max) {
                        transport.off("chunk-loaded");
                        i = 0;
                    }
                    else {
                        pBarProgress_1 += progress;
                        loadBar.value = pBarProgress_1;
                    }
                });
            }
        }
        var updateFirmwareBtn, progressBar, fwLoad, mediaPrefixField, mediaPrefix, context, fw, changelog, transport, appEth, fwI;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updateFirmwareBtn = document.getElementById("btn-fw-update");
                    progressBar = document.getElementById("fw-progress");
                    fwLoad = document.getElementById("progress-bar");
                    mediaPrefixField = document.getElementById("media-prefix");
                    mediaPrefix = mediaPrefixField.value;
                    return [4 /*yield*/, fetch("./context").then(function (r) { return r.json(); })];
                case 1:
                    context = _a.sent();
                    return [4 /*yield*/, fetch(mediaPrefix + context["fw_path"]).then(function (r) { return r.arrayBuffer(); })];
                case 2:
                    fw = _a.sent();
                    return [4 /*yield*/, fetch(mediaPrefix + context["changelog_path"]).then(function (r) { return r.text(); })];
                case 3:
                    changelog = _a.sent();
                    fwLoad.max = fw.byteLength;
                    fwI = 0;
                    updateFirmwareBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                        var r, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    progressBar.classList.remove("kpro_web__display-none");
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 6]);
                                    return [4 /*yield*/, kprojs_web_hid_1.default.create()];
                                case 2:
                                    transport = _a.sent();
                                    appEth = new kprojs_1.default.Eth(transport);
                                    handleFWLoadProgress(transport, fwLoad);
                                    return [4 /*yield*/, appEth.loadFirmware(fw)];
                                case 3:
                                    r = _a.sent();
                                    console.log(r);
                                    return [4 /*yield*/, transport.close()];
                                case 4:
                                    _a.sent();
                                    progressBar.classList.add("kpro_web__display-none");
                                    return [3 /*break*/, 6];
                                case 5:
                                    e_1 = _a.sent();
                                    console.log(e_1);
                                    progressBar.classList.add("kpro_web__display-none");
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
handleFirmwareUpdate();


/***/ }),

/***/ "./node_modules/bignumber.js/bignumber.mjs":
/*!*************************************************!*\
  !*** ./node_modules/bignumber.js/bignumber.mjs ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BigNumber: () => (/* binding */ BigNumber),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 *      bignumber.js v9.1.2
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */


var
  isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
  mathceil = Math.ceil,
  mathfloor = Math.floor,

  bignumberError = '[BigNumber Error] ',
  tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

  BASE = 1e14,
  LOG_BASE = 14,
  MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
  // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
  POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
  SQRT_BASE = 1e7,

  // EDITABLE
  // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
  // the arguments to toExponential, toFixed, toFormat, and toPrecision.
  MAX = 1E9;                                   // 0 to MAX_INT32


/*
 * Create and return a BigNumber constructor.
 */
function clone(configObject) {
  var div, convertBase, parseNumeric,
    P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
    ONE = new BigNumber(1),


    //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


    // The default values below must be integers within the inclusive ranges stated.
    // The values can also be changed at run-time using BigNumber.set.

    // The maximum number of decimal places for operations involving division.
    DECIMAL_PLACES = 20,                     // 0 to MAX

    // The rounding mode used when rounding to the above decimal places, and when using
    // toExponential, toFixed, toFormat and toPrecision, and round (default value).
    // UP         0 Away from zero.
    // DOWN       1 Towards zero.
    // CEIL       2 Towards +Infinity.
    // FLOOR      3 Towards -Infinity.
    // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
    // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
    // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
    // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
    // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
    ROUNDING_MODE = 4,                       // 0 to 8

    // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

    // The exponent value at and beneath which toString returns exponential notation.
    // Number type: -7
    TO_EXP_NEG = -7,                         // 0 to -MAX

    // The exponent value at and above which toString returns exponential notation.
    // Number type: 21
    TO_EXP_POS = 21,                         // 0 to MAX

    // RANGE : [MIN_EXP, MAX_EXP]

    // The minimum exponent value, beneath which underflow to zero occurs.
    // Number type: -324  (5e-324)
    MIN_EXP = -1e7,                          // -1 to -MAX

    // The maximum exponent value, above which overflow to Infinity occurs.
    // Number type:  308  (1.7976931348623157e+308)
    // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
    MAX_EXP = 1e7,                           // 1 to MAX

    // Whether to use cryptographically-secure random number generation, if available.
    CRYPTO = false,                          // true or false

    // The modulo mode used when calculating the modulus: a mod n.
    // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
    // The remainder (r) is calculated as: r = a - n * q.
    //
    // UP        0 The remainder is positive if the dividend is negative, else is negative.
    // DOWN      1 The remainder has the same sign as the dividend.
    //             This modulo mode is commonly known as 'truncated division' and is
    //             equivalent to (a % n) in JavaScript.
    // FLOOR     3 The remainder has the same sign as the divisor (Python %).
    // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
    // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
    //             The remainder is always positive.
    //
    // The truncated division, floored division, Euclidian division and IEEE 754 remainder
    // modes are commonly used for the modulus operation.
    // Although the other rounding modes can also be used, they may not give useful results.
    MODULO_MODE = 1,                         // 0 to 9

    // The maximum number of significant digits of the result of the exponentiatedBy operation.
    // If POW_PRECISION is 0, there will be unlimited significant digits.
    POW_PRECISION = 0,                       // 0 to MAX

    // The format specification used by the BigNumber.prototype.toFormat method.
    FORMAT = {
      prefix: '',
      groupSize: 3,
      secondaryGroupSize: 0,
      groupSeparator: ',',
      decimalSeparator: '.',
      fractionGroupSize: 0,
      fractionGroupSeparator: '\xA0',        // non-breaking space
      suffix: ''
    },

    // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
    // '-', '.', whitespace, or repeated character.
    // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
    ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
    alphabetHasNormalDecimalDigits = true;


  //------------------------------------------------------------------------------------------


  // CONSTRUCTOR


  /*
   * The BigNumber constructor and exported function.
   * Create and return a new instance of a BigNumber object.
   *
   * v {number|string|BigNumber} A numeric value.
   * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
   */
  function BigNumber(v, b) {
    var alphabet, c, caseChanged, e, i, isNum, len, str,
      x = this;

    // Enable constructor call without `new`.
    if (!(x instanceof BigNumber)) return new BigNumber(v, b);

    if (b == null) {

      if (v && v._isBigNumber === true) {
        x.s = v.s;

        if (!v.c || v.e > MAX_EXP) {
          x.c = x.e = null;
        } else if (v.e < MIN_EXP) {
          x.c = [x.e = 0];
        } else {
          x.e = v.e;
          x.c = v.c.slice();
        }

        return;
      }

      if ((isNum = typeof v == 'number') && v * 0 == 0) {

        // Use `1 / n` to handle minus zero also.
        x.s = 1 / v < 0 ? (v = -v, -1) : 1;

        // Fast path for integers, where n < 2147483648 (2**31).
        if (v === ~~v) {
          for (e = 0, i = v; i >= 10; i /= 10, e++);

          if (e > MAX_EXP) {
            x.c = x.e = null;
          } else {
            x.e = e;
            x.c = [v];
          }

          return;
        }

        str = String(v);
      } else {

        if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

        x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
      }

      // Decimal point?
      if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

      // Exponential form?
      if ((i = str.search(/e/i)) > 0) {

        // Determine exponent.
        if (e < 0) e = i;
        e += +str.slice(i + 1);
        str = str.substring(0, i);
      } else if (e < 0) {

        // Integer.
        e = str.length;
      }

    } else {

      // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
      intCheck(b, 2, ALPHABET.length, 'Base');

      // Allow exponential notation to be used with base 10 argument, while
      // also rounding to DECIMAL_PLACES as with other bases.
      if (b == 10 && alphabetHasNormalDecimalDigits) {
        x = new BigNumber(v);
        return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
      }

      str = String(v);

      if (isNum = typeof v == 'number') {

        // Avoid potential interpretation of Infinity and NaN as base 44+ values.
        if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

        x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
          throw Error
           (tooManyDigits + v);
        }
      } else {
        x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
      }

      alphabet = ALPHABET.slice(0, b);
      e = i = 0;

      // Check that str is a valid base b number.
      // Don't use RegExp, so alphabet can contain special characters.
      for (len = str.length; i < len; i++) {
        if (alphabet.indexOf(c = str.charAt(i)) < 0) {
          if (c == '.') {

            // If '.' is not the first character and it has not be found before.
            if (i > e) {
              e = len;
              continue;
            }
          } else if (!caseChanged) {

            // Allow e.g. hexadecimal 'FF' as well as 'ff'.
            if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                str == str.toLowerCase() && (str = str.toUpperCase())) {
              caseChanged = true;
              i = -1;
              e = 0;
              continue;
            }
          }

          return parseNumeric(x, String(v), isNum, b);
        }
      }

      // Prevent later check for length on converted number.
      isNum = false;
      str = convertBase(str, b, 10, x.s);

      // Decimal point?
      if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
      else e = str.length;
    }

    // Determine leading zeros.
    for (i = 0; str.charCodeAt(i) === 48; i++);

    // Determine trailing zeros.
    for (len = str.length; str.charCodeAt(--len) === 48;);

    if (str = str.slice(i, ++len)) {
      len -= i;

      // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
      if (isNum && BigNumber.DEBUG &&
        len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
          throw Error
           (tooManyDigits + (x.s * v));
      }

       // Overflow?
      if ((e = e - i - 1) > MAX_EXP) {

        // Infinity.
        x.c = x.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        x.c = [x.e = 0];
      } else {
        x.e = e;
        x.c = [];

        // Transform base

        // e is the base 10 exponent.
        // i is where to slice str to get the first element of the coefficient array.
        i = (e + 1) % LOG_BASE;
        if (e < 0) i += LOG_BASE;  // i < 1

        if (i < len) {
          if (i) x.c.push(+str.slice(0, i));

          for (len -= LOG_BASE; i < len;) {
            x.c.push(+str.slice(i, i += LOG_BASE));
          }

          i = LOG_BASE - (str = str.slice(i)).length;
        } else {
          i -= len;
        }

        for (; i--; str += '0');
        x.c.push(+str);
      }
    } else {

      // Zero.
      x.c = [x.e = 0];
    }
  }


  // CONSTRUCTOR PROPERTIES


  BigNumber.clone = clone;

  BigNumber.ROUND_UP = 0;
  BigNumber.ROUND_DOWN = 1;
  BigNumber.ROUND_CEIL = 2;
  BigNumber.ROUND_FLOOR = 3;
  BigNumber.ROUND_HALF_UP = 4;
  BigNumber.ROUND_HALF_DOWN = 5;
  BigNumber.ROUND_HALF_EVEN = 6;
  BigNumber.ROUND_HALF_CEIL = 7;
  BigNumber.ROUND_HALF_FLOOR = 8;
  BigNumber.EUCLID = 9;


  /*
   * Configure infrequently-changing library-wide settings.
   *
   * Accept an object with the following optional properties (if the value of a property is
   * a number, it must be an integer within the inclusive range stated):
   *
   *   DECIMAL_PLACES   {number}           0 to MAX
   *   ROUNDING_MODE    {number}           0 to 8
   *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
   *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
   *   CRYPTO           {boolean}          true or false
   *   MODULO_MODE      {number}           0 to 9
   *   POW_PRECISION       {number}           0 to MAX
   *   ALPHABET         {string}           A string of two or more unique characters which does
   *                                       not contain '.'.
   *   FORMAT           {object}           An object with some of the following properties:
   *     prefix                 {string}
   *     groupSize              {number}
   *     secondaryGroupSize     {number}
   *     groupSeparator         {string}
   *     decimalSeparator       {string}
   *     fractionGroupSize      {number}
   *     fractionGroupSeparator {string}
   *     suffix                 {string}
   *
   * (The values assigned to the above FORMAT object properties are not checked for validity.)
   *
   * E.g.
   * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
   *
   * Ignore properties/parameters set to null or undefined, except for ALPHABET.
   *
   * Return an object with the properties current values.
   */
  BigNumber.config = BigNumber.set = function (obj) {
    var p, v;

    if (obj != null) {

      if (typeof obj == 'object') {

        // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
        // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          DECIMAL_PLACES = v;
        }

        // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
        // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
          v = obj[p];
          intCheck(v, 0, 8, p);
          ROUNDING_MODE = v;
        }

        // EXPONENTIAL_AT {number|number[]}
        // Integer, -MAX to MAX inclusive or
        // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
        // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, 0, p);
            intCheck(v[1], 0, MAX, p);
            TO_EXP_NEG = v[0];
            TO_EXP_POS = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
          }
        }

        // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
        // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
        // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
        if (obj.hasOwnProperty(p = 'RANGE')) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, -1, p);
            intCheck(v[1], 1, MAX, p);
            MIN_EXP = v[0];
            MAX_EXP = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            if (v) {
              MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
            } else {
              throw Error
               (bignumberError + p + ' cannot be zero: ' + v);
            }
          }
        }

        // CRYPTO {boolean} true or false.
        // '[BigNumber Error] CRYPTO not true or false: {v}'
        // '[BigNumber Error] crypto unavailable'
        if (obj.hasOwnProperty(p = 'CRYPTO')) {
          v = obj[p];
          if (v === !!v) {
            if (v) {
              if (typeof crypto != 'undefined' && crypto &&
               (crypto.getRandomValues || crypto.randomBytes)) {
                CRYPTO = v;
              } else {
                CRYPTO = !v;
                throw Error
                 (bignumberError + 'crypto unavailable');
              }
            } else {
              CRYPTO = v;
            }
          } else {
            throw Error
             (bignumberError + p + ' not true or false: ' + v);
          }
        }

        // MODULO_MODE {number} Integer, 0 to 9 inclusive.
        // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
          v = obj[p];
          intCheck(v, 0, 9, p);
          MODULO_MODE = v;
        }

        // POW_PRECISION {number} Integer, 0 to MAX inclusive.
        // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          POW_PRECISION = v;
        }

        // FORMAT {object}
        // '[BigNumber Error] FORMAT not an object: {v}'
        if (obj.hasOwnProperty(p = 'FORMAT')) {
          v = obj[p];
          if (typeof v == 'object') FORMAT = v;
          else throw Error
           (bignumberError + p + ' not an object: ' + v);
        }

        // ALPHABET {string}
        // '[BigNumber Error] ALPHABET invalid: {v}'
        if (obj.hasOwnProperty(p = 'ALPHABET')) {
          v = obj[p];

          // Disallow if less than two characters,
          // or if it contains '+', '-', '.', whitespace, or a repeated character.
          if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
            alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
            ALPHABET = v;
          } else {
            throw Error
             (bignumberError + p + ' invalid: ' + v);
          }
        }

      } else {

        // '[BigNumber Error] Object expected: {v}'
        throw Error
         (bignumberError + 'Object expected: ' + obj);
      }
    }

    return {
      DECIMAL_PLACES: DECIMAL_PLACES,
      ROUNDING_MODE: ROUNDING_MODE,
      EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
      RANGE: [MIN_EXP, MAX_EXP],
      CRYPTO: CRYPTO,
      MODULO_MODE: MODULO_MODE,
      POW_PRECISION: POW_PRECISION,
      FORMAT: FORMAT,
      ALPHABET: ALPHABET
    };
  };


  /*
   * Return true if v is a BigNumber instance, otherwise return false.
   *
   * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
   *
   * v {any}
   *
   * '[BigNumber Error] Invalid BigNumber: {v}'
   */
  BigNumber.isBigNumber = function (v) {
    if (!v || v._isBigNumber !== true) return false;
    if (!BigNumber.DEBUG) return true;

    var i, n,
      c = v.c,
      e = v.e,
      s = v.s;

    out: if ({}.toString.call(c) == '[object Array]') {

      if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

        // If the first element is zero, the BigNumber value must be zero.
        if (c[0] === 0) {
          if (e === 0 && c.length === 1) return true;
          break out;
        }

        // Calculate number of digits that c[0] should have, based on the exponent.
        i = (e + 1) % LOG_BASE;
        if (i < 1) i += LOG_BASE;

        // Calculate number of digits of c[0].
        //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
        if (String(c[0]).length == i) {

          for (i = 0; i < c.length; i++) {
            n = c[i];
            if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
          }

          // Last element cannot be zero, unless it is the only element.
          if (n !== 0) return true;
        }
      }

    // Infinity/NaN
    } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
      return true;
    }

    throw Error
      (bignumberError + 'Invalid BigNumber: ' + v);
  };


  /*
   * Return a new BigNumber whose value is the maximum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.maximum = BigNumber.max = function () {
    return maxOrMin(arguments, -1);
  };


  /*
   * Return a new BigNumber whose value is the minimum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.minimum = BigNumber.min = function () {
    return maxOrMin(arguments, 1);
  };


  /*
   * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
   * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
   * zeros are produced).
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
   * '[BigNumber Error] crypto unavailable'
   */
  BigNumber.random = (function () {
    var pow2_53 = 0x20000000000000;

    // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
    // Check if Math.random() produces more than 32 bits of randomness.
    // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
    // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
    var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
     ? function () { return mathfloor(Math.random() * pow2_53); }
     : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
       (Math.random() * 0x800000 | 0); };

    return function (dp) {
      var a, b, e, k, v,
        i = 0,
        c = [],
        rand = new BigNumber(ONE);

      if (dp == null) dp = DECIMAL_PLACES;
      else intCheck(dp, 0, MAX);

      k = mathceil(dp / LOG_BASE);

      if (CRYPTO) {

        // Browsers supporting crypto.getRandomValues.
        if (crypto.getRandomValues) {

          a = crypto.getRandomValues(new Uint32Array(k *= 2));

          for (; i < k;) {

            // 53 bits:
            // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
            // 11111 11111111 11111111 11111111 11100000 00000000 00000000
            // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
            //                                     11111 11111111 11111111
            // 0x20000 is 2^21.
            v = a[i] * 0x20000 + (a[i + 1] >>> 11);

            // Rejection sampling:
            // 0 <= v < 9007199254740992
            // Probability that v >= 9e15, is
            // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
            if (v >= 9e15) {
              b = crypto.getRandomValues(new Uint32Array(2));
              a[i] = b[0];
              a[i + 1] = b[1];
            } else {

              // 0 <= v <= 8999999999999999
              // 0 <= (v % 1e14) <= 99999999999999
              c.push(v % 1e14);
              i += 2;
            }
          }
          i = k / 2;

        // Node.js supporting crypto.randomBytes.
        } else if (crypto.randomBytes) {

          // buffer
          a = crypto.randomBytes(k *= 7);

          for (; i < k;) {

            // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
            // 0x100000000 is 2^32, 0x1000000 is 2^24
            // 11111 11111111 11111111 11111111 11111111 11111111 11111111
            // 0 <= v < 9007199254740992
            v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
               (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
               (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

            if (v >= 9e15) {
              crypto.randomBytes(7).copy(a, i);
            } else {

              // 0 <= (v % 1e14) <= 99999999999999
              c.push(v % 1e14);
              i += 7;
            }
          }
          i = k / 7;
        } else {
          CRYPTO = false;
          throw Error
           (bignumberError + 'crypto unavailable');
        }
      }

      // Use Math.random.
      if (!CRYPTO) {

        for (; i < k;) {
          v = random53bitInt();
          if (v < 9e15) c[i++] = v % 1e14;
        }
      }

      k = c[--i];
      dp %= LOG_BASE;

      // Convert trailing digits to zeros according to dp.
      if (k && dp) {
        v = POWS_TEN[LOG_BASE - dp];
        c[i] = mathfloor(k / v) * v;
      }

      // Remove trailing elements which are zero.
      for (; c[i] === 0; c.pop(), i--);

      // Zero?
      if (i < 0) {
        c = [e = 0];
      } else {

        // Remove leading elements which are zero and adjust exponent accordingly.
        for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

        // Count the digits of the first element of c to determine leading zeros, and...
        for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

        // adjust the exponent accordingly.
        if (i < LOG_BASE) e -= LOG_BASE - i;
      }

      rand.e = e;
      rand.c = c;
      return rand;
    };
  })();


   /*
   * Return a BigNumber whose value is the sum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.sum = function () {
    var i = 1,
      args = arguments,
      sum = new BigNumber(args[0]);
    for (; i < args.length;) sum = sum.plus(args[i++]);
    return sum;
  };


  // PRIVATE FUNCTIONS


  // Called by BigNumber and BigNumber.prototype.toString.
  convertBase = (function () {
    var decimal = '0123456789';

    /*
     * Convert string of baseIn to an array of numbers of baseOut.
     * Eg. toBaseOut('255', 10, 16) returns [15, 15].
     * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
     */
    function toBaseOut(str, baseIn, baseOut, alphabet) {
      var j,
        arr = [0],
        arrL,
        i = 0,
        len = str.length;

      for (; i < len;) {
        for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

        arr[0] += alphabet.indexOf(str.charAt(i++));

        for (j = 0; j < arr.length; j++) {

          if (arr[j] > baseOut - 1) {
            if (arr[j + 1] == null) arr[j + 1] = 0;
            arr[j + 1] += arr[j] / baseOut | 0;
            arr[j] %= baseOut;
          }
        }
      }

      return arr.reverse();
    }

    // Convert a numeric string of baseIn to a numeric string of baseOut.
    // If the caller is toString, we are converting from base 10 to baseOut.
    // If the caller is BigNumber, we are converting from baseIn to base 10.
    return function (str, baseIn, baseOut, sign, callerIsToString) {
      var alphabet, d, e, k, r, x, xc, y,
        i = str.indexOf('.'),
        dp = DECIMAL_PLACES,
        rm = ROUNDING_MODE;

      // Non-integer.
      if (i >= 0) {
        k = POW_PRECISION;

        // Unlimited precision.
        POW_PRECISION = 0;
        str = str.replace('.', '');
        y = new BigNumber(baseIn);
        x = y.pow(str.length - i);
        POW_PRECISION = k;

        // Convert str as if an integer, then restore the fraction part by dividing the
        // result by its base raised to a power.

        y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
         10, baseOut, decimal);
        y.e = y.c.length;
      }

      // Convert the number as integer.

      xc = toBaseOut(str, baseIn, baseOut, callerIsToString
       ? (alphabet = ALPHABET, decimal)
       : (alphabet = decimal, ALPHABET));

      // xc now represents str as an integer and converted to baseOut. e is the exponent.
      e = k = xc.length;

      // Remove trailing zeros.
      for (; xc[--k] == 0; xc.pop());

      // Zero?
      if (!xc[0]) return alphabet.charAt(0);

      // Does str represent an integer? If so, no need for the division.
      if (i < 0) {
        --e;
      } else {
        x.c = xc;
        x.e = e;

        // The sign is needed for correct rounding.
        x.s = sign;
        x = div(x, y, dp, rm, baseOut);
        xc = x.c;
        r = x.r;
        e = x.e;
      }

      // xc now represents str converted to baseOut.

      // THe index of the rounding digit.
      d = e + dp + 1;

      // The rounding digit: the digit to the right of the digit that may be rounded up.
      i = xc[d];

      // Look at the rounding digits and mode to determine whether to round up.

      k = baseOut / 2;
      r = r || d < 0 || xc[d + 1] != null;

      r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
            : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
             rm == (x.s < 0 ? 8 : 7));

      // If the index of the rounding digit is not greater than zero, or xc represents
      // zero, then the result of the base conversion is zero or, if rounding up, a value
      // such as 0.00001.
      if (d < 1 || !xc[0]) {

        // 1^-dp or 0
        str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
      } else {

        // Truncate xc to the required number of decimal places.
        xc.length = d;

        // Round up?
        if (r) {

          // Rounding up may mean the previous digit has to be rounded up and so on.
          for (--baseOut; ++xc[--d] > baseOut;) {
            xc[d] = 0;

            if (!d) {
              ++e;
              xc = [1].concat(xc);
            }
          }
        }

        // Determine trailing zeros.
        for (k = xc.length; !xc[--k];);

        // E.g. [4, 11, 15] becomes 4bf.
        for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

        // Add leading zeros, decimal point and trailing zeros as required.
        str = toFixedPoint(str, e, alphabet.charAt(0));
      }

      // The caller will add the sign.
      return str;
    };
  })();


  // Perform division in the specified base. Called by div and convertBase.
  div = (function () {

    // Assume non-zero x and k.
    function multiply(x, k, base) {
      var m, temp, xlo, xhi,
        carry = 0,
        i = x.length,
        klo = k % SQRT_BASE,
        khi = k / SQRT_BASE | 0;

      for (x = x.slice(); i--;) {
        xlo = x[i] % SQRT_BASE;
        xhi = x[i] / SQRT_BASE | 0;
        m = khi * xlo + xhi * klo;
        temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
        carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
        x[i] = temp % base;
      }

      if (carry) x = [carry].concat(x);

      return x;
    }

    function compare(a, b, aL, bL) {
      var i, cmp;

      if (aL != bL) {
        cmp = aL > bL ? 1 : -1;
      } else {

        for (i = cmp = 0; i < aL; i++) {

          if (a[i] != b[i]) {
            cmp = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }

      return cmp;
    }

    function subtract(a, b, aL, base) {
      var i = 0;

      // Subtract b from a.
      for (; aL--;) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }

      // Remove leading zeros.
      for (; !a[0] && a.length > 1; a.splice(0, 1));
    }

    // x: dividend, y: divisor.
    return function (x, y, dp, rm, base) {
      var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
        yL, yz,
        s = x.s == y.s ? 1 : -1,
        xc = x.c,
        yc = y.c;

      // Either NaN, Infinity or 0?
      if (!xc || !xc[0] || !yc || !yc[0]) {

        return new BigNumber(

         // Return NaN if either NaN, or both Infinity or 0.
         !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

          // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
          xc && xc[0] == 0 || !yc ? s * 0 : s / 0
       );
      }

      q = new BigNumber(s);
      qc = q.c = [];
      e = x.e - y.e;
      s = dp + e + 1;

      if (!base) {
        base = BASE;
        e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
        s = s / LOG_BASE | 0;
      }

      // Result exponent may be one less then the current value of e.
      // The coefficients of the BigNumbers from convertBase may have trailing zeros.
      for (i = 0; yc[i] == (xc[i] || 0); i++);

      if (yc[i] > (xc[i] || 0)) e--;

      if (s < 0) {
        qc.push(1);
        more = true;
      } else {
        xL = xc.length;
        yL = yc.length;
        i = 0;
        s += 2;

        // Normalise xc and yc so highest order digit of yc is >= base / 2.

        n = mathfloor(base / (yc[0] + 1));

        // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
        // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
        if (n > 1) {
          yc = multiply(yc, n, base);
          xc = multiply(xc, n, base);
          yL = yc.length;
          xL = xc.length;
        }

        xi = yL;
        rem = xc.slice(0, yL);
        remL = rem.length;

        // Add zeros to make remainder as long as divisor.
        for (; remL < yL; rem[remL++] = 0);
        yz = yc.slice();
        yz = [0].concat(yz);
        yc0 = yc[0];
        if (yc[1] >= base / 2) yc0++;
        // Not necessary, but to prevent trial digit n > base, when using base 3.
        // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

        do {
          n = 0;

          // Compare divisor and remainder.
          cmp = compare(yc, rem, yL, remL);

          // If divisor < remainder.
          if (cmp < 0) {

            // Calculate trial digit, n.

            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

            // n is how many times the divisor goes into the current remainder.
            n = mathfloor(rem0 / yc0);

            //  Algorithm:
            //  product = divisor multiplied by trial digit (n).
            //  Compare product and remainder.
            //  If product is greater than remainder:
            //    Subtract divisor from product, decrement trial digit.
            //  Subtract product from remainder.
            //  If product was less than remainder at the last compare:
            //    Compare new remainder and divisor.
            //    If remainder is greater than divisor:
            //      Subtract divisor from remainder, increment trial digit.

            if (n > 1) {

              // n may be > base only when base is 3.
              if (n >= base) n = base - 1;

              // product = divisor * trial digit.
              prod = multiply(yc, n, base);
              prodL = prod.length;
              remL = rem.length;

              // Compare product and remainder.
              // If product > remainder then trial digit n too high.
              // n is 1 too high about 5% of the time, and is not known to have
              // ever been more than 1 too high.
              while (compare(prod, rem, prodL, remL) == 1) {
                n--;

                // Subtract divisor from product.
                subtract(prod, yL < prodL ? yz : yc, prodL, base);
                prodL = prod.length;
                cmp = 1;
              }
            } else {

              // n is 0 or 1, cmp is -1.
              // If n is 0, there is no need to compare yc and rem again below,
              // so change cmp to 1 to avoid it.
              // If n is 1, leave cmp as -1, so yc and rem are compared again.
              if (n == 0) {

                // divisor < remainder, so n must be at least 1.
                cmp = n = 1;
              }

              // product = divisor
              prod = yc.slice();
              prodL = prod.length;
            }

            if (prodL < remL) prod = [0].concat(prod);

            // Subtract product from remainder.
            subtract(rem, prod, remL, base);
            remL = rem.length;

             // If product was < remainder.
            if (cmp == -1) {

              // Compare divisor and new remainder.
              // If divisor < new remainder, subtract divisor from remainder.
              // Trial digit n too low.
              // n is 1 too low about 5% of the time, and very rarely 2 too low.
              while (compare(yc, rem, yL, remL) < 1) {
                n++;

                // Subtract divisor from remainder.
                subtract(rem, yL < remL ? yz : yc, remL, base);
                remL = rem.length;
              }
            }
          } else if (cmp === 0) {
            n++;
            rem = [0];
          } // else cmp === 1 and n will be 0

          // Add the next digit, n, to the result array.
          qc[i++] = n;

          // Update the remainder.
          if (rem[0]) {
            rem[remL++] = xc[xi] || 0;
          } else {
            rem = [xc[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] != null) && s--);

        more = rem[0] != null;

        // Leading zero?
        if (!qc[0]) qc.splice(0, 1);
      }

      if (base == BASE) {

        // To calculate q.e, first get the number of digits of qc[0].
        for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

        round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

      // Caller is convertBase.
      } else {
        q.e = e;
        q.r = +more;
      }

      return q;
    };
  })();


  /*
   * Return a string representing the value of BigNumber n in fixed-point or exponential
   * notation rounded to the specified decimal places or significant digits.
   *
   * n: a BigNumber.
   * i: the index of the last digit required (i.e. the digit that may be rounded up).
   * rm: the rounding mode.
   * id: 1 (toExponential) or 2 (toPrecision).
   */
  function format(n, i, rm, id) {
    var c0, e, ne, len, str;

    if (rm == null) rm = ROUNDING_MODE;
    else intCheck(rm, 0, 8);

    if (!n.c) return n.toString();

    c0 = n.c[0];
    ne = n.e;

    if (i == null) {
      str = coeffToString(n.c);
      str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
       ? toExponential(str, ne)
       : toFixedPoint(str, ne, '0');
    } else {
      n = round(new BigNumber(n), i, rm);

      // n.e may have changed if the value was rounded up.
      e = n.e;

      str = coeffToString(n.c);
      len = str.length;

      // toPrecision returns exponential notation if the number of significant digits
      // specified is less than the number of digits necessary to represent the integer
      // part of the value in fixed-point notation.

      // Exponential notation.
      if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

        // Append zeros?
        for (; len < i; str += '0', len++);
        str = toExponential(str, e);

      // Fixed-point notation.
      } else {
        i -= ne;
        str = toFixedPoint(str, e, '0');

        // Append zeros?
        if (e + 1 > len) {
          if (--i > 0) for (str += '.'; i--; str += '0');
        } else {
          i += e - len;
          if (i > 0) {
            if (e + 1 == len) str += '.';
            for (; i--; str += '0');
          }
        }
      }
    }

    return n.s < 0 && c0 ? '-' + str : str;
  }


  // Handle BigNumber.max and BigNumber.min.
  // If any number is NaN, return NaN.
  function maxOrMin(args, n) {
    var k, y,
      i = 1,
      x = new BigNumber(args[0]);

    for (; i < args.length; i++) {
      y = new BigNumber(args[i]);
      if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
        x = y;
      }
    }

    return x;
  }


  /*
   * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
   * Called by minus, plus and times.
   */
  function normalise(n, c, e) {
    var i = 1,
      j = c.length;

     // Remove trailing zeros.
    for (; !c[--j]; c.pop());

    // Calculate the base 10 exponent. First get the number of digits of c[0].
    for (j = c[0]; j >= 10; j /= 10, i++);

    // Overflow?
    if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

      // Infinity.
      n.c = n.e = null;

    // Underflow?
    } else if (e < MIN_EXP) {

      // Zero.
      n.c = [n.e = 0];
    } else {
      n.e = e;
      n.c = c;
    }

    return n;
  }


  // Handle values that fail the validity test in BigNumber.
  parseNumeric = (function () {
    var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
      dotAfter = /^([^.]+)\.$/,
      dotBefore = /^\.([^.]+)$/,
      isInfinityOrNaN = /^-?(Infinity|NaN)$/,
      whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

    return function (x, str, isNum, b) {
      var base,
        s = isNum ? str : str.replace(whitespaceOrPlus, '');

      // No exception on ±Infinity or NaN.
      if (isInfinityOrNaN.test(s)) {
        x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
      } else {
        if (!isNum) {

          // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
          s = s.replace(basePrefix, function (m, p1, p2) {
            base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
            return !b || b == base ? p1 : m;
          });

          if (b) {
            base = b;

            // E.g. '1.' to '1', '.1' to '0.1'
            s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
          }

          if (str != s) return new BigNumber(s, base);
        }

        // '[BigNumber Error] Not a number: {n}'
        // '[BigNumber Error] Not a base {b} number: {n}'
        if (BigNumber.DEBUG) {
          throw Error
            (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
        }

        // NaN
        x.s = null;
      }

      x.c = x.e = null;
    }
  })();


  /*
   * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
   * If r is truthy, it is known that there are more digits after the rounding digit.
   */
  function round(x, sd, rm, r) {
    var d, i, j, k, n, ni, rd,
      xc = x.c,
      pows10 = POWS_TEN;

    // if x is not Infinity or NaN...
    if (xc) {

      // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
      // n is a base 1e14 number, the value of the element of array x.c containing rd.
      // ni is the index of n within x.c.
      // d is the number of digits of n.
      // i is the index of rd within n including leading zeros.
      // j is the actual index of rd within n (if < 0, rd is a leading zero).
      out: {

        // Get the number of digits of the first element of xc.
        for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
        i = sd - d;

        // If the rounding digit is in the first element of xc...
        if (i < 0) {
          i += LOG_BASE;
          j = sd;
          n = xc[ni = 0];

          // Get the rounding digit at index j of n.
          rd = mathfloor(n / pows10[d - j - 1] % 10);
        } else {
          ni = mathceil((i + 1) / LOG_BASE);

          if (ni >= xc.length) {

            if (r) {

              // Needed by sqrt.
              for (; xc.length <= ni; xc.push(0));
              n = rd = 0;
              d = 1;
              i %= LOG_BASE;
              j = i - LOG_BASE + 1;
            } else {
              break out;
            }
          } else {
            n = k = xc[ni];

            // Get the number of digits of n.
            for (d = 1; k >= 10; k /= 10, d++);

            // Get the index of rd within n.
            i %= LOG_BASE;

            // Get the index of rd within n, adjusted for leading zeros.
            // The number of leading zeros of n is given by LOG_BASE - d.
            j = i - LOG_BASE + d;

            // Get the rounding digit at index j of n.
            rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
          }
        }

        r = r || sd < 0 ||

        // Are there any non-zero digits after the rounding digit?
        // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
        // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
         xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

        r = rm < 4
         ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
         : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

          // Check whether the digit to the left of the rounding digit is odd.
          ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
           rm == (x.s < 0 ? 8 : 7));

        if (sd < 1 || !xc[0]) {
          xc.length = 0;

          if (r) {

            // Convert sd to decimal places.
            sd -= x.e + 1;

            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
            xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
            x.e = -sd || 0;
          } else {

            // Zero.
            xc[0] = x.e = 0;
          }

          return x;
        }

        // Remove excess digits.
        if (i == 0) {
          xc.length = ni;
          k = 1;
          ni--;
        } else {
          xc.length = ni + 1;
          k = pows10[LOG_BASE - i];

          // E.g. 56700 becomes 56000 if 7 is the rounding digit.
          // j > 0 means i > number of leading zeros of n.
          xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
        }

        // Round up?
        if (r) {

          for (; ;) {

            // If the digit to be rounded up is in the first element of xc...
            if (ni == 0) {

              // i will be the length of xc[0] before k is added.
              for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
              j = xc[0] += k;
              for (k = 1; j >= 10; j /= 10, k++);

              // if i != k the length has increased.
              if (i != k) {
                x.e++;
                if (xc[0] == BASE) xc[0] = 1;
              }

              break;
            } else {
              xc[ni] += k;
              if (xc[ni] != BASE) break;
              xc[ni--] = 0;
              k = 1;
            }
          }
        }

        // Remove trailing zeros.
        for (i = xc.length; xc[--i] === 0; xc.pop());
      }

      // Overflow? Infinity.
      if (x.e > MAX_EXP) {
        x.c = x.e = null;

      // Underflow? Zero.
      } else if (x.e < MIN_EXP) {
        x.c = [x.e = 0];
      }
    }

    return x;
  }


  function valueOf(n) {
    var str,
      e = n.e;

    if (e === null) return n.toString();

    str = coeffToString(n.c);

    str = e <= TO_EXP_NEG || e >= TO_EXP_POS
      ? toExponential(str, e)
      : toFixedPoint(str, e, '0');

    return n.s < 0 ? '-' + str : str;
  }


  // PROTOTYPE/INSTANCE METHODS


  /*
   * Return a new BigNumber whose value is the absolute value of this BigNumber.
   */
  P.absoluteValue = P.abs = function () {
    var x = new BigNumber(this);
    if (x.s < 0) x.s = 1;
    return x;
  };


  /*
   * Return
   *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
   *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
   *   0 if they have the same value,
   *   or null if the value of either is NaN.
   */
  P.comparedTo = function (y, b) {
    return compare(this, new BigNumber(y, b));
  };


  /*
   * If dp is undefined or null or true or false, return the number of decimal places of the
   * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
   *
   * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
   * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
   * ROUNDING_MODE if rm is omitted.
   *
   * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.decimalPlaces = P.dp = function (dp, rm) {
    var c, n, v,
      x = this;

    if (dp != null) {
      intCheck(dp, 0, MAX);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      return round(new BigNumber(x), dp + x.e + 1, rm);
    }

    if (!(c = x.c)) return null;
    n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

    // Subtract the number of trailing zeros of the last number.
    if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
    if (n < 0) n = 0;

    return n;
  };


  /*
   *  n / 0 = I
   *  n / N = N
   *  n / I = 0
   *  0 / n = 0
   *  0 / 0 = N
   *  0 / N = N
   *  0 / I = 0
   *  N / n = N
   *  N / 0 = N
   *  N / N = N
   *  N / I = N
   *  I / n = I
   *  I / 0 = I
   *  I / N = N
   *  I / I = N
   *
   * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
   * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
   */
  P.dividedBy = P.div = function (y, b) {
    return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
  };


  /*
   * Return a new BigNumber whose value is the integer part of dividing the value of this
   * BigNumber by the value of BigNumber(y, b).
   */
  P.dividedToIntegerBy = P.idiv = function (y, b) {
    return div(this, new BigNumber(y, b), 0, 1);
  };


  /*
   * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
   *
   * If m is present, return the result modulo m.
   * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
   * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
   *
   * The modular power operation works efficiently when x, n, and m are integers, otherwise it
   * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
   *
   * n {number|string|BigNumber} The exponent. An integer.
   * [m] {number|string|BigNumber} The modulus.
   *
   * '[BigNumber Error] Exponent not an integer: {n}'
   */
  P.exponentiatedBy = P.pow = function (n, m) {
    var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
      x = this;

    n = new BigNumber(n);

    // Allow NaN and ±Infinity, but not other non-integers.
    if (n.c && !n.isInteger()) {
      throw Error
        (bignumberError + 'Exponent not an integer: ' + valueOf(n));
    }

    if (m != null) m = new BigNumber(m);

    // Exponent of MAX_SAFE_INTEGER is 15.
    nIsBig = n.e > 14;

    // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
    if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

      // The sign of the result of pow when x is negative depends on the evenness of n.
      // If +n overflows to ±Infinity, the evenness of n would be not be known.
      y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
      return m ? y.mod(m) : y;
    }

    nIsNeg = n.s < 0;

    if (m) {

      // x % m returns NaN if abs(m) is zero, or m is NaN.
      if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

      isModExp = !nIsNeg && x.isInteger() && m.isInteger();

      if (isModExp) x = x.mod(m);

    // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
    // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
    } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
      // [1, 240000000]
      ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
      // [80000000000000]  [99999750000000]
      : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

      // If x is negative and n is odd, k = -0, else k = 0.
      k = x.s < 0 && isOdd(n) ? -0 : 0;

      // If x >= 1, k = ±Infinity.
      if (x.e > -1) k = 1 / k;

      // If n is negative return ±0, else return ±Infinity.
      return new BigNumber(nIsNeg ? 1 / k : k);

    } else if (POW_PRECISION) {

      // Truncating each coefficient array to a length of k after each multiplication
      // equates to truncating significant digits to POW_PRECISION + [28, 41],
      // i.e. there will be a minimum of 28 guard digits retained.
      k = mathceil(POW_PRECISION / LOG_BASE + 2);
    }

    if (nIsBig) {
      half = new BigNumber(0.5);
      if (nIsNeg) n.s = 1;
      nIsOdd = isOdd(n);
    } else {
      i = Math.abs(+valueOf(n));
      nIsOdd = i % 2;
    }

    y = new BigNumber(ONE);

    // Performs 54 loop iterations for n of 9007199254740991.
    for (; ;) {

      if (nIsOdd) {
        y = y.times(x);
        if (!y.c) break;

        if (k) {
          if (y.c.length > k) y.c.length = k;
        } else if (isModExp) {
          y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
        }
      }

      if (i) {
        i = mathfloor(i / 2);
        if (i === 0) break;
        nIsOdd = i % 2;
      } else {
        n = n.times(half);
        round(n, n.e + 1, 1);

        if (n.e > 14) {
          nIsOdd = isOdd(n);
        } else {
          i = +valueOf(n);
          if (i === 0) break;
          nIsOdd = i % 2;
        }
      }

      x = x.times(x);

      if (k) {
        if (x.c && x.c.length > k) x.c.length = k;
      } else if (isModExp) {
        x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
      }
    }

    if (isModExp) return y;
    if (nIsNeg) y = ONE.div(y);

    return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
  };


  /*
   * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
   * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
   *
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
   */
  P.integerValue = function (rm) {
    var n = new BigNumber(this);
    if (rm == null) rm = ROUNDING_MODE;
    else intCheck(rm, 0, 8);
    return round(n, n.e + 1, rm);
  };


  /*
   * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isEqualTo = P.eq = function (y, b) {
    return compare(this, new BigNumber(y, b)) === 0;
  };


  /*
   * Return true if the value of this BigNumber is a finite number, otherwise return false.
   */
  P.isFinite = function () {
    return !!this.c;
  };


  /*
   * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isGreaterThan = P.gt = function (y, b) {
    return compare(this, new BigNumber(y, b)) > 0;
  };


  /*
   * Return true if the value of this BigNumber is greater than or equal to the value of
   * BigNumber(y, b), otherwise return false.
   */
  P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
    return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

  };


  /*
   * Return true if the value of this BigNumber is an integer, otherwise return false.
   */
  P.isInteger = function () {
    return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
  };


  /*
   * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isLessThan = P.lt = function (y, b) {
    return compare(this, new BigNumber(y, b)) < 0;
  };


  /*
   * Return true if the value of this BigNumber is less than or equal to the value of
   * BigNumber(y, b), otherwise return false.
   */
  P.isLessThanOrEqualTo = P.lte = function (y, b) {
    return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
  };


  /*
   * Return true if the value of this BigNumber is NaN, otherwise return false.
   */
  P.isNaN = function () {
    return !this.s;
  };


  /*
   * Return true if the value of this BigNumber is negative, otherwise return false.
   */
  P.isNegative = function () {
    return this.s < 0;
  };


  /*
   * Return true if the value of this BigNumber is positive, otherwise return false.
   */
  P.isPositive = function () {
    return this.s > 0;
  };


  /*
   * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
   */
  P.isZero = function () {
    return !!this.c && this.c[0] == 0;
  };


  /*
   *  n - 0 = n
   *  n - N = N
   *  n - I = -I
   *  0 - n = -n
   *  0 - 0 = 0
   *  0 - N = N
   *  0 - I = -I
   *  N - n = N
   *  N - 0 = N
   *  N - N = N
   *  N - I = N
   *  I - n = I
   *  I - 0 = I
   *  I - N = N
   *  I - I = N
   *
   * Return a new BigNumber whose value is the value of this BigNumber minus the value of
   * BigNumber(y, b).
   */
  P.minus = function (y, b) {
    var i, j, t, xLTy,
      x = this,
      a = x.s;

    y = new BigNumber(y, b);
    b = y.s;

    // Either NaN?
    if (!a || !b) return new BigNumber(NaN);

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }

    var xe = x.e / LOG_BASE,
      ye = y.e / LOG_BASE,
      xc = x.c,
      yc = y.c;

    if (!xe || !ye) {

      // Either Infinity?
      if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

      // Either zero?
      if (!xc[0] || !yc[0]) {

        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

         // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
         ROUNDING_MODE == 3 ? -0 : 0);
      }
    }

    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();

    // Determine which is the bigger number.
    if (a = xe - ye) {

      if (xLTy = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }

      t.reverse();

      // Prepend zeros to equalise exponents.
      for (b = a; b--; t.push(0));
      t.reverse();
    } else {

      // Exponents equal. Check digit by digit.
      j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

      for (a = b = 0; b < j; b++) {

        if (xc[b] != yc[b]) {
          xLTy = xc[b] < yc[b];
          break;
        }
      }
    }

    // x < y? Point xc to the array of the bigger number.
    if (xLTy) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }

    b = (j = yc.length) - (i = xc.length);

    // Append zeros to xc if shorter.
    // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
    if (b > 0) for (; b--; xc[i++] = 0);
    b = BASE - 1;

    // Subtract yc from xc.
    for (; j > a;) {

      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i]; xc[i] = b);
        --xc[i];
        xc[j] += BASE;
      }

      xc[j] -= yc[j];
    }

    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] == 0; xc.splice(0, 1), --ye);

    // Zero?
    if (!xc[0]) {

      // Following IEEE 754 (2008) 6.3,
      // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
      y.s = ROUNDING_MODE == 3 ? -1 : 1;
      y.c = [y.e = 0];
      return y;
    }

    // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
    // for finite x and y.
    return normalise(y, xc, ye);
  };


  /*
   *   n % 0 =  N
   *   n % N =  N
   *   n % I =  n
   *   0 % n =  0
   *  -0 % n = -0
   *   0 % 0 =  N
   *   0 % N =  N
   *   0 % I =  0
   *   N % n =  N
   *   N % 0 =  N
   *   N % N =  N
   *   N % I =  N
   *   I % n =  N
   *   I % 0 =  N
   *   I % N =  N
   *   I % I =  N
   *
   * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
   * BigNumber(y, b). The result depends on the value of MODULO_MODE.
   */
  P.modulo = P.mod = function (y, b) {
    var q, s,
      x = this;

    y = new BigNumber(y, b);

    // Return NaN if x is Infinity or NaN, or y is NaN or zero.
    if (!x.c || !y.s || y.c && !y.c[0]) {
      return new BigNumber(NaN);

    // Return x if y is Infinity or x is zero.
    } else if (!y.c || x.c && !x.c[0]) {
      return new BigNumber(x);
    }

    if (MODULO_MODE == 9) {

      // Euclidian division: q = sign(y) * floor(x / abs(y))
      // r = x - qy    where  0 <= r < abs(y)
      s = y.s;
      y.s = 1;
      q = div(x, y, 0, 3);
      y.s = s;
      q.s *= s;
    } else {
      q = div(x, y, 0, MODULO_MODE);
    }

    y = x.minus(q.times(y));

    // To match JavaScript %, ensure sign of zero is sign of dividend.
    if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

    return y;
  };


  /*
   *  n * 0 = 0
   *  n * N = N
   *  n * I = I
   *  0 * n = 0
   *  0 * 0 = 0
   *  0 * N = N
   *  0 * I = N
   *  N * n = N
   *  N * 0 = N
   *  N * N = N
   *  N * I = N
   *  I * n = I
   *  I * 0 = N
   *  I * N = N
   *  I * I = I
   *
   * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
   * of BigNumber(y, b).
   */
  P.multipliedBy = P.times = function (y, b) {
    var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
      base, sqrtBase,
      x = this,
      xc = x.c,
      yc = (y = new BigNumber(y, b)).c;

    // Either NaN, ±Infinity or ±0?
    if (!xc || !yc || !xc[0] || !yc[0]) {

      // Return NaN if either is NaN, or one is 0 and the other is Infinity.
      if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
        y.c = y.e = y.s = null;
      } else {
        y.s *= x.s;

        // Return ±Infinity if either is ±Infinity.
        if (!xc || !yc) {
          y.c = y.e = null;

        // Return ±0 if either is ±0.
        } else {
          y.c = [0];
          y.e = 0;
        }
      }

      return y;
    }

    e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
    y.s *= x.s;
    xcL = xc.length;
    ycL = yc.length;

    // Ensure xc points to longer array and xcL to its length.
    if (xcL < ycL) {
      zc = xc;
      xc = yc;
      yc = zc;
      i = xcL;
      xcL = ycL;
      ycL = i;
    }

    // Initialise the result array with zeros.
    for (i = xcL + ycL, zc = []; i--; zc.push(0));

    base = BASE;
    sqrtBase = SQRT_BASE;

    for (i = ycL; --i >= 0;) {
      c = 0;
      ylo = yc[i] % sqrtBase;
      yhi = yc[i] / sqrtBase | 0;

      for (k = xcL, j = i + k; j > i;) {
        xlo = xc[--k] % sqrtBase;
        xhi = xc[k] / sqrtBase | 0;
        m = yhi * xlo + xhi * ylo;
        xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
        c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
        zc[j--] = xlo % base;
      }

      zc[j] = c;
    }

    if (c) {
      ++e;
    } else {
      zc.splice(0, 1);
    }

    return normalise(y, zc, e);
  };


  /*
   * Return a new BigNumber whose value is the value of this BigNumber negated,
   * i.e. multiplied by -1.
   */
  P.negated = function () {
    var x = new BigNumber(this);
    x.s = -x.s || null;
    return x;
  };


  /*
   *  n + 0 = n
   *  n + N = N
   *  n + I = I
   *  0 + n = n
   *  0 + 0 = 0
   *  0 + N = N
   *  0 + I = I
   *  N + n = N
   *  N + 0 = N
   *  N + N = N
   *  N + I = N
   *  I + n = I
   *  I + 0 = I
   *  I + N = N
   *  I + I = I
   *
   * Return a new BigNumber whose value is the value of this BigNumber plus the value of
   * BigNumber(y, b).
   */
  P.plus = function (y, b) {
    var t,
      x = this,
      a = x.s;

    y = new BigNumber(y, b);
    b = y.s;

    // Either NaN?
    if (!a || !b) return new BigNumber(NaN);

    // Signs differ?
     if (a != b) {
      y.s = -b;
      return x.minus(y);
    }

    var xe = x.e / LOG_BASE,
      ye = y.e / LOG_BASE,
      xc = x.c,
      yc = y.c;

    if (!xe || !ye) {

      // Return ±Infinity if either ±Infinity.
      if (!xc || !yc) return new BigNumber(a / 0);

      // Either zero?
      // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
      if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
    }

    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();

    // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
    if (a = xe - ye) {
      if (a > 0) {
        ye = xe;
        t = yc;
      } else {
        a = -a;
        t = xc;
      }

      t.reverse();
      for (; a--; t.push(0));
      t.reverse();
    }

    a = xc.length;
    b = yc.length;

    // Point xc to the longer array, and b to the shorter length.
    if (a - b < 0) {
      t = yc;
      yc = xc;
      xc = t;
      b = a;
    }

    // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
    for (a = 0; b;) {
      a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
      xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
    }

    if (a) {
      xc = [a].concat(xc);
      ++ye;
    }

    // No need to check for zero, as +x + +y != 0 && -x + -y != 0
    // ye = MAX_EXP + 1 possible
    return normalise(y, xc, ye);
  };


  /*
   * If sd is undefined or null or true or false, return the number of significant digits of
   * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
   * If sd is true include integer-part trailing zeros in the count.
   *
   * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
   * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
   * ROUNDING_MODE if rm is omitted.
   *
   * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
   *                     boolean: whether to count integer-part trailing zeros: true or false.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
   */
  P.precision = P.sd = function (sd, rm) {
    var c, n, v,
      x = this;

    if (sd != null && sd !== !!sd) {
      intCheck(sd, 1, MAX);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      return round(new BigNumber(x), sd, rm);
    }

    if (!(c = x.c)) return null;
    v = c.length - 1;
    n = v * LOG_BASE + 1;

    if (v = c[v]) {

      // Subtract the number of trailing zeros of the last element.
      for (; v % 10 == 0; v /= 10, n--);

      // Add the number of digits of the first element.
      for (v = c[0]; v >= 10; v /= 10, n++);
    }

    if (sd && x.e + 1 > n) n = x.e + 1;

    return n;
  };


  /*
   * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
   * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
   *
   * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
   */
  P.shiftedBy = function (k) {
    intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    return this.times('1e' + k);
  };


  /*
   *  sqrt(-n) =  N
   *  sqrt(N) =  N
   *  sqrt(-I) =  N
   *  sqrt(I) =  I
   *  sqrt(0) =  0
   *  sqrt(-0) = -0
   *
   * Return a new BigNumber whose value is the square root of the value of this BigNumber,
   * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
   */
  P.squareRoot = P.sqrt = function () {
    var m, n, r, rep, t,
      x = this,
      c = x.c,
      s = x.s,
      e = x.e,
      dp = DECIMAL_PLACES + 4,
      half = new BigNumber('0.5');

    // Negative/NaN/Infinity/zero?
    if (s !== 1 || !c || !c[0]) {
      return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
    }

    // Initial estimate.
    s = Math.sqrt(+valueOf(x));

    // Math.sqrt underflow/overflow?
    // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
    if (s == 0 || s == 1 / 0) {
      n = coeffToString(c);
      if ((n.length + e) % 2 == 0) n += '0';
      s = Math.sqrt(+n);
      e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

      if (s == 1 / 0) {
        n = '5e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }

      r = new BigNumber(n);
    } else {
      r = new BigNumber(s + '');
    }

    // Check for zero.
    // r could be zero if MIN_EXP is changed after the this value was created.
    // This would cause a division by zero (x/t) and hence Infinity below, which would cause
    // coeffToString to throw.
    if (r.c[0]) {
      e = r.e;
      s = e + dp;
      if (s < 3) s = 0;

      // Newton-Raphson iteration.
      for (; ;) {
        t = r;
        r = half.times(t.plus(div(x, t, dp, 1)));

        if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

          // The exponent of r may here be one less than the final result exponent,
          // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
          // are indexed correctly.
          if (r.e < e) --s;
          n = n.slice(s - 3, s + 1);

          // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
          // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
          // iteration.
          if (n == '9999' || !rep && n == '4999') {

            // On the first iteration only, check to see if rounding up gives the
            // exact result as the nines may infinitely repeat.
            if (!rep) {
              round(t, t.e + DECIMAL_PLACES + 2, 0);

              if (t.times(t).eq(x)) {
                r = t;
                break;
              }
            }

            dp += 4;
            s += 4;
            rep = 1;
          } else {

            // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
            // result. If not, then there are further digits and m will be truthy.
            if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

              // Truncate to the first rounding digit.
              round(r, r.e + DECIMAL_PLACES + 2, 1);
              m = !r.times(r).eq(x);
            }

            break;
          }
        }
      }
    }

    return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
  };


  /*
   * Return a string representing the value of this BigNumber in exponential notation and
   * rounded using ROUNDING_MODE to dp fixed decimal places.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.toExponential = function (dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp++;
    }
    return format(this, dp, rm, 1);
  };


  /*
   * Return a string representing the value of this BigNumber in fixed-point notation rounding
   * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
   *
   * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
   * but e.g. (-0.00001).toFixed(0) is '-0'.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.toFixed = function (dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp = dp + this.e + 1;
    }
    return format(this, dp, rm);
  };


  /*
   * Return a string representing the value of this BigNumber in fixed-point notation rounded
   * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
   * of the format or FORMAT object (see BigNumber.set).
   *
   * The formatting object may contain some or all of the properties shown below.
   *
   * FORMAT = {
   *   prefix: '',
   *   groupSize: 3,
   *   secondaryGroupSize: 0,
   *   groupSeparator: ',',
   *   decimalSeparator: '.',
   *   fractionGroupSize: 0,
   *   fractionGroupSeparator: '\xA0',      // non-breaking space
   *   suffix: ''
   * };
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   * [format] {object} Formatting options. See FORMAT pbject above.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   * '[BigNumber Error] Argument not an object: {format}'
   */
  P.toFormat = function (dp, rm, format) {
    var str,
      x = this;

    if (format == null) {
      if (dp != null && rm && typeof rm == 'object') {
        format = rm;
        rm = null;
      } else if (dp && typeof dp == 'object') {
        format = dp;
        dp = rm = null;
      } else {
        format = FORMAT;
      }
    } else if (typeof format != 'object') {
      throw Error
        (bignumberError + 'Argument not an object: ' + format);
    }

    str = x.toFixed(dp, rm);

    if (x.c) {
      var i,
        arr = str.split('.'),
        g1 = +format.groupSize,
        g2 = +format.secondaryGroupSize,
        groupSeparator = format.groupSeparator || '',
        intPart = arr[0],
        fractionPart = arr[1],
        isNeg = x.s < 0,
        intDigits = isNeg ? intPart.slice(1) : intPart,
        len = intDigits.length;

      if (g2) {
        i = g1;
        g1 = g2;
        g2 = i;
        len -= i;
      }

      if (g1 > 0 && len > 0) {
        i = len % g1 || g1;
        intPart = intDigits.substr(0, i);
        for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
        if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
        if (isNeg) intPart = '-' + intPart;
      }

      str = fractionPart
       ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
        ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
         '$&' + (format.fractionGroupSeparator || ''))
        : fractionPart)
       : intPart;
    }

    return (format.prefix || '') + str + (format.suffix || '');
  };


  /*
   * Return an array of two BigNumbers representing the value of this BigNumber as a simple
   * fraction with an integer numerator and an integer denominator.
   * The denominator will be a positive non-zero value less than or equal to the specified
   * maximum denominator. If a maximum denominator is not specified, the denominator will be
   * the lowest value necessary to represent the number exactly.
   *
   * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
   *
   * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
   */
  P.toFraction = function (md) {
    var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
      x = this,
      xc = x.c;

    if (md != null) {
      n = new BigNumber(md);

      // Throw if md is less than one or is not an integer, unless it is Infinity.
      if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
        throw Error
          (bignumberError + 'Argument ' +
            (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
      }
    }

    if (!xc) return new BigNumber(x);

    d = new BigNumber(ONE);
    n1 = d0 = new BigNumber(ONE);
    d1 = n0 = new BigNumber(ONE);
    s = coeffToString(xc);

    // Determine initial denominator.
    // d is a power of 10 and the minimum max denominator that specifies the value exactly.
    e = d.e = s.length - x.e - 1;
    d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
    md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

    exp = MAX_EXP;
    MAX_EXP = 1 / 0;
    n = new BigNumber(s);

    // n0 = d1 = 0
    n0.c[0] = 0;

    for (; ;)  {
      q = div(n, d, 0, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.comparedTo(md) == 1) break;
      d0 = d1;
      d1 = d2;
      n1 = n0.plus(q.times(d2 = n1));
      n0 = d2;
      d = n.minus(q.times(d2 = d));
      n = d2;
    }

    d2 = div(md.minus(d0), d1, 0, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;
    e = e * 2;

    // Determine which fraction is closer to x, n0/d0 or n1/d1
    r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
        div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

    MAX_EXP = exp;

    return r;
  };


  /*
   * Return the value of this BigNumber converted to a number primitive.
   */
  P.toNumber = function () {
    return +valueOf(this);
  };


  /*
   * Return a string representing the value of this BigNumber rounded to sd significant digits
   * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
   * necessary to represent the integer part of the value in fixed-point notation, then use
   * exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
   */
  P.toPrecision = function (sd, rm) {
    if (sd != null) intCheck(sd, 1, MAX);
    return format(this, sd, rm, 2);
  };


  /*
   * Return a string representing the value of this BigNumber in base b, or base 10 if b is
   * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
   * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
   * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
   * TO_EXP_NEG, return exponential notation.
   *
   * [b] {number} Integer, 2 to ALPHABET.length inclusive.
   *
   * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
   */
  P.toString = function (b) {
    var str,
      n = this,
      s = n.s,
      e = n.e;

    // Infinity or NaN?
    if (e === null) {
      if (s) {
        str = 'Infinity';
        if (s < 0) str = '-' + str;
      } else {
        str = 'NaN';
      }
    } else {
      if (b == null) {
        str = e <= TO_EXP_NEG || e >= TO_EXP_POS
         ? toExponential(coeffToString(n.c), e)
         : toFixedPoint(coeffToString(n.c), e, '0');
      } else if (b === 10 && alphabetHasNormalDecimalDigits) {
        n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
        str = toFixedPoint(coeffToString(n.c), n.e, '0');
      } else {
        intCheck(b, 2, ALPHABET.length, 'Base');
        str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
      }

      if (s < 0 && n.c[0]) str = '-' + str;
    }

    return str;
  };


  /*
   * Return as toString, but do not accept a base argument, and include the minus sign for
   * negative zero.
   */
  P.valueOf = P.toJSON = function () {
    return valueOf(this);
  };


  P._isBigNumber = true;

  P[Symbol.toStringTag] = 'BigNumber';

  // Node.js v10.12.0+
  P[Symbol.for('nodejs.util.inspect.custom')] = P.valueOf;

  if (configObject != null) BigNumber.set(configObject);

  return BigNumber;
}


// PRIVATE HELPER FUNCTIONS

// These functions don't need access to variables,
// e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


function bitFloor(n) {
  var i = n | 0;
  return n > 0 || n === i ? i : i - 1;
}


// Return a coefficient array as a string of base 10 digits.
function coeffToString(a) {
  var s, z,
    i = 1,
    j = a.length,
    r = a[0] + '';

  for (; i < j;) {
    s = a[i++] + '';
    z = LOG_BASE - s.length;
    for (; z--; s = '0' + s);
    r += s;
  }

  // Determine trailing zeros.
  for (j = r.length; r.charCodeAt(--j) === 48;);

  return r.slice(0, j + 1 || 1);
}


// Compare the value of BigNumbers x and y.
function compare(x, y) {
  var a, b,
    xc = x.c,
    yc = y.c,
    i = x.s,
    j = y.s,
    k = x.e,
    l = y.e;

  // Either NaN?
  if (!i || !j) return null;

  a = xc && !xc[0];
  b = yc && !yc[0];

  // Either zero?
  if (a || b) return a ? b ? 0 : -j : i;

  // Signs differ?
  if (i != j) return i;

  a = i < 0;
  b = k == l;

  // Either Infinity?
  if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

  // Compare exponents.
  if (!b) return k > l ^ a ? 1 : -1;

  j = (k = xc.length) < (l = yc.length) ? k : l;

  // Compare digit by digit.
  for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

  // Compare lengths.
  return k == l ? 0 : k > l ^ a ? 1 : -1;
}


/*
 * Check that n is a primitive number, an integer, and in range, otherwise throw.
 */
function intCheck(n, min, max, name) {
  if (n < min || n > max || n !== mathfloor(n)) {
    throw Error
     (bignumberError + (name || 'Argument') + (typeof n == 'number'
       ? n < min || n > max ? ' out of range: ' : ' not an integer: '
       : ' not a primitive number: ') + String(n));
  }
}


// Assumes finite n.
function isOdd(n) {
  var k = n.c.length - 1;
  return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
}


function toExponential(str, e) {
  return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
   (e < 0 ? 'e' : 'e+') + e;
}


function toFixedPoint(str, e, z) {
  var len, zs;

  // Negative exponent?
  if (e < 0) {

    // Prepend zeros.
    for (zs = z + '.'; ++e; zs += z);
    str = zs + str;

  // Positive exponent
  } else {
    len = str.length;

    // Append zeros.
    if (++e > len) {
      for (zs = z, e -= len; --e; zs += z);
      str += zs;
    } else if (e < len) {
      str = str.slice(0, e) + '.' + str.slice(e);
    }
  }

  return str;
}


// EXPORT


var BigNumber = clone();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BigNumber);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./assets/javascript/firmware.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlybXdhcmUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGVBQWU7QUFDZixlQUFlO0FBQ2Y7Ozs7Ozs7Ozs7O0FDSmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QscUJBQXFCLEdBQUcsc0JBQXNCLEdBQUcsa0JBQWtCLEdBQUcscUJBQXFCLEdBQUcsZ0JBQWdCLEdBQUcsaUJBQWlCLEdBQUcsb0JBQW9CLEdBQUcscUJBQXFCLEdBQUcsZUFBZSxHQUFHLG1CQUFtQixHQUFHLGVBQWUsR0FBRyxrQkFBa0IsR0FBRyxjQUFjLEdBQUcsZ0JBQWdCLEdBQUcsZUFBZSxHQUFHLG1CQUFtQjtBQUM1VSxlQUFlLG1CQUFPLENBQUMsZ0ZBQXVCO0FBQzlDLGlCQUFpQixtQkFBTyxDQUFDLHVFQUFZO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixrQkFBa0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdCQUFnQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQSw4Q0FBOEMsd0JBQXdCO0FBQ3RFLHlEQUF5RCwrQkFBK0I7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtCQUFrQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxpREFBaUQsZ0JBQWdCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHdDQUF3QyxTQUFTO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLGlCQUFpQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsRUFBRTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixlQUFlO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLHlCQUF5QixRQUFRO0FBQ2pDO0FBQ0Esc0JBQXNCLGVBQWU7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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QUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQSxrQ0FBa0MsUUFBUTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBO0FBQ0E7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QUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsMEJBQTBCLFFBQVE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsdUJBQXVCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFdBQVc7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQSx5QkFBeUIsYUFBYTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx5QkFBeUI7QUFDakMsVUFBVSx5QkFBeUI7QUFDbkM7QUFDQSxrREFBa0QsRUFBRTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxrQ0FBa0MsbURBQW1ELEdBQUcsR0FBRztBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsS0FBSztBQUN2QjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixPQUFPO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsS0FBSztBQUMzQjtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQTtBQUNBLG9CQUFvQixlQUFlO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFlBQVk7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsS0FBSztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLE1BQU07QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxNQUFNO0FBQ2Y7QUFDQTtBQUNBLFdBQVcsS0FBSztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQix5QkFBeUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixLQUFLO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixLQUFLO0FBQ2xDO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7O1VDMTFGekI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9rcHJvX3dlYi8uL25vZGVfbW9kdWxlcy9AZXRoZXJzcHJvamVjdC9ieXRlcy9saWIvX3ZlcnNpb24uanMiLCJ3ZWJwYWNrOi8va3Byb193ZWIvLi9ub2RlX21vZHVsZXMvQGV0aGVyc3Byb2plY3QvYnl0ZXMvbGliL2luZGV4LmpzIiwid2VicGFjazovL2twcm9fd2ViLy4vbm9kZV9tb2R1bGVzL0BldGhlcnNwcm9qZWN0L2xvZ2dlci9saWIvX3ZlcnNpb24uanMiLCJ3ZWJwYWNrOi8va3Byb193ZWIvLi9ub2RlX21vZHVsZXMvQGV0aGVyc3Byb2plY3QvbG9nZ2VyL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9rcHJvX3dlYi8uL25vZGVfbW9kdWxlcy9AZXRoZXJzcHJvamVjdC9ybHAvbGliL192ZXJzaW9uLmpzIiwid2VicGFjazovL2twcm9fd2ViLy4vbm9kZV9tb2R1bGVzL0BldGhlcnNwcm9qZWN0L3JscC9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8va3Byb193ZWIvLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwid2VicGFjazovL2twcm9fd2ViLy4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9rcHJvX3dlYi8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovL2twcm9fd2ViLy4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8va3Byb193ZWIvLi9ub2RlX21vZHVsZXMva3Byb2pzLXdlYi1oaWQvbGliLWVzL3RyYW5zcG9ydC13ZWItaGlkLmpzIiwid2VicGFjazovL2twcm9fd2ViLy4vbm9kZV9tb2R1bGVzL2twcm9qcy9saWItZXMvZGV2aWNlLmpzIiwid2VicGFjazovL2twcm9fd2ViLy4vbm9kZV9tb2R1bGVzL2twcm9qcy9saWItZXMvZXJyb3ItaGVscGVycy5qcyIsIndlYnBhY2s6Ly9rcHJvX3dlYi8uL25vZGVfbW9kdWxlcy9rcHJvanMvbGliLWVzL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly9rcHJvX3dlYi8uL25vZGVfbW9kdWxlcy9rcHJvanMvbGliLWVzL2V0aC5qcyIsIndlYnBhY2s6Ly9rcHJvX3dlYi8uL25vZGVfbW9kdWxlcy9rcHJvanMvbGliLWVzL2hpZC1mcmFtaW5nLmpzIiwid2VicGFjazovL2twcm9fd2ViLy4vbm9kZV9tb2R1bGVzL2twcm9qcy9saWItZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8va3Byb193ZWIvLi9ub2RlX21vZHVsZXMva3Byb2pzL2xpYi1lcy9sb2dzLmpzIiwid2VicGFjazovL2twcm9fd2ViLy4vbm9kZV9tb2R1bGVzL2twcm9qcy9saWItZXMvcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly9rcHJvX3dlYi8uL25vZGVfbW9kdWxlcy9rcHJvanMvbGliLWVzL3RyYW5zcG9ydC5qcyIsIndlYnBhY2s6Ly9rcHJvX3dlYi8uL25vZGVfbW9kdWxlcy9rcHJvanMvbGliLWVzL3V0aWxzLmpzIiwid2VicGFjazovL2twcm9fd2ViLy4vYXNzZXRzL2phdmFzY3JpcHQvZmlybXdhcmUudHMiLCJ3ZWJwYWNrOi8va3Byb193ZWIvLi9ub2RlX21vZHVsZXMvYmlnbnVtYmVyLmpzL2JpZ251bWJlci5tanMiLCJ3ZWJwYWNrOi8va3Byb193ZWIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8va3Byb193ZWIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8va3Byb193ZWIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2twcm9fd2ViL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8va3Byb193ZWIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9rcHJvX3dlYi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2twcm9fd2ViL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9rcHJvX3dlYi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnZlcnNpb24gPSB2b2lkIDA7XG5leHBvcnRzLnZlcnNpb24gPSBcImJ5dGVzLzUuNy4wXCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1fdmVyc2lvbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuam9pblNpZ25hdHVyZSA9IGV4cG9ydHMuc3BsaXRTaWduYXR1cmUgPSBleHBvcnRzLmhleFplcm9QYWQgPSBleHBvcnRzLmhleFN0cmlwWmVyb3MgPSBleHBvcnRzLmhleFZhbHVlID0gZXhwb3J0cy5oZXhDb25jYXQgPSBleHBvcnRzLmhleERhdGFTbGljZSA9IGV4cG9ydHMuaGV4RGF0YUxlbmd0aCA9IGV4cG9ydHMuaGV4bGlmeSA9IGV4cG9ydHMuaXNIZXhTdHJpbmcgPSBleHBvcnRzLnplcm9QYWQgPSBleHBvcnRzLnN0cmlwWmVyb3MgPSBleHBvcnRzLmNvbmNhdCA9IGV4cG9ydHMuYXJyYXlpZnkgPSBleHBvcnRzLmlzQnl0ZXMgPSBleHBvcnRzLmlzQnl0ZXNMaWtlID0gdm9pZCAwO1xudmFyIGxvZ2dlcl8xID0gcmVxdWlyZShcIkBldGhlcnNwcm9qZWN0L2xvZ2dlclwiKTtcbnZhciBfdmVyc2lvbl8xID0gcmVxdWlyZShcIi4vX3ZlcnNpb25cIik7XG52YXIgbG9nZ2VyID0gbmV3IGxvZ2dlcl8xLkxvZ2dlcihfdmVyc2lvbl8xLnZlcnNpb24pO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZnVuY3Rpb24gaXNIZXhhYmxlKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhKHZhbHVlLnRvSGV4U3RyaW5nKTtcbn1cbmZ1bmN0aW9uIGFkZFNsaWNlKGFycmF5KSB7XG4gICAgaWYgKGFycmF5LnNsaWNlKSB7XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG4gICAgYXJyYXkuc2xpY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIGFkZFNsaWNlKG5ldyBVaW50OEFycmF5KEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcnJheSwgYXJncykpKTtcbiAgICB9O1xuICAgIHJldHVybiBhcnJheTtcbn1cbmZ1bmN0aW9uIGlzQnl0ZXNMaWtlKHZhbHVlKSB7XG4gICAgcmV0dXJuICgoaXNIZXhTdHJpbmcodmFsdWUpICYmICEodmFsdWUubGVuZ3RoICUgMikpIHx8IGlzQnl0ZXModmFsdWUpKTtcbn1cbmV4cG9ydHMuaXNCeXRlc0xpa2UgPSBpc0J5dGVzTGlrZTtcbmZ1bmN0aW9uIGlzSW50ZWdlcih2YWx1ZSkge1xuICAgIHJldHVybiAodHlwZW9mICh2YWx1ZSkgPT09IFwibnVtYmVyXCIgJiYgdmFsdWUgPT0gdmFsdWUgJiYgKHZhbHVlICUgMSkgPT09IDApO1xufVxuZnVuY3Rpb24gaXNCeXRlcyh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBVaW50OEFycmF5KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWlzSW50ZWdlcih2YWx1ZS5sZW5ndGgpIHx8IHZhbHVlLmxlbmd0aCA8IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB2ID0gdmFsdWVbaV07XG4gICAgICAgIGlmICghaXNJbnRlZ2VyKHYpIHx8IHYgPCAwIHx8IHYgPj0gMjU2KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLmlzQnl0ZXMgPSBpc0J5dGVzO1xuZnVuY3Rpb24gYXJyYXlpZnkodmFsdWUsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgbG9nZ2VyLmNoZWNrU2FmZVVpbnQ1Myh2YWx1ZSwgXCJpbnZhbGlkIGFycmF5aWZ5IHZhbHVlXCIpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHdoaWxlICh2YWx1ZSkge1xuICAgICAgICAgICAgcmVzdWx0LnVuc2hpZnQodmFsdWUgJiAweGZmKTtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VJbnQoU3RyaW5nKHZhbHVlIC8gMjU2KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKDApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhZGRTbGljZShuZXcgVWludDhBcnJheShyZXN1bHQpKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYWxsb3dNaXNzaW5nUHJlZml4ICYmIHR5cGVvZiAodmFsdWUpID09PSBcInN0cmluZ1wiICYmIHZhbHVlLnN1YnN0cmluZygwLCAyKSAhPT0gXCIweFwiKSB7XG4gICAgICAgIHZhbHVlID0gXCIweFwiICsgdmFsdWU7XG4gICAgfVxuICAgIGlmIChpc0hleGFibGUodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudG9IZXhTdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKGlzSGV4U3RyaW5nKHZhbHVlKSkge1xuICAgICAgICB2YXIgaGV4ID0gdmFsdWUuc3Vic3RyaW5nKDIpO1xuICAgICAgICBpZiAoaGV4Lmxlbmd0aCAlIDIpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmhleFBhZCA9PT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICAgICAgICBoZXggPSBcIjBcIiArIGhleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMuaGV4UGFkID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICBoZXggKz0gXCIwXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIudGhyb3dBcmd1bWVudEVycm9yKFwiaGV4IGRhdGEgaXMgb2RkLWxlbmd0aFwiLCBcInZhbHVlXCIsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGV4Lmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwYXJzZUludChoZXguc3Vic3RyaW5nKGksIGkgKyAyKSwgMTYpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWRkU2xpY2UobmV3IFVpbnQ4QXJyYXkocmVzdWx0KSk7XG4gICAgfVxuICAgIGlmIChpc0J5dGVzKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gYWRkU2xpY2UobmV3IFVpbnQ4QXJyYXkodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGxvZ2dlci50aHJvd0FyZ3VtZW50RXJyb3IoXCJpbnZhbGlkIGFycmF5aWZ5IHZhbHVlXCIsIFwidmFsdWVcIiwgdmFsdWUpO1xufVxuZXhwb3J0cy5hcnJheWlmeSA9IGFycmF5aWZ5O1xuZnVuY3Rpb24gY29uY2F0KGl0ZW1zKSB7XG4gICAgdmFyIG9iamVjdHMgPSBpdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGFycmF5aWZ5KGl0ZW0pOyB9KTtcbiAgICB2YXIgbGVuZ3RoID0gb2JqZWN0cy5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtLCBpdGVtKSB7IHJldHVybiAoYWNjdW0gKyBpdGVtLmxlbmd0aCk7IH0sIDApO1xuICAgIHZhciByZXN1bHQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpO1xuICAgIG9iamVjdHMucmVkdWNlKGZ1bmN0aW9uIChvZmZzZXQsIG9iamVjdCkge1xuICAgICAgICByZXN1bHQuc2V0KG9iamVjdCwgb2Zmc2V0KTtcbiAgICAgICAgcmV0dXJuIG9mZnNldCArIG9iamVjdC5sZW5ndGg7XG4gICAgfSwgMCk7XG4gICAgcmV0dXJuIGFkZFNsaWNlKHJlc3VsdCk7XG59XG5leHBvcnRzLmNvbmNhdCA9IGNvbmNhdDtcbmZ1bmN0aW9uIHN0cmlwWmVyb3ModmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gYXJyYXlpZnkodmFsdWUpO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIEZpbmQgdGhlIGZpcnN0IG5vbi16ZXJvIGVudHJ5XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICB3aGlsZSAoc3RhcnQgPCByZXN1bHQubGVuZ3RoICYmIHJlc3VsdFtzdGFydF0gPT09IDApIHtcbiAgICAgICAgc3RhcnQrKztcbiAgICB9XG4gICAgLy8gSWYgd2Ugc3RhcnRlZCB3aXRoIHplcm9zLCBzdHJpcCB0aGVtXG4gICAgaWYgKHN0YXJ0KSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zbGljZShzdGFydCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLnN0cmlwWmVyb3MgPSBzdHJpcFplcm9zO1xuZnVuY3Rpb24gemVyb1BhZCh2YWx1ZSwgbGVuZ3RoKSB7XG4gICAgdmFsdWUgPSBhcnJheWlmeSh2YWx1ZSk7XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA+IGxlbmd0aCkge1xuICAgICAgICBsb2dnZXIudGhyb3dBcmd1bWVudEVycm9yKFwidmFsdWUgb3V0IG9mIHJhbmdlXCIsIFwidmFsdWVcIiwgYXJndW1lbnRzWzBdKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aCk7XG4gICAgcmVzdWx0LnNldCh2YWx1ZSwgbGVuZ3RoIC0gdmFsdWUubGVuZ3RoKTtcbiAgICByZXR1cm4gYWRkU2xpY2UocmVzdWx0KTtcbn1cbmV4cG9ydHMuemVyb1BhZCA9IHplcm9QYWQ7XG5mdW5jdGlvbiBpc0hleFN0cmluZyh2YWx1ZSwgbGVuZ3RoKSB7XG4gICAgaWYgKHR5cGVvZiAodmFsdWUpICE9PSBcInN0cmluZ1wiIHx8ICF2YWx1ZS5tYXRjaCgvXjB4WzAtOUEtRmEtZl0qJC8pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCAmJiB2YWx1ZS5sZW5ndGggIT09IDIgKyAyICogbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLmlzSGV4U3RyaW5nID0gaXNIZXhTdHJpbmc7XG52YXIgSGV4Q2hhcmFjdGVycyA9IFwiMDEyMzQ1Njc4OWFiY2RlZlwiO1xuZnVuY3Rpb24gaGV4bGlmeSh2YWx1ZSwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBsb2dnZXIuY2hlY2tTYWZlVWludDUzKHZhbHVlLCBcImludmFsaWQgaGV4bGlmeSB2YWx1ZVwiKTtcbiAgICAgICAgdmFyIGhleCA9IFwiXCI7XG4gICAgICAgIHdoaWxlICh2YWx1ZSkge1xuICAgICAgICAgICAgaGV4ID0gSGV4Q2hhcmFjdGVyc1t2YWx1ZSAmIDB4Zl0gKyBoZXg7XG4gICAgICAgICAgICB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUgLyAxNik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhleC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoZXgubGVuZ3RoICUgMikge1xuICAgICAgICAgICAgICAgIGhleCA9IFwiMFwiICsgaGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFwiMHhcIiArIGhleDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIweDAwXCI7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gXCJiaWdpbnRcIikge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCAlIDIpIHtcbiAgICAgICAgICAgIHJldHVybiAoXCIweDBcIiArIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIweFwiICsgdmFsdWU7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmFsbG93TWlzc2luZ1ByZWZpeCAmJiB0eXBlb2YgKHZhbHVlKSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS5zdWJzdHJpbmcoMCwgMikgIT09IFwiMHhcIikge1xuICAgICAgICB2YWx1ZSA9IFwiMHhcIiArIHZhbHVlO1xuICAgIH1cbiAgICBpZiAoaXNIZXhhYmxlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUudG9IZXhTdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKGlzSGV4U3RyaW5nKHZhbHVlKSkge1xuICAgICAgICBpZiAodmFsdWUubGVuZ3RoICUgMikge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGV4UGFkID09PSBcImxlZnRcIikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gXCIweDBcIiArIHZhbHVlLnN1YnN0cmluZygyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMuaGV4UGFkID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSBcIjBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci50aHJvd0FyZ3VtZW50RXJyb3IoXCJoZXggZGF0YSBpcyBvZGQtbGVuZ3RoXCIsIFwidmFsdWVcIiwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICBpZiAoaXNCeXRlcyh2YWx1ZSkpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFwiMHhcIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHYgPSB2YWx1ZVtpXTtcbiAgICAgICAgICAgIHJlc3VsdCArPSBIZXhDaGFyYWN0ZXJzWyh2ICYgMHhmMCkgPj4gNF0gKyBIZXhDaGFyYWN0ZXJzW3YgJiAweDBmXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gbG9nZ2VyLnRocm93QXJndW1lbnRFcnJvcihcImludmFsaWQgaGV4bGlmeSB2YWx1ZVwiLCBcInZhbHVlXCIsIHZhbHVlKTtcbn1cbmV4cG9ydHMuaGV4bGlmeSA9IGhleGxpZnk7XG4vKlxuZnVuY3Rpb24gdW5vZGRpZnkodmFsdWU6IEJ5dGVzTGlrZSB8IEhleGFibGUgfCBudW1iZXIpOiBCeXRlc0xpa2UgfCBIZXhhYmxlIHwgbnVtYmVyIHtcbiAgICBpZiAodHlwZW9mKHZhbHVlKSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS5sZW5ndGggJSAyICYmIHZhbHVlLnN1YnN0cmluZygwLCAyKSA9PT0gXCIweFwiKSB7XG4gICAgICAgIHJldHVybiBcIjB4MFwiICsgdmFsdWUuc3Vic3RyaW5nKDIpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG4qL1xuZnVuY3Rpb24gaGV4RGF0YUxlbmd0aChkYXRhKSB7XG4gICAgaWYgKHR5cGVvZiAoZGF0YSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgZGF0YSA9IGhleGxpZnkoZGF0YSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFpc0hleFN0cmluZyhkYXRhKSB8fCAoZGF0YS5sZW5ndGggJSAyKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChkYXRhLmxlbmd0aCAtIDIpIC8gMjtcbn1cbmV4cG9ydHMuaGV4RGF0YUxlbmd0aCA9IGhleERhdGFMZW5ndGg7XG5mdW5jdGlvbiBoZXhEYXRhU2xpY2UoZGF0YSwgb2Zmc2V0LCBlbmRPZmZzZXQpIHtcbiAgICBpZiAodHlwZW9mIChkYXRhKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBkYXRhID0gaGV4bGlmeShkYXRhKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWlzSGV4U3RyaW5nKGRhdGEpIHx8IChkYXRhLmxlbmd0aCAlIDIpKSB7XG4gICAgICAgIGxvZ2dlci50aHJvd0FyZ3VtZW50RXJyb3IoXCJpbnZhbGlkIGhleERhdGFcIiwgXCJ2YWx1ZVwiLCBkYXRhKTtcbiAgICB9XG4gICAgb2Zmc2V0ID0gMiArIDIgKiBvZmZzZXQ7XG4gICAgaWYgKGVuZE9mZnNldCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBcIjB4XCIgKyBkYXRhLnN1YnN0cmluZyhvZmZzZXQsIDIgKyAyICogZW5kT2Zmc2V0KTtcbiAgICB9XG4gICAgcmV0dXJuIFwiMHhcIiArIGRhdGEuc3Vic3RyaW5nKG9mZnNldCk7XG59XG5leHBvcnRzLmhleERhdGFTbGljZSA9IGhleERhdGFTbGljZTtcbmZ1bmN0aW9uIGhleENvbmNhdChpdGVtcykge1xuICAgIHZhciByZXN1bHQgPSBcIjB4XCI7XG4gICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXN1bHQgKz0gaGV4bGlmeShpdGVtKS5zdWJzdHJpbmcoMik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuaGV4Q29uY2F0ID0gaGV4Q29uY2F0O1xuZnVuY3Rpb24gaGV4VmFsdWUodmFsdWUpIHtcbiAgICB2YXIgdHJpbW1lZCA9IGhleFN0cmlwWmVyb3MoaGV4bGlmeSh2YWx1ZSwgeyBoZXhQYWQ6IFwibGVmdFwiIH0pKTtcbiAgICBpZiAodHJpbW1lZCA9PT0gXCIweFwiKSB7XG4gICAgICAgIHJldHVybiBcIjB4MFwiO1xuICAgIH1cbiAgICByZXR1cm4gdHJpbW1lZDtcbn1cbmV4cG9ydHMuaGV4VmFsdWUgPSBoZXhWYWx1ZTtcbmZ1bmN0aW9uIGhleFN0cmlwWmVyb3ModmFsdWUpIHtcbiAgICBpZiAodHlwZW9mICh2YWx1ZSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFsdWUgPSBoZXhsaWZ5KHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKCFpc0hleFN0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgbG9nZ2VyLnRocm93QXJndW1lbnRFcnJvcihcImludmFsaWQgaGV4IHN0cmluZ1wiLCBcInZhbHVlXCIsIHZhbHVlKTtcbiAgICB9XG4gICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMik7XG4gICAgdmFyIG9mZnNldCA9IDA7XG4gICAgd2hpbGUgKG9mZnNldCA8IHZhbHVlLmxlbmd0aCAmJiB2YWx1ZVtvZmZzZXRdID09PSBcIjBcIikge1xuICAgICAgICBvZmZzZXQrKztcbiAgICB9XG4gICAgcmV0dXJuIFwiMHhcIiArIHZhbHVlLnN1YnN0cmluZyhvZmZzZXQpO1xufVxuZXhwb3J0cy5oZXhTdHJpcFplcm9zID0gaGV4U3RyaXBaZXJvcztcbmZ1bmN0aW9uIGhleFplcm9QYWQodmFsdWUsIGxlbmd0aCkge1xuICAgIGlmICh0eXBlb2YgKHZhbHVlKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YWx1ZSA9IGhleGxpZnkodmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIGlmICghaXNIZXhTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIGxvZ2dlci50aHJvd0FyZ3VtZW50RXJyb3IoXCJpbnZhbGlkIGhleCBzdHJpbmdcIiwgXCJ2YWx1ZVwiLCB2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5sZW5ndGggPiAyICogbGVuZ3RoICsgMikge1xuICAgICAgICBsb2dnZXIudGhyb3dBcmd1bWVudEVycm9yKFwidmFsdWUgb3V0IG9mIHJhbmdlXCIsIFwidmFsdWVcIiwgYXJndW1lbnRzWzFdKTtcbiAgICB9XG4gICAgd2hpbGUgKHZhbHVlLmxlbmd0aCA8IDIgKiBsZW5ndGggKyAyKSB7XG4gICAgICAgIHZhbHVlID0gXCIweDBcIiArIHZhbHVlLnN1YnN0cmluZygyKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZXhwb3J0cy5oZXhaZXJvUGFkID0gaGV4WmVyb1BhZDtcbmZ1bmN0aW9uIHNwbGl0U2lnbmF0dXJlKHNpZ25hdHVyZSkge1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHI6IFwiMHhcIixcbiAgICAgICAgczogXCIweFwiLFxuICAgICAgICBfdnM6IFwiMHhcIixcbiAgICAgICAgcmVjb3ZlcnlQYXJhbTogMCxcbiAgICAgICAgdjogMCxcbiAgICAgICAgeVBhcml0eUFuZFM6IFwiMHhcIixcbiAgICAgICAgY29tcGFjdDogXCIweFwiXG4gICAgfTtcbiAgICBpZiAoaXNCeXRlc0xpa2Uoc2lnbmF0dXJlKSkge1xuICAgICAgICB2YXIgYnl0ZXMgPSBhcnJheWlmeShzaWduYXR1cmUpO1xuICAgICAgICAvLyBHZXQgdGhlIHIsIHMgYW5kIHZcbiAgICAgICAgaWYgKGJ5dGVzLmxlbmd0aCA9PT0gNjQpIHtcbiAgICAgICAgICAgIC8vIEVJUC0yMDk4OyBwdWxsIHRoZSB2IGZyb20gdGhlIHRvcCBiaXQgb2YgcyBhbmQgY2xlYXIgaXRcbiAgICAgICAgICAgIHJlc3VsdC52ID0gMjcgKyAoYnl0ZXNbMzJdID4+IDcpO1xuICAgICAgICAgICAgYnl0ZXNbMzJdICY9IDB4N2Y7XG4gICAgICAgICAgICByZXN1bHQuciA9IGhleGxpZnkoYnl0ZXMuc2xpY2UoMCwgMzIpKTtcbiAgICAgICAgICAgIHJlc3VsdC5zID0gaGV4bGlmeShieXRlcy5zbGljZSgzMiwgNjQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChieXRlcy5sZW5ndGggPT09IDY1KSB7XG4gICAgICAgICAgICByZXN1bHQuciA9IGhleGxpZnkoYnl0ZXMuc2xpY2UoMCwgMzIpKTtcbiAgICAgICAgICAgIHJlc3VsdC5zID0gaGV4bGlmeShieXRlcy5zbGljZSgzMiwgNjQpKTtcbiAgICAgICAgICAgIHJlc3VsdC52ID0gYnl0ZXNbNjRdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbG9nZ2VyLnRocm93QXJndW1lbnRFcnJvcihcImludmFsaWQgc2lnbmF0dXJlIHN0cmluZ1wiLCBcInNpZ25hdHVyZVwiLCBzaWduYXR1cmUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFsbG93IGEgcmVjaWQgdG8gYmUgdXNlZCBhcyB0aGUgdlxuICAgICAgICBpZiAocmVzdWx0LnYgPCAyNykge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC52ID09PSAwIHx8IHJlc3VsdC52ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnYgKz0gMjc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIudGhyb3dBcmd1bWVudEVycm9yKFwic2lnbmF0dXJlIGludmFsaWQgdiBieXRlXCIsIFwic2lnbmF0dXJlXCIsIHNpZ25hdHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ29tcHV0ZSByZWNvdmVyeVBhcmFtIGZyb20gdlxuICAgICAgICByZXN1bHQucmVjb3ZlcnlQYXJhbSA9IDEgLSAocmVzdWx0LnYgJSAyKTtcbiAgICAgICAgLy8gQ29tcHV0ZSBfdnMgZnJvbSByZWNvdmVyeVBhcmFtIGFuZCBzXG4gICAgICAgIGlmIChyZXN1bHQucmVjb3ZlcnlQYXJhbSkge1xuICAgICAgICAgICAgYnl0ZXNbMzJdIHw9IDB4ODA7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0Ll92cyA9IGhleGxpZnkoYnl0ZXMuc2xpY2UoMzIsIDY0KSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQuciA9IHNpZ25hdHVyZS5yO1xuICAgICAgICByZXN1bHQucyA9IHNpZ25hdHVyZS5zO1xuICAgICAgICByZXN1bHQudiA9IHNpZ25hdHVyZS52O1xuICAgICAgICByZXN1bHQucmVjb3ZlcnlQYXJhbSA9IHNpZ25hdHVyZS5yZWNvdmVyeVBhcmFtO1xuICAgICAgICByZXN1bHQuX3ZzID0gc2lnbmF0dXJlLl92cztcbiAgICAgICAgLy8gSWYgdGhlIF92cyBpcyBhdmFpbGFibGUsIHVzZSBpdCB0byBwb3B1bGF0ZSBtaXNzaW5nIHMsIHYgYW5kIHJlY292ZXJ5UGFyYW1cbiAgICAgICAgLy8gYW5kIHZlcmlmeSBub24tbWlzc2luZyBzLCB2IGFuZCByZWNvdmVyeVBhcmFtXG4gICAgICAgIGlmIChyZXN1bHQuX3ZzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciB2c18xID0gemVyb1BhZChhcnJheWlmeShyZXN1bHQuX3ZzKSwgMzIpO1xuICAgICAgICAgICAgcmVzdWx0Ll92cyA9IGhleGxpZnkodnNfMSk7XG4gICAgICAgICAgICAvLyBTZXQgb3IgY2hlY2sgdGhlIHJlY2lkXG4gICAgICAgICAgICB2YXIgcmVjb3ZlcnlQYXJhbSA9ICgodnNfMVswXSA+PSAxMjgpID8gMSA6IDApO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5yZWNvdmVyeVBhcmFtID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucmVjb3ZlcnlQYXJhbSA9IHJlY292ZXJ5UGFyYW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQucmVjb3ZlcnlQYXJhbSAhPT0gcmVjb3ZlcnlQYXJhbSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci50aHJvd0FyZ3VtZW50RXJyb3IoXCJzaWduYXR1cmUgcmVjb3ZlcnlQYXJhbSBtaXNtYXRjaCBfdnNcIiwgXCJzaWduYXR1cmVcIiwgc2lnbmF0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldCBvciBjaGVjayB0aGUgc1xuICAgICAgICAgICAgdnNfMVswXSAmPSAweDdmO1xuICAgICAgICAgICAgdmFyIHMgPSBoZXhsaWZ5KHZzXzEpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucyA9IHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQucyAhPT0gcykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci50aHJvd0FyZ3VtZW50RXJyb3IoXCJzaWduYXR1cmUgdiBtaXNtYXRjaCBfdnNcIiwgXCJzaWduYXR1cmVcIiwgc2lnbmF0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBVc2UgcmVjaWQgYW5kIHYgdG8gcG9wdWxhdGUgZWFjaCBvdGhlclxuICAgICAgICBpZiAocmVzdWx0LnJlY292ZXJ5UGFyYW0gPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC52ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIudGhyb3dBcmd1bWVudEVycm9yKFwic2lnbmF0dXJlIG1pc3NpbmcgdiBhbmQgcmVjb3ZlcnlQYXJhbVwiLCBcInNpZ25hdHVyZVwiLCBzaWduYXR1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0LnYgPT09IDAgfHwgcmVzdWx0LnYgPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucmVjb3ZlcnlQYXJhbSA9IHJlc3VsdC52O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnJlY292ZXJ5UGFyYW0gPSAxIC0gKHJlc3VsdC52ICUgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnYgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC52ID0gMjcgKyByZXN1bHQucmVjb3ZlcnlQYXJhbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciByZWNJZCA9IChyZXN1bHQudiA9PT0gMCB8fCByZXN1bHQudiA9PT0gMSkgPyByZXN1bHQudiA6ICgxIC0gKHJlc3VsdC52ICUgMikpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVjb3ZlcnlQYXJhbSAhPT0gcmVjSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLnRocm93QXJndW1lbnRFcnJvcihcInNpZ25hdHVyZSByZWNvdmVyeVBhcmFtIG1pc21hdGNoIHZcIiwgXCJzaWduYXR1cmVcIiwgc2lnbmF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5yID09IG51bGwgfHwgIWlzSGV4U3RyaW5nKHJlc3VsdC5yKSkge1xuICAgICAgICAgICAgbG9nZ2VyLnRocm93QXJndW1lbnRFcnJvcihcInNpZ25hdHVyZSBtaXNzaW5nIG9yIGludmFsaWQgclwiLCBcInNpZ25hdHVyZVwiLCBzaWduYXR1cmUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LnIgPSBoZXhaZXJvUGFkKHJlc3VsdC5yLCAzMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5zID09IG51bGwgfHwgIWlzSGV4U3RyaW5nKHJlc3VsdC5zKSkge1xuICAgICAgICAgICAgbG9nZ2VyLnRocm93QXJndW1lbnRFcnJvcihcInNpZ25hdHVyZSBtaXNzaW5nIG9yIGludmFsaWQgc1wiLCBcInNpZ25hdHVyZVwiLCBzaWduYXR1cmUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LnMgPSBoZXhaZXJvUGFkKHJlc3VsdC5zLCAzMik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZzID0gYXJyYXlpZnkocmVzdWx0LnMpO1xuICAgICAgICBpZiAodnNbMF0gPj0gMTI4KSB7XG4gICAgICAgICAgICBsb2dnZXIudGhyb3dBcmd1bWVudEVycm9yKFwic2lnbmF0dXJlIHMgb3V0IG9mIHJhbmdlXCIsIFwic2lnbmF0dXJlXCIsIHNpZ25hdHVyZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5yZWNvdmVyeVBhcmFtKSB7XG4gICAgICAgICAgICB2c1swXSB8PSAweDgwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfdnMgPSBoZXhsaWZ5KHZzKTtcbiAgICAgICAgaWYgKHJlc3VsdC5fdnMpIHtcbiAgICAgICAgICAgIGlmICghaXNIZXhTdHJpbmcocmVzdWx0Ll92cykpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIudGhyb3dBcmd1bWVudEVycm9yKFwic2lnbmF0dXJlIGludmFsaWQgX3ZzXCIsIFwic2lnbmF0dXJlXCIsIHNpZ25hdHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQuX3ZzID0gaGV4WmVyb1BhZChyZXN1bHQuX3ZzLCAzMik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2V0IG9yIGNoZWNrIHRoZSBfdnNcbiAgICAgICAgaWYgKHJlc3VsdC5fdnMgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0Ll92cyA9IF92cztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZXN1bHQuX3ZzICE9PSBfdnMpIHtcbiAgICAgICAgICAgIGxvZ2dlci50aHJvd0FyZ3VtZW50RXJyb3IoXCJzaWduYXR1cmUgX3ZzIG1pc21hdGNoIHYgYW5kIHNcIiwgXCJzaWduYXR1cmVcIiwgc2lnbmF0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQueVBhcml0eUFuZFMgPSByZXN1bHQuX3ZzO1xuICAgIHJlc3VsdC5jb21wYWN0ID0gcmVzdWx0LnIgKyByZXN1bHQueVBhcml0eUFuZFMuc3Vic3RyaW5nKDIpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLnNwbGl0U2lnbmF0dXJlID0gc3BsaXRTaWduYXR1cmU7XG5mdW5jdGlvbiBqb2luU2lnbmF0dXJlKHNpZ25hdHVyZSkge1xuICAgIHNpZ25hdHVyZSA9IHNwbGl0U2lnbmF0dXJlKHNpZ25hdHVyZSk7XG4gICAgcmV0dXJuIGhleGxpZnkoY29uY2F0KFtcbiAgICAgICAgc2lnbmF0dXJlLnIsXG4gICAgICAgIHNpZ25hdHVyZS5zLFxuICAgICAgICAoc2lnbmF0dXJlLnJlY292ZXJ5UGFyYW0gPyBcIjB4MWNcIiA6IFwiMHgxYlwiKVxuICAgIF0pKTtcbn1cbmV4cG9ydHMuam9pblNpZ25hdHVyZSA9IGpvaW5TaWduYXR1cmU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudmVyc2lvbiA9IHZvaWQgMDtcbmV4cG9ydHMudmVyc2lvbiA9IFwibG9nZ2VyLzUuNy4wXCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1fdmVyc2lvbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuTG9nZ2VyID0gZXhwb3J0cy5FcnJvckNvZGUgPSBleHBvcnRzLkxvZ0xldmVsID0gdm9pZCAwO1xudmFyIF9wZXJtYW5lbnRDZW5zb3JFcnJvcnMgPSBmYWxzZTtcbnZhciBfY2Vuc29yRXJyb3JzID0gZmFsc2U7XG52YXIgTG9nTGV2ZWxzID0geyBkZWJ1ZzogMSwgXCJkZWZhdWx0XCI6IDIsIGluZm86IDIsIHdhcm5pbmc6IDMsIGVycm9yOiA0LCBvZmY6IDUgfTtcbnZhciBfbG9nTGV2ZWwgPSBMb2dMZXZlbHNbXCJkZWZhdWx0XCJdO1xudmFyIF92ZXJzaW9uXzEgPSByZXF1aXJlKFwiLi9fdmVyc2lvblwiKTtcbnZhciBfZ2xvYmFsTG9nZ2VyID0gbnVsbDtcbmZ1bmN0aW9uIF9jaGVja05vcm1hbGl6ZSgpIHtcbiAgICB0cnkge1xuICAgICAgICB2YXIgbWlzc2luZ18xID0gW107XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBhbGwgZm9ybXMgb2Ygbm9ybWFsaXphdGlvbiBhcmUgc3VwcG9ydGVkXG4gICAgICAgIFtcIk5GRFwiLCBcIk5GQ1wiLCBcIk5GS0RcIiwgXCJORktDXCJdLmZvckVhY2goZnVuY3Rpb24gKGZvcm0pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKFwidGVzdFwiLm5vcm1hbGl6ZShmb3JtKSAhPT0gXCJ0ZXN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYmFkIG5vcm1hbGl6ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgbWlzc2luZ18xLnB1c2goZm9ybSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobWlzc2luZ18xLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibWlzc2luZyBcIiArIG1pc3NpbmdfMS5qb2luKFwiLCBcIikpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZTkpLm5vcm1hbGl6ZShcIk5GRFwiKSAhPT0gU3RyaW5nLmZyb21DaGFyQ29kZSgweDY1LCAweDAzMDEpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJicm9rZW4gaW1wbGVtZW50YXRpb25cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBlcnJvci5tZXNzYWdlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbnZhciBfbm9ybWFsaXplRXJyb3IgPSBfY2hlY2tOb3JtYWxpemUoKTtcbnZhciBMb2dMZXZlbDtcbihmdW5jdGlvbiAoTG9nTGV2ZWwpIHtcbiAgICBMb2dMZXZlbFtcIkRFQlVHXCJdID0gXCJERUJVR1wiO1xuICAgIExvZ0xldmVsW1wiSU5GT1wiXSA9IFwiSU5GT1wiO1xuICAgIExvZ0xldmVsW1wiV0FSTklOR1wiXSA9IFwiV0FSTklOR1wiO1xuICAgIExvZ0xldmVsW1wiRVJST1JcIl0gPSBcIkVSUk9SXCI7XG4gICAgTG9nTGV2ZWxbXCJPRkZcIl0gPSBcIk9GRlwiO1xufSkoTG9nTGV2ZWwgPSBleHBvcnRzLkxvZ0xldmVsIHx8IChleHBvcnRzLkxvZ0xldmVsID0ge30pKTtcbnZhciBFcnJvckNvZGU7XG4oZnVuY3Rpb24gKEVycm9yQ29kZSkge1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBHZW5lcmljIEVycm9yc1xuICAgIC8vIFVua25vd24gRXJyb3JcbiAgICBFcnJvckNvZGVbXCJVTktOT1dOX0VSUk9SXCJdID0gXCJVTktOT1dOX0VSUk9SXCI7XG4gICAgLy8gTm90IEltcGxlbWVudGVkXG4gICAgRXJyb3JDb2RlW1wiTk9UX0lNUExFTUVOVEVEXCJdID0gXCJOT1RfSU1QTEVNRU5URURcIjtcbiAgICAvLyBVbnN1cHBvcnRlZCBPcGVyYXRpb25cbiAgICAvLyAgIC0gb3BlcmF0aW9uXG4gICAgRXJyb3JDb2RlW1wiVU5TVVBQT1JURURfT1BFUkFUSU9OXCJdID0gXCJVTlNVUFBPUlRFRF9PUEVSQVRJT05cIjtcbiAgICAvLyBOZXR3b3JrIEVycm9yIChpLmUuIEV0aGVyZXVtIE5ldHdvcmssIHN1Y2ggYXMgYW4gaW52YWxpZCBjaGFpbiBJRClcbiAgICAvLyAgIC0gZXZlbnQgKFwibm9OZXR3b3JrXCIgaXMgbm90IHJlLXRocm93biBpbiBwcm92aWRlci5yZWFkeTsgb3RoZXJ3aXNlIHRocm93bilcbiAgICBFcnJvckNvZGVbXCJORVRXT1JLX0VSUk9SXCJdID0gXCJORVRXT1JLX0VSUk9SXCI7XG4gICAgLy8gU29tZSBzb3J0IG9mIGJhZCByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXJcbiAgICBFcnJvckNvZGVbXCJTRVJWRVJfRVJST1JcIl0gPSBcIlNFUlZFUl9FUlJPUlwiO1xuICAgIC8vIFRpbWVvdXRcbiAgICBFcnJvckNvZGVbXCJUSU1FT1VUXCJdID0gXCJUSU1FT1VUXCI7XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIE9wZXJhdGlvbmFsICBFcnJvcnNcbiAgICAvLyBCdWZmZXIgT3ZlcnJ1blxuICAgIEVycm9yQ29kZVtcIkJVRkZFUl9PVkVSUlVOXCJdID0gXCJCVUZGRVJfT1ZFUlJVTlwiO1xuICAgIC8vIE51bWVyaWMgRmF1bHRcbiAgICAvLyAgIC0gb3BlcmF0aW9uOiB0aGUgb3BlcmF0aW9uIGJlaW5nIGV4ZWN1dGVkXG4gICAgLy8gICAtIGZhdWx0OiB0aGUgcmVhc29uIHRoaXMgZmF1bHRlZFxuICAgIEVycm9yQ29kZVtcIk5VTUVSSUNfRkFVTFRcIl0gPSBcIk5VTUVSSUNfRkFVTFRcIjtcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gQXJndW1lbnQgRXJyb3JzXG4gICAgLy8gTWlzc2luZyBuZXcgb3BlcmF0b3IgdG8gYW4gb2JqZWN0XG4gICAgLy8gIC0gbmFtZTogVGhlIG5hbWUgb2YgdGhlIGNsYXNzXG4gICAgRXJyb3JDb2RlW1wiTUlTU0lOR19ORVdcIl0gPSBcIk1JU1NJTkdfTkVXXCI7XG4gICAgLy8gSW52YWxpZCBhcmd1bWVudCAoZS5nLiB2YWx1ZSBpcyBpbmNvbXBhdGlibGUgd2l0aCB0eXBlKSB0byBhIGZ1bmN0aW9uOlxuICAgIC8vICAgLSBhcmd1bWVudDogVGhlIGFyZ3VtZW50IG5hbWUgdGhhdCB3YXMgaW52YWxpZFxuICAgIC8vICAgLSB2YWx1ZTogVGhlIHZhbHVlIG9mIHRoZSBhcmd1bWVudFxuICAgIEVycm9yQ29kZVtcIklOVkFMSURfQVJHVU1FTlRcIl0gPSBcIklOVkFMSURfQVJHVU1FTlRcIjtcbiAgICAvLyBNaXNzaW5nIGFyZ3VtZW50IHRvIGEgZnVuY3Rpb246XG4gICAgLy8gICAtIGNvdW50OiBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyByZWNlaXZlZFxuICAgIC8vICAgLSBleHBlY3RlZENvdW50OiBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyBleHBlY3RlZFxuICAgIEVycm9yQ29kZVtcIk1JU1NJTkdfQVJHVU1FTlRcIl0gPSBcIk1JU1NJTkdfQVJHVU1FTlRcIjtcbiAgICAvLyBUb28gbWFueSBhcmd1bWVudHNcbiAgICAvLyAgIC0gY291bnQ6IFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHJlY2VpdmVkXG4gICAgLy8gICAtIGV4cGVjdGVkQ291bnQ6IFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIGV4cGVjdGVkXG4gICAgRXJyb3JDb2RlW1wiVU5FWFBFQ1RFRF9BUkdVTUVOVFwiXSA9IFwiVU5FWFBFQ1RFRF9BUkdVTUVOVFwiO1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBCbG9ja2NoYWluIEVycm9yc1xuICAgIC8vIENhbGwgZXhjZXB0aW9uXG4gICAgLy8gIC0gdHJhbnNhY3Rpb246IHRoZSB0cmFuc2FjdGlvblxuICAgIC8vICAtIGFkZHJlc3M/OiB0aGUgY29udHJhY3QgYWRkcmVzc1xuICAgIC8vICAtIGFyZ3M/OiBUaGUgYXJndW1lbnRzIHBhc3NlZCBpbnRvIHRoZSBmdW5jdGlvblxuICAgIC8vICAtIG1ldGhvZD86IFRoZSBTb2xpZGl0eSBtZXRob2Qgc2lnbmF0dXJlXG4gICAgLy8gIC0gZXJyb3JTaWduYXR1cmU/OiBUaGUgRUlQODQ4IGVycm9yIHNpZ25hdHVyZVxuICAgIC8vICAtIGVycm9yQXJncz86IFRoZSBFSVA4NDggZXJyb3IgcGFyYW1ldGVyc1xuICAgIC8vICAtIHJlYXNvbjogVGhlIHJlYXNvbiAob25seSBmb3IgRUlQODQ4IFwiRXJyb3Ioc3RyaW5nKVwiKVxuICAgIEVycm9yQ29kZVtcIkNBTExfRVhDRVBUSU9OXCJdID0gXCJDQUxMX0VYQ0VQVElPTlwiO1xuICAgIC8vIEluc3VmZmljaWVudCBmdW5kcyAoPCB2YWx1ZSArIGdhc0xpbWl0ICogZ2FzUHJpY2UpXG4gICAgLy8gICAtIHRyYW5zYWN0aW9uOiB0aGUgdHJhbnNhY3Rpb24gYXR0ZW1wdGVkXG4gICAgRXJyb3JDb2RlW1wiSU5TVUZGSUNJRU5UX0ZVTkRTXCJdID0gXCJJTlNVRkZJQ0lFTlRfRlVORFNcIjtcbiAgICAvLyBOb25jZSBoYXMgYWxyZWFkeSBiZWVuIHVzZWRcbiAgICAvLyAgIC0gdHJhbnNhY3Rpb246IHRoZSB0cmFuc2FjdGlvbiBhdHRlbXB0ZWRcbiAgICBFcnJvckNvZGVbXCJOT05DRV9FWFBJUkVEXCJdID0gXCJOT05DRV9FWFBJUkVEXCI7XG4gICAgLy8gVGhlIHJlcGxhY2VtZW50IGZlZSBmb3IgdGhlIHRyYW5zYWN0aW9uIGlzIHRvbyBsb3dcbiAgICAvLyAgIC0gdHJhbnNhY3Rpb246IHRoZSB0cmFuc2FjdGlvbiBhdHRlbXB0ZWRcbiAgICBFcnJvckNvZGVbXCJSRVBMQUNFTUVOVF9VTkRFUlBSSUNFRFwiXSA9IFwiUkVQTEFDRU1FTlRfVU5ERVJQUklDRURcIjtcbiAgICAvLyBUaGUgZ2FzIGxpbWl0IGNvdWxkIG5vdCBiZSBlc3RpbWF0ZWRcbiAgICAvLyAgIC0gdHJhbnNhY3Rpb246IHRoZSB0cmFuc2FjdGlvbiBwYXNzZWQgdG8gZXN0aW1hdGVHYXNcbiAgICBFcnJvckNvZGVbXCJVTlBSRURJQ1RBQkxFX0dBU19MSU1JVFwiXSA9IFwiVU5QUkVESUNUQUJMRV9HQVNfTElNSVRcIjtcbiAgICAvLyBUaGUgdHJhbnNhY3Rpb24gd2FzIHJlcGxhY2VkIGJ5IG9uZSB3aXRoIGEgaGlnaGVyIGdhcyBwcmljZVxuICAgIC8vICAgLSByZWFzb246IFwiY2FuY2VsbGVkXCIsIFwicmVwbGFjZWRcIiBvciBcInJlcHJpY2VkXCJcbiAgICAvLyAgIC0gY2FuY2VsbGVkOiB0cnVlIGlmIHJlYXNvbiA9PSBcImNhbmNlbGxlZFwiIG9yIHJlYXNvbiA9PSBcInJlcGxhY2VkXCIpXG4gICAgLy8gICAtIGhhc2g6IG9yaWdpbmFsIHRyYW5zYWN0aW9uIGhhc2hcbiAgICAvLyAgIC0gcmVwbGFjZW1lbnQ6IHRoZSBmdWxsIFRyYW5zYWN0aW9uc1Jlc3BvbnNlIGZvciB0aGUgcmVwbGFjZW1lbnRcbiAgICAvLyAgIC0gcmVjZWlwdDogdGhlIHJlY2VpcHQgb2YgdGhlIHJlcGxhY2VtZW50XG4gICAgRXJyb3JDb2RlW1wiVFJBTlNBQ1RJT05fUkVQTEFDRURcIl0gPSBcIlRSQU5TQUNUSU9OX1JFUExBQ0VEXCI7XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIEludGVyYWN0aW9uIEVycm9yc1xuICAgIC8vIFRoZSB1c2VyIHJlamVjdGVkIHRoZSBhY3Rpb24sIHN1Y2ggYXMgc2lnbmluZyBhIG1lc3NhZ2Ugb3Igc2VuZGluZ1xuICAgIC8vIGEgdHJhbnNhY3Rpb25cbiAgICBFcnJvckNvZGVbXCJBQ1RJT05fUkVKRUNURURcIl0gPSBcIkFDVElPTl9SRUpFQ1RFRFwiO1xufSkoRXJyb3JDb2RlID0gZXhwb3J0cy5FcnJvckNvZGUgfHwgKGV4cG9ydHMuRXJyb3JDb2RlID0ge30pKTtcbjtcbnZhciBIRVggPSBcIjAxMjM0NTY3ODlhYmNkZWZcIjtcbnZhciBMb2dnZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTG9nZ2VyKHZlcnNpb24pIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwidmVyc2lvblwiLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IHZlcnNpb24sXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIExvZ2dlci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uIChsb2dMZXZlbCwgYXJncykge1xuICAgICAgICB2YXIgbGV2ZWwgPSBsb2dMZXZlbC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoTG9nTGV2ZWxzW2xldmVsXSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93QXJndW1lbnRFcnJvcihcImludmFsaWQgbG9nIGxldmVsIG5hbWVcIiwgXCJsb2dMZXZlbFwiLCBsb2dMZXZlbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9sb2dMZXZlbCA+IExvZ0xldmVsc1tsZXZlbF0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgICB9O1xuICAgIExvZ2dlci5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbG9nKExvZ2dlci5sZXZlbHMuREVCVUcsIGFyZ3MpO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5pbmZvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xvZyhMb2dnZXIubGV2ZWxzLklORk8sIGFyZ3MpO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS53YXJuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xvZyhMb2dnZXIubGV2ZWxzLldBUk5JTkcsIGFyZ3MpO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5tYWtlRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSwgY29kZSwgcGFyYW1zKSB7XG4gICAgICAgIC8vIEVycm9ycyBhcmUgYmVpbmcgY2Vuc29yZWRcbiAgICAgICAgaWYgKF9jZW5zb3JFcnJvcnMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1ha2VFcnJvcihcImNlbnNvcmVkIGVycm9yXCIsIGNvZGUsIHt9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNvZGUpIHtcbiAgICAgICAgICAgIGNvZGUgPSBMb2dnZXIuZXJyb3JzLlVOS05PV05fRVJST1I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwYXJhbXMpIHtcbiAgICAgICAgICAgIHBhcmFtcyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZXNzYWdlRGV0YWlscyA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1zW2tleV07XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhleCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhleCArPSBIRVhbdmFsdWVbaV0gPj4gNF07XG4gICAgICAgICAgICAgICAgICAgICAgICBoZXggKz0gSEVYW3ZhbHVlW2ldICYgMHgwZl07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZURldGFpbHMucHVzaChrZXkgKyBcIj1VaW50OEFycmF5KDB4XCIgKyBoZXggKyBcIilcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlRGV0YWlscy5wdXNoKGtleSArIFwiPVwiICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlRGV0YWlscy5wdXNoKGtleSArIFwiPVwiICsgSlNPTi5zdHJpbmdpZnkocGFyYW1zW2tleV0udG9TdHJpbmcoKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbWVzc2FnZURldGFpbHMucHVzaChcImNvZGU9XCIgKyBjb2RlKTtcbiAgICAgICAgbWVzc2FnZURldGFpbHMucHVzaChcInZlcnNpb249XCIgKyB0aGlzLnZlcnNpb24pO1xuICAgICAgICB2YXIgcmVhc29uID0gbWVzc2FnZTtcbiAgICAgICAgdmFyIHVybCA9IFwiXCI7XG4gICAgICAgIHN3aXRjaCAoY29kZSkge1xuICAgICAgICAgICAgY2FzZSBFcnJvckNvZGUuTlVNRVJJQ19GQVVMVDoge1xuICAgICAgICAgICAgICAgIHVybCA9IFwiTlVNRVJJQ19GQVVMVFwiO1xuICAgICAgICAgICAgICAgIHZhciBmYXVsdCA9IG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChmYXVsdCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwib3ZlcmZsb3dcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInVuZGVyZmxvd1wiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZGl2aXNpb24tYnktemVyb1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsICs9IFwiLVwiICsgZmF1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5lZ2F0aXZlLXBvd2VyXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuZWdhdGl2ZS13aWR0aFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsICs9IFwiLXVuc3VwcG9ydGVkXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInVuYm91bmQtYml0d2lzZS1yZXN1bHRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCArPSBcIi11bmJvdW5kLXJlc3VsdFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBFcnJvckNvZGUuQ0FMTF9FWENFUFRJT046XG4gICAgICAgICAgICBjYXNlIEVycm9yQ29kZS5JTlNVRkZJQ0lFTlRfRlVORFM6XG4gICAgICAgICAgICBjYXNlIEVycm9yQ29kZS5NSVNTSU5HX05FVzpcbiAgICAgICAgICAgIGNhc2UgRXJyb3JDb2RlLk5PTkNFX0VYUElSRUQ6XG4gICAgICAgICAgICBjYXNlIEVycm9yQ29kZS5SRVBMQUNFTUVOVF9VTkRFUlBSSUNFRDpcbiAgICAgICAgICAgIGNhc2UgRXJyb3JDb2RlLlRSQU5TQUNUSU9OX1JFUExBQ0VEOlxuICAgICAgICAgICAgY2FzZSBFcnJvckNvZGUuVU5QUkVESUNUQUJMRV9HQVNfTElNSVQ6XG4gICAgICAgICAgICAgICAgdXJsID0gY29kZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICBtZXNzYWdlICs9IFwiIFsgU2VlOiBodHRwczovXFwvbGlua3MuZXRoZXJzLm9yZy92NS1lcnJvcnMtXCIgKyB1cmwgKyBcIiBdXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc3NhZ2VEZXRhaWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgbWVzc2FnZSArPSBcIiAoXCIgKyBtZXNzYWdlRGV0YWlscy5qb2luKFwiLCBcIikgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBAVE9ETzogQW55Pz9cbiAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICBlcnJvci5yZWFzb24gPSByZWFzb247XG4gICAgICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICAgICAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgZXJyb3Jba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS50aHJvd0Vycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGNvZGUsIHBhcmFtcykge1xuICAgICAgICB0aHJvdyB0aGlzLm1ha2VFcnJvcihtZXNzYWdlLCBjb2RlLCBwYXJhbXMpO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS50aHJvd0FyZ3VtZW50RXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhyb3dFcnJvcihtZXNzYWdlLCBMb2dnZXIuZXJyb3JzLklOVkFMSURfQVJHVU1FTlQsIHtcbiAgICAgICAgICAgIGFyZ3VtZW50OiBuYW1lLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5hc3NlcnQgPSBmdW5jdGlvbiAoY29uZGl0aW9uLCBtZXNzYWdlLCBjb2RlLCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKCEhY29uZGl0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0Vycm9yKG1lc3NhZ2UsIGNvZGUsIHBhcmFtcyk7XG4gICAgfTtcbiAgICBMb2dnZXIucHJvdG90eXBlLmFzc2VydEFyZ3VtZW50ID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgbWVzc2FnZSwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCEhY29uZGl0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50aHJvd0FyZ3VtZW50RXJyb3IobWVzc2FnZSwgbmFtZSwgdmFsdWUpO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5jaGVja05vcm1hbGl6ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgIGlmIChtZXNzYWdlID09IG51bGwpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBcInBsYXRmb3JtIG1pc3NpbmcgU3RyaW5nLnByb3RvdHlwZS5ub3JtYWxpemVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX25vcm1hbGl6ZUVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93RXJyb3IoXCJwbGF0Zm9ybSBtaXNzaW5nIFN0cmluZy5wcm90b3R5cGUubm9ybWFsaXplXCIsIExvZ2dlci5lcnJvcnMuVU5TVVBQT1JURURfT1BFUkFUSU9OLCB7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIlN0cmluZy5wcm90b3R5cGUubm9ybWFsaXplXCIsIGZvcm06IF9ub3JtYWxpemVFcnJvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIExvZ2dlci5wcm90b3R5cGUuY2hlY2tTYWZlVWludDUzID0gZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZXNzYWdlID09IG51bGwpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBcInZhbHVlIG5vdCBzYWZlXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlIDwgMCB8fCB2YWx1ZSA+PSAweDFmZmZmZmZmZmZmZmZmKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93RXJyb3IobWVzc2FnZSwgTG9nZ2VyLmVycm9ycy5OVU1FUklDX0ZBVUxULCB7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcImNoZWNrU2FmZUludGVnZXJcIixcbiAgICAgICAgICAgICAgICBmYXVsdDogXCJvdXQtb2Ytc2FmZS1yYW5nZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlICUgMSkge1xuICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKG1lc3NhZ2UsIExvZ2dlci5lcnJvcnMuTlVNRVJJQ19GQVVMVCwge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJjaGVja1NhZmVJbnRlZ2VyXCIsXG4gICAgICAgICAgICAgICAgZmF1bHQ6IFwibm9uLWludGVnZXJcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBMb2dnZXIucHJvdG90eXBlLmNoZWNrQXJndW1lbnRDb3VudCA9IGZ1bmN0aW9uIChjb3VudCwgZXhwZWN0ZWRDb3VudCwgbWVzc2FnZSkge1xuICAgICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IFwiOiBcIiArIG1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtZXNzYWdlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnQgPCBleHBlY3RlZENvdW50KSB7XG4gICAgICAgICAgICB0aGlzLnRocm93RXJyb3IoXCJtaXNzaW5nIGFyZ3VtZW50XCIgKyBtZXNzYWdlLCBMb2dnZXIuZXJyb3JzLk1JU1NJTkdfQVJHVU1FTlQsIHtcbiAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRDb3VudDogZXhwZWN0ZWRDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ID4gZXhwZWN0ZWRDb3VudCkge1xuICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKFwidG9vIG1hbnkgYXJndW1lbnRzXCIgKyBtZXNzYWdlLCBMb2dnZXIuZXJyb3JzLlVORVhQRUNURURfQVJHVU1FTlQsIHtcbiAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRDb3VudDogZXhwZWN0ZWRDb3VudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIExvZ2dlci5wcm90b3R5cGUuY2hlY2tOZXcgPSBmdW5jdGlvbiAodGFyZ2V0LCBraW5kKSB7XG4gICAgICAgIGlmICh0YXJnZXQgPT09IE9iamVjdCB8fCB0YXJnZXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKFwibWlzc2luZyBuZXdcIiwgTG9nZ2VyLmVycm9ycy5NSVNTSU5HX05FVywgeyBuYW1lOiBraW5kLm5hbWUgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIExvZ2dlci5wcm90b3R5cGUuY2hlY2tBYnN0cmFjdCA9IGZ1bmN0aW9uICh0YXJnZXQsIGtpbmQpIHtcbiAgICAgICAgaWYgKHRhcmdldCA9PT0ga2luZCkge1xuICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKFwiY2Fubm90IGluc3RhbnRpYXRlIGFic3RyYWN0IGNsYXNzIFwiICsgSlNPTi5zdHJpbmdpZnkoa2luZC5uYW1lKSArIFwiIGRpcmVjdGx5OyB1c2UgYSBzdWItY2xhc3NcIiwgTG9nZ2VyLmVycm9ycy5VTlNVUFBPUlRFRF9PUEVSQVRJT04sIHsgbmFtZTogdGFyZ2V0Lm5hbWUsIG9wZXJhdGlvbjogXCJuZXdcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0YXJnZXQgPT09IE9iamVjdCB8fCB0YXJnZXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKFwibWlzc2luZyBuZXdcIiwgTG9nZ2VyLmVycm9ycy5NSVNTSU5HX05FVywgeyBuYW1lOiBraW5kLm5hbWUgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIExvZ2dlci5nbG9iYWxMb2dnZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghX2dsb2JhbExvZ2dlcikge1xuICAgICAgICAgICAgX2dsb2JhbExvZ2dlciA9IG5ldyBMb2dnZXIoX3ZlcnNpb25fMS52ZXJzaW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX2dsb2JhbExvZ2dlcjtcbiAgICB9O1xuICAgIExvZ2dlci5zZXRDZW5zb3JzaGlwID0gZnVuY3Rpb24gKGNlbnNvcnNoaXAsIHBlcm1hbmVudCkge1xuICAgICAgICBpZiAoIWNlbnNvcnNoaXAgJiYgcGVybWFuZW50KSB7XG4gICAgICAgICAgICB0aGlzLmdsb2JhbExvZ2dlcigpLnRocm93RXJyb3IoXCJjYW5ub3QgcGVybWFuZW50bHkgZGlzYWJsZSBjZW5zb3JzaGlwXCIsIExvZ2dlci5lcnJvcnMuVU5TVVBQT1JURURfT1BFUkFUSU9OLCB7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcInNldENlbnNvcnNoaXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9wZXJtYW5lbnRDZW5zb3JFcnJvcnMpIHtcbiAgICAgICAgICAgIGlmICghY2Vuc29yc2hpcCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsTG9nZ2VyKCkudGhyb3dFcnJvcihcImVycm9yIGNlbnNvcnNoaXAgcGVybWFuZW50XCIsIExvZ2dlci5lcnJvcnMuVU5TVVBQT1JURURfT1BFUkFUSU9OLCB7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcInNldENlbnNvcnNoaXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgX2NlbnNvckVycm9ycyA9ICEhY2Vuc29yc2hpcDtcbiAgICAgICAgX3Blcm1hbmVudENlbnNvckVycm9ycyA9ICEhcGVybWFuZW50O1xuICAgIH07XG4gICAgTG9nZ2VyLnNldExvZ0xldmVsID0gZnVuY3Rpb24gKGxvZ0xldmVsKSB7XG4gICAgICAgIHZhciBsZXZlbCA9IExvZ0xldmVsc1tsb2dMZXZlbC50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgaWYgKGxldmVsID09IG51bGwpIHtcbiAgICAgICAgICAgIExvZ2dlci5nbG9iYWxMb2dnZXIoKS53YXJuKFwiaW52YWxpZCBsb2cgbGV2ZWwgLSBcIiArIGxvZ0xldmVsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBfbG9nTGV2ZWwgPSBsZXZlbDtcbiAgICB9O1xuICAgIExvZ2dlci5mcm9tID0gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBMb2dnZXIodmVyc2lvbik7XG4gICAgfTtcbiAgICBMb2dnZXIuZXJyb3JzID0gRXJyb3JDb2RlO1xuICAgIExvZ2dlci5sZXZlbHMgPSBMb2dMZXZlbDtcbiAgICByZXR1cm4gTG9nZ2VyO1xufSgpKTtcbmV4cG9ydHMuTG9nZ2VyID0gTG9nZ2VyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnZlcnNpb24gPSB2b2lkIDA7XG5leHBvcnRzLnZlcnNpb24gPSBcInJscC81LjcuMFwiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9X3ZlcnNpb24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMuZW5jb2RlID0gdm9pZCAwO1xuLy9TZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9ldGhlcmV1bS93aWtpL3dpa2kvUkxQXG52YXIgYnl0ZXNfMSA9IHJlcXVpcmUoXCJAZXRoZXJzcHJvamVjdC9ieXRlc1wiKTtcbnZhciBsb2dnZXJfMSA9IHJlcXVpcmUoXCJAZXRoZXJzcHJvamVjdC9sb2dnZXJcIik7XG52YXIgX3ZlcnNpb25fMSA9IHJlcXVpcmUoXCIuL192ZXJzaW9uXCIpO1xudmFyIGxvZ2dlciA9IG5ldyBsb2dnZXJfMS5Mb2dnZXIoX3ZlcnNpb25fMS52ZXJzaW9uKTtcbmZ1bmN0aW9uIGFycmF5aWZ5SW50ZWdlcih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB3aGlsZSAodmFsdWUpIHtcbiAgICAgICAgcmVzdWx0LnVuc2hpZnQodmFsdWUgJiAweGZmKTtcbiAgICAgICAgdmFsdWUgPj49IDg7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiB1bmFycmF5aWZ5SW50ZWdlcihkYXRhLCBvZmZzZXQsIGxlbmd0aCkge1xuICAgIHZhciByZXN1bHQgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ID0gKHJlc3VsdCAqIDI1NikgKyBkYXRhW29mZnNldCArIGldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gX2VuY29kZShvYmplY3QpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgIHZhciBwYXlsb2FkXzEgPSBbXTtcbiAgICAgICAgb2JqZWN0LmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICBwYXlsb2FkXzEgPSBwYXlsb2FkXzEuY29uY2F0KF9lbmNvZGUoY2hpbGQpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwYXlsb2FkXzEubGVuZ3RoIDw9IDU1KSB7XG4gICAgICAgICAgICBwYXlsb2FkXzEudW5zaGlmdCgweGMwICsgcGF5bG9hZF8xLmxlbmd0aCk7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZF8xO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW5ndGhfMSA9IGFycmF5aWZ5SW50ZWdlcihwYXlsb2FkXzEubGVuZ3RoKTtcbiAgICAgICAgbGVuZ3RoXzEudW5zaGlmdCgweGY3ICsgbGVuZ3RoXzEubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIGxlbmd0aF8xLmNvbmNhdChwYXlsb2FkXzEpO1xuICAgIH1cbiAgICBpZiAoISgwLCBieXRlc18xLmlzQnl0ZXNMaWtlKShvYmplY3QpKSB7XG4gICAgICAgIGxvZ2dlci50aHJvd0FyZ3VtZW50RXJyb3IoXCJSTFAgb2JqZWN0IG11c3QgYmUgQnl0ZXNMaWtlXCIsIFwib2JqZWN0XCIsIG9iamVjdCk7XG4gICAgfVxuICAgIHZhciBkYXRhID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoKDAsIGJ5dGVzXzEuYXJyYXlpZnkpKG9iamVjdCkpO1xuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMSAmJiBkYXRhWzBdIDw9IDB4N2YpIHtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGVsc2UgaWYgKGRhdGEubGVuZ3RoIDw9IDU1KSB7XG4gICAgICAgIGRhdGEudW5zaGlmdCgweDgwICsgZGF0YS5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5aWZ5SW50ZWdlcihkYXRhLmxlbmd0aCk7XG4gICAgbGVuZ3RoLnVuc2hpZnQoMHhiNyArIGxlbmd0aC5sZW5ndGgpO1xuICAgIHJldHVybiBsZW5ndGguY29uY2F0KGRhdGEpO1xufVxuZnVuY3Rpb24gZW5jb2RlKG9iamVjdCkge1xuICAgIHJldHVybiAoMCwgYnl0ZXNfMS5oZXhsaWZ5KShfZW5jb2RlKG9iamVjdCkpO1xufVxuZXhwb3J0cy5lbmNvZGUgPSBlbmNvZGU7XG5mdW5jdGlvbiBfZGVjb2RlQ2hpbGRyZW4oZGF0YSwgb2Zmc2V0LCBjaGlsZE9mZnNldCwgbGVuZ3RoKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHdoaWxlIChjaGlsZE9mZnNldCA8IG9mZnNldCArIDEgKyBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGRlY29kZWQgPSBfZGVjb2RlKGRhdGEsIGNoaWxkT2Zmc2V0KTtcbiAgICAgICAgcmVzdWx0LnB1c2goZGVjb2RlZC5yZXN1bHQpO1xuICAgICAgICBjaGlsZE9mZnNldCArPSBkZWNvZGVkLmNvbnN1bWVkO1xuICAgICAgICBpZiAoY2hpbGRPZmZzZXQgPiBvZmZzZXQgKyAxICsgbGVuZ3RoKSB7XG4gICAgICAgICAgICBsb2dnZXIudGhyb3dFcnJvcihcImNoaWxkIGRhdGEgdG9vIHNob3J0XCIsIGxvZ2dlcl8xLkxvZ2dlci5lcnJvcnMuQlVGRkVSX09WRVJSVU4sIHt9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBjb25zdW1lZDogKDEgKyBsZW5ndGgpLCByZXN1bHQ6IHJlc3VsdCB9O1xufVxuLy8gcmV0dXJucyB7IGNvbnN1bWVkOiBudW1iZXIsIHJlc3VsdDogT2JqZWN0IH1cbmZ1bmN0aW9uIF9kZWNvZGUoZGF0YSwgb2Zmc2V0KSB7XG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGxvZ2dlci50aHJvd0Vycm9yKFwiZGF0YSB0b28gc2hvcnRcIiwgbG9nZ2VyXzEuTG9nZ2VyLmVycm9ycy5CVUZGRVJfT1ZFUlJVTiwge30pO1xuICAgIH1cbiAgICAvLyBBcnJheSB3aXRoIGV4dHJhIGxlbmd0aCBwcmVmaXhcbiAgICBpZiAoZGF0YVtvZmZzZXRdID49IDB4ZjgpIHtcbiAgICAgICAgdmFyIGxlbmd0aExlbmd0aCA9IGRhdGFbb2Zmc2V0XSAtIDB4Zjc7XG4gICAgICAgIGlmIChvZmZzZXQgKyAxICsgbGVuZ3RoTGVuZ3RoID4gZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxvZ2dlci50aHJvd0Vycm9yKFwiZGF0YSBzaG9ydCBzZWdtZW50IHRvbyBzaG9ydFwiLCBsb2dnZXJfMS5Mb2dnZXIuZXJyb3JzLkJVRkZFUl9PVkVSUlVOLCB7fSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbmd0aF8yID0gdW5hcnJheWlmeUludGVnZXIoZGF0YSwgb2Zmc2V0ICsgMSwgbGVuZ3RoTGVuZ3RoKTtcbiAgICAgICAgaWYgKG9mZnNldCArIDEgKyBsZW5ndGhMZW5ndGggKyBsZW5ndGhfMiA+IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICBsb2dnZXIudGhyb3dFcnJvcihcImRhdGEgbG9uZyBzZWdtZW50IHRvbyBzaG9ydFwiLCBsb2dnZXJfMS5Mb2dnZXIuZXJyb3JzLkJVRkZFUl9PVkVSUlVOLCB7fSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9kZWNvZGVDaGlsZHJlbihkYXRhLCBvZmZzZXQsIG9mZnNldCArIDEgKyBsZW5ndGhMZW5ndGgsIGxlbmd0aExlbmd0aCArIGxlbmd0aF8yKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZGF0YVtvZmZzZXRdID49IDB4YzApIHtcbiAgICAgICAgdmFyIGxlbmd0aF8zID0gZGF0YVtvZmZzZXRdIC0gMHhjMDtcbiAgICAgICAgaWYgKG9mZnNldCArIDEgKyBsZW5ndGhfMyA+IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICBsb2dnZXIudGhyb3dFcnJvcihcImRhdGEgYXJyYXkgdG9vIHNob3J0XCIsIGxvZ2dlcl8xLkxvZ2dlci5lcnJvcnMuQlVGRkVSX09WRVJSVU4sIHt9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX2RlY29kZUNoaWxkcmVuKGRhdGEsIG9mZnNldCwgb2Zmc2V0ICsgMSwgbGVuZ3RoXzMpO1xuICAgIH1cbiAgICBlbHNlIGlmIChkYXRhW29mZnNldF0gPj0gMHhiOCkge1xuICAgICAgICB2YXIgbGVuZ3RoTGVuZ3RoID0gZGF0YVtvZmZzZXRdIC0gMHhiNztcbiAgICAgICAgaWYgKG9mZnNldCArIDEgKyBsZW5ndGhMZW5ndGggPiBkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgbG9nZ2VyLnRocm93RXJyb3IoXCJkYXRhIGFycmF5IHRvbyBzaG9ydFwiLCBsb2dnZXJfMS5Mb2dnZXIuZXJyb3JzLkJVRkZFUl9PVkVSUlVOLCB7fSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbmd0aF80ID0gdW5hcnJheWlmeUludGVnZXIoZGF0YSwgb2Zmc2V0ICsgMSwgbGVuZ3RoTGVuZ3RoKTtcbiAgICAgICAgaWYgKG9mZnNldCArIDEgKyBsZW5ndGhMZW5ndGggKyBsZW5ndGhfNCA+IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICBsb2dnZXIudGhyb3dFcnJvcihcImRhdGEgYXJyYXkgdG9vIHNob3J0XCIsIGxvZ2dlcl8xLkxvZ2dlci5lcnJvcnMuQlVGRkVSX09WRVJSVU4sIHt9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gKDAsIGJ5dGVzXzEuaGV4bGlmeSkoZGF0YS5zbGljZShvZmZzZXQgKyAxICsgbGVuZ3RoTGVuZ3RoLCBvZmZzZXQgKyAxICsgbGVuZ3RoTGVuZ3RoICsgbGVuZ3RoXzQpKTtcbiAgICAgICAgcmV0dXJuIHsgY29uc3VtZWQ6ICgxICsgbGVuZ3RoTGVuZ3RoICsgbGVuZ3RoXzQpLCByZXN1bHQ6IHJlc3VsdCB9O1xuICAgIH1cbiAgICBlbHNlIGlmIChkYXRhW29mZnNldF0gPj0gMHg4MCkge1xuICAgICAgICB2YXIgbGVuZ3RoXzUgPSBkYXRhW29mZnNldF0gLSAweDgwO1xuICAgICAgICBpZiAob2Zmc2V0ICsgMSArIGxlbmd0aF81ID4gZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxvZ2dlci50aHJvd0Vycm9yKFwiZGF0YSB0b28gc2hvcnRcIiwgbG9nZ2VyXzEuTG9nZ2VyLmVycm9ycy5CVUZGRVJfT1ZFUlJVTiwge30pO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSAoMCwgYnl0ZXNfMS5oZXhsaWZ5KShkYXRhLnNsaWNlKG9mZnNldCArIDEsIG9mZnNldCArIDEgKyBsZW5ndGhfNSkpO1xuICAgICAgICByZXR1cm4geyBjb25zdW1lZDogKDEgKyBsZW5ndGhfNSksIHJlc3VsdDogcmVzdWx0IH07XG4gICAgfVxuICAgIHJldHVybiB7IGNvbnN1bWVkOiAxLCByZXN1bHQ6ICgwLCBieXRlc18xLmhleGxpZnkpKGRhdGFbb2Zmc2V0XSkgfTtcbn1cbmZ1bmN0aW9uIGRlY29kZShkYXRhKSB7XG4gICAgdmFyIGJ5dGVzID0gKDAsIGJ5dGVzXzEuYXJyYXlpZnkpKGRhdGEpO1xuICAgIHZhciBkZWNvZGVkID0gX2RlY29kZShieXRlcywgMCk7XG4gICAgaWYgKGRlY29kZWQuY29uc3VtZWQgIT09IGJ5dGVzLmxlbmd0aCkge1xuICAgICAgICBsb2dnZXIudGhyb3dBcmd1bWVudEVycm9yKFwiaW52YWxpZCBybHAgZGF0YVwiLCBcImRhdGFcIiwgZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkZWNvZGVkLnJlc3VsdDtcbn1cbmV4cG9ydHMuZGVjb2RlID0gZGVjb2RlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxuLy8gU3VwcG9ydCBkZWNvZGluZyBVUkwtc2FmZSBiYXNlNjQgc3RyaW5ncywgYXMgTm9kZS5qcyBkb2VzLlxuLy8gU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjQjVVJMX2FwcGxpY2F0aW9uc1xucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gZ2V0TGVucyAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIFRyaW0gb2ZmIGV4dHJhIGJ5dGVzIGFmdGVyIHBsYWNlaG9sZGVyIGJ5dGVzIGFyZSBmb3VuZFxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9iZWF0Z2FtbWl0L2Jhc2U2NC1qcy9pc3N1ZXMvNDJcbiAgdmFyIHZhbGlkTGVuID0gYjY0LmluZGV4T2YoJz0nKVxuICBpZiAodmFsaWRMZW4gPT09IC0xKSB2YWxpZExlbiA9IGxlblxuXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSB2YWxpZExlbiA9PT0gbGVuXG4gICAgPyAwXG4gICAgOiA0IC0gKHZhbGlkTGVuICUgNClcblxuICByZXR1cm4gW3ZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW5dXG59XG5cbi8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIF9ieXRlTGVuZ3RoIChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pIHtcbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG5cbiAgdmFyIGFyciA9IG5ldyBBcnIoX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSlcblxuICB2YXIgY3VyQnl0ZSA9IDBcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIHZhciBsZW4gPSBwbGFjZUhvbGRlcnNMZW4gPiAwXG4gICAgPyB2YWxpZExlbiAtIDRcbiAgICA6IHZhbGlkTGVuXG5cbiAgdmFyIGlcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8XG4gICAgICByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPVxuICAgICAgKCh1aW50OFtpXSA8PCAxNikgJiAweEZGMDAwMCkgK1xuICAgICAgKCh1aW50OFtpICsgMV0gPDwgOCkgJiAweEZGMDApICtcbiAgICAgICh1aW50OFtpICsgMl0gJiAweEZGKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aCkpKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXSArXG4gICAgICAnPT0nXG4gICAgKVxuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDEwXSArXG4gICAgICBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl0gK1xuICAgICAgJz0nXG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG52YXIgY3VzdG9tSW5zcGVjdFN5bWJvbCA9XG4gICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2xbJ2ZvciddID09PSAnZnVuY3Rpb24nKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxuICAgID8gU3ltYm9sWydmb3InXSgnbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxuICAgIDogbnVsbFxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbnZhciBLX01BWF9MRU5HVEggPSAweDdmZmZmZmZmXG5leHBvcnRzLmtNYXhMZW5ndGggPSBLX01BWF9MRU5HVEhcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgUHJpbnQgd2FybmluZyBhbmQgcmVjb21tZW5kIHVzaW5nIGBidWZmZXJgIHY0Lnggd2hpY2ggaGFzIGFuIE9iamVjdFxuICogICAgICAgICAgICAgICBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogV2UgcmVwb3J0IHRoYXQgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0eXBlZCBhcnJheXMgaWYgdGhlIGFyZSBub3Qgc3ViY2xhc3NhYmxlXG4gKiB1c2luZyBfX3Byb3RvX18uIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgXG4gKiAoU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzgpLiBJRSAxMCBsYWNrcyBzdXBwb3J0XG4gKiBmb3IgX19wcm90b19fIGFuZCBoYXMgYSBidWdneSB0eXBlZCBhcnJheSBpbXBsZW1lbnRhdGlvbi5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSB0eXBlZEFycmF5U3VwcG9ydCgpXG5cbmlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgY29uc29sZS5lcnJvcihcbiAgICAnVGhpcyBicm93c2VyIGxhY2tzIHR5cGVkIGFycmF5IChVaW50OEFycmF5KSBzdXBwb3J0IHdoaWNoIGlzIHJlcXVpcmVkIGJ5ICcgK1xuICAgICdgYnVmZmVyYCB2NS54LiBVc2UgYGJ1ZmZlcmAgdjQueCBpZiB5b3UgcmVxdWlyZSBvbGQgYnJvd3NlciBzdXBwb3J0LidcbiAgKVxufVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIC8vIENhbiB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZD9cbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICB2YXIgcHJvdG8gPSB7IGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfSB9XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHByb3RvLCBVaW50OEFycmF5LnByb3RvdHlwZSlcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoYXJyLCBwcm90bylcbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MlxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsICdwYXJlbnQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKHRoaXMpKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyXG4gIH1cbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAnb2Zmc2V0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0aGlzKSkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB0aGlzLmJ5dGVPZmZzZXRcbiAgfVxufSlcblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKGxlbmd0aCA+IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgXCInICsgbGVuZ3RoICsgJ1wiIGlzIGludmFsaWQgZm9yIG9wdGlvbiBcInNpemVcIicpXG4gIH1cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGJ1ZiwgQnVmZmVyLnByb3RvdHlwZSlcbiAgcmV0dXJuIGJ1ZlxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdUaGUgXCJzdHJpbmdcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLiBSZWNlaXZlZCB0eXBlIG51bWJlcidcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKGFyZylcbiAgfVxuICByZXR1cm4gZnJvbShhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbmZ1bmN0aW9uIGZyb20gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheVZpZXcodmFsdWUpXG4gIH1cblxuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgJyArXG4gICAgICAnb3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArICh0eXBlb2YgdmFsdWUpXG4gICAgKVxuICB9XG5cbiAgaWYgKGlzSW5zdGFuY2UodmFsdWUsIEFycmF5QnVmZmVyKSB8fFxuICAgICAgKHZhbHVlICYmIGlzSW5zdGFuY2UodmFsdWUuYnVmZmVyLCBBcnJheUJ1ZmZlcikpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBTaGFyZWRBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIChpc0luc3RhbmNlKHZhbHVlLCBTaGFyZWRBcnJheUJ1ZmZlcikgfHxcbiAgICAgICh2YWx1ZSAmJiBpc0luc3RhbmNlKHZhbHVlLmJ1ZmZlciwgU2hhcmVkQXJyYXlCdWZmZXIpKSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwidmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBvZiB0eXBlIG51bWJlci4gUmVjZWl2ZWQgdHlwZSBudW1iZXInXG4gICAgKVxuICB9XG5cbiAgdmFyIHZhbHVlT2YgPSB2YWx1ZS52YWx1ZU9mICYmIHZhbHVlLnZhbHVlT2YoKVxuICBpZiAodmFsdWVPZiAhPSBudWxsICYmIHZhbHVlT2YgIT09IHZhbHVlKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlT2YsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIHZhciBiID0gZnJvbU9iamVjdCh2YWx1ZSlcbiAgaWYgKGIpIHJldHVybiBiXG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1ByaW1pdGl2ZSAhPSBudWxsICYmXG4gICAgICB0eXBlb2YgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbShcbiAgICAgIHZhbHVlW1N5bWJvbC50b1ByaW1pdGl2ZV0oJ3N0cmluZycpLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGhcbiAgICApXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCAnICtcbiAgICAnb3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArICh0eXBlb2YgdmFsdWUpXG4gIClcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbSh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG4vLyBOb3RlOiBDaGFuZ2UgcHJvdG90eXBlICphZnRlciogQnVmZmVyLmZyb20gaXMgZGVmaW5lZCB0byB3b3JrYXJvdW5kIENocm9tZSBidWc6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzE0OFxuT2JqZWN0LnNldFByb3RvdHlwZU9mKEJ1ZmZlci5wcm90b3R5cGUsIFVpbnQ4QXJyYXkucHJvdG90eXBlKVxuT2JqZWN0LnNldFByb3RvdHlwZU9mKEJ1ZmZlciwgVWludDhBcnJheSlcblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIFwiJyArIHNpemUgKyAnXCIgaXMgaW52YWxpZCBmb3Igb3B0aW9uIFwic2l6ZVwiJylcbiAgfVxufVxuXG5mdW5jdGlvbiBhbGxvYyAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICBpZiAoc2l6ZSA8PSAwKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxuICB9XG4gIGlmIChmaWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPbmx5IHBheSBhdHRlbnRpb24gdG8gZW5jb2RpbmcgaWYgaXQncyBhIHN0cmluZy4gVGhpc1xuICAgIC8vIHByZXZlbnRzIGFjY2lkZW50YWxseSBzZW5kaW5nIGluIGEgbnVtYmVyIHRoYXQgd291bGRcbiAgICAvLyBiZSBpbnRlcnByZXRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSBidWYud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIGJ1ZiA9IGJ1Zi5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBidWZbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5VmlldyAoYXJyYXlWaWV3KSB7XG4gIGlmIChpc0luc3RhbmNlKGFycmF5VmlldywgVWludDhBcnJheSkpIHtcbiAgICB2YXIgY29weSA9IG5ldyBVaW50OEFycmF5KGFycmF5VmlldylcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKGNvcHkuYnVmZmVyLCBjb3B5LmJ5dGVPZmZzZXQsIGNvcHkuYnl0ZUxlbmd0aClcbiAgfVxuICByZXR1cm4gZnJvbUFycmF5TGlrZShhcnJheVZpZXcpXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJvZmZzZXRcIiBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcImxlbmd0aFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICB2YXIgYnVmXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YoYnVmLCBCdWZmZXIucHJvdG90eXBlKVxuXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAob2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuKVxuXG4gICAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBidWZcbiAgICB9XG5cbiAgICBvYmouY29weShidWYsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gYnVmXG4gIH1cblxuICBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBudW1iZXJJc05hTihvYmoubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcigwKVxuICAgIH1cbiAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmopXG4gIH1cblxuICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIEFycmF5LmlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqLmRhdGEpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IEtfTUFYX0xFTkdUSGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsgS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyID09PSB0cnVlICYmXG4gICAgYiAhPT0gQnVmZmVyLnByb3RvdHlwZSAvLyBzbyBCdWZmZXIuaXNCdWZmZXIoQnVmZmVyLnByb3RvdHlwZSkgd2lsbCBiZSBmYWxzZVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKGlzSW5zdGFuY2UoYSwgVWludDhBcnJheSkpIGEgPSBCdWZmZXIuZnJvbShhLCBhLm9mZnNldCwgYS5ieXRlTGVuZ3RoKVxuICBpZiAoaXNJbnN0YW5jZShiLCBVaW50OEFycmF5KSkgYiA9IEJ1ZmZlci5mcm9tKGIsIGIub2Zmc2V0LCBiLmJ5dGVMZW5ndGgpXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcImJ1ZjFcIiwgXCJidWYyXCIgYXJndW1lbnRzIG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXknXG4gICAgKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKGlzSW5zdGFuY2UoYnVmLCBVaW50OEFycmF5KSkge1xuICAgICAgaWYgKHBvcyArIGJ1Zi5sZW5ndGggPiBidWZmZXIubGVuZ3RoKSB7XG4gICAgICAgIEJ1ZmZlci5mcm9tKGJ1ZikuY29weShidWZmZXIsIHBvcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICBidWYsXG4gICAgICAgICAgcG9zXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgfVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IGlzSW5zdGFuY2Uoc3RyaW5nLCBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcInN0cmluZ1wiIGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIG9yIEFycmF5QnVmZmVyLiAnICtcbiAgICAgICdSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2Ygc3RyaW5nXG4gICAgKVxuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIG11c3RNYXRjaCA9IChhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gPT09IHRydWUpXG4gIGlmICghbXVzdE1hdGNoICYmIGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkge1xuICAgICAgICAgIHJldHVybiBtdXN0TWF0Y2ggPyAtMSA6IHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIH1cbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2VyY2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGlzIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgKGFuZCB0aGUgYGlzLWJ1ZmZlcmAgbnBtIHBhY2thZ2UpXG4vLyB0byBkZXRlY3QgYSBCdWZmZXIgaW5zdGFuY2UuIEl0J3Mgbm90IHBvc3NpYmxlIHRvIHVzZSBgaW5zdGFuY2VvZiBCdWZmZXJgXG4vLyByZWxpYWJseSBpbiBhIGJyb3dzZXJpZnkgY29udGV4dCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG11bHRpcGxlIGRpZmZlcmVudFxuLy8gY29waWVzIG9mIHRoZSAnYnVmZmVyJyBwYWNrYWdlIGluIHVzZS4gVGhpcyBtZXRob2Qgd29ya3MgZXZlbiBmb3IgQnVmZmVyXG4vLyBpbnN0YW5jZXMgdGhhdCB3ZXJlIGNyZWF0ZWQgZnJvbSBhbm90aGVyIGNvcHkgb2YgdGhlIGBidWZmZXJgIHBhY2thZ2UuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNTRcbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9Mb2NhbGVTdHJpbmcgPSBCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nXG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgdmFyIHN0ciA9ICcnXG4gIHZhciBtYXggPSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTXG4gIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkucmVwbGFjZSgvKC57Mn0pL2csICckMSAnKS50cmltKClcbiAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICByZXR1cm4gJzxCdWZmZXIgJyArIHN0ciArICc+J1xufVxuaWYgKGN1c3RvbUluc3BlY3RTeW1ib2wpIHtcbiAgQnVmZmVyLnByb3RvdHlwZVtjdXN0b21JbnNwZWN0U3ltYm9sXSA9IEJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlICh0YXJnZXQsIHN0YXJ0LCBlbmQsIHRoaXNTdGFydCwgdGhpc0VuZCkge1xuICBpZiAoaXNJbnN0YW5jZSh0YXJnZXQsIFVpbnQ4QXJyYXkpKSB7XG4gICAgdGFyZ2V0ID0gQnVmZmVyLmZyb20odGFyZ2V0LCB0YXJnZXQub2Zmc2V0LCB0YXJnZXQuYnl0ZUxlbmd0aClcbiAgfVxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJ0YXJnZXRcIiBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIEJ1ZmZlciBvciBVaW50OEFycmF5LiAnICtcbiAgICAgICdSZWNlaXZlZCB0eXBlICcgKyAodHlwZW9mIHRhcmdldClcbiAgICApXG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCA9IHRhcmdldCA/IHRhcmdldC5sZW5ndGggOiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1N0YXJ0ID0gMFxuICB9XG4gIGlmICh0aGlzRW5kID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzRW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kID4gdGFyZ2V0Lmxlbmd0aCB8fCB0aGlzU3RhcnQgPCAwIHx8IHRoaXNFbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdvdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kICYmIHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAwXG4gIH1cbiAgaWYgKHRoaXNTdGFydCA+PSB0aGlzRW5kKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cbiAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgIHJldHVybiAxXG4gIH1cblxuICBzdGFydCA+Pj49IDBcbiAgZW5kID4+Pj0gMFxuICB0aGlzU3RhcnQgPj4+PSAwXG4gIHRoaXNFbmQgPj4+PSAwXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCkgcmV0dXJuIDBcblxuICB2YXIgeCA9IHRoaXNFbmQgLSB0aGlzU3RhcnRcbiAgdmFyIHkgPSBlbmQgLSBzdGFydFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICB2YXIgdGhpc0NvcHkgPSB0aGlzLnNsaWNlKHRoaXNTdGFydCwgdGhpc0VuZClcbiAgdmFyIHRhcmdldENvcHkgPSB0YXJnZXQuc2xpY2Uoc3RhcnQsIGVuZClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXNDb3B5W2ldICE9PSB0YXJnZXRDb3B5W2ldKSB7XG4gICAgICB4ID0gdGhpc0NvcHlbaV1cbiAgICAgIHkgPSB0YXJnZXRDb3B5W2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuLy8gRmluZHMgZWl0aGVyIHRoZSBmaXJzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPj0gYGJ5dGVPZmZzZXRgLFxuLy8gT1IgdGhlIGxhc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0IDw9IGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBBcmd1bWVudHM6XG4vLyAtIGJ1ZmZlciAtIGEgQnVmZmVyIHRvIHNlYXJjaFxuLy8gLSB2YWwgLSBhIHN0cmluZywgQnVmZmVyLCBvciBudW1iZXJcbi8vIC0gYnl0ZU9mZnNldCAtIGFuIGluZGV4IGludG8gYGJ1ZmZlcmA7IHdpbGwgYmUgY2xhbXBlZCB0byBhbiBpbnQzMlxuLy8gLSBlbmNvZGluZyAtIGFuIG9wdGlvbmFsIGVuY29kaW5nLCByZWxldmFudCBpcyB2YWwgaXMgYSBzdHJpbmdcbi8vIC0gZGlyIC0gdHJ1ZSBmb3IgaW5kZXhPZiwgZmFsc2UgZm9yIGxhc3RJbmRleE9mXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsSW5kZXhPZiAoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgLy8gRW1wdHkgYnVmZmVyIG1lYW5zIG5vIG1hdGNoXG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gLTFcblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldFxuICBpZiAodHlwZW9mIGJ5dGVPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBieXRlT2Zmc2V0XG4gICAgYnl0ZU9mZnNldCA9IDBcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikge1xuICAgIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSB7XG4gICAgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIH1cbiAgYnl0ZU9mZnNldCA9ICtieXRlT2Zmc2V0IC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChudW1iZXJJc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFt2YWxdLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigndmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyJylcbn1cblxuZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaVxuICBpZiAoZGlyKSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPCBhcnJMZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlYWQoYXJyLCBpKSA9PT0gcmVhZCh2YWwsIGZvdW5kSW5kZXggPT09IC0xID8gMCA6IGkgLSBmb3VuZEluZGV4KSkge1xuICAgICAgICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIGZvdW5kSW5kZXggPSBpXG4gICAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIGZvdW5kSW5kZXggKiBpbmRleFNpemVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ICE9PSAtMSkgaSAtPSBpIC0gZm91bmRJbmRleFxuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGJ5dGVPZmZzZXQgKyB2YWxMZW5ndGggPiBhcnJMZW5ndGgpIGJ5dGVPZmZzZXQgPSBhcnJMZW5ndGggLSB2YWxMZW5ndGhcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGZvdW5kID0gdHJ1ZVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWxMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAocmVhZChhcnIsIGkgKyBqKSAhPT0gcmVhZCh2YWwsIGopKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuIGlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiB0aGlzLmluZGV4T2YodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykgIT09IC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIHRydWUpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZmFsc2UpXG59XG5cbmZ1bmN0aW9uIGhleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCA+Pj4gMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpXG4gICAgICA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpXG4gICAgICAgICAgPyAzXG4gICAgICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRilcbiAgICAgICAgICAgICAgPyAyXG4gICAgICAgICAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbGF0aW4xU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSBoZXhTbGljZUxvb2t1cFRhYmxlW2J1ZltpXV1cbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgLy8gSWYgYnl0ZXMubGVuZ3RoIGlzIG9kZCwgdGhlIGxhc3QgOCBiaXRzIG11c3QgYmUgaWdub3JlZCAoc2FtZSBhcyBub2RlLmpzKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aCAtIDE7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgKGJ5dGVzW2kgKyAxXSAqIDI1NikpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG5ld0J1ZiwgQnVmZmVyLnByb3RvdHlwZSlcblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50TEUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnRCRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50OCA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MTZMRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQxNkJFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludDMyTEUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MzJCRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50TEUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50QkUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50OCA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQxNkxFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50MTZCRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDMyTEUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQzMkJFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgKDggKiBieXRlTGVuZ3RoKSAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBzaG91bGQgYmUgYSBCdWZmZXInKVxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFVzZSBidWlsdC1pbiB3aGVuIGF2YWlsYWJsZSwgbWlzc2luZyBmcm9tIElFMTFcbiAgICB0aGlzLmNvcHlXaXRoaW4odGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpXG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKChlbmNvZGluZyA9PT0gJ3V0ZjgnICYmIGNvZGUgPCAxMjgpIHx8XG4gICAgICAgICAgZW5jb2RpbmcgPT09ICdsYXRpbjEnKSB7XG4gICAgICAgIC8vIEZhc3QgcGF0aDogSWYgYHZhbGAgZml0cyBpbnRvIGEgc2luZ2xlIGJ5dGUsIHVzZSB0aGF0IG51bWVyaWMgdmFsdWUuXG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnYm9vbGVhbicpIHtcbiAgICB2YWwgPSBOdW1iZXIodmFsKVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyB2YWwgK1xuICAgICAgICAnXCIgaXMgaW52YWxpZCBmb3IgYXJndW1lbnQgXCJ2YWx1ZVwiJylcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSB0YWtlcyBlcXVhbCBzaWducyBhcyBlbmQgb2YgdGhlIEJhc2U2NCBlbmNvZGluZ1xuICBzdHIgPSBzdHIuc3BsaXQoJz0nKVswXVxuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG4vLyBBcnJheUJ1ZmZlciBvciBVaW50OEFycmF5IG9iamVjdHMgZnJvbSBvdGhlciBjb250ZXh0cyAoaS5lLiBpZnJhbWVzKSBkbyBub3QgcGFzc1xuLy8gdGhlIGBpbnN0YW5jZW9mYCBjaGVjayBidXQgdGhleSBzaG91bGQgYmUgdHJlYXRlZCBhcyBvZiB0aGF0IHR5cGUuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNjZcbmZ1bmN0aW9uIGlzSW5zdGFuY2UgKG9iaiwgdHlwZSkge1xuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgdHlwZSB8fFxuICAgIChvYmogIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IgIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IubmFtZSAhPSBudWxsICYmXG4gICAgICBvYmouY29uc3RydWN0b3IubmFtZSA9PT0gdHlwZS5uYW1lKVxufVxuZnVuY3Rpb24gbnVtYmVySXNOYU4gKG9iaikge1xuICAvLyBGb3IgSUUxMSBzdXBwb3J0XG4gIHJldHVybiBvYmogIT09IG9iaiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG4vLyBDcmVhdGUgbG9va3VwIHRhYmxlIGZvciBgdG9TdHJpbmcoJ2hleCcpYFxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMjE5XG52YXIgaGV4U2xpY2VMb29rdXBUYWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBhbHBoYWJldCA9ICcwMTIzNDU2Nzg5YWJjZGVmJ1xuICB2YXIgdGFibGUgPSBuZXcgQXJyYXkoMjU2KVxuICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICB2YXIgaTE2ID0gaSAqIDE2XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCAxNjsgKytqKSB7XG4gICAgICB0YWJsZVtpMTYgKyBqXSA9IGFscGhhYmV0W2ldICsgYWxwaGFiZXRbal1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhYmxlXG59KSgpXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUiA9IHR5cGVvZiBSZWZsZWN0ID09PSAnb2JqZWN0JyA/IFJlZmxlY3QgOiBudWxsXG52YXIgUmVmbGVjdEFwcGx5ID0gUiAmJiB0eXBlb2YgUi5hcHBseSA9PT0gJ2Z1bmN0aW9uJ1xuICA/IFIuYXBwbHlcbiAgOiBmdW5jdGlvbiBSZWZsZWN0QXBwbHkodGFyZ2V0LCByZWNlaXZlciwgYXJncykge1xuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbCh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKTtcbiAgfVxuXG52YXIgUmVmbGVjdE93bktleXNcbmlmIChSICYmIHR5cGVvZiBSLm93bktleXMgPT09ICdmdW5jdGlvbicpIHtcbiAgUmVmbGVjdE93bktleXMgPSBSLm93bktleXNcbn0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpXG4gICAgICAuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSk7XG4gIH07XG59IGVsc2Uge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBQcm9jZXNzRW1pdFdhcm5pbmcod2FybmluZykge1xuICBpZiAoY29uc29sZSAmJiBjb25zb2xlLndhcm4pIGNvbnNvbGUud2Fybih3YXJuaW5nKTtcbn1cblxudmFyIE51bWJlcklzTmFOID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIE51bWJlcklzTmFOKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgRXZlbnRFbWl0dGVyLmluaXQuY2FsbCh0aGlzKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xubW9kdWxlLmV4cG9ydHMub25jZSA9IG9uY2U7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzQ291bnQgPSAwO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG52YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG5mdW5jdGlvbiBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKSB7XG4gIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGxpc3RlbmVyKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLCAnZGVmYXVsdE1heExpc3RlbmVycycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGVmYXVsdE1heExpc3RlbmVycztcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgfHwgYXJnIDwgMCB8fCBOdW1iZXJJc05hTihhcmcpKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiZGVmYXVsdE1heExpc3RlbmVyc1wiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBhcmcgKyAnLicpO1xuICAgIH1cbiAgICBkZWZhdWx0TWF4TGlzdGVuZXJzID0gYXJnO1xuICB9XG59KTtcblxuRXZlbnRFbWl0dGVyLmluaXQgPSBmdW5jdGlvbigpIHtcblxuICBpZiAodGhpcy5fZXZlbnRzID09PSB1bmRlZmluZWQgfHxcbiAgICAgIHRoaXMuX2V2ZW50cyA9PT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLl9ldmVudHMpIHtcbiAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgfVxuXG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59O1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMobikge1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInIHx8IG4gPCAwIHx8IE51bWJlcklzTmFOKG4pKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcIm5cIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgbiArICcuJyk7XG4gIH1cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiBfZ2V0TWF4TGlzdGVuZXJzKHRoYXQpIHtcbiAgaWYgKHRoYXQuX21heExpc3RlbmVycyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgcmV0dXJuIHRoYXQuX21heExpc3RlbmVycztcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiBfZ2V0TWF4TGlzdGVuZXJzKHRoaXMpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlKSB7XG4gIHZhciBhcmdzID0gW107XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgdmFyIGRvRXJyb3IgPSAodHlwZSA9PT0gJ2Vycm9yJyk7XG5cbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKVxuICAgIGRvRXJyb3IgPSAoZG9FcnJvciAmJiBldmVudHMuZXJyb3IgPT09IHVuZGVmaW5lZCk7XG4gIGVsc2UgaWYgKCFkb0Vycm9yKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmIChkb0Vycm9yKSB7XG4gICAgdmFyIGVyO1xuICAgIGlmIChhcmdzLmxlbmd0aCA+IDApXG4gICAgICBlciA9IGFyZ3NbMF07XG4gICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIC8vIE5vdGU6IFRoZSBjb21tZW50cyBvbiB0aGUgYHRocm93YCBsaW5lcyBhcmUgaW50ZW50aW9uYWwsIHRoZXkgc2hvd1xuICAgICAgLy8gdXAgaW4gTm9kZSdzIG91dHB1dCBpZiB0aGlzIHJlc3VsdHMgaW4gYW4gdW5oYW5kbGVkIGV4Y2VwdGlvbi5cbiAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgIH1cbiAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5oYW5kbGVkIGVycm9yLicgKyAoZXIgPyAnICgnICsgZXIubWVzc2FnZSArICcpJyA6ICcnKSk7XG4gICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICB0aHJvdyBlcnI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gIH1cblxuICB2YXIgaGFuZGxlciA9IGV2ZW50c1t0eXBlXTtcblxuICBpZiAoaGFuZGxlciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBSZWZsZWN0QXBwbHkoaGFuZGxlciwgdGhpcywgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIFJlZmxlY3RBcHBseShsaXN0ZW5lcnNbaV0sIHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5mdW5jdGlvbiBfYWRkTGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgcHJlcGVuZCkge1xuICB2YXIgbTtcbiAgdmFyIGV2ZW50cztcbiAgdmFyIGV4aXN0aW5nO1xuXG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGFyZ2V0Ll9ldmVudHNDb3VudCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gICAgaWYgKGV2ZW50cy5uZXdMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0YXJnZXQuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgPyBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICAgICAgLy8gUmUtYXNzaWduIGBldmVudHNgIGJlY2F1c2UgYSBuZXdMaXN0ZW5lciBoYW5kbGVyIGNvdWxkIGhhdmUgY2F1c2VkIHRoZVxuICAgICAgLy8gdGhpcy5fZXZlbnRzIHRvIGJlIGFzc2lnbmVkIHRvIGEgbmV3IG9iamVjdFxuICAgICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gICAgfVxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgaWYgKGV4aXN0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgICsrdGFyZ2V0Ll9ldmVudHNDb3VudDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGV4aXN0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID1cbiAgICAgICAgcHJlcGVuZCA/IFtsaXN0ZW5lciwgZXhpc3RpbmddIDogW2V4aXN0aW5nLCBsaXN0ZW5lcl07XG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgfSBlbHNlIGlmIChwcmVwZW5kKSB7XG4gICAgICBleGlzdGluZy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhpc3RpbmcucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBtID0gX2dldE1heExpc3RlbmVycyh0YXJnZXQpO1xuICAgIGlmIChtID4gMCAmJiBleGlzdGluZy5sZW5ndGggPiBtICYmICFleGlzdGluZy53YXJuZWQpIHtcbiAgICAgIGV4aXN0aW5nLndhcm5lZCA9IHRydWU7XG4gICAgICAvLyBObyBlcnJvciBjb2RlIGZvciB0aGlzIHNpbmNlIGl0IGlzIGEgV2FybmluZ1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICB2YXIgdyA9IG5ldyBFcnJvcignUG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSBsZWFrIGRldGVjdGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmcubGVuZ3RoICsgJyAnICsgU3RyaW5nKHR5cGUpICsgJyBsaXN0ZW5lcnMgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhZGRlZC4gVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdpbmNyZWFzZSBsaW1pdCcpO1xuICAgICAgdy5uYW1lID0gJ01heExpc3RlbmVyc0V4Y2VlZGVkV2FybmluZyc7XG4gICAgICB3LmVtaXR0ZXIgPSB0YXJnZXQ7XG4gICAgICB3LnR5cGUgPSB0eXBlO1xuICAgICAgdy5jb3VudCA9IGV4aXN0aW5nLmxlbmd0aDtcbiAgICAgIFByb2Nlc3NFbWl0V2FybmluZyh3KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZExpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIHRydWUpO1xuICAgIH07XG5cbmZ1bmN0aW9uIG9uY2VXcmFwcGVyKCkge1xuICBpZiAoIXRoaXMuZmlyZWQpIHtcbiAgICB0aGlzLnRhcmdldC5yZW1vdmVMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMud3JhcEZuKTtcbiAgICB0aGlzLmZpcmVkID0gdHJ1ZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmFwcGx5KHRoaXMudGFyZ2V0LCBhcmd1bWVudHMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9vbmNlV3JhcCh0YXJnZXQsIHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzdGF0ZSA9IHsgZmlyZWQ6IGZhbHNlLCB3cmFwRm46IHVuZGVmaW5lZCwgdGFyZ2V0OiB0YXJnZXQsIHR5cGU6IHR5cGUsIGxpc3RlbmVyOiBsaXN0ZW5lciB9O1xuICB2YXIgd3JhcHBlZCA9IG9uY2VXcmFwcGVyLmJpbmQoc3RhdGUpO1xuICB3cmFwcGVkLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHN0YXRlLndyYXBGbiA9IHdyYXBwZWQ7XG4gIHJldHVybiB3cmFwcGVkO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICB0aGlzLm9uKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZE9uY2VMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZE9uY2VMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICB0aGlzLnByZXBlbmRMaXN0ZW5lcih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbi8vIEVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZiBhbmQgb25seSBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIGxpc3QsIGV2ZW50cywgcG9zaXRpb24sIGksIG9yaWdpbmFsTGlzdGVuZXI7XG5cbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBsaXN0ID0gZXZlbnRzW3R5cGVdO1xuICAgICAgaWYgKGxpc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fCBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdC5saXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpc3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcG9zaXRpb24gPSAtMTtcblxuICAgICAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8IGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBvcmlnaW5hbExpc3RlbmVyID0gbGlzdFtpXS5saXN0ZW5lcjtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSAwKVxuICAgICAgICAgIGxpc3Quc2hpZnQoKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgc3BsaWNlT25lKGxpc3QsIHBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICBldmVudHNbdHlwZV0gPSBsaXN0WzBdO1xuXG4gICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgb3JpZ2luYWxMaXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyh0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzLCBldmVudHMsIGk7XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50c1t0eXBlXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhldmVudHMpO1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICB9IGVsc2UgaWYgKGxpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIExJRk8gb3JkZXJcbiAgICAgICAgZm9yIChpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbmZ1bmN0aW9uIF9saXN0ZW5lcnModGFyZ2V0LCB0eXBlLCB1bndyYXApIHtcbiAgdmFyIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gW107XG5cbiAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG4gIGlmIChldmxpc3RlbmVyID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdW53cmFwID8gW2V2bGlzdGVuZXIubGlzdGVuZXIgfHwgZXZsaXN0ZW5lcl0gOiBbZXZsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHVud3JhcCA/XG4gICAgdW53cmFwTGlzdGVuZXJzKGV2bGlzdGVuZXIpIDogYXJyYXlDbG9uZShldmxpc3RlbmVyLCBldmxpc3RlbmVyLmxlbmd0aCk7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgdHJ1ZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJhd0xpc3RlbmVycyA9IGZ1bmN0aW9uIHJhd0xpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIubGlzdGVuZXJDb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGxpc3RlbmVyQ291bnQuY2FsbChlbWl0dGVyLCB0eXBlKTtcbiAgfVxufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gbGlzdGVuZXJDb3VudDtcbmZ1bmN0aW9uIGxpc3RlbmVyQ291bnQodHlwZSkge1xuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGV2bGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICByZXR1cm4gdGhpcy5fZXZlbnRzQ291bnQgPiAwID8gUmVmbGVjdE93bktleXModGhpcy5fZXZlbnRzKSA6IFtdO1xufTtcblxuZnVuY3Rpb24gYXJyYXlDbG9uZShhcnIsIG4pIHtcbiAgdmFyIGNvcHkgPSBuZXcgQXJyYXkobik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKVxuICAgIGNvcHlbaV0gPSBhcnJbaV07XG4gIHJldHVybiBjb3B5O1xufVxuXG5mdW5jdGlvbiBzcGxpY2VPbmUobGlzdCwgaW5kZXgpIHtcbiAgZm9yICg7IGluZGV4ICsgMSA8IGxpc3QubGVuZ3RoOyBpbmRleCsrKVxuICAgIGxpc3RbaW5kZXhdID0gbGlzdFtpbmRleCArIDFdO1xuICBsaXN0LnBvcCgpO1xufVxuXG5mdW5jdGlvbiB1bndyYXBMaXN0ZW5lcnMoYXJyKSB7XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmV0Lmxlbmd0aDsgKytpKSB7XG4gICAgcmV0W2ldID0gYXJyW2ldLmxpc3RlbmVyIHx8IGFycltpXTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBvbmNlKGVtaXR0ZXIsIG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBmdW5jdGlvbiBlcnJvckxpc3RlbmVyKGVycikge1xuICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihuYW1lLCByZXNvbHZlcik7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlcigpIHtcbiAgICAgIGlmICh0eXBlb2YgZW1pdHRlci5yZW1vdmVMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGVycm9yTGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIH07XG5cbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgbmFtZSwgcmVzb2x2ZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICBpZiAobmFtZSAhPT0gJ2Vycm9yJykge1xuICAgICAgYWRkRXJyb3JIYW5kbGVySWZFdmVudEVtaXR0ZXIoZW1pdHRlciwgZXJyb3JMaXN0ZW5lciwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGhhbmRsZXIsIGZsYWdzKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5vbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCAnZXJyb3InLCBoYW5kbGVyLCBmbGFncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIGxpc3RlbmVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgZW1pdHRlci5vbmNlKG5hbWUsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW1pdHRlci5vbihuYW1lLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBlbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBFdmVudFRhcmdldCBkb2VzIG5vdCBoYXZlIGBlcnJvcmAgZXZlbnQgc2VtYW50aWNzIGxpa2UgTm9kZVxuICAgIC8vIEV2ZW50RW1pdHRlcnMsIHdlIGRvIG5vdCBsaXN0ZW4gZm9yIGBlcnJvcmAgZXZlbnRzIGhlcmUuXG4gICAgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZ1bmN0aW9uIHdyYXBMaXN0ZW5lcihhcmcpIHtcbiAgICAgIC8vIElFIGRvZXMgbm90IGhhdmUgYnVpbHRpbiBgeyBvbmNlOiB0cnVlIH1gIHN1cHBvcnQgc28gd2VcbiAgICAgIC8vIGhhdmUgdG8gZG8gaXQgbWFudWFsbHkuXG4gICAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgd3JhcExpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIGxpc3RlbmVyKGFyZyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiZW1pdHRlclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBFdmVudEVtaXR0ZXIuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBlbWl0dGVyKTtcbiAgfVxufVxuIiwiLyohIGllZWU3NTQuIEJTRC0zLUNsYXVzZSBMaWNlbnNlLiBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmcvb3BlbnNvdXJjZT4gKi9cbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gKGUgKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gKG0gKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAoKHZhbHVlICogYykgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IEtQcm9KUyBmcm9tIFwia3Byb2pzXCI7XG5jb25zdCBrcHJvRGV2aWNlcyA9IFtcbiAgICB7XG4gICAgICAgIHZlbmRvcklkOiBLUHJvSlMuSElERnJhbWluZy5rcHJvVVNCVmVuZG9ySWQsXG4gICAgfSxcbl07XG5jb25zdCBpc1N1cHBvcnRlZCA9ICgpID0+IFByb21pc2UucmVzb2x2ZSghISh3aW5kb3cubmF2aWdhdG9yICYmIHdpbmRvdy5uYXZpZ2F0b3IuaGlkKSk7XG5jb25zdCBnZXRISUQgPSAoKSA9PiB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGNvbnN0IHsgaGlkIH0gPSBuYXZpZ2F0b3I7XG4gICAgaWYgKCFoaWQpXG4gICAgICAgIHRocm93IG5ldyBLUHJvSlMuS1Byb0Vycm9yLlRyYW5zcG9ydEVycm9yKFwibmF2aWdhdG9yLmhpZCBpcyBub3Qgc3VwcG9ydGVkXCIsIFwiSElETm90U3VwcG9ydGVkXCIpO1xuICAgIHJldHVybiBoaWQ7XG59O1xuZnVuY3Rpb24gcmVxdWVzdEtQcm9EZXZpY2VzKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IGRldmljZSA9IHlpZWxkIGdldEhJRCgpLnJlcXVlc3REZXZpY2Uoe1xuICAgICAgICAgICAgZmlsdGVyczoga3Byb0RldmljZXMsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkZXZpY2UpKVxuICAgICAgICAgICAgcmV0dXJuIGRldmljZTtcbiAgICAgICAgcmV0dXJuIFtkZXZpY2VdO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0S1Byb0RldmljZXMoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgZGV2aWNlcyA9IHlpZWxkIGdldEhJRCgpLmdldERldmljZXMoKTtcbiAgICAgICAgcmV0dXJuIGRldmljZXMuZmlsdGVyKGQgPT4gZC52ZW5kb3JJZCA9PT0gS1Byb0pTLkhJREZyYW1pbmcua3Byb1VTQlZlbmRvcklkKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldEZpcnN0S1Byb0RldmljZSgpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCBleGlzdGluZ0RldmljZXMgPSB5aWVsZCBnZXRLUHJvRGV2aWNlcygpO1xuICAgICAgICBpZiAoZXhpc3RpbmdEZXZpY2VzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdEZXZpY2VzWzBdO1xuICAgICAgICBjb25zdCBkZXZpY2VzID0geWllbGQgcmVxdWVzdEtQcm9EZXZpY2VzKCk7XG4gICAgICAgIHJldHVybiBkZXZpY2VzWzBdO1xuICAgIH0pO1xufVxuLyoqXG4gKiBXZWJISUQgVHJhbnNwb3J0IGltcGxlbWVudGF0aW9uXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IFRyYW5zcG9ydFdlYkhJRCBmcm9tIFwidHJhbnNwb3J0LXdlYmhpZFwiO1xuICogLi4uXG4gKiBUcmFuc3BvcnRXZWJISUQuY3JlYXRlKCkudGhlbih0cmFuc3BvcnQgPT4gLi4uKVxuICovXG5jbGFzcyBUcmFuc3BvcnRXZWJISUQgZXh0ZW5kcyBLUHJvSlMuVHJhbnNwb3J0IHtcbiAgICBjb25zdHJ1Y3RvcihkZXZpY2UpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jaGFubmVsID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHhmZmZmKTtcbiAgICAgICAgdGhpcy5wYWNrZXRTaXplID0gNjQ7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW107XG4gICAgICAgIHRoaXMucmVhZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuaW5wdXRzLnNoaWZ0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHN1Y2Nlc3MgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRDYWxsYmFjayA9IHN1Y2Nlc3M7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vbklucHV0UmVwb3J0ID0gKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGUuZGF0YS5idWZmZXIpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRDYWxsYmFjayhidWZmZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRDYWxsYmFjayA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5wdXNoKGJ1ZmZlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RFbWl0dGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2VtaXREaXNjb25uZWN0ID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kaXNjb25uZWN0RW1pdHRlZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB0aGlzLl9kaXNjb25uZWN0RW1pdHRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmVtaXQoXCJkaXNjb25uZWN0XCIsIGUpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogRXhjaGFuZ2Ugd2l0aCB0aGUgZGV2aWNlIHVzaW5nIEFQRFUgcHJvdG9jb2wuXG4gICAgICAgICAqIEBwYXJhbSBhcGR1XG4gICAgICAgICAqIEByZXR1cm5zIGEgcHJvbWlzZSBvZiBhcGR1IHJlc3BvbnNlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmV4Y2hhbmdlID0gKGFwZHUpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGIgPSB5aWVsZCB0aGlzLmV4Y2hhbmdlQXRvbWljSW1wbCgoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjaGFubmVsLCBwYWNrZXRTaXplIH0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIEtQcm9KUy5LUHJvTG9ncy5sb2coXCJhcGR1XCIsIFwiPT4gXCIgKyBhcGR1LnRvU3RyaW5nKFwiaGV4XCIpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmcmFtaW5nID0gS1Byb0pTLkhJREZyYW1pbmcuaGlkRnJhbWluZyhjaGFubmVsLCBwYWNrZXRTaXplKTtcbiAgICAgICAgICAgICAgICAvLyBXcml0ZS4uLlxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrcyA9IGZyYW1pbmcubWFrZUJsb2NrcyhhcGR1KTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLmRldmljZS5zZW5kUmVwb3J0KDAsIGJsb2Nrc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFJlYWQuLi5cbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICAgICAgICAgIGxldCBhY2M7XG4gICAgICAgICAgICAgICAgd2hpbGUgKCEocmVzdWx0ID0gZnJhbWluZy5nZXRSZWR1Y2VkUmVzdWx0KGFjYykpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IHlpZWxkIHRoaXMucmVhZCgpO1xuICAgICAgICAgICAgICAgICAgICBhY2MgPSBmcmFtaW5nLnJlZHVjZVJlc3BvbnNlKGFjYywgYnVmZmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgS1Byb0pTLktQcm9Mb2dzLmxvZyhcImFwZHVcIiwgXCI8PSBcIiArIHJlc3VsdC50b1N0cmluZyhcImhleFwiKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0pKS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZSAmJiBlLm1lc3NhZ2UgJiYgZS5tZXNzYWdlLmluY2x1ZGVzKFwid3JpdGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZW1pdERpc2Nvbm5lY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBLUHJvSlMuS1Byb0Vycm9yLkRpc2Nvbm5lY3RlZERldmljZUR1cmluZ09wZXJhdGlvbihlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xuICAgICAgICB0aGlzLmRldmljZU1vZGVsID1cbiAgICAgICAgICAgIHR5cGVvZiBkZXZpY2UucHJvZHVjdElkID09PSBcIm51bWJlclwiID8gS1Byb0pTLktQcm9EZXZpY2UuaWRlbnRpZnlVU0JQcm9kdWN0SWQoZGV2aWNlLnByb2R1Y3RJZCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIGRldmljZS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRyZXBvcnRcIiwgdGhpcy5vbklucHV0UmVwb3J0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2ltaWxhciB0byBjcmVhdGUoKSBleGNlcHQgaXQgd2lsbCBhbHdheXMgZGlzcGxheSB0aGUgZGV2aWNlIHBlcm1pc3Npb24gKGV2ZW4gaWYgc29tZSBkZXZpY2VzIGFyZSBhbHJlYWR5IGFjY2VwdGVkKS5cbiAgICAgKi9cbiAgICBzdGF0aWMgcmVxdWVzdCgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IFtkZXZpY2VdID0geWllbGQgcmVxdWVzdEtQcm9EZXZpY2VzKCk7XG4gICAgICAgICAgICByZXR1cm4gVHJhbnNwb3J0V2ViSElELm9wZW4oZGV2aWNlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNpbWlsYXIgdG8gY3JlYXRlKCkgZXhjZXB0IGl0IHdpbGwgbmV2ZXIgZGlzcGxheSB0aGUgZGV2aWNlIHBlcm1pc3Npb24gKGl0IHJldHVybnMgYSBQcm9taXNlPD9UcmFuc3BvcnQ+LCBudWxsIGlmIGl0IGZhaWxzIHRvIGZpbmQgYSBkZXZpY2UpLlxuICAgICAqL1xuICAgIHN0YXRpYyBvcGVuQ29ubmVjdGVkKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGV2aWNlcyA9IHlpZWxkIGdldEtQcm9EZXZpY2VzKCk7XG4gICAgICAgICAgICBpZiAoZGV2aWNlcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4gVHJhbnNwb3J0V2ViSElELm9wZW4oZGV2aWNlc1swXSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBLUHJvIHRyYW5zcG9ydCB3aXRoIGEgSElERGV2aWNlXG4gICAgICovXG4gICAgc3RhdGljIG9wZW4oZGV2aWNlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCBkZXZpY2Uub3BlbigpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNwb3J0ID0gbmV3IFRyYW5zcG9ydFdlYkhJRChkZXZpY2UpO1xuICAgICAgICAgICAgY29uc3Qgb25EaXNjb25uZWN0ID0gKGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGV2aWNlID09PSBlLmRldmljZSkge1xuICAgICAgICAgICAgICAgICAgICBnZXRISUQoKS5yZW1vdmVFdmVudExpc3RlbmVyKFwiZGlzY29ubmVjdFwiLCBvbkRpc2Nvbm5lY3QpO1xuICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnQuX2VtaXREaXNjb25uZWN0KG5ldyBLUHJvSlMuS1Byb0Vycm9yLkRpc2Nvbm5lY3RlZERldmljZSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2V0SElEKCkuYWRkRXZlbnRMaXN0ZW5lcihcImRpc2Nvbm5lY3RcIiwgb25EaXNjb25uZWN0KTtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc3BvcnQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWxlYXNlIHRoZSB0cmFuc3BvcnQgZGV2aWNlXG4gICAgICovXG4gICAgY2xvc2UoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLmV4Y2hhbmdlQnVzeVByb21pc2U7XG4gICAgICAgICAgICB0aGlzLmRldmljZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiaW5wdXRyZXBvcnRcIiwgdGhpcy5vbklucHV0UmVwb3J0KTtcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuZGV2aWNlLmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbi8qKlxuICogQ2hlY2sgaWYgV2ViVVNCIHRyYW5zcG9ydCBpcyBzdXBwb3J0ZWQuXG4gKi9cblRyYW5zcG9ydFdlYkhJRC5pc1N1cHBvcnRlZCA9IGlzU3VwcG9ydGVkO1xuLyoqXG4gKiBMaXN0IHRoZSBXZWJVU0IgZGV2aWNlcyB0aGF0IHdhcyBwcmV2aW91c2x5IGF1dGhvcml6ZWQgYnkgdGhlIHVzZXIuXG4gKi9cblRyYW5zcG9ydFdlYkhJRC5saXN0ID0gZ2V0S1Byb0RldmljZXM7XG4vKipcbiAqIEFjdGl2ZWx5IGxpc3RlbiB0byBXZWJVU0IgZGV2aWNlcyBhbmQgZW1pdCBPTkUgZGV2aWNlXG4gKiB0aGF0IHdhcyBlaXRoZXIgYWNjZXB0ZWQgYmVmb3JlLCBpZiBub3QgaXQgd2lsbCB0cmlnZ2VyIHRoZSBuYXRpdmUgcGVybWlzc2lvbiBVSS5cbiAqXG4gKiBJbXBvcnRhbnQ6IGl0IG11c3QgYmUgY2FsbGVkIGluIHRoZSBjb250ZXh0IG9mIGEgVUkgY2xpY2shXG4gKi9cblRyYW5zcG9ydFdlYkhJRC5saXN0ZW4gPSAob2JzZXJ2ZXIpID0+IHtcbiAgICBsZXQgdW5zdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgZ2V0Rmlyc3RLUHJvRGV2aWNlKCkudGhlbihkZXZpY2UgPT4ge1xuICAgICAgICBpZiAoIWRldmljZSkge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IobmV3IEtQcm9KUy5LUHJvRXJyb3IuVHJhbnNwb3J0T3BlblVzZXJDYW5jZWxsZWQoXCJBY2Nlc3MgZGVuaWVkIHRvIHVzZSBLUHJvIGRldmljZVwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXVuc3Vic2NyaWJlZCkge1xuICAgICAgICAgICAgY29uc3QgZGV2aWNlTW9kZWwgPSB0eXBlb2YgZGV2aWNlLnByb2R1Y3RJZCA9PT0gXCJudW1iZXJcIlxuICAgICAgICAgICAgICAgID8gS1Byb0pTLktQcm9EZXZpY2UuaWRlbnRpZnlVU0JQcm9kdWN0SWQoZGV2aWNlLnByb2R1Y3RJZClcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiYWRkXCIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvcjogZGV2aWNlLFxuICAgICAgICAgICAgICAgIGRldmljZU1vZGVsLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICBvYnNlcnZlci5lcnJvcihuZXcgS1Byb0pTLktQcm9FcnJvci5UcmFuc3BvcnRPcGVuVXNlckNhbmNlbGxlZChlcnJvci5tZXNzYWdlKSk7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgICAgIHVuc3Vic2NyaWJlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHVuc3Vic2NyaWJlLFxuICAgIH07XG59O1xuZXhwb3J0IGRlZmF1bHQgVHJhbnNwb3J0V2ViSElEO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNwb3J0LXdlYi1oaWQuanMubWFwIiwiZXhwb3J0IHZhciBLUHJvRGV2aWNlO1xuKGZ1bmN0aW9uIChLUHJvRGV2aWNlKSB7XG4gICAgdmFyIGRldmljZSA9IHtcbiAgICAgICAgaWQ6IDAsXG4gICAgICAgIHByb2R1Y3ROYW1lOiBcIktleWNhcmQgUHJvIFdhbGxldFwiLFxuICAgICAgICBwcm9kdWN0SWQ6IDB4MDAwMVxuICAgIH07XG4gICAgS1Byb0RldmljZS5pZGVudGlmeVVTQlByb2R1Y3RJZCA9IGZ1bmN0aW9uICh1c2JQcm9kdWN0SWQpIHtcbiAgICAgICAgcmV0dXJuIGRldmljZS5wcm9kdWN0SWQgPT09IHVzYlByb2R1Y3RJZCA/IGRldmljZSA6IG51bGw7XG4gICAgfTtcbiAgICBLUHJvRGV2aWNlLmlkZW50aWZ5UHJvZHVjdE5hbWUgPSBmdW5jdGlvbiAocHJvZHVjdE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIChwcm9kdWN0TmFtZSA9PT0gZGV2aWNlLnByb2R1Y3ROYW1lKSA/IGRldmljZSA6IG51bGw7XG4gICAgfTtcbn0pKEtQcm9EZXZpY2UgfHwgKEtQcm9EZXZpY2UgPSB7fSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGV2aWNlLmpzLm1hcCIsInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX192YWx1ZXMgPSAodGhpcyAmJiB0aGlzLl9fdmFsdWVzKSB8fCBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn07XG52YXIgZXJyb3JDbGFzc2VzID0ge307XG52YXIgZGVzZXJpYWxpemVycyA9IHt9O1xudmFyIGlzT2JqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIjtcbn07XG5leHBvcnQgdmFyIGFkZEN1c3RvbUVycm9yRGVzZXJpYWxpemVyID0gZnVuY3Rpb24gKG5hbWUsIGRlc2VyaWFsaXplcikge1xuICAgIGRlc2VyaWFsaXplcnNbbmFtZV0gPSBkZXNlcmlhbGl6ZXI7XG59O1xuZXhwb3J0IHZhciBjcmVhdGVDdXN0b21FcnJvckNsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgQ3VzdG9tRXJyb3JDbGFzcyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKEN1c3RvbUVycm9yQ2xhc3MsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIEN1c3RvbUVycm9yQ2xhc3MobWVzc2FnZSwgZmllbGRzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIG1lc3NhZ2UgfHwgbmFtZSwgb3B0aW9ucykgfHwgdGhpcztcbiAgICAgICAgICAgIC8vIFNldCB0aGUgcHJvdG90eXBlIGV4cGxpY2l0bHkuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvd2lraS9CcmVha2luZy1DaGFuZ2VzI2V4dGVuZGluZy1idWlsdC1pbnMtbGlrZS1lcnJvci1hcnJheS1hbmQtbWFwLW1heS1uby1sb25nZXItd29ya1xuICAgICAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKF90aGlzLCBDdXN0b21FcnJvckNsYXNzLnByb3RvdHlwZSk7XG4gICAgICAgICAgICBfdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIGlmIChmaWVsZHMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIGZpZWxkcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgX3RoaXNba10gPSBmaWVsZHNba107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgaXNPYmplY3Qob3B0aW9ucykgJiYgXCJjYXVzZVwiIGluIG9wdGlvbnMgJiYgIShcImNhdXNlXCIgaW4gX3RoaXMpKSB7XG4gICAgICAgICAgICAgICAgLy8gLmNhdXNlIHdhcyBzcGVjaWZpZWQgYnV0IHRoZSBzdXBlcmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgLy8gZGlkIG5vdCBjcmVhdGUgYW4gaW5zdGFuY2UgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgdmFyIGNhdXNlID0gb3B0aW9ucy5jYXVzZTtcbiAgICAgICAgICAgICAgICBfdGhpcy5jYXVzZSA9IGNhdXNlO1xuICAgICAgICAgICAgICAgIGlmIChcInN0YWNrXCIgaW4gY2F1c2UpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc3RhY2sgPSBfdGhpcy5zdGFjayArIFwiXFxuQ0FVU0U6IFwiICsgY2F1c2Uuc3RhY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDdXN0b21FcnJvckNsYXNzO1xuICAgIH0oRXJyb3IpKTtcbiAgICBlcnJvckNsYXNzZXNbbmFtZV0gPSBDdXN0b21FcnJvckNsYXNzO1xuICAgIHJldHVybiBDdXN0b21FcnJvckNsYXNzO1xufTtcbi8vIGluc3BpcmVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Byb2dyYW1ibGUvZXJyaW8vYmxvYi9tYXN0ZXIvaW5kZXguanNcbmV4cG9ydCB2YXIgZGVzZXJpYWxpemVFcnJvciA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0Lm1lc3NhZ2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbXNnID0gSlNPTi5wYXJzZShvYmplY3QubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgaWYgKG1zZy5tZXNzYWdlICYmIG1zZy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IG1zZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIG5vdGhpbmdcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXJyb3IgPSB2b2lkIDA7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0Lm5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHZhciBuYW1lXzEgPSBvYmplY3QubmFtZTtcbiAgICAgICAgICAgIHZhciBkZXMgPSBkZXNlcmlhbGl6ZXJzW25hbWVfMV07XG4gICAgICAgICAgICBpZiAoZGVzKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBkZXMob2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBjb25zdHJ1Y3RvciA9IG5hbWVfMSA9PT0gXCJFcnJvclwiID8gRXJyb3IgOiBlcnJvckNsYXNzZXNbbmFtZV8xXTtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImRlc2VyaWFsaXppbmcgYW4gdW5rbm93biBjbGFzcyAnXCIgKyBuYW1lXzEgKyBcIidcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhuYW1lXzEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlcnJvciA9IE9iamVjdC5jcmVhdGUoY29uc3RydWN0b3IucHJvdG90eXBlKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yW3Byb3BdID0gb2JqZWN0W3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNvbWV0aW1lcyBzZXR0aW5nIGEgcHJvcGVydHkgY2FuIGZhaWwgKGUuZy4gLm5hbWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QubWVzc2FnZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKG9iamVjdC5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgJiYgIWVycm9yLnN0YWNrICYmIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZShlcnJvciwgZGVzZXJpYWxpemVFcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEVycm9yKFN0cmluZyhvYmplY3QpKTtcbn07XG4vLyBpbnNwaXJlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvc2VyaWFsaXplLWVycm9yL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG5leHBvcnQgdmFyIHNlcmlhbGl6ZUVycm9yID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIGRlc3Ryb3lDaXJjdWxhcih2YWx1ZSwgW10pO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiW0Z1bmN0aW9uOiBcIi5jb25jYXQodmFsdWUubmFtZSB8fCBcImFub255bW91c1wiLCBcIl1cIik7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn07XG4vLyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9kZXN0cm95LWNpcmN1bGFyXG52YXIgZGVzdHJveUNpcmN1bGFyID0gZnVuY3Rpb24gKGZyb20sIHNlZW4pIHtcbiAgICB2YXIgZV8xLCBfYTtcbiAgICB2YXIgdG8gPSB7fTtcbiAgICBzZWVuLnB1c2goZnJvbSk7XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhmcm9tKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBfYy52YWx1ZTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGZyb21ba2V5XTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICB0b1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2Vlbi5pbmRleE9mKGZyb21ba2V5XSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdG9ba2V5XSA9IGRlc3Ryb3lDaXJjdWxhcihmcm9tW2tleV0sIHNlZW4uc2xpY2UoMCkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9ba2V5XSA9IFwiW0NpcmN1bGFyXVwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGZyb20ubmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0by5uYW1lID0gZnJvbS5uYW1lO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGZyb20ubWVzc2FnZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0by5tZXNzYWdlID0gZnJvbS5tZXNzYWdlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGZyb20uc3RhY2sgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdG8uc3RhY2sgPSBmcm9tLnN0YWNrO1xuICAgIH1cbiAgICByZXR1cm4gdG87XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXJyb3ItaGVscGVycy5qcy5tYXAiLCJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiAgIExlZGdlciBOb2RlIEpTIEFQSVxuICogICAoYykgMjAxNi0yMDE3IExlZGdlclxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmltcG9ydCB7IHNlcmlhbGl6ZUVycm9yLCBkZXNlcmlhbGl6ZUVycm9yLCBjcmVhdGVDdXN0b21FcnJvckNsYXNzLCBhZGRDdXN0b21FcnJvckRlc2VyaWFsaXplciB9IGZyb20gXCIuL2Vycm9yLWhlbHBlcnNcIjtcbmV4cG9ydCB7IHNlcmlhbGl6ZUVycm9yLCBkZXNlcmlhbGl6ZUVycm9yLCBjcmVhdGVDdXN0b21FcnJvckNsYXNzLCBhZGRDdXN0b21FcnJvckRlc2VyaWFsaXplciB9O1xuZXhwb3J0IHZhciBBY2NvdW50TmFtZVJlcXVpcmVkRXJyb3IgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiQWNjb3VudE5hbWVSZXF1aXJlZFwiKTtcbmV4cG9ydCB2YXIgQWNjb3VudE5vdFN1cHBvcnRlZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJBY2NvdW50Tm90U3VwcG9ydGVkXCIpO1xuZXhwb3J0IHZhciBBbW91bnRSZXF1aXJlZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJBbW91bnRSZXF1aXJlZFwiKTtcbmV4cG9ydCB2YXIgQ2FudE9wZW5EZXZpY2UgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiQ2FudE9wZW5EZXZpY2VcIik7XG5leHBvcnQgdmFyIENhc2hBZGRyTm90U3VwcG9ydGVkID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkNhc2hBZGRyTm90U3VwcG9ydGVkXCIpO1xuZXhwb3J0IHZhciBDbGFpbVJld2FyZHNGZWVzV2FybmluZyA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJDbGFpbVJld2FyZHNGZWVzV2FybmluZ1wiKTtcbmV4cG9ydCB2YXIgQ3VycmVuY3lOb3RTdXBwb3J0ZWQgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiQ3VycmVuY3lOb3RTdXBwb3J0ZWRcIik7XG5leHBvcnQgdmFyIERldmljZUFwcFZlcmlmeU5vdFN1cHBvcnRlZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJEZXZpY2VBcHBWZXJpZnlOb3RTdXBwb3J0ZWRcIik7XG5leHBvcnQgdmFyIERldmljZUdlbnVpbmVTb2NrZXRFYXJseUNsb3NlID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkRldmljZUdlbnVpbmVTb2NrZXRFYXJseUNsb3NlXCIpO1xuZXhwb3J0IHZhciBEZXZpY2VOb3RHZW51aW5lRXJyb3IgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiRGV2aWNlTm90R2VudWluZVwiKTtcbmV4cG9ydCB2YXIgRGV2aWNlT25EYXNoYm9hcmRFeHBlY3RlZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJEZXZpY2VPbkRhc2hib2FyZEV4cGVjdGVkXCIpO1xuZXhwb3J0IHZhciBEZXZpY2VPbkRhc2hib2FyZFVuZXhwZWN0ZWQgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiRGV2aWNlT25EYXNoYm9hcmRVbmV4cGVjdGVkXCIpO1xuZXhwb3J0IHZhciBEZXZpY2VJbk9TVUV4cGVjdGVkID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkRldmljZUluT1NVRXhwZWN0ZWRcIik7XG5leHBvcnQgdmFyIERldmljZUhhbHRlZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJEZXZpY2VIYWx0ZWRcIik7XG5leHBvcnQgdmFyIERldmljZU5hbWVJbnZhbGlkID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkRldmljZU5hbWVJbnZhbGlkXCIpO1xuZXhwb3J0IHZhciBEZXZpY2VTb2NrZXRGYWlsID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkRldmljZVNvY2tldEZhaWxcIik7XG5leHBvcnQgdmFyIERldmljZVNvY2tldE5vQnVsa1N0YXR1cyA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJEZXZpY2VTb2NrZXROb0J1bGtTdGF0dXNcIik7XG5leHBvcnQgdmFyIExvY2tlZERldmljZUVycm9yID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkxvY2tlZERldmljZUVycm9yXCIpO1xuZXhwb3J0IHZhciBVbnJlc3BvbnNpdmVEZXZpY2VFcnJvciA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJVbnJlc3BvbnNpdmVEZXZpY2VFcnJvclwiKTtcbmV4cG9ydCB2YXIgRGlzY29ubmVjdGVkRGV2aWNlID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkRpc2Nvbm5lY3RlZERldmljZVwiKTtcbmV4cG9ydCB2YXIgRGlzY29ubmVjdGVkRGV2aWNlRHVyaW5nT3BlcmF0aW9uID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkRpc2Nvbm5lY3RlZERldmljZUR1cmluZ09wZXJhdGlvblwiKTtcbmV4cG9ydCB2YXIgRGV2aWNlRXh0cmFjdE9uYm9hcmRpbmdTdGF0ZUVycm9yID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkRldmljZUV4dHJhY3RPbmJvYXJkaW5nU3RhdGVFcnJvclwiKTtcbmV4cG9ydCB2YXIgRGV2aWNlT25ib2FyZGluZ1N0YXRlUG9sbGluZ0Vycm9yID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkRldmljZU9uYm9hcmRpbmdTdGF0ZVBvbGxpbmdFcnJvclwiKTtcbmV4cG9ydCB2YXIgRW5wb2ludENvbmZpZ0Vycm9yID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkVucG9pbnRDb25maWdcIik7XG5leHBvcnQgdmFyIEV0aEFwcFBsZWFzZUVuYWJsZUNvbnRyYWN0RGF0YSA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJFdGhBcHBQbGVhc2VFbmFibGVDb250cmFjdERhdGFcIik7XG5leHBvcnQgdmFyIEZlZUVzdGltYXRpb25GYWlsZWQgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiRmVlRXN0aW1hdGlvbkZhaWxlZFwiKTtcbmV4cG9ydCB2YXIgRmlybXdhcmVOb3RSZWNvZ25pemVkID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkZpcm13YXJlTm90UmVjb2duaXplZFwiKTtcbmV4cG9ydCB2YXIgSGFyZFJlc2V0RmFpbCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJIYXJkUmVzZXRGYWlsXCIpO1xuZXhwb3J0IHZhciBJbnZhbGlkWFJQVGFnID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkludmFsaWRYUlBUYWdcIik7XG5leHBvcnQgdmFyIEludmFsaWRBZGRyZXNzID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkludmFsaWRBZGRyZXNzXCIpO1xuZXhwb3J0IHZhciBJbnZhbGlkTm9uY2UgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiSW52YWxpZE5vbmNlXCIpO1xuZXhwb3J0IHZhciBJbnZhbGlkQWRkcmVzc0JlY2F1c2VEZXN0aW5hdGlvbklzQWxzb1NvdXJjZSA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJJbnZhbGlkQWRkcmVzc0JlY2F1c2VEZXN0aW5hdGlvbklzQWxzb1NvdXJjZVwiKTtcbmV4cG9ydCB2YXIgTGF0ZXN0TUNVSW5zdGFsbGVkRXJyb3IgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTGF0ZXN0TUNVSW5zdGFsbGVkRXJyb3JcIik7XG5leHBvcnQgdmFyIFVua25vd25NQ1UgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiVW5rbm93bk1DVVwiKTtcbmV4cG9ydCB2YXIgS1Byb0FQSUVycm9yID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIktQcm9BUElFcnJvclwiKTtcbmV4cG9ydCB2YXIgS1Byb0FQSUVycm9yV2l0aE1lc3NhZ2UgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiS1Byb0FQSUVycm9yV2l0aE1lc3NhZ2VcIik7XG5leHBvcnQgdmFyIEtQcm9BUElOb3RBdmFpbGFibGUgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiS1Byb0FQSU5vdEF2YWlsYWJsZVwiKTtcbmV4cG9ydCB2YXIgTWFuYWdlckFwcEFscmVhZHlJbnN0YWxsZWRFcnJvciA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJNYW5hZ2VyQXBwQWxyZWFkeUluc3RhbGxlZFwiKTtcbmV4cG9ydCB2YXIgTWFuYWdlckFwcERlcEluc3RhbGxSZXF1aXJlZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJNYW5hZ2VyQXBwRGVwSW5zdGFsbFJlcXVpcmVkXCIpO1xuZXhwb3J0IHZhciBNYW5hZ2VyQXBwRGVwVW5pbnN0YWxsUmVxdWlyZWQgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTWFuYWdlckFwcERlcFVuaW5zdGFsbFJlcXVpcmVkXCIpO1xuZXhwb3J0IHZhciBNYW5hZ2VyRGV2aWNlTG9ja2VkRXJyb3IgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTWFuYWdlckRldmljZUxvY2tlZFwiKTtcbmV4cG9ydCB2YXIgTWFuYWdlckZpcm13YXJlTm90RW5vdWdoU3BhY2VFcnJvciA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJNYW5hZ2VyRmlybXdhcmVOb3RFbm91Z2hTcGFjZVwiKTtcbmV4cG9ydCB2YXIgTWFuYWdlck5vdEVub3VnaFNwYWNlRXJyb3IgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTWFuYWdlck5vdEVub3VnaFNwYWNlXCIpO1xuZXhwb3J0IHZhciBNYW5hZ2VyVW5pbnN0YWxsQlRDRGVwID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIk1hbmFnZXJVbmluc3RhbGxCVENEZXBcIik7XG5leHBvcnQgdmFyIE5ldHdvcmtEb3duID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIk5ldHdvcmtEb3duXCIpO1xuZXhwb3J0IHZhciBOb0FkZHJlc3Nlc0ZvdW5kID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIk5vQWRkcmVzc2VzRm91bmRcIik7XG5leHBvcnQgdmFyIE5vdEVub3VnaEJhbGFuY2UgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTm90RW5vdWdoQmFsYW5jZVwiKTtcbmV4cG9ydCB2YXIgTm90RW5vdWdoQmFsYW5jZVRvRGVsZWdhdGUgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTm90RW5vdWdoQmFsYW5jZVRvRGVsZWdhdGVcIik7XG5leHBvcnQgdmFyIE5vdEVub3VnaEJhbGFuY2VJblBhcmVudEFjY291bnQgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTm90RW5vdWdoQmFsYW5jZUluUGFyZW50QWNjb3VudFwiKTtcbmV4cG9ydCB2YXIgTm90RW5vdWdoU3BlbmRhYmxlQmFsYW5jZSA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJOb3RFbm91Z2hTcGVuZGFibGVCYWxhbmNlXCIpO1xuZXhwb3J0IHZhciBOb3RFbm91Z2hCYWxhbmNlQmVjYXVzZURlc3RpbmF0aW9uTm90Q3JlYXRlZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJOb3RFbm91Z2hCYWxhbmNlQmVjYXVzZURlc3RpbmF0aW9uTm90Q3JlYXRlZFwiKTtcbmV4cG9ydCB2YXIgTm9BY2Nlc3NUb0NhbWVyYSA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJOb0FjY2Vzc1RvQ2FtZXJhXCIpO1xuZXhwb3J0IHZhciBOb3RFbm91Z2hHYXMgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTm90RW5vdWdoR2FzXCIpO1xuLy8gRXJyb3IgbWVzc2FnZSBzcGVjaWZpY2FsbHkgZm9yIHRoZSBQVFggc3dhcCBmbG93XG5leHBvcnQgdmFyIE5vdEVub3VnaEdhc1N3YXAgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTm90RW5vdWdoR2FzU3dhcFwiKTtcbmV4cG9ydCB2YXIgTm90U3VwcG9ydGVkTGVnYWN5QWRkcmVzcyA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJOb3RTdXBwb3J0ZWRMZWdhY3lBZGRyZXNzXCIpO1xuZXhwb3J0IHZhciBHYXNMZXNzVGhhbkVzdGltYXRlID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkdhc0xlc3NUaGFuRXN0aW1hdGVcIik7XG5leHBvcnQgdmFyIFByaW9yaXR5RmVlVG9vTG93ID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlByaW9yaXR5RmVlVG9vTG93XCIpO1xuZXhwb3J0IHZhciBQcmlvcml0eUZlZVRvb0hpZ2ggPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiUHJpb3JpdHlGZWVUb29IaWdoXCIpO1xuZXhwb3J0IHZhciBQcmlvcml0eUZlZUhpZ2hlclRoYW5NYXhGZWUgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiUHJpb3JpdHlGZWVIaWdoZXJUaGFuTWF4RmVlXCIpO1xuZXhwb3J0IHZhciBNYXhGZWVUb29Mb3cgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTWF4RmVlVG9vTG93XCIpO1xuZXhwb3J0IHZhciBQYXNzd29yZHNEb250TWF0Y2hFcnJvciA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJQYXNzd29yZHNEb250TWF0Y2hcIik7XG5leHBvcnQgdmFyIFBhc3N3b3JkSW5jb3JyZWN0RXJyb3IgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiUGFzc3dvcmRJbmNvcnJlY3RcIik7XG5leHBvcnQgdmFyIFJlY29tbWVuZFN1YkFjY291bnRzVG9FbXB0eSA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJSZWNvbW1lbmRTdWJBY2NvdW50c1RvRW1wdHlcIik7XG5leHBvcnQgdmFyIFJlY29tbWVuZFVuZGVsZWdhdGlvbiA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJSZWNvbW1lbmRVbmRlbGVnYXRpb25cIik7XG5leHBvcnQgdmFyIFRpbWVvdXRUYWdnZWQgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiVGltZW91dFRhZ2dlZFwiKTtcbmV4cG9ydCB2YXIgVW5leHBlY3RlZEJvb3Rsb2FkZXIgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiVW5leHBlY3RlZEJvb3Rsb2FkZXJcIik7XG5leHBvcnQgdmFyIE1DVU5vdEdlbnVpbmVUb0Rhc2hib2FyZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJNQ1VOb3RHZW51aW5lVG9EYXNoYm9hcmRcIik7XG5leHBvcnQgdmFyIFJlY2lwaWVudFJlcXVpcmVkID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlJlY2lwaWVudFJlcXVpcmVkXCIpO1xuZXhwb3J0IHZhciBVcGRhdGVGZXRjaEZpbGVGYWlsID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlVwZGF0ZUZldGNoRmlsZUZhaWxcIik7XG5leHBvcnQgdmFyIFVwZGF0ZUluY29ycmVjdEhhc2ggPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiVXBkYXRlSW5jb3JyZWN0SGFzaFwiKTtcbmV4cG9ydCB2YXIgVXBkYXRlSW5jb3JyZWN0U2lnID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlVwZGF0ZUluY29ycmVjdFNpZ1wiKTtcbmV4cG9ydCB2YXIgVXBkYXRlWW91ckFwcCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJVcGRhdGVZb3VyQXBwXCIpO1xuZXhwb3J0IHZhciBVc2VyUmVmdXNlZERldmljZU5hbWVDaGFuZ2UgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiVXNlclJlZnVzZWREZXZpY2VOYW1lQ2hhbmdlXCIpO1xuZXhwb3J0IHZhciBVc2VyUmVmdXNlZEFkZHJlc3MgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiVXNlclJlZnVzZWRBZGRyZXNzXCIpO1xuZXhwb3J0IHZhciBVc2VyUmVmdXNlZEZpcm13YXJlVXBkYXRlID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlVzZXJSZWZ1c2VkRmlybXdhcmVVcGRhdGVcIik7XG5leHBvcnQgdmFyIFVzZXJSZWZ1c2VkQWxsb3dNYW5hZ2VyID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlVzZXJSZWZ1c2VkQWxsb3dNYW5hZ2VyXCIpO1xuZXhwb3J0IHZhciBVc2VyUmVmdXNlZE9uRGV2aWNlID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlVzZXJSZWZ1c2VkT25EZXZpY2VcIik7IC8vIFRPRE8gcmVuYW1lIGJlY2F1c2UgaXQncyBqdXN0IGZvciB0cmFuc2FjdGlvbiByZWZ1c2FsXG5leHBvcnQgdmFyIFRyYW5zcG9ydE9wZW5Vc2VyQ2FuY2VsbGVkID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlRyYW5zcG9ydE9wZW5Vc2VyQ2FuY2VsbGVkXCIpO1xuZXhwb3J0IHZhciBUcmFuc3BvcnRJbnRlcmZhY2VOb3RBdmFpbGFibGUgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiVHJhbnNwb3J0SW50ZXJmYWNlTm90QXZhaWxhYmxlXCIpO1xuZXhwb3J0IHZhciBUcmFuc3BvcnRSYWNlQ29uZGl0aW9uID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlRyYW5zcG9ydFJhY2VDb25kaXRpb25cIik7XG5leHBvcnQgdmFyIFRyYW5zcG9ydFdlYlVTQkdlc3R1cmVSZXF1aXJlZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJUcmFuc3BvcnRXZWJVU0JHZXN0dXJlUmVxdWlyZWRcIik7XG5leHBvcnQgdmFyIFRyYW5zYWN0aW9uSGFzQmVlblZhbGlkYXRlZEVycm9yID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlRyYW5zYWN0aW9uSGFzQmVlblZhbGlkYXRlZEVycm9yXCIpO1xuZXhwb3J0IHZhciBEZXZpY2VTaG91bGRTdGF5SW5BcHAgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiRGV2aWNlU2hvdWxkU3RheUluQXBwXCIpO1xuZXhwb3J0IHZhciBXZWJzb2NrZXRDb25uZWN0aW9uRXJyb3IgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiV2Vic29ja2V0Q29ubmVjdGlvbkVycm9yXCIpO1xuZXhwb3J0IHZhciBXZWJzb2NrZXRDb25uZWN0aW9uRmFpbGVkID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIldlYnNvY2tldENvbm5lY3Rpb25GYWlsZWRcIik7XG5leHBvcnQgdmFyIFdyb25nRGV2aWNlRm9yQWNjb3VudCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJXcm9uZ0RldmljZUZvckFjY291bnRcIik7XG5leHBvcnQgdmFyIFdyb25nQXBwRm9yQ3VycmVuY3kgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiV3JvbmdBcHBGb3JDdXJyZW5jeVwiKTtcbmV4cG9ydCB2YXIgRVRIQWRkcmVzc05vbkVJUCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJFVEhBZGRyZXNzTm9uRUlQXCIpO1xuZXhwb3J0IHZhciBDYW50U2NhblFSQ29kZSA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJDYW50U2NhblFSQ29kZVwiKTtcbmV4cG9ydCB2YXIgRmVlTm90TG9hZGVkID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIkZlZU5vdExvYWRlZFwiKTtcbmV4cG9ydCB2YXIgRmVlUmVxdWlyZWQgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiRmVlUmVxdWlyZWRcIik7XG5leHBvcnQgdmFyIEZlZVRvb0hpZ2ggPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiRmVlVG9vSGlnaFwiKTtcbmV4cG9ydCB2YXIgUGVuZGluZ09wZXJhdGlvbiA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJQZW5kaW5nT3BlcmF0aW9uXCIpO1xuZXhwb3J0IHZhciBTeW5jRXJyb3IgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiU3luY0Vycm9yXCIpO1xuZXhwb3J0IHZhciBQYWlyaW5nRmFpbGVkID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIlBhaXJpbmdGYWlsZWRcIik7XG5leHBvcnQgdmFyIFBlZXJSZW1vdmVkUGFpcmluZyA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJQZWVyUmVtb3ZlZFBhaXJpbmdcIik7XG5leHBvcnQgdmFyIEdlbnVpbmVDaGVja0ZhaWxlZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJHZW51aW5lQ2hlY2tGYWlsZWRcIik7XG5leHBvcnQgdmFyIEZpcm13YXJlT3JBcHBVcGRhdGVSZXF1aXJlZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJGaXJtd2FyZU9yQXBwVXBkYXRlUmVxdWlyZWRcIik7XG5leHBvcnQgdmFyIEtQcm9BUEkgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiS1Byb0FQSVwiKTtcbi8vIExhbmd1YWdlXG5leHBvcnQgdmFyIExhbmd1YWdlTm90Rm91bmQgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiTGFuZ3VhZ2VOb3RGb3VuZFwiKTtcbi8vIGRiIHN0dWZmLCBubyBuZWVkIHRvIHRyYW5zbGF0ZVxuZXhwb3J0IHZhciBOb0RCUGF0aEdpdmVuID0gY3JlYXRlQ3VzdG9tRXJyb3JDbGFzcyhcIk5vREJQYXRoR2l2ZW5cIik7XG5leHBvcnQgdmFyIERCV3JvbmdQYXNzd29yZCA9IGNyZWF0ZUN1c3RvbUVycm9yQ2xhc3MoXCJEQldyb25nUGFzc3dvcmRcIik7XG5leHBvcnQgdmFyIERCTm90UmVzZXQgPSBjcmVhdGVDdXN0b21FcnJvckNsYXNzKFwiREJOb3RSZXNldFwiKTtcbi8qKlxuICogVHlwZSBvZiBhIFRyYW5zcG9ydCBlcnJvciB1c2VkIHRvIHJlcHJlc2VudCBhbGwgZXF1aXZhbGVudCBlcnJvcnMgY29taW5nIGZyb20gYWxsIHBvc3NpYmxlIGltcGxlbWVudGF0aW9uIG9mIFRyYW5zcG9ydFxuICovXG5leHBvcnQgdmFyIEh3VHJhbnNwb3J0RXJyb3JUeXBlO1xuKGZ1bmN0aW9uIChId1RyYW5zcG9ydEVycm9yVHlwZSkge1xuICAgIEh3VHJhbnNwb3J0RXJyb3JUeXBlW1wiVW5rbm93blwiXSA9IFwiVW5rbm93blwiO1xuICAgIEh3VHJhbnNwb3J0RXJyb3JUeXBlW1wiTG9jYXRpb25TZXJ2aWNlc0Rpc2FibGVkXCJdID0gXCJMb2NhdGlvblNlcnZpY2VzRGlzYWJsZWRcIjtcbiAgICBId1RyYW5zcG9ydEVycm9yVHlwZVtcIkxvY2F0aW9uU2VydmljZXNVbmF1dGhvcml6ZWRcIl0gPSBcIkxvY2F0aW9uU2VydmljZXNVbmF1dGhvcml6ZWRcIjtcbiAgICBId1RyYW5zcG9ydEVycm9yVHlwZVtcIkJsdWV0b290aFNjYW5TdGFydEZhaWxlZFwiXSA9IFwiQmx1ZXRvb3RoU2NhblN0YXJ0RmFpbGVkXCI7XG59KShId1RyYW5zcG9ydEVycm9yVHlwZSB8fCAoSHdUcmFuc3BvcnRFcnJvclR5cGUgPSB7fSkpO1xuLyoqXG4gKiBSZXByZXNlbnRzIGFuIGVycm9yIGNvbWluZyBmcm9tIHRoZSB1c2FnZSBvZiBhbnkgVHJhbnNwb3J0IGltcGxlbWVudGF0aW9uLlxuICpcbiAqIE5lZWRlZCB0byBtYXAgYSBzcGVjaWZpYyBpbXBsZW1lbnRhdGlvbiBlcnJvciBpbnRvIGFuIGVycm9yIHRoYXRcbiAqIGNhbiBiZSBtYW5hZ2VkIGJ5IGFueSBjb2RlIHVuYXdhcmUgb2YgdGhlIHNwZWNpZmljIFRyYW5zcG9ydCBpbXBsZW1lbnRhdGlvblxuICogdGhhdCB3YXMgdXNlZC5cbiAqL1xudmFyIEh3VHJhbnNwb3J0RXJyb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEh3VHJhbnNwb3J0RXJyb3IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gSHdUcmFuc3BvcnRFcnJvcih0eXBlLCBtZXNzYWdlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG1lc3NhZ2UpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLm5hbWUgPSBcIkh3VHJhbnNwb3J0RXJyb3JcIjtcbiAgICAgICAgX3RoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIC8vIE5lZWRlZCBhcyBsb25nIGFzIHdlIHRhcmdldCA8IEVTNlxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoX3RoaXMsIEh3VHJhbnNwb3J0RXJyb3IucHJvdG90eXBlKTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gSHdUcmFuc3BvcnRFcnJvcjtcbn0oRXJyb3IpKTtcbmV4cG9ydCB7IEh3VHJhbnNwb3J0RXJyb3IgfTtcbi8qKlxuICogVHJhbnNwb3J0RXJyb3IgaXMgdXNlZCBmb3IgYW55IGdlbmVyaWMgdHJhbnNwb3J0IGVycm9ycy5cbiAqIGUuZy4gRXJyb3IgdGhyb3duIHdoZW4gZGF0YSByZWNlaXZlZCBieSBleGNoYW5nZXMgYXJlIGluY29ycmVjdCBvciBpZiBleGNoYW5nZWQgZmFpbGVkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIGRldmljZSBmb3IgdmFyaW91cyByZWFzb24uXG4gKi9cbnZhciBUcmFuc3BvcnRFcnJvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVHJhbnNwb3J0RXJyb3IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVHJhbnNwb3J0RXJyb3IobWVzc2FnZSwgaWQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIG5hbWUgPSBcIlRyYW5zcG9ydEVycm9yXCI7XG4gICAgICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbWVzc2FnZSB8fCBuYW1lKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgX3RoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIF90aGlzLnN0YWNrID0gbmV3IEVycm9yKG1lc3NhZ2UpLnN0YWNrO1xuICAgICAgICBfdGhpcy5pZCA9IGlkO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBUcmFuc3BvcnRFcnJvcjtcbn0oRXJyb3IpKTtcbmV4cG9ydCB7IFRyYW5zcG9ydEVycm9yIH07XG5hZGRDdXN0b21FcnJvckRlc2VyaWFsaXplcihcIlRyYW5zcG9ydEVycm9yXCIsIGZ1bmN0aW9uIChlKSB7IHJldHVybiBuZXcgVHJhbnNwb3J0RXJyb3IoZS5tZXNzYWdlLCBlLmlkKTsgfSk7XG5leHBvcnQgdmFyIFN0YXR1c0NvZGVzID0ge1xuICAgIEFDQ0VTU19DT05ESVRJT05fTk9UX0ZVTEZJTExFRDogMHg5ODA0LFxuICAgIEFMR09SSVRITV9OT1RfU1VQUE9SVEVEOiAweDk0ODQsXG4gICAgQ0xBX05PVF9TVVBQT1JURUQ6IDB4NmUwMCxcbiAgICBDT0RFX0JMT0NLRUQ6IDB4OTg0MCxcbiAgICBDT0RFX05PVF9JTklUSUFMSVpFRDogMHg5ODAyLFxuICAgIENPTU1BTkRfSU5DT01QQVRJQkxFX0ZJTEVfU1RSVUNUVVJFOiAweDY5ODEsXG4gICAgQ09ORElUSU9OU19PRl9VU0VfTk9UX1NBVElTRklFRDogMHg2OTg1LFxuICAgIENPTlRSQURJQ1RJT05fSU5WQUxJREFUSU9OOiAweDk4MTAsXG4gICAgQ09OVFJBRElDVElPTl9TRUNSRVRfQ09ERV9TVEFUVVM6IDB4OTgwOCxcbiAgICBDVVNUT01fSU1BR0VfQk9PVExPQURFUjogMHg2NjJmLFxuICAgIENVU1RPTV9JTUFHRV9FTVBUWTogMHg2NjJlLFxuICAgIEZJTEVfQUxSRUFEWV9FWElTVFM6IDB4NmE4OSxcbiAgICBGSUxFX05PVF9GT1VORDogMHg5NDA0LFxuICAgIEdQX0FVVEhfRkFJTEVEOiAweDYzMDAsXG4gICAgSEFMVEVEOiAweDZmYWEsXG4gICAgSU5DT05TSVNURU5UX0ZJTEU6IDB4OTQwOCxcbiAgICBJTkNPUlJFQ1RfREFUQTogMHg2YTgwLFxuICAgIElOQ09SUkVDVF9MRU5HVEg6IDB4NjcwMCxcbiAgICBJTkNPUlJFQ1RfUDFfUDI6IDB4NmIwMCxcbiAgICBJTlNfTk9UX1NVUFBPUlRFRDogMHg2ZDAwLFxuICAgIERFVklDRV9OT1RfT05CT0FSREVEOiAweDZkMDcsXG4gICAgREVWSUNFX05PVF9PTkJPQVJERURfMjogMHg2NjExLFxuICAgIElOVkFMSURfS0NWOiAweDk0ODUsXG4gICAgSU5WQUxJRF9PRkZTRVQ6IDB4OTQwMixcbiAgICBMSUNFTlNJTkc6IDB4NmY0MixcbiAgICBMT0NLRURfREVWSUNFOiAweDU1MTUsXG4gICAgTUFYX1ZBTFVFX1JFQUNIRUQ6IDB4OTg1MCxcbiAgICBNRU1PUllfUFJPQkxFTTogMHg5MjQwLFxuICAgIE1JU1NJTkdfQ1JJVElDQUxfUEFSQU1FVEVSOiAweDY4MDAsXG4gICAgTk9fRUZfU0VMRUNURUQ6IDB4OTQwMCxcbiAgICBOT1RfRU5PVUdIX01FTU9SWV9TUEFDRTogMHg2YTg0LFxuICAgIE9LOiAweDkwMDAsXG4gICAgUElOX1JFTUFJTklOR19BVFRFTVBUUzogMHg2M2MwLFxuICAgIFJFRkVSRU5DRURfREFUQV9OT1RfRk9VTkQ6IDB4NmE4OCxcbiAgICBTRUNVUklUWV9TVEFUVVNfTk9UX1NBVElTRklFRDogMHg2OTgyLFxuICAgIFRFQ0hOSUNBTF9QUk9CTEVNOiAweDZmMDAsXG4gICAgVU5LTk9XTl9BUERVOiAweDZkMDIsXG4gICAgVVNFUl9SRUZVU0VEX09OX0RFVklDRTogMHg1NTAxLFxuICAgIE5PVF9FTk9VR0hfU1BBQ0U6IDB4NTEwMixcbn07XG5leHBvcnQgdmFyIGdldEFsdFN0YXR1c01lc3NhZ2UgPSBmdW5jdGlvbiAoY29kZSkge1xuICAgIHN3aXRjaCAoY29kZSkge1xuICAgICAgICAvLyBpbXByb3ZlIHRleHQgb2YgbW9zdCBjb21tb24gZXJyb3JzXG4gICAgICAgIGNhc2UgMHg2NzAwOlxuICAgICAgICAgICAgcmV0dXJuIFwiSW5jb3JyZWN0IGxlbmd0aFwiO1xuICAgICAgICBjYXNlIDB4NjgwMDpcbiAgICAgICAgICAgIHJldHVybiBcIk1pc3NpbmcgY3JpdGljYWwgcGFyYW1ldGVyXCI7XG4gICAgICAgIGNhc2UgMHg2OTgyOlxuICAgICAgICAgICAgcmV0dXJuIFwiU2VjdXJpdHkgbm90IHNhdGlzZmllZCAoZG9uZ2xlIGxvY2tlZCBvciBoYXZlIGludmFsaWQgYWNjZXNzIHJpZ2h0cylcIjtcbiAgICAgICAgY2FzZSAweDY5ODU6XG4gICAgICAgICAgICByZXR1cm4gXCJDb25kaXRpb24gb2YgdXNlIG5vdCBzYXRpc2ZpZWQgKGRlbmllZCBieSB0aGUgdXNlcj8pXCI7XG4gICAgICAgIGNhc2UgMHg2YTgwOlxuICAgICAgICAgICAgcmV0dXJuIFwiSW52YWxpZCBkYXRhIHJlY2VpdmVkXCI7XG4gICAgICAgIGNhc2UgMHg2YjAwOlxuICAgICAgICAgICAgcmV0dXJuIFwiSW52YWxpZCBwYXJhbWV0ZXIgcmVjZWl2ZWRcIjtcbiAgICAgICAgY2FzZSAweDU1MTU6XG4gICAgICAgICAgICByZXR1cm4gXCJMb2NrZWQgZGV2aWNlXCI7XG4gICAgfVxuICAgIGlmICgweDZmMDAgPD0gY29kZSAmJiBjb2RlIDw9IDB4NmZmZikge1xuICAgICAgICByZXR1cm4gXCJJbnRlcm5hbCBlcnJvciwgcGxlYXNlIHJlcG9ydFwiO1xuICAgIH1cbn07XG4vKipcbiAqIEVycm9yIHRocm93biB3aGVuIGEgZGV2aWNlIHJldHVybmVkIGEgbm9uIHN1Y2Nlc3Mgc3RhdHVzLlxuICogdGhlIGVycm9yLnN0YXR1c0NvZGUgaXMgb25lIG9mIHRoZSBgU3RhdHVzQ29kZXNgIGV4cG9ydGVkIGJ5IHRoaXMgbGlicmFyeS5cbiAqL1xudmFyIFRyYW5zcG9ydFN0YXR1c0Vycm9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUcmFuc3BvcnRTdGF0dXNFcnJvciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBUcmFuc3BvcnRTdGF0dXNFcnJvcihzdGF0dXNDb2RlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBzdGF0dXNUZXh0ID0gT2JqZWN0LmtleXMoU3RhdHVzQ29kZXMpLmZpbmQoZnVuY3Rpb24gKGspIHsgcmV0dXJuIFN0YXR1c0NvZGVzW2tdID09PSBzdGF0dXNDb2RlOyB9KSB8fCBcIlVOS05PV05fRVJST1JcIjtcbiAgICAgICAgdmFyIHNtc2cgPSBnZXRBbHRTdGF0dXNNZXNzYWdlKHN0YXR1c0NvZGUpIHx8IHN0YXR1c1RleHQ7XG4gICAgICAgIHZhciBzdGF0dXNDb2RlU3RyID0gc3RhdHVzQ29kZS50b1N0cmluZygxNik7XG4gICAgICAgIHZhciBtZXNzYWdlID0gXCJLUHJvIGRldmljZTogXCIuY29uY2F0KHNtc2csIFwiICgweFwiKS5jb25jYXQoc3RhdHVzQ29kZVN0ciwgXCIpXCIpO1xuICAgICAgICAvLyBNYXBzIHRvIGEgTG9ja2VkRGV2aWNlRXJyb3JcbiAgICAgICAgaWYgKHN0YXR1c0NvZGUgPT09IFN0YXR1c0NvZGVzLkxPQ0tFRF9ERVZJQ0UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBMb2NrZWREZXZpY2VFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG1lc3NhZ2UpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLm5hbWUgPSBcIlRyYW5zcG9ydFN0YXR1c0Vycm9yXCI7XG4gICAgICAgIF90aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICBfdGhpcy5zdGFjayA9IG5ldyBFcnJvcihtZXNzYWdlKS5zdGFjaztcbiAgICAgICAgX3RoaXMuc3RhdHVzQ29kZSA9IHN0YXR1c0NvZGU7XG4gICAgICAgIF90aGlzLnN0YXR1c1RleHQgPSBzdGF0dXNUZXh0O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBUcmFuc3BvcnRTdGF0dXNFcnJvcjtcbn0oRXJyb3IpKTtcbmV4cG9ydCB7IFRyYW5zcG9ydFN0YXR1c0Vycm9yIH07XG5hZGRDdXN0b21FcnJvckRlc2VyaWFsaXplcihcIlRyYW5zcG9ydFN0YXR1c0Vycm9yXCIsIGZ1bmN0aW9uIChlKSB7IHJldHVybiBuZXcgVHJhbnNwb3J0U3RhdHVzRXJyb3IoZS5zdGF0dXNDb2RlKTsgfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lcnJvcnMuanMubWFwIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4vbG9nc1wiO1xuaW1wb3J0IHsgZGVjb2RlVHhJbmZvLCBzcGxpdFBhdGggfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgRXRoQXBwUGxlYXNlRW5hYmxlQ29udHJhY3REYXRhIH0gZnJvbSBcIi4vZXJyb3JzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi91dGlsc1wiO1xudmFyIHJlbWFwVHJhbnNhY3Rpb25SZWxhdGVkRXJyb3JzID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZSAmJiBlLnN0YXR1c0NvZGUgPT09IDB4NmE4MCkge1xuICAgICAgICByZXR1cm4gbmV3IEV0aEFwcFBsZWFzZUVuYWJsZUNvbnRyYWN0RGF0YShcIlBsZWFzZSBlbmFibGUgQmxpbmQgc2lnbmluZyBvciBDb250cmFjdCBkYXRhIGluIHRoZSBFdGhlcmV1bSBhcHAgU2V0dGluZ3NcIik7XG4gICAgfVxuICAgIHJldHVybiBlO1xufTtcbi8qKlxuICogRXRoZXJldW0gQVBJXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCBLUHJvSlMgZnJvbSBcImtwcm9qc1wiO1xuICogY29uc3QgZXRoID0gbmV3IEtQcm9KUy5FdGgodHJhbnNwb3J0KVxuICovXG52YXIgRXRoID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV0aCh0cmFuc3BvcnQpIHtcbiAgICAgICAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGdldCBFdGhlcmV1bSBhZGRyZXNzIGZvciBhIGdpdmVuIEJJUCAzMiBwYXRoLlxuICAgICAqIEBwYXJhbSBwYXRoIGEgcGF0aCBpbiBCSVAgMzIgZm9ybWF0XG4gICAgICogQG9wdGlvbiBib29sRGlzcGxheSBvcHRpb25hbGx5IGVuYWJsZSBvciBub3QgdGhlIGRpc3BsYXlcbiAgICAgKiBAb3B0aW9uIGJvb2xDaGFpbmNvZGUgb3B0aW9uYWxseSBlbmFibGUgb3Igbm90IHRoZSBjaGFpbmNvZGUgcmVxdWVzdFxuICAgICAqIEByZXR1cm4gYW4gb2JqZWN0IHdpdGggYSBwdWJsaWNLZXksIGFkZHJlc3MgYW5kIChvcHRpb25hbGx5KSBjaGFpbkNvZGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IHJlc3AgPSBhd2FpdCBldGguZ2V0QWRkcmVzcyhcIjQ0Jy82MCcvMCcvMC8wXCIpO1xuICAgICAqIGNvbnNvbGUubG9nKHJlc3AuYWRkcmVzcyk7XG4gICAgICovXG4gICAgRXRoLnByb3RvdHlwZS5nZXRBZGRyZXNzID0gZnVuY3Rpb24gKHBhdGgsIGJvb2xEaXNwbGF5LCBib29sQ2hhaW5jb2RlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwYXRocywgYnVmZmVyLCByZXNwb25zZSwgcHVibGljS2V5TGVuZ3RoLCBhZGRyZXNzTGVuZ3RoLCBlcnJvcl8xO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aHMgPSBzcGxpdFBhdGgocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBCdWZmZXIuYWxsb2MoMSArIHBhdGhzLmxlbmd0aCAqIDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyWzBdID0gcGF0aHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVVSW50MzJCRShlbGVtZW50LCAxICsgNCAqIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzEsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy50cmFuc3BvcnQuc2VuZCgweGUwLCAweDAyLCBib29sRGlzcGxheSA/IDB4MDEgOiAweDAwLCBib29sQ2hhaW5jb2RlID8gMHgwMSA6IDB4MDAsIGJ1ZmZlcildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY0tleUxlbmd0aCA9IHJlc3BvbnNlWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzc0xlbmd0aCA9IHJlc3BvbnNlWzEgKyBwdWJsaWNLZXlMZW5ndGhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljS2V5OiByZXNwb25zZS5zdWJhcnJheSgxLCAxICsgcHVibGljS2V5TGVuZ3RoKS50b1N0cmluZyhcImhleFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogXCIweFwiICsgcmVzcG9uc2Uuc3ViYXJyYXkoMSArIHB1YmxpY0tleUxlbmd0aCArIDEsIDEgKyBwdWJsaWNLZXlMZW5ndGggKyAxICsgYWRkcmVzc0xlbmd0aCkudG9TdHJpbmcoXCJhc2NpaVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5Db2RlOiBib29sQ2hhaW5jb2RlID8gcmVzcG9uc2Uuc3ViYXJyYXkoMSArIHB1YmxpY0tleUxlbmd0aCArIDEgKyBhZGRyZXNzTGVuZ3RoLCAxICsgcHVibGljS2V5TGVuZ3RoICsgMSArIGFkZHJlc3NMZW5ndGggKyAzMikudG9TdHJpbmcoXCJoZXhcIikgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyhcImVycm9yXCIsIFwiQ291bGRuJ3QgZ2V0IGFkZHJlc3NcIiwgZXJyb3JfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcl8xO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBZb3UgY2FuIHNpZ24gYSB0cmFuc2FjdGlvbiBhbmQgcmV0cmlldmUgdiwgciwgcyBnaXZlbiB0aGUgcmF3IHRyYW5zYWN0aW9uIGFuZCB0aGUgQklQIDMyIHBhdGggb2YgdGhlIGFjY291bnQgdG8gc2lnbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXRoOiB0aGUgQklQMzIgcGF0aCB0byBzaWduIHRoZSB0cmFuc2FjdGlvbiBvblxuICAgICAqIEBwYXJhbSByYXdUeEhleDogdGhlIHJhdyBldGhlcmV1bSB0cmFuc2FjdGlvbiBpbiBoZXhhZGVjaW1hbCB0byBzaWduXG4gICAgICogQHBhcmFtIHJlc29sdXRpb246IHJlc29sdXRpb24gaXMgYW4gb2JqZWN0IHdpdGggYWxsIFwicmVzb2x2ZWRcIiBtZXRhZGF0YSBuZWNlc3NhcnkgdG8gYWxsb3cgdGhlIGRldmljZSB0byBjbGVhciBzaWduIGluZm9ybWF0aW9uLiBUaGlzIGluY2x1ZGVzOiBFUkMyMCB0b2tlbiBpbmZvcm1hdGlvbiwgcGx1Z2lucywgY29udHJhY3RzLCBORlQgc2lnbmF0dXJlcywuLi4gWW91IG11c3QgZXhwbGljaXRseSBwcm92aWRlIHNvbWV0aGluZyB0byBhdm9pZCBoYXZpbmcgYSB3YXJuaW5nLiBCeSBkZWZhdWx0LCB5b3UgY2FuIHVzZSBLUHJvJ3Mgc2VydmljZSBvciB5b3VyIG93biByZXNvbHV0aW9uIHNlcnZpY2UuIFNlZSBzZXJ2aWNlcy90eXBlcy5qcyBmb3IgdGhlIGNvbnRyYWN0LiBTZXR0aW5nIHRoZSB2YWx1ZSB0byBcIm51bGxcIiB3aWxsIGZhbGxiYWNrIGV2ZXJ5dGhpbmcgdG8gYmxpbmQgc2lnbmluZyBidXQgd2lsbCBzdGlsbCBhbGxvdyB0aGUgZGV2aWNlIHRvIHNpZ24gdGhlIHRyYW5zYWN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogaW1wb3J0IEtQcm9KUyBmcm9tIFwia3Byb2pzXCJcbiAgICAgKiBjb25zdCB0eCA9IFwiZTgwMTg1MDRlM2IyOTIwMDgyNTIwODk0MjhlZTUyYThmM2Q2ZTVkMTVmOGIxMzE5OTY5NTBkN2YyOTZjNzk1Mjg3MmJkNzJhMjQ4NzQwMDA4MFwiOyAvLyByYXcgdHggdG8gc2lnblxuICAgICAqIGNvbnN0IHJlc3AgPSBhd2FpdCBldGguc2lnblRyYW5zYWN0aW9uKFwiNDQnLzYwJy8wJy8wLzBcIiwgdHgpO1xuICAgICAqIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgICAqL1xuICAgIEV0aC5wcm90b3R5cGUuc2lnblRyYW5zYWN0aW9uID0gZnVuY3Rpb24gKHBhdGgsIHJhd1R4SGV4KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByYXdUeCwgX2EsIHZyc09mZnNldCwgdHhUeXBlLCBjaGFpbklkLCBjaGFpbklkVHJ1bmNhdGVkLCBwYXRocywgcmVzcG9uc2UsIG9mZnNldCwgX2xvb3BfMSwgdGhpc18xLCByZXNwb25zZV9ieXRlLCB2LCBvbmVCeXRlQ2hhaW5JZCwgZWNjX3Bhcml0eSwgciwgcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhd1R4ID0gQnVmZmVyLmZyb20ocmF3VHhIZXgsIFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSBkZWNvZGVUeEluZm8ocmF3VHgpLCB2cnNPZmZzZXQgPSBfYS52cnNPZmZzZXQsIHR4VHlwZSA9IF9hLnR4VHlwZSwgY2hhaW5JZCA9IF9hLmNoYWluSWQsIGNoYWluSWRUcnVuY2F0ZWQgPSBfYS5jaGFpbklkVHJ1bmNhdGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aHMgPSBzcGxpdFBhdGgocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2xvb3BfMSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlyc3QsIG1heENodW5rU2l6ZSwgY2h1bmtTaXplLCBidWZmZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3QgPSBvZmZzZXQgPT09IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4Q2h1bmtTaXplID0gZmlyc3QgPyAxNTAgLSAxIC0gcGF0aHMubGVuZ3RoICogNCA6IDE1MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHVua1NpemUgPSBvZmZzZXQgKyBtYXhDaHVua1NpemUgPiByYXdUeC5sZW5ndGggPyByYXdUeC5sZW5ndGggLSBvZmZzZXQgOiBtYXhDaHVua1NpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZyc09mZnNldCAhPSAwICYmIG9mZnNldCArIGNodW5rU2l6ZSA+PSB2cnNPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIGNodW5rIGRvZXNuJ3QgZW5kIHJpZ2h0IG9uIHRoZSBFSVAgMTU1IG1hcmtlciBpZiBzZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2h1bmtTaXplID0gcmF3VHgubGVuZ3RoIC0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBCdWZmZXIuYWxsb2MoZmlyc3QgPyAxICsgcGF0aHMubGVuZ3RoICogNCArIGNodW5rU2l6ZSA6IGNodW5rU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlclswXSA9IHBhdGhzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVVJbnQzMkJFKGVsZW1lbnQsIDEgKyA0ICogaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF3VHguY29weShidWZmZXIsIDEgKyA0ICogcGF0aHMubGVuZ3RoLCBvZmZzZXQsIG9mZnNldCArIGNodW5rU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXdUeC5jb3B5KGJ1ZmZlciwgMCwgb2Zmc2V0LCBvZmZzZXQgKyBjaHVua1NpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzXzEudHJhbnNwb3J0LnNlbmQoMHhlMCwgMHgwNCwgZmlyc3QgPyAweDAwIDogMHg4MCwgMHgwMCwgYnVmZmVyKS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgcmVtYXBUcmFuc2FjdGlvblJlbGF0ZWRFcnJvcnMoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgKz0gY2h1bmtTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfMSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKG9mZnNldCAhPT0gcmF3VHgubGVuZ3RoKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzUgLyp5aWVsZCoqLywgX2xvb3BfMSgpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgMV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlX2J5dGUgPSByZXNwb25zZVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoYWluSWQudGltZXMoMikucGx1cygzNSkucGx1cygxKS5pc0dyZWF0ZXJUaGFuKDI1NSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmVCeXRlQ2hhaW5JZCA9IChjaGFpbklkVHJ1bmNhdGVkICogMiArIDM1KSAlIDI1NjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlY2NfcGFyaXR5ID0gTWF0aC5hYnMocmVzcG9uc2VfYnl0ZSAtIG9uZUJ5dGVDaGFpbklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHhUeXBlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIEVJUDI5MzAgYW5kIEVJUDE1NTkgdHgsIHYgaXMgc2ltcGx5IHRoZSBwYXJpdHkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBlY2NfcGFyaXR5ICUgMiA9PSAxID8gXCIwMFwiIDogXCIwMVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGVnYWN5IHR5cGUgdHJhbnNhY3Rpb24gd2l0aCBhIGJpZyBjaGFpbiBJRFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gY2hhaW5JZC50aW1lcygyKS5wbHVzKDM1KS5wbHVzKGVjY19wYXJpdHkpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gcmVzcG9uc2VfYnl0ZS50b1N0cmluZygxNik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdiBpcyBwcmVmaXhlZCB3aXRoIGEgMCBpZiBpdHMgbGVuZ3RoIGlzIG9kZCAoXCIxXCIgLT4gXCIwMVwiKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2Lmxlbmd0aCAlIDIgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBcIjBcIiArIHY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByID0gcmVzcG9uc2Uuc2xpY2UoMSwgMSArIDMyKS50b1N0cmluZyhcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgPSByZXNwb25zZS5zbGljZSgxICsgMzIsIDEgKyAzMiArIDMyKS50b1N0cmluZyhcImhleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB7IHY6IHYsIHI6IHIsIHM6IHMgfV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICovXG4gICAgRXRoLnByb3RvdHlwZS5nZXRBcHBDb25maWd1cmF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UsIGZ3VmVyc2lvbiwgZXJjMjBWZXJzaW9uLCBlcnJvcl8yO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMudHJhbnNwb3J0LnNlbmQoMHhlMCwgMHgwNiwgMHgwMCwgMHgwMCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ3VmVyc2lvbiA9IFN0cmluZyhyZXNwb25zZVswXSkgKyBcIi5cIiArIFN0cmluZyhyZXNwb25zZVsxXSkgKyBcIi5cIiArIFN0cmluZyhyZXNwb25zZVsyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcmMyMFZlcnNpb24gPSAocmVzcG9uc2VbM10gPDwgMjQpIHwgKHJlc3BvbnNlWzRdIDw8IDE2KSB8IChyZXNwb25zZVs1XSA8PCA4KSB8IHJlc3BvbnNlWzZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHsgZndWZXJzaW9uOiBmd1ZlcnNpb24sIGVyYzIwVmVyc2lvbjogZXJjMjBWZXJzaW9uIH1dO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcl8yID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKFwiZXJyb3JcIiwgXCJDb3VsZG4ndCBnZXQgYXBwIGNvbmZpZ3VyYXRpb25cIiwgZXJyb3JfMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcl8yO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBFdGgucHJvdG90eXBlLnNlbmRDaHVua3MgPSBmdW5jdGlvbiAocGF0aCwgbSwgY2xhLCBpbnMsIHAyLCBlbmMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHBhdGhzLCBtZXNzYWdlLCBvZmZzZXQsIHJlc3BvbnNlLCBfbG9vcF8yLCB0aGlzXzIsIHYsIHIsIHM7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRocyA9IHNwbGl0UGF0aChwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBCdWZmZXIuZnJvbShtLCBlbmMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9sb29wXzIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1heENodW5rU2l6ZSwgY2h1bmtTaXplLCBidWZmZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4Q2h1bmtTaXplID0gb2Zmc2V0ID09PSAwID8gMjU1IC0gMSAtIHBhdGhzLmxlbmd0aCAqIDQgLSA0IDogMjU1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNodW5rU2l6ZSA9IG9mZnNldCArIG1heENodW5rU2l6ZSA+IG1lc3NhZ2UubGVuZ3RoID8gbWVzc2FnZS5sZW5ndGggLSBvZmZzZXQgOiBtYXhDaHVua1NpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gQnVmZmVyLmFsbG9jKG9mZnNldCA9PT0gMCA/IDEgKyBwYXRocy5sZW5ndGggKiA0ICsgNCArIGNodW5rU2l6ZSA6IGNodW5rU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXJbMF0gPSBwYXRocy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVVSW50MzJCRShlbGVtZW50LCAxICsgNCAqIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlci53cml0ZVVJbnQzMkJFKG1lc3NhZ2UubGVuZ3RoLCAxICsgNCAqIHBhdGhzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UuY29weShidWZmZXIsIDEgKyA0ICogcGF0aHMubGVuZ3RoICsgNCwgb2Zmc2V0LCBvZmZzZXQgKyBjaHVua1NpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5jb3B5KGJ1ZmZlciwgMCwgb2Zmc2V0LCBvZmZzZXQgKyBjaHVua1NpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzXzIudHJhbnNwb3J0LnNlbmQoY2xhLCBpbnMsIG9mZnNldCA9PT0gMCA/IDB4MDAgOiAweDgwLCBwMiwgYnVmZmVyKV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ICs9IGNodW5rU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzXzIgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShvZmZzZXQgIT09IG1lc3NhZ2UubGVuZ3RoKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzUgLyp5aWVsZCoqLywgX2xvb3BfMigpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgMV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSByZXNwb25zZVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSByZXNwb25zZS5zdWJhcnJheSgxLCAxICsgMzIpLnRvU3RyaW5nKFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcyA9IHJlc3BvbnNlLnN1YmFycmF5KDEgKyAzMiwgMSArIDMyICsgMzIpLnRvU3RyaW5nKFwiaGV4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHsgdjogdiwgcjogciwgczogcyB9XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIFlvdSBjYW4gc2lnbiBhIG1lc3NhZ2UgYWNjb3JkaW5nIHRvIGV0aF9zaWduIFJQQyBjYWxsIGFuZCByZXRyaWV2ZSB2LCByLCBzIGdpdmVuIHRoZSBtZXNzYWdlIGFuZCB0aGUgQklQIDMyIHBhdGggb2YgdGhlIGFjY291bnQgdG8gc2lnbi5cbiAgICAqIEBleGFtcGxlXG4gICAgKiBjb25zdCByZXNwID0gYXdhaXQgZXRoLnNpZ25QZXJzb25hbE1lc3NhZ2UoXCI0NCcvNjAnLzAnLzAvMFwiLCBCdWZmZXIuZnJvbShcInRlc3RcIikudG9TdHJpbmcoXCJoZXhcIik7XG4gICAgKiBsZXQgdiA9IHJlc3BbJ3YnXSAtIDI3O1xuICAgICogdiA9IHYudG9TdHJpbmcoMTYpO1xuICAgICogaWYgKHYubGVuZ3RoIDwgMikge1xuICAgICogICB2ID0gXCIwXCIgKyB2O1xuICAgICogfVxuICAgICogY29uc29sZS5sb2coXCJTaWduYXR1cmUgMHhcIiArIHJlc3BbJ3InXSArIHJlc3BbJ3MnXSArIHYpO1xuICAgICAqL1xuICAgIEV0aC5wcm90b3R5cGUuc2lnblBlcnNvbmFsTWVzc2FnZSA9IGZ1bmN0aW9uIChwYXRoLCBwTWVzc2FnZSwgZW5jKSB7XG4gICAgICAgIGlmIChlbmMgPT09IHZvaWQgMCkgeyBlbmMgPSBcInV0Zi04XCI7IH1cbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCB0aGlzLnNlbmRDaHVua3MocGF0aCwgcE1lc3NhZ2UsIDB4ZTAsIDB4MDgsIDB4MDAsIGVuYyldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2lnbiBhbiBFSVAtNzIxIGZvcm1hdHRlZCBtZXNzYWdlIGZvbGxvd2luZyB0aGUgc3BlY2lmaWNhdGlvbiBoZXJlOlxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9LUHJvSFEvYXBwLWV0aGVyZXVtL2Jsb2IvZGV2ZWxvcC9kb2MvZXRoYXBwLmFzYyNzaWduLWV0aC1laXAtNzEyXG4gICAgICog4pqg77iPIFRoaXMgbWV0aG9kIGlzIG5vdCBjb21wYXRpYmxlIHdpdGggbmFubyBTIChMTlMpLiBNYWtlIHN1cmUgdG8gdXNlIGEgdHJ5L2NhdGNoIHRvIGZhbGxiYWNrIG9uIHRoZSBzaWduRUlQNzEySGFzaGVkTWVzc2FnZSBtZXRob2Qg4pqg77iPXG4gICAgIEBleGFtcGxlXG4gICAgICogY29uc3QgcmVzcCA9IGF3YWl0IGV0aC5zaWduRUlQNzIxTWVzc2FnZShcIjQ0Jy82MCcvMCcvMC8wXCIsIHtcbiAgICAgKiAgIGRvbWFpbjoge1xuICAgICAqICAgICBjaGFpbklkOiA2OSxcbiAgICAgKiAgICAgbmFtZTogXCJEYSBEb21haW5cIixcbiAgICAgKiAgICAgdmVyaWZ5aW5nQ29udHJhY3Q6IFwiMHhDY0NDY2NjY0NDQ0NjQ0NDQ0NDY0NjQ2NjQ2NDQ0NjQ2NjY2NjY2NDXCIsXG4gICAgICogICAgIHZlcnNpb246IFwiMVwiXG4gICAgICogICB9LFxuICAgICAqICAgdHlwZXM6IHtcbiAgICAgKiAgICAgXCJFSVA3MTJEb21haW5cIjogW1xuICAgICAqICAgICAgICAgICB7IG5hbWU6IFwibmFtZVwiLCB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICogICAgICAgICAgIHsgbmFtZTogXCJ2ZXJzaW9uXCIsIHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAgKiAgICAgICAgICAgeyBuYW1lOiBcImNoYWluSWRcIiwgdHlwZTogXCJ1aW50MjU2XCIgfSxcbiAgICAgKiAgICAgICAgICAgeyBuYW1lOiBcInZlcmlmeWluZ0NvbnRyYWN0XCIsIHR5cGU6IFwiYWRkcmVzc1wiIH1cbiAgICAgKiAgICAgICBdLFxuICAgICAqICAgICBcIlRlc3RcIjogW1xuICAgICAqICAgICAgIHsgbmFtZTogXCJjb250ZW50c1wiLCB0eXBlOiBcInN0cmluZ1wiIH1cbiAgICAgKiAgICAgXVxuICAgICAqICAgfSxcbiAgICAgKiAgIHByaW1hcnlUeXBlOiBcIlRlc3RcIixcbiAgICAgKiAgIG1lc3NhZ2U6IHtjb250ZW50czogXCJIZWxsbywgQm9iIVwifSxcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIGRlcml2YXRpb25QYXRoXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGpzb25NZXNzYWdlIG1lc3NhZ2UgdG8gc2lnblxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZnVsbEltcGxlbSB1c2UgdGhlIGxlZ2FjeSBpbXBsZW1lbnRhdGlvblxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuICAgIEV0aC5wcm90b3R5cGUuc2lnbkVJUDcxMk1lc3NhZ2UgPSBmdW5jdGlvbiAocGF0aCwganNvbk1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2VTdHIsIEFQRFVfRklFTERTO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VTdHIgPSBKU09OLnN0cmluZ2lmeShqc29uTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uIChBUERVX0ZJRUxEUykge1xuICAgICAgICAgICAgICAgICAgICBBUERVX0ZJRUxEU1tBUERVX0ZJRUxEU1tcIkNMQVwiXSA9IDIyNF0gPSBcIkNMQVwiO1xuICAgICAgICAgICAgICAgICAgICBBUERVX0ZJRUxEU1tBUERVX0ZJRUxEU1tcIklOU1wiXSA9IDEyXSA9IFwiSU5TXCI7XG4gICAgICAgICAgICAgICAgICAgIEFQRFVfRklFTERTW0FQRFVfRklFTERTW1wiUDFcIl0gPSAwXSA9IFwiUDFcIjtcbiAgICAgICAgICAgICAgICAgICAgQVBEVV9GSUVMRFNbQVBEVV9GSUVMRFNbXCJQMlwiXSA9IDFdID0gXCJQMlwiO1xuICAgICAgICAgICAgICAgIH0pKEFQRFVfRklFTERTIHx8IChBUERVX0ZJRUxEUyA9IHt9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHRoaXMuc2VuZENodW5rcyhwYXRoLCBtZXNzYWdlU3RyLCBBUERVX0ZJRUxEUy5DTEEsIEFQRFVfRklFTERTLklOUywgQVBEVV9GSUVMRFMuUDIsIFwidXRmLThcIildO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgRXRoLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKGRhdGEsIGlucykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0LCByZXNwb25zZSwgQVBEVV9GSUVMRFMsIG1heENodW5rU2l6ZSwgY2h1bmtTaXplLCBidWZmZXI7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uIChBUERVX0ZJRUxEUykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFQRFVfRklFTERTW0FQRFVfRklFTERTW1wiQ0xBXCJdID0gMjI0XSA9IFwiQ0xBXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQVBEVV9GSUVMRFNbQVBEVV9GSUVMRFNbXCJJTlNcIl0gPSBpbnNdID0gXCJJTlNcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBUERVX0ZJRUxEU1tBUERVX0ZJRUxEU1tcIlAyXCJdID0gMF0gPSBcIlAyXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KShBUERVX0ZJRUxEUyB8fCAoQVBEVV9GSUVMRFMgPSB7fSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShvZmZzZXQgIT09IGRhdGEubGVuZ3RoKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhDaHVua1NpemUgPSBvZmZzZXQgPT09IDAgPyAyNDQgLSA0IDogMjQwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2h1bmtTaXplID0gb2Zmc2V0ICsgbWF4Q2h1bmtTaXplID4gZGF0YS5sZW5ndGggPyBkYXRhLmxlbmd0aCAtIG9mZnNldCA6IG1heENodW5rU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyhvZmZzZXQgPT09IDAgPyA0ICsgY2h1bmtTaXplIDogY2h1bmtTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIud3JpdGVVSW50MzJCRShkYXRhLmxlbmd0aCwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jb3B5KGJ1ZmZlciwgNCwgb2Zmc2V0LCBvZmZzZXQgKyBjaHVua1NpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jb3B5KGJ1ZmZlciwgMCwgb2Zmc2V0LCBvZmZzZXQgKyBjaHVua1NpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy50cmFuc3BvcnQuc2VuZChBUERVX0ZJRUxEUy5DTEEsIEFQRFVfRklFTERTLklOUywgb2Zmc2V0ID09PSAwID8gMHgwMCA6IDB4ODAsIEFQRFVfRklFTERTLlAyLCBidWZmZXIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5lbWl0KFwiY2h1bmstbG9hZGVkXCIsIGNodW5rU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgKz0gY2h1bmtTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgMV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi8sIChyZXNwb25zZVswXSA8PCA4KSB8IHJlc3BvbnNlWzFdXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIFlvdSBjYW4gbG9hZCBhIGZpcm13YXJlXG4gICAgKiBAZXhhbXBsZVxuICAgICpcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBmdyBmaXJtd2FyZVxuICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgKi9cbiAgICBFdGgucHJvdG90eXBlLmxvYWRGaXJtd2FyZSA9IGZ1bmN0aW9uIChmdykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMubG9hZChCdWZmZXIuZnJvbShmdyksIDB4ZjIpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIgLypyZXR1cm4qLywgX2Euc2VudCgpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIFlvdSBjYW4gbG9hZCBhIEVSQzIwIGFuZCBDaGFpbiBEQlxuICAgICogQGV4YW1wbGVcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gZGIgZGF0YWJhc2VcbiAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICovXG4gICAgRXRoLnByb3RvdHlwZS5sb2FkRVJDMjBEQiA9IGZ1bmN0aW9uIChkYikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sIHRoaXMubG9hZChCdWZmZXIuZnJvbShkYiksIDB4ZjQpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIgLypyZXR1cm4qLywgX2Euc2VudCgpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gRXRoO1xufSgpKTtcbmV4cG9ydCBkZWZhdWx0IEV0aDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV0aC5qcy5tYXAiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqICAgTGVkZ2VyIE5vZGUgSlMgQVBJXG4gKiAgIChjKSAyMDE2LTIwMTcgTGVkZ2VyXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuaW1wb3J0IHsgVHJhbnNwb3J0RXJyb3IgfSBmcm9tIFwiLi9lcnJvcnNcIjtcbnZhciBUYWcgPSAweDA1O1xuZXhwb3J0IHZhciBrcHJvVVNCVmVuZG9ySWQgPSAweDEyMDk7XG52YXIgYXNVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBiID0gQnVmZmVyLmFsbG9jKDIpO1xuICAgIGIud3JpdGVVSW50MTZCRSh2YWx1ZSwgMCk7XG4gICAgcmV0dXJuIGI7XG59O1xudmFyIGluaXRpYWxBY2MgPSB7XG4gICAgZGF0YTogQnVmZmVyLmFsbG9jKDApLFxuICAgIGRhdGFMZW5ndGg6IDAsXG4gICAgc2VxdWVuY2U6IDBcbn07XG4vKipcbiAqXG4gKi9cbmV4cG9ydCB2YXIgaGlkRnJhbWluZyA9IGZ1bmN0aW9uIChjaGFubmVsLCBwYWNrZXRTaXplKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWFrZUJsb2NrczogZnVuY3Rpb24gKGFwZHUpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gQnVmZmVyLmNvbmNhdChbYXNVSW50MTZCRShhcGR1Lmxlbmd0aCksIGFwZHVdKTtcbiAgICAgICAgICAgIHZhciBibG9ja1NpemUgPSBwYWNrZXRTaXplIC0gNTtcbiAgICAgICAgICAgIHZhciBuYkJsb2NrcyA9IE1hdGguY2VpbChkYXRhLmxlbmd0aCAvIGJsb2NrU2l6ZSk7XG4gICAgICAgICAgICBkYXRhID0gQnVmZmVyLmNvbmNhdChbXG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICBCdWZmZXIuYWxsb2MobmJCbG9ja3MgKiBibG9ja1NpemUgLSBkYXRhLmxlbmd0aCArIDEpLmZpbGwoMCksXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHZhciBibG9ja3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmJCbG9ja3M7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBoZWFkID0gQnVmZmVyLmFsbG9jKDUpO1xuICAgICAgICAgICAgICAgIGhlYWQud3JpdGVVSW50MTZCRShjaGFubmVsLCAwKTtcbiAgICAgICAgICAgICAgICBoZWFkLndyaXRlVUludDgoVGFnLCAyKTtcbiAgICAgICAgICAgICAgICBoZWFkLndyaXRlVUludDE2QkUoaSwgMyk7XG4gICAgICAgICAgICAgICAgdmFyIGNodW5rID0gZGF0YS5zdWJhcnJheShpICogYmxvY2tTaXplLCAoaSArIDEpICogYmxvY2tTaXplKTtcbiAgICAgICAgICAgICAgICBibG9ja3MucHVzaChCdWZmZXIuY29uY2F0KFtoZWFkLCBjaHVua10pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBibG9ja3M7XG4gICAgICAgIH0sXG4gICAgICAgIHJlZHVjZVJlc3BvbnNlOiBmdW5jdGlvbiAoYWNjLCBjaHVuaykge1xuICAgICAgICAgICAgdmFyIF9hID0gYWNjIHx8IGluaXRpYWxBY2MsIGRhdGEgPSBfYS5kYXRhLCBkYXRhTGVuZ3RoID0gX2EuZGF0YUxlbmd0aCwgc2VxdWVuY2UgPSBfYS5zZXF1ZW5jZTtcbiAgICAgICAgICAgIGlmIChjaHVuay5yZWFkVUludDE2QkUoMCkgIT09IGNoYW5uZWwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHJhbnNwb3J0RXJyb3IoXCJJbnZhbGlkIGNoYW5uZWxcIiwgXCJJbnZhbGlkQ2hhbm5lbFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaHVuay5yZWFkVUludDgoMikgIT09IFRhZykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUcmFuc3BvcnRFcnJvcihcIkludmFsaWQgdGFnXCIsIFwiSW52YWxpZFRhZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaHVuay5yZWFkVUludDE2QkUoMykgIT09IHNlcXVlbmNlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRyYW5zcG9ydEVycm9yKFwiSW52YWxpZCBzZXF1ZW5jZVwiLCBcIkludmFsaWRTZXF1ZW5jZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYWNjKSB7XG4gICAgICAgICAgICAgICAgZGF0YUxlbmd0aCA9IGNodW5rLnJlYWRVSW50MTZCRSg1KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlcXVlbmNlKys7XG4gICAgICAgICAgICB2YXIgY2h1bmtEYXRhID0gY2h1bmsuc3ViYXJyYXkoYWNjID8gNSA6IDcpO1xuICAgICAgICAgICAgZGF0YSA9IEJ1ZmZlci5jb25jYXQoW2RhdGEsIGNodW5rRGF0YV0pO1xuICAgICAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gZGF0YUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YmFycmF5KDAsIGRhdGFMZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGRhdGFMZW5ndGg6IGRhdGFMZW5ndGgsXG4gICAgICAgICAgICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBnZXRSZWR1Y2VkUmVzdWx0OiBmdW5jdGlvbiAoYWNjKSB7XG4gICAgICAgICAgICBpZiAoYWNjICYmIGFjYy5kYXRhTGVuZ3RoID09PSBhY2MuZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oaWQtZnJhbWluZy5qcy5tYXAiLCJpbXBvcnQgRXRoIGZyb20gXCIuL2V0aFwiO1xuaW1wb3J0IFRyYW5zcG9ydCBmcm9tIFwiLi90cmFuc3BvcnRcIjtcbmltcG9ydCB7IEtQcm9EZXZpY2UgfSBmcm9tIFwiLi9kZXZpY2VcIjtcbmltcG9ydCAqIGFzIEtQcm9FcnJvciBmcm9tIFwiLi9lcnJvcnNcIjtcbmltcG9ydCAqIGFzIEtQcm9FcnJvckhlbHBlcnMgZnJvbSBcIi4vZXJyb3ItaGVscGVyc1wiO1xuaW1wb3J0ICogYXMgSElERnJhbWluZyBmcm9tIFwiLi9oaWQtZnJhbWluZ1wiO1xuaW1wb3J0ICogYXMgS1Byb0xvZ3MgZnJvbSBcIi4vbG9nc1wiO1xuaW1wb3J0ICogYXMgS1Byb1Byb21pc2UgZnJvbSBcIi4vcHJvbWlzZVwiO1xuZXhwb3J0IHZhciBLUHJvSlMgPSB7XG4gICAgRXRoOiBFdGgsXG4gICAgS1Byb0RldmljZTogS1Byb0RldmljZSxcbiAgICBLUHJvRXJyb3I6IEtQcm9FcnJvcixcbiAgICBLUHJvRXJyb3JIZWxwZXJzOiBLUHJvRXJyb3JIZWxwZXJzLFxuICAgIEhJREZyYW1pbmc6IEhJREZyYW1pbmcsXG4gICAgS1Byb0xvZ3M6IEtQcm9Mb2dzLFxuICAgIEtQcm9Qcm9taXNlOiBLUHJvUHJvbWlzZSxcbiAgICBUcmFuc3BvcnQ6IFRyYW5zcG9ydCxcbn07XG5leHBvcnQgZGVmYXVsdCBLUHJvSlM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqICAgTGVkZ2VyIE5vZGUgSlMgQVBJXG4gKiAgIChjKSAyMDE2LTIwMTcgTGVkZ2VyXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xudmFyIGlkID0gMDtcbnZhciBzdWJzY3JpYmVycyA9IFtdO1xuLyoqXG4gKiBsb2cgc29tZXRoaW5nXG4gKiBAcGFyYW0gdHlwZSBhIG5hbWVzcGFjZWQgaWRlbnRpZmllciBvZiB0aGUgbG9nIChpdCBpcyBub3QgYSBsZXZlbCBsaWtlIFwiZGVidWdcIiwgXCJlcnJvclwiIGJ1dCBtb3JlIGxpa2UgXCJhcGR1LWluXCIsIFwiYXBkdS1vdXRcIiwgZXRjLi4uKVxuICogQHBhcmFtIG1lc3NhZ2UgYSBjbGVhciBtZXNzYWdlIG9mIHRoZSBsb2cgYXNzb2NpYXRlZCB0byB0aGUgdHlwZVxuICovXG5leHBvcnQgdmFyIGxvZyA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlLCBkYXRhKSB7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgaWQ6IFN0cmluZygrK2lkKSxcbiAgICAgICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICB9O1xuICAgIGlmIChtZXNzYWdlKVxuICAgICAgICBvYmoubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgaWYgKGRhdGEpXG4gICAgICAgIG9iai5kYXRhID0gZGF0YTtcbiAgICBkaXNwYXRjaChvYmopO1xufTtcbi8qKlxuICogbGlzdGVuIHRvIGxvZ3MuXG4gKiBAcGFyYW0gY2IgdGhhdCBpcyBjYWxsZWQgZm9yIGVhY2ggZnV0dXJlIGxvZygpIHdpdGggdGhlIExvZyBvYmplY3RcbiAqIEByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSBjYWxsZWQgdG8gdW5zdWJzY3JpYmUgdGhlIGxpc3RlbmVyXG4gKi9cbmV4cG9ydCB2YXIgbGlzdGVuID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgc3Vic2NyaWJlcnMucHVzaChjYik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGkgPSBzdWJzY3JpYmVycy5pbmRleE9mKGNiKTtcbiAgICAgICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICAgICAgICAvLyBlcXVpdmFsZW50IG9mIHN1YnNjcmliZXJzLnNwbGljZShpLCAxKSAvLyBodHRwczovL3R3aXR0ZXIuY29tL1JpY2hfSGFycmlzL3N0YXR1cy8xMTI1ODUwMzkxMTU1OTY1OTUyXG4gICAgICAgICAgICBzdWJzY3JpYmVyc1tpXSA9IHN1YnNjcmliZXJzW3N1YnNjcmliZXJzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgc3Vic2NyaWJlcnMucG9wKCk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbnZhciBkaXNwYXRjaCA9IGZ1bmN0aW9uIChsb2cpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyc1tpXShsb2cpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxufTtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93Ll9fa3Byb0xvZ3NMaXN0ZW4gPSBsaXN0ZW47XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sb2dzLmpzLm1hcCIsInZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG52YXIgX19yZWFkID0gKHRoaXMgJiYgdGhpcy5fX3JlYWQpIHx8IGZ1bmN0aW9uIChvLCBuKSB7XG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICAgIGlmICghbSkgcmV0dXJuIG87XG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XG4gICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XG4gICAgfVxuICAgIHJldHVybiBhcjtcbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqICAgTGVkZ2VyIE5vZGUgSlMgQVBJXG4gKiAgIChjKSAyMDE2LTIwMTcgTGVkZ2VyXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4vbG9nc1wiO1xuZXhwb3J0IHZhciBkZWxheSA9IGZ1bmN0aW9uIChtcykgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHNldFRpbWVvdXQoZiwgbXMpOyB9KTsgfTtcbnZhciBkZWZhdWx0cyA9IHtcbiAgICBtYXhSZXRyeTogNCxcbiAgICBpbnRlcnZhbDogMzAwLFxuICAgIGludGVydmFsTXVsdGlwbGljYXRvcjogMS41LFxuICAgIGNvbnRleHQ6IFwiXCIsXG59O1xuZXhwb3J0IHZhciByZXRyeSA9IGZ1bmN0aW9uIChmLCBvcHRpb25zKSB7XG4gICAgdmFyIF9hID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGRlZmF1bHRzKSwgb3B0aW9ucyksIG1heFJldHJ5ID0gX2EubWF4UmV0cnksIGludGVydmFsID0gX2EuaW50ZXJ2YWwsIGludGVydmFsTXVsdGlwbGljYXRvciA9IF9hLmludGVydmFsTXVsdGlwbGljYXRvciwgY29udGV4dCA9IF9hLmNvbnRleHQ7XG4gICAgdmFyIHJlYyA9IGZ1bmN0aW9uIChyZW1haW5pbmdUcnksIGkpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGYoKTtcbiAgICAgICAgaWYgKHJlbWFpbmluZ1RyeSA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIC8vIEluIGNhc2Ugb2YgZmFpbHVyZSwgd2FpdCB0aGUgaW50ZXJ2YWwsIHJldHJ5IHRoZSBhY3Rpb25cbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbG9nKFwicHJvbWlzZS1yZXRyeVwiLCBjb250ZXh0ICsgXCIgZmFpbGVkLiBcIiArIHJlbWFpbmluZ1RyeSArIFwiIHJldHJ5IHJlbWFpbi4gXCIgKyBTdHJpbmcoZSkpO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGF5KGkpLnRoZW4oZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVjKHJlbWFpbmluZ1RyeSAtIDEsIGkgKiBpbnRlcnZhbE11bHRpcGxpY2F0b3IpOyB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVjKG1heFJldHJ5LCBpbnRlcnZhbCk7XG59O1xuZXhwb3J0IHZhciBhdG9taWNRdWV1ZSA9IGZ1bmN0aW9uIChqb2IsIHF1ZXVlSWRlbnRpZmllcikge1xuICAgIGlmIChxdWV1ZUlkZW50aWZpZXIgPT09IHZvaWQgMCkgeyBxdWV1ZUlkZW50aWZpZXIgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBcIlwiOyB9OyB9XG4gICAgdmFyIHF1ZXVlcyA9IHt9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlkID0gcXVldWVJZGVudGlmaWVyLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFyZ3MpLCBmYWxzZSkpO1xuICAgICAgICB2YXIgcXVldWUgPSBxdWV1ZXNbaWRdIHx8IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB2YXIgcCA9IHF1ZXVlLnRoZW4oZnVuY3Rpb24gKCkgeyByZXR1cm4gam9iLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFyZ3MpLCBmYWxzZSkpOyB9KTtcbiAgICAgICAgcXVldWVzW2lkXSA9IHAuY2F0Y2goZnVuY3Rpb24gKCkgeyB9KTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfTtcbn07XG5leHBvcnQgdmFyIGV4ZWNBbmRXYWl0QXRMZWFzdCA9IGZ1bmN0aW9uIChtcywgY2IpIHtcbiAgICB2YXIgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICByZXR1cm4gY2IoKS50aGVuKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHZhciByZW1haW5pbmcgPSBtcyAtIChEYXRlLm5vdygpIC0gc3RhcnRUaW1lKTtcbiAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIHJldHVybiBkZWxheShyZW1haW5pbmcpLnRoZW4oZnVuY3Rpb24gKCkgeyByZXR1cm4gcjsgfSk7XG4gICAgfSk7XG59O1xuLyoqXG4gKiBwcm9taXNlQWxsQmF0Y2hlZChuLCBpdGVtcywgaSA9PiBmKGkpKVxuICogaXMgZXNzZW50aWFsbHkgbGlrZVxuICogUHJvbWlzZS5hbGwoaXRlbXMubWFwKGkgPT4gZihpKSkpXG4gKiBidXQgd2l0aCBhIGd1YXJhbnRlZSB0aGF0IGl0IHdpbGwgbm90IGNyZWF0ZSBtb3JlIHRoYW4gbiBjb25jdXJyZW50IGNhbGwgdG8gZlxuICogd2hlcmUgZiBpcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb21pc2VBbGxCYXRjaGVkKGJhdGNoLCBpdGVtcywgZm4pIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0LCBpdGVtLCBpbmRleCwgX2EsIF9iO1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdCA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaXJzdCkgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGZpcnN0Lml0ZW0sIGluZGV4ID0gZmlyc3QuaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2EgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9iID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZm4oaXRlbSwgaW5kZXgpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYVtfYl0gPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2MubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzQgLyp5aWVsZCovLCBzdGVwKCldO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jLnNlbnQoKTsgLy8gZWFjaCB0aW1lIGFuIGl0ZW0gcmVkZWVtLCB3ZSBzY2hlZHVsZSBhbm90aGVyIG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRhdGEsIHF1ZXVlO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gQXJyYXkoaXRlbXMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgcXVldWUgPSBpdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7IHJldHVybiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgfSk7IH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBpbml0aWFsbHksIHdlIHNjaGVkdWxlIDxiYXRjaD4gaXRlbXMgaW4gcGFyYWxsZWxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgUHJvbWlzZS5hbGwoQXJyYXkoTWF0aC5taW4oYmF0Y2gsIGl0ZW1zLmxlbmd0aCkpLmZpbGwoZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9KS5tYXAoc3RlcCkpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIC8vIGluaXRpYWxseSwgd2Ugc2NoZWR1bGUgPGJhdGNoPiBpdGVtcyBpbiBwYXJhbGxlbFxuICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBkYXRhXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcm9taXNlLmpzLm1hcCIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfX3ZhbHVlcyA9ICh0aGlzICYmIHRoaXMuX192YWx1ZXMpIHx8IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufTtcbnZhciBfX3JlYWQgPSAodGhpcyAmJiB0aGlzLl9fcmVhZCkgfHwgZnVuY3Rpb24gKG8sIG4pIHtcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XG4gICAgaWYgKCFtKSByZXR1cm4gbztcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcbiAgICB0cnkge1xuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cbiAgICB9XG4gICAgcmV0dXJuIGFyO1xufTtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogICBMZWRnZXIgTm9kZSBKUyBBUElcbiAqICAgKGMpIDIwMTYtMjAxNyBMZWRnZXJcbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gXCJldmVudHNcIjtcbmltcG9ydCB7IFRyYW5zcG9ydFJhY2VDb25kaXRpb24sIFRyYW5zcG9ydEVycm9yLCBTdGF0dXNDb2RlcywgZ2V0QWx0U3RhdHVzTWVzc2FnZSwgVHJhbnNwb3J0U3RhdHVzRXJyb3IgfSBmcm9tIFwiLi9lcnJvcnNcIjtcbmV4cG9ydCB7IFRyYW5zcG9ydEVycm9yLCBUcmFuc3BvcnRTdGF0dXNFcnJvciwgU3RhdHVzQ29kZXMsIGdldEFsdFN0YXR1c01lc3NhZ2UgfTtcbi8qKlxuICogVGhlIFRyYW5zcG9ydCBjbGFzcyBkZWZpbmVzIGEgZ2VuZXJpYyBpbnRlcmZhY2UgZm9yIGNvbW11bmljYXRpbmcgd2l0aCBhIEtQcm8gaGFyZHdhcmUgd2FsbGV0LlxuICogVGhlcmUgYXJlIGRpZmZlcmVudCBraW5kIG9mIHRyYW5zcG9ydHMgYmFzZWQgb24gdGhlIHRlY2hub2xvZ3kgKGNoYW5uZWxzIGxpa2UgVTJGLCBISUQsIEJsdWV0b290aCwgV2VidXNiKSBhbmQgZW52aXJvbm1lbnQgKE5vZGUsIFdlYiwuLi4pLlxuICogSXQgaXMgYW4gYWJzdHJhY3QgY2xhc3MgdGhhdCBuZWVkcyB0byBiZSBpbXBsZW1lbnRlZC5cbiAqL1xudmFyIFRyYW5zcG9ydCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUcmFuc3BvcnQoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZXhjaGFuZ2VUaW1lb3V0ID0gMzAwMDA7XG4gICAgICAgIHRoaXMudW5yZXNwb25zaXZlVGltZW91dCA9IDE1MDAwO1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZW5kIGRhdGEgdG8gdGhlIGRldmljZSB1c2luZyB0aGUgaGlnaGVyIGxldmVsIEFQSS5cbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGNsYSAtIFRoZSBpbnN0cnVjdGlvbiBjbGFzcyBmb3IgdGhlIGNvbW1hbmQuXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbnMgLSBUaGUgaW5zdHJ1Y3Rpb24gY29kZSBmb3IgdGhlIGNvbW1hbmQuXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwMSAtIFRoZSBmaXJzdCBwYXJhbWV0ZXIgZm9yIHRoZSBpbnN0cnVjdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHAyIC0gVGhlIHNlY29uZCBwYXJhbWV0ZXIgZm9yIHRoZSBpbnN0cnVjdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtCdWZmZXJ9IGRhdGEgLSBUaGUgZGF0YSB0byBiZSBzZW50LiBEZWZhdWx0cyB0byBhbiBlbXB0eSBidWZmZXIuXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXk8bnVtYmVyPn0gc3RhdHVzTGlzdCAtIEEgbGlzdCBvZiBhY2NlcHRhYmxlIHN0YXR1cyBjb2RlcyBmb3IgdGhlIHJlc3BvbnNlLiBEZWZhdWx0cyB0byBbU3RhdHVzQ29kZXMuT0tdLlxuICAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxCdWZmZXI+fSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZXNwb25zZSBkYXRhIGZyb20gdGhlIGRldmljZS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2VuZCA9IGZ1bmN0aW9uIChjbGEsIGlucywgcDEsIHAyLCBkYXRhLCBzdGF0dXNMaXN0KSB7XG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gdm9pZCAwKSB7IGRhdGEgPSBCdWZmZXIuYWxsb2MoMCk7IH1cbiAgICAgICAgICAgIGlmIChzdGF0dXNMaXN0ID09PSB2b2lkIDApIHsgc3RhdHVzTGlzdCA9IFtTdGF0dXNDb2Rlcy5PS107IH1cbiAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCBzdztcbiAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5sZW5ndGggPj0gMjU2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUcmFuc3BvcnRFcnJvcihcImRhdGEubGVuZ3RoIGV4Y2VlZCAyNTYgYnl0ZXMgbGltaXQuIEdvdDogXCIgKyBkYXRhLmxlbmd0aCwgXCJEYXRhTGVuZ3RoVG9vQmlnXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmV4Y2hhbmdlKEJ1ZmZlci5jb25jYXQoW0J1ZmZlci5mcm9tKFtjbGEsIGlucywgcDEsIHAyXSksIEJ1ZmZlci5mcm9tKFtkYXRhLmxlbmd0aF0pLCBkYXRhXSkpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdyA9IHJlc3BvbnNlLnJlYWRVSW50MTZCRShyZXNwb25zZS5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXR1c0xpc3Quc29tZShmdW5jdGlvbiAocykgeyByZXR1cm4gcyA9PT0gc3c7IH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUcmFuc3BvcnRTdGF0dXNFcnJvcihzdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmV4Y2hhbmdlQXRvbWljSW1wbCA9IGZ1bmN0aW9uIChmKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzb2x2ZUJ1c3ksIGJ1c3lQcm9taXNlLCB1bnJlc3BvbnNpdmVSZWFjaGVkLCB0aW1lb3V0LCByZXM7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZXhjaGFuZ2VCdXN5UHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUcmFuc3BvcnRSYWNlQ29uZGl0aW9uKFwiQW4gYWN0aW9uIHdhcyBhbHJlYWR5IHBlbmRpbmcgb24gdGhlIEtQcm8gZGV2aWNlLiBQbGVhc2UgZGVueSBvciByZWNvbm5lY3QuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnVzeVByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVCdXN5ID0gcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leGNoYW5nZUJ1c3lQcm9taXNlID0gYnVzeVByb21pc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bnJlc3BvbnNpdmVSZWFjaGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5yZXNwb25zaXZlUmVhY2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZW1pdChcInVucmVzcG9uc2l2ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMudW5yZXNwb25zaXZlVGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgLCAzLCA0XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBmKCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5yZXNwb25zaXZlUmVhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcInJlc3BvbnNpdmVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc29sdmVCdXN5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVCdXN5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4Y2hhbmdlQnVzeVByb21pc2UgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs3IC8qZW5kZmluYWxseSovXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZW5kIGRhdGEgdG8gdGhlIGRldmljZSB1c2luZyBhIGxvdyBsZXZlbCBBUEkuXG4gICAgICogSXQncyByZWNvbW1lbmRlZCB0byB1c2UgdGhlIFwic2VuZFwiIG1ldGhvZCBmb3IgYSBoaWdoZXIgbGV2ZWwgQVBJLlxuICAgICAqIEBwYXJhbSB7QnVmZmVyfSBhcGR1IC0gVGhlIGRhdGEgdG8gc2VuZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxCdWZmZXI+fSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZXNwb25zZSBkYXRhIGZyb20gdGhlIGRldmljZS5cbiAgICAgKi9cbiAgICBUcmFuc3BvcnQucHJvdG90eXBlLmV4Y2hhbmdlID0gZnVuY3Rpb24gKF9hcGR1KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImV4Y2hhbmdlIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNlbmQgYXBkdXMgaW4gYmF0Y2ggdG8gdGhlIGRldmljZSB1c2luZyBhIGxvdyBsZXZlbCBBUEkuXG4gICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gaXMgdG8gY2FsbCBleGNoYW5nZSBmb3IgZWFjaCBhcGR1LlxuICAgICAqIEBwYXJhbSB7QXJyYXk8QnVmZmVyPn0gYXBkdXMgLSBhcnJheSBvZiBhcGR1cyB0byBzZW5kLlxuICAgICAqIEBwYXJhbSB7T2JzZXJ2ZXI8QnVmZmVyPn0gb2JzZXJ2ZXIgLSBhbiBvYnNlcnZlciB0aGF0IHdpbGwgcmVjZWl2ZSB0aGUgcmVzcG9uc2Ugb2YgZWFjaCBhcGR1LlxuICAgICAqIEByZXR1cm5zIHtTdWJzY3JpcHRpb259IEEgU3Vic2NyaXB0aW9uIG9iamVjdCBvbiB3aGljaCB5b3UgY2FuIGNhbGwgXCIudW5zdWJzY3JpYmUoKVwiIHRvIHN0b3Agc2VuZGluZyBhcGR1cy5cbiAgICAgKi9cbiAgICBUcmFuc3BvcnQucHJvdG90eXBlLmV4Y2hhbmdlQnVsayA9IGZ1bmN0aW9uIChhcGR1cywgb2JzZXJ2ZXIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHVuc3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgdW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgbWFpbiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcGR1c18xLCBhcGR1c18xXzEsIGFwZHUsIHIsIHN0YXR1c18xLCBlXzFfMTtcbiAgICAgICAgICAgIHZhciBlXzEsIF9hO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVuc3Vic2NyaWJlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9iLnRyeXMucHVzaChbMSwgNiwgNywgOF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBkdXNfMSA9IF9fdmFsdWVzKGFwZHVzKSwgYXBkdXNfMV8xID0gYXBkdXNfMS5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghIWFwZHVzXzFfMS5kb25lKSByZXR1cm4gWzMgLypicmVhayovLCA1XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwZHUgPSBhcGR1c18xXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmV4Y2hhbmdlKGFwZHUpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bnN1YnNjcmliZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzXzEgPSByLnJlYWRVSW50MTZCRShyLmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c18xICE9PSBTdGF0dXNDb2Rlcy5PSykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUcmFuc3BvcnRTdGF0dXNFcnJvcihzdGF0dXNfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSA0O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcGR1c18xXzEgPSBhcGR1c18xLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDJdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbMyAvKmJyZWFrKi8sIDhdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgICAgICBlXzFfMSA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA4XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXBkdXNfMV8xICYmICFhcGR1c18xXzEuZG9uZSAmJiAoX2EgPSBhcGR1c18xLnJldHVybikpIF9hLmNhbGwoYXBkdXNfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzcgLyplbmRmaW5hbGx5Ki9dO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDg6IHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7IH07XG4gICAgICAgIG1haW4oKS50aGVuKGZ1bmN0aW9uICgpIHsgcmV0dXJuICF1bnN1YnNjcmliZWQgJiYgb2JzZXJ2ZXIuY29tcGxldGUoKTsgfSwgZnVuY3Rpb24gKGUpIHsgcmV0dXJuICF1bnN1YnNjcmliZWQgJiYgb2JzZXJ2ZXIuZXJyb3IoZSk7IH0pO1xuICAgICAgICByZXR1cm4geyB1bnN1YnNjcmliZTogdW5zdWJzY3JpYmUgfTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBjb25uZWN0aW9uIHdpdGggdGhlIGRldmljZS5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgdHJhbnNwb3J0IGlzIGNsb3NlZC5cbiAgICAgKi9cbiAgICBUcmFuc3BvcnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gZm9yIGFuIGV2ZW50IG9uIHRoZSB0cmFuc3BvcnQgaW5zdGFuY2UuXG4gICAgICogVHJhbnNwb3J0IGltcGxlbWVudGF0aW9ucyBtYXkgaGF2ZSBzcGVjaWZpYyBldmVudHMuIENvbW1vbiBldmVudHMgaW5jbHVkZTpcbiAgICAgKiBcImRpc2Nvbm5lY3RcIiA6IHRyaWdnZXJlZCB3aGVuIHRoZSB0cmFuc3BvcnQgaXMgZGlzY29ubmVjdGVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuIGZvci5cbiAgICAgKiBAcGFyYW0geyguLi5hcmdzOiBBcnJheTxhbnk+KSA9PiBhbnl9IGNiIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgb2NjdXJzLlxuICAgICAqL1xuICAgIFRyYW5zcG9ydC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBjYikge1xuICAgICAgICB0aGlzLl9ldmVudHMub24oZXZlbnROYW1lLCBjYik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTdG9wIGxpc3RlbmluZyB0byBhbiBldmVudCBvbiBhbiBpbnN0YW5jZSBvZiB0cmFuc3BvcnQuXG4gICAgICovXG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBjYikge1xuICAgICAgICB0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCBjYik7XG4gICAgfTtcbiAgICBUcmFuc3BvcnQucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICAoX2EgPSB0aGlzLl9ldmVudHMpLmVtaXQuYXBwbHkoX2EsIF9fc3ByZWFkQXJyYXkoW2V2ZW50XSwgX19yZWFkKGFyZ3MpLCBmYWxzZSkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2V0IGEgdGltZW91dCAoaW4gbWlsbGlzZWNvbmRzKSBmb3IgdGhlIGV4Y2hhbmdlIGNhbGwuIE9ubHkgc29tZSB0cmFuc3BvcnQgbWlnaHQgaW1wbGVtZW50IGl0LiAoZS5nLiBVMkYpXG4gICAgICovXG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5zZXRFeGNoYW5nZVRpbWVvdXQgPSBmdW5jdGlvbiAoZXhjaGFuZ2VUaW1lb3V0KSB7XG4gICAgICAgIHRoaXMuZXhjaGFuZ2VUaW1lb3V0ID0gZXhjaGFuZ2VUaW1lb3V0O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRGVmaW5lIHRoZSBkZWxheSBiZWZvcmUgZW1pdHRpbmcgXCJ1bnJlc3BvbnNpdmVcIiBvbiBhbiBleGNoYW5nZSB0aGF0IGRvZXMgbm90IHJlc3BvbmRcbiAgICAgKi9cbiAgICBUcmFuc3BvcnQucHJvdG90eXBlLnNldEV4Y2hhbmdlVW5yZXNwb25zaXZlVGltZW91dCA9IGZ1bmN0aW9uICh1bnJlc3BvbnNpdmVUaW1lb3V0KSB7XG4gICAgICAgIHRoaXMudW5yZXNwb25zaXZlVGltZW91dCA9IHVucmVzcG9uc2l2ZVRpbWVvdXQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBjcmVhdGUoKSBhbGxvd3MgdG8gb3BlbiB0aGUgZmlyc3QgZGVzY3JpcHRvciBhdmFpbGFibGUgb3JcbiAgICAgKiB0aHJvdyBpZiB0aGVyZSBpcyBub25lIG9yIGlmIHRpbWVvdXQgaXMgcmVhY2hlZC5cbiAgICAgKiBUaGlzIGlzIGEgbGlnaHQgaGVscGVyLCBhbHRlcm5hdGl2ZSB0byB1c2luZyBsaXN0ZW4oKSBhbmQgb3BlbigpICh0aGF0IHlvdSBtYXkgbmVlZCBmb3IgYW55IG1vcmUgYWR2YW5jZWQgdXNlY2FzZSlcbiAgICAgKiBAZXhhbXBsZVxuICAgIFRyYW5zcG9ydEZvby5jcmVhdGUoKS50aGVuKHRyYW5zcG9ydCA9PiAuLi4pXG4gICAgICovXG4gICAgVHJhbnNwb3J0LmNyZWF0ZSA9IGZ1bmN0aW9uIChvcGVuVGltZW91dCwgbGlzdGVuVGltZW91dCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAob3BlblRpbWVvdXQgPT09IHZvaWQgMCkgeyBvcGVuVGltZW91dCA9IDMwMDA7IH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHN1YiA9IF90aGlzLmxpc3Rlbih7XG4gICAgICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3ViKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5UaW1lb3V0SWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQobGlzdGVuVGltZW91dElkKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMub3BlbihlLmRlc2NyaXB0b3IsIG9wZW5UaW1lb3V0KS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlblRpbWVvdXRJZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChsaXN0ZW5UaW1lb3V0SWQpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuVGltZW91dElkKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGxpc3RlblRpbWVvdXRJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgVHJhbnNwb3J0RXJyb3IoX3RoaXMuRXJyb3JNZXNzYWdlX05vRGV2aWNlRm91bmQsIFwiTm9EZXZpY2VGb3VuZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgbGlzdGVuVGltZW91dElkID0gbGlzdGVuVGltZW91dFxuICAgICAgICAgICAgICAgID8gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IFRyYW5zcG9ydEVycm9yKF90aGlzLkVycm9yTWVzc2FnZV9MaXN0ZW5UaW1lb3V0LCBcIkxpc3RlblRpbWVvdXRcIikpO1xuICAgICAgICAgICAgICAgIH0sIGxpc3RlblRpbWVvdXQpXG4gICAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFRyYW5zcG9ydC5FcnJvck1lc3NhZ2VfTGlzdGVuVGltZW91dCA9IFwiTm8gS1BybyBkZXZpY2UgZm91bmQgKHRpbWVvdXQpXCI7XG4gICAgVHJhbnNwb3J0LkVycm9yTWVzc2FnZV9Ob0RldmljZUZvdW5kID0gXCJObyBLUHJvIGRldmljZSBmb3VuZFwiO1xuICAgIHJldHVybiBUcmFuc3BvcnQ7XG59KCkpO1xuZXhwb3J0IGRlZmF1bHQgVHJhbnNwb3J0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNwb3J0LmpzLm1hcCIsInZhciBfX3JlYWQgPSAodGhpcyAmJiB0aGlzLl9fcmVhZCkgfHwgZnVuY3Rpb24gKG8sIG4pIHtcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XG4gICAgaWYgKCFtKSByZXR1cm4gbztcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcbiAgICB0cnkge1xuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XG4gICAgZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cbiAgICB9XG4gICAgcmV0dXJuIGFyO1xufTtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogICBMZWRnZXIgTm9kZSBKUyBBUElcbiAqICAgKGMpIDIwMTYtMjAxNyBMZWRnZXJcbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5pbXBvcnQgeyBlbmNvZGUsIGRlY29kZSB9IGZyb20gXCJAZXRoZXJzcHJvamVjdC9ybHBcIjtcbmltcG9ydCB7IEJpZ051bWJlciB9IGZyb20gXCJiaWdudW1iZXIuanNcIjtcbmV4cG9ydCB2YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIGNvbXBvbmVudHMgPSBwYXRoLnNwbGl0KFwiL1wiKTtcbiAgICBjb21wb25lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIG51bWJlciA9IHBhcnNlSW50KGVsZW1lbnQsIDEwKTtcbiAgICAgICAgaWYgKGlzTmFOKG51bWJlcikpIHtcbiAgICAgICAgICAgIHJldHVybjsgLy8gRklYTUUgc2hvdWxkbid0IGl0IHRocm93cyBpbnN0ZWFkP1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50Lmxlbmd0aCA+IDEgJiYgZWxlbWVudFtlbGVtZW50Lmxlbmd0aCAtIDFdID09PSBcIidcIikge1xuICAgICAgICAgICAgbnVtYmVyICs9IDB4ODAwMDAwMDA7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnB1c2gobnVtYmVyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbmV4cG9ydCB2YXIgaGV4QnVmZmVyID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbShzdHIuc3RhcnRzV2l0aChcIjB4XCIpID8gc3RyLnNsaWNlKDIpIDogc3RyLCBcImhleFwiKTtcbn07XG5leHBvcnQgdmFyIG1heWJlSGV4QnVmZmVyID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGlmICghc3RyKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gaGV4QnVmZmVyKHN0cik7XG59O1xuZXhwb3J0IHZhciBkZWNvZGVUeEluZm8gPSBmdW5jdGlvbiAocmF3VHgpIHtcbiAgICB2YXIgVkFMSURfVFlQRVMgPSBbMSwgMl07XG4gICAgdmFyIHR4VHlwZSA9IFZBTElEX1RZUEVTLmluY2x1ZGVzKHJhd1R4WzBdKSA/IHJhd1R4WzBdIDogbnVsbDtcbiAgICB2YXIgcmxwRGF0YSA9IHR4VHlwZSA9PT0gbnVsbCA/IHJhd1R4IDogcmF3VHguc3ViYXJyYXkoMSk7XG4gICAgdmFyIHJscFR4ID0gZGVjb2RlKHJscERhdGEpLm1hcChmdW5jdGlvbiAoaGV4KSB7IHJldHVybiBCdWZmZXIuZnJvbShoZXguc2xpY2UoMiksIFwiaGV4XCIpOyB9KTtcbiAgICB2YXIgY2hhaW5JZFRydW5jYXRlZCA9IDA7XG4gICAgdmFyIHJscERlY29kZWQgPSBkZWNvZGUocmxwRGF0YSk7XG4gICAgdmFyIGRlY29kZWRUeDtcbiAgICBpZiAodHhUeXBlID09PSAyKSB7XG4gICAgICAgIC8vIEVJUDE1NTlcbiAgICAgICAgZGVjb2RlZFR4ID0ge1xuICAgICAgICAgICAgZGF0YTogcmxwRGVjb2RlZFs3XSxcbiAgICAgICAgICAgIHRvOiBybHBEZWNvZGVkWzVdLFxuICAgICAgICAgICAgY2hhaW5JZDogcmxwVHhbMF0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKHR4VHlwZSA9PT0gMSkge1xuICAgICAgICAvLyBFSVAyOTMwXG4gICAgICAgIGRlY29kZWRUeCA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJscERlY29kZWRbNl0sXG4gICAgICAgICAgICB0bzogcmxwRGVjb2RlZFs0XSxcbiAgICAgICAgICAgIGNoYWluSWQ6IHJscFR4WzBdLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gTGVnYWN5IHR4XG4gICAgICAgIGRlY29kZWRUeCA9IHtcbiAgICAgICAgICAgIGRhdGE6IHJscERlY29kZWRbNV0sXG4gICAgICAgICAgICB0bzogcmxwRGVjb2RlZFszXSxcbiAgICAgICAgICAgIC8vIERlZmF1bHQgdG8gMSBmb3Igbm9uIEVJUCAxNTUgdHhzXG4gICAgICAgICAgICBjaGFpbklkOiBybHBUeC5sZW5ndGggPiA2ID8gcmxwVHhbNl0gOiBCdWZmZXIuZnJvbShcIjB4MDFcIiwgXCJoZXhcIiksXG4gICAgICAgIH07XG4gICAgfVxuICAgIHZhciBjaGFpbklkU3JjID0gZGVjb2RlZFR4LmNoYWluSWQ7XG4gICAgdmFyIGNoYWluSWQgPSBuZXcgQmlnTnVtYmVyKDApO1xuICAgIGlmIChjaGFpbklkU3JjKSB7XG4gICAgICAgIC8vIFVzaW5nIEJpZ051bWJlciBiZWNhdXNlIGNoYWluSUQgY291bGQgYmUgYW55IHVpbnQyNTYuXG4gICAgICAgIGNoYWluSWQgPSBuZXcgQmlnTnVtYmVyKGNoYWluSWRTcmMudG9TdHJpbmcoXCJoZXhcIiksIDE2KTtcbiAgICAgICAgdmFyIGNoYWluSWRUcnVuY2F0ZWRCdWYgPSBCdWZmZXIuYWxsb2MoNCk7XG4gICAgICAgIGlmIChjaGFpbklkU3JjLmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgIGNoYWluSWRTcmMuY29weShjaGFpbklkVHJ1bmNhdGVkQnVmKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNoYWluSWRTcmMuY29weShjaGFpbklkVHJ1bmNhdGVkQnVmLCA0IC0gY2hhaW5JZFNyYy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGNoYWluSWRUcnVuY2F0ZWQgPSBjaGFpbklkVHJ1bmNhdGVkQnVmLnJlYWRVSW50MzJCRSgwKTtcbiAgICB9XG4gICAgdmFyIHZyc09mZnNldCA9IDA7XG4gICAgaWYgKHR4VHlwZSA9PT0gbnVsbCAmJiBybHBUeC5sZW5ndGggPiA2KSB7XG4gICAgICAgIHZhciBybHBWcnMgPSBCdWZmZXIuZnJvbShlbmNvZGUocmxwVHguc2xpY2UoLTMpKS5zbGljZSgyKSwgXCJoZXhcIik7XG4gICAgICAgIHZyc09mZnNldCA9IHJhd1R4Lmxlbmd0aCAtIChybHBWcnMubGVuZ3RoIC0gMSk7XG4gICAgICAgIC8vIEZpcnN0IGJ5dGUgPiAweGY3IG1lYW5zIHRoZSBsZW5ndGggb2YgdGhlIGxpc3QgbGVuZ3RoIGRvZXNuJ3QgZml0IGluIGEgc2luZ2xlIGJ5dGUuXG4gICAgICAgIGlmIChybHBWcnNbMF0gPiAweGY3KSB7XG4gICAgICAgICAgICAvLyBJbmNyZW1lbnQgdnJzT2Zmc2V0IHRvIGFjY291bnQgZm9yIHRoYXQgZXh0cmEgYnl0ZS5cbiAgICAgICAgICAgIHZyc09mZnNldCsrO1xuICAgICAgICAgICAgLy8gQ29tcHV0ZSBzaXplIG9mIHRoZSBsaXN0IGxlbmd0aC5cbiAgICAgICAgICAgIHZhciBzaXplT2ZMaXN0TGVuID0gcmxwVnJzWzBdIC0gMHhmNztcbiAgICAgICAgICAgIC8vIEluY3JlYXNlIHJscE9mZnNldCBieSB0aGUgc2l6ZSBvZiB0aGUgbGlzdCBsZW5ndGguXG4gICAgICAgICAgICB2cnNPZmZzZXQgKz0gc2l6ZU9mTGlzdExlbiAtIDE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVjb2RlZFR4OiBkZWNvZGVkVHgsXG4gICAgICAgIHR4VHlwZTogdHhUeXBlLFxuICAgICAgICBjaGFpbklkOiBjaGFpbklkLFxuICAgICAgICBjaGFpbklkVHJ1bmNhdGVkOiBjaGFpbklkVHJ1bmNhdGVkLFxuICAgICAgICB2cnNPZmZzZXQ6IHZyc09mZnNldCxcbiAgICB9O1xufTtcbi8qKlxuICogQGlnbm9yZSBmb3IgdGhlIFJFQURNRVxuICpcbiAqIEhlbHBlciB0byBjb252ZXJ0IGFuIGludGVnZXIgYXMgYSBoZXhhZGVjaW1hbCBzdHJpbmcgd2l0aCB0aGUgcmlnaHQgYW1vdW50IG9mIGRpZ2l0c1xuICogdG8gcmVzcGVjdCB0aGUgbnVtYmVyIG9mIGJ5dGVzIGdpdmVuIGFzIHBhcmFtZXRlclxuICpcbiAqIEBwYXJhbSBpbnQgSW50ZWdlclxuICogQHBhcmFtIGJ5dGVzIE51bWJlciBvZiBieXRlcyBpdCBzaG91bGQgYmUgcmVwcmVzZW50ZWQgYXMgKDEgYnl0ZSA9IDIgY2FyYXRlcnMpXG4gKiBAcmV0dXJucyBUaGUgZ2l2ZW4gaW50ZWdlciBhcyBhbiBoZXhhIHN0cmluZyBwYWRkZWQgd2l0aCB0aGUgcmlnaHQgbnVtYmVyIG9mIDBcbiAqL1xuZXhwb3J0IHZhciBpbnRBc0hleEJ5dGVzID0gZnVuY3Rpb24gKGludCwgYnl0ZXMpIHtcbiAgICByZXR1cm4gaW50LnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyICogYnl0ZXMsIFwiMFwiKTtcbn07XG4vKipcbiAqIEBpZ25vcmUgZm9yIHRoZSBSRUFETUVcbiAqXG4gKiBMaXN0IG9mIHNlbGVjdG9ycyAoaGV4YWRlY2ltYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIHVzZWQgbWV0aG9kJ3Mgc2lnbmF0dXJlKSByZWxhdGVkIHRvXG4gKiBFUkMyMCAoVG9rZW5zKSwgRVJDNzIxL0VSQzExNTUgKE5GVCkuXG4gKiBZb3UgY2FuIHZlcmlmeSBhbmQvb3IgZ2V0IG1vcmUgaW5mbyBhYm91dCB0aGVtIG9uIGh0dHA6Ly80Ynl0ZS5kaXJlY3RvcnlcbiAqL1xuZXhwb3J0IHZhciBFUkMyMF9DTEVBUl9TSUdORURfU0VMRUNUT1JTO1xuKGZ1bmN0aW9uIChFUkMyMF9DTEVBUl9TSUdORURfU0VMRUNUT1JTKSB7XG4gICAgRVJDMjBfQ0xFQVJfU0lHTkVEX1NFTEVDVE9SU1tcIkFQUFJPVkVcIl0gPSBcIjB4MDk1ZWE3YjNcIjtcbiAgICBFUkMyMF9DTEVBUl9TSUdORURfU0VMRUNUT1JTW1wiVFJBTlNGRVJcIl0gPSBcIjB4YTkwNTljYmJcIjtcbn0pKEVSQzIwX0NMRUFSX1NJR05FRF9TRUxFQ1RPUlMgfHwgKEVSQzIwX0NMRUFSX1NJR05FRF9TRUxFQ1RPUlMgPSB7fSkpO1xuZXhwb3J0IHZhciBFUkM3MjFfQ0xFQVJfU0lHTkVEX1NFTEVDVE9SUztcbihmdW5jdGlvbiAoRVJDNzIxX0NMRUFSX1NJR05FRF9TRUxFQ1RPUlMpIHtcbiAgICBFUkM3MjFfQ0xFQVJfU0lHTkVEX1NFTEVDVE9SU1tcIkFQUFJPVkVcIl0gPSBcIjB4MDk1ZWE3YjNcIjtcbiAgICBFUkM3MjFfQ0xFQVJfU0lHTkVEX1NFTEVDVE9SU1tcIlNFVF9BUFBST1ZBTF9GT1JfQUxMXCJdID0gXCIweGEyMmNiNDY1XCI7XG4gICAgRVJDNzIxX0NMRUFSX1NJR05FRF9TRUxFQ1RPUlNbXCJUUkFOU0ZFUl9GUk9NXCJdID0gXCIweDIzYjg3MmRkXCI7XG4gICAgRVJDNzIxX0NMRUFSX1NJR05FRF9TRUxFQ1RPUlNbXCJTQUZFX1RSQU5TRkVSX0ZST01cIl0gPSBcIjB4NDI4NDJlMGVcIjtcbiAgICBFUkM3MjFfQ0xFQVJfU0lHTkVEX1NFTEVDVE9SU1tcIlNBRkVfVFJBTlNGRVJfRlJPTV9XSVRIX0RBVEFcIl0gPSBcIjB4Yjg4ZDRmZGVcIjtcbn0pKEVSQzcyMV9DTEVBUl9TSUdORURfU0VMRUNUT1JTIHx8IChFUkM3MjFfQ0xFQVJfU0lHTkVEX1NFTEVDVE9SUyA9IHt9KSk7XG5leHBvcnQgdmFyIEVSQzExNTVfQ0xFQVJfU0lHTkVEX1NFTEVDVE9SUztcbihmdW5jdGlvbiAoRVJDMTE1NV9DTEVBUl9TSUdORURfU0VMRUNUT1JTKSB7XG4gICAgRVJDMTE1NV9DTEVBUl9TSUdORURfU0VMRUNUT1JTW1wiU0VUX0FQUFJPVkFMX0ZPUl9BTExcIl0gPSBcIjB4YTIyY2I0NjVcIjtcbiAgICBFUkMxMTU1X0NMRUFSX1NJR05FRF9TRUxFQ1RPUlNbXCJTQUZFX1RSQU5TRkVSX0ZST01cIl0gPSBcIjB4ZjI0MjQzMmFcIjtcbiAgICBFUkMxMTU1X0NMRUFSX1NJR05FRF9TRUxFQ1RPUlNbXCJTQUZFX0JBVENIX1RSQU5TRkVSX0ZST01cIl0gPSBcIjB4MmViMmMyZDZcIjtcbn0pKEVSQzExNTVfQ0xFQVJfU0lHTkVEX1NFTEVDVE9SUyB8fCAoRVJDMTE1NV9DTEVBUl9TSUdORURfU0VMRUNUT1JTID0ge30pKTtcbmV4cG9ydCB2YXIgdG9rZW5TZWxlY3RvcnMgPSBPYmplY3QudmFsdWVzKEVSQzIwX0NMRUFSX1NJR05FRF9TRUxFQ1RPUlMpO1xuZXhwb3J0IHZhciBuZnRTZWxlY3RvcnMgPSBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChPYmplY3QudmFsdWVzKEVSQzcyMV9DTEVBUl9TSUdORURfU0VMRUNUT1JTKSksIGZhbHNlKSwgX19yZWFkKE9iamVjdC52YWx1ZXMoRVJDMTE1NV9DTEVBUl9TSUdORURfU0VMRUNUT1JTKSksIGZhbHNlKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWxzLmpzLm1hcCIsImltcG9ydCBLUHJvSlMgZnJvbSBcImtwcm9qc1wiO1xyXG5pbXBvcnQgVHJhbnNwb3J0V2ViSElEIGZyb20gXCJrcHJvanMtd2ViLWhpZFwiO1xyXG5cclxuaWYgKCEoJ3Byb2Nlc3MnIGluIHdpbmRvdykpIHtcclxuICAvLyBAdHMtaWdub3JlXHJcbiAgd2luZG93LnByb2Nlc3MgPSB7fVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVGaXJtd2FyZVVwZGF0ZSgpIDogUHJvbWlzZTx2b2lkPiB7XHJcbiAgY29uc3QgdXBkYXRlRmlybXdhcmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1mdy11cGRhdGVcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgY29uc3QgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZ3LXByb2dyZXNzXCIpO1xyXG4gIGNvbnN0IGZ3TG9hZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZ3Jlc3MtYmFyXCIpIGFzIEhUTUxQcm9ncmVzc0VsZW1lbnQ7XHJcbiAgY29uc3QgbWVkaWFQcmVmaXhGaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVkaWEtcHJlZml4XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgY29uc3QgbWVkaWFQcmVmaXggPSBtZWRpYVByZWZpeEZpZWxkLnZhbHVlO1xyXG5cclxuICBjb25zdCBjb250ZXh0ID0gYXdhaXQgZmV0Y2goXCIuL2NvbnRleHRcIikudGhlbigocikgPT4gci5qc29uKCkpO1xyXG5cclxuICBjb25zdCBmdyA9IGF3YWl0IGZldGNoKG1lZGlhUHJlZml4ICsgY29udGV4dFtcImZ3X3BhdGhcIl0pLnRoZW4oKHIpID0+IHIuYXJyYXlCdWZmZXIoKSk7XHJcbiAgY29uc3QgY2hhbmdlbG9nID0gYXdhaXQgZmV0Y2gobWVkaWFQcmVmaXggKyBjb250ZXh0W1wiY2hhbmdlbG9nX3BhdGhcIl0pLnRoZW4oKHIpID0+IHIudGV4dCgpKTtcclxuXHJcbiAgZndMb2FkLm1heCA9IGZ3LmJ5dGVMZW5ndGg7XHJcblxyXG4gIGxldCB0cmFuc3BvcnQ6IGFueTtcclxuICBsZXQgYXBwRXRoOiBhbnk7XHJcbiAgbGV0IGZ3SSA9IDA7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUZXTG9hZFByb2dyZXNzKHRyYW5zcG9ydDogYW55LCBsb2FkQmFyOiBIVE1MUHJvZ3Jlc3NFbGVtZW50KSA6IHZvaWQge1xyXG4gICAgaWYgKGZ3SSA9PSAwKSB7XHJcbiAgICAgIGZ3SSA9IDE7XHJcbiAgICAgIGxldCBwQmFyUHJvZ3Jlc3MgPSAwO1xyXG4gICAgICB0cmFuc3BvcnQub24oXCJjaHVuay1sb2FkZWRcIiwgKHByb2dyZXNzOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAocHJvZ3Jlc3MgPj0gbG9hZEJhci5tYXgpIHtcclxuICAgICAgICAgIHRyYW5zcG9ydC5vZmYoXCJjaHVuay1sb2FkZWRcIik7XHJcbiAgICAgICAgICBpID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcEJhclByb2dyZXNzICs9IHByb2dyZXNzXHJcbiAgICAgICAgICBsb2FkQmFyLnZhbHVlID0gcEJhclByb2dyZXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZUZpcm13YXJlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QucmVtb3ZlKFwia3Byb193ZWJfX2Rpc3BsYXktbm9uZVwiKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRyYW5zcG9ydCA9IGF3YWl0IFRyYW5zcG9ydFdlYkhJRC5jcmVhdGUoKTtcclxuICAgICAgYXBwRXRoID0gbmV3IEtQcm9KUy5FdGgodHJhbnNwb3J0KTtcclxuICAgICAgaGFuZGxlRldMb2FkUHJvZ3Jlc3ModHJhbnNwb3J0LCBmd0xvYWQpO1xyXG4gICAgICBsZXQgciA9IGF3YWl0IGFwcEV0aC5sb2FkRmlybXdhcmUoZncpO1xyXG4gICAgICBjb25zb2xlLmxvZyhyKTtcclxuICAgICAgYXdhaXQgdHJhbnNwb3J0LmNsb3NlKCk7XHJcbiAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoXCJrcHJvX3dlYl9fZGlzcGxheS1ub25lXCIpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZChcImtwcm9fd2ViX19kaXNwbGF5LW5vbmVcIik7XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuaGFuZGxlRmlybXdhcmVVcGRhdGUoKTsiLCIvKlxyXG4gKiAgICAgIGJpZ251bWJlci5qcyB2OS4xLjJcclxuICogICAgICBBIEphdmFTY3JpcHQgbGlicmFyeSBmb3IgYXJiaXRyYXJ5LXByZWNpc2lvbiBhcml0aG1ldGljLlxyXG4gKiAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWtlTWNsL2JpZ251bWJlci5qc1xyXG4gKiAgICAgIENvcHlyaWdodCAoYykgMjAyMiBNaWNoYWVsIE1jbGF1Z2hsaW4gPE04Y2g4OGxAZ21haWwuY29tPlxyXG4gKiAgICAgIE1JVCBMaWNlbnNlZC5cclxuICpcclxuICogICAgICBCaWdOdW1iZXIucHJvdG90eXBlIG1ldGhvZHMgICAgIHwgIEJpZ051bWJlciBtZXRob2RzXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgYWJzb2x1dGVWYWx1ZSAgICAgICAgICAgIGFicyAgICB8ICBjbG9uZVxyXG4gKiAgICAgIGNvbXBhcmVkVG8gICAgICAgICAgICAgICAgICAgICAgfCAgY29uZmlnICAgICAgICAgICAgICAgc2V0XHJcbiAqICAgICAgZGVjaW1hbFBsYWNlcyAgICAgICAgICAgIGRwICAgICB8ICAgICAgREVDSU1BTF9QTEFDRVNcclxuICogICAgICBkaXZpZGVkQnkgICAgICAgICAgICAgICAgZGl2ICAgIHwgICAgICBST1VORElOR19NT0RFXHJcbiAqICAgICAgZGl2aWRlZFRvSW50ZWdlckJ5ICAgICAgIGlkaXYgICB8ICAgICAgRVhQT05FTlRJQUxfQVRcclxuICogICAgICBleHBvbmVudGlhdGVkQnkgICAgICAgICAgcG93ICAgIHwgICAgICBSQU5HRVxyXG4gKiAgICAgIGludGVnZXJWYWx1ZSAgICAgICAgICAgICAgICAgICAgfCAgICAgIENSWVBUT1xyXG4gKiAgICAgIGlzRXF1YWxUbyAgICAgICAgICAgICAgICBlcSAgICAgfCAgICAgIE1PRFVMT19NT0RFXHJcbiAqICAgICAgaXNGaW5pdGUgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgUE9XX1BSRUNJU0lPTlxyXG4gKiAgICAgIGlzR3JlYXRlclRoYW4gICAgICAgICAgICBndCAgICAgfCAgICAgIEZPUk1BVFxyXG4gKiAgICAgIGlzR3JlYXRlclRoYW5PckVxdWFsVG8gICBndGUgICAgfCAgICAgIEFMUEhBQkVUXHJcbiAqICAgICAgaXNJbnRlZ2VyICAgICAgICAgICAgICAgICAgICAgICB8ICBpc0JpZ051bWJlclxyXG4gKiAgICAgIGlzTGVzc1RoYW4gICAgICAgICAgICAgICBsdCAgICAgfCAgbWF4aW11bSAgICAgICAgICAgICAgbWF4XHJcbiAqICAgICAgaXNMZXNzVGhhbk9yRXF1YWxUbyAgICAgIGx0ZSAgICB8ICBtaW5pbXVtICAgICAgICAgICAgICBtaW5cclxuICogICAgICBpc05hTiAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgIHJhbmRvbVxyXG4gKiAgICAgIGlzTmVnYXRpdmUgICAgICAgICAgICAgICAgICAgICAgfCAgc3VtXHJcbiAqICAgICAgaXNQb3NpdGl2ZSAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgaXNaZXJvICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgbWludXMgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgbW9kdWxvICAgICAgICAgICAgICAgICAgIG1vZCAgICB8XHJcbiAqICAgICAgbXVsdGlwbGllZEJ5ICAgICAgICAgICAgIHRpbWVzICB8XHJcbiAqICAgICAgbmVnYXRlZCAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgcGx1cyAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgcHJlY2lzaW9uICAgICAgICAgICAgICAgIHNkICAgICB8XHJcbiAqICAgICAgc2hpZnRlZEJ5ICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgc3F1YXJlUm9vdCAgICAgICAgICAgICAgIHNxcnQgICB8XHJcbiAqICAgICAgdG9FeHBvbmVudGlhbCAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9GaXhlZCAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9Gb3JtYXQgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9GcmFjdGlvbiAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9KU09OICAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9OdW1iZXIgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9QcmVjaXNpb24gICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdG9TdHJpbmcgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqICAgICAgdmFsdWVPZiAgICAgICAgICAgICAgICAgICAgICAgICB8XHJcbiAqXHJcbiAqL1xyXG5cclxuXHJcbnZhclxyXG4gIGlzTnVtZXJpYyA9IC9eLT8oPzpcXGQrKD86XFwuXFxkKik/fFxcLlxcZCspKD86ZVsrLV0/XFxkKyk/JC9pLFxyXG4gIG1hdGhjZWlsID0gTWF0aC5jZWlsLFxyXG4gIG1hdGhmbG9vciA9IE1hdGguZmxvb3IsXHJcblxyXG4gIGJpZ251bWJlckVycm9yID0gJ1tCaWdOdW1iZXIgRXJyb3JdICcsXHJcbiAgdG9vTWFueURpZ2l0cyA9IGJpZ251bWJlckVycm9yICsgJ051bWJlciBwcmltaXRpdmUgaGFzIG1vcmUgdGhhbiAxNSBzaWduaWZpY2FudCBkaWdpdHM6ICcsXHJcblxyXG4gIEJBU0UgPSAxZTE0LFxyXG4gIExPR19CQVNFID0gMTQsXHJcbiAgTUFYX1NBRkVfSU5URUdFUiA9IDB4MWZmZmZmZmZmZmZmZmYsICAgICAgICAgLy8gMl41MyAtIDFcclxuICAvLyBNQVhfSU5UMzIgPSAweDdmZmZmZmZmLCAgICAgICAgICAgICAgICAgICAvLyAyXjMxIC0gMVxyXG4gIFBPV1NfVEVOID0gWzEsIDEwLCAxMDAsIDFlMywgMWU0LCAxZTUsIDFlNiwgMWU3LCAxZTgsIDFlOSwgMWUxMCwgMWUxMSwgMWUxMiwgMWUxM10sXHJcbiAgU1FSVF9CQVNFID0gMWU3LFxyXG5cclxuICAvLyBFRElUQUJMRVxyXG4gIC8vIFRoZSBsaW1pdCBvbiB0aGUgdmFsdWUgb2YgREVDSU1BTF9QTEFDRVMsIFRPX0VYUF9ORUcsIFRPX0VYUF9QT1MsIE1JTl9FWFAsIE1BWF9FWFAsIGFuZFxyXG4gIC8vIHRoZSBhcmd1bWVudHMgdG8gdG9FeHBvbmVudGlhbCwgdG9GaXhlZCwgdG9Gb3JtYXQsIGFuZCB0b1ByZWNpc2lvbi5cclxuICBNQVggPSAxRTk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIE1BWF9JTlQzMlxyXG5cclxuXHJcbi8qXHJcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgQmlnTnVtYmVyIGNvbnN0cnVjdG9yLlxyXG4gKi9cclxuZnVuY3Rpb24gY2xvbmUoY29uZmlnT2JqZWN0KSB7XHJcbiAgdmFyIGRpdiwgY29udmVydEJhc2UsIHBhcnNlTnVtZXJpYyxcclxuICAgIFAgPSBCaWdOdW1iZXIucHJvdG90eXBlID0geyBjb25zdHJ1Y3RvcjogQmlnTnVtYmVyLCB0b1N0cmluZzogbnVsbCwgdmFsdWVPZjogbnVsbCB9LFxyXG4gICAgT05FID0gbmV3IEJpZ051bWJlcigxKSxcclxuXHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBFRElUQUJMRSBDT05GSUcgREVGQVVMVFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHJcbiAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZXMgYmVsb3cgbXVzdCBiZSBpbnRlZ2VycyB3aXRoaW4gdGhlIGluY2x1c2l2ZSByYW5nZXMgc3RhdGVkLlxyXG4gICAgLy8gVGhlIHZhbHVlcyBjYW4gYWxzbyBiZSBjaGFuZ2VkIGF0IHJ1bi10aW1lIHVzaW5nIEJpZ051bWJlci5zZXQuXHJcblxyXG4gICAgLy8gVGhlIG1heGltdW0gbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzIGZvciBvcGVyYXRpb25zIGludm9sdmluZyBkaXZpc2lvbi5cclxuICAgIERFQ0lNQUxfUExBQ0VTID0gMjAsICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byBNQVhcclxuXHJcbiAgICAvLyBUaGUgcm91bmRpbmcgbW9kZSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gdGhlIGFib3ZlIGRlY2ltYWwgcGxhY2VzLCBhbmQgd2hlbiB1c2luZ1xyXG4gICAgLy8gdG9FeHBvbmVudGlhbCwgdG9GaXhlZCwgdG9Gb3JtYXQgYW5kIHRvUHJlY2lzaW9uLCBhbmQgcm91bmQgKGRlZmF1bHQgdmFsdWUpLlxyXG4gICAgLy8gVVAgICAgICAgICAwIEF3YXkgZnJvbSB6ZXJvLlxyXG4gICAgLy8gRE9XTiAgICAgICAxIFRvd2FyZHMgemVyby5cclxuICAgIC8vIENFSUwgICAgICAgMiBUb3dhcmRzICtJbmZpbml0eS5cclxuICAgIC8vIEZMT09SICAgICAgMyBUb3dhcmRzIC1JbmZpbml0eS5cclxuICAgIC8vIEhBTEZfVVAgICAgNCBUb3dhcmRzIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgdXAuXHJcbiAgICAvLyBIQUxGX0RPV04gIDUgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIGRvd24uXHJcbiAgICAvLyBIQUxGX0VWRU4gIDYgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgZXZlbiBuZWlnaGJvdXIuXHJcbiAgICAvLyBIQUxGX0NFSUwgIDcgVG93YXJkcyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvd2FyZHMgK0luZmluaXR5LlxyXG4gICAgLy8gSEFMRl9GTE9PUiA4IFRvd2FyZHMgbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0b3dhcmRzIC1JbmZpbml0eS5cclxuICAgIFJPVU5ESU5HX01PREUgPSA0LCAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byA4XHJcblxyXG4gICAgLy8gRVhQT05FTlRJQUxfQVQgOiBbVE9fRVhQX05FRyAsIFRPX0VYUF9QT1NdXHJcblxyXG4gICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBiZW5lYXRoIHdoaWNoIHRvU3RyaW5nIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAvLyBOdW1iZXIgdHlwZTogLTdcclxuICAgIFRPX0VYUF9ORUcgPSAtNywgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCB0byAtTUFYXHJcblxyXG4gICAgLy8gVGhlIGV4cG9uZW50IHZhbHVlIGF0IGFuZCBhYm92ZSB3aGljaCB0b1N0cmluZyByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgLy8gTnVtYmVyIHR5cGU6IDIxXHJcbiAgICBUT19FWFBfUE9TID0gMjEsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gTUFYXHJcblxyXG4gICAgLy8gUkFOR0UgOiBbTUlOX0VYUCwgTUFYX0VYUF1cclxuXHJcbiAgICAvLyBUaGUgbWluaW11bSBleHBvbmVudCB2YWx1ZSwgYmVuZWF0aCB3aGljaCB1bmRlcmZsb3cgdG8gemVybyBvY2N1cnMuXHJcbiAgICAvLyBOdW1iZXIgdHlwZTogLTMyNCAgKDVlLTMyNClcclxuICAgIE1JTl9FWFAgPSAtMWU3LCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLTEgdG8gLU1BWFxyXG5cclxuICAgIC8vIFRoZSBtYXhpbXVtIGV4cG9uZW50IHZhbHVlLCBhYm92ZSB3aGljaCBvdmVyZmxvdyB0byBJbmZpbml0eSBvY2N1cnMuXHJcbiAgICAvLyBOdW1iZXIgdHlwZTogIDMwOCAgKDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG4gICAgLy8gRm9yIE1BWF9FWFAgPiAxZTcsIGUuZy4gbmV3IEJpZ051bWJlcignMWUxMDAwMDAwMDAnKS5wbHVzKDEpIG1heSBiZSBzbG93LlxyXG4gICAgTUFYX0VYUCA9IDFlNywgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAxIHRvIE1BWFxyXG5cclxuICAgIC8vIFdoZXRoZXIgdG8gdXNlIGNyeXB0b2dyYXBoaWNhbGx5LXNlY3VyZSByYW5kb20gbnVtYmVyIGdlbmVyYXRpb24sIGlmIGF2YWlsYWJsZS5cclxuICAgIENSWVBUTyA9IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ1ZSBvciBmYWxzZVxyXG5cclxuICAgIC8vIFRoZSBtb2R1bG8gbW9kZSB1c2VkIHdoZW4gY2FsY3VsYXRpbmcgdGhlIG1vZHVsdXM6IGEgbW9kIG4uXHJcbiAgICAvLyBUaGUgcXVvdGllbnQgKHEgPSBhIC8gbikgaXMgY2FsY3VsYXRlZCBhY2NvcmRpbmcgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcm91bmRpbmcgbW9kZS5cclxuICAgIC8vIFRoZSByZW1haW5kZXIgKHIpIGlzIGNhbGN1bGF0ZWQgYXM6IHIgPSBhIC0gbiAqIHEuXHJcbiAgICAvL1xyXG4gICAgLy8gVVAgICAgICAgIDAgVGhlIHJlbWFpbmRlciBpcyBwb3NpdGl2ZSBpZiB0aGUgZGl2aWRlbmQgaXMgbmVnYXRpdmUsIGVsc2UgaXMgbmVnYXRpdmUuXHJcbiAgICAvLyBET1dOICAgICAgMSBUaGUgcmVtYWluZGVyIGhhcyB0aGUgc2FtZSBzaWduIGFzIHRoZSBkaXZpZGVuZC5cclxuICAgIC8vICAgICAgICAgICAgIFRoaXMgbW9kdWxvIG1vZGUgaXMgY29tbW9ubHkga25vd24gYXMgJ3RydW5jYXRlZCBkaXZpc2lvbicgYW5kIGlzXHJcbiAgICAvLyAgICAgICAgICAgICBlcXVpdmFsZW50IHRvIChhICUgbikgaW4gSmF2YVNjcmlwdC5cclxuICAgIC8vIEZMT09SICAgICAzIFRoZSByZW1haW5kZXIgaGFzIHRoZSBzYW1lIHNpZ24gYXMgdGhlIGRpdmlzb3IgKFB5dGhvbiAlKS5cclxuICAgIC8vIEhBTEZfRVZFTiA2IFRoaXMgbW9kdWxvIG1vZGUgaW1wbGVtZW50cyB0aGUgSUVFRSA3NTQgcmVtYWluZGVyIGZ1bmN0aW9uLlxyXG4gICAgLy8gRVVDTElEICAgIDkgRXVjbGlkaWFuIGRpdmlzaW9uLiBxID0gc2lnbihuKSAqIGZsb29yKGEgLyBhYnMobikpLlxyXG4gICAgLy8gICAgICAgICAgICAgVGhlIHJlbWFpbmRlciBpcyBhbHdheXMgcG9zaXRpdmUuXHJcbiAgICAvL1xyXG4gICAgLy8gVGhlIHRydW5jYXRlZCBkaXZpc2lvbiwgZmxvb3JlZCBkaXZpc2lvbiwgRXVjbGlkaWFuIGRpdmlzaW9uIGFuZCBJRUVFIDc1NCByZW1haW5kZXJcclxuICAgIC8vIG1vZGVzIGFyZSBjb21tb25seSB1c2VkIGZvciB0aGUgbW9kdWx1cyBvcGVyYXRpb24uXHJcbiAgICAvLyBBbHRob3VnaCB0aGUgb3RoZXIgcm91bmRpbmcgbW9kZXMgY2FuIGFsc28gYmUgdXNlZCwgdGhleSBtYXkgbm90IGdpdmUgdXNlZnVsIHJlc3VsdHMuXHJcbiAgICBNT0RVTE9fTU9ERSA9IDEsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gOVxyXG5cclxuICAgIC8vIFRoZSBtYXhpbXVtIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgb2YgdGhlIHJlc3VsdCBvZiB0aGUgZXhwb25lbnRpYXRlZEJ5IG9wZXJhdGlvbi5cclxuICAgIC8vIElmIFBPV19QUkVDSVNJT04gaXMgMCwgdGhlcmUgd2lsbCBiZSB1bmxpbWl0ZWQgc2lnbmlmaWNhbnQgZGlnaXRzLlxyXG4gICAgUE9XX1BSRUNJU0lPTiA9IDAsICAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIE1BWFxyXG5cclxuICAgIC8vIFRoZSBmb3JtYXQgc3BlY2lmaWNhdGlvbiB1c2VkIGJ5IHRoZSBCaWdOdW1iZXIucHJvdG90eXBlLnRvRm9ybWF0IG1ldGhvZC5cclxuICAgIEZPUk1BVCA9IHtcclxuICAgICAgcHJlZml4OiAnJyxcclxuICAgICAgZ3JvdXBTaXplOiAzLFxyXG4gICAgICBzZWNvbmRhcnlHcm91cFNpemU6IDAsXHJcbiAgICAgIGdyb3VwU2VwYXJhdG9yOiAnLCcsXHJcbiAgICAgIGRlY2ltYWxTZXBhcmF0b3I6ICcuJyxcclxuICAgICAgZnJhY3Rpb25Hcm91cFNpemU6IDAsXHJcbiAgICAgIGZyYWN0aW9uR3JvdXBTZXBhcmF0b3I6ICdcXHhBMCcsICAgICAgICAvLyBub24tYnJlYWtpbmcgc3BhY2VcclxuICAgICAgc3VmZml4OiAnJ1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBUaGUgYWxwaGFiZXQgdXNlZCBmb3IgYmFzZSBjb252ZXJzaW9uLiBJdCBtdXN0IGJlIGF0IGxlYXN0IDIgY2hhcmFjdGVycyBsb25nLCB3aXRoIG5vICcrJyxcclxuICAgIC8vICctJywgJy4nLCB3aGl0ZXNwYWNlLCBvciByZXBlYXRlZCBjaGFyYWN0ZXIuXHJcbiAgICAvLyAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVokXydcclxuICAgIEFMUEhBQkVUID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicsXHJcbiAgICBhbHBoYWJldEhhc05vcm1hbERlY2ltYWxEaWdpdHMgPSB0cnVlO1xyXG5cclxuXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblxyXG4gIC8vIENPTlNUUlVDVE9SXHJcblxyXG5cclxuICAvKlxyXG4gICAqIFRoZSBCaWdOdW1iZXIgY29uc3RydWN0b3IgYW5kIGV4cG9ydGVkIGZ1bmN0aW9uLlxyXG4gICAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IGluc3RhbmNlIG9mIGEgQmlnTnVtYmVyIG9iamVjdC5cclxuICAgKlxyXG4gICAqIHYge251bWJlcnxzdHJpbmd8QmlnTnVtYmVyfSBBIG51bWVyaWMgdmFsdWUuXHJcbiAgICogW2JdIHtudW1iZXJ9IFRoZSBiYXNlIG9mIHYuIEludGVnZXIsIDIgdG8gQUxQSEFCRVQubGVuZ3RoIGluY2x1c2l2ZS5cclxuICAgKi9cclxuICBmdW5jdGlvbiBCaWdOdW1iZXIodiwgYikge1xyXG4gICAgdmFyIGFscGhhYmV0LCBjLCBjYXNlQ2hhbmdlZCwgZSwgaSwgaXNOdW0sIGxlbiwgc3RyLFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICAvLyBFbmFibGUgY29uc3RydWN0b3IgY2FsbCB3aXRob3V0IGBuZXdgLlxyXG4gICAgaWYgKCEoeCBpbnN0YW5jZW9mIEJpZ051bWJlcikpIHJldHVybiBuZXcgQmlnTnVtYmVyKHYsIGIpO1xyXG5cclxuICAgIGlmIChiID09IG51bGwpIHtcclxuXHJcbiAgICAgIGlmICh2ICYmIHYuX2lzQmlnTnVtYmVyID09PSB0cnVlKSB7XHJcbiAgICAgICAgeC5zID0gdi5zO1xyXG5cclxuICAgICAgICBpZiAoIXYuYyB8fCB2LmUgPiBNQVhfRVhQKSB7XHJcbiAgICAgICAgICB4LmMgPSB4LmUgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodi5lIDwgTUlOX0VYUCkge1xyXG4gICAgICAgICAgeC5jID0gW3guZSA9IDBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4LmUgPSB2LmU7XHJcbiAgICAgICAgICB4LmMgPSB2LmMuc2xpY2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKChpc051bSA9IHR5cGVvZiB2ID09ICdudW1iZXInKSAmJiB2ICogMCA9PSAwKSB7XHJcblxyXG4gICAgICAgIC8vIFVzZSBgMSAvIG5gIHRvIGhhbmRsZSBtaW51cyB6ZXJvIGFsc28uXHJcbiAgICAgICAgeC5zID0gMSAvIHYgPCAwID8gKHYgPSAtdiwgLTEpIDogMTtcclxuXHJcbiAgICAgICAgLy8gRmFzdCBwYXRoIGZvciBpbnRlZ2Vycywgd2hlcmUgbiA8IDIxNDc0ODM2NDggKDIqKjMxKS5cclxuICAgICAgICBpZiAodiA9PT0gfn52KSB7XHJcbiAgICAgICAgICBmb3IgKGUgPSAwLCBpID0gdjsgaSA+PSAxMDsgaSAvPSAxMCwgZSsrKTtcclxuXHJcbiAgICAgICAgICBpZiAoZSA+IE1BWF9FWFApIHtcclxuICAgICAgICAgICAgeC5jID0geC5lID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHguZSA9IGU7XHJcbiAgICAgICAgICAgIHguYyA9IFt2XTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdHIgPSBTdHJpbmcodik7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGlmICghaXNOdW1lcmljLnRlc3Qoc3RyID0gU3RyaW5nKHYpKSkgcmV0dXJuIHBhcnNlTnVtZXJpYyh4LCBzdHIsIGlzTnVtKTtcclxuXHJcbiAgICAgICAgeC5zID0gc3RyLmNoYXJDb2RlQXQoMCkgPT0gNDUgPyAoc3RyID0gc3RyLnNsaWNlKDEpLCAtMSkgOiAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBEZWNpbWFsIHBvaW50P1xyXG4gICAgICBpZiAoKGUgPSBzdHIuaW5kZXhPZignLicpKSA+IC0xKSBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuXHJcbiAgICAgIC8vIEV4cG9uZW50aWFsIGZvcm0/XHJcbiAgICAgIGlmICgoaSA9IHN0ci5zZWFyY2goL2UvaSkpID4gMCkge1xyXG5cclxuICAgICAgICAvLyBEZXRlcm1pbmUgZXhwb25lbnQuXHJcbiAgICAgICAgaWYgKGUgPCAwKSBlID0gaTtcclxuICAgICAgICBlICs9ICtzdHIuc2xpY2UoaSArIDEpO1xyXG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuXHJcbiAgICAgICAgLy8gSW50ZWdlci5cclxuICAgICAgICBlID0gc3RyLmxlbmd0aDtcclxuICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gQmFzZSB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7Yn0nXHJcbiAgICAgIGludENoZWNrKGIsIDIsIEFMUEhBQkVULmxlbmd0aCwgJ0Jhc2UnKTtcclxuXHJcbiAgICAgIC8vIEFsbG93IGV4cG9uZW50aWFsIG5vdGF0aW9uIHRvIGJlIHVzZWQgd2l0aCBiYXNlIDEwIGFyZ3VtZW50LCB3aGlsZVxyXG4gICAgICAvLyBhbHNvIHJvdW5kaW5nIHRvIERFQ0lNQUxfUExBQ0VTIGFzIHdpdGggb3RoZXIgYmFzZXMuXHJcbiAgICAgIGlmIChiID09IDEwICYmIGFscGhhYmV0SGFzTm9ybWFsRGVjaW1hbERpZ2l0cykge1xyXG4gICAgICAgIHggPSBuZXcgQmlnTnVtYmVyKHYpO1xyXG4gICAgICAgIHJldHVybiByb3VuZCh4LCBERUNJTUFMX1BMQUNFUyArIHguZSArIDEsIFJPVU5ESU5HX01PREUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzdHIgPSBTdHJpbmcodik7XHJcblxyXG4gICAgICBpZiAoaXNOdW0gPSB0eXBlb2YgdiA9PSAnbnVtYmVyJykge1xyXG5cclxuICAgICAgICAvLyBBdm9pZCBwb3RlbnRpYWwgaW50ZXJwcmV0YXRpb24gb2YgSW5maW5pdHkgYW5kIE5hTiBhcyBiYXNlIDQ0KyB2YWx1ZXMuXHJcbiAgICAgICAgaWYgKHYgKiAwICE9IDApIHJldHVybiBwYXJzZU51bWVyaWMoeCwgc3RyLCBpc051bSwgYik7XHJcblxyXG4gICAgICAgIHgucyA9IDEgLyB2IDwgMCA/IChzdHIgPSBzdHIuc2xpY2UoMSksIC0xKSA6IDE7XHJcblxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBOdW1iZXIgcHJpbWl0aXZlIGhhcyBtb3JlIHRoYW4gMTUgc2lnbmlmaWNhbnQgZGlnaXRzOiB7bn0nXHJcbiAgICAgICAgaWYgKEJpZ051bWJlci5ERUJVRyAmJiBzdHIucmVwbGFjZSgvXjBcXC4wKnxcXC4vLCAnJykubGVuZ3RoID4gMTUpIHtcclxuICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgKHRvb01hbnlEaWdpdHMgKyB2KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeC5zID0gc3RyLmNoYXJDb2RlQXQoMCkgPT09IDQ1ID8gKHN0ciA9IHN0ci5zbGljZSgxKSwgLTEpIDogMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgYWxwaGFiZXQgPSBBTFBIQUJFVC5zbGljZSgwLCBiKTtcclxuICAgICAgZSA9IGkgPSAwO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgdGhhdCBzdHIgaXMgYSB2YWxpZCBiYXNlIGIgbnVtYmVyLlxyXG4gICAgICAvLyBEb24ndCB1c2UgUmVnRXhwLCBzbyBhbHBoYWJldCBjYW4gY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMuXHJcbiAgICAgIGZvciAobGVuID0gc3RyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFscGhhYmV0LmluZGV4T2YoYyA9IHN0ci5jaGFyQXQoaSkpIDwgMCkge1xyXG4gICAgICAgICAgaWYgKGMgPT0gJy4nKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiAnLicgaXMgbm90IHRoZSBmaXJzdCBjaGFyYWN0ZXIgYW5kIGl0IGhhcyBub3QgYmUgZm91bmQgYmVmb3JlLlxyXG4gICAgICAgICAgICBpZiAoaSA+IGUpIHtcclxuICAgICAgICAgICAgICBlID0gbGVuO1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKCFjYXNlQ2hhbmdlZCkge1xyXG5cclxuICAgICAgICAgICAgLy8gQWxsb3cgZS5nLiBoZXhhZGVjaW1hbCAnRkYnIGFzIHdlbGwgYXMgJ2ZmJy5cclxuICAgICAgICAgICAgaWYgKHN0ciA9PSBzdHIudG9VcHBlckNhc2UoKSAmJiAoc3RyID0gc3RyLnRvTG93ZXJDYXNlKCkpIHx8XHJcbiAgICAgICAgICAgICAgICBzdHIgPT0gc3RyLnRvTG93ZXJDYXNlKCkgJiYgKHN0ciA9IHN0ci50b1VwcGVyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgIGNhc2VDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICBpID0gLTE7XHJcbiAgICAgICAgICAgICAgZSA9IDA7XHJcbiAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gcGFyc2VOdW1lcmljKHgsIFN0cmluZyh2KSwgaXNOdW0sIGIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUHJldmVudCBsYXRlciBjaGVjayBmb3IgbGVuZ3RoIG9uIGNvbnZlcnRlZCBudW1iZXIuXHJcbiAgICAgIGlzTnVtID0gZmFsc2U7XHJcbiAgICAgIHN0ciA9IGNvbnZlcnRCYXNlKHN0ciwgYiwgMTAsIHgucyk7XHJcblxyXG4gICAgICAvLyBEZWNpbWFsIHBvaW50P1xyXG4gICAgICBpZiAoKGUgPSBzdHIuaW5kZXhPZignLicpKSA+IC0xKSBzdHIgPSBzdHIucmVwbGFjZSgnLicsICcnKTtcclxuICAgICAgZWxzZSBlID0gc3RyLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgbGVhZGluZyB6ZXJvcy5cclxuICAgIGZvciAoaSA9IDA7IHN0ci5jaGFyQ29kZUF0KGkpID09PSA0ODsgaSsrKTtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGxlbiA9IHN0ci5sZW5ndGg7IHN0ci5jaGFyQ29kZUF0KC0tbGVuKSA9PT0gNDg7KTtcclxuXHJcbiAgICBpZiAoc3RyID0gc3RyLnNsaWNlKGksICsrbGVuKSkge1xyXG4gICAgICBsZW4gLT0gaTtcclxuXHJcbiAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBOdW1iZXIgcHJpbWl0aXZlIGhhcyBtb3JlIHRoYW4gMTUgc2lnbmlmaWNhbnQgZGlnaXRzOiB7bn0nXHJcbiAgICAgIGlmIChpc051bSAmJiBCaWdOdW1iZXIuREVCVUcgJiZcclxuICAgICAgICBsZW4gPiAxNSAmJiAodiA+IE1BWF9TQUZFX0lOVEVHRVIgfHwgdiAhPT0gbWF0aGZsb29yKHYpKSkge1xyXG4gICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAodG9vTWFueURpZ2l0cyArICh4LnMgKiB2KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICAvLyBPdmVyZmxvdz9cclxuICAgICAgaWYgKChlID0gZSAtIGkgLSAxKSA+IE1BWF9FWFApIHtcclxuXHJcbiAgICAgICAgLy8gSW5maW5pdHkuXHJcbiAgICAgICAgeC5jID0geC5lID0gbnVsbDtcclxuXHJcbiAgICAgIC8vIFVuZGVyZmxvdz9cclxuICAgICAgfSBlbHNlIGlmIChlIDwgTUlOX0VYUCkge1xyXG5cclxuICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgIHguYyA9IFt4LmUgPSAwXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4LmUgPSBlO1xyXG4gICAgICAgIHguYyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBUcmFuc2Zvcm0gYmFzZVxyXG5cclxuICAgICAgICAvLyBlIGlzIHRoZSBiYXNlIDEwIGV4cG9uZW50LlxyXG4gICAgICAgIC8vIGkgaXMgd2hlcmUgdG8gc2xpY2Ugc3RyIHRvIGdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgY29lZmZpY2llbnQgYXJyYXkuXHJcbiAgICAgICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcclxuICAgICAgICBpZiAoZSA8IDApIGkgKz0gTE9HX0JBU0U7ICAvLyBpIDwgMVxyXG5cclxuICAgICAgICBpZiAoaSA8IGxlbikge1xyXG4gICAgICAgICAgaWYgKGkpIHguYy5wdXNoKCtzdHIuc2xpY2UoMCwgaSkpO1xyXG5cclxuICAgICAgICAgIGZvciAobGVuIC09IExPR19CQVNFOyBpIDwgbGVuOykge1xyXG4gICAgICAgICAgICB4LmMucHVzaCgrc3RyLnNsaWNlKGksIGkgKz0gTE9HX0JBU0UpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpID0gTE9HX0JBU0UgLSAoc3RyID0gc3RyLnNsaWNlKGkpKS5sZW5ndGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGkgLT0gbGVuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICg7IGktLTsgc3RyICs9ICcwJyk7XHJcbiAgICAgICAgeC5jLnB1c2goK3N0cik7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAvLyBaZXJvLlxyXG4gICAgICB4LmMgPSBbeC5lID0gMF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gQ09OU1RSVUNUT1IgUFJPUEVSVElFU1xyXG5cclxuXHJcbiAgQmlnTnVtYmVyLmNsb25lID0gY2xvbmU7XHJcblxyXG4gIEJpZ051bWJlci5ST1VORF9VUCA9IDA7XHJcbiAgQmlnTnVtYmVyLlJPVU5EX0RPV04gPSAxO1xyXG4gIEJpZ051bWJlci5ST1VORF9DRUlMID0gMjtcclxuICBCaWdOdW1iZXIuUk9VTkRfRkxPT1IgPSAzO1xyXG4gIEJpZ051bWJlci5ST1VORF9IQUxGX1VQID0gNDtcclxuICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9ET1dOID0gNTtcclxuICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9FVkVOID0gNjtcclxuICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9DRUlMID0gNztcclxuICBCaWdOdW1iZXIuUk9VTkRfSEFMRl9GTE9PUiA9IDg7XHJcbiAgQmlnTnVtYmVyLkVVQ0xJRCA9IDk7XHJcblxyXG5cclxuICAvKlxyXG4gICAqIENvbmZpZ3VyZSBpbmZyZXF1ZW50bHktY2hhbmdpbmcgbGlicmFyeS13aWRlIHNldHRpbmdzLlxyXG4gICAqXHJcbiAgICogQWNjZXB0IGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgb3B0aW9uYWwgcHJvcGVydGllcyAoaWYgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgaXNcclxuICAgKiBhIG51bWJlciwgaXQgbXVzdCBiZSBhbiBpbnRlZ2VyIHdpdGhpbiB0aGUgaW5jbHVzaXZlIHJhbmdlIHN0YXRlZCk6XHJcbiAgICpcclxuICAgKiAgIERFQ0lNQUxfUExBQ0VTICAge251bWJlcn0gICAgICAgICAgIDAgdG8gTUFYXHJcbiAgICogICBST1VORElOR19NT0RFICAgIHtudW1iZXJ9ICAgICAgICAgICAwIHRvIDhcclxuICAgKiAgIEVYUE9ORU5USUFMX0FUICAge251bWJlcnxudW1iZXJbXX0gIC1NQVggdG8gTUFYICBvciAgWy1NQVggdG8gMCwgMCB0byBNQVhdXHJcbiAgICogICBSQU5HRSAgICAgICAgICAgIHtudW1iZXJ8bnVtYmVyW119ICAtTUFYIHRvIE1BWCAobm90IHplcm8pICBvciAgWy1NQVggdG8gLTEsIDEgdG8gTUFYXVxyXG4gICAqICAgQ1JZUFRPICAgICAgICAgICB7Ym9vbGVhbn0gICAgICAgICAgdHJ1ZSBvciBmYWxzZVxyXG4gICAqICAgTU9EVUxPX01PREUgICAgICB7bnVtYmVyfSAgICAgICAgICAgMCB0byA5XHJcbiAgICogICBQT1dfUFJFQ0lTSU9OICAgICAgIHtudW1iZXJ9ICAgICAgICAgICAwIHRvIE1BWFxyXG4gICAqICAgQUxQSEFCRVQgICAgICAgICB7c3RyaW5nfSAgICAgICAgICAgQSBzdHJpbmcgb2YgdHdvIG9yIG1vcmUgdW5pcXVlIGNoYXJhY3RlcnMgd2hpY2ggZG9lc1xyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90IGNvbnRhaW4gJy4nLlxyXG4gICAqICAgRk9STUFUICAgICAgICAgICB7b2JqZWN0fSAgICAgICAgICAgQW4gb2JqZWN0IHdpdGggc29tZSBvZiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICogICAgIHByZWZpeCAgICAgICAgICAgICAgICAge3N0cmluZ31cclxuICAgKiAgICAgZ3JvdXBTaXplICAgICAgICAgICAgICB7bnVtYmVyfVxyXG4gICAqICAgICBzZWNvbmRhcnlHcm91cFNpemUgICAgIHtudW1iZXJ9XHJcbiAgICogICAgIGdyb3VwU2VwYXJhdG9yICAgICAgICAge3N0cmluZ31cclxuICAgKiAgICAgZGVjaW1hbFNlcGFyYXRvciAgICAgICB7c3RyaW5nfVxyXG4gICAqICAgICBmcmFjdGlvbkdyb3VwU2l6ZSAgICAgIHtudW1iZXJ9XHJcbiAgICogICAgIGZyYWN0aW9uR3JvdXBTZXBhcmF0b3Ige3N0cmluZ31cclxuICAgKiAgICAgc3VmZml4ICAgICAgICAgICAgICAgICB7c3RyaW5nfVxyXG4gICAqXHJcbiAgICogKFRoZSB2YWx1ZXMgYXNzaWduZWQgdG8gdGhlIGFib3ZlIEZPUk1BVCBvYmplY3QgcHJvcGVydGllcyBhcmUgbm90IGNoZWNrZWQgZm9yIHZhbGlkaXR5LilcclxuICAgKlxyXG4gICAqIEUuZy5cclxuICAgKiBCaWdOdW1iZXIuY29uZmlnKHsgREVDSU1BTF9QTEFDRVMgOiAyMCwgUk9VTkRJTkdfTU9ERSA6IDQgfSlcclxuICAgKlxyXG4gICAqIElnbm9yZSBwcm9wZXJ0aWVzL3BhcmFtZXRlcnMgc2V0IHRvIG51bGwgb3IgdW5kZWZpbmVkLCBleGNlcHQgZm9yIEFMUEhBQkVULlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGFuIG9iamVjdCB3aXRoIHRoZSBwcm9wZXJ0aWVzIGN1cnJlbnQgdmFsdWVzLlxyXG4gICAqL1xyXG4gIEJpZ051bWJlci5jb25maWcgPSBCaWdOdW1iZXIuc2V0ID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgdmFyIHAsIHY7XHJcblxyXG4gICAgaWYgKG9iaiAhPSBudWxsKSB7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIG9iaiA9PSAnb2JqZWN0Jykge1xyXG5cclxuICAgICAgICAvLyBERUNJTUFMX1BMQUNFUyB7bnVtYmVyfSBJbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmUuXHJcbiAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIERFQ0lNQUxfUExBQ0VTIHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHt2fSdcclxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnREVDSU1BTF9QTEFDRVMnKSkge1xyXG4gICAgICAgICAgdiA9IG9ialtwXTtcclxuICAgICAgICAgIGludENoZWNrKHYsIDAsIE1BWCwgcCk7XHJcbiAgICAgICAgICBERUNJTUFMX1BMQUNFUyA9IHY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBST1VORElOR19NT0RFIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIFJPVU5ESU5HX01PREUge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge3Z9J1xyXG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdST1VORElOR19NT0RFJykpIHtcclxuICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICBpbnRDaGVjayh2LCAwLCA4LCBwKTtcclxuICAgICAgICAgIFJPVU5ESU5HX01PREUgPSB2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRVhQT05FTlRJQUxfQVQge251bWJlcnxudW1iZXJbXX1cclxuICAgICAgICAvLyBJbnRlZ2VyLCAtTUFYIHRvIE1BWCBpbmNsdXNpdmUgb3JcclxuICAgICAgICAvLyBbaW50ZWdlciAtTUFYIHRvIDAgaW5jbHVzaXZlLCAwIHRvIE1BWCBpbmNsdXNpdmVdLlxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBFWFBPTkVOVElBTF9BVCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7dn0nXHJcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ0VYUE9ORU5USUFMX0FUJykpIHtcclxuICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICBpZiAodiAmJiB2LnBvcCkge1xyXG4gICAgICAgICAgICBpbnRDaGVjayh2WzBdLCAtTUFYLCAwLCBwKTtcclxuICAgICAgICAgICAgaW50Q2hlY2sodlsxXSwgMCwgTUFYLCBwKTtcclxuICAgICAgICAgICAgVE9fRVhQX05FRyA9IHZbMF07XHJcbiAgICAgICAgICAgIFRPX0VYUF9QT1MgPSB2WzFdO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW50Q2hlY2sodiwgLU1BWCwgTUFYLCBwKTtcclxuICAgICAgICAgICAgVE9fRVhQX05FRyA9IC0oVE9fRVhQX1BPUyA9IHYgPCAwID8gLXYgOiB2KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJBTkdFIHtudW1iZXJ8bnVtYmVyW119IE5vbi16ZXJvIGludGVnZXIsIC1NQVggdG8gTUFYIGluY2x1c2l2ZSBvclxyXG4gICAgICAgIC8vIFtpbnRlZ2VyIC1NQVggdG8gLTEgaW5jbHVzaXZlLCBpbnRlZ2VyIDEgdG8gTUFYIGluY2x1c2l2ZV0uXHJcbiAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIFJBTkdFIHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZXxjYW5ub3QgYmUgemVyb306IHt2fSdcclxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnUkFOR0UnKSkge1xyXG4gICAgICAgICAgdiA9IG9ialtwXTtcclxuICAgICAgICAgIGlmICh2ICYmIHYucG9wKSB7XHJcbiAgICAgICAgICAgIGludENoZWNrKHZbMF0sIC1NQVgsIC0xLCBwKTtcclxuICAgICAgICAgICAgaW50Q2hlY2sodlsxXSwgMSwgTUFYLCBwKTtcclxuICAgICAgICAgICAgTUlOX0VYUCA9IHZbMF07XHJcbiAgICAgICAgICAgIE1BWF9FWFAgPSB2WzFdO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW50Q2hlY2sodiwgLU1BWCwgTUFYLCBwKTtcclxuICAgICAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgICBNSU5fRVhQID0gLShNQVhfRVhQID0gdiA8IDAgPyAtdiA6IHYpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgICAgIChiaWdudW1iZXJFcnJvciArIHAgKyAnIGNhbm5vdCBiZSB6ZXJvOiAnICsgdik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENSWVBUTyB7Ym9vbGVhbn0gdHJ1ZSBvciBmYWxzZS5cclxuICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gQ1JZUFRPIG5vdCB0cnVlIG9yIGZhbHNlOiB7dn0nXHJcbiAgICAgICAgLy8gJ1tCaWdOdW1iZXIgRXJyb3JdIGNyeXB0byB1bmF2YWlsYWJsZSdcclxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHAgPSAnQ1JZUFRPJykpIHtcclxuICAgICAgICAgIHYgPSBvYmpbcF07XHJcbiAgICAgICAgICBpZiAodiA9PT0gISF2KSB7XHJcbiAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjcnlwdG8gIT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvICYmXHJcbiAgICAgICAgICAgICAgIChjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzIHx8IGNyeXB0by5yYW5kb21CeXRlcykpIHtcclxuICAgICAgICAgICAgICAgIENSWVBUTyA9IHY7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIENSWVBUTyA9ICF2O1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnY3J5cHRvIHVuYXZhaWxhYmxlJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIENSWVBUTyA9IHY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyBwICsgJyBub3QgdHJ1ZSBvciBmYWxzZTogJyArIHYpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTU9EVUxPX01PREUge251bWJlcn0gSW50ZWdlciwgMCB0byA5IGluY2x1c2l2ZS5cclxuICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gTU9EVUxPX01PREUge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge3Z9J1xyXG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdNT0RVTE9fTU9ERScpKSB7XHJcbiAgICAgICAgICB2ID0gb2JqW3BdO1xyXG4gICAgICAgICAgaW50Q2hlY2sodiwgMCwgOSwgcCk7XHJcbiAgICAgICAgICBNT0RVTE9fTU9ERSA9IHY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQT1dfUFJFQ0lTSU9OIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gUE9XX1BSRUNJU0lPTiB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7dn0nXHJcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ1BPV19QUkVDSVNJT04nKSkge1xyXG4gICAgICAgICAgdiA9IG9ialtwXTtcclxuICAgICAgICAgIGludENoZWNrKHYsIDAsIE1BWCwgcCk7XHJcbiAgICAgICAgICBQT1dfUFJFQ0lTSU9OID0gdjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZPUk1BVCB7b2JqZWN0fVxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBGT1JNQVQgbm90IGFuIG9iamVjdDoge3Z9J1xyXG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCA9ICdGT1JNQVQnKSkge1xyXG4gICAgICAgICAgdiA9IG9ialtwXTtcclxuICAgICAgICAgIGlmICh0eXBlb2YgdiA9PSAnb2JqZWN0JykgRk9STUFUID0gdjtcclxuICAgICAgICAgIGVsc2UgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyBwICsgJyBub3QgYW4gb2JqZWN0OiAnICsgdik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBTFBIQUJFVCB7c3RyaW5nfVxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBBTFBIQUJFVCBpbnZhbGlkOiB7dn0nXHJcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwID0gJ0FMUEhBQkVUJykpIHtcclxuICAgICAgICAgIHYgPSBvYmpbcF07XHJcblxyXG4gICAgICAgICAgLy8gRGlzYWxsb3cgaWYgbGVzcyB0aGFuIHR3byBjaGFyYWN0ZXJzLFxyXG4gICAgICAgICAgLy8gb3IgaWYgaXQgY29udGFpbnMgJysnLCAnLScsICcuJywgd2hpdGVzcGFjZSwgb3IgYSByZXBlYXRlZCBjaGFyYWN0ZXIuXHJcbiAgICAgICAgICBpZiAodHlwZW9mIHYgPT0gJ3N0cmluZycgJiYgIS9eLj8kfFsrXFwtLlxcc118KC4pLipcXDEvLnRlc3QodikpIHtcclxuICAgICAgICAgICAgYWxwaGFiZXRIYXNOb3JtYWxEZWNpbWFsRGlnaXRzID0gdi5zbGljZSgwLCAxMCkgPT0gJzAxMjM0NTY3ODknO1xyXG4gICAgICAgICAgICBBTFBIQUJFVCA9IHY7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgcCArICcgaW52YWxpZDogJyArIHYpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBPYmplY3QgZXhwZWN0ZWQ6IHt2fSdcclxuICAgICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnT2JqZWN0IGV4cGVjdGVkOiAnICsgb2JqKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIERFQ0lNQUxfUExBQ0VTOiBERUNJTUFMX1BMQUNFUyxcclxuICAgICAgUk9VTkRJTkdfTU9ERTogUk9VTkRJTkdfTU9ERSxcclxuICAgICAgRVhQT05FTlRJQUxfQVQ6IFtUT19FWFBfTkVHLCBUT19FWFBfUE9TXSxcclxuICAgICAgUkFOR0U6IFtNSU5fRVhQLCBNQVhfRVhQXSxcclxuICAgICAgQ1JZUFRPOiBDUllQVE8sXHJcbiAgICAgIE1PRFVMT19NT0RFOiBNT0RVTE9fTU9ERSxcclxuICAgICAgUE9XX1BSRUNJU0lPTjogUE9XX1BSRUNJU0lPTixcclxuICAgICAgRk9STUFUOiBGT1JNQVQsXHJcbiAgICAgIEFMUEhBQkVUOiBBTFBIQUJFVFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB2IGlzIGEgQmlnTnVtYmVyIGluc3RhbmNlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqXHJcbiAgICogSWYgQmlnTnVtYmVyLkRFQlVHIGlzIHRydWUsIHRocm93IGlmIGEgQmlnTnVtYmVyIGluc3RhbmNlIGlzIG5vdCB3ZWxsLWZvcm1lZC5cclxuICAgKlxyXG4gICAqIHYge2FueX1cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBJbnZhbGlkIEJpZ051bWJlcjoge3Z9J1xyXG4gICAqL1xyXG4gIEJpZ051bWJlci5pc0JpZ051bWJlciA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICBpZiAoIXYgfHwgdi5faXNCaWdOdW1iZXIgIT09IHRydWUpIHJldHVybiBmYWxzZTtcclxuICAgIGlmICghQmlnTnVtYmVyLkRFQlVHKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICB2YXIgaSwgbixcclxuICAgICAgYyA9IHYuYyxcclxuICAgICAgZSA9IHYuZSxcclxuICAgICAgcyA9IHYucztcclxuXHJcbiAgICBvdXQ6IGlmICh7fS50b1N0cmluZy5jYWxsKGMpID09ICdbb2JqZWN0IEFycmF5XScpIHtcclxuXHJcbiAgICAgIGlmICgocyA9PT0gMSB8fCBzID09PSAtMSkgJiYgZSA+PSAtTUFYICYmIGUgPD0gTUFYICYmIGUgPT09IG1hdGhmbG9vcihlKSkge1xyXG5cclxuICAgICAgICAvLyBJZiB0aGUgZmlyc3QgZWxlbWVudCBpcyB6ZXJvLCB0aGUgQmlnTnVtYmVyIHZhbHVlIG11c3QgYmUgemVyby5cclxuICAgICAgICBpZiAoY1swXSA9PT0gMCkge1xyXG4gICAgICAgICAgaWYgKGUgPT09IDAgJiYgYy5sZW5ndGggPT09IDEpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgYnJlYWsgb3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIG51bWJlciBvZiBkaWdpdHMgdGhhdCBjWzBdIHNob3VsZCBoYXZlLCBiYXNlZCBvbiB0aGUgZXhwb25lbnQuXHJcbiAgICAgICAgaSA9IChlICsgMSkgJSBMT0dfQkFTRTtcclxuICAgICAgICBpZiAoaSA8IDEpIGkgKz0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSBudW1iZXIgb2YgZGlnaXRzIG9mIGNbMF0uXHJcbiAgICAgICAgLy9pZiAoTWF0aC5jZWlsKE1hdGgubG9nKGNbMF0gKyAxKSAvIE1hdGguTE4xMCkgPT0gaSkge1xyXG4gICAgICAgIGlmIChTdHJpbmcoY1swXSkubGVuZ3RoID09IGkpIHtcclxuXHJcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBuID0gY1tpXTtcclxuICAgICAgICAgICAgaWYgKG4gPCAwIHx8IG4gPj0gQkFTRSB8fCBuICE9PSBtYXRoZmxvb3IobikpIGJyZWFrIG91dDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBMYXN0IGVsZW1lbnQgY2Fubm90IGJlIHplcm8sIHVubGVzcyBpdCBpcyB0aGUgb25seSBlbGVtZW50LlxyXG4gICAgICAgICAgaWYgKG4gIT09IDApIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIC8vIEluZmluaXR5L05hTlxyXG4gICAgfSBlbHNlIGlmIChjID09PSBudWxsICYmIGUgPT09IG51bGwgJiYgKHMgPT09IG51bGwgfHwgcyA9PT0gMSB8fCBzID09PSAtMSkpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhyb3cgRXJyb3JcclxuICAgICAgKGJpZ251bWJlckVycm9yICsgJ0ludmFsaWQgQmlnTnVtYmVyOiAnICsgdik7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgbWF4aW11bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gICAqXHJcbiAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn1cclxuICAgKi9cclxuICBCaWdOdW1iZXIubWF4aW11bSA9IEJpZ051bWJlci5tYXggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gbWF4T3JNaW4oYXJndW1lbnRzLCAtMSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgbWluaW11bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gICAqXHJcbiAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn1cclxuICAgKi9cclxuICBCaWdOdW1iZXIubWluaW11bSA9IEJpZ051bWJlci5taW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gbWF4T3JNaW4oYXJndW1lbnRzLCAxKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdpdGggYSByYW5kb20gdmFsdWUgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuIDAgYW5kIGxlc3MgdGhhbiAxLFxyXG4gICAqIGFuZCB3aXRoIGRwLCBvciBERUNJTUFMX1BMQUNFUyBpZiBkcCBpcyBvbWl0dGVkLCBkZWNpbWFsIHBsYWNlcyAob3IgbGVzcyBpZiB0cmFpbGluZ1xyXG4gICAqIHplcm9zIGFyZSBwcm9kdWNlZCkuXHJcbiAgICpcclxuICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQge25vdCBhIHByaW1pdGl2ZSBudW1iZXJ8bm90IGFuIGludGVnZXJ8b3V0IG9mIHJhbmdlfToge2RwfSdcclxuICAgKiAnW0JpZ051bWJlciBFcnJvcl0gY3J5cHRvIHVuYXZhaWxhYmxlJ1xyXG4gICAqL1xyXG4gIEJpZ051bWJlci5yYW5kb20gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHBvdzJfNTMgPSAweDIwMDAwMDAwMDAwMDAwO1xyXG5cclxuICAgIC8vIFJldHVybiBhIDUzIGJpdCBpbnRlZ2VyIG4sIHdoZXJlIDAgPD0gbiA8IDkwMDcxOTkyNTQ3NDA5OTIuXHJcbiAgICAvLyBDaGVjayBpZiBNYXRoLnJhbmRvbSgpIHByb2R1Y2VzIG1vcmUgdGhhbiAzMiBiaXRzIG9mIHJhbmRvbW5lc3MuXHJcbiAgICAvLyBJZiBpdCBkb2VzLCBhc3N1bWUgYXQgbGVhc3QgNTMgYml0cyBhcmUgcHJvZHVjZWQsIG90aGVyd2lzZSBhc3N1bWUgYXQgbGVhc3QgMzAgYml0cy5cclxuICAgIC8vIDB4NDAwMDAwMDAgaXMgMl4zMCwgMHg4MDAwMDAgaXMgMl4yMywgMHgxZmZmZmYgaXMgMl4yMSAtIDEuXHJcbiAgICB2YXIgcmFuZG9tNTNiaXRJbnQgPSAoTWF0aC5yYW5kb20oKSAqIHBvdzJfNTMpICYgMHgxZmZmZmZcclxuICAgICA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG1hdGhmbG9vcihNYXRoLnJhbmRvbSgpICogcG93Ml81Myk7IH1cclxuICAgICA6IGZ1bmN0aW9uICgpIHsgcmV0dXJuICgoTWF0aC5yYW5kb20oKSAqIDB4NDAwMDAwMDAgfCAwKSAqIDB4ODAwMDAwKSArXHJcbiAgICAgICAoTWF0aC5yYW5kb20oKSAqIDB4ODAwMDAwIHwgMCk7IH07XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkcCkge1xyXG4gICAgICB2YXIgYSwgYiwgZSwgaywgdixcclxuICAgICAgICBpID0gMCxcclxuICAgICAgICBjID0gW10sXHJcbiAgICAgICAgcmFuZCA9IG5ldyBCaWdOdW1iZXIoT05FKTtcclxuXHJcbiAgICAgIGlmIChkcCA9PSBudWxsKSBkcCA9IERFQ0lNQUxfUExBQ0VTO1xyXG4gICAgICBlbHNlIGludENoZWNrKGRwLCAwLCBNQVgpO1xyXG5cclxuICAgICAgayA9IG1hdGhjZWlsKGRwIC8gTE9HX0JBU0UpO1xyXG5cclxuICAgICAgaWYgKENSWVBUTykge1xyXG5cclxuICAgICAgICAvLyBCcm93c2VycyBzdXBwb3J0aW5nIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuXHJcbiAgICAgICAgaWYgKGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcclxuXHJcbiAgICAgICAgICBhID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoayAqPSAyKSk7XHJcblxyXG4gICAgICAgICAgZm9yICg7IGkgPCBrOykge1xyXG5cclxuICAgICAgICAgICAgLy8gNTMgYml0czpcclxuICAgICAgICAgICAgLy8gKChNYXRoLnBvdygyLCAzMikgLSAxKSAqIE1hdGgucG93KDIsIDIxKSkudG9TdHJpbmcoMilcclxuICAgICAgICAgICAgLy8gMTExMTEgMTExMTExMTEgMTExMTExMTEgMTExMTExMTEgMTExMDAwMDAgMDAwMDAwMDAgMDAwMDAwMDBcclxuICAgICAgICAgICAgLy8gKChNYXRoLnBvdygyLCAzMikgLSAxKSA+Pj4gMTEpLnRvU3RyaW5nKDIpXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDExMTExIDExMTExMTExIDExMTExMTExXHJcbiAgICAgICAgICAgIC8vIDB4MjAwMDAgaXMgMl4yMS5cclxuICAgICAgICAgICAgdiA9IGFbaV0gKiAweDIwMDAwICsgKGFbaSArIDFdID4+PiAxMSk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZWplY3Rpb24gc2FtcGxpbmc6XHJcbiAgICAgICAgICAgIC8vIDAgPD0gdiA8IDkwMDcxOTkyNTQ3NDA5OTJcclxuICAgICAgICAgICAgLy8gUHJvYmFiaWxpdHkgdGhhdCB2ID49IDllMTUsIGlzXHJcbiAgICAgICAgICAgIC8vIDcxOTkyNTQ3NDA5OTIgLyA5MDA3MTk5MjU0NzQwOTkyIH49IDAuMDAwOCwgaS5lLiAxIGluIDEyNTFcclxuICAgICAgICAgICAgaWYgKHYgPj0gOWUxNSkge1xyXG4gICAgICAgICAgICAgIGIgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheSgyKSk7XHJcbiAgICAgICAgICAgICAgYVtpXSA9IGJbMF07XHJcbiAgICAgICAgICAgICAgYVtpICsgMV0gPSBiWzFdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAvLyAwIDw9IHYgPD0gODk5OTk5OTk5OTk5OTk5OVxyXG4gICAgICAgICAgICAgIC8vIDAgPD0gKHYgJSAxZTE0KSA8PSA5OTk5OTk5OTk5OTk5OVxyXG4gICAgICAgICAgICAgIGMucHVzaCh2ICUgMWUxNCk7XHJcbiAgICAgICAgICAgICAgaSArPSAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpID0gayAvIDI7XHJcblxyXG4gICAgICAgIC8vIE5vZGUuanMgc3VwcG9ydGluZyBjcnlwdG8ucmFuZG9tQnl0ZXMuXHJcbiAgICAgICAgfSBlbHNlIGlmIChjcnlwdG8ucmFuZG9tQnl0ZXMpIHtcclxuXHJcbiAgICAgICAgICAvLyBidWZmZXJcclxuICAgICAgICAgIGEgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoayAqPSA3KTtcclxuXHJcbiAgICAgICAgICBmb3IgKDsgaSA8IGs7KSB7XHJcblxyXG4gICAgICAgICAgICAvLyAweDEwMDAwMDAwMDAwMDAgaXMgMl40OCwgMHgxMDAwMDAwMDAwMCBpcyAyXjQwXHJcbiAgICAgICAgICAgIC8vIDB4MTAwMDAwMDAwIGlzIDJeMzIsIDB4MTAwMDAwMCBpcyAyXjI0XHJcbiAgICAgICAgICAgIC8vIDExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExIDExMTExMTExXHJcbiAgICAgICAgICAgIC8vIDAgPD0gdiA8IDkwMDcxOTkyNTQ3NDA5OTJcclxuICAgICAgICAgICAgdiA9ICgoYVtpXSAmIDMxKSAqIDB4MTAwMDAwMDAwMDAwMCkgKyAoYVtpICsgMV0gKiAweDEwMDAwMDAwMDAwKSArXHJcbiAgICAgICAgICAgICAgIChhW2kgKyAyXSAqIDB4MTAwMDAwMDAwKSArIChhW2kgKyAzXSAqIDB4MTAwMDAwMCkgK1xyXG4gICAgICAgICAgICAgICAoYVtpICsgNF0gPDwgMTYpICsgKGFbaSArIDVdIDw8IDgpICsgYVtpICsgNl07XHJcblxyXG4gICAgICAgICAgICBpZiAodiA+PSA5ZTE1KSB7XHJcbiAgICAgICAgICAgICAgY3J5cHRvLnJhbmRvbUJ5dGVzKDcpLmNvcHkoYSwgaSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIDAgPD0gKHYgJSAxZTE0KSA8PSA5OTk5OTk5OTk5OTk5OVxyXG4gICAgICAgICAgICAgIGMucHVzaCh2ICUgMWUxNCk7XHJcbiAgICAgICAgICAgICAgaSArPSA3O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpID0gayAvIDc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIENSWVBUTyA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnY3J5cHRvIHVuYXZhaWxhYmxlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBVc2UgTWF0aC5yYW5kb20uXHJcbiAgICAgIGlmICghQ1JZUFRPKSB7XHJcblxyXG4gICAgICAgIGZvciAoOyBpIDwgazspIHtcclxuICAgICAgICAgIHYgPSByYW5kb201M2JpdEludCgpO1xyXG4gICAgICAgICAgaWYgKHYgPCA5ZTE1KSBjW2krK10gPSB2ICUgMWUxNDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGsgPSBjWy0taV07XHJcbiAgICAgIGRwICU9IExPR19CQVNFO1xyXG5cclxuICAgICAgLy8gQ29udmVydCB0cmFpbGluZyBkaWdpdHMgdG8gemVyb3MgYWNjb3JkaW5nIHRvIGRwLlxyXG4gICAgICBpZiAoayAmJiBkcCkge1xyXG4gICAgICAgIHYgPSBQT1dTX1RFTltMT0dfQkFTRSAtIGRwXTtcclxuICAgICAgICBjW2ldID0gbWF0aGZsb29yKGsgLyB2KSAqIHY7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyBlbGVtZW50cyB3aGljaCBhcmUgemVyby5cclxuICAgICAgZm9yICg7IGNbaV0gPT09IDA7IGMucG9wKCksIGktLSk7XHJcblxyXG4gICAgICAvLyBaZXJvP1xyXG4gICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICBjID0gW2UgPSAwXTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgZWxlbWVudHMgd2hpY2ggYXJlIHplcm8gYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICAgICAgICBmb3IgKGUgPSAtMSA7IGNbMF0gPT09IDA7IGMuc3BsaWNlKDAsIDEpLCBlIC09IExPR19CQVNFKTtcclxuXHJcbiAgICAgICAgLy8gQ291bnQgdGhlIGRpZ2l0cyBvZiB0aGUgZmlyc3QgZWxlbWVudCBvZiBjIHRvIGRldGVybWluZSBsZWFkaW5nIHplcm9zLCBhbmQuLi5cclxuICAgICAgICBmb3IgKGkgPSAxLCB2ID0gY1swXTsgdiA+PSAxMDsgdiAvPSAxMCwgaSsrKTtcclxuXHJcbiAgICAgICAgLy8gYWRqdXN0IHRoZSBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICAgICAgICBpZiAoaSA8IExPR19CQVNFKSBlIC09IExPR19CQVNFIC0gaTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmFuZC5lID0gZTtcclxuICAgICAgcmFuZC5jID0gYztcclxuICAgICAgcmV0dXJuIHJhbmQ7XHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG5cclxuICAgLypcclxuICAgKiBSZXR1cm4gYSBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHN1bSBvZiB0aGUgYXJndW1lbnRzLlxyXG4gICAqXHJcbiAgICogYXJndW1lbnRzIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn1cclxuICAgKi9cclxuICBCaWdOdW1iZXIuc3VtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGkgPSAxLFxyXG4gICAgICBhcmdzID0gYXJndW1lbnRzLFxyXG4gICAgICBzdW0gPSBuZXcgQmlnTnVtYmVyKGFyZ3NbMF0pO1xyXG4gICAgZm9yICg7IGkgPCBhcmdzLmxlbmd0aDspIHN1bSA9IHN1bS5wbHVzKGFyZ3NbaSsrXSk7XHJcbiAgICByZXR1cm4gc3VtO1xyXG4gIH07XHJcblxyXG5cclxuICAvLyBQUklWQVRFIEZVTkNUSU9OU1xyXG5cclxuXHJcbiAgLy8gQ2FsbGVkIGJ5IEJpZ051bWJlciBhbmQgQmlnTnVtYmVyLnByb3RvdHlwZS50b1N0cmluZy5cclxuICBjb252ZXJ0QmFzZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZGVjaW1hbCA9ICcwMTIzNDU2Nzg5JztcclxuXHJcbiAgICAvKlxyXG4gICAgICogQ29udmVydCBzdHJpbmcgb2YgYmFzZUluIHRvIGFuIGFycmF5IG9mIG51bWJlcnMgb2YgYmFzZU91dC5cclxuICAgICAqIEVnLiB0b0Jhc2VPdXQoJzI1NScsIDEwLCAxNikgcmV0dXJucyBbMTUsIDE1XS5cclxuICAgICAqIEVnLiB0b0Jhc2VPdXQoJ2ZmJywgMTYsIDEwKSByZXR1cm5zIFsyLCA1LCA1XS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdG9CYXNlT3V0KHN0ciwgYmFzZUluLCBiYXNlT3V0LCBhbHBoYWJldCkge1xyXG4gICAgICB2YXIgaixcclxuICAgICAgICBhcnIgPSBbMF0sXHJcbiAgICAgICAgYXJyTCxcclxuICAgICAgICBpID0gMCxcclxuICAgICAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG5cclxuICAgICAgZm9yICg7IGkgPCBsZW47KSB7XHJcbiAgICAgICAgZm9yIChhcnJMID0gYXJyLmxlbmd0aDsgYXJyTC0tOyBhcnJbYXJyTF0gKj0gYmFzZUluKTtcclxuXHJcbiAgICAgICAgYXJyWzBdICs9IGFscGhhYmV0LmluZGV4T2Yoc3RyLmNoYXJBdChpKyspKTtcclxuXHJcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGFyci5sZW5ndGg7IGorKykge1xyXG5cclxuICAgICAgICAgIGlmIChhcnJbal0gPiBiYXNlT3V0IC0gMSkge1xyXG4gICAgICAgICAgICBpZiAoYXJyW2ogKyAxXSA9PSBudWxsKSBhcnJbaiArIDFdID0gMDtcclxuICAgICAgICAgICAgYXJyW2ogKyAxXSArPSBhcnJbal0gLyBiYXNlT3V0IHwgMDtcclxuICAgICAgICAgICAgYXJyW2pdICU9IGJhc2VPdXQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gYXJyLnJldmVyc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb252ZXJ0IGEgbnVtZXJpYyBzdHJpbmcgb2YgYmFzZUluIHRvIGEgbnVtZXJpYyBzdHJpbmcgb2YgYmFzZU91dC5cclxuICAgIC8vIElmIHRoZSBjYWxsZXIgaXMgdG9TdHJpbmcsIHdlIGFyZSBjb252ZXJ0aW5nIGZyb20gYmFzZSAxMCB0byBiYXNlT3V0LlxyXG4gICAgLy8gSWYgdGhlIGNhbGxlciBpcyBCaWdOdW1iZXIsIHdlIGFyZSBjb252ZXJ0aW5nIGZyb20gYmFzZUluIHRvIGJhc2UgMTAuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHN0ciwgYmFzZUluLCBiYXNlT3V0LCBzaWduLCBjYWxsZXJJc1RvU3RyaW5nKSB7XHJcbiAgICAgIHZhciBhbHBoYWJldCwgZCwgZSwgaywgciwgeCwgeGMsIHksXHJcbiAgICAgICAgaSA9IHN0ci5pbmRleE9mKCcuJyksXHJcbiAgICAgICAgZHAgPSBERUNJTUFMX1BMQUNFUyxcclxuICAgICAgICBybSA9IFJPVU5ESU5HX01PREU7XHJcblxyXG4gICAgICAvLyBOb24taW50ZWdlci5cclxuICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgIGsgPSBQT1dfUFJFQ0lTSU9OO1xyXG5cclxuICAgICAgICAvLyBVbmxpbWl0ZWQgcHJlY2lzaW9uLlxyXG4gICAgICAgIFBPV19QUkVDSVNJT04gPSAwO1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKGJhc2VJbik7XHJcbiAgICAgICAgeCA9IHkucG93KHN0ci5sZW5ndGggLSBpKTtcclxuICAgICAgICBQT1dfUFJFQ0lTSU9OID0gaztcclxuXHJcbiAgICAgICAgLy8gQ29udmVydCBzdHIgYXMgaWYgYW4gaW50ZWdlciwgdGhlbiByZXN0b3JlIHRoZSBmcmFjdGlvbiBwYXJ0IGJ5IGRpdmlkaW5nIHRoZVxyXG4gICAgICAgIC8vIHJlc3VsdCBieSBpdHMgYmFzZSByYWlzZWQgdG8gYSBwb3dlci5cclxuXHJcbiAgICAgICAgeS5jID0gdG9CYXNlT3V0KHRvRml4ZWRQb2ludChjb2VmZlRvU3RyaW5nKHguYyksIHguZSwgJzAnKSxcclxuICAgICAgICAgMTAsIGJhc2VPdXQsIGRlY2ltYWwpO1xyXG4gICAgICAgIHkuZSA9IHkuYy5sZW5ndGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENvbnZlcnQgdGhlIG51bWJlciBhcyBpbnRlZ2VyLlxyXG5cclxuICAgICAgeGMgPSB0b0Jhc2VPdXQoc3RyLCBiYXNlSW4sIGJhc2VPdXQsIGNhbGxlcklzVG9TdHJpbmdcclxuICAgICAgID8gKGFscGhhYmV0ID0gQUxQSEFCRVQsIGRlY2ltYWwpXHJcbiAgICAgICA6IChhbHBoYWJldCA9IGRlY2ltYWwsIEFMUEhBQkVUKSk7XHJcblxyXG4gICAgICAvLyB4YyBub3cgcmVwcmVzZW50cyBzdHIgYXMgYW4gaW50ZWdlciBhbmQgY29udmVydGVkIHRvIGJhc2VPdXQuIGUgaXMgdGhlIGV4cG9uZW50LlxyXG4gICAgICBlID0gayA9IHhjLmxlbmd0aDtcclxuXHJcbiAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgZm9yICg7IHhjWy0ta10gPT0gMDsgeGMucG9wKCkpO1xyXG5cclxuICAgICAgLy8gWmVybz9cclxuICAgICAgaWYgKCF4Y1swXSkgcmV0dXJuIGFscGhhYmV0LmNoYXJBdCgwKTtcclxuXHJcbiAgICAgIC8vIERvZXMgc3RyIHJlcHJlc2VudCBhbiBpbnRlZ2VyPyBJZiBzbywgbm8gbmVlZCBmb3IgdGhlIGRpdmlzaW9uLlxyXG4gICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAtLWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeC5jID0geGM7XHJcbiAgICAgICAgeC5lID0gZTtcclxuXHJcbiAgICAgICAgLy8gVGhlIHNpZ24gaXMgbmVlZGVkIGZvciBjb3JyZWN0IHJvdW5kaW5nLlxyXG4gICAgICAgIHgucyA9IHNpZ247XHJcbiAgICAgICAgeCA9IGRpdih4LCB5LCBkcCwgcm0sIGJhc2VPdXQpO1xyXG4gICAgICAgIHhjID0geC5jO1xyXG4gICAgICAgIHIgPSB4LnI7XHJcbiAgICAgICAgZSA9IHguZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8geGMgbm93IHJlcHJlc2VudHMgc3RyIGNvbnZlcnRlZCB0byBiYXNlT3V0LlxyXG5cclxuICAgICAgLy8gVEhlIGluZGV4IG9mIHRoZSByb3VuZGluZyBkaWdpdC5cclxuICAgICAgZCA9IGUgKyBkcCArIDE7XHJcblxyXG4gICAgICAvLyBUaGUgcm91bmRpbmcgZGlnaXQ6IHRoZSBkaWdpdCB0byB0aGUgcmlnaHQgb2YgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgIGkgPSB4Y1tkXTtcclxuXHJcbiAgICAgIC8vIExvb2sgYXQgdGhlIHJvdW5kaW5nIGRpZ2l0cyBhbmQgbW9kZSB0byBkZXRlcm1pbmUgd2hldGhlciB0byByb3VuZCB1cC5cclxuXHJcbiAgICAgIGsgPSBiYXNlT3V0IC8gMjtcclxuICAgICAgciA9IHIgfHwgZCA8IDAgfHwgeGNbZCArIDFdICE9IG51bGw7XHJcblxyXG4gICAgICByID0gcm0gPCA0ID8gKGkgIT0gbnVsbCB8fCByKSAmJiAocm0gPT0gMCB8fCBybSA9PSAoeC5zIDwgMCA/IDMgOiAyKSlcclxuICAgICAgICAgICAgOiBpID4gayB8fCBpID09IGsgJiYocm0gPT0gNCB8fCByIHx8IHJtID09IDYgJiYgeGNbZCAtIDFdICYgMSB8fFxyXG4gICAgICAgICAgICAgcm0gPT0gKHgucyA8IDAgPyA4IDogNykpO1xyXG5cclxuICAgICAgLy8gSWYgdGhlIGluZGV4IG9mIHRoZSByb3VuZGluZyBkaWdpdCBpcyBub3QgZ3JlYXRlciB0aGFuIHplcm8sIG9yIHhjIHJlcHJlc2VudHNcclxuICAgICAgLy8gemVybywgdGhlbiB0aGUgcmVzdWx0IG9mIHRoZSBiYXNlIGNvbnZlcnNpb24gaXMgemVybyBvciwgaWYgcm91bmRpbmcgdXAsIGEgdmFsdWVcclxuICAgICAgLy8gc3VjaCBhcyAwLjAwMDAxLlxyXG4gICAgICBpZiAoZCA8IDEgfHwgIXhjWzBdKSB7XHJcblxyXG4gICAgICAgIC8vIDFeLWRwIG9yIDBcclxuICAgICAgICBzdHIgPSByID8gdG9GaXhlZFBvaW50KGFscGhhYmV0LmNoYXJBdCgxKSwgLWRwLCBhbHBoYWJldC5jaGFyQXQoMCkpIDogYWxwaGFiZXQuY2hhckF0KDApO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvLyBUcnVuY2F0ZSB4YyB0byB0aGUgcmVxdWlyZWQgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAgICAgIHhjLmxlbmd0aCA9IGQ7XHJcblxyXG4gICAgICAgIC8vIFJvdW5kIHVwP1xyXG4gICAgICAgIGlmIChyKSB7XHJcblxyXG4gICAgICAgICAgLy8gUm91bmRpbmcgdXAgbWF5IG1lYW4gdGhlIHByZXZpb3VzIGRpZ2l0IGhhcyB0byBiZSByb3VuZGVkIHVwIGFuZCBzbyBvbi5cclxuICAgICAgICAgIGZvciAoLS1iYXNlT3V0OyArK3hjWy0tZF0gPiBiYXNlT3V0Oykge1xyXG4gICAgICAgICAgICB4Y1tkXSA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWQpIHtcclxuICAgICAgICAgICAgICArK2U7XHJcbiAgICAgICAgICAgICAgeGMgPSBbMV0uY29uY2F0KHhjKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICAgIGZvciAoayA9IHhjLmxlbmd0aDsgIXhjWy0ta107KTtcclxuXHJcbiAgICAgICAgLy8gRS5nLiBbNCwgMTEsIDE1XSBiZWNvbWVzIDRiZi5cclxuICAgICAgICBmb3IgKGkgPSAwLCBzdHIgPSAnJzsgaSA8PSBrOyBzdHIgKz0gYWxwaGFiZXQuY2hhckF0KHhjW2krK10pKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGxlYWRpbmcgemVyb3MsIGRlY2ltYWwgcG9pbnQgYW5kIHRyYWlsaW5nIHplcm9zIGFzIHJlcXVpcmVkLlxyXG4gICAgICAgIHN0ciA9IHRvRml4ZWRQb2ludChzdHIsIGUsIGFscGhhYmV0LmNoYXJBdCgwKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoZSBjYWxsZXIgd2lsbCBhZGQgdGhlIHNpZ24uXHJcbiAgICAgIHJldHVybiBzdHI7XHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG5cclxuICAvLyBQZXJmb3JtIGRpdmlzaW9uIGluIHRoZSBzcGVjaWZpZWQgYmFzZS4gQ2FsbGVkIGJ5IGRpdiBhbmQgY29udmVydEJhc2UuXHJcbiAgZGl2ID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBBc3N1bWUgbm9uLXplcm8geCBhbmQgay5cclxuICAgIGZ1bmN0aW9uIG11bHRpcGx5KHgsIGssIGJhc2UpIHtcclxuICAgICAgdmFyIG0sIHRlbXAsIHhsbywgeGhpLFxyXG4gICAgICAgIGNhcnJ5ID0gMCxcclxuICAgICAgICBpID0geC5sZW5ndGgsXHJcbiAgICAgICAga2xvID0gayAlIFNRUlRfQkFTRSxcclxuICAgICAgICBraGkgPSBrIC8gU1FSVF9CQVNFIHwgMDtcclxuXHJcbiAgICAgIGZvciAoeCA9IHguc2xpY2UoKTsgaS0tOykge1xyXG4gICAgICAgIHhsbyA9IHhbaV0gJSBTUVJUX0JBU0U7XHJcbiAgICAgICAgeGhpID0geFtpXSAvIFNRUlRfQkFTRSB8IDA7XHJcbiAgICAgICAgbSA9IGtoaSAqIHhsbyArIHhoaSAqIGtsbztcclxuICAgICAgICB0ZW1wID0ga2xvICogeGxvICsgKChtICUgU1FSVF9CQVNFKSAqIFNRUlRfQkFTRSkgKyBjYXJyeTtcclxuICAgICAgICBjYXJyeSA9ICh0ZW1wIC8gYmFzZSB8IDApICsgKG0gLyBTUVJUX0JBU0UgfCAwKSArIGtoaSAqIHhoaTtcclxuICAgICAgICB4W2ldID0gdGVtcCAlIGJhc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjYXJyeSkgeCA9IFtjYXJyeV0uY29uY2F0KHgpO1xyXG5cclxuICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29tcGFyZShhLCBiLCBhTCwgYkwpIHtcclxuICAgICAgdmFyIGksIGNtcDtcclxuXHJcbiAgICAgIGlmIChhTCAhPSBiTCkge1xyXG4gICAgICAgIGNtcCA9IGFMID4gYkwgPyAxIDogLTE7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGZvciAoaSA9IGNtcCA9IDA7IGkgPCBhTDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgaWYgKGFbaV0gIT0gYltpXSkge1xyXG4gICAgICAgICAgICBjbXAgPSBhW2ldID4gYltpXSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY21wO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHN1YnRyYWN0KGEsIGIsIGFMLCBiYXNlKSB7XHJcbiAgICAgIHZhciBpID0gMDtcclxuXHJcbiAgICAgIC8vIFN1YnRyYWN0IGIgZnJvbSBhLlxyXG4gICAgICBmb3IgKDsgYUwtLTspIHtcclxuICAgICAgICBhW2FMXSAtPSBpO1xyXG4gICAgICAgIGkgPSBhW2FMXSA8IGJbYUxdID8gMSA6IDA7XHJcbiAgICAgICAgYVthTF0gPSBpICogYmFzZSArIGFbYUxdIC0gYlthTF07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFJlbW92ZSBsZWFkaW5nIHplcm9zLlxyXG4gICAgICBmb3IgKDsgIWFbMF0gJiYgYS5sZW5ndGggPiAxOyBhLnNwbGljZSgwLCAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8geDogZGl2aWRlbmQsIHk6IGRpdmlzb3IuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHgsIHksIGRwLCBybSwgYmFzZSkge1xyXG4gICAgICB2YXIgY21wLCBlLCBpLCBtb3JlLCBuLCBwcm9kLCBwcm9kTCwgcSwgcWMsIHJlbSwgcmVtTCwgcmVtMCwgeGksIHhMLCB5YzAsXHJcbiAgICAgICAgeUwsIHl6LFxyXG4gICAgICAgIHMgPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgIHljID0geS5jO1xyXG5cclxuICAgICAgLy8gRWl0aGVyIE5hTiwgSW5maW5pdHkgb3IgMD9cclxuICAgICAgaWYgKCF4YyB8fCAheGNbMF0gfHwgIXljIHx8ICF5Y1swXSkge1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlcihcclxuXHJcbiAgICAgICAgIC8vIFJldHVybiBOYU4gaWYgZWl0aGVyIE5hTiwgb3IgYm90aCBJbmZpbml0eSBvciAwLlxyXG4gICAgICAgICAheC5zIHx8ICF5LnMgfHwgKHhjID8geWMgJiYgeGNbMF0gPT0geWNbMF0gOiAheWMpID8gTmFOIDpcclxuXHJcbiAgICAgICAgICAvLyBSZXR1cm4gwrEwIGlmIHggaXMgwrEwIG9yIHkgaXMgwrFJbmZpbml0eSwgb3IgcmV0dXJuIMKxSW5maW5pdHkgYXMgeSBpcyDCsTAuXHJcbiAgICAgICAgICB4YyAmJiB4Y1swXSA9PSAwIHx8ICF5YyA/IHMgKiAwIDogcyAvIDBcclxuICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHEgPSBuZXcgQmlnTnVtYmVyKHMpO1xyXG4gICAgICBxYyA9IHEuYyA9IFtdO1xyXG4gICAgICBlID0geC5lIC0geS5lO1xyXG4gICAgICBzID0gZHAgKyBlICsgMTtcclxuXHJcbiAgICAgIGlmICghYmFzZSkge1xyXG4gICAgICAgIGJhc2UgPSBCQVNFO1xyXG4gICAgICAgIGUgPSBiaXRGbG9vcih4LmUgLyBMT0dfQkFTRSkgLSBiaXRGbG9vcih5LmUgLyBMT0dfQkFTRSk7XHJcbiAgICAgICAgcyA9IHMgLyBMT0dfQkFTRSB8IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFJlc3VsdCBleHBvbmVudCBtYXkgYmUgb25lIGxlc3MgdGhlbiB0aGUgY3VycmVudCB2YWx1ZSBvZiBlLlxyXG4gICAgICAvLyBUaGUgY29lZmZpY2llbnRzIG9mIHRoZSBCaWdOdW1iZXJzIGZyb20gY29udmVydEJhc2UgbWF5IGhhdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgIGZvciAoaSA9IDA7IHljW2ldID09ICh4Y1tpXSB8fCAwKTsgaSsrKTtcclxuXHJcbiAgICAgIGlmICh5Y1tpXSA+ICh4Y1tpXSB8fCAwKSkgZS0tO1xyXG5cclxuICAgICAgaWYgKHMgPCAwKSB7XHJcbiAgICAgICAgcWMucHVzaCgxKTtcclxuICAgICAgICBtb3JlID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB4TCA9IHhjLmxlbmd0aDtcclxuICAgICAgICB5TCA9IHljLmxlbmd0aDtcclxuICAgICAgICBpID0gMDtcclxuICAgICAgICBzICs9IDI7XHJcblxyXG4gICAgICAgIC8vIE5vcm1hbGlzZSB4YyBhbmQgeWMgc28gaGlnaGVzdCBvcmRlciBkaWdpdCBvZiB5YyBpcyA+PSBiYXNlIC8gMi5cclxuXHJcbiAgICAgICAgbiA9IG1hdGhmbG9vcihiYXNlIC8gKHljWzBdICsgMSkpO1xyXG5cclxuICAgICAgICAvLyBOb3QgbmVjZXNzYXJ5LCBidXQgdG8gaGFuZGxlIG9kZCBiYXNlcyB3aGVyZSB5Y1swXSA9PSAoYmFzZSAvIDIpIC0gMS5cclxuICAgICAgICAvLyBpZiAobiA+IDEgfHwgbisrID09IDEgJiYgeWNbMF0gPCBiYXNlIC8gMikge1xyXG4gICAgICAgIGlmIChuID4gMSkge1xyXG4gICAgICAgICAgeWMgPSBtdWx0aXBseSh5YywgbiwgYmFzZSk7XHJcbiAgICAgICAgICB4YyA9IG11bHRpcGx5KHhjLCBuLCBiYXNlKTtcclxuICAgICAgICAgIHlMID0geWMubGVuZ3RoO1xyXG4gICAgICAgICAgeEwgPSB4Yy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB4aSA9IHlMO1xyXG4gICAgICAgIHJlbSA9IHhjLnNsaWNlKDAsIHlMKTtcclxuICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLy8gQWRkIHplcm9zIHRvIG1ha2UgcmVtYWluZGVyIGFzIGxvbmcgYXMgZGl2aXNvci5cclxuICAgICAgICBmb3IgKDsgcmVtTCA8IHlMOyByZW1bcmVtTCsrXSA9IDApO1xyXG4gICAgICAgIHl6ID0geWMuc2xpY2UoKTtcclxuICAgICAgICB5eiA9IFswXS5jb25jYXQoeXopO1xyXG4gICAgICAgIHljMCA9IHljWzBdO1xyXG4gICAgICAgIGlmICh5Y1sxXSA+PSBiYXNlIC8gMikgeWMwKys7XHJcbiAgICAgICAgLy8gTm90IG5lY2Vzc2FyeSwgYnV0IHRvIHByZXZlbnQgdHJpYWwgZGlnaXQgbiA+IGJhc2UsIHdoZW4gdXNpbmcgYmFzZSAzLlxyXG4gICAgICAgIC8vIGVsc2UgaWYgKGJhc2UgPT0gMyAmJiB5YzAgPT0gMSkgeWMwID0gMSArIDFlLTE1O1xyXG5cclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICBuID0gMDtcclxuXHJcbiAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgIGNtcCA9IGNvbXBhcmUoeWMsIHJlbSwgeUwsIHJlbUwpO1xyXG5cclxuICAgICAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIuXHJcbiAgICAgICAgICBpZiAoY21wIDwgMCkge1xyXG5cclxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRyaWFsIGRpZ2l0LCBuLlxyXG5cclxuICAgICAgICAgICAgcmVtMCA9IHJlbVswXTtcclxuICAgICAgICAgICAgaWYgKHlMICE9IHJlbUwpIHJlbTAgPSByZW0wICogYmFzZSArIChyZW1bMV0gfHwgMCk7XHJcblxyXG4gICAgICAgICAgICAvLyBuIGlzIGhvdyBtYW55IHRpbWVzIHRoZSBkaXZpc29yIGdvZXMgaW50byB0aGUgY3VycmVudCByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIG4gPSBtYXRoZmxvb3IocmVtMCAvIHljMCk7XHJcblxyXG4gICAgICAgICAgICAvLyAgQWxnb3JpdGhtOlxyXG4gICAgICAgICAgICAvLyAgcHJvZHVjdCA9IGRpdmlzb3IgbXVsdGlwbGllZCBieSB0cmlhbCBkaWdpdCAobikuXHJcbiAgICAgICAgICAgIC8vICBDb21wYXJlIHByb2R1Y3QgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgLy8gIElmIHByb2R1Y3QgaXMgZ3JlYXRlciB0aGFuIHJlbWFpbmRlcjpcclxuICAgICAgICAgICAgLy8gICAgU3VidHJhY3QgZGl2aXNvciBmcm9tIHByb2R1Y3QsIGRlY3JlbWVudCB0cmlhbCBkaWdpdC5cclxuICAgICAgICAgICAgLy8gIFN1YnRyYWN0IHByb2R1Y3QgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIC8vICBJZiBwcm9kdWN0IHdhcyBsZXNzIHRoYW4gcmVtYWluZGVyIGF0IHRoZSBsYXN0IGNvbXBhcmU6XHJcbiAgICAgICAgICAgIC8vICAgIENvbXBhcmUgbmV3IHJlbWFpbmRlciBhbmQgZGl2aXNvci5cclxuICAgICAgICAgICAgLy8gICAgSWYgcmVtYWluZGVyIGlzIGdyZWF0ZXIgdGhhbiBkaXZpc29yOlxyXG4gICAgICAgICAgICAvLyAgICAgIFN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIsIGluY3JlbWVudCB0cmlhbCBkaWdpdC5cclxuXHJcbiAgICAgICAgICAgIGlmIChuID4gMSkge1xyXG5cclxuICAgICAgICAgICAgICAvLyBuIG1heSBiZSA+IGJhc2Ugb25seSB3aGVuIGJhc2UgaXMgMy5cclxuICAgICAgICAgICAgICBpZiAobiA+PSBiYXNlKSBuID0gYmFzZSAtIDE7XHJcblxyXG4gICAgICAgICAgICAgIC8vIHByb2R1Y3QgPSBkaXZpc29yICogdHJpYWwgZGlnaXQuXHJcbiAgICAgICAgICAgICAgcHJvZCA9IG11bHRpcGx5KHljLCBuLCBiYXNlKTtcclxuICAgICAgICAgICAgICBwcm9kTCA9IHByb2QubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAvLyBDb21wYXJlIHByb2R1Y3QgYW5kIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAvLyBJZiBwcm9kdWN0ID4gcmVtYWluZGVyIHRoZW4gdHJpYWwgZGlnaXQgbiB0b28gaGlnaC5cclxuICAgICAgICAgICAgICAvLyBuIGlzIDEgdG9vIGhpZ2ggYWJvdXQgNSUgb2YgdGhlIHRpbWUsIGFuZCBpcyBub3Qga25vd24gdG8gaGF2ZVxyXG4gICAgICAgICAgICAgIC8vIGV2ZXIgYmVlbiBtb3JlIHRoYW4gMSB0b28gaGlnaC5cclxuICAgICAgICAgICAgICB3aGlsZSAoY29tcGFyZShwcm9kLCByZW0sIHByb2RMLCByZW1MKSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBuLS07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgZGl2aXNvciBmcm9tIHByb2R1Y3QuXHJcbiAgICAgICAgICAgICAgICBzdWJ0cmFjdChwcm9kLCB5TCA8IHByb2RMID8geXogOiB5YywgcHJvZEwsIGJhc2UpO1xyXG4gICAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGNtcCA9IDE7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAvLyBuIGlzIDAgb3IgMSwgY21wIGlzIC0xLlxyXG4gICAgICAgICAgICAgIC8vIElmIG4gaXMgMCwgdGhlcmUgaXMgbm8gbmVlZCB0byBjb21wYXJlIHljIGFuZCByZW0gYWdhaW4gYmVsb3csXHJcbiAgICAgICAgICAgICAgLy8gc28gY2hhbmdlIGNtcCB0byAxIHRvIGF2b2lkIGl0LlxyXG4gICAgICAgICAgICAgIC8vIElmIG4gaXMgMSwgbGVhdmUgY21wIGFzIC0xLCBzbyB5YyBhbmQgcmVtIGFyZSBjb21wYXJlZCBhZ2Fpbi5cclxuICAgICAgICAgICAgICBpZiAobiA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZGl2aXNvciA8IHJlbWFpbmRlciwgc28gbiBtdXN0IGJlIGF0IGxlYXN0IDEuXHJcbiAgICAgICAgICAgICAgICBjbXAgPSBuID0gMTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIHByb2R1Y3QgPSBkaXZpc29yXHJcbiAgICAgICAgICAgICAgcHJvZCA9IHljLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgcHJvZEwgPSBwcm9kLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHByb2RMIDwgcmVtTCkgcHJvZCA9IFswXS5jb25jYXQocHJvZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCBwcm9kdWN0IGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBzdWJ0cmFjdChyZW0sIHByb2QsIHJlbUwsIGJhc2UpO1xyXG4gICAgICAgICAgICByZW1MID0gcmVtLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAvLyBJZiBwcm9kdWN0IHdhcyA8IHJlbWFpbmRlci5cclxuICAgICAgICAgICAgaWYgKGNtcCA9PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIG5ldyByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgLy8gSWYgZGl2aXNvciA8IG5ldyByZW1haW5kZXIsIHN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgICAgLy8gVHJpYWwgZGlnaXQgbiB0b28gbG93LlxyXG4gICAgICAgICAgICAgIC8vIG4gaXMgMSB0b28gbG93IGFib3V0IDUlIG9mIHRoZSB0aW1lLCBhbmQgdmVyeSByYXJlbHkgMiB0b28gbG93LlxyXG4gICAgICAgICAgICAgIHdoaWxlIChjb21wYXJlKHljLCByZW0sIHlMLCByZW1MKSA8IDEpIHtcclxuICAgICAgICAgICAgICAgIG4rKztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCBkaXZpc29yIGZyb20gcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgc3VidHJhY3QocmVtLCB5TCA8IHJlbUwgPyB5eiA6IHljLCByZW1MLCBiYXNlKTtcclxuICAgICAgICAgICAgICAgIHJlbUwgPSByZW0ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChjbXAgPT09IDApIHtcclxuICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICByZW0gPSBbMF07XHJcbiAgICAgICAgICB9IC8vIGVsc2UgY21wID09PSAxIGFuZCBuIHdpbGwgYmUgMFxyXG5cclxuICAgICAgICAgIC8vIEFkZCB0aGUgbmV4dCBkaWdpdCwgbiwgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgIHFjW2krK10gPSBuO1xyXG5cclxuICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcmVtYWluZGVyLlxyXG4gICAgICAgICAgaWYgKHJlbVswXSkge1xyXG4gICAgICAgICAgICByZW1bcmVtTCsrXSA9IHhjW3hpXSB8fCAwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVtID0gW3hjW3hpXV07XHJcbiAgICAgICAgICAgIHJlbUwgPSAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gd2hpbGUgKCh4aSsrIDwgeEwgfHwgcmVtWzBdICE9IG51bGwpICYmIHMtLSk7XHJcblxyXG4gICAgICAgIG1vcmUgPSByZW1bMF0gIT0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gTGVhZGluZyB6ZXJvP1xyXG4gICAgICAgIGlmICghcWNbMF0pIHFjLnNwbGljZSgwLCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGJhc2UgPT0gQkFTRSkge1xyXG5cclxuICAgICAgICAvLyBUbyBjYWxjdWxhdGUgcS5lLCBmaXJzdCBnZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgcWNbMF0uXHJcbiAgICAgICAgZm9yIChpID0gMSwgcyA9IHFjWzBdOyBzID49IDEwOyBzIC89IDEwLCBpKyspO1xyXG5cclxuICAgICAgICByb3VuZChxLCBkcCArIChxLmUgPSBpICsgZSAqIExPR19CQVNFIC0gMSkgKyAxLCBybSwgbW9yZSk7XHJcblxyXG4gICAgICAvLyBDYWxsZXIgaXMgY29udmVydEJhc2UuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcS5lID0gZTtcclxuICAgICAgICBxLnIgPSArbW9yZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHE7XHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIEJpZ051bWJlciBuIGluIGZpeGVkLXBvaW50IG9yIGV4cG9uZW50aWFsXHJcbiAgICogbm90YXRpb24gcm91bmRlZCB0byB0aGUgc3BlY2lmaWVkIGRlY2ltYWwgcGxhY2VzIG9yIHNpZ25pZmljYW50IGRpZ2l0cy5cclxuICAgKlxyXG4gICAqIG46IGEgQmlnTnVtYmVyLlxyXG4gICAqIGk6IHRoZSBpbmRleCBvZiB0aGUgbGFzdCBkaWdpdCByZXF1aXJlZCAoaS5lLiB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cCkuXHJcbiAgICogcm06IHRoZSByb3VuZGluZyBtb2RlLlxyXG4gICAqIGlkOiAxICh0b0V4cG9uZW50aWFsKSBvciAyICh0b1ByZWNpc2lvbikuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZm9ybWF0KG4sIGksIHJtLCBpZCkge1xyXG4gICAgdmFyIGMwLCBlLCBuZSwgbGVuLCBzdHI7XHJcblxyXG4gICAgaWYgKHJtID09IG51bGwpIHJtID0gUk9VTkRJTkdfTU9ERTtcclxuICAgIGVsc2UgaW50Q2hlY2socm0sIDAsIDgpO1xyXG5cclxuICAgIGlmICghbi5jKSByZXR1cm4gbi50b1N0cmluZygpO1xyXG5cclxuICAgIGMwID0gbi5jWzBdO1xyXG4gICAgbmUgPSBuLmU7XHJcblxyXG4gICAgaWYgKGkgPT0gbnVsbCkge1xyXG4gICAgICBzdHIgPSBjb2VmZlRvU3RyaW5nKG4uYyk7XHJcbiAgICAgIHN0ciA9IGlkID09IDEgfHwgaWQgPT0gMiAmJiAobmUgPD0gVE9fRVhQX05FRyB8fCBuZSA+PSBUT19FWFBfUE9TKVxyXG4gICAgICAgPyB0b0V4cG9uZW50aWFsKHN0ciwgbmUpXHJcbiAgICAgICA6IHRvRml4ZWRQb2ludChzdHIsIG5lLCAnMCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbiA9IHJvdW5kKG5ldyBCaWdOdW1iZXIobiksIGksIHJtKTtcclxuXHJcbiAgICAgIC8vIG4uZSBtYXkgaGF2ZSBjaGFuZ2VkIGlmIHRoZSB2YWx1ZSB3YXMgcm91bmRlZCB1cC5cclxuICAgICAgZSA9IG4uZTtcclxuXHJcbiAgICAgIHN0ciA9IGNvZWZmVG9TdHJpbmcobi5jKTtcclxuICAgICAgbGVuID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgICAgIC8vIHRvUHJlY2lzaW9uIHJldHVybnMgZXhwb25lbnRpYWwgbm90YXRpb24gaWYgdGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHNcclxuICAgICAgLy8gc3BlY2lmaWVkIGlzIGxlc3MgdGhhbiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBpbnRlZ2VyXHJcbiAgICAgIC8vIHBhcnQgb2YgdGhlIHZhbHVlIGluIGZpeGVkLXBvaW50IG5vdGF0aW9uLlxyXG5cclxuICAgICAgLy8gRXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAgIGlmIChpZCA9PSAxIHx8IGlkID09IDIgJiYgKGkgPD0gZSB8fCBlIDw9IFRPX0VYUF9ORUcpKSB7XHJcblxyXG4gICAgICAgIC8vIEFwcGVuZCB6ZXJvcz9cclxuICAgICAgICBmb3IgKDsgbGVuIDwgaTsgc3RyICs9ICcwJywgbGVuKyspO1xyXG4gICAgICAgIHN0ciA9IHRvRXhwb25lbnRpYWwoc3RyLCBlKTtcclxuXHJcbiAgICAgIC8vIEZpeGVkLXBvaW50IG5vdGF0aW9uLlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGkgLT0gbmU7XHJcbiAgICAgICAgc3RyID0gdG9GaXhlZFBvaW50KHN0ciwgZSwgJzAnKTtcclxuXHJcbiAgICAgICAgLy8gQXBwZW5kIHplcm9zP1xyXG4gICAgICAgIGlmIChlICsgMSA+IGxlbikge1xyXG4gICAgICAgICAgaWYgKC0taSA+IDApIGZvciAoc3RyICs9ICcuJzsgaS0tOyBzdHIgKz0gJzAnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaSArPSBlIC0gbGVuO1xyXG4gICAgICAgICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICAgIGlmIChlICsgMSA9PSBsZW4pIHN0ciArPSAnLic7XHJcbiAgICAgICAgICAgIGZvciAoOyBpLS07IHN0ciArPSAnMCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuLnMgPCAwICYmIGMwID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIEhhbmRsZSBCaWdOdW1iZXIubWF4IGFuZCBCaWdOdW1iZXIubWluLlxyXG4gIC8vIElmIGFueSBudW1iZXIgaXMgTmFOLCByZXR1cm4gTmFOLlxyXG4gIGZ1bmN0aW9uIG1heE9yTWluKGFyZ3MsIG4pIHtcclxuICAgIHZhciBrLCB5LFxyXG4gICAgICBpID0gMSxcclxuICAgICAgeCA9IG5ldyBCaWdOdW1iZXIoYXJnc1swXSk7XHJcblxyXG4gICAgZm9yICg7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHkgPSBuZXcgQmlnTnVtYmVyKGFyZ3NbaV0pO1xyXG4gICAgICBpZiAoIXkucyB8fCAoayA9IGNvbXBhcmUoeCwgeSkpID09PSBuIHx8IGsgPT09IDAgJiYgeC5zID09PSBuKSB7XHJcbiAgICAgICAgeCA9IHk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFN0cmlwIHRyYWlsaW5nIHplcm9zLCBjYWxjdWxhdGUgYmFzZSAxMCBleHBvbmVudCBhbmQgY2hlY2sgYWdhaW5zdCBNSU5fRVhQIGFuZCBNQVhfRVhQLlxyXG4gICAqIENhbGxlZCBieSBtaW51cywgcGx1cyBhbmQgdGltZXMuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gbm9ybWFsaXNlKG4sIGMsIGUpIHtcclxuICAgIHZhciBpID0gMSxcclxuICAgICAgaiA9IGMubGVuZ3RoO1xyXG5cclxuICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKDsgIWNbLS1qXTsgYy5wb3AoKSk7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBiYXNlIDEwIGV4cG9uZW50LiBGaXJzdCBnZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgY1swXS5cclxuICAgIGZvciAoaiA9IGNbMF07IGogPj0gMTA7IGogLz0gMTAsIGkrKyk7XHJcblxyXG4gICAgLy8gT3ZlcmZsb3c/XHJcbiAgICBpZiAoKGUgPSBpICsgZSAqIExPR19CQVNFIC0gMSkgPiBNQVhfRVhQKSB7XHJcblxyXG4gICAgICAvLyBJbmZpbml0eS5cclxuICAgICAgbi5jID0gbi5lID0gbnVsbDtcclxuXHJcbiAgICAvLyBVbmRlcmZsb3c/XHJcbiAgICB9IGVsc2UgaWYgKGUgPCBNSU5fRVhQKSB7XHJcblxyXG4gICAgICAvLyBaZXJvLlxyXG4gICAgICBuLmMgPSBbbi5lID0gMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuLmUgPSBlO1xyXG4gICAgICBuLmMgPSBjO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIEhhbmRsZSB2YWx1ZXMgdGhhdCBmYWlsIHRoZSB2YWxpZGl0eSB0ZXN0IGluIEJpZ051bWJlci5cclxuICBwYXJzZU51bWVyaWMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGJhc2VQcmVmaXggPSAvXigtPykwKFt4Ym9dKSg/PVxcd1tcXHcuXSokKS9pLFxyXG4gICAgICBkb3RBZnRlciA9IC9eKFteLl0rKVxcLiQvLFxyXG4gICAgICBkb3RCZWZvcmUgPSAvXlxcLihbXi5dKykkLyxcclxuICAgICAgaXNJbmZpbml0eU9yTmFOID0gL14tPyhJbmZpbml0eXxOYU4pJC8sXHJcbiAgICAgIHdoaXRlc3BhY2VPclBsdXMgPSAvXlxccypcXCsoPz1bXFx3Ll0pfF5cXHMrfFxccyskL2c7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh4LCBzdHIsIGlzTnVtLCBiKSB7XHJcbiAgICAgIHZhciBiYXNlLFxyXG4gICAgICAgIHMgPSBpc051bSA/IHN0ciA6IHN0ci5yZXBsYWNlKHdoaXRlc3BhY2VPclBsdXMsICcnKTtcclxuXHJcbiAgICAgIC8vIE5vIGV4Y2VwdGlvbiBvbiDCsUluZmluaXR5IG9yIE5hTi5cclxuICAgICAgaWYgKGlzSW5maW5pdHlPck5hTi50ZXN0KHMpKSB7XHJcbiAgICAgICAgeC5zID0gaXNOYU4ocykgPyBudWxsIDogcyA8IDAgPyAtMSA6IDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCFpc051bSkge1xyXG5cclxuICAgICAgICAgIC8vIGJhc2VQcmVmaXggPSAvXigtPykwKFt4Ym9dKSg/PVxcd1tcXHcuXSokKS9pXHJcbiAgICAgICAgICBzID0gcy5yZXBsYWNlKGJhc2VQcmVmaXgsIGZ1bmN0aW9uIChtLCBwMSwgcDIpIHtcclxuICAgICAgICAgICAgYmFzZSA9IChwMiA9IHAyLnRvTG93ZXJDYXNlKCkpID09ICd4JyA/IDE2IDogcDIgPT0gJ2InID8gMiA6IDg7XHJcbiAgICAgICAgICAgIHJldHVybiAhYiB8fCBiID09IGJhc2UgPyBwMSA6IG07XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAoYikge1xyXG4gICAgICAgICAgICBiYXNlID0gYjtcclxuXHJcbiAgICAgICAgICAgIC8vIEUuZy4gJzEuJyB0byAnMScsICcuMScgdG8gJzAuMSdcclxuICAgICAgICAgICAgcyA9IHMucmVwbGFjZShkb3RBZnRlciwgJyQxJykucmVwbGFjZShkb3RCZWZvcmUsICcwLiQxJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHN0ciAhPSBzKSByZXR1cm4gbmV3IEJpZ051bWJlcihzLCBiYXNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vICdbQmlnTnVtYmVyIEVycm9yXSBOb3QgYSBudW1iZXI6IHtufSdcclxuICAgICAgICAvLyAnW0JpZ051bWJlciBFcnJvcl0gTm90IGEgYmFzZSB7Yn0gbnVtYmVyOiB7bn0nXHJcbiAgICAgICAgaWYgKEJpZ051bWJlci5ERUJVRykge1xyXG4gICAgICAgICAgdGhyb3cgRXJyb3JcclxuICAgICAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ05vdCBhJyArIChiID8gJyBiYXNlICcgKyBiIDogJycpICsgJyBudW1iZXI6ICcgKyBzdHIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTmFOXHJcbiAgICAgICAgeC5zID0gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgeC5jID0geC5lID0gbnVsbDtcclxuICAgIH1cclxuICB9KSgpO1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSb3VuZCB4IHRvIHNkIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIHJtLiBDaGVjayBmb3Igb3Zlci91bmRlci1mbG93LlxyXG4gICAqIElmIHIgaXMgdHJ1dGh5LCBpdCBpcyBrbm93biB0aGF0IHRoZXJlIGFyZSBtb3JlIGRpZ2l0cyBhZnRlciB0aGUgcm91bmRpbmcgZGlnaXQuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcm91bmQoeCwgc2QsIHJtLCByKSB7XHJcbiAgICB2YXIgZCwgaSwgaiwgaywgbiwgbmksIHJkLFxyXG4gICAgICB4YyA9IHguYyxcclxuICAgICAgcG93czEwID0gUE9XU19URU47XHJcblxyXG4gICAgLy8gaWYgeCBpcyBub3QgSW5maW5pdHkgb3IgTmFOLi4uXHJcbiAgICBpZiAoeGMpIHtcclxuXHJcbiAgICAgIC8vIHJkIGlzIHRoZSByb3VuZGluZyBkaWdpdCwgaS5lLiB0aGUgZGlnaXQgYWZ0ZXIgdGhlIGRpZ2l0IHRoYXQgbWF5IGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgIC8vIG4gaXMgYSBiYXNlIDFlMTQgbnVtYmVyLCB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQgb2YgYXJyYXkgeC5jIGNvbnRhaW5pbmcgcmQuXHJcbiAgICAgIC8vIG5pIGlzIHRoZSBpbmRleCBvZiBuIHdpdGhpbiB4LmMuXHJcbiAgICAgIC8vIGQgaXMgdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygbi5cclxuICAgICAgLy8gaSBpcyB0aGUgaW5kZXggb2YgcmQgd2l0aGluIG4gaW5jbHVkaW5nIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgIC8vIGogaXMgdGhlIGFjdHVhbCBpbmRleCBvZiByZCB3aXRoaW4gbiAoaWYgPCAwLCByZCBpcyBhIGxlYWRpbmcgemVybykuXHJcbiAgICAgIG91dDoge1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2YgdGhlIGZpcnN0IGVsZW1lbnQgb2YgeGMuXHJcbiAgICAgICAgZm9yIChkID0gMSwgayA9IHhjWzBdOyBrID49IDEwOyBrIC89IDEwLCBkKyspO1xyXG4gICAgICAgIGkgPSBzZCAtIGQ7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZSByb3VuZGluZyBkaWdpdCBpcyBpbiB0aGUgZmlyc3QgZWxlbWVudCBvZiB4Yy4uLlxyXG4gICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgaSArPSBMT0dfQkFTRTtcclxuICAgICAgICAgIGogPSBzZDtcclxuICAgICAgICAgIG4gPSB4Y1tuaSA9IDBdO1xyXG5cclxuICAgICAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiBuLlxyXG4gICAgICAgICAgcmQgPSBtYXRoZmxvb3IobiAvIHBvd3MxMFtkIC0gaiAtIDFdICUgMTApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuaSA9IG1hdGhjZWlsKChpICsgMSkgLyBMT0dfQkFTRSk7XHJcblxyXG4gICAgICAgICAgaWYgKG5pID49IHhjLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHIpIHtcclxuXHJcbiAgICAgICAgICAgICAgLy8gTmVlZGVkIGJ5IHNxcnQuXHJcbiAgICAgICAgICAgICAgZm9yICg7IHhjLmxlbmd0aCA8PSBuaTsgeGMucHVzaCgwKSk7XHJcbiAgICAgICAgICAgICAgbiA9IHJkID0gMDtcclxuICAgICAgICAgICAgICBkID0gMTtcclxuICAgICAgICAgICAgICBpICU9IExPR19CQVNFO1xyXG4gICAgICAgICAgICAgIGogPSBpIC0gTE9HX0JBU0UgKyAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGJyZWFrIG91dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbiA9IGsgPSB4Y1tuaV07XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIG51bWJlciBvZiBkaWdpdHMgb2Ygbi5cclxuICAgICAgICAgICAgZm9yIChkID0gMTsgayA+PSAxMDsgayAvPSAxMCwgZCsrKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgaW5kZXggb2YgcmQgd2l0aGluIG4uXHJcbiAgICAgICAgICAgIGkgJT0gTE9HX0JBU0U7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGluZGV4IG9mIHJkIHdpdGhpbiBuLCBhZGp1c3RlZCBmb3IgbGVhZGluZyB6ZXJvcy5cclxuICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsZWFkaW5nIHplcm9zIG9mIG4gaXMgZ2l2ZW4gYnkgTE9HX0JBU0UgLSBkLlxyXG4gICAgICAgICAgICBqID0gaSAtIExPR19CQVNFICsgZDtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgcm91bmRpbmcgZGlnaXQgYXQgaW5kZXggaiBvZiBuLlxyXG4gICAgICAgICAgICByZCA9IGogPCAwID8gMCA6IG1hdGhmbG9vcihuIC8gcG93czEwW2QgLSBqIC0gMV0gJSAxMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByID0gciB8fCBzZCA8IDAgfHxcclxuXHJcbiAgICAgICAgLy8gQXJlIHRoZXJlIGFueSBub24temVybyBkaWdpdHMgYWZ0ZXIgdGhlIHJvdW5kaW5nIGRpZ2l0P1xyXG4gICAgICAgIC8vIFRoZSBleHByZXNzaW9uICBuICUgcG93czEwW2QgLSBqIC0gMV0gIHJldHVybnMgYWxsIGRpZ2l0cyBvZiBuIHRvIHRoZSByaWdodFxyXG4gICAgICAgIC8vIG9mIHRoZSBkaWdpdCBhdCBqLCBlLmcuIGlmIG4gaXMgOTA4NzE0IGFuZCBqIGlzIDIsIHRoZSBleHByZXNzaW9uIGdpdmVzIDcxNC5cclxuICAgICAgICAgeGNbbmkgKyAxXSAhPSBudWxsIHx8IChqIDwgMCA/IG4gOiBuICUgcG93czEwW2QgLSBqIC0gMV0pO1xyXG5cclxuICAgICAgICByID0gcm0gPCA0XHJcbiAgICAgICAgID8gKHJkIHx8IHIpICYmIChybSA9PSAwIHx8IHJtID09ICh4LnMgPCAwID8gMyA6IDIpKVxyXG4gICAgICAgICA6IHJkID4gNSB8fCByZCA9PSA1ICYmIChybSA9PSA0IHx8IHIgfHwgcm0gPT0gNiAmJlxyXG5cclxuICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGRpZ2l0IHRvIHRoZSBsZWZ0IG9mIHRoZSByb3VuZGluZyBkaWdpdCBpcyBvZGQuXHJcbiAgICAgICAgICAoKGkgPiAwID8gaiA+IDAgPyBuIC8gcG93czEwW2QgLSBqXSA6IDAgOiB4Y1tuaSAtIDFdKSAlIDEwKSAmIDEgfHxcclxuICAgICAgICAgICBybSA9PSAoeC5zIDwgMCA/IDggOiA3KSk7XHJcblxyXG4gICAgICAgIGlmIChzZCA8IDEgfHwgIXhjWzBdKSB7XHJcbiAgICAgICAgICB4Yy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAgIGlmIChyKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IHNkIHRvIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAgICAgICAgICBzZCAtPSB4LmUgKyAxO1xyXG5cclxuICAgICAgICAgICAgLy8gMSwgMC4xLCAwLjAxLCAwLjAwMSwgMC4wMDAxIGV0Yy5cclxuICAgICAgICAgICAgeGNbMF0gPSBwb3dzMTBbKExPR19CQVNFIC0gc2QgJSBMT0dfQkFTRSkgJSBMT0dfQkFTRV07XHJcbiAgICAgICAgICAgIHguZSA9IC1zZCB8fCAwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFplcm8uXHJcbiAgICAgICAgICAgIHhjWzBdID0geC5lID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4geDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSBleGNlc3MgZGlnaXRzLlxyXG4gICAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICAgIHhjLmxlbmd0aCA9IG5pO1xyXG4gICAgICAgICAgayA9IDE7XHJcbiAgICAgICAgICBuaS0tO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB4Yy5sZW5ndGggPSBuaSArIDE7XHJcbiAgICAgICAgICBrID0gcG93czEwW0xPR19CQVNFIC0gaV07XHJcblxyXG4gICAgICAgICAgLy8gRS5nLiA1NjcwMCBiZWNvbWVzIDU2MDAwIGlmIDcgaXMgdGhlIHJvdW5kaW5nIGRpZ2l0LlxyXG4gICAgICAgICAgLy8gaiA+IDAgbWVhbnMgaSA+IG51bWJlciBvZiBsZWFkaW5nIHplcm9zIG9mIG4uXHJcbiAgICAgICAgICB4Y1tuaV0gPSBqID4gMCA/IG1hdGhmbG9vcihuIC8gcG93czEwW2QgLSBqXSAlIHBvd3MxMFtqXSkgKiBrIDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJvdW5kIHVwP1xyXG4gICAgICAgIGlmIChyKSB7XHJcblxyXG4gICAgICAgICAgZm9yICg7IDspIHtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaWdpdCB0byBiZSByb3VuZGVkIHVwIGlzIGluIHRoZSBmaXJzdCBlbGVtZW50IG9mIHhjLi4uXHJcbiAgICAgICAgICAgIGlmIChuaSA9PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIGkgd2lsbCBiZSB0aGUgbGVuZ3RoIG9mIHhjWzBdIGJlZm9yZSBrIGlzIGFkZGVkLlxyXG4gICAgICAgICAgICAgIGZvciAoaSA9IDEsIGogPSB4Y1swXTsgaiA+PSAxMDsgaiAvPSAxMCwgaSsrKTtcclxuICAgICAgICAgICAgICBqID0geGNbMF0gKz0gaztcclxuICAgICAgICAgICAgICBmb3IgKGsgPSAxOyBqID49IDEwOyBqIC89IDEwLCBrKyspO1xyXG5cclxuICAgICAgICAgICAgICAvLyBpZiBpICE9IGsgdGhlIGxlbmd0aCBoYXMgaW5jcmVhc2VkLlxyXG4gICAgICAgICAgICAgIGlmIChpICE9IGspIHtcclxuICAgICAgICAgICAgICAgIHguZSsrO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhjWzBdID09IEJBU0UpIHhjWzBdID0gMTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHhjW25pXSArPSBrO1xyXG4gICAgICAgICAgICAgIGlmICh4Y1tuaV0gIT0gQkFTRSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgeGNbbmktLV0gPSAwO1xyXG4gICAgICAgICAgICAgIGsgPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgICAgZm9yIChpID0geGMubGVuZ3RoOyB4Y1stLWldID09PSAwOyB4Yy5wb3AoKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE92ZXJmbG93PyBJbmZpbml0eS5cclxuICAgICAgaWYgKHguZSA+IE1BWF9FWFApIHtcclxuICAgICAgICB4LmMgPSB4LmUgPSBudWxsO1xyXG5cclxuICAgICAgLy8gVW5kZXJmbG93PyBaZXJvLlxyXG4gICAgICB9IGVsc2UgaWYgKHguZSA8IE1JTl9FWFApIHtcclxuICAgICAgICB4LmMgPSBbeC5lID0gMF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geDtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiB2YWx1ZU9mKG4pIHtcclxuICAgIHZhciBzdHIsXHJcbiAgICAgIGUgPSBuLmU7XHJcblxyXG4gICAgaWYgKGUgPT09IG51bGwpIHJldHVybiBuLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgc3RyID0gY29lZmZUb1N0cmluZyhuLmMpO1xyXG5cclxuICAgIHN0ciA9IGUgPD0gVE9fRVhQX05FRyB8fCBlID49IFRPX0VYUF9QT1NcclxuICAgICAgPyB0b0V4cG9uZW50aWFsKHN0ciwgZSlcclxuICAgICAgOiB0b0ZpeGVkUG9pbnQoc3RyLCBlLCAnMCcpO1xyXG5cclxuICAgIHJldHVybiBuLnMgPCAwID8gJy0nICsgc3RyIDogc3RyO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIFBST1RPVFlQRS9JTlNUQU5DRSBNRVRIT0RTXHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIGFic29sdXRlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyLlxyXG4gICAqL1xyXG4gIFAuYWJzb2x1dGVWYWx1ZSA9IFAuYWJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHggPSBuZXcgQmlnTnVtYmVyKHRoaXMpO1xyXG4gICAgaWYgKHgucyA8IDApIHgucyA9IDE7XHJcbiAgICByZXR1cm4geDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm5cclxuICAgKiAgIDEgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUgb2YgQmlnTnVtYmVyKHksIGIpLFxyXG4gICAqICAgLTEgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgQmlnTnVtYmVyKHksIGIpLFxyXG4gICAqICAgMCBpZiB0aGV5IGhhdmUgdGhlIHNhbWUgdmFsdWUsXHJcbiAgICogICBvciBudWxsIGlmIHRoZSB2YWx1ZSBvZiBlaXRoZXIgaXMgTmFOLlxyXG4gICAqL1xyXG4gIFAuY29tcGFyZWRUbyA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICByZXR1cm4gY29tcGFyZSh0aGlzLCBuZXcgQmlnTnVtYmVyKHksIGIpKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBJZiBkcCBpcyB1bmRlZmluZWQgb3IgbnVsbCBvciB0cnVlIG9yIGZhbHNlLCByZXR1cm4gdGhlIG51bWJlciBvZiBkZWNpbWFsIHBsYWNlcyBvZiB0aGVcclxuICAgKiB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciwgb3IgbnVsbCBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgwrFJbmZpbml0eSBvciBOYU4uXHJcbiAgICpcclxuICAgKiBPdGhlcndpc2UsIGlmIGRwIGlzIGEgbnVtYmVyLCByZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzXHJcbiAgICogQmlnTnVtYmVyIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mIGRwIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0sIG9yXHJcbiAgICogUk9VTkRJTkdfTU9ERSBpZiBybSBpcyBvbWl0dGVkLlxyXG4gICAqXHJcbiAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlczogaW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7ZHB8cm19J1xyXG4gICAqL1xyXG4gIFAuZGVjaW1hbFBsYWNlcyA9IFAuZHAgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgICB2YXIgYywgbiwgdixcclxuICAgICAgeCA9IHRoaXM7XHJcblxyXG4gICAgaWYgKGRwICE9IG51bGwpIHtcclxuICAgICAgaW50Q2hlY2soZHAsIDAsIE1BWCk7XHJcbiAgICAgIGlmIChybSA9PSBudWxsKSBybSA9IFJPVU5ESU5HX01PREU7XHJcbiAgICAgIGVsc2UgaW50Q2hlY2socm0sIDAsIDgpO1xyXG5cclxuICAgICAgcmV0dXJuIHJvdW5kKG5ldyBCaWdOdW1iZXIoeCksIGRwICsgeC5lICsgMSwgcm0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghKGMgPSB4LmMpKSByZXR1cm4gbnVsbDtcclxuICAgIG4gPSAoKHYgPSBjLmxlbmd0aCAtIDEpIC0gYml0Rmxvb3IodGhpcy5lIC8gTE9HX0JBU0UpKSAqIExPR19CQVNFO1xyXG5cclxuICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2YgdHJhaWxpbmcgemVyb3Mgb2YgdGhlIGxhc3QgbnVtYmVyLlxyXG4gICAgaWYgKHYgPSBjW3ZdKSBmb3IgKDsgdiAlIDEwID09IDA7IHYgLz0gMTAsIG4tLSk7XHJcbiAgICBpZiAobiA8IDApIG4gPSAwO1xyXG5cclxuICAgIHJldHVybiBuO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqICBuIC8gMCA9IElcclxuICAgKiAgbiAvIE4gPSBOXHJcbiAgICogIG4gLyBJID0gMFxyXG4gICAqICAwIC8gbiA9IDBcclxuICAgKiAgMCAvIDAgPSBOXHJcbiAgICogIDAgLyBOID0gTlxyXG4gICAqICAwIC8gSSA9IDBcclxuICAgKiAgTiAvIG4gPSBOXHJcbiAgICogIE4gLyAwID0gTlxyXG4gICAqICBOIC8gTiA9IE5cclxuICAgKiAgTiAvIEkgPSBOXHJcbiAgICogIEkgLyBuID0gSVxyXG4gICAqICBJIC8gMCA9IElcclxuICAgKiAgSSAvIE4gPSBOXHJcbiAgICogIEkgLyBJID0gTlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgZGl2aWRlZCBieSB0aGUgdmFsdWUgb2ZcclxuICAgKiBCaWdOdW1iZXIoeSwgYiksIHJvdW5kZWQgYWNjb3JkaW5nIHRvIERFQ0lNQUxfUExBQ0VTIGFuZCBST1VORElOR19NT0RFLlxyXG4gICAqL1xyXG4gIFAuZGl2aWRlZEJ5ID0gUC5kaXYgPSBmdW5jdGlvbiAoeSwgYikge1xyXG4gICAgcmV0dXJuIGRpdih0aGlzLCBuZXcgQmlnTnVtYmVyKHksIGIpLCBERUNJTUFMX1BMQUNFUywgUk9VTkRJTkdfTU9ERSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgaW50ZWdlciBwYXJ0IG9mIGRpdmlkaW5nIHRoZSB2YWx1ZSBvZiB0aGlzXHJcbiAgICogQmlnTnVtYmVyIGJ5IHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYikuXHJcbiAgICovXHJcbiAgUC5kaXZpZGVkVG9JbnRlZ2VyQnkgPSBQLmlkaXYgPSBmdW5jdGlvbiAoeSwgYikge1xyXG4gICAgcmV0dXJuIGRpdih0aGlzLCBuZXcgQmlnTnVtYmVyKHksIGIpLCAwLCAxKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYSBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGV4cG9uZW50aWF0ZWQgYnkgbi5cclxuICAgKlxyXG4gICAqIElmIG0gaXMgcHJlc2VudCwgcmV0dXJuIHRoZSByZXN1bHQgbW9kdWxvIG0uXHJcbiAgICogSWYgbiBpcyBuZWdhdGl2ZSByb3VuZCBhY2NvcmRpbmcgdG8gREVDSU1BTF9QTEFDRVMgYW5kIFJPVU5ESU5HX01PREUuXHJcbiAgICogSWYgUE9XX1BSRUNJU0lPTiBpcyBub24temVybyBhbmQgbSBpcyBub3QgcHJlc2VudCwgcm91bmQgdG8gUE9XX1BSRUNJU0lPTiB1c2luZyBST1VORElOR19NT0RFLlxyXG4gICAqXHJcbiAgICogVGhlIG1vZHVsYXIgcG93ZXIgb3BlcmF0aW9uIHdvcmtzIGVmZmljaWVudGx5IHdoZW4geCwgbiwgYW5kIG0gYXJlIGludGVnZXJzLCBvdGhlcndpc2UgaXRcclxuICAgKiBpcyBlcXVpdmFsZW50IHRvIGNhbGN1bGF0aW5nIHguZXhwb25lbnRpYXRlZEJ5KG4pLm1vZHVsbyhtKSB3aXRoIGEgUE9XX1BSRUNJU0lPTiBvZiAwLlxyXG4gICAqXHJcbiAgICogbiB7bnVtYmVyfHN0cmluZ3xCaWdOdW1iZXJ9IFRoZSBleHBvbmVudC4gQW4gaW50ZWdlci5cclxuICAgKiBbbV0ge251bWJlcnxzdHJpbmd8QmlnTnVtYmVyfSBUaGUgbW9kdWx1cy5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBFeHBvbmVudCBub3QgYW4gaW50ZWdlcjoge259J1xyXG4gICAqL1xyXG4gIFAuZXhwb25lbnRpYXRlZEJ5ID0gUC5wb3cgPSBmdW5jdGlvbiAobiwgbSkge1xyXG4gICAgdmFyIGhhbGYsIGlzTW9kRXhwLCBpLCBrLCBtb3JlLCBuSXNCaWcsIG5Jc05lZywgbklzT2RkLCB5LFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICBuID0gbmV3IEJpZ051bWJlcihuKTtcclxuXHJcbiAgICAvLyBBbGxvdyBOYU4gYW5kIMKxSW5maW5pdHksIGJ1dCBub3Qgb3RoZXIgbm9uLWludGVnZXJzLlxyXG4gICAgaWYgKG4uYyAmJiAhbi5pc0ludGVnZXIoKSkge1xyXG4gICAgICB0aHJvdyBFcnJvclxyXG4gICAgICAgIChiaWdudW1iZXJFcnJvciArICdFeHBvbmVudCBub3QgYW4gaW50ZWdlcjogJyArIHZhbHVlT2YobikpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtICE9IG51bGwpIG0gPSBuZXcgQmlnTnVtYmVyKG0pO1xyXG5cclxuICAgIC8vIEV4cG9uZW50IG9mIE1BWF9TQUZFX0lOVEVHRVIgaXMgMTUuXHJcbiAgICBuSXNCaWcgPSBuLmUgPiAxNDtcclxuXHJcbiAgICAvLyBJZiB4IGlzIE5hTiwgwrFJbmZpbml0eSwgwrEwIG9yIMKxMSwgb3IgbiBpcyDCsUluZmluaXR5LCBOYU4gb3IgwrEwLlxyXG4gICAgaWYgKCF4LmMgfHwgIXguY1swXSB8fCB4LmNbMF0gPT0gMSAmJiAheC5lICYmIHguYy5sZW5ndGggPT0gMSB8fCAhbi5jIHx8ICFuLmNbMF0pIHtcclxuXHJcbiAgICAgIC8vIFRoZSBzaWduIG9mIHRoZSByZXN1bHQgb2YgcG93IHdoZW4geCBpcyBuZWdhdGl2ZSBkZXBlbmRzIG9uIHRoZSBldmVubmVzcyBvZiBuLlxyXG4gICAgICAvLyBJZiArbiBvdmVyZmxvd3MgdG8gwrFJbmZpbml0eSwgdGhlIGV2ZW5uZXNzIG9mIG4gd291bGQgYmUgbm90IGJlIGtub3duLlxyXG4gICAgICB5ID0gbmV3IEJpZ051bWJlcihNYXRoLnBvdygrdmFsdWVPZih4KSwgbklzQmlnID8gbi5zICogKDIgLSBpc09kZChuKSkgOiArdmFsdWVPZihuKSkpO1xyXG4gICAgICByZXR1cm4gbSA/IHkubW9kKG0pIDogeTtcclxuICAgIH1cclxuXHJcbiAgICBuSXNOZWcgPSBuLnMgPCAwO1xyXG5cclxuICAgIGlmIChtKSB7XHJcblxyXG4gICAgICAvLyB4ICUgbSByZXR1cm5zIE5hTiBpZiBhYnMobSkgaXMgemVybywgb3IgbSBpcyBOYU4uXHJcbiAgICAgIGlmIChtLmMgPyAhbS5jWzBdIDogIW0ucykgcmV0dXJuIG5ldyBCaWdOdW1iZXIoTmFOKTtcclxuXHJcbiAgICAgIGlzTW9kRXhwID0gIW5Jc05lZyAmJiB4LmlzSW50ZWdlcigpICYmIG0uaXNJbnRlZ2VyKCk7XHJcblxyXG4gICAgICBpZiAoaXNNb2RFeHApIHggPSB4Lm1vZChtKTtcclxuXHJcbiAgICAvLyBPdmVyZmxvdyB0byDCsUluZmluaXR5OiA+PTIqKjFlMTAgb3IgPj0xLjAwMDAwMjQqKjFlMTUuXHJcbiAgICAvLyBVbmRlcmZsb3cgdG8gwrEwOiA8PTAuNzkqKjFlMTAgb3IgPD0wLjk5OTk5NzUqKjFlMTUuXHJcbiAgICB9IGVsc2UgaWYgKG4uZSA+IDkgJiYgKHguZSA+IDAgfHwgeC5lIDwgLTEgfHwgKHguZSA9PSAwXHJcbiAgICAgIC8vIFsxLCAyNDAwMDAwMDBdXHJcbiAgICAgID8geC5jWzBdID4gMSB8fCBuSXNCaWcgJiYgeC5jWzFdID49IDI0ZTdcclxuICAgICAgLy8gWzgwMDAwMDAwMDAwMDAwXSAgWzk5OTk5NzUwMDAwMDAwXVxyXG4gICAgICA6IHguY1swXSA8IDhlMTMgfHwgbklzQmlnICYmIHguY1swXSA8PSA5OTk5OTc1ZTcpKSkge1xyXG5cclxuICAgICAgLy8gSWYgeCBpcyBuZWdhdGl2ZSBhbmQgbiBpcyBvZGQsIGsgPSAtMCwgZWxzZSBrID0gMC5cclxuICAgICAgayA9IHgucyA8IDAgJiYgaXNPZGQobikgPyAtMCA6IDA7XHJcblxyXG4gICAgICAvLyBJZiB4ID49IDEsIGsgPSDCsUluZmluaXR5LlxyXG4gICAgICBpZiAoeC5lID4gLTEpIGsgPSAxIC8gaztcclxuXHJcbiAgICAgIC8vIElmIG4gaXMgbmVnYXRpdmUgcmV0dXJuIMKxMCwgZWxzZSByZXR1cm4gwrFJbmZpbml0eS5cclxuICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIobklzTmVnID8gMSAvIGsgOiBrKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKFBPV19QUkVDSVNJT04pIHtcclxuXHJcbiAgICAgIC8vIFRydW5jYXRpbmcgZWFjaCBjb2VmZmljaWVudCBhcnJheSB0byBhIGxlbmd0aCBvZiBrIGFmdGVyIGVhY2ggbXVsdGlwbGljYXRpb25cclxuICAgICAgLy8gZXF1YXRlcyB0byB0cnVuY2F0aW5nIHNpZ25pZmljYW50IGRpZ2l0cyB0byBQT1dfUFJFQ0lTSU9OICsgWzI4LCA0MV0sXHJcbiAgICAgIC8vIGkuZS4gdGhlcmUgd2lsbCBiZSBhIG1pbmltdW0gb2YgMjggZ3VhcmQgZGlnaXRzIHJldGFpbmVkLlxyXG4gICAgICBrID0gbWF0aGNlaWwoUE9XX1BSRUNJU0lPTiAvIExPR19CQVNFICsgMik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5Jc0JpZykge1xyXG4gICAgICBoYWxmID0gbmV3IEJpZ051bWJlcigwLjUpO1xyXG4gICAgICBpZiAobklzTmVnKSBuLnMgPSAxO1xyXG4gICAgICBuSXNPZGQgPSBpc09kZChuKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGkgPSBNYXRoLmFicygrdmFsdWVPZihuKSk7XHJcbiAgICAgIG5Jc09kZCA9IGkgJSAyO1xyXG4gICAgfVxyXG5cclxuICAgIHkgPSBuZXcgQmlnTnVtYmVyKE9ORSk7XHJcblxyXG4gICAgLy8gUGVyZm9ybXMgNTQgbG9vcCBpdGVyYXRpb25zIGZvciBuIG9mIDkwMDcxOTkyNTQ3NDA5OTEuXHJcbiAgICBmb3IgKDsgOykge1xyXG5cclxuICAgICAgaWYgKG5Jc09kZCkge1xyXG4gICAgICAgIHkgPSB5LnRpbWVzKHgpO1xyXG4gICAgICAgIGlmICgheS5jKSBicmVhaztcclxuXHJcbiAgICAgICAgaWYgKGspIHtcclxuICAgICAgICAgIGlmICh5LmMubGVuZ3RoID4gaykgeS5jLmxlbmd0aCA9IGs7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc01vZEV4cCkge1xyXG4gICAgICAgICAgeSA9IHkubW9kKG0pOyAgICAvL3kgPSB5Lm1pbnVzKGRpdih5LCBtLCAwLCBNT0RVTE9fTU9ERSkudGltZXMobSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGkpIHtcclxuICAgICAgICBpID0gbWF0aGZsb29yKGkgLyAyKTtcclxuICAgICAgICBpZiAoaSA9PT0gMCkgYnJlYWs7XHJcbiAgICAgICAgbklzT2RkID0gaSAlIDI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbiA9IG4udGltZXMoaGFsZik7XHJcbiAgICAgICAgcm91bmQobiwgbi5lICsgMSwgMSk7XHJcblxyXG4gICAgICAgIGlmIChuLmUgPiAxNCkge1xyXG4gICAgICAgICAgbklzT2RkID0gaXNPZGQobik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGkgPSArdmFsdWVPZihuKTtcclxuICAgICAgICAgIGlmIChpID09PSAwKSBicmVhaztcclxuICAgICAgICAgIG5Jc09kZCA9IGkgJSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgeCA9IHgudGltZXMoeCk7XHJcblxyXG4gICAgICBpZiAoaykge1xyXG4gICAgICAgIGlmICh4LmMgJiYgeC5jLmxlbmd0aCA+IGspIHguYy5sZW5ndGggPSBrO1xyXG4gICAgICB9IGVsc2UgaWYgKGlzTW9kRXhwKSB7XHJcbiAgICAgICAgeCA9IHgubW9kKG0pOyAgICAvL3ggPSB4Lm1pbnVzKGRpdih4LCBtLCAwLCBNT0RVTE9fTU9ERSkudGltZXMobSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzTW9kRXhwKSByZXR1cm4geTtcclxuICAgIGlmIChuSXNOZWcpIHkgPSBPTkUuZGl2KHkpO1xyXG5cclxuICAgIHJldHVybiBtID8geS5tb2QobSkgOiBrID8gcm91bmQoeSwgUE9XX1BSRUNJU0lPTiwgUk9VTkRJTkdfTU9ERSwgbW9yZSkgOiB5O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHJvdW5kZWQgdG8gYW4gaW50ZWdlclxyXG4gICAqIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0sIG9yIFJPVU5ESU5HX01PREUgaWYgcm0gaXMgb21pdHRlZC5cclxuICAgKlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7cm19J1xyXG4gICAqL1xyXG4gIFAuaW50ZWdlclZhbHVlID0gZnVuY3Rpb24gKHJtKSB7XHJcbiAgICB2YXIgbiA9IG5ldyBCaWdOdW1iZXIodGhpcyk7XHJcbiAgICBpZiAocm0gPT0gbnVsbCkgcm0gPSBST1VORElOR19NT0RFO1xyXG4gICAgZWxzZSBpbnRDaGVjayhybSwgMCwgOCk7XHJcbiAgICByZXR1cm4gcm91bmQobiwgbi5lICsgMSwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBlcXVhbCB0byB0aGUgdmFsdWUgb2YgQmlnTnVtYmVyKHksIGIpLFxyXG4gICAqIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICovXHJcbiAgUC5pc0VxdWFsVG8gPSBQLmVxID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpID09PSAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyBhIGZpbml0ZSBudW1iZXIsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICovXHJcbiAgUC5pc0Zpbml0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAhIXRoaXMuYztcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXHJcbiAgICogb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuICBQLmlzR3JlYXRlclRoYW4gPSBQLmd0ID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpID4gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZlxyXG4gICAqIEJpZ051bWJlcih5LCBiKSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuICBQLmlzR3JlYXRlclRoYW5PckVxdWFsVG8gPSBQLmd0ZSA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICByZXR1cm4gKGIgPSBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpKSA9PT0gMSB8fCBiID09PSAwO1xyXG5cclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgYW4gaW50ZWdlciwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuICBQLmlzSW50ZWdlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAhIXRoaXMuYyAmJiBiaXRGbG9vcih0aGlzLmUgLyBMT0dfQkFTRSkgPiB0aGlzLmMubGVuZ3RoIC0gMjtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBCaWdOdW1iZXIoeSwgYiksXHJcbiAgICogb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuICBQLmlzTGVzc1RoYW4gPSBQLmx0ID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgIHJldHVybiBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpIDwgMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZlxyXG4gICAqIEJpZ051bWJlcih5LCBiKSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuICBQLmlzTGVzc1RoYW5PckVxdWFsVG8gPSBQLmx0ZSA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICByZXR1cm4gKGIgPSBjb21wYXJlKHRoaXMsIG5ldyBCaWdOdW1iZXIoeSwgYikpKSA9PT0gLTEgfHwgYiA9PT0gMDtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgTmFOLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqL1xyXG4gIFAuaXNOYU4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gIXRoaXMucztcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgbmVnYXRpdmUsIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAgICovXHJcbiAgUC5pc05lZ2F0aXZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucyA8IDA7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGlzIHBvc2l0aXZlLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqL1xyXG4gIFAuaXNQb3NpdGl2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLnMgPiAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBpcyAwIG9yIC0wLCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gICAqL1xyXG4gIFAuaXNaZXJvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICEhdGhpcy5jICYmIHRoaXMuY1swXSA9PSAwO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqICBuIC0gMCA9IG5cclxuICAgKiAgbiAtIE4gPSBOXHJcbiAgICogIG4gLSBJID0gLUlcclxuICAgKiAgMCAtIG4gPSAtblxyXG4gICAqICAwIC0gMCA9IDBcclxuICAgKiAgMCAtIE4gPSBOXHJcbiAgICogIDAgLSBJID0gLUlcclxuICAgKiAgTiAtIG4gPSBOXHJcbiAgICogIE4gLSAwID0gTlxyXG4gICAqICBOIC0gTiA9IE5cclxuICAgKiAgTiAtIEkgPSBOXHJcbiAgICogIEkgLSBuID0gSVxyXG4gICAqICBJIC0gMCA9IElcclxuICAgKiAgSSAtIE4gPSBOXHJcbiAgICogIEkgLSBJID0gTlxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgbWludXMgdGhlIHZhbHVlIG9mXHJcbiAgICogQmlnTnVtYmVyKHksIGIpLlxyXG4gICAqL1xyXG4gIFAubWludXMgPSBmdW5jdGlvbiAoeSwgYikge1xyXG4gICAgdmFyIGksIGosIHQsIHhMVHksXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICBhID0geC5zO1xyXG5cclxuICAgIHkgPSBuZXcgQmlnTnVtYmVyKHksIGIpO1xyXG4gICAgYiA9IHkucztcclxuXHJcbiAgICAvLyBFaXRoZXIgTmFOP1xyXG4gICAgaWYgKCFhIHx8ICFiKSByZXR1cm4gbmV3IEJpZ051bWJlcihOYU4pO1xyXG5cclxuICAgIC8vIFNpZ25zIGRpZmZlcj9cclxuICAgIGlmIChhICE9IGIpIHtcclxuICAgICAgeS5zID0gLWI7XHJcbiAgICAgIHJldHVybiB4LnBsdXMoeSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHhlID0geC5lIC8gTE9HX0JBU0UsXHJcbiAgICAgIHllID0geS5lIC8gTE9HX0JBU0UsXHJcbiAgICAgIHhjID0geC5jLFxyXG4gICAgICB5YyA9IHkuYztcclxuXHJcbiAgICBpZiAoIXhlIHx8ICF5ZSkge1xyXG5cclxuICAgICAgLy8gRWl0aGVyIEluZmluaXR5P1xyXG4gICAgICBpZiAoIXhjIHx8ICF5YykgcmV0dXJuIHhjID8gKHkucyA9IC1iLCB5KSA6IG5ldyBCaWdOdW1iZXIoeWMgPyB4IDogTmFOKTtcclxuXHJcbiAgICAgIC8vIEVpdGhlciB6ZXJvP1xyXG4gICAgICBpZiAoIXhjWzBdIHx8ICF5Y1swXSkge1xyXG5cclxuICAgICAgICAvLyBSZXR1cm4geSBpZiB5IGlzIG5vbi16ZXJvLCB4IGlmIHggaXMgbm9uLXplcm8sIG9yIHplcm8gaWYgYm90aCBhcmUgemVyby5cclxuICAgICAgICByZXR1cm4geWNbMF0gPyAoeS5zID0gLWIsIHkpIDogbmV3IEJpZ051bWJlcih4Y1swXSA/IHggOlxyXG5cclxuICAgICAgICAgLy8gSUVFRSA3NTQgKDIwMDgpIDYuMzogbiAtIG4gPSAtMCB3aGVuIHJvdW5kaW5nIHRvIC1JbmZpbml0eVxyXG4gICAgICAgICBST1VORElOR19NT0RFID09IDMgPyAtMCA6IDApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgeGUgPSBiaXRGbG9vcih4ZSk7XHJcbiAgICB5ZSA9IGJpdEZsb29yKHllKTtcclxuICAgIHhjID0geGMuc2xpY2UoKTtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgd2hpY2ggaXMgdGhlIGJpZ2dlciBudW1iZXIuXHJcbiAgICBpZiAoYSA9IHhlIC0geWUpIHtcclxuXHJcbiAgICAgIGlmICh4TFR5ID0gYSA8IDApIHtcclxuICAgICAgICBhID0gLWE7XHJcbiAgICAgICAgdCA9IHhjO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHllID0geGU7XHJcbiAgICAgICAgdCA9IHljO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0LnJldmVyc2UoKTtcclxuXHJcbiAgICAgIC8vIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLlxyXG4gICAgICBmb3IgKGIgPSBhOyBiLS07IHQucHVzaCgwKSk7XHJcbiAgICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIEV4cG9uZW50cyBlcXVhbC4gQ2hlY2sgZGlnaXQgYnkgZGlnaXQuXHJcbiAgICAgIGogPSAoeExUeSA9IChhID0geGMubGVuZ3RoKSA8IChiID0geWMubGVuZ3RoKSkgPyBhIDogYjtcclxuXHJcbiAgICAgIGZvciAoYSA9IGIgPSAwOyBiIDwgajsgYisrKSB7XHJcblxyXG4gICAgICAgIGlmICh4Y1tiXSAhPSB5Y1tiXSkge1xyXG4gICAgICAgICAgeExUeSA9IHhjW2JdIDwgeWNbYl07XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB4IDwgeT8gUG9pbnQgeGMgdG8gdGhlIGFycmF5IG9mIHRoZSBiaWdnZXIgbnVtYmVyLlxyXG4gICAgaWYgKHhMVHkpIHtcclxuICAgICAgdCA9IHhjO1xyXG4gICAgICB4YyA9IHljO1xyXG4gICAgICB5YyA9IHQ7XHJcbiAgICAgIHkucyA9IC15LnM7XHJcbiAgICB9XHJcblxyXG4gICAgYiA9IChqID0geWMubGVuZ3RoKSAtIChpID0geGMubGVuZ3RoKTtcclxuXHJcbiAgICAvLyBBcHBlbmQgemVyb3MgdG8geGMgaWYgc2hvcnRlci5cclxuICAgIC8vIE5vIG5lZWQgdG8gYWRkIHplcm9zIHRvIHljIGlmIHNob3J0ZXIgYXMgc3VidHJhY3Qgb25seSBuZWVkcyB0byBzdGFydCBhdCB5Yy5sZW5ndGguXHJcbiAgICBpZiAoYiA+IDApIGZvciAoOyBiLS07IHhjW2krK10gPSAwKTtcclxuICAgIGIgPSBCQVNFIC0gMTtcclxuXHJcbiAgICAvLyBTdWJ0cmFjdCB5YyBmcm9tIHhjLlxyXG4gICAgZm9yICg7IGogPiBhOykge1xyXG5cclxuICAgICAgaWYgKHhjWy0tal0gPCB5Y1tqXSkge1xyXG4gICAgICAgIGZvciAoaSA9IGo7IGkgJiYgIXhjWy0taV07IHhjW2ldID0gYik7XHJcbiAgICAgICAgLS14Y1tpXTtcclxuICAgICAgICB4Y1tqXSArPSBCQVNFO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB4Y1tqXSAtPSB5Y1tqXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW1vdmUgbGVhZGluZyB6ZXJvcyBhbmQgYWRqdXN0IGV4cG9uZW50IGFjY29yZGluZ2x5LlxyXG4gICAgZm9yICg7IHhjWzBdID09IDA7IHhjLnNwbGljZSgwLCAxKSwgLS15ZSk7XHJcblxyXG4gICAgLy8gWmVybz9cclxuICAgIGlmICgheGNbMF0pIHtcclxuXHJcbiAgICAgIC8vIEZvbGxvd2luZyBJRUVFIDc1NCAoMjAwOCkgNi4zLFxyXG4gICAgICAvLyBuIC0gbiA9ICswICBidXQgIG4gLSBuID0gLTAgIHdoZW4gcm91bmRpbmcgdG93YXJkcyAtSW5maW5pdHkuXHJcbiAgICAgIHkucyA9IFJPVU5ESU5HX01PREUgPT0gMyA/IC0xIDogMTtcclxuICAgICAgeS5jID0gW3kuZSA9IDBdO1xyXG4gICAgICByZXR1cm4geTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciBJbmZpbml0eSBhcyAreCAtICt5ICE9IEluZmluaXR5ICYmIC14IC0gLXkgIT0gSW5maW5pdHlcclxuICAgIC8vIGZvciBmaW5pdGUgeCBhbmQgeS5cclxuICAgIHJldHVybiBub3JtYWxpc2UoeSwgeGMsIHllKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiAgIG4gJSAwID0gIE5cclxuICAgKiAgIG4gJSBOID0gIE5cclxuICAgKiAgIG4gJSBJID0gIG5cclxuICAgKiAgIDAgJSBuID0gIDBcclxuICAgKiAgLTAgJSBuID0gLTBcclxuICAgKiAgIDAgJSAwID0gIE5cclxuICAgKiAgIDAgJSBOID0gIE5cclxuICAgKiAgIDAgJSBJID0gIDBcclxuICAgKiAgIE4gJSBuID0gIE5cclxuICAgKiAgIE4gJSAwID0gIE5cclxuICAgKiAgIE4gJSBOID0gIE5cclxuICAgKiAgIE4gJSBJID0gIE5cclxuICAgKiAgIEkgJSBuID0gIE5cclxuICAgKiAgIEkgJSAwID0gIE5cclxuICAgKiAgIEkgJSBOID0gIE5cclxuICAgKiAgIEkgJSBJID0gIE5cclxuICAgKlxyXG4gICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIG1vZHVsbyB0aGUgdmFsdWUgb2ZcclxuICAgKiBCaWdOdW1iZXIoeSwgYikuIFRoZSByZXN1bHQgZGVwZW5kcyBvbiB0aGUgdmFsdWUgb2YgTU9EVUxPX01PREUuXHJcbiAgICovXHJcbiAgUC5tb2R1bG8gPSBQLm1vZCA9IGZ1bmN0aW9uICh5LCBiKSB7XHJcbiAgICB2YXIgcSwgcyxcclxuICAgICAgeCA9IHRoaXM7XHJcblxyXG4gICAgeSA9IG5ldyBCaWdOdW1iZXIoeSwgYik7XHJcblxyXG4gICAgLy8gUmV0dXJuIE5hTiBpZiB4IGlzIEluZmluaXR5IG9yIE5hTiwgb3IgeSBpcyBOYU4gb3IgemVyby5cclxuICAgIGlmICgheC5jIHx8ICF5LnMgfHwgeS5jICYmICF5LmNbMF0pIHtcclxuICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIoTmFOKTtcclxuXHJcbiAgICAvLyBSZXR1cm4geCBpZiB5IGlzIEluZmluaXR5IG9yIHggaXMgemVyby5cclxuICAgIH0gZWxzZSBpZiAoIXkuYyB8fCB4LmMgJiYgIXguY1swXSkge1xyXG4gICAgICByZXR1cm4gbmV3IEJpZ051bWJlcih4KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoTU9EVUxPX01PREUgPT0gOSkge1xyXG5cclxuICAgICAgLy8gRXVjbGlkaWFuIGRpdmlzaW9uOiBxID0gc2lnbih5KSAqIGZsb29yKHggLyBhYnMoeSkpXHJcbiAgICAgIC8vIHIgPSB4IC0gcXkgICAgd2hlcmUgIDAgPD0gciA8IGFicyh5KVxyXG4gICAgICBzID0geS5zO1xyXG4gICAgICB5LnMgPSAxO1xyXG4gICAgICBxID0gZGl2KHgsIHksIDAsIDMpO1xyXG4gICAgICB5LnMgPSBzO1xyXG4gICAgICBxLnMgKj0gcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHEgPSBkaXYoeCwgeSwgMCwgTU9EVUxPX01PREUpO1xyXG4gICAgfVxyXG5cclxuICAgIHkgPSB4Lm1pbnVzKHEudGltZXMoeSkpO1xyXG5cclxuICAgIC8vIFRvIG1hdGNoIEphdmFTY3JpcHQgJSwgZW5zdXJlIHNpZ24gb2YgemVybyBpcyBzaWduIG9mIGRpdmlkZW5kLlxyXG4gICAgaWYgKCF5LmNbMF0gJiYgTU9EVUxPX01PREUgPT0gMSkgeS5zID0geC5zO1xyXG5cclxuICAgIHJldHVybiB5O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqICBuICogMCA9IDBcclxuICAgKiAgbiAqIE4gPSBOXHJcbiAgICogIG4gKiBJID0gSVxyXG4gICAqICAwICogbiA9IDBcclxuICAgKiAgMCAqIDAgPSAwXHJcbiAgICogIDAgKiBOID0gTlxyXG4gICAqICAwICogSSA9IE5cclxuICAgKiAgTiAqIG4gPSBOXHJcbiAgICogIE4gKiAwID0gTlxyXG4gICAqICBOICogTiA9IE5cclxuICAgKiAgTiAqIEkgPSBOXHJcbiAgICogIEkgKiBuID0gSVxyXG4gICAqICBJICogMCA9IE5cclxuICAgKiAgSSAqIE4gPSBOXHJcbiAgICogIEkgKiBJID0gSVxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgbXVsdGlwbGllZCBieSB0aGUgdmFsdWVcclxuICAgKiBvZiBCaWdOdW1iZXIoeSwgYikuXHJcbiAgICovXHJcbiAgUC5tdWx0aXBsaWVkQnkgPSBQLnRpbWVzID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgIHZhciBjLCBlLCBpLCBqLCBrLCBtLCB4Y0wsIHhsbywgeGhpLCB5Y0wsIHlsbywgeWhpLCB6YyxcclxuICAgICAgYmFzZSwgc3FydEJhc2UsXHJcbiAgICAgIHggPSB0aGlzLFxyXG4gICAgICB4YyA9IHguYyxcclxuICAgICAgeWMgPSAoeSA9IG5ldyBCaWdOdW1iZXIoeSwgYikpLmM7XHJcblxyXG4gICAgLy8gRWl0aGVyIE5hTiwgwrFJbmZpbml0eSBvciDCsTA/XHJcbiAgICBpZiAoIXhjIHx8ICF5YyB8fCAheGNbMF0gfHwgIXljWzBdKSB7XHJcblxyXG4gICAgICAvLyBSZXR1cm4gTmFOIGlmIGVpdGhlciBpcyBOYU4sIG9yIG9uZSBpcyAwIGFuZCB0aGUgb3RoZXIgaXMgSW5maW5pdHkuXHJcbiAgICAgIGlmICgheC5zIHx8ICF5LnMgfHwgeGMgJiYgIXhjWzBdICYmICF5YyB8fCB5YyAmJiAheWNbMF0gJiYgIXhjKSB7XHJcbiAgICAgICAgeS5jID0geS5lID0geS5zID0gbnVsbDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB5LnMgKj0geC5zO1xyXG5cclxuICAgICAgICAvLyBSZXR1cm4gwrFJbmZpbml0eSBpZiBlaXRoZXIgaXMgwrFJbmZpbml0eS5cclxuICAgICAgICBpZiAoIXhjIHx8ICF5Yykge1xyXG4gICAgICAgICAgeS5jID0geS5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIMKxMCBpZiBlaXRoZXIgaXMgwrEwLlxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB5LmMgPSBbMF07XHJcbiAgICAgICAgICB5LmUgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHk7XHJcbiAgICB9XHJcblxyXG4gICAgZSA9IGJpdEZsb29yKHguZSAvIExPR19CQVNFKSArIGJpdEZsb29yKHkuZSAvIExPR19CQVNFKTtcclxuICAgIHkucyAqPSB4LnM7XHJcbiAgICB4Y0wgPSB4Yy5sZW5ndGg7XHJcbiAgICB5Y0wgPSB5Yy5sZW5ndGg7XHJcblxyXG4gICAgLy8gRW5zdXJlIHhjIHBvaW50cyB0byBsb25nZXIgYXJyYXkgYW5kIHhjTCB0byBpdHMgbGVuZ3RoLlxyXG4gICAgaWYgKHhjTCA8IHljTCkge1xyXG4gICAgICB6YyA9IHhjO1xyXG4gICAgICB4YyA9IHljO1xyXG4gICAgICB5YyA9IHpjO1xyXG4gICAgICBpID0geGNMO1xyXG4gICAgICB4Y0wgPSB5Y0w7XHJcbiAgICAgIHljTCA9IGk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW5pdGlhbGlzZSB0aGUgcmVzdWx0IGFycmF5IHdpdGggemVyb3MuXHJcbiAgICBmb3IgKGkgPSB4Y0wgKyB5Y0wsIHpjID0gW107IGktLTsgemMucHVzaCgwKSk7XHJcblxyXG4gICAgYmFzZSA9IEJBU0U7XHJcbiAgICBzcXJ0QmFzZSA9IFNRUlRfQkFTRTtcclxuXHJcbiAgICBmb3IgKGkgPSB5Y0w7IC0taSA+PSAwOykge1xyXG4gICAgICBjID0gMDtcclxuICAgICAgeWxvID0geWNbaV0gJSBzcXJ0QmFzZTtcclxuICAgICAgeWhpID0geWNbaV0gLyBzcXJ0QmFzZSB8IDA7XHJcblxyXG4gICAgICBmb3IgKGsgPSB4Y0wsIGogPSBpICsgazsgaiA+IGk7KSB7XHJcbiAgICAgICAgeGxvID0geGNbLS1rXSAlIHNxcnRCYXNlO1xyXG4gICAgICAgIHhoaSA9IHhjW2tdIC8gc3FydEJhc2UgfCAwO1xyXG4gICAgICAgIG0gPSB5aGkgKiB4bG8gKyB4aGkgKiB5bG87XHJcbiAgICAgICAgeGxvID0geWxvICogeGxvICsgKChtICUgc3FydEJhc2UpICogc3FydEJhc2UpICsgemNbal0gKyBjO1xyXG4gICAgICAgIGMgPSAoeGxvIC8gYmFzZSB8IDApICsgKG0gLyBzcXJ0QmFzZSB8IDApICsgeWhpICogeGhpO1xyXG4gICAgICAgIHpjW2otLV0gPSB4bG8gJSBiYXNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB6Y1tqXSA9IGM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGMpIHtcclxuICAgICAgKytlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgemMuc3BsaWNlKDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBub3JtYWxpc2UoeSwgemMsIGUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIG5lZ2F0ZWQsXHJcbiAgICogaS5lLiBtdWx0aXBsaWVkIGJ5IC0xLlxyXG4gICAqL1xyXG4gIFAubmVnYXRlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB4ID0gbmV3IEJpZ051bWJlcih0aGlzKTtcclxuICAgIHgucyA9IC14LnMgfHwgbnVsbDtcclxuICAgIHJldHVybiB4O1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqICBuICsgMCA9IG5cclxuICAgKiAgbiArIE4gPSBOXHJcbiAgICogIG4gKyBJID0gSVxyXG4gICAqICAwICsgbiA9IG5cclxuICAgKiAgMCArIDAgPSAwXHJcbiAgICogIDAgKyBOID0gTlxyXG4gICAqICAwICsgSSA9IElcclxuICAgKiAgTiArIG4gPSBOXHJcbiAgICogIE4gKyAwID0gTlxyXG4gICAqICBOICsgTiA9IE5cclxuICAgKiAgTiArIEkgPSBOXHJcbiAgICogIEkgKyBuID0gSVxyXG4gICAqICBJICsgMCA9IElcclxuICAgKiAgSSArIE4gPSBOXHJcbiAgICogIEkgKyBJID0gSVxyXG4gICAqXHJcbiAgICogUmV0dXJuIGEgbmV3IEJpZ051bWJlciB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgcGx1cyB0aGUgdmFsdWUgb2ZcclxuICAgKiBCaWdOdW1iZXIoeSwgYikuXHJcbiAgICovXHJcbiAgUC5wbHVzID0gZnVuY3Rpb24gKHksIGIpIHtcclxuICAgIHZhciB0LFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgYSA9IHgucztcclxuXHJcbiAgICB5ID0gbmV3IEJpZ051bWJlcih5LCBiKTtcclxuICAgIGIgPSB5LnM7XHJcblxyXG4gICAgLy8gRWl0aGVyIE5hTj9cclxuICAgIGlmICghYSB8fCAhYikgcmV0dXJuIG5ldyBCaWdOdW1iZXIoTmFOKTtcclxuXHJcbiAgICAvLyBTaWducyBkaWZmZXI/XHJcbiAgICAgaWYgKGEgIT0gYikge1xyXG4gICAgICB5LnMgPSAtYjtcclxuICAgICAgcmV0dXJuIHgubWludXMoeSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHhlID0geC5lIC8gTE9HX0JBU0UsXHJcbiAgICAgIHllID0geS5lIC8gTE9HX0JBU0UsXHJcbiAgICAgIHhjID0geC5jLFxyXG4gICAgICB5YyA9IHkuYztcclxuXHJcbiAgICBpZiAoIXhlIHx8ICF5ZSkge1xyXG5cclxuICAgICAgLy8gUmV0dXJuIMKxSW5maW5pdHkgaWYgZWl0aGVyIMKxSW5maW5pdHkuXHJcbiAgICAgIGlmICgheGMgfHwgIXljKSByZXR1cm4gbmV3IEJpZ051bWJlcihhIC8gMCk7XHJcblxyXG4gICAgICAvLyBFaXRoZXIgemVybz9cclxuICAgICAgLy8gUmV0dXJuIHkgaWYgeSBpcyBub24temVybywgeCBpZiB4IGlzIG5vbi16ZXJvLCBvciB6ZXJvIGlmIGJvdGggYXJlIHplcm8uXHJcbiAgICAgIGlmICgheGNbMF0gfHwgIXljWzBdKSByZXR1cm4geWNbMF0gPyB5IDogbmV3IEJpZ051bWJlcih4Y1swXSA/IHggOiBhICogMCk7XHJcbiAgICB9XHJcblxyXG4gICAgeGUgPSBiaXRGbG9vcih4ZSk7XHJcbiAgICB5ZSA9IGJpdEZsb29yKHllKTtcclxuICAgIHhjID0geGMuc2xpY2UoKTtcclxuXHJcbiAgICAvLyBQcmVwZW5kIHplcm9zIHRvIGVxdWFsaXNlIGV4cG9uZW50cy4gRmFzdGVyIHRvIHVzZSByZXZlcnNlIHRoZW4gZG8gdW5zaGlmdHMuXHJcbiAgICBpZiAoYSA9IHhlIC0geWUpIHtcclxuICAgICAgaWYgKGEgPiAwKSB7XHJcbiAgICAgICAgeWUgPSB4ZTtcclxuICAgICAgICB0ID0geWM7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYSA9IC1hO1xyXG4gICAgICAgIHQgPSB4YztcclxuICAgICAgfVxyXG5cclxuICAgICAgdC5yZXZlcnNlKCk7XHJcbiAgICAgIGZvciAoOyBhLS07IHQucHVzaCgwKSk7XHJcbiAgICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGEgPSB4Yy5sZW5ndGg7XHJcbiAgICBiID0geWMubGVuZ3RoO1xyXG5cclxuICAgIC8vIFBvaW50IHhjIHRvIHRoZSBsb25nZXIgYXJyYXksIGFuZCBiIHRvIHRoZSBzaG9ydGVyIGxlbmd0aC5cclxuICAgIGlmIChhIC0gYiA8IDApIHtcclxuICAgICAgdCA9IHljO1xyXG4gICAgICB5YyA9IHhjO1xyXG4gICAgICB4YyA9IHQ7XHJcbiAgICAgIGIgPSBhO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9ubHkgc3RhcnQgYWRkaW5nIGF0IHljLmxlbmd0aCAtIDEgYXMgdGhlIGZ1cnRoZXIgZGlnaXRzIG9mIHhjIGNhbiBiZSBpZ25vcmVkLlxyXG4gICAgZm9yIChhID0gMDsgYjspIHtcclxuICAgICAgYSA9ICh4Y1stLWJdID0geGNbYl0gKyB5Y1tiXSArIGEpIC8gQkFTRSB8IDA7XHJcbiAgICAgIHhjW2JdID0gQkFTRSA9PT0geGNbYl0gPyAwIDogeGNbYl0gJSBCQVNFO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhKSB7XHJcbiAgICAgIHhjID0gW2FdLmNvbmNhdCh4Yyk7XHJcbiAgICAgICsreWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgemVybywgYXMgK3ggKyAreSAhPSAwICYmIC14ICsgLXkgIT0gMFxyXG4gICAgLy8geWUgPSBNQVhfRVhQICsgMSBwb3NzaWJsZVxyXG4gICAgcmV0dXJuIG5vcm1hbGlzZSh5LCB4YywgeWUpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIElmIHNkIGlzIHVuZGVmaW5lZCBvciBudWxsIG9yIHRydWUgb3IgZmFsc2UsIHJldHVybiB0aGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0cyBvZlxyXG4gICAqIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciwgb3IgbnVsbCBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaXMgwrFJbmZpbml0eSBvciBOYU4uXHJcbiAgICogSWYgc2QgaXMgdHJ1ZSBpbmNsdWRlIGludGVnZXItcGFydCB0cmFpbGluZyB6ZXJvcyBpbiB0aGUgY291bnQuXHJcbiAgICpcclxuICAgKiBPdGhlcndpc2UsIGlmIHNkIGlzIGEgbnVtYmVyLCByZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzXHJcbiAgICogQmlnTnVtYmVyIHJvdW5kZWQgdG8gYSBtYXhpbXVtIG9mIHNkIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvclxyXG4gICAqIFJPVU5ESU5HX01PREUgaWYgcm0gaXMgb21pdHRlZC5cclxuICAgKlxyXG4gICAqIHNkIHtudW1iZXJ8Ym9vbGVhbn0gbnVtYmVyOiBzaWduaWZpY2FudCBkaWdpdHM6IGludGVnZXIsIDEgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgKiAgICAgICAgICAgICAgICAgICAgIGJvb2xlYW46IHdoZXRoZXIgdG8gY291bnQgaW50ZWdlci1wYXJ0IHRyYWlsaW5nIHplcm9zOiB0cnVlIG9yIGZhbHNlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7c2R8cm19J1xyXG4gICAqL1xyXG4gIFAucHJlY2lzaW9uID0gUC5zZCA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICAgIHZhciBjLCBuLCB2LFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICBpZiAoc2QgIT0gbnVsbCAmJiBzZCAhPT0gISFzZCkge1xyXG4gICAgICBpbnRDaGVjayhzZCwgMSwgTUFYKTtcclxuICAgICAgaWYgKHJtID09IG51bGwpIHJtID0gUk9VTkRJTkdfTU9ERTtcclxuICAgICAgZWxzZSBpbnRDaGVjayhybSwgMCwgOCk7XHJcblxyXG4gICAgICByZXR1cm4gcm91bmQobmV3IEJpZ051bWJlcih4KSwgc2QsIHJtKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIShjID0geC5jKSkgcmV0dXJuIG51bGw7XHJcbiAgICB2ID0gYy5sZW5ndGggLSAxO1xyXG4gICAgbiA9IHYgKiBMT0dfQkFTRSArIDE7XHJcblxyXG4gICAgaWYgKHYgPSBjW3ZdKSB7XHJcblxyXG4gICAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHRyYWlsaW5nIHplcm9zIG9mIHRoZSBsYXN0IGVsZW1lbnQuXHJcbiAgICAgIGZvciAoOyB2ICUgMTAgPT0gMDsgdiAvPSAxMCwgbi0tKTtcclxuXHJcbiAgICAgIC8vIEFkZCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBvZiB0aGUgZmlyc3QgZWxlbWVudC5cclxuICAgICAgZm9yICh2ID0gY1swXTsgdiA+PSAxMDsgdiAvPSAxMCwgbisrKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2QgJiYgeC5lICsgMSA+IG4pIG4gPSB4LmUgKyAxO1xyXG5cclxuICAgIHJldHVybiBuO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIG5ldyBCaWdOdW1iZXIgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIHNoaWZ0ZWQgYnkgayBwbGFjZXNcclxuICAgKiAocG93ZXJzIG9mIDEwKS4gU2hpZnQgdG8gdGhlIHJpZ2h0IGlmIG4gPiAwLCBhbmQgdG8gdGhlIGxlZnQgaWYgbiA8IDAuXHJcbiAgICpcclxuICAgKiBrIHtudW1iZXJ9IEludGVnZXIsIC1NQVhfU0FGRV9JTlRFR0VSIHRvIE1BWF9TQUZFX0lOVEVHRVIgaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtrfSdcclxuICAgKi9cclxuICBQLnNoaWZ0ZWRCeSA9IGZ1bmN0aW9uIChrKSB7XHJcbiAgICBpbnRDaGVjayhrLCAtTUFYX1NBRkVfSU5URUdFUiwgTUFYX1NBRkVfSU5URUdFUik7XHJcbiAgICByZXR1cm4gdGhpcy50aW1lcygnMWUnICsgayk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogIHNxcnQoLW4pID0gIE5cclxuICAgKiAgc3FydChOKSA9ICBOXHJcbiAgICogIHNxcnQoLUkpID0gIE5cclxuICAgKiAgc3FydChJKSA9ICBJXHJcbiAgICogIHNxcnQoMCkgPSAgMFxyXG4gICAqICBzcXJ0KC0wKSA9IC0wXHJcbiAgICpcclxuICAgKiBSZXR1cm4gYSBuZXcgQmlnTnVtYmVyIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIsXHJcbiAgICogcm91bmRlZCBhY2NvcmRpbmcgdG8gREVDSU1BTF9QTEFDRVMgYW5kIFJPVU5ESU5HX01PREUuXHJcbiAgICovXHJcbiAgUC5zcXVhcmVSb290ID0gUC5zcXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIG0sIG4sIHIsIHJlcCwgdCxcclxuICAgICAgeCA9IHRoaXMsXHJcbiAgICAgIGMgPSB4LmMsXHJcbiAgICAgIHMgPSB4LnMsXHJcbiAgICAgIGUgPSB4LmUsXHJcbiAgICAgIGRwID0gREVDSU1BTF9QTEFDRVMgKyA0LFxyXG4gICAgICBoYWxmID0gbmV3IEJpZ051bWJlcignMC41Jyk7XHJcblxyXG4gICAgLy8gTmVnYXRpdmUvTmFOL0luZmluaXR5L3plcm8/XHJcbiAgICBpZiAocyAhPT0gMSB8fCAhYyB8fCAhY1swXSkge1xyXG4gICAgICByZXR1cm4gbmV3IEJpZ051bWJlcighcyB8fCBzIDwgMCAmJiAoIWMgfHwgY1swXSkgPyBOYU4gOiBjID8geCA6IDEgLyAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJbml0aWFsIGVzdGltYXRlLlxyXG4gICAgcyA9IE1hdGguc3FydCgrdmFsdWVPZih4KSk7XHJcblxyXG4gICAgLy8gTWF0aC5zcXJ0IHVuZGVyZmxvdy9vdmVyZmxvdz9cclxuICAgIC8vIFBhc3MgeCB0byBNYXRoLnNxcnQgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIGV4cG9uZW50IG9mIHRoZSByZXN1bHQuXHJcbiAgICBpZiAocyA9PSAwIHx8IHMgPT0gMSAvIDApIHtcclxuICAgICAgbiA9IGNvZWZmVG9TdHJpbmcoYyk7XHJcbiAgICAgIGlmICgobi5sZW5ndGggKyBlKSAlIDIgPT0gMCkgbiArPSAnMCc7XHJcbiAgICAgIHMgPSBNYXRoLnNxcnQoK24pO1xyXG4gICAgICBlID0gYml0Rmxvb3IoKGUgKyAxKSAvIDIpIC0gKGUgPCAwIHx8IGUgJSAyKTtcclxuXHJcbiAgICAgIGlmIChzID09IDEgLyAwKSB7XHJcbiAgICAgICAgbiA9ICc1ZScgKyBlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG4gPSBzLnRvRXhwb25lbnRpYWwoKTtcclxuICAgICAgICBuID0gbi5zbGljZSgwLCBuLmluZGV4T2YoJ2UnKSArIDEpICsgZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgciA9IG5ldyBCaWdOdW1iZXIobik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByID0gbmV3IEJpZ051bWJlcihzICsgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoZWNrIGZvciB6ZXJvLlxyXG4gICAgLy8gciBjb3VsZCBiZSB6ZXJvIGlmIE1JTl9FWFAgaXMgY2hhbmdlZCBhZnRlciB0aGUgdGhpcyB2YWx1ZSB3YXMgY3JlYXRlZC5cclxuICAgIC8vIFRoaXMgd291bGQgY2F1c2UgYSBkaXZpc2lvbiBieSB6ZXJvICh4L3QpIGFuZCBoZW5jZSBJbmZpbml0eSBiZWxvdywgd2hpY2ggd291bGQgY2F1c2VcclxuICAgIC8vIGNvZWZmVG9TdHJpbmcgdG8gdGhyb3cuXHJcbiAgICBpZiAoci5jWzBdKSB7XHJcbiAgICAgIGUgPSByLmU7XHJcbiAgICAgIHMgPSBlICsgZHA7XHJcbiAgICAgIGlmIChzIDwgMykgcyA9IDA7XHJcblxyXG4gICAgICAvLyBOZXd0b24tUmFwaHNvbiBpdGVyYXRpb24uXHJcbiAgICAgIGZvciAoOyA7KSB7XHJcbiAgICAgICAgdCA9IHI7XHJcbiAgICAgICAgciA9IGhhbGYudGltZXModC5wbHVzKGRpdih4LCB0LCBkcCwgMSkpKTtcclxuXHJcbiAgICAgICAgaWYgKGNvZWZmVG9TdHJpbmcodC5jKS5zbGljZSgwLCBzKSA9PT0gKG4gPSBjb2VmZlRvU3RyaW5nKHIuYykpLnNsaWNlKDAsIHMpKSB7XHJcblxyXG4gICAgICAgICAgLy8gVGhlIGV4cG9uZW50IG9mIHIgbWF5IGhlcmUgYmUgb25lIGxlc3MgdGhhbiB0aGUgZmluYWwgcmVzdWx0IGV4cG9uZW50LFxyXG4gICAgICAgICAgLy8gZS5nIDAuMDAwOTk5OSAoZS00KSAtLT4gMC4wMDEgKGUtMyksIHNvIGFkanVzdCBzIHNvIHRoZSByb3VuZGluZyBkaWdpdHNcclxuICAgICAgICAgIC8vIGFyZSBpbmRleGVkIGNvcnJlY3RseS5cclxuICAgICAgICAgIGlmIChyLmUgPCBlKSAtLXM7XHJcbiAgICAgICAgICBuID0gbi5zbGljZShzIC0gMywgcyArIDEpO1xyXG5cclxuICAgICAgICAgIC8vIFRoZSA0dGggcm91bmRpbmcgZGlnaXQgbWF5IGJlIGluIGVycm9yIGJ5IC0xIHNvIGlmIHRoZSA0IHJvdW5kaW5nIGRpZ2l0c1xyXG4gICAgICAgICAgLy8gYXJlIDk5OTkgb3IgNDk5OSAoaS5lLiBhcHByb2FjaGluZyBhIHJvdW5kaW5nIGJvdW5kYXJ5KSBjb250aW51ZSB0aGVcclxuICAgICAgICAgIC8vIGl0ZXJhdGlvbi5cclxuICAgICAgICAgIGlmIChuID09ICc5OTk5JyB8fCAhcmVwICYmIG4gPT0gJzQ5OTknKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBPbiB0aGUgZmlyc3QgaXRlcmF0aW9uIG9ubHksIGNoZWNrIHRvIHNlZSBpZiByb3VuZGluZyB1cCBnaXZlcyB0aGVcclxuICAgICAgICAgICAgLy8gZXhhY3QgcmVzdWx0IGFzIHRoZSBuaW5lcyBtYXkgaW5maW5pdGVseSByZXBlYXQuXHJcbiAgICAgICAgICAgIGlmICghcmVwKSB7XHJcbiAgICAgICAgICAgICAgcm91bmQodCwgdC5lICsgREVDSU1BTF9QTEFDRVMgKyAyLCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHQudGltZXModCkuZXEoeCkpIHtcclxuICAgICAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkcCArPSA0O1xyXG4gICAgICAgICAgICBzICs9IDQ7XHJcbiAgICAgICAgICAgIHJlcCA9IDE7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgcm91bmRpbmcgZGlnaXRzIGFyZSBudWxsLCAwezAsNH0gb3IgNTB7MCwzfSwgY2hlY2sgZm9yIGV4YWN0XHJcbiAgICAgICAgICAgIC8vIHJlc3VsdC4gSWYgbm90LCB0aGVuIHRoZXJlIGFyZSBmdXJ0aGVyIGRpZ2l0cyBhbmQgbSB3aWxsIGJlIHRydXRoeS5cclxuICAgICAgICAgICAgaWYgKCErbiB8fCAhK24uc2xpY2UoMSkgJiYgbi5jaGFyQXQoMCkgPT0gJzUnKSB7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFRydW5jYXRlIHRvIHRoZSBmaXJzdCByb3VuZGluZyBkaWdpdC5cclxuICAgICAgICAgICAgICByb3VuZChyLCByLmUgKyBERUNJTUFMX1BMQUNFUyArIDIsIDEpO1xyXG4gICAgICAgICAgICAgIG0gPSAhci50aW1lcyhyKS5lcSh4KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJvdW5kKHIsIHIuZSArIERFQ0lNQUxfUExBQ0VTICsgMSwgUk9VTkRJTkdfTU9ERSwgbSk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaW4gZXhwb25lbnRpYWwgbm90YXRpb24gYW5kXHJcbiAgICogcm91bmRlZCB1c2luZyBST1VORElOR19NT0RFIHRvIGRwIGZpeGVkIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAqXHJcbiAgICogW2RwXSB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlcy4gSW50ZWdlciwgMCB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7ZHB8cm19J1xyXG4gICAqL1xyXG4gIFAudG9FeHBvbmVudGlhbCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICAgIGlmIChkcCAhPSBudWxsKSB7XHJcbiAgICAgIGludENoZWNrKGRwLCAwLCBNQVgpO1xyXG4gICAgICBkcCsrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZvcm1hdCh0aGlzLCBkcCwgcm0sIDEpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGluIGZpeGVkLXBvaW50IG5vdGF0aW9uIHJvdW5kaW5nXHJcbiAgICogdG8gZHAgZml4ZWQgZGVjaW1hbCBwbGFjZXMgdXNpbmcgcm91bmRpbmcgbW9kZSBybSwgb3IgUk9VTkRJTkdfTU9ERSBpZiBybSBpcyBvbWl0dGVkLlxyXG4gICAqXHJcbiAgICogTm90ZTogYXMgd2l0aCBKYXZhU2NyaXB0J3MgbnVtYmVyIHR5cGUsICgtMCkudG9GaXhlZCgwKSBpcyAnMCcsXHJcbiAgICogYnV0IGUuZy4gKC0wLjAwMDAxKS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAgICpcclxuICAgKiBbZHBdIHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzLiBJbnRlZ2VyLCAwIHRvIE1BWCBpbmNsdXNpdmUuXHJcbiAgICogW3JtXSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlLiBJbnRlZ2VyLCAwIHRvIDggaW5jbHVzaXZlLlxyXG4gICAqXHJcbiAgICogJ1tCaWdOdW1iZXIgRXJyb3JdIEFyZ3VtZW50IHtub3QgYSBwcmltaXRpdmUgbnVtYmVyfG5vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX06IHtkcHxybX0nXHJcbiAgICovXHJcbiAgUC50b0ZpeGVkID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gICAgaWYgKGRwICE9IG51bGwpIHtcclxuICAgICAgaW50Q2hlY2soZHAsIDAsIE1BWCk7XHJcbiAgICAgIGRwID0gZHAgKyB0aGlzLmUgKyAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZvcm1hdCh0aGlzLCBkcCwgcm0pO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnTnVtYmVyIGluIGZpeGVkLXBvaW50IG5vdGF0aW9uIHJvdW5kZWRcclxuICAgKiB1c2luZyBybSBvciBST1VORElOR19NT0RFIHRvIGRwIGRlY2ltYWwgcGxhY2VzLCBhbmQgZm9ybWF0dGVkIGFjY29yZGluZyB0byB0aGUgcHJvcGVydGllc1xyXG4gICAqIG9mIHRoZSBmb3JtYXQgb3IgRk9STUFUIG9iamVjdCAoc2VlIEJpZ051bWJlci5zZXQpLlxyXG4gICAqXHJcbiAgICogVGhlIGZvcm1hdHRpbmcgb2JqZWN0IG1heSBjb250YWluIHNvbWUgb3IgYWxsIG9mIHRoZSBwcm9wZXJ0aWVzIHNob3duIGJlbG93LlxyXG4gICAqXHJcbiAgICogRk9STUFUID0ge1xyXG4gICAqICAgcHJlZml4OiAnJyxcclxuICAgKiAgIGdyb3VwU2l6ZTogMyxcclxuICAgKiAgIHNlY29uZGFyeUdyb3VwU2l6ZTogMCxcclxuICAgKiAgIGdyb3VwU2VwYXJhdG9yOiAnLCcsXHJcbiAgICogICBkZWNpbWFsU2VwYXJhdG9yOiAnLicsXHJcbiAgICogICBmcmFjdGlvbkdyb3VwU2l6ZTogMCxcclxuICAgKiAgIGZyYWN0aW9uR3JvdXBTZXBhcmF0b3I6ICdcXHhBMCcsICAgICAgLy8gbm9uLWJyZWFraW5nIHNwYWNlXHJcbiAgICogICBzdWZmaXg6ICcnXHJcbiAgICogfTtcclxuICAgKlxyXG4gICAqIFtkcF0ge251bWJlcn0gRGVjaW1hbCBwbGFjZXMuIEludGVnZXIsIDAgdG8gTUFYIGluY2x1c2l2ZS5cclxuICAgKiBbcm1dIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGUuIEludGVnZXIsIDAgdG8gOCBpbmNsdXNpdmUuXHJcbiAgICogW2Zvcm1hdF0ge29iamVjdH0gRm9ybWF0dGluZyBvcHRpb25zLiBTZWUgRk9STUFUIHBiamVjdCBhYm92ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7ZHB8cm19J1xyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCBub3QgYW4gb2JqZWN0OiB7Zm9ybWF0fSdcclxuICAgKi9cclxuICBQLnRvRm9ybWF0ID0gZnVuY3Rpb24gKGRwLCBybSwgZm9ybWF0KSB7XHJcbiAgICB2YXIgc3RyLFxyXG4gICAgICB4ID0gdGhpcztcclxuXHJcbiAgICBpZiAoZm9ybWF0ID09IG51bGwpIHtcclxuICAgICAgaWYgKGRwICE9IG51bGwgJiYgcm0gJiYgdHlwZW9mIHJtID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgZm9ybWF0ID0gcm07XHJcbiAgICAgICAgcm0gPSBudWxsO1xyXG4gICAgICB9IGVsc2UgaWYgKGRwICYmIHR5cGVvZiBkcCA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGZvcm1hdCA9IGRwO1xyXG4gICAgICAgIGRwID0gcm0gPSBudWxsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvcm1hdCA9IEZPUk1BVDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZm9ybWF0ICE9ICdvYmplY3QnKSB7XHJcbiAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgKGJpZ251bWJlckVycm9yICsgJ0FyZ3VtZW50IG5vdCBhbiBvYmplY3Q6ICcgKyBmb3JtYXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0ciA9IHgudG9GaXhlZChkcCwgcm0pO1xyXG5cclxuICAgIGlmICh4LmMpIHtcclxuICAgICAgdmFyIGksXHJcbiAgICAgICAgYXJyID0gc3RyLnNwbGl0KCcuJyksXHJcbiAgICAgICAgZzEgPSArZm9ybWF0Lmdyb3VwU2l6ZSxcclxuICAgICAgICBnMiA9ICtmb3JtYXQuc2Vjb25kYXJ5R3JvdXBTaXplLFxyXG4gICAgICAgIGdyb3VwU2VwYXJhdG9yID0gZm9ybWF0Lmdyb3VwU2VwYXJhdG9yIHx8ICcnLFxyXG4gICAgICAgIGludFBhcnQgPSBhcnJbMF0sXHJcbiAgICAgICAgZnJhY3Rpb25QYXJ0ID0gYXJyWzFdLFxyXG4gICAgICAgIGlzTmVnID0geC5zIDwgMCxcclxuICAgICAgICBpbnREaWdpdHMgPSBpc05lZyA/IGludFBhcnQuc2xpY2UoMSkgOiBpbnRQYXJ0LFxyXG4gICAgICAgIGxlbiA9IGludERpZ2l0cy5sZW5ndGg7XHJcblxyXG4gICAgICBpZiAoZzIpIHtcclxuICAgICAgICBpID0gZzE7XHJcbiAgICAgICAgZzEgPSBnMjtcclxuICAgICAgICBnMiA9IGk7XHJcbiAgICAgICAgbGVuIC09IGk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChnMSA+IDAgJiYgbGVuID4gMCkge1xyXG4gICAgICAgIGkgPSBsZW4gJSBnMSB8fCBnMTtcclxuICAgICAgICBpbnRQYXJ0ID0gaW50RGlnaXRzLnN1YnN0cigwLCBpKTtcclxuICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSArPSBnMSkgaW50UGFydCArPSBncm91cFNlcGFyYXRvciArIGludERpZ2l0cy5zdWJzdHIoaSwgZzEpO1xyXG4gICAgICAgIGlmIChnMiA+IDApIGludFBhcnQgKz0gZ3JvdXBTZXBhcmF0b3IgKyBpbnREaWdpdHMuc2xpY2UoaSk7XHJcbiAgICAgICAgaWYgKGlzTmVnKSBpbnRQYXJ0ID0gJy0nICsgaW50UGFydDtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3RyID0gZnJhY3Rpb25QYXJ0XHJcbiAgICAgICA/IGludFBhcnQgKyAoZm9ybWF0LmRlY2ltYWxTZXBhcmF0b3IgfHwgJycpICsgKChnMiA9ICtmb3JtYXQuZnJhY3Rpb25Hcm91cFNpemUpXHJcbiAgICAgICAgPyBmcmFjdGlvblBhcnQucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcZHsnICsgZzIgKyAnfVxcXFxCJywgJ2cnKSxcclxuICAgICAgICAgJyQmJyArIChmb3JtYXQuZnJhY3Rpb25Hcm91cFNlcGFyYXRvciB8fCAnJykpXHJcbiAgICAgICAgOiBmcmFjdGlvblBhcnQpXHJcbiAgICAgICA6IGludFBhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChmb3JtYXQucHJlZml4IHx8ICcnKSArIHN0ciArIChmb3JtYXQuc3VmZml4IHx8ICcnKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLypcclxuICAgKiBSZXR1cm4gYW4gYXJyYXkgb2YgdHdvIEJpZ051bWJlcnMgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBhcyBhIHNpbXBsZVxyXG4gICAqIGZyYWN0aW9uIHdpdGggYW4gaW50ZWdlciBudW1lcmF0b3IgYW5kIGFuIGludGVnZXIgZGVub21pbmF0b3IuXHJcbiAgICogVGhlIGRlbm9taW5hdG9yIHdpbGwgYmUgYSBwb3NpdGl2ZSBub24temVybyB2YWx1ZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHNwZWNpZmllZFxyXG4gICAqIG1heGltdW0gZGVub21pbmF0b3IuIElmIGEgbWF4aW11bSBkZW5vbWluYXRvciBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgZGVub21pbmF0b3Igd2lsbCBiZVxyXG4gICAqIHRoZSBsb3dlc3QgdmFsdWUgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudCB0aGUgbnVtYmVyIGV4YWN0bHkuXHJcbiAgICpcclxuICAgKiBbbWRdIHtudW1iZXJ8c3RyaW5nfEJpZ051bWJlcn0gSW50ZWdlciA+PSAxLCBvciBJbmZpbml0eS4gVGhlIG1heGltdW0gZGVub21pbmF0b3IuXHJcbiAgICpcclxuICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQXJndW1lbnQge25vdCBhbiBpbnRlZ2VyfG91dCBvZiByYW5nZX0gOiB7bWR9J1xyXG4gICAqL1xyXG4gIFAudG9GcmFjdGlvbiA9IGZ1bmN0aW9uIChtZCkge1xyXG4gICAgdmFyIGQsIGQwLCBkMSwgZDIsIGUsIGV4cCwgbiwgbjAsIG4xLCBxLCByLCBzLFxyXG4gICAgICB4ID0gdGhpcyxcclxuICAgICAgeGMgPSB4LmM7XHJcblxyXG4gICAgaWYgKG1kICE9IG51bGwpIHtcclxuICAgICAgbiA9IG5ldyBCaWdOdW1iZXIobWQpO1xyXG5cclxuICAgICAgLy8gVGhyb3cgaWYgbWQgaXMgbGVzcyB0aGFuIG9uZSBvciBpcyBub3QgYW4gaW50ZWdlciwgdW5sZXNzIGl0IGlzIEluZmluaXR5LlxyXG4gICAgICBpZiAoIW4uaXNJbnRlZ2VyKCkgJiYgKG4uYyB8fCBuLnMgIT09IDEpIHx8IG4ubHQoT05FKSkge1xyXG4gICAgICAgIHRocm93IEVycm9yXHJcbiAgICAgICAgICAoYmlnbnVtYmVyRXJyb3IgKyAnQXJndW1lbnQgJyArXHJcbiAgICAgICAgICAgIChuLmlzSW50ZWdlcigpID8gJ291dCBvZiByYW5nZTogJyA6ICdub3QgYW4gaW50ZWdlcjogJykgKyB2YWx1ZU9mKG4pKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICgheGMpIHJldHVybiBuZXcgQmlnTnVtYmVyKHgpO1xyXG5cclxuICAgIGQgPSBuZXcgQmlnTnVtYmVyKE9ORSk7XHJcbiAgICBuMSA9IGQwID0gbmV3IEJpZ051bWJlcihPTkUpO1xyXG4gICAgZDEgPSBuMCA9IG5ldyBCaWdOdW1iZXIoT05FKTtcclxuICAgIHMgPSBjb2VmZlRvU3RyaW5nKHhjKTtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgaW5pdGlhbCBkZW5vbWluYXRvci5cclxuICAgIC8vIGQgaXMgYSBwb3dlciBvZiAxMCBhbmQgdGhlIG1pbmltdW0gbWF4IGRlbm9taW5hdG9yIHRoYXQgc3BlY2lmaWVzIHRoZSB2YWx1ZSBleGFjdGx5LlxyXG4gICAgZSA9IGQuZSA9IHMubGVuZ3RoIC0geC5lIC0gMTtcclxuICAgIGQuY1swXSA9IFBPV1NfVEVOWyhleHAgPSBlICUgTE9HX0JBU0UpIDwgMCA/IExPR19CQVNFICsgZXhwIDogZXhwXTtcclxuICAgIG1kID0gIW1kIHx8IG4uY29tcGFyZWRUbyhkKSA+IDAgPyAoZSA+IDAgPyBkIDogbjEpIDogbjtcclxuXHJcbiAgICBleHAgPSBNQVhfRVhQO1xyXG4gICAgTUFYX0VYUCA9IDEgLyAwO1xyXG4gICAgbiA9IG5ldyBCaWdOdW1iZXIocyk7XHJcblxyXG4gICAgLy8gbjAgPSBkMSA9IDBcclxuICAgIG4wLmNbMF0gPSAwO1xyXG5cclxuICAgIGZvciAoOyA7KSAge1xyXG4gICAgICBxID0gZGl2KG4sIGQsIDAsIDEpO1xyXG4gICAgICBkMiA9IGQwLnBsdXMocS50aW1lcyhkMSkpO1xyXG4gICAgICBpZiAoZDIuY29tcGFyZWRUbyhtZCkgPT0gMSkgYnJlYWs7XHJcbiAgICAgIGQwID0gZDE7XHJcbiAgICAgIGQxID0gZDI7XHJcbiAgICAgIG4xID0gbjAucGx1cyhxLnRpbWVzKGQyID0gbjEpKTtcclxuICAgICAgbjAgPSBkMjtcclxuICAgICAgZCA9IG4ubWludXMocS50aW1lcyhkMiA9IGQpKTtcclxuICAgICAgbiA9IGQyO1xyXG4gICAgfVxyXG5cclxuICAgIGQyID0gZGl2KG1kLm1pbnVzKGQwKSwgZDEsIDAsIDEpO1xyXG4gICAgbjAgPSBuMC5wbHVzKGQyLnRpbWVzKG4xKSk7XHJcbiAgICBkMCA9IGQwLnBsdXMoZDIudGltZXMoZDEpKTtcclxuICAgIG4wLnMgPSBuMS5zID0geC5zO1xyXG4gICAgZSA9IGUgKiAyO1xyXG5cclxuICAgIC8vIERldGVybWluZSB3aGljaCBmcmFjdGlvbiBpcyBjbG9zZXIgdG8geCwgbjAvZDAgb3IgbjEvZDFcclxuICAgIHIgPSBkaXYobjEsIGQxLCBlLCBST1VORElOR19NT0RFKS5taW51cyh4KS5hYnMoKS5jb21wYXJlZFRvKFxyXG4gICAgICAgIGRpdihuMCwgZDAsIGUsIFJPVU5ESU5HX01PREUpLm1pbnVzKHgpLmFicygpKSA8IDEgPyBbbjEsIGQxXSA6IFtuMCwgZDBdO1xyXG5cclxuICAgIE1BWF9FWFAgPSBleHA7XHJcblxyXG4gICAgcmV0dXJuIHI7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZ051bWJlciBjb252ZXJ0ZWQgdG8gYSBudW1iZXIgcHJpbWl0aXZlLlxyXG4gICAqL1xyXG4gIFAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gK3ZhbHVlT2YodGhpcyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgcm91bmRlZCB0byBzZCBzaWduaWZpY2FudCBkaWdpdHNcclxuICAgKiB1c2luZyByb3VuZGluZyBtb2RlIHJtIG9yIFJPVU5ESU5HX01PREUuIElmIHNkIGlzIGxlc3MgdGhhbiB0aGUgbnVtYmVyIG9mIGRpZ2l0c1xyXG4gICAqIG5lY2Vzc2FyeSB0byByZXByZXNlbnQgdGhlIGludGVnZXIgcGFydCBvZiB0aGUgdmFsdWUgaW4gZml4ZWQtcG9pbnQgbm90YXRpb24sIHRoZW4gdXNlXHJcbiAgICogZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICpcclxuICAgKiBbc2RdIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0cy4gSW50ZWdlciwgMSB0byBNQVggaW5jbHVzaXZlLlxyXG4gICAqIFtybV0ge251bWJlcn0gUm91bmRpbmcgbW9kZS4gSW50ZWdlciwgMCB0byA4IGluY2x1c2l2ZS5cclxuICAgKlxyXG4gICAqICdbQmlnTnVtYmVyIEVycm9yXSBBcmd1bWVudCB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7c2R8cm19J1xyXG4gICAqL1xyXG4gIFAudG9QcmVjaXNpb24gPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgICBpZiAoc2QgIT0gbnVsbCkgaW50Q2hlY2soc2QsIDEsIE1BWCk7XHJcbiAgICByZXR1cm4gZm9ybWF0KHRoaXMsIHNkLCBybSwgMik7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWdOdW1iZXIgaW4gYmFzZSBiLCBvciBiYXNlIDEwIGlmIGIgaXNcclxuICAgKiBvbWl0dGVkLiBJZiBhIGJhc2UgaXMgc3BlY2lmaWVkLCBpbmNsdWRpbmcgYmFzZSAxMCwgcm91bmQgYWNjb3JkaW5nIHRvIERFQ0lNQUxfUExBQ0VTIGFuZFxyXG4gICAqIFJPVU5ESU5HX01PREUuIElmIGEgYmFzZSBpcyBub3Qgc3BlY2lmaWVkLCBhbmQgdGhpcyBCaWdOdW1iZXIgaGFzIGEgcG9zaXRpdmUgZXhwb25lbnRcclxuICAgKiB0aGF0IGlzIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBUT19FWFBfUE9TLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhblxyXG4gICAqIFRPX0VYUF9ORUcsIHJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgKlxyXG4gICAqIFtiXSB7bnVtYmVyfSBJbnRlZ2VyLCAyIHRvIEFMUEhBQkVULmxlbmd0aCBpbmNsdXNpdmUuXHJcbiAgICpcclxuICAgKiAnW0JpZ051bWJlciBFcnJvcl0gQmFzZSB7bm90IGEgcHJpbWl0aXZlIG51bWJlcnxub3QgYW4gaW50ZWdlcnxvdXQgb2YgcmFuZ2V9OiB7Yn0nXHJcbiAgICovXHJcbiAgUC50b1N0cmluZyA9IGZ1bmN0aW9uIChiKSB7XHJcbiAgICB2YXIgc3RyLFxyXG4gICAgICBuID0gdGhpcyxcclxuICAgICAgcyA9IG4ucyxcclxuICAgICAgZSA9IG4uZTtcclxuXHJcbiAgICAvLyBJbmZpbml0eSBvciBOYU4/XHJcbiAgICBpZiAoZSA9PT0gbnVsbCkge1xyXG4gICAgICBpZiAocykge1xyXG4gICAgICAgIHN0ciA9ICdJbmZpbml0eSc7XHJcbiAgICAgICAgaWYgKHMgPCAwKSBzdHIgPSAnLScgKyBzdHI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3RyID0gJ05hTic7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChiID09IG51bGwpIHtcclxuICAgICAgICBzdHIgPSBlIDw9IFRPX0VYUF9ORUcgfHwgZSA+PSBUT19FWFBfUE9TXHJcbiAgICAgICAgID8gdG9FeHBvbmVudGlhbChjb2VmZlRvU3RyaW5nKG4uYyksIGUpXHJcbiAgICAgICAgIDogdG9GaXhlZFBvaW50KGNvZWZmVG9TdHJpbmcobi5jKSwgZSwgJzAnKTtcclxuICAgICAgfSBlbHNlIGlmIChiID09PSAxMCAmJiBhbHBoYWJldEhhc05vcm1hbERlY2ltYWxEaWdpdHMpIHtcclxuICAgICAgICBuID0gcm91bmQobmV3IEJpZ051bWJlcihuKSwgREVDSU1BTF9QTEFDRVMgKyBlICsgMSwgUk9VTkRJTkdfTU9ERSk7XHJcbiAgICAgICAgc3RyID0gdG9GaXhlZFBvaW50KGNvZWZmVG9TdHJpbmcobi5jKSwgbi5lLCAnMCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGludENoZWNrKGIsIDIsIEFMUEhBQkVULmxlbmd0aCwgJ0Jhc2UnKTtcclxuICAgICAgICBzdHIgPSBjb252ZXJ0QmFzZSh0b0ZpeGVkUG9pbnQoY29lZmZUb1N0cmluZyhuLmMpLCBlLCAnMCcpLCAxMCwgYiwgcywgdHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzIDwgMCAmJiBuLmNbMF0pIHN0ciA9ICctJyArIHN0cjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RyO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIFJldHVybiBhcyB0b1N0cmluZywgYnV0IGRvIG5vdCBhY2NlcHQgYSBiYXNlIGFyZ3VtZW50LCBhbmQgaW5jbHVkZSB0aGUgbWludXMgc2lnbiBmb3JcclxuICAgKiBuZWdhdGl2ZSB6ZXJvLlxyXG4gICAqL1xyXG4gIFAudmFsdWVPZiA9IFAudG9KU09OID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHZhbHVlT2YodGhpcyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIFAuX2lzQmlnTnVtYmVyID0gdHJ1ZTtcclxuXHJcbiAgUFtTeW1ib2wudG9TdHJpbmdUYWddID0gJ0JpZ051bWJlcic7XHJcblxyXG4gIC8vIE5vZGUuanMgdjEwLjEyLjArXHJcbiAgUFtTeW1ib2wuZm9yKCdub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbScpXSA9IFAudmFsdWVPZjtcclxuXHJcbiAgaWYgKGNvbmZpZ09iamVjdCAhPSBudWxsKSBCaWdOdW1iZXIuc2V0KGNvbmZpZ09iamVjdCk7XHJcblxyXG4gIHJldHVybiBCaWdOdW1iZXI7XHJcbn1cclxuXHJcblxyXG4vLyBQUklWQVRFIEhFTFBFUiBGVU5DVElPTlNcclxuXHJcbi8vIFRoZXNlIGZ1bmN0aW9ucyBkb24ndCBuZWVkIGFjY2VzcyB0byB2YXJpYWJsZXMsXHJcbi8vIGUuZy4gREVDSU1BTF9QTEFDRVMsIGluIHRoZSBzY29wZSBvZiB0aGUgYGNsb25lYCBmdW5jdGlvbiBhYm92ZS5cclxuXHJcblxyXG5mdW5jdGlvbiBiaXRGbG9vcihuKSB7XHJcbiAgdmFyIGkgPSBuIHwgMDtcclxuICByZXR1cm4gbiA+IDAgfHwgbiA9PT0gaSA/IGkgOiBpIC0gMTtcclxufVxyXG5cclxuXHJcbi8vIFJldHVybiBhIGNvZWZmaWNpZW50IGFycmF5IGFzIGEgc3RyaW5nIG9mIGJhc2UgMTAgZGlnaXRzLlxyXG5mdW5jdGlvbiBjb2VmZlRvU3RyaW5nKGEpIHtcclxuICB2YXIgcywgeixcclxuICAgIGkgPSAxLFxyXG4gICAgaiA9IGEubGVuZ3RoLFxyXG4gICAgciA9IGFbMF0gKyAnJztcclxuXHJcbiAgZm9yICg7IGkgPCBqOykge1xyXG4gICAgcyA9IGFbaSsrXSArICcnO1xyXG4gICAgeiA9IExPR19CQVNFIC0gcy5sZW5ndGg7XHJcbiAgICBmb3IgKDsgei0tOyBzID0gJzAnICsgcyk7XHJcbiAgICByICs9IHM7XHJcbiAgfVxyXG5cclxuICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yIChqID0gci5sZW5ndGg7IHIuY2hhckNvZGVBdCgtLWopID09PSA0ODspO1xyXG5cclxuICByZXR1cm4gci5zbGljZSgwLCBqICsgMSB8fCAxKTtcclxufVxyXG5cclxuXHJcbi8vIENvbXBhcmUgdGhlIHZhbHVlIG9mIEJpZ051bWJlcnMgeCBhbmQgeS5cclxuZnVuY3Rpb24gY29tcGFyZSh4LCB5KSB7XHJcbiAgdmFyIGEsIGIsXHJcbiAgICB4YyA9IHguYyxcclxuICAgIHljID0geS5jLFxyXG4gICAgaSA9IHgucyxcclxuICAgIGogPSB5LnMsXHJcbiAgICBrID0geC5lLFxyXG4gICAgbCA9IHkuZTtcclxuXHJcbiAgLy8gRWl0aGVyIE5hTj9cclxuICBpZiAoIWkgfHwgIWopIHJldHVybiBudWxsO1xyXG5cclxuICBhID0geGMgJiYgIXhjWzBdO1xyXG4gIGIgPSB5YyAmJiAheWNbMF07XHJcblxyXG4gIC8vIEVpdGhlciB6ZXJvP1xyXG4gIGlmIChhIHx8IGIpIHJldHVybiBhID8gYiA/IDAgOiAtaiA6IGk7XHJcblxyXG4gIC8vIFNpZ25zIGRpZmZlcj9cclxuICBpZiAoaSAhPSBqKSByZXR1cm4gaTtcclxuXHJcbiAgYSA9IGkgPCAwO1xyXG4gIGIgPSBrID09IGw7XHJcblxyXG4gIC8vIEVpdGhlciBJbmZpbml0eT9cclxuICBpZiAoIXhjIHx8ICF5YykgcmV0dXJuIGIgPyAwIDogIXhjIF4gYSA/IDEgOiAtMTtcclxuXHJcbiAgLy8gQ29tcGFyZSBleHBvbmVudHMuXHJcbiAgaWYgKCFiKSByZXR1cm4gayA+IGwgXiBhID8gMSA6IC0xO1xyXG5cclxuICBqID0gKGsgPSB4Yy5sZW5ndGgpIDwgKGwgPSB5Yy5sZW5ndGgpID8gayA6IGw7XHJcblxyXG4gIC8vIENvbXBhcmUgZGlnaXQgYnkgZGlnaXQuXHJcbiAgZm9yIChpID0gMDsgaSA8IGo7IGkrKykgaWYgKHhjW2ldICE9IHljW2ldKSByZXR1cm4geGNbaV0gPiB5Y1tpXSBeIGEgPyAxIDogLTE7XHJcblxyXG4gIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICByZXR1cm4gayA9PSBsID8gMCA6IGsgPiBsIF4gYSA/IDEgOiAtMTtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIENoZWNrIHRoYXQgbiBpcyBhIHByaW1pdGl2ZSBudW1iZXIsIGFuIGludGVnZXIsIGFuZCBpbiByYW5nZSwgb3RoZXJ3aXNlIHRocm93LlxyXG4gKi9cclxuZnVuY3Rpb24gaW50Q2hlY2sobiwgbWluLCBtYXgsIG5hbWUpIHtcclxuICBpZiAobiA8IG1pbiB8fCBuID4gbWF4IHx8IG4gIT09IG1hdGhmbG9vcihuKSkge1xyXG4gICAgdGhyb3cgRXJyb3JcclxuICAgICAoYmlnbnVtYmVyRXJyb3IgKyAobmFtZSB8fCAnQXJndW1lbnQnKSArICh0eXBlb2YgbiA9PSAnbnVtYmVyJ1xyXG4gICAgICAgPyBuIDwgbWluIHx8IG4gPiBtYXggPyAnIG91dCBvZiByYW5nZTogJyA6ICcgbm90IGFuIGludGVnZXI6ICdcclxuICAgICAgIDogJyBub3QgYSBwcmltaXRpdmUgbnVtYmVyOiAnKSArIFN0cmluZyhuKSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8gQXNzdW1lcyBmaW5pdGUgbi5cclxuZnVuY3Rpb24gaXNPZGQobikge1xyXG4gIHZhciBrID0gbi5jLmxlbmd0aCAtIDE7XHJcbiAgcmV0dXJuIGJpdEZsb29yKG4uZSAvIExPR19CQVNFKSA9PSBrICYmIG4uY1trXSAlIDIgIT0gMDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHRvRXhwb25lbnRpYWwoc3RyLCBlKSB7XHJcbiAgcmV0dXJuIChzdHIubGVuZ3RoID4gMSA/IHN0ci5jaGFyQXQoMCkgKyAnLicgKyBzdHIuc2xpY2UoMSkgOiBzdHIpICtcclxuICAgKGUgPCAwID8gJ2UnIDogJ2UrJykgKyBlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdG9GaXhlZFBvaW50KHN0ciwgZSwgeikge1xyXG4gIHZhciBsZW4sIHpzO1xyXG5cclxuICAvLyBOZWdhdGl2ZSBleHBvbmVudD9cclxuICBpZiAoZSA8IDApIHtcclxuXHJcbiAgICAvLyBQcmVwZW5kIHplcm9zLlxyXG4gICAgZm9yICh6cyA9IHogKyAnLic7ICsrZTsgenMgKz0geik7XHJcbiAgICBzdHIgPSB6cyArIHN0cjtcclxuXHJcbiAgLy8gUG9zaXRpdmUgZXhwb25lbnRcclxuICB9IGVsc2Uge1xyXG4gICAgbGVuID0gc3RyLmxlbmd0aDtcclxuXHJcbiAgICAvLyBBcHBlbmQgemVyb3MuXHJcbiAgICBpZiAoKytlID4gbGVuKSB7XHJcbiAgICAgIGZvciAoenMgPSB6LCBlIC09IGxlbjsgLS1lOyB6cyArPSB6KTtcclxuICAgICAgc3RyICs9IHpzO1xyXG4gICAgfSBlbHNlIGlmIChlIDwgbGVuKSB7XHJcbiAgICAgIHN0ciA9IHN0ci5zbGljZSgwLCBlKSArICcuJyArIHN0ci5zbGljZShlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBzdHI7XHJcbn1cclxuXHJcblxyXG4vLyBFWFBPUlRcclxuXHJcblxyXG5leHBvcnQgdmFyIEJpZ051bWJlciA9IGNsb25lKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCaWdOdW1iZXI7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2Fzc2V0cy9qYXZhc2NyaXB0L2Zpcm13YXJlLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9