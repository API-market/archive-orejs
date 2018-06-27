#!/usr/bin/env bash
export WALLET_URL="http://localhost:8900"

# A boot script for new instances of our EOS blockchain
# It sets up the necessary wallets/accounts/contracts, etc.

# Prerequisite Setup...
mkdir tmp

# Create new orejs wallet...
cleos --wallet-url=$WALLET_URL wallet create -n orejs > tmp/wallet-info.tmp
cat tmp/wallet-info.tmp

# Create orejs accounts, and generate shell scripts...
node ore/create_accounts

# Import account keys into the orejs wallet, and deploy the code contracts, using generated shell scripts...
. ./tmp/import_keys.sh
. ./tmp/deploy_contracts.sh

# Mint some tokens, and read account balances using eos-js library...
node ore/mint_tokens

# TODO Remove me...
#cleos --wallet-url=$WALLET_URL set account permission manager.apim active '{"threshold": 1,"keys": [{"key": "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV","weight": 1}],"accounts": [{"permission":{"actor":"manager.apim","permission":"eosio.code"},"weight":1}]}' owner -p manager.apim

# Publish & license some apis...
node ore/publish_and_license_apis
