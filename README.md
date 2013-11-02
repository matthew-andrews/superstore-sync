# superstore-sync [![Build Status](https://travis-ci.org/matthew-andrews/superstore-sync.png?branch=master)](https://travis-ci.org/matthew-andrews/superstore-sync)

Superstore is a simple lightweight synchronous wrapper around localStorage.  Its features include:

- It is [resilient to iOS's strange behaviour in private browsing mode](http://stackoverflow.com/questions/14555347/html5-localstorage-doesnt-works-in-ios-safari-private-browsing).
- It accepts objects as values and runs `JSON.stringify` on **#set** and `JSON.parse` on **#get** for you.

## api

superstore-sync is an uninstantiable module.  Its methods are:

### #get(key)

### #set(key, value)

### #unset(key)

### #clear(prefix)

## todo

- JSDoc comments and automatically generating documentation.
