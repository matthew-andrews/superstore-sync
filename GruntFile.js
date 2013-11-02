module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      build: {
        src: 'lib/superstore-sync.js',
        dest: 'build/superstore-sync.js'
      },
      test: {
        src: 'coverage/lib/superstore-sync.js',
        dest: 'coverage/build/superstore-sync.js'
      },
      options: {
        standalone: 'superstoreSync'
      },
    },

    instrument: {
      files: 'lib/**/*.js',
      options: {
        basePath: 'coverage/',
        lazy: true
      }
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-istanbul');

  // Default task.
  grunt.registerTask('default', ['browserify:build']);
  grunt.registerTask('test', ['instrument', 'browserify:test']);
};

