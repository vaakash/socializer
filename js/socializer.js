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
            
            if( this.ele.children.length < 100 ){
                this.setHTML( this.ele );
            }
            
            this.events();
            
        },
        
        sites: {
            'addtofavorites': [ 'Add to favorites', 'fa fa-star', '#', '#F9A600', 'socializer_addbookmark(event)' ],
            'behance': [ 'Behance', 'fab fa-behance', 'https://www.behance.net/', '#1769ff', '' ],
            'bitbucket': [ 'Bitbucket', 'fab fa-bitbucket', 'https://bitbucket.org/', '#205081', '' ],
            'blogger': [ 'Blogger', 'fab fa-rss-square', 'https://www.blogger.com/blog-this.g?u={url}&n={title}&t={excerpt}', '#FF6501', '' ],
            'codepen': [ 'CodePen', 'fab fa-codepen', 'https://codepen.io', '#000', '' ],
            'comments': [ 'Comments', 'fa fa-comments', '#', '#333', '' ],
            'delicious': [ 'Delicious', 'fab fa-delicious', 'https://delicious.com/post?url={url}&title={title}&notes={excerpt}', '#3274D1', '' ],
            'deviantart': [ 'DeviantArt', 'fab fa-deviantart', 'https://deviantart.com', '#475c4d', '' ],
            'digg': [ 'Digg', 'fab fa-digg', 'https://digg.com/submit?url={url}&title={title}', '#000', '' ],
            'discord': [ 'Discord', 'fab fa-discord', 'https://discord.com/', '#7289da', '' ],
            'dribbble': [ 'Dribbble', 'fab fa-dribbble', 'https://dribbble.com/', '#ea4c89', '' ],
            'email': [ 'Email', 'fa fa-envelope', 'mailto:?to=&subject={title}&body={excerpt}%20-%20{url}', '#000', '' ],
            'etsy': [ 'Etsy', 'fab fa-etsy', 'https://www.etsy.com/', '#f1641e', '' ],
            'facebook': [ 'Facebook', 'fab fa-facebook-f', 'https://www.facebook.com/share.php?u={url}&t={title}', '#1977f3', '' ],
            'fbmessenger': [ 'Facebook messenger', 'fa fa-comment', 'fb-messenger://share?link={url}', '#2998ff', '' ],
            'flickr': [ 'Flickr', 'fab fa-flickr', 'https://www.flickr.com', '#1c9be9', '' ],
            'github': [ 'Github', 'fab fa-github', 'https://www.github.com/', '#333', '' ],
            'google': [ 'Google', 'fab fa-google', 'https://www.google.com/bookmarks/mark?op=edit&bkmk={url}&title={title}&annotation={excerpt}', '#3A7CEC', '' ],
            'googleplus': [ 'Google Plus', 'fab fa-google-plus', 'https://plus.google.com/share?url={url}', '#DB483B', '' ],
            'hackernews': [ 'Hacker News', 'fab fa-hacker-news', 'https://news.ycombinator.com/submitlink?u={url}&t={title}', '#FF6500', '' ],
            'houzz': [ 'Houzz', 'fab fa-houzz', 'https://instagram.com', '#4dbc15', '' ],
            'instagram': [ 'Instagram', 'fab fa-instagram', 'https://instagram.com', '#e23367', '' ],
            'line': [ 'Line', 'fa fa-line', 'https://social-plugins.line.me/lineit/share?url={url}', '#00C300', '' ],
            'linkedin': [ 'LinkedIn', 'fab fa-linkedin', 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={excerpt}', '#0274B3', '' ],
            'medium': [ 'Medium', 'fab fa-medium', 'https://medium.com', '#02b875', '' ],
            'mix': [ 'Mix', 'fab fa-mix', 'https://mix.com/mixit?url={url}', '#ff8226', '' ],
            'odnoklassniki': [ 'Odnoklassniki', 'fab fa-odnoklassniki', 'https://connect.ok.ru/dk?st.cmd=OAuth2Login&st.layout=w&st.redirect=%252Fdk%253Fcmd%253DWidgetSharePreview%2526amp%253Bst.cmd%253DWidgetSharePreview%2526amp%253Bst.shareUrl%253D{url}&st._wt=1&st.client_id=-1', '#F2720C', '' ],
            'patreon': [ 'Patreon', 'fab fa-patreon', 'https://patreon.com', '#e85b46', '' ],
            'paypal': [ 'PayPal', 'fab fa-paypal', 'https://paypal.com', '#0070ba', '' ],
            'pdf': [ 'PDF', 'fa fa-file-pdf-o', 'https://www.printfriendly.com/print?url={url}', '#E61B2E', '' ],
            'phone': [ 'Phone', 'fa fa-phone', '#', '#1A73E8', '' ],
            'pinterest': [ 'Pinterest', 'fab fa-pinterest', 'https://www.pinterest.com/pin/create/button/?url={url}&media={image}&description={excerpt}', '#CB2027', '' ],
            'pocket': [ 'Pocket', 'fab fa-get-pocket', 'https://getpocket.com/save?url={url}&title={title}', '#EF4056', '' ],
            'print': [ 'Print', 'fa fa-print', 'https://www.printfriendly.com/print?url={url}', '#6D9F00', '' ],
            'reddit': [ 'Reddit', 'fab fa-reddit', 'https://reddit.com/submit?url={url}&title={title}', '#FF5600', '' ],
            'renren': [ 'Renren', 'fab fa-renren', 'https://www.connect.renren.com/share/sharer?url={url}&title={title}', '#005EAC', '' ],
            'rss': [ 'RSS', 'fa fa-rss', '{rss-url}', '#FF7B0A', '' ],
            'shortlink': [ 'Short link', 'fa fa-link', '{url}', '#333', 'socializer_shortlink( event, this )' ],
            'skype': [ 'Skype', 'fab fa-skype', 'https://web.skype.com/share?url={url}', '#00AFF0', '' ],
            'snapchat': [ 'Snapchat', 'fab fa-snapchat', 'https://snapchat.com', '#FFFC00', '' ],
            'soundcloud': [ 'Soundcloud', 'fab fa-soundcloud', 'https://soundcloud.com/', '#f50', '' ],
            'stackoverflow': [ 'StackOverflow', 'fab fa-stack-overflow', 'https://stackoverflow.com/', '#F48024', '' ],
            'quora': [ 'Quora', 'fab fa-quora', 'https://www.quora.com', '#b92b27', '' ],
            'telegram': [ 'Telegram', 'fab fa-telegram', 'https://telegram.me/share/url?url={url}&text={title}', '#179cde', '' ],
            'tumblr': [ 'Tumblr', 'fab fa-tumblr', 'https://www.tumblr.com/share?v=3&u={url}&t={title}&s={excerpt}', '#314358', '' ],
            'twitch': [ 'Twitch', 'fab fa-twitch', 'https://www.twitch.tv', '#4b367c', '' ],
            'twitter': [ 'Twitter', 'fab fa-twitter', 'https://twitter.com/intent/tweet?text={title}%20-%20{url}%20{twitter-username}', '#1da1f2', '' ],
            'viber': [ 'Viber', 'fab fa-viber', 'https://viber.com', '#574e92', '' ],
            'vimeo': [ 'Vimeo', 'fab fa-vimeo', 'https://vimeo.com', '#00ADEF', '' ],
            'vkontakte': [ 'VKontakte', 'fab fa-vk', 'https://vk.com/share.php?url={url}&title={title}&description={excerpt}', '#4C75A3', '' ],
            'wechat': [ 'WeChat', 'fab fa-wechat', 'weixin://dl/chat?text={url}', '#7BB32E', '' ],
            'weibo': [ 'Weibo', 'fab fa-weibo', 'http://service.weibo.com/share/share.php?url={url}&title={title}', '#E6162D', '' ],
            'whatsapp': [ 'WhatsApp', 'fab fa-whatsapp', 'https://api.whatsapp.com/send?text={title}%20{url}', '#60b82d', '' ],
            'xing': [ 'Xing', 'fab fa-xing', 'https://www.xing.com/app/user?op=share&url={url}', '#006567', '' ],
            'yahoomail': [ 'Yahoo! Bookmarks', 'fab fa-yahoo', 'https://compose.mail.yahoo.com/?body={excerpt}%20-%20{url}&subject={title}', '#4A00A1', '' ],
            'youtube': [ 'Youtube', 'fab fa-youtube-play', 'https://youtube.com/', '#ff0000', '' ],
            'more': [ 'More', 'fa fa-share-alt', '#', 'green', '' ]
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
            
            fn.removeClass( ele, 'sr-' );
            fn.addClass( ele, 'socializer' );
            
            features.forEach(function( className ){
                fn.addClass( ele, 'sr-' + className );
            });
            
        },
        
        getHTML: function( sites, tag, showText ){
            
            var child = ( tag == 'UL' ) ? 'li' : 'span',
                html = [],
                opts = this.ele.socializer;
                
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
                        textClass = ' sr-text-' + showText,
                        link = this.getLink( site ),
                        onclick = ( this.sites[ site ][ 4 ] == '' ) ? '' : 'onclick="' + this.sites[ site ][ 4 ] + '"';

                    if( showText == 'in' )
                        textIn = text;
                    else if( showText == 'no' )
                        textClass = '';
                    else
                        textOut = text;

                    icon = ( opts.features.search( 'no-icon' ) == -1 ) ? '<i class="' + this.sites[ site ][ 1 ] + '"></i>' : '';

                    html.push( '<' + child + ' class="sr-' + site + textClass + '"><a href="'+ link +'" target="_blank" ' + onclick + ' title="' + this.sites[ site ][ 0 ] + '">' + icon + textIn + '</a>' + textOut + moreHTML + '</' + child + '>' );
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
            
            this.link = (typeof opts.meta.link !== 'undefined' && opts.meta.link) ? opts.meta.link : window.location.href;
            this.title = (typeof opts.meta.title !== 'undefined' && opts.meta.title) ? opts.meta.title : document.title;
            this.description = (typeof opts.meta.description !== 'undefined' && opts.meta.description) ? opts.meta.description : '';
            this.image = (typeof opts.meta.image !== 'undefined' && opts.meta.image) ? opts.meta.image : '';
            this.rss = (typeof opts.meta.rss !== 'undefined' && opts.meta.rss) ? opts.meta.rss : '';
            this.twitterusername = (typeof opts.meta.twitterusername !== 'undefined' && opts.meta.twitterusername) ? opts.meta.twitterusername : '';
            
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
                link = ( opts.meta[ site ] ) ? opts.meta[ site ] : this.sites[ site ][ 2 ];
  
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
                    if( !( href == '#' || anchor.hasAttribute( 'onclick' ) ) ){
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

        extend: function(out){
            out = out || {};

            for (var i = 1; i < arguments.length; i++){
                if (!arguments[i])
                  continue;

                for (var key in arguments[i]) {
                  if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
                }
            }

            return out;
        },
        
        nest: function( base, array, value ){
            for( var i = 0; i < array.length; i++ ) {
                base = base[ array[i] ] = base[ array[i] ] || ( i == array.length-1 ? value: {} );
            }
        },
        
        popup: function( url, title, w, h ){
            var left = ( screen.width/2 )-( w/2 ),
                top = ( screen.height/2 )-( h/2 );
                
            return window.open( url, title, 'toolbar=no,location=no,menubar=no,scrollbars=no,width='+w+',height='+h+',top='+top+',left='+left );
        },

    };
    
}());

function socializer_addbookmark( e ){
    var ua = navigator.userAgent.toLowerCase();
    var isMac = (ua.indexOf('mac') != -1), str = '';
    e.preventDefault();
    str = (isMac ? 'Command/Cmd' : 'CTRL') + ' + D';
    alert('Press ' + str + ' to bookmark this page');
}

function socializer_shortlink( e, t ){
    e.preventDefault();
    link = t.getAttribute( 'href' );
    if( link != '#' )
        prompt( 'Short link', link );
}