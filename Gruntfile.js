module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

	sass: {
		main: {
			files: {
				'css/socializer.css': 'css/socializer.scss',
			}
		}
	},
	
	cssmin: {
		options: {
			banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
		},
		build: {
			files: {
				'css/socializer.min.css': 'css/socializer.css'
			}
		}
	},
	
	watch:{
		scripts: {
			files: [ 'css/socializer.scss' ],
			tasks: [ 'sass' ]
		}
	}

  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask( 'default', [ 'sass' ] );
  
};
