// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/VaultFactory.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        new VaultFactory();
        vm.stopBroadcast();
    }
}
