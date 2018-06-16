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

# TODO Remove me...
cleos set account permission apim.manager active '{"threshold": 1,"keys": [{"key": "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV","weight": 1}],"accounts": [{"permission":{"actor":"apim.manager","permission":"eosio.code"},"weight":1}]}' owner -p apim.manager

# Publish & license some apis...
#node ore/publish_and_license_apis

#cleos push action apim.manager publishapi '[ "apiowner", "goodapi", [ { "theright":{"right_name":"some_right_2", "price_in_cpu":10, "issuer":"apiowner", "additional_url_params":[{"name":"a", "value":"5"},{"name":"b", "value":"6"}], "description":"Lol"}, "urls": [{"url":"google.com", "matches_params":[], "token_life_span":100, "is_default":true}] } ] ]' -p apiowner@active
#cleos get table ore.rights ore.rights rights
#cleos get table apim.manager apim.manager offers
#cleos push action apim.manager licenceapi '["apiuser", 1]' -p apiuser
#cleos get table ore.instr ore.instr tokens
