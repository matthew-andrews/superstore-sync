# superstore-sync

Superstore is a simple lightweight synchronous wrapper around localStorage.  Its features include:

- It is [resilient to iOS's strange behaviour in private browsing mode](http://stackoverflow.com/questions/14555347/html5-localstorage-doesnt-works-in-ios-safari-private-browsing).
- It accepts objects as values and runs `JSON.stringify` on **#set** and `JSON.parse` on **#get** for you.

## api

SuperstoreSync is an uninstantiable module.  Its methods are:

### #get(key, callback)

### #set(key, value, callback)

### #unset(key, callback)

### #clear(callback)

## todo

- Currently the tests are those from the old asynchronous library (they haven't been split out yet)
- JSDoc comments and automatically generating documentation.
- Split the tests up into those that test the async layer and those that test the localStorage layer.  (The point above is a dependency)
