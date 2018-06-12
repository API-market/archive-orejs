#!/usr/bin/env bash

# Usage:
# $ . mint_token.sh ACCOUNT_NAME TOKEN_AMOUNT

# Example:
# $ . examples/mint_token.sh uztcnztga3di 10

# Mint some tokens...
cleos push action token.eos2 mint "[\"$1\", $2]" -p token.eos2@active

cleos get table token.eos2 token.eos2 accounts
