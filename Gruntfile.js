module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: [{
                    cwd: 'assets/js/', // set working folder / root to copy
                    src: '**/*', // copy all files and subfolders
                    dest: 'assets/js-annotate', // destination folder
                    expand: true // required when using cwd
                }, ],
            }
        },
        uglify: {
            dynamic_mappings: {
                // Grunt will search for "**/*.js" under "lib/" when the "uglify" task
                // runs and build the appropriate src-dest file mappings then, so you
                // don't need to update the Gruntfile when files are added or removed.
                files: [{
                    expand: true,
                    cwd: 'assets/js-annotate',
                    src: '**/*',
                    dest: 'public/assets/js'
                }, ],
            },
        },
        copy: {
            main: {
                files: [{
                    cwd: 'assets/css', // set working folder / root to copy
                    src: '**/*', // copy all files and subfolders
                    dest: 'public/assets/css', // destination folder
                    expand: true // required when using cwd
                }, {
                    cwd: 'assets/fonts', // set working folder / root to copy
                    src: '**/*', // copy all files and subfolders
                    dest: 'public/assets/fonts', // destination folder
                    expand: true // required when using cwd
                }, {
                    cwd: 'assets/templates', // set working folder / root to copy
                    src: '**/*', // copy all files and subfolders
                    dest: 'public/assets/templates', // destination folder
                    expand: true // required when using cwd
                }, {
                    cwd: 'images', // set working folder / root to copy
                    src: '**/*', // copy all files and subfolders
                    dest: 'public/images', // destination folder
                    expand: true // required when using cwd
                }]
            }
        }
    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ng-annotate');

    // Default task(s).
    grunt.registerTask('default', ['ngAnnotate', 'uglify', 'copy']);

};
