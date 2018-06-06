#!/usr/bin/env bash

# Delete old/stale orejs wallet...
rm -rf ~/eosio-wallet/./orejs.wallet
# Create new orejs wallet...
cleos wallet create -n orejs > wallet-info.tmp
cat wallet-info.tmp
# Create new keypair for token contract...
cleos wallet create_key -n orejs
cleos wallet keys
