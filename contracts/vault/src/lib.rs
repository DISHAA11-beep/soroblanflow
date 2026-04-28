#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, symbol_short, Address, Env, log};

mod token {
    soroban_sdk::contractimport!(file = "../../target/wasm32v1-none/release/token.wasm");
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum PoolError {
    TokenCallFailed = 101,
    InsufficientLiquidity = 102,
    NotInitialized = 103,
}

#[contract]
pub struct PoolContract;

#[contractimpl]
impl PoolContract {
    pub fn init(env: Env, token_address: Address) {
        env.storage().instance().set(&symbol_short!("token"), &token_address);
    }

    /// Swap function that invokes TokenContract's transfer function.
    /// Demonstrates error propagation from Contract A to Contract B.
    pub fn swap(env: Env, from: Address, amount: i128) -> Result<(), PoolError> {
        from.require_auth();

        let token_addr: Address = env.storage().instance().get(&symbol_short!("token"))
            .ok_or(PoolError::NotInitialized)?;
        
        let client = token::Client::new(&env, &token_addr);

        // Perform the transfer from user to pool
        // Using try_transfer to catch and propagate errors from the Token contract
        let result = client.try_transfer(&from, &env.current_contract_address(), &amount);

        match result {
            Ok(Ok(_)) => {
                // Transfer successful, emit pool event
                env.events().publish((symbol_short!("swap_ok"), from), amount);
                Ok(())
            },
            Ok(Err(_token_err)) => {
                // Token contract returned a logical error (e.g., InsufficientBalance)
                // log!(&env, "Token transfer failed with code: {:?}", _token_err);
                Err(PoolError::TokenCallFailed)
            },
            Err(_) => {
                // Sub-call panicked or failed at the host level
                Err(PoolError::TokenCallFailed)
            }
        }
    }

    pub fn get_pool_balance(env: Env) -> Result<i128, PoolError> {
        let token_addr: Address = env.storage().instance().get(&symbol_short!("token"))
            .ok_or(PoolError::NotInitialized)?;
        let client = token::Client::new(&env, &token_addr);
        Ok(client.balance_of(&env.current_contract_address()))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    // Since we are using contractimport!, we need to make sure the wasm file exists
    // and we can register it using the generated WASM bytes or by registering the contract type if we had access to it.
    // In this case, token::WASM is available.

    #[test]
    fn test_vault_swap() {
        let env = Env::default();
        env.mock_all_auths();

        // 1. Register Token contract from WASM
        let token_id = env.register(token::WASM, ());
        let token_client = token::Client::new(&env, &token_id);

        // 2. Register Vault contract
        let vault_id = env.register(PoolContract, ());
        let vault_client = PoolContractClient::new(&env, &vault_id);

        // 3. Initialize Vault
        vault_client.init(&token_id);

        // 4. Setup user and mint tokens
        let user = Address::generate(&env);
        token_client.mint(&user, &1000);

        // 5. Perform swap
        vault_client.swap(&user, &400);

        // 6. Verify balances
        assert_eq!(token_client.balance_of(&user), 600);
        assert_eq!(token_client.balance_of(&vault_id), 400);
        assert_eq!(vault_client.get_pool_balance(), 400);
    }

    #[test]
    fn test_swap_insufficient_balance() {
        let env = Env::default();
        env.mock_all_auths();

        let token_id = env.register(token::WASM, ());
        let token_client = token::Client::new(&env, &token_id);

        let vault_id = env.register(PoolContract, ());
        let vault_client = PoolContractClient::new(&env, &vault_id);

        vault_client.init(&token_id);

        let user = Address::generate(&env);
        token_client.mint(&user, &100);

        // Try to swap more than balance
        let result = vault_client.try_swap(&user, &200);
        assert!(result.is_err());
    }

    #[test]
    fn test_not_initialized() {
        let env = Env::default();
        let vault_id = env.register(PoolContract, ());
        let vault_client = PoolContractClient::new(&env, &vault_id);

        let user = Address::generate(&env);
        let result = vault_client.try_swap(&user, &100);
        assert!(result.is_err());
    }
}
