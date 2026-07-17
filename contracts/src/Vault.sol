// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";

contract Vault is Initializable {
    address public owner;
    address public agent;

    uint256 public maxSwapSize;
    uint256 public dailyLossLimit;
    bool public isFrozen;

    mapping(address => bool) public whitelistedTokens;

    // A simplified struct to track daily loss (using block.timestamp / 1 days)
    uint256 public currentDay;
    uint256 public currentDayLoss;

    event TradeExecuted(address indexed token, uint256 amountIn, uint256 amountOut, bool isSell);
    event VaultFrozen();
    event VaultUnfrozen();

    error NotAuthorized();
    error VaultIsFrozen();
    error TokenNotWhitelisted(address token);
    error ExceedsMaxSwapSize(uint256 amount);
    error ExceedsDailyLossLimit(uint256 projectedLoss);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAuthorized();
        _;
    }

    modifier onlyAgentOrOwner() {
        if (msg.sender != agent && msg.sender != owner) revert NotAuthorized();
        _;
    }

    modifier notFrozen() {
        if (isFrozen) revert VaultIsFrozen();
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the clone. Replaces constructor.
     */
    function initialize(
        address _owner,
        address _agent,
        uint256 _maxSwapSize,
        uint256 _dailyLossLimit,
        address[] memory _tokens
    ) public initializer {
        owner = _owner;
        agent = _agent;
        maxSwapSize = _maxSwapSize;
        dailyLossLimit = _dailyLossLimit;

        for (uint i = 0; i < _tokens.length; i++) {
            whitelistedTokens[_tokens[i]] = true;
        }

        currentDay = block.timestamp / 1 days;
    }

    /**
     * @dev Freezes the vault. Immediate kill switch.
     */
    function killSwitch() external onlyOwner {
        isFrozen = true;
        emit VaultFrozen();
    }

    /**
     * @dev Unfreezes the vault.
     */
    function unfreeze() external onlyOwner {
        isFrozen = false;
        emit VaultUnfrozen();
    }

    /**
     * @dev Executes a generic transaction. 
     * In a real deployment, this would interact with an AMM router like Uniswap.
     * We simulate the checks here for the hackathon.
     */
    function executeTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 projectedLoss, // Simulated slippage/loss for the rules engine
        bytes calldata data // The actual DEX payload
    ) external onlyAgentOrOwner notFrozen {
        if (!whitelistedTokens[tokenIn]) revert TokenNotWhitelisted(tokenIn);
        if (!whitelistedTokens[tokenOut]) revert TokenNotWhitelisted(tokenOut);
        
        if (amountIn > maxSwapSize) revert ExceedsMaxSwapSize(amountIn);

        // Daily loss accounting
        uint256 today = block.timestamp / 1 days;
        if (today > currentDay) {
            currentDay = today;
            currentDayLoss = 0;
        }

        if (currentDayLoss + projectedLoss > dailyLossLimit) {
            revert ExceedsDailyLossLimit(currentDayLoss + projectedLoss);
        }

        currentDayLoss += projectedLoss;

        // Note: For hackathon safety, we won't execute arbitrary arbitrary data payload unless it's properly decoded,
        // but this shows the rule enforcement wrapper around it.
        
        // (bool success, ) = target.call(data);
        // require(success, "Trade failed");

        emit TradeExecuted(tokenIn, amountIn, 0, true);
    }

    // Allow vault to receive native Monad
    receive() external payable {}
}
