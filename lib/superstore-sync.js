/**
 * Superstore synchronous library
 *
 * @author Matt Andrews <matthew.andrews@ft.com>
 * @copyright The Financial Times [All Rights Reserved]
 */

var escapeRegex = require('escape-regexp-component');

var keys = {};
var store = {};
var persist = true;

// Watch for changes from other tabs
window.addEventListener("storage", function(e) {
  if(keys[e.key]) {
    keys[e.key] = true;
    store[e.key] = JSON.parse(e.newValue);
  }
});

/**
 * get localstorage value for key falling back to in memory for iOS private browsing bug
 * <http://stackoverflow.com/questions/9077101/iphone-localstorage-quota-exceeded-err-issue>
 * @param {String} key
 * @return {*} data for supplied key
 *
 */
exports.get = function(key) {
  if (!keys[key] && persist) {
    var data;
    try {
      data = localStorage[key];
    } catch(e) {
      persist = false; // Safari 8 with Cookies set to 'Never' throws on every read
    }

    // Slightly weird hack because JSON.parse of an undefined value throws
    // a weird exception "SyntaxError: Unexpected token u"
    if (data) data = JSON.parse(data);
    store[key] = data;
    keys[key] = true;
  }
  return store[key];
};

/**
 * set localstorage key,value falling back to in memory for iOS private browsing bug
 * <http://stackoverflow.com/questions/9077101/iphone-localstorage-quota-exceeded-err-issue>
 * @param {String} key
 * @param {*} value which will be passed via JSON.stringify
 * @return {*} value
 *
 */
exports.set = function(key, value) {
  if (persist) {
    try {
      localStorage[key] = JSON.stringify(value);
    } catch(err) {

      // Known iOS Private Browsing Bug - fall back to non-persistent storage
      if (err.code === 22) {
        persist = false;
      } else {
        throw err;
      }
    }
  }

  store[key] = value;
  keys[key] = true;
  return value;
};


/**
 * unset value in store for key
 * @param {String} key
 */
exports.unset = function(key) {
  delete store[key];
  delete keys[key];
  localStorage.removeItem(key);
};

/**
 * clear localstorage
 * @param clearPrefix will clear keys starting with `clearPrefix`
 * #clear(true) and #clear() clear cache and persistent layer, #clear(false) only clears cache
 *
 */
exports.clear = function(clearPrefix) {
  var key;
  if(!clearPrefix) {
    if (persist) {
      localStorage.clear();
    }
    store = {};
    keys = {};
    return;
  }

  clearPrefix = escapeRegex(clearPrefix);
  var clearKeyRegex = new RegExp("^"+clearPrefix);
  for(key in keys) {
    if(key.match(clearKeyRegex)) {
      this.unset(key);
    }
  }
};
