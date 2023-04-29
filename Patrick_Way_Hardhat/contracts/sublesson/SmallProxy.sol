// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/proxy/Proxy.sol";

contract SmallProxy is Proxy {
    // This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1
    bytes32 private constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    //whatever stored at this location will be the implementation contract

    function setImplementation(address newImplementation) public {
        assembly {
            sstore(_IMPLEMENTATION_SLOT, newImplementation)
        }
    } //this set up the implementation contract where the calls will be delegated

    function _implementation()
        internal
        view
        override
        returns (address implementationAddress)
    {
        assembly {
            implementationAddress := sload(_IMPLEMENTATION_SLOT)
        }
    } //function to read where the implementation contract is and is called by the fallback of Proxy contract(taken from openZeppelin)

    //while working with proxies we do not want anything to be in storage
    //bcoz if we delegate calls and that delegate call changes some storage
    //then it will screw contract storage

    //but we still need to store that implementation address somewhere
    //so we use ERP1976 standard proxy storageslot

    // helper function
    function getDataToTransact(
        uint256 numberToUpdate
    ) public pure returns (bytes memory) {
        return abi.encodeWithSignature("setValue(uint256)", numberToUpdate);
    }

    function readStorage()
        public
        view
        returns (uint256 valueAtStorageSlotZero)
    {
        assembly {
            valueAtStorageSlotZero := sload(0)
        }
    }
}

contract ImplementationA {
    uint256 public value;

    function setValue(uint256 newValue) public {
        value = newValue;
    }
}

contract ImplementationB {
    uint256 public value;

    function setValue(uint256 newValue) public {
        value = newValue + 2;
    }
}

// function setImplementation(){}
// Transparent Proxy -> Ok, only admins can call functions on the proxy
// anyone else ALWAYS gets sent to the fallback contract.

// UUPS -> Where all upgrade logic is in the implementation contract, and
// you can't have 2 functions with the same function selector.
