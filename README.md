# superstore-sync [![Build Status](https://travis-ci.org/matthew-andrews/superstore-sync.png?branch=master)](https://travis-ci.org/matthew-andrews/superstore-sync) [![NPM version](https://badge.fury.io/js/superstore-sync.png)](http://badge.fury.io/js/superstore-sync)

Superstore is a simple lightweight synchronous wrapper around the Web Storage APIs [localStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) and [sessionStorage](https://developer.mozilla.org/en/docs/Web/API/Window/sessionStorage).  Its features include:

- It is [resilient to iOS's strange behaviour in private browsing mode](http://stackoverflow.com/questions/14555347/html5-localstorage-doesnt-works-in-ios-safari-private-browsing).
- It accepts objects as values and runs `JSON.stringify` on **#set** and `JSON.parse` on **#get** for you.

If you require an asyncronous version please use [superstore](https://github.com/matthew-andrews/superstore) instead.

## install
### NPM
```
npm install superstore-sync --save
```

### bower
```
bower install superstore-sync --save
```

## api

superstore-sync is an uninstantiable module.  Its methods are:

## local

### #local.get(key)

### #local.set(key, value)

### #local.unset(key)

### #local.clear(prefix)

## session

### #session.get(key)

### #session.set(key, value)

### #session.unset(key)

### #session.clear(prefix)

## #isPersisting()
* returns a boolean set to true if data is being persisted to storage, or false if it is being kept in memory (e.g. if localStorage is full or inaccessible).

## usage
```javascript
var store = require('superstore-sync');

//Persist a value to local storage
var value = store.local.set('foo', 'bar');

//Get a value from session storage
var session = store.session.get('baz');
```

## todo

- JSDoc comments and automatically generating documentation.
