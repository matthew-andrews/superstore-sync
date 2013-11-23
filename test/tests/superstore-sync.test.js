var prefix = '';
var buggyLocalStorage = false;
var tests = {};

try {
  localStorage.test = 'test';
  localStorage.removeItem('test');
} catch (err) {
  if (err.code == 22) prefix = '// ';
  buggyLocalStorage = true;
}

function getLocalStorage(key) {
  return localStorage[key];
};

function setLocalStorage(key, val) {
  if (buggyLocalStorage) return localStorage[key] = val;
};

tests["setUp"] = function() {
  localStorage.clear();
};

tests["Removing a key before it's set should be harmless"] = function() {
  var exceptionThrown = false;
  try {
    superstoreSync.unset('keyUnset');
  } catch (e) {
    exceptionThrown = true;
  }
  assert.equals(false, exceptionThrown);
  assert.equals(undefined, getLocalStorage('keyUnset'));
};

tests["Should be able to set and get data against a key"] = function() {
  superstoreSync.set('keyOne', 'value1');
  var val = superstoreSync.get('keyOne');
  assert.equals('value1', val);
};

tests[prefix + "Should be able to read things (twice) from local storage"] = function() {
  superstoreSync.set("keyTwo", 3884);

  var val = superstoreSync.get('keyTwo');
  assert.equals(3884, val);
  var val2 = superstoreSync.get('keyTwo');
  assert.equals(3884, val2);
};

tests[prefix + "Should be able to unset things"] = function() {
  setLocalStorage("keyThree", "Hello");
  var val = superstoreSync.unset('keyThree');
  assert.equals(undefined, getLocalStorage("keyThree"));
};

tests["Getting an unset key should return a nully value"] = function() {
  var val = superstoreSync.get("keySixth");
  assert.equals(val, undefined);
};

tests[prefix + "Should json encode and decode objects"] = function() {
  var obj = {
    test: [1,4,6,7]
  };
  superstoreSync.set('keySeventh', obj);
  assert.equals(JSON.stringify(obj), getLocalStorage("keySeventh"));
};

tests["#clear(something) clears only our namespaced data"] = function() {
  superstoreSync.set('other', '123');
  superstoreSync.set('pref.?xKeyTenth', 'A');
  superstoreSync.set('pref.?xKeyEleventh', 'B');
  superstoreSync.clear('pref.?xKey');

  assert.equals(undefined, superstoreSync.get("pref.?xKeyTenth"));
  assert.equals(undefined, superstoreSync.get("pref.?xKeyEleventh"));
  assert.equals('123', superstoreSync.get("other"));

  if (!buggyLocalStorage) {
    assert.equals(undefined, getLocalStorage("pref.?xKeyEleventh"));
    assert.equals('"123"', getLocalStorage("other"));
    assert.equals(undefined, getLocalStorage("pref.?xKeyTenth"));
  }
};

tests["#clear() clears all data"] = function() {
  superstoreSync.set('other', '123');
  superstoreSync.set('prefixKeyTwelth', 'C');
  superstoreSync.clear();

  assert.equals(undefined, superstoreSync.get("prefixKeyTwelth"));
  assert.equals(undefined, superstoreSync.get("other"));

  if (!buggyLocalStorage) {
    assert.equals(undefined, getLocalStorage("prefixKeyTwelth"));
    assert.equals(undefined, getLocalStorage("other"));
  }
};

tests["watch for changes in other processes"] = function() {
  superstoreSync.set('key13', 'A');

  var event = new CustomEvent("storage");
  event.key = "key13";
  event.newValue = "\"B\"";
  window.dispatchEvent(event);

  var val = superstoreSync.get('key13');
  assert.equals(val, 'B');
};

buster.testCase('superstore-sync', tests);
