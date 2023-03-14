// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Test {
    uint256 totalBumps;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function bump() public {
        totalBumps += 1;
        console.log("%s has bumped!", msg.sender);
    }

    function getTotalBumps() public view returns (uint256) {
        console.log("We have %d total bumps!", totalBumps);
        return totalBumps;
    }
}