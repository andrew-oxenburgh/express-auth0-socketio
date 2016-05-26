module.exports = (grunt) ->
  grunt.initConfig
    sass:
      options:
        sourceMap: ''
      dist:
        files:
          './public/css/css.css': './public/scss/css.scss'
    watch:
      sass:
        files: ['public/**/*.scss']
        tasks: ['sass']
        options:
          spawn: false

  grunt.loadNpmTasks 'grunt-sass'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.registerTask 'default', [
    'sass'
  ]
  return
