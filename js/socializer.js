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
        this.length = this.elements.length;
        
        if( this.length == 0 ){
            return this;
        }
        
        this.init();
        
        return this;
        
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
            more: '',
            link: '',
            text: false
        },
        
        init: function(){
            
            this.options = fn.extend( {}, this.defaults, this.options );
            this.getClass();
            this.setClass();
            this.setMeta();
            this.setHTML();
            
        },
        
        sites:{
            addtofavorites: [ 'Add to favorites', 'star', '{de-url}" onclick="addBookmark(event);' ],
            blogger: [ 'Blogger', 'rss-square', 'http://www.blogger.com/blog_this.pyra?t&u={url}&n={title}&pli=1' ],
            delicious: [ 'Delicious', 'delicious', 'http://delicious.com/post?url={url}&amp;title={title}&amp;notes={excerpt}' ],
            digg: [ 'Digg', 'digg', 'http://digg.com/submit?phase=2&amp;url={url}&amp;title={title}&amp;bodytext={excerpt}' ],
            email: [ 'Email', 'envelope', 'mailto:?to=&subject={title}&body={excerpt}%20-%20{de-url}' ],
            facebook: [ 'Facebook', 'facebook', 'http://www.facebook.com/share.php?u={url}&amp;t={title}' ],
            google: [ 'Google', 'google', 'http://www.google.com/bookmarks/mark?op=edit&amp;bkmk={url}&amp;title={title}&amp;annotation={excerpt}' ],
            googleplus: [ 'Google Plus', 'google-plus', 'https://plus.google.com/share?url={url}' ],
            hackernews: [ 'Hacker News', 'hacker-news', 'http://news.ycombinator.com/submitlink?u={url}&amp;t={title}' ],
            linkedin: [ 'LinkedIn', 'linkedin', 'http://linkarena.com/bookmarks/addlink/?url={url}&amp;title={title}' ],
            pdf: [ 'PDF', 'file-pdf-o', 'http://www.printfriendly.com/print?url={url}' ],
            pinterest: [ 'Pinterest', 'pinterest', 'http://www.pinterest.com/pin/create/button/?url={url}&amp;media={image}&amp;description={excerpt}' ],
            print: [ 'Print', 'print', 'http://www.printfriendly.com/print?url={url}' ],
            reddit: [ 'Reddit', 'reddit', 'http://reddit.com/submit?url={url}&amp;title={title}' ],
            rss: [ 'RSS', 'rss', '{rss-url}' ],
            stumbleupon: [ 'StumbleUpon', 'stumbleupon', 'http://www.stumbleupon.com/submit?url={url}&amp;title={title}' ],
            tumblr: [ 'Tumblr', 'tumblr', 'http://www.tumblr.com/share?v=3&amp;u={url}&amp;t={title}&amp;s={excerpt}' ],
            twitter: [ 'Twitter', 'twitter', 'http://twitter.com/home?status={title}%20-%20{s-url}%20{twitter-username}' ],
            vkontakte: [ 'VKontakte', 'vk', 'http://vk.com/share.php?url={url}&title={title}&description={excerpt}' ],
            yahoobookmarks: [ 'Yahoo! Bookmarks', 'yahoo', 'http://bookmarks.yahoo.com/toolbar/savebm?u={url}&amp;t={title}&opener=bm&amp;ei=UTF-8&amp;d={excerpt}' ], 
            more: [ 'More', 'share', '#' ]
        },
        
        getClass: function(){
            
            var opts = this.options,
                classes = [];
            
            if( opts.size ) classes.push( opts.size );
            if( opts.theme ) classes.push( opts.theme );
            if( opts.shape ) classes.push( opts.shape );
            if( opts.gutter ) classes.push( 'pad' );
            if( opts.hover ) classes.push( opts.hover );
            if( opts.type ) classes.push( opts.type );
            
            return this.classes = classes;
            
        },
        
        setClass: function(){
            
            fn.each( this.elements, function( ele ){
                fn.addClass( ele, 'socializer' );
                this.classes.forEach(function( className ){
                    fn.addClass( ele, 'socializer--' + className );
                });
            }, this);
            
        },
        
        getHTML: function( sites, tag ){
            
            var opts = this.options,
                child = ( tag == 'UL' ) ? 'li' : 'span',
                html = [];

            sites.forEach( function( site ){
                
                if( site in this.sites || typeof site == 'object' ){
                    
                    var moreHTML = '';
                    
                    if( site == 'more' || typeof site == 'object' ){
                        
                        var moreList = ( typeof site == 'object' ) ? site : ( ( site.more ) ? site.more : [] ),
                            site = 'more';
                        
                        if( moreList.length > 0 ){
                            moreHTML = this.getHTML( moreList, 'ul' );
                            moreHTML = '<ul class="socializer">' + moreHTML + '</ul>';
                        }
                    }
                    
                    var text = ( opts.text ) ? '<span class="text">' + this.sites[ site ][ 0 ] + '</span>' : '',
                        textClass = ( text ) ? ' socializer--text' : '';
                        
                    html.push( '<' + child + ' class="socializer__' + site + textClass + '"><a href="#"><i class="fa fa-' + this.sites[ site ][ 1 ] + '"></i>' + text + '</a>' + moreHTML +'</' + child + '>' );
                }
            }, this);

            return html.join( '' );
            
        },
        
        setHTML: function(){

            var opts = this.options;
            
            opts.sites = ( typeof opts.sites == 'string' ) ? opts.sites.split( ',' ) : opts.sites;
            opts.sites.more = ( typeof opts.more == 'string' ) ? opts.more.split( ',' ) : opts.more;
            
            fn.each( this.elements, function( ele ){
                var html = this.getHTML( opts.sites );
                ele.innerHTML = html;
            }, this);
            
        },
        
        setMeta: function(){
            
            var opts = this.options;
            
            if( opts.link ){
                this.link = opts.link;
                this.desc = opts.description;
            }else{
                this.link = window.location.href;
                this.description = document.title;
            }
            
        },
        
        getLink: function( site ){
            
        }
        
    }
    
    // Factory
    this.socializer = function( ele, options ){
        return new _socializer( ele, options );
    }
    
    // Helpers
    fn = {
        
        each: function ( array, callback, scope ){
            for ( var i = 0; i < array.length; i++ ){
                callback.call( scope, array[i], i);
            }
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