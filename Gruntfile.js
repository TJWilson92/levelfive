module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    nodemon: {
      dev: {
        script: './bin/www',
        ignore: ['node_modules/**', 'views/**', 'public/**']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.registerTask('default', ['jshint', 'nodemon']);

};
