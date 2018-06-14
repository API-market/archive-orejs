In here, you'll find...

* Example javascripts for interacting with nodeos
* A boot script for loading ORE accounts & contracts

## Usage

You'll need to have a couple repos checked out, in order to take full advantage of the examples herein...

* [eosio/eos](https://github.com/EOSIO/eos)
* [api-market/ore-protocol](https://github.com/API-market/ore-protocol)

You'll also need to install the javascript libraries from the package.json in the top-level directory...

```
npm install
```

From the examples directory, copy the .env.example to .env, and fill in the appropriate values...

```
$ cd examples && cp .env.example .env
```

Be sure to change `TOKEN_CONTRACT_DIR` to match your local ore-protocol directory

### From Genesis

If you want to start from 0 (aka, the genesis block). Start here.
You'll need to have the eosio/eos repository checked out.
In a dedicated tab, start/restart your local nodeos instance, passing in the eos directory...

```
$ . ./shell/restart_nodeos.sh ~/Github/eos
```

### ORE Boot Script

If you want to keep your current blockchain data. Start here.
Create the default ore accounts, with keys, and contracts...

```
$ . ./shell/boot.sh
```
