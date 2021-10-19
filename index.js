/*
 * This script allows local apps to identify local addresses
 * by their MAC via UDP.
 */
let driver = require('./base_driver'); // Fallback driver
const dgram = require('dgram');

// Detect operating system for driver selection
if(process.platform === "win32") driver = require('./windows_driver');
else driver = require('./linux_driver');

// Schedule ARP updating
let latest_arp = null;

driver().then(e => {
    latest_arp = e;
    console.log(`Initial ARP population complete. ${Object.keys(latest_arp).length} entries.`)
});
setTimeout(() => {
    driver().then(e => latest_arp = e);
}, 30000);

// Initialize UDP
let socket = dgram.createSocket("udp4");

socket.on('message', (msg, rinfo) => {
    if (msg.length !== 4) return;
    let addr = [];
    for(let i=0;i<4;i++) {
        addr.push(msg[i]);
    }
    let text = addr.join('.');
    let entry = latest_arp[text];
    if(entry === undefined) {
        socket.send("\0", rinfo.port, rinfo.address);
        return;
    }
    let buff = Buffer.alloc(11 + entry.int.length);
    let splmac = entry.mac.split(':');
    for(let i=0;i<4;i++) {
        buff.writeUInt8(addr[i], i)
    }
    for(let i=0;i<6;i++) {
        buff.writeUInt8(parseInt(splmac[i], 16), i+4);
    }
    buff.writeUInt8(entry.int.length, 10);
    buff.write(entry.int, 11, "utf8");
    socket.send(buff, rinfo.port, rinfo.address);
});

// Start this bitc-
socket.bind(1834, "127.0.0.1");

console.log(`Loading complete.`);