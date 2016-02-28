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
            return this;
        }
        
        fn.each( this.elements, function( ele ){
            this.ele = ele;
            this.init();
        }, this );
        
        return this;
        
    }
    
    // Protos
    _socializer.prototype = {
        
        defaults: {
            sites: [ 'facebook', 'twitter', 'googleplus', 'print', 'email', 'rss' ],
            features: '32px,solid',
            more: '',
            meta: {
                link: '',
                title: '',
                description: '',
                image: '',
                rss: '',
                twitterusername: '',
            },
            text: 'no'
        },
        
        init: function(){
            
            this.initOptions();
            this.setClass();
            this.setMeta();
            
            if( this.ele.children.length == 0 ){
                this.setHTML( this.ele );
            }
            
            this.events();
            
        },
        
        sites:{
            addtofavorites: [ 'Add to favorites', 'star', '#" onclick="socializer_addbookmark(event)' ],
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
            twitter: [ 'Twitter', 'twitter', 'http://twitter.com/home?status={title}%20-%20{url}%20{twitter-username}' ],
            vkontakte: [ 'VKontakte', 'vk', 'http://vk.com/share.php?url={url}&title={title}&description={excerpt}' ],
            yahoobookmarks: [ 'Yahoo! Bookmarks', 'yahoo', 'http://bookmarks.yahoo.com/toolbar/savebm?u={url}&amp;t={title}&opener=bm&amp;ei=UTF-8&amp;d={excerpt}' ], 
            more: [ 'More', 'share', '#' ]
        },
        
        initOptions: function(){
            
            var datas = {};
            
            for ( var att, i = 0, atts = this.ele.attributes, n = atts.length; i < n; i++){
                att = atts[i];
                if( att.nodeName.search( 'data' ) != -1 ){
                    props = att.nodeName.replace( 'data-', '' );
                    fn.nest( datas, props.split( '-' ), att.nodeValue );
                }
            }

            var opts = fn.extend( {}, this.defaults, this.options, datas );

            opts.sites = ( typeof opts.sites == 'string' ) ? opts.sites.split( ',' ) : opts.sites;
            opts.sites.more = ( typeof opts.more == 'string' ) ? opts.more.split( ',' ) : opts.more;

            this.ele.socializer = opts;
            
        },

        setClass: function(){
            
            var ele = this.ele,
                opts = this.ele.socializer,
                features = opts.features.split( ',' );
            
            fn.removeClass( ele, 'socializer' );
            fn.addClass( ele, 'socializer' );
            
            features.forEach(function( className ){
                fn.addClass( ele, 'socializer--' + className );
            });
            
        },
        
        getHTML: function( sites, tag, showText ){
            
            var child = ( tag == 'UL' ) ? 'li' : 'span',
                html = [];
                
            sites.forEach( function( site ){
                
                if( site in this.sites || typeof site == 'object' ){
                    var moreHTML = '';
                    if( site == 'more' || typeof site == 'object' ){
 
                        var moreList = ( typeof site == 'object' ) ? site : ( ( sites.more ) ? sites.more : [] ),
                            site = 'more';
                        
                        if( moreList.length > 0 ){
                            moreHTML = this.getHTML( moreList, 'UL', showText );
                            moreHTML = '<ul class="socializer">' + moreHTML + '</ul>';
                        }
                    }

                    var text = '<span class="text">' + this.sites[ site ][ 0 ] + '</span>',
                        textIn = textOut = '',
                        textClass = ' socializer--text-' + showText,
                        link = this.getLink( site );

                    if( showText == 'in' )
                        textIn = text;
                    else if( showText == 'no' )
                        textClass = '';
                    else
                        textOut = text;

                    html.push( '<' + child + ' class="socializer__' + site + textClass + '"><a href="'+ link +'" target="_blank" title="' + this.sites[ site ][ 0 ] + '"><i class="fa fa-' + this.sites[ site ][ 1 ] + '"></i>' + textIn + '</a>' + textOut + moreHTML + '</' + child + '>' );
                }
            }, this);

            return html.join( '' );
            
        },
        
        setHTML: function(){

            var opts = this.ele.socializer,
                html = this.getHTML( opts.sites, this.ele.tagName, opts.text );
                
            this.ele.innerHTML = html;
            fn.addClass( this.ele, 'a' );
        },
        
        setMeta: function(){
            
            var opts = this.ele.socializer;
            
            if( opts.meta.link ){
                this.link = opts.meta.link;
                this.title = opts.meta.title;
                this.description = opts.meta.description;
                this.image = opts.meta.image;
                this.rss = opts.meta.rss;
                this.twitterusername = opts.meta.twitterusername;
            }else{
                this.link = window.location.href;
                this.title = document.title;
                this.description = '';
                this.image = '';
                this.rss = '';
                this.twitterusername = '';
            }
            
        },

        getLink: function( site ){
            
            var replaceMap = {
                '{url}' : encodeURIComponent( this.link ),
                '{title}': encodeURIComponent( this.title ),
                '{excerpt}': encodeURIComponent( this.description ),
                '{image}': encodeURIComponent( this.image ),
                '{rss-url}': encodeURIComponent( this.rss ),
                '{twitter-username}': encodeURIComponent( this.twitterusername ),
            },
                opts = this.ele.socializer,
                link = ( opts.meta[ site ] ) ? opts.meta[ site ]: this.sites[ site ][ 2 ];
  
            for( var item in replaceMap ){
                if( replaceMap.hasOwnProperty( item ) ){
                    link = link.replace( item, replaceMap[ item ] );
                }
            }
            
            return link;
            
        },
        
        events: function(){
            anchors = this.ele.querySelectorAll( 'a' );
            
            fn.each( anchors, function( anchor ){
                anchor.addEventListener( 'click', function(e){
                    var href = anchor.getAttribute( 'href' );
                    if( href != '#' ){
                        var scrWindow = fn.popup( href, "_blank", 800, 500);
                    }
                    e.preventDefault();
                });
            }, this);
            
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
        
        removeClass: function( e, c ){
            var a = e.className.split( ' ' ),
                b = [];
                
            a.forEach( function( d, i ){
                if( d.search( c ) == -1 ){
                    b.push( d );
                }
            });
            
            e.className = b.join( ' ' );
            
        },

        extend: function(out) {
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
        },
        
        nest: function( base, array, value ) {
            for( var i = 0; i < array.length; i++ ) {
                base = base[ array[i] ] = base[ array[i] ] || ( i == array.length-1 ? value: {} );
            }
        },
        
        popup: function( url, title, w, h ) {
            var left = ( screen.width/2 )-( w/2 ),
                top = ( screen.height/2 )-( h/2 );
                
            return window.open( url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left );
        } 

    };
    
}());

function socializer_addbookmark( e ){
    var ua = navigator.userAgent.toLowerCase();
    var isMac = (ua.indexOf('mac') != -1), str = '';
    e.preventDefault();
    str = (isMac ? 'Command/Cmd' : 'CTRL') + ' + D';
    alert('Press ' + str + ' to bookmark this page');
}