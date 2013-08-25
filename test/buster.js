var config = module.exports;

config['superstore-sync'] = {
  rootPath: '../',
  environment: 'browser',
  sources: [
    'coverage/build/superstore-sync.js',
    'node_modules/q/q.js'
  ],
  tests: [
    'test/tests/*.js'
  ],
  extensions: [
    require('buster-istanbul')
  ],
  'buster-istanbul': {
    instrument: false,
    outputDirectory: 'coverage',
    format: ["cobertura", "lcov"]
  }
};
