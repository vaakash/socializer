/**
  * Socializer.js - Javascript helper for socializer CSS
  * Aakash Chakravarthy - www.aakashweb.com
  * MIT License
  */
 
(function(){
    
    // Constructor
    function _socializer( ele, options ){
        
        this.elements = document.querySelectorAll( ele );
        this.options = options;
        
        if( this.elements.length == 0 ){
            return this.elements;
        }
        
        this.init();
        
    }
    
    // Protos
    _socializer.prototype = {
        
        defaults: {
            sites: 'facebook,twitter,googleplus,pinterest,email,rss',
            size: '32px',
            theme: 'solid',
            shape: '',
            gutter: true,
            hover: '',
            type: '',
            more: ''
        },
        
        init: function(){
            
            this.options = fn.extend( {}, this.defaults, this.options );
            
            this.applyClass();
            
            this.generateHTML();
            
        },
        
        applyClass: function(){
            
            t = this;
            this.setClass();
            
            fn.each( this.elements, function( ele ){
                fn.addClass( ele, 'socializer' );
                this.classes.forEach(function( className ){
                    fn.addClass( ele, 'socializer--' + className );
                });
            });
            
        },
        
        setClass: function(){
            
            opts = this.options;
            classes = [];
            
            if( opts.size ) classes.push( opts.size );
            if( opts.theme ) classes.push( opts.theme );
            if( opts.shape ) classes.push( opts.shape );
            if( opts.gutter ) classes.push( 'pad' );
            if( opts.hover ) classes.push( opts.hover );
            if( opts.type ) classes.push( opts.type );
            
            this.classes = classes;
            
        },
        
        sites:{
            
            facebook: 'facebook',
            twitter: 'twitter',
            'google-plus': 'google-plus',
            pinterest: 'pinterest',
            email: 'envelope',
            rss: 'rss'
            
        },
        
        generateHTML: function(){
            
            t = this;
            opts = this.options;
            html = [];
            
            if( typeof opts.sites == 'string' )
                opts.sites = opts.sites.split( ',' );
            
            opts.sites.forEach( function( site ){
                if( site in t.sites ){
                    html.push( '<li class="socializer__' + site + '"><a href="#"><i class="fa fa-' + t.sites[ site ] + '"></i></a></li>' );
                }
            });
            
            html = html.join( '' );
            
            fn.each( this.elements, function( ele ){
                ele.innerHTML = html;
            });
            
        }
    }
    
    // Factory
    this.socializer = function( ele, options ){
        return new _socializer( ele, options );
    }
    
    // Helpers
    fn = {
        
        each: function( a, c ){
            return Array.prototype.forEach.call( a, c );
        },
        
        addClass: function( e, c ){
            if( e.classList )
                e.classList.add( c );
            else
                e.className += ' ' + c;
        },
        
        extend: function( out ){
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i])
                    continue;

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
                }
            }

            return out;
        }
        
    };
    
}());