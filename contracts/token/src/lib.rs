#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, symbol_short, Address, Env};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum TokenError {
    InsufficientBalance = 1,
    InvalidAmount = 2,
    Unauthorized = 3,
}

#[contract]
pub struct TokenContract;

#[contractimpl]
impl TokenContract {
    /// Mint new tokens and update total supply.
    pub fn mint(env: Env, to: Address, amount: i128) -> Result<(), TokenError> {
        if amount <= 0 { return Err(TokenError::InvalidAmount); }
        
        let balance = Self::balance_of(env.clone(), to.clone());
        let supply = Self::total_supply(env.clone());

        env.storage().persistent().set(&to, &(balance + amount));
        env.storage().instance().set(&symbol_short!("supply"), &(supply + amount));

        env.events().publish((symbol_short!("mint"), to), amount);
        Ok(())
    }

    /// Transfer tokens with explicit result for error propagation.
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> Result<(), TokenError> {
        from.require_auth();

        if amount <= 0 { return Err(TokenError::InvalidAmount); }

        let from_balance = Self::balance_of(env.clone(), from.clone());
        if from_balance < amount {
            return Err(TokenError::InsufficientBalance);
        }

        let to_balance = Self::balance_of(env.clone(), to.clone());

        env.storage().persistent().set(&from, &(from_balance - amount));
        env.storage().persistent().set(&to, &(to_balance + amount));

        env.events().publish((symbol_short!("transfer"), from, to), amount);
        Ok(())
    }

    pub fn balance_of(env: Env, owner: Address) -> i128 {
        env.storage().persistent().get(&owner).unwrap_or(0)
    }

    pub fn total_supply(env: Env) -> i128 {
        env.storage().instance().get(&symbol_short!("supply")).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_mint() {
        let env = Env::default();
        let contract_id = env.register(TokenContract, ());
        let client = TokenContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        client.mint(&user, &1000);

        assert_eq!(client.balance_of(&user), 1000);
        assert_eq!(client.total_supply(), 1000);
    }

    #[test]
    fn test_transfer() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(TokenContract, ());
        let client = TokenContractClient::new(&env, &contract_id);

        let from = Address::generate(&env);
        let to = Address::generate(&env);

        client.mint(&from, &1000);
        client.transfer(&from, &to, &600);

        assert_eq!(client.balance_of(&from), 400);
        assert_eq!(client.balance_of(&to), 600);
        assert_eq!(client.total_supply(), 1000);
    }

    #[test]
    fn test_transfer_insufficient_balance() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(TokenContract, ());
        let client = TokenContractClient::new(&env, &contract_id);

        let from = Address::generate(&env);
        let to = Address::generate(&env);

        client.mint(&from, &100);
        let result = client.try_transfer(&from, &to, &200);
        
        // In Soroban v25, contract errors in try_ methods return Err(InvokeError)
        assert!(result.is_err(), "Transfer should fail with insufficient balance");
    }

    #[test]
    fn test_transfer_invalid_amount() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(TokenContract, ());
        let client = TokenContractClient::new(&env, &contract_id);

        let from = Address::generate(&env);
        let to = Address::generate(&env);

        client.mint(&from, &1000);
        let result = client.try_transfer(&from, &to, &-1);
        
        assert!(result.is_err(), "Transfer should fail with invalid amount");
    }
}
