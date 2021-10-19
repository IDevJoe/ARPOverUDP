# ARPOverUDP
Enables local applications to resolve IPs to MAC addresses when running in a VM or container

## Setup
- Clone this repository to the host machine
- `npm start`

## UDP Service
The UDP service runs on port 1834 and is bound to 127.0.0.1 by default.

To use, send a packet to the service with the 4-byte IP address
(ex. `0A 00 00 01 (hex)` for 10.1.0.1). The server will respond
with the MAC address and interface from the host machine.

### Response is structured as follows

hex: `[00 00 00 00 00 00] [01] [FF]`
- Group 1: 6-byte MAC address; For this example, the decoded address is 00:00:00:00:00:00
- Group 2: Interface name length
- Group 3: Interface name

## Contributing
Contributions are always welcome. Fork the repository, make your changes, and create
a pull request. Please ensure that you are submitting a quality pull request when
you're ready.