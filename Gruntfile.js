module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

	sass: {
		main: {
			files: {
				'socializer.css': 'css/socializer.scss',
			}
		}
	},
	
	cssmin: {
		options: {
			banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
		},
		build: {
			files: {
				'css/socializer.min.css': 'socializer.css'
			}
		}
	},
	
	watch:{
		scripts: {
			files: [ 
                'css/socializer.scss',
                'css/_config.scss',
                'css/_hover.scss',
                'css/_misc.scss',
                'css/_shapes.scss',
                'css/_text.scss',
                'css/_styles.scss',
                'css/_types.scss',
            ],
			tasks: [ 'sass' ]
		}
	}

  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask( 'default', [ 'sass' ] );
  
};
