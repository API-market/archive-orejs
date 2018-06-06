#!/usr/bin/env bash

# Usage:
# $ . setup_token.sh CREATOR_ACCOUNT_PUBLIC_KEY TOKEN_CONTRACT_DIR

# Example:
# $ . examples/setup_token.sh EOS5MzZYG5Ee4nPpbzNgPcF47eXRfq3W3sWZN4CMTWQMyPYtDw2ez ~/Aikon/ore-protocol/contracts/token_eos2

# Create token account...
cleos create account eosio token.eos2 $1 $1
cleos get accounts $1

# Deploy token contract...
cleos set contract token.eos2 $2 -p token.eos2@active

# Mint some tokens...
cleos push action token.eos2 mint "[\"token.eos2\", 100]" -p token.eos2@active

# Spread the wealth...
cleos push action token.eos2 approve "[\"token.eos2\", \"eosio\", 50]" -p token.eos2@active
cleos push action token.eos2 transferfrom "[\"eosio\", \"token.eos2\", \"eosio\", 50]" -p eosio@active
cleos get table token.eos2 token.eos2 accounts
