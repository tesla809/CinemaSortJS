module.exports = function(grunt){
	//Configure task(s)
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			dev: {
				options: {
					beautify: true,
					mangle: false,
					compress: false,
					preserveComments: 'all'
				},
				src: 'src/js/*.js',
				dest: 'js/script.min.js'
			},
			build: {
				src: 'src/js/*.js',
				dest: 'js/script.min.js',
			}
		},

		less: {
			dev: {
				options: {
					paths: ['src/less/']
				},
				files: {
					'css/style.css' : 'src/less/source.less'
				}
			},
			build: {
				options: {
					compress: true
				},
				files: {
					'css/style.css' : 'src/less/source.less'
				}
			}
		},

		watch: {
			js: {
				files: ['src/js/*.js'],
				tasks: ['uglify:dev']
			},
			less: {
				files: ['src/less/*.less'],
				tasks: ['less:dev']
			}
		}

	});	

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Register tasks(s)
	grunt.registerTask('default', ['less:dev','uglify:dev']);
	grunt.registerTask('dev', ['less:dev','uglify:dev']);
	grunt.registerTask('build', ['less:build','uglify:build']);
	// no need to register grunt-watch
};