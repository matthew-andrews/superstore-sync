var prefix = '';
var tests = {};

try {
  localStorage.test = 'test';
  localStorage.removeItem('test');
} catch (err) {
  if (err.code == 22) prefix = '// ';
}

function getLocalStorage(key) {
  return localStorage[key];
};

function setLocalStorage(key, val) {
  return localStorage[key] = val;
};

tests["setUp"] = function() {
  localStorage.clear();
};

tests["Should be able to set and get data against a key"] = function() {
  superstoreSync.set('keyOne', 'value1');
  var val = superstoreSync.get('keyOne');
  assert.equals('value1', val);
};

tests[prefix + "Should be able to read things (twice) from local storage"] = function() {
  setLocalStorage("keyTwo", 3884);
  assert.equals(getLocalStorage("keyTwo"), 3884);
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

tests[prefix + "#clear(something) clears only our namespaced data"] = function() {
  superstoreSync.set('other', '123');
  superstoreSync.set('prefixKeyTenth', 'A');
  superstoreSync.set('prefixKeyEleventh', 'B');
  superstoreSync.clear('prefixKey');

  assert.equals(undefined, getLocalStorage("prefixKeyTenth"));
  assert.equals(undefined, superstoreSync.get("prefixKeyTenth"));
  assert.equals(undefined, getLocalStorage("prefixKeyEleventh"));
  assert.equals(undefined, superstoreSync.get("prefixKeyEleventh"));
  assert.equals('"123"', getLocalStorage("other"));
  assert.equals('123', superstoreSync.get("other"));
};

tests[prefix + "#clear() clears all data"] = function() {
  superstoreSync.set('other', '123');
  superstoreSync.set('prefixKeyTwelth', 'C');
  superstoreSync.clear();

  assert.equals(undefined, getLocalStorage("prefixKeyTwelth"));
  assert.equals(undefined, getLocalStorage("other"));
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