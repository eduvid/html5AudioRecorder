module.exports = function(grunt) {
  "use strict";
  // Project configuration.
  var jsFiles = ["./Gruntfile.js", "public/**/*.js", "!public/bower_components/**/*.js"];
  var jsbeautifierconfigObject = grunt.file.readJSON("jsbeautifier.json");
  grunt.initConfig({
    jshint: {
      all: jsFiles,
      options: {
        jshintrc: ".jshintrc",
        jshintignore: ".jshintignore"
      }
    },
    jsbeautifier: {
      files: jsFiles,
      options: jsbeautifierconfigObject
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.registerTask("default", ["jsbeautifier"]);
};
