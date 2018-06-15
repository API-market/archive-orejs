#!/usr/bin/env bash

# Starts a nodeos instance,
# Starting from the genesis block
# And, with all necessary plugins
# Also, removes the old orejs wallet

# Usage:
# In a separate tab...
# Pass in the DIR of your eos install

# Example:
# $ . restart_nodeos.sh ~/Github/eos

# Delete old blockchain data...
rm -rf ~/Library/Application\ Support/eosio/nodeos/data

# Delete old/stale orejs wallet...
rm -rf ~/eosio-wallet/./orejs.wallet

# Start up the blockchain...
$1/build/programs/nodeos/nodeos -e -p eosio --plugin eosio::chain_api_plugin --plugin eosio::history_api_plugin
