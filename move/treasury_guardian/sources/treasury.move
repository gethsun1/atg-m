module treasury_guardian::treasury {
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::event;
    use aptos_framework::account;

    /// Error codes
    const E_NOT_OWNER: u64 = 1;
    const E_TREASURY_ALREADY_EXISTS: u64 = 2;
    const E_TREASURY_NOT_FOUND: u64 = 3;
    const E_NO_PENDING_PROPOSAL: u64 = 4;
    const E_INVALID_ALLOCATION: u64 = 5;

    /// Treasury state stored per account
    struct TreasuryState has key {
        owner: address,
        balance: u64,
        last_action_timestamp: u64,
        pending_proposal: vector<u64>, // Empty vector means no proposal
    }

    /// Event emitted when treasury is initialized
    #[event]
    struct TreasuryInitializedEvent has drop, store {
        owner: address,
        initial_balance: u64,
        timestamp: u64,
    }

    /// Event emitted when rebalance is proposed
    #[event]
    struct RebalanceProposedEvent has drop, store {
        owner: address,
        target_allocation: vector<u64>,
        timestamp: u64,
    }

    /// Event emitted when rebalance is executed
    #[event]
    struct RebalanceExecutedEvent has drop, store {
        owner: address,
        executed_allocation: vector<u64>,
        timestamp: u64,
    }

    /// Initialize treasury for the signer
    public entry fun initialize_treasury(owner: &signer, initial_balance: u64) {
        let owner_addr = signer::address_of(owner);
        
        // Ensure treasury doesn't already exist
        assert!(!exists<TreasuryState>(owner_addr), E_TREASURY_ALREADY_EXISTS);

        // Create treasury state
        let treasury = TreasuryState {
            owner: owner_addr,
            balance: initial_balance,
            last_action_timestamp: timestamp::now_seconds(),
            pending_proposal: vector::empty<u64>(),
        };

        // Store treasury state
        move_to(owner, treasury);

        // Emit event
        event::emit(TreasuryInitializedEvent {
            owner: owner_addr,
            initial_balance,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Propose a rebalance with target allocation
    public entry fun propose_rebalance(
        owner: &signer,
        target_allocation: vector<u64>
    ) acquires TreasuryState {
        let owner_addr = signer::address_of(owner);
        
        // Ensure treasury exists
        assert!(exists<TreasuryState>(owner_addr), E_TREASURY_NOT_FOUND);
        
        let treasury = borrow_global_mut<TreasuryState>(owner_addr);
        
        // Verify ownership
        assert!(treasury.owner == owner_addr, E_NOT_OWNER);
        
        // Validate allocation (basic check - not empty)
        assert!(!vector::is_empty(&target_allocation), E_INVALID_ALLOCATION);
        
        // Store proposal
        treasury.pending_proposal = target_allocation;
        treasury.last_action_timestamp = timestamp::now_seconds();

        // Emit event
        event::emit(RebalanceProposedEvent {
            owner: owner_addr,
            target_allocation,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Execute pending rebalance
    public entry fun execute_rebalance(owner: &signer) acquires TreasuryState {
        let owner_addr = signer::address_of(owner);
        
        // Ensure treasury exists
        assert!(exists<TreasuryState>(owner_addr), E_TREASURY_NOT_FOUND);
        
        let treasury = borrow_global_mut<TreasuryState>(owner_addr);
        
        // Verify ownership
        assert!(treasury.owner == owner_addr, E_NOT_OWNER);
        
        // Ensure there's a pending proposal
        assert!(!vector::is_empty(&treasury.pending_proposal), E_NO_PENDING_PROPOSAL);
        
        // Execute rebalance (for demo, we just update timestamp and clear proposal)
        let executed_allocation = treasury.pending_proposal;
        treasury.pending_proposal = vector::empty<u64>();
        treasury.last_action_timestamp = timestamp::now_seconds();

        // Emit event
        event::emit(RebalanceExecutedEvent {
            owner: owner_addr,
            executed_allocation,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// View function: Get treasury state
    #[view]
    public fun get_treasury_state(owner_addr: address): (u64, u64, bool) acquires TreasuryState {
        assert!(exists<TreasuryState>(owner_addr), E_TREASURY_NOT_FOUND);
        
        let treasury = borrow_global<TreasuryState>(owner_addr);
        let has_proposal = !vector::is_empty(&treasury.pending_proposal);
        
        (treasury.balance, treasury.last_action_timestamp, has_proposal)
    }

    /// View function: Get pending proposal if exists
    #[view]
    public fun get_pending_proposal(owner_addr: address): vector<u64> acquires TreasuryState {
        assert!(exists<TreasuryState>(owner_addr), E_TREASURY_NOT_FOUND);
        
        let treasury = borrow_global<TreasuryState>(owner_addr);
        treasury.pending_proposal
    }

    /// View function: Check if treasury exists for address
    #[view]
    public fun treasury_exists(owner_addr: address): bool {
        exists<TreasuryState>(owner_addr)
    }

    /// Update balance (for demo purposes - in production this would be more complex)
    public entry fun update_balance(owner: &signer, new_balance: u64) acquires TreasuryState {
        let owner_addr = signer::address_of(owner);
        
        assert!(exists<TreasuryState>(owner_addr), E_TREASURY_NOT_FOUND);
        
        let treasury = borrow_global_mut<TreasuryState>(owner_addr);
        assert!(treasury.owner == owner_addr, E_NOT_OWNER);
        
        treasury.balance = new_balance;
    }
}

