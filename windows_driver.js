/*
 * Windows-based driver for extracting ARP information
 */

const {exec} = require("child_process");

module.exports = function() {
    return new Promise((res, rej) => {
        exec('arp -a', (err, stdout, stderr) => {
            let newarp = {};
            let spl = stdout.split('\n');

            let currentint = null;
            let sk1 = false;
            const int_reg = /Interface: (.*) --- (.*)/;
            const rec_reg = /((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s+((?:[0-9a-z]{2}-){5}[0-9a-z]{2})\s+(dynamic|static)/;
            for(let i=0;i<spl.length;i++) {
                let match = spl[i].match(int_reg);
                if(match != null)
                {
                    currentint = match[2];
                    sk1 = true;
                    continue;
                }
                if(sk1) {
                    sk1 = false;
                    continue;
                }
                if(currentint == null) continue;
                let match2 = spl[i].match(rec_reg);
                if(match2 == null) continue;
                newarp[match2[1]] = {mac: match2[2].replace(/-/g, ':'), int: currentint};
            }
            res(newarp);
        });
    });
};