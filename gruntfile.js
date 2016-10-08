module.exports = function (grunt) {
  grunt.initConfig({
    execute: {
      target: {
        src: ['sp-node-mysql/app.js']
      }
    },
    watch: {
      scripts: {
        files: ['sp-node-mysql/app.js'],
        tasks: ['execute'],
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-execute');
};