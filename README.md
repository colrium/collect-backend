# Collect Backend
## Description

Collect Backend Microservices built on the [Nest](https://github.com/nestjs/nest) framework.

## Prerequisites
Create Database and user
```bash
$ mongod
```

```bash
$ use collect
```

```bash
$ db.createUser({ user: "collect", pwd: "password123", roles:[{ role: "dbAdmin" , db:"collect"}]})
```
## Installation

```bash
$ yarn install
```

## Running with Docker

```bash
$ docker-compose up -d --build
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Stay in touch

- Author - [Mutugi Riungu](https://colrium.githum.io)
- Twitter - [@mutugiriungu](https://twitter.com/mutugiriungu)
