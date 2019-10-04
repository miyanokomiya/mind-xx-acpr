[![Build Status](https://travis-ci.org/miyanokomiya/mind-xx-acpr.svg?branch=develop)](https://travis-ci.org/miyanokomiya/mind-xx-acpr)
[![Coverage Status](https://coveralls.io/repos/github/miyanokomiya/mind-xx-acpr/badge.svg?branch=develop)](https://coveralls.io/github/miyanokomiya/mind-xx-acpr?branch=develop)

# mind-xx-acpr

Mind XX ACPR project

production  
https://mind-xx-acpr.firebaseapp.com/

staging  
https://mind-xx-acpr-stg.firebaseapp.com/

## Install dependencies
```bash
yarn install
```

## Run dev-server connecting to staging database
```bash
yarn serve
```

## Run storybook server
```bash
yarn storybook:serve
```

## Lint and fix
```bash
yarn lint
```

## Run jest
```bash
yarn test:unit
```

## Run puppeteer
Run storybook server and
```bash
yarn test:pupp
```

## Deploy staging
```bash
git push -f origin staging
```

## Deploy production
Create PR targeting master branch and merge it.
