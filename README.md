

## Installation



```bash
$ npm install
```

## Running the app

It is possible to inject env vars through the *.env* file. So you can duplicate the *.env.example* in the project's root path and rename it to *.env*.

```bash
# development
$ npm run start:dev

# production mode
$ npm run build
$ npm run start
```

## Create Transaction

```bash
curl --location --request POST 'localhost:3000/algod/transaction' \
--header 'Content-Type: application/json' \
--data-raw '{
    "amount": 1000000
}'
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
