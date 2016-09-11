module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

	sass: {
		main: {
			files: {
				'socializer.css': 'scss/socializer.scss',
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
                'scss/socializer.scss',
                'scss/_config.scss',
                'scss/_hover.scss',
                'scss/_misc.scss',
                'scss/_shapes.scss',
                'scss/_text.scss',
                'scss/_styles.scss',
                'scss/_types.scss',
                'scss/_sharebar.scss',
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
