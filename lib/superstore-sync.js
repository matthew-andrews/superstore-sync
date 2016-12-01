/**
 * Superstore synchronous library
 *
 * @author Matt Andrews <matthew.andrews@ft.com>
 * @copyright The Financial Times [All Rights Reserved]
 */

var escapeRegex = function(str){
  return String(str).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
};

var keys = {};
var store = {};
var persist = true;

// Watch for changes from other tabs


function Superstore(type) {
  /* Chrome Mobile and Android browser will both barf if you try and read
     window.locatStorage when Cookies are turned off.
     Here's a wontfix on chromium about it: https://bugs.chromium.org/p/chromium/issues/detail?id=357625
  */
  try {
    this.storage = window[type];
  } catch (err){
    /* use the in memory storage */
    persist = false;
  }
  this.keys = {};
  this.store = {};
  // TODO: check the storageArea so that we only refresh the key when we need to
  window.addEventListener("storage", function(e) {
    if (this.keys[e.key]) {
      this.keys[e.key] = true;
      this.store[e.key] = JSON.parse(e.newValue);
    }
  }.bind(this));
}

/**
 * get localstorage value for key falling back to in memory for iOS private browsing bug
 * <http://stackoverflow.com/questions/9077101/iphone-localstorage-quota-exceeded-err-issue>
 * @param {String} key
 * @return {*} data for supplied key
 *
 */
Superstore.prototype.get = function(key) {
  if (arguments.length !== 1) {
    throw Error("get expects 1 argument, " + arguments.length + " given; " + key);
  }
  if (!this.keys[key] && persist) {
    var data;
    try {
      data = this.storage[key];
    } catch(e) {
      persist = false; // Safari 8 with Cookies set to 'Never' throws on every read
    }

    // Slightly weird hack because JSON.parse of an undefined value throws
    // a weird exception "SyntaxError: Unexpected token u"
    if (data) data = JSON.parse(data);
    this.store[key] = data;
    this.keys[key] = true;
  }
  return this.store[key];
};

/**
 * set localstorage key,value falling back to in memory for iOS private browsing bug
 * <http://stackoverflow.com/questions/9077101/iphone-localstorage-quota-exceeded-err-issue>
 * @param {String} key
 * @param {*} value which will be passed via JSON.stringify
 * @return {*} value
 *
 */
Superstore.prototype.set = function(key, value) {
  if (arguments.length !== 2) {
    throw Error("set expects 2 arguments, " + arguments.length + " given; " + key);
  }
  if (persist) {
    try {
      this.storage[key] = JSON.stringify(value);
    } catch(err) {

      // Known iOS Private Browsing Bug - fall back to non-persistent storage
      if (err.code === 22) {
        persist = false;
      } else {
        throw err;
      }
    }
  }

  this.store[key] = value;
  this.keys[key] = true;
  return value;
};


/**
 * unset value in store for key
 * @param {String} key
 */
Superstore.prototype.unset = function(key) {
  delete this.store[key];
  delete this.keys[key];
  this.storage.removeItem(key);
};

/**
 * clear localstorage
 * @param clearPrefix will clear keys starting with `clearPrefix`
 * #clear(true) and #clear() clear cache and persistent layer, #clear(false) only clears cache
 *
 */
Superstore.prototype.clear = function(clearPrefix) {
  if (!clearPrefix) {
    if (persist) {
      this.storage.clear();
    }
    this.store = {};
    this.keys = {};
    return;
  }

  clearPrefix = escapeRegex(clearPrefix);
  var clearKeyRegex = new RegExp("^" + clearPrefix);
  for (var key in this.keys) {
    if (key.match(clearKeyRegex)) {
      this.unset(key);
    }
  }
};

module.exports.isPersisting = function() {
	return persist;
};

module.exports.local = new Superstore('localStorage');
module.exports.session = new Superstore('sessionStorage');
