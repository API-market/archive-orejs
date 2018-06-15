#!/usr/bin/env bash

# A boot script for new instances of our EOS blockchain
# It sets up the necessary wallets/accounts/contracts, etc.

# Prerequisite Setup...
mkdir tmp

# Create new orejs wallet...
cleos wallet create -n orejs > tmp/wallet-info.tmp
cat tmp/wallet-info.tmp

# Create orejs accounts, and generate shell scripts...
node ore/create_accounts

# Import account keys into the orejs wallet, and deploy the code contracts, using generated shell scripts...
. ./tmp/import_keys.sh
. ./tmp/deploy_contracts.sh

# Mint some tokens, and read account balances using eos-js library...
node ore/mint_tokens
