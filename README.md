## Project setup

1. Create a database
2. Create a .env file from .env.sample
3. `npm install`
4. `npm run migration:run`
5. `npm run seed:run` for admin Note: This will create an admin user with the credentials specified in the .env file
6. `npm run start:dev`
7. `${BACKEND_URL}/api/docs` for API documentation

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```