# OREJS Spec

orejs is helper library (written in Javascript) to provide simple high-level access to the ore-protocol. Orejs uses eosJS as a wrapper to the EOS blockchain.

## Example(s)

Try creating a random account on your nodeos instance...

```
npm install
cd examples
cp .env.example .env
```

Fill in the fresh .env

```
node ore/account_create_random
```

You'll find more examples, and a *boot script*, inside of the examples directory. Check out the [examples/README.md](https://github.com/API-market/orejs/tree/master/examples/README.md) for more information.
