/*
 * Linux-based driver for extracting ARP information
 */

const {exec} = require("child_process");

module.exports = function() {
    return new Promise((res, rej) => {
        exec('ip neigh show', (err, stdout, stderr) => {
            let newarp = {};
            let spl = stdout.split('\n');

            const reg = /((?:[0-9]{1,3}\.){3}[0-9]{1,3}) dev (.*) lladdr ((?:[0-9a-z]{2}:){5}[0-9a-z]{2}) (STALE|REACHABLE)/;
            spl.forEach(e => {
                let match = e.match(reg);
                if(match == null) return;
                newarp[match[1]] = {mac: match[3], int: match[2]};
            });
            res(newarp);
        });
    });
};