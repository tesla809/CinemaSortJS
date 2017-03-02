module.exports = function(grunt){
	//Configure task(s)
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		babel: {
			options: {
			sourceMap: false,
			presets: ['es2015']
		},			
			dev: {
				files: [{
					expand: true,
					src: 'src/js/es6/*.js',
					dest: 'src/js/transpiled',
					ext:'.js',
					flatten: true
				}],
			}
		},

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
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// required for grunt-babel to work
	require('load-grunt-tasks')(grunt);

	// Register tasks(s)
	grunt.registerTask('default', ['babel:dev', 'less:dev', 'uglify:dev']);
	// grunt.registerTask('dev', ['babel:dev', 'less:dev', 'uglify:dev']);
	grunt.registerTask('build', ['babel:dev', 'less:build', 'uglify:build']);
	// no need to register grunt-watch
};