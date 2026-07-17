// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/Vault.sol";
import "../src/VaultFactory.sol";

contract VaultTest is Test {
    VaultFactory public factory;
    Vault public vault;

    address public user = address(1);
    address public agent = address(2);
    
    address public tokenA = address(100);
    address public tokenB = address(200);

    function setUp() public {
        factory = new VaultFactory();

        address[] memory tokens = new address[](2);
        tokens[0] = tokenA;
        tokens[1] = tokenB;

        vm.prank(user);
        address clone = factory.deployVault(agent, 1000 ether, 5000 ether, tokens);
        vault = Vault(payable(clone));
    }

    function test_InitialState() public view {
        assertEq(vault.owner(), user);
        assertEq(vault.agent(), agent);
        assertEq(vault.maxSwapSize(), 1000 ether);
        assertEq(vault.dailyLossLimit(), 5000 ether);
        assertTrue(vault.whitelistedTokens(tokenA));
        assertTrue(vault.whitelistedTokens(tokenB));
    }

    function test_ExecuteTrade_Success() public {
        vm.prank(agent);
        // Valid trade: 500 in, 100 projected loss (within rules)
        vault.executeTrade(tokenA, tokenB, 500 ether, 100 ether, "");
        assertEq(vault.currentDayLoss(), 100 ether);
    }

    function testRevert_ExecuteTrade_MaxSwapExceeded() public {
        vm.prank(agent);
        // Try to swap 1500 (limit is 1000)
        vm.expectRevert(abi.encodeWithSelector(Vault.ExceedsMaxSwapSize.selector, 1500 ether));
        vault.executeTrade(tokenA, tokenB, 1500 ether, 0, "");
    }

    function testRevert_ExecuteTrade_DailyLossExceeded() public {
        vm.prank(agent);
        // Execute a trade with 5100 loss (limit is 5000)
        vm.expectRevert(abi.encodeWithSelector(Vault.ExceedsDailyLossLimit.selector, 5100 ether));
        vault.executeTrade(tokenA, tokenB, 500 ether, 5100 ether, "");
    }

    function testRevert_ExecuteTrade_UnwhitelistedToken() public {
        address tokenC = address(300);
        vm.prank(agent);
        vm.expectRevert(abi.encodeWithSelector(Vault.TokenNotWhitelisted.selector, tokenC));
        vault.executeTrade(tokenA, tokenC, 500 ether, 0, "");
    }

    function test_KillSwitch() public {
        vm.prank(user);
        vault.killSwitch();
        assertTrue(vault.isFrozen());

        vm.prank(agent);
        vm.expectRevert(Vault.VaultIsFrozen.selector);
        vault.executeTrade(tokenA, tokenB, 500 ether, 0, "");
    }
}
