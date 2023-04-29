// SPDX-License-Identifier: MIT
//This contract is the admin of the proxy contract and this admin contract is owned by owner/DAO
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract BoxProxyAdmin is ProxyAdmin {
    constructor(address /* owner */) ProxyAdmin() {
        // We just need this for our hardhat tooling right now
    }
}
