// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "openzeppelin-contracts/contracts/proxy/Clones.sol";
import "./Vault.sol";

contract VaultFactory {
    address public immutable vaultImplementation;

    event VaultDeployed(address indexed vaultAddress, address indexed owner, address agent);

    constructor() {
        // Deploy the master implementation that all clones will point to
        vaultImplementation = address(new Vault());
    }

    /**
     * @dev Deploys a new isolated Vault for a user using EIP-1167 minimal proxies.
     */
    function deployVault(
        address agent,
        uint256 maxSwapSize,
        uint256 dailyLossLimit,
        address[] memory tokens
    ) external returns (address) {
        address clone = Clones.clone(vaultImplementation);
        Vault(payable(clone)).initialize(msg.sender, agent, maxSwapSize, dailyLossLimit, tokens);
        
        emit VaultDeployed(clone, msg.sender, agent);
        return clone;
    }
}
