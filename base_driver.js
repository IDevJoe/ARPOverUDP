/*
 * Base driver for basic testing
 */

module.exports = function() {
    return new Promise((res, rej) => res({
        "0.0.0.0": {mac: "00:00:00:00:00", int: "eth0"}
    }));
}