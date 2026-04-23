# Antigravity Soroban Makefile

all: build

build:
	@echo "Building Token contract..."
	cd contracts/token && stellar contract build
	@echo "Building Vault contract..."
	cd contracts/vault && stellar contract build

test:
	@echo "Running tests..."
	cargo test

deploy-testnet:
	@echo "Deploying to Testnet..."
	# Placeholder for deployment script
	# stellar contract deploy --wasm target/wasm32-unknown-unknown/release/token.wasm --source-account <account> --network testnet

bindings:
	@echo "Generating TypeScript bindings..."
	mkdir -p frontend/src/contracts
	stellar contract bindings typescript --wasm target/wasm32-unknown-unknown/release/token.wasm --output-dir frontend/src/contracts/token
	stellar contract bindings typescript --wasm target/wasm32-unknown-unknown/release/vault.wasm --output-dir frontend/src/contracts/vault

.PHONY: all build test deploy-testnet bindings
