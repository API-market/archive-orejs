#!/usr/bin/env bash

# A boot script for new instances of our EOS blockchain
# It sets up the necessary wallets/accounts/contracts, etc.

# Prerequisite Setup...
mkdir tmp

# Create new orejs wallet...
cleos wallet create -n orejs > tmp/wallet-info.tmp
cat tmp/wallet-info.tmp

# Create orejs accounts, and generate shell scripts...
node ore/generate_deploy_scripts

# Import account keys into the orejs wallet, and deploy the code contracts, using generated shell scripts...
. ./tmp/step1_create_accounts.sh
. ./tmp/step2_import_keys.sh
. ./tmp/step3_deploy_contracts.sh

# Mint some tokens, and read account balances using eos-js library...
node ore/mint_tokens
