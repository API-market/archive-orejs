In here, you'll find...

* Example javascripts for interacting with nodeos
* A boot script for loading ORE accounts & contracts

## Usage

First, be in the right directory, and copy the .env.example to .env, and fill in the appropriate values.
You'll need to have the api-market/ore-protocol repository checked out, and add the directory path to your .env...

```
$ cd examples && cp .env.example .env
```

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
