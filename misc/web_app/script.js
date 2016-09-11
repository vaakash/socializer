$(document).ready(function(){
    
    api = {};
    page_vals = {};
    $site_list_tmpl = $( '<li><span></span><i class="fa fa-cog site_action site_settings" title="Button settings"></i><i class="fa fa-trash-o site_action site_delete" title="Delete button"></i><div class="site_settings_wrap"><input type="text" class="site_meta form-control" placeholder="Enter custom button URL. Use {url}, {title} as placeholders" /></div></li>' );
    default_values = {
        'sites': [ 'facebook', 'googleplus', 'print', 'email', 'rss' ],
        'sizes': '32px',
        'shapes': 'circle',
        'hover': '',
        'layouts': '',
        'text-styles': '',
        'font-size': '',
        'icon-color': 'icon-white',
        'border-color': '',
        'background-color': '',
        'border-width': '',
        'shadow': '',
        'pad': 'pad',
        'multiline': '',
        'more-count': 0,
        'sharebar-orientation': 'hl-top',
        'sharebar-theme': '',
        'btn-type': 'hbar'
    };
    $sites_sel_list = $('.scr_sites_sel');
    $preview = $( '.app_preview .socializer' );
    values = {};
    hashValues = {};
    previewCount = 0;
    btnType = 'hBar';
    
    $.getJSON( 'https://api.myjson.com/bins/1gtbg', function(data){
        api = data;
        init();
    });
    
    var parseHash = function(){
        var hash = window.location.hash;
        if( hash.length > 0 ){
            var the_json = hash.substr( 1 );
            try{
                the_json = atob( the_json );
                page_vals = JSON.parse( the_json );
                return page_vals;
            }catch(err){
                console.error( err );
                return {};
            }
        }
    }
    
    var addSite = function( ele, site ){
        if( site in api[ 'sites' ] ){
            var site_prop = api[ 'sites' ][ site ];
            var item = $site_list_tmpl.clone();
            
            item.find( 'span' ).text( site_prop[ 0 ] );
            item.attr( 'data-site', site );

            ele.append( item.clone() );
        }
    }
    
    var generateSelect = function( ele, items, value, group ){
        $.each( items, function( id, name ){
            ele.append( '<option value="' + id + '">' + name + '</option>' );
        });
        ele.find( 'option[value="' + value + '"]' ).attr( 'selected', 'selected' );
        ele.attr( 'data-group', group );
    }
    
    var getFeaturesValue = function(){
        groupVal = [];
        $( '.app_wrap [data-group="features"]' ).each(function(){
            var feature = $(this).data( 'setting' );
            var featVal = $(this).val();
            if( featVal != '' ){
                groupVal.push( featVal );
            }
            
            // Add to hash
            if( featVal != default_values[ feature ] ){
                hashValues[ feature ] = featVal
            }else{
                delete hashValues[ feature ];
            }
            
        });
        
        return groupVal.join( ',' );
    }
    
    var getTextValue = function(){
        textVal = $( '.app_wrap [data-group="text"]' ).val();
        
        // Add to hash
        if( textVal != '' ){
            hashValues[ 'text-styles' ] = textVal;
        }else{
            delete hashValues[ 'text-styles' ];
        }
        
        return textVal;
    }
    
    var getSharebarValues = function(){
        var classes = [];
        var prevType = btnType;
        var type = getButtonType();
        var $layoutSetting = $( '[data-setting=layouts]' );
        
        $( '.app_wrap [data-group="sharebar"]' ).each(function(){
            var sbSetting = $(this).data( 'setting' );
            var sbVal = $(this).val();
            
            // value = hl-top => sr-sb-hl sr-sb-top
            if( sbSetting == 'sharebar-orientation' ){
                var valSplit = sbVal.split( '-' );
                var orientation = valSplit[0];
                var side = valSplit[1];
                
                if( prevType != type || type == 'vbar' ){
                    if( orientation == 'hl' ){
                        $layoutSetting.val( '' );
                    }else{
                        $layoutSetting.val( 'vertical' );
                    }
                }
                
                classes.push( 'sr-sb-' + orientation );
                classes.push( 'sr-sb-' + side );
            }else{
                if( sbVal != '' ){
                    classes.push( 'sr-sb-' + sbVal );
                }
            }
            
            if( sbVal != default_values[ sbSetting ] ){
                hashValues[ sbSetting ] = sbVal;
            }else{
                delete hashValues[ 'text-styles' ];
            }
            
        });
        
        if( type != default_values[ 'btn-type' ] ){
            hashValues[ 'btn-type' ] = type;
        }else{
            delete hashValues[ 'btn-type' ];
        }
        
        return classes.join( ' ' );
    }
    
    var getSitesValue = function(){
        siteList = [];
        $sites_sel_list.children().each(function(){
            siteList.push( $(this).data( 'site' ) );
        });
        
        moreCount = parseInt( $( '.more_sites' ).val() );
        if( isNaN( moreCount ) || moreCount == 0 ){
            moreCount = -siteList.length;
        }
        
        activeSites = siteList.slice( 0, -moreCount );
        moreSites = siteList.slice( -moreCount );
        
        if( moreCount > 0 && $.inArray( 'more', siteList ) == -1 )
            activeSites.push( 'more' );
        
        // Add to hash
        if( siteList.length > 0 )
            hashValues[ 'sites' ] = siteList;
        else
            delete hashValues[ 'sites' ]
        
        if( moreCount > 0 )
            hashValues[ 'more-count' ] = moreCount;
        else
            delete hashValues[ 'more-count' ]
        
        return {
            'active': activeSites.join( ',' ),
            'more': moreSites.join( ',' ),
        };
    }
    
    var getMetaValues = function(){
        metas = {};
        $sites_sel_list.children().each(function(){
            site = $(this).data( 'site' );
            metaVal = $(this).find( '.site_meta' ).val();
            metas[ site ] = metaVal;
        });
        return metas;
    }
    
    var getAllValues = function(){
        allValues =  {
            'features': getFeaturesValue(),
            'text': getTextValue(),
            'sites': getSitesValue()[ 'active' ],
            'more': getSitesValue()[ 'more' ],
            'meta': getMetaValues()
        }
        //window.location.hash = JSON.stringify( hashValues );
        
        return allValues;
    }
    
    var getButtonType = function(){
        return $( '.scr_btn_sel:checked' ).val();
    }
    
    var setButtonType = function(){
        var type = getButtonType();
        var $sbSection = $( '.sb_section' );
        var $layoutsRow = $( '.layouts_row' );
        var sbClasses = getSharebarValues();
        var $sbPreviewTxt = $( '.sbPreviewTxt' );
        
        if( type == 'hbar' ){
            $sbSection.hide();
            $layoutsRow.slideDown();
            $sbPreviewTxt.hide();
            if( $preview.parent().hasClass( 'sr-sharebar' ) ){
                $preview.unwrap( 'div' );
            }
        }else{
            $sbSection.slideDown();
            $layoutsRow.slideUp();
            $sbPreviewTxt.show();
            if( !$preview.parent().hasClass( 'sr-sharebar' ) ){
                $sbWrap = $preview.wrap( '<div></div>' );
            }
            $preview.parent().attr( 'class', 'sr-sharebar ' + sbClasses );
        }
        
        btnType = type;
    }
    
    var setPreviewData = function( attrName, attrVal ){
        if( attrVal != '' ){
            $preview.attr( attrName, attrVal );
        }else{
            $preview.removeAttr( attrName );
        }
    }
    
    var setCode = function(){
        var $appPreviewWithJS = $( '.app_preview' ).clone();
        var $appPreviewWithoutJS = $( '.app_preview' ).clone();
        var $scrWithJS = $appPreviewWithJS.find( '.socializer' );
        var $scrWithoutJS = $appPreviewWithoutJS.find( '.socializer' );
        var toRemove = [ 'data-sites', 'data-features', 'data-text' ];
        
        // Remove these in HTML mode
        for( var i = 0, atts = $preview[0].attributes, n = atts.length, arr = []; i < n; i++ ){
            var attr = atts[i].nodeName;
            if( $.inArray( attr, toRemove ) != -1 || attr.search( 'meta' ) != -1 ){
                $scrWithoutJS.removeAttr( attr );
            }
        }
        $( '.withoutjs_code' ).text( $.trim( $appPreviewWithoutJS.html() ) );
        
        $scrWithJS.empty().attr( 'class', 'socializer' );
        $( '.withjs_code' ).text( $.trim( $appPreviewWithJS.html() ) );
    }
    
    var refreshPreview = function(){
        
        setButtonType();
        all = getAllValues();
        setCodeTypeFields();
        
        setPreviewData( 'data-features', all[ 'features' ] );
        setPreviewData( 'data-sites', all[ 'sites' ] );
        setPreviewData( 'data-text', all[ 'text' ] );
        setPreviewData( 'data-more', all[ 'more' ] );
        
        if( !$( '.page_info_auto' ).is( ':checked' ) ){
            $preview.attr( 'data-meta-link', $( '.page_url' ).val() );
            $preview.attr( 'data-meta-title', $( '.page_title' ).val() );
        }else{
            $preview.removeAttr( 'data-meta-link' );
            $preview.removeAttr( 'data-meta-title' );
        }
        
        $.each( all[ 'meta' ], function( metaSiteName, metaSiteVal ){
            setPreviewData( 'data-meta-' + metaSiteName , metaSiteVal );
        });
        
        socializer( '.socializer' );
        
        setCode();
        
        previewCount++;
        
    }
    
    var setCodeTypeFields = function(){
        
        $( '.code_withjs, .code_withoutjs' ).hide();
        
        if( $( '.code_type:checked' ).val() == 'js' ){
            $( '.page_details' ).show();
            $( '.page_info_auto_wrap' ).show();
            $( '.code_withjs' ).show();
        }else{
            $( '.page_details' ).show();
            $( '.page_info_auto' ).removeAttr( 'checked' )
            $( '.page_info_auto_wrap' ).hide();
            $( '.code_withoutjs' ).show();
        }
        
        if( $( '.page_info_auto' ).is( ':checked' ) ){
            $( '.page_details' ).hide();
        }else{
            $( '.page_details' ).show();
        }
        
    }
    
    var getShareUrl = function(){
        return [location.protocol, '//', location.host, location.pathname].join('') + '#' + btoa( JSON.stringify( hashValues ) );
    }
    
    var init = function(){
        
        values = $.extend( {}, default_values,  parseHash() );
        
        Sortable.create( $sites_sel_list[0], {
            onEnd: refreshPreview
        });
        
        $.each( values[ 'sites' ], function( i ){
            var site = values[ 'sites' ][ i ];
            addSite( $sites_sel_list, site );
        });
        
        $.each( api[ 'sites' ], function( i, site ){
            $('.scr_sites').append( '<option value="'+ i +'">' + site[0] + '</option>' );
        });

        $( '.app_wrap [data-setting]' ).each(function(){
            var feature = $(this).data( 'setting' );
            if( feature != 'sites' ){
                var config = api['settings'][ feature ];
                if ( config[ 'type' ] == 'select' ){
                    generateSelect( $(this), config[ 'options' ], values[ feature ], config[ 'group' ] );
                }
            }
        });
        
        $btnType = $( '.scr_btn_sel[value="' + values[ 'btn-type' ] + '"]' );
        $btnType.attr( 'checked', 'checked' );
        $btnType.parent().addClass( 'active' );
        
        $( '.more_sites' ).val( values[ 'more-count' ] );
        
        moreSitesChange();
        refreshPreview();
    }
    
    var getShortUrl = function( url ){
        var surl = '';
        var $shareBoxWrap = $( '.preview_sharebox' );
        var $shareBox = $( '.share_box' ).fadeTo( 'fast', 0.2 );
        
        $shareBoxWrap.addClass( 'preview_loading' );
        
        $.ajax({
            type: 'POST',
            url: 'https://www.googleapis.com/urlshortener/v1/url?key=',
            data: '{"longUrl": "' + url + '"}',
            success: function(data){
                surl = data[ 'id' ];
                $shareBoxWrap.removeClass( 'preview_loading' );
                $shareBox.fadeTo( 'slow', 1 );
            },
            error: function( data ){
                $shareBoxWrap.removeClass( 'preview_loading' );
                $shareBox.fadeTo( 'slow', 1 );
            },
            contentType: "application/json",
            dataType: 'json'
        });
        
        return ( surl == '' ) ? url : surl;
    }
    
    var moreSitesChange = function(){
        var val = $( '.more_sites' ).val();
        var msg = '';
        if( val == 0 ){
            msg = 'No grouping';
        }else{
            msg = 'Group last ' + val + ' sites';
        }
        $( '.more_sites_text' ).html( msg );
    }
    
    $( document ).on( 'change', '[data-setting], .more-count', function(){
        refreshPreview();
    });
    
    $( document ).on( 'click', '.scr_add_site', function(){
        var site = $('.scr_sites').val();
        addSite( $sites_sel_list, site );
        refreshPreview();
    });
    
    $( document ).on( 'click', '.site_delete', function(){
        $(this).parent().remove();
        refreshPreview();
    });
    
    $( document ).on( 'click', '.site_settings', function(){
        $(this).siblings( '.site_settings_wrap' ).toggle();
    });
    
    $( document ).on( 'change', '.site_meta', function(){
        var $li = $(this).closest( 'li' );
        $li.attr( 'data-meta', $(this).val() );
    });
    
    $( document ).on( 'change', '.site_meta, .code_type, .page_info_auto, .page_url, .page_title, .scr_btn_sel', function(){
        refreshPreview();
    });
    
    $( document ).on( 'change', '.more_sites', function(){
        moreSitesChange();
        refreshPreview();
    });
    
    $( document ).on( 'click', '.togglePreview', function(){
        
        $( '.preview_sharebox' ).show();
        $( '.app_wrap' ).addClass( 'share_on' );
        
        var lastUpdate = $(this).data( 'last-preview' );
        
        if( typeof lastUpdate == 'undefined' ){
            lastUpdate = previewCount-1;
            $(this).data( 'last-preview', lastUpdate );
        }
        
        if( lastUpdate != previewCount ){
            var shortUrl = getShortUrl( getShareUrl() );
            $( '.shortner_url' ).val( shortUrl );
            $(this).data( 'last-preview', ++lastUpdate );
            socializer( '.socializer_share', {
                meta: {
                    title: 'Generate attractive social button icons for your website, check out my design ! @vaakash',
                    link: shortUrl
                }
            });
        }
        
    });
    
    $( document ).on( 'click', '.previewClose', function(){
        $( '.preview_sharebox' ).hide();
        $( '.app_wrap' ).removeClass( 'share_on' );
    });
    
    var allPanels = $('.acc_section > .acc_inner').hide();

    $('.acc_section h4').click(function() {
        allPanels.slideUp();
        $(this).next().slideDown();
        return false;
    });
    
});


/*! Sortable 1.4.2 - MIT | git://github.com/rubaxa/Sortable.git */
!function(a){"use strict";"function"==typeof define&&define.amd?define(a):"undefined"!=typeof module&&"undefined"!=typeof module.exports?module.exports=a():"undefined"!=typeof Package?Sortable=a():window.Sortable=a()}(function(){"use strict";function a(a,b){if(!a||!a.nodeType||1!==a.nodeType)throw"Sortable: `el` must be HTMLElement, and not "+{}.toString.call(a);this.el=a,this.options=b=r({},b),a[L]=this;var c={group:Math.random(),sort:!0,disabled:!1,store:null,handle:null,scroll:!0,scrollSensitivity:30,scrollSpeed:10,draggable:/[uo]l/i.test(a.nodeName)?"li":">*",ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",ignore:"a, img",filter:null,animation:0,setData:function(a,b){a.setData("Text",b.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1};for(var d in c)!(d in b)&&(b[d]=c[d]);V(b);for(var f in this)"_"===f.charAt(0)&&(this[f]=this[f].bind(this));this.nativeDraggable=b.forceFallback?!1:P,e(a,"mousedown",this._onTapStart),e(a,"touchstart",this._onTapStart),this.nativeDraggable&&(e(a,"dragover",this),e(a,"dragenter",this)),T.push(this._onDragOver),b.store&&this.sort(b.store.get(this))}function b(a){v&&v.state!==a&&(h(v,"display",a?"none":""),!a&&v.state&&w.insertBefore(v,s),v.state=a)}function c(a,b,c){if(a){c=c||N,b=b.split(".");var d=b.shift().toUpperCase(),e=new RegExp("\\s("+b.join("|")+")(?=\\s)","g");do if(">*"===d&&a.parentNode===c||(""===d||a.nodeName.toUpperCase()==d)&&(!b.length||((" "+a.className+" ").match(e)||[]).length==b.length))return a;while(a!==c&&(a=a.parentNode))}return null}function d(a){a.dataTransfer&&(a.dataTransfer.dropEffect="move"),a.preventDefault()}function e(a,b,c){a.addEventListener(b,c,!1)}function f(a,b,c){a.removeEventListener(b,c,!1)}function g(a,b,c){if(a)if(a.classList)a.classList[c?"add":"remove"](b);else{var d=(" "+a.className+" ").replace(K," ").replace(" "+b+" "," ");a.className=(d+(c?" "+b:"")).replace(K," ")}}function h(a,b,c){var d=a&&a.style;if(d){if(void 0===c)return N.defaultView&&N.defaultView.getComputedStyle?c=N.defaultView.getComputedStyle(a,""):a.currentStyle&&(c=a.currentStyle),void 0===b?c:c[b];b in d||(b="-webkit-"+b),d[b]=c+("string"==typeof c?"":"px")}}function i(a,b,c){if(a){var d=a.getElementsByTagName(b),e=0,f=d.length;if(c)for(;f>e;e++)c(d[e],e);return d}return[]}function j(a,b,c,d,e,f,g){var h=N.createEvent("Event"),i=(a||b[L]).options,j="on"+c.charAt(0).toUpperCase()+c.substr(1);h.initEvent(c,!0,!0),h.to=b,h.from=e||b,h.item=d||b,h.clone=v,h.oldIndex=f,h.newIndex=g,b.dispatchEvent(h),i[j]&&i[j].call(a,h)}function k(a,b,c,d,e,f){var g,h,i=a[L],j=i.options.onMove;return g=N.createEvent("Event"),g.initEvent("move",!0,!0),g.to=b,g.from=a,g.dragged=c,g.draggedRect=d,g.related=e||b,g.relatedRect=f||b.getBoundingClientRect(),a.dispatchEvent(g),j&&(h=j.call(i,g)),h}function l(a){a.draggable=!1}function m(){R=!1}function n(a,b){var c=a.lastElementChild,d=c.getBoundingClientRect();return(b.clientY-(d.top+d.height)>5||b.clientX-(d.right+d.width)>5)&&c}function o(a){for(var b=a.tagName+a.className+a.src+a.href+a.textContent,c=b.length,d=0;c--;)d+=b.charCodeAt(c);return d.toString(36)}function p(a){var b=0;if(!a||!a.parentNode)return-1;for(;a&&(a=a.previousElementSibling);)"TEMPLATE"!==a.nodeName.toUpperCase()&&b++;return b}function q(a,b){var c,d;return function(){void 0===c&&(c=arguments,d=this,setTimeout(function(){1===c.length?a.call(d,c[0]):a.apply(d,c),c=void 0},b))}}function r(a,b){if(a&&b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}var s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J={},K=/\s+/g,L="Sortable"+(new Date).getTime(),M=window,N=M.document,O=M.parseInt,P=!!("draggable"in N.createElement("div")),Q=function(a){return a=N.createElement("x"),a.style.cssText="pointer-events:auto","auto"===a.style.pointerEvents}(),R=!1,S=Math.abs,T=([].slice,[]),U=q(function(a,b,c){if(c&&b.scroll){var d,e,f,g,h=b.scrollSensitivity,i=b.scrollSpeed,j=a.clientX,k=a.clientY,l=window.innerWidth,m=window.innerHeight;if(z!==c&&(y=b.scroll,z=c,y===!0)){y=c;do if(y.offsetWidth<y.scrollWidth||y.offsetHeight<y.scrollHeight)break;while(y=y.parentNode)}y&&(d=y,e=y.getBoundingClientRect(),f=(S(e.right-j)<=h)-(S(e.left-j)<=h),g=(S(e.bottom-k)<=h)-(S(e.top-k)<=h)),f||g||(f=(h>=l-j)-(h>=j),g=(h>=m-k)-(h>=k),(f||g)&&(d=M)),(J.vx!==f||J.vy!==g||J.el!==d)&&(J.el=d,J.vx=f,J.vy=g,clearInterval(J.pid),d&&(J.pid=setInterval(function(){d===M?M.scrollTo(M.pageXOffset+f*i,M.pageYOffset+g*i):(g&&(d.scrollTop+=g*i),f&&(d.scrollLeft+=f*i))},24)))}},30),V=function(a){var b=a.group;b&&"object"==typeof b||(b=a.group={name:b}),["pull","put"].forEach(function(a){a in b||(b[a]=!0)}),a.groups=" "+b.name+(b.put.join?" "+b.put.join(" "):"")+" "};return a.prototype={constructor:a,_onTapStart:function(a){var b=this,d=this.el,e=this.options,f=a.type,g=a.touches&&a.touches[0],h=(g||a).target,i=h,k=e.filter;if(!("mousedown"===f&&0!==a.button||e.disabled)&&(h=c(h,e.draggable,d))){if(D=p(h),"function"==typeof k){if(k.call(this,a,h,this))return j(b,i,"filter",h,d,D),void a.preventDefault()}else if(k&&(k=k.split(",").some(function(a){return a=c(i,a.trim(),d),a?(j(b,a,"filter",h,d,D),!0):void 0})))return void a.preventDefault();(!e.handle||c(i,e.handle,d))&&this._prepareDragStart(a,g,h)}},_prepareDragStart:function(a,b,c){var d,f=this,h=f.el,j=f.options,k=h.ownerDocument;c&&!s&&c.parentNode===h&&(G=a,w=h,s=c,t=s.parentNode,x=s.nextSibling,F=j.group,d=function(){f._disableDelayedDrag(),s.draggable=!0,g(s,f.options.chosenClass,!0),f._triggerDragStart(b)},j.ignore.split(",").forEach(function(a){i(s,a.trim(),l)}),e(k,"mouseup",f._onDrop),e(k,"touchend",f._onDrop),e(k,"touchcancel",f._onDrop),j.delay?(e(k,"mouseup",f._disableDelayedDrag),e(k,"touchend",f._disableDelayedDrag),e(k,"touchcancel",f._disableDelayedDrag),e(k,"mousemove",f._disableDelayedDrag),e(k,"touchmove",f._disableDelayedDrag),f._dragStartTimer=setTimeout(d,j.delay)):d())},_disableDelayedDrag:function(){var a=this.el.ownerDocument;clearTimeout(this._dragStartTimer),f(a,"mouseup",this._disableDelayedDrag),f(a,"touchend",this._disableDelayedDrag),f(a,"touchcancel",this._disableDelayedDrag),f(a,"mousemove",this._disableDelayedDrag),f(a,"touchmove",this._disableDelayedDrag)},_triggerDragStart:function(a){a?(G={target:s,clientX:a.clientX,clientY:a.clientY},this._onDragStart(G,"touch")):this.nativeDraggable?(e(s,"dragend",this),e(w,"dragstart",this._onDragStart)):this._onDragStart(G,!0);try{N.selection?N.selection.empty():window.getSelection().removeAllRanges()}catch(b){}},_dragStarted:function(){w&&s&&(g(s,this.options.ghostClass,!0),a.active=this,j(this,w,"start",s,w,D))},_emulateDragOver:function(){if(H){if(this._lastX===H.clientX&&this._lastY===H.clientY)return;this._lastX=H.clientX,this._lastY=H.clientY,Q||h(u,"display","none");var a=N.elementFromPoint(H.clientX,H.clientY),b=a,c=" "+this.options.group.name,d=T.length;if(b)do{if(b[L]&&b[L].options.groups.indexOf(c)>-1){for(;d--;)T[d]({clientX:H.clientX,clientY:H.clientY,target:a,rootEl:b});break}a=b}while(b=b.parentNode);Q||h(u,"display","")}},_onTouchMove:function(b){if(G){a.active||this._dragStarted(),this._appendGhost();var c=b.touches?b.touches[0]:b,d=c.clientX-G.clientX,e=c.clientY-G.clientY,f=b.touches?"translate3d("+d+"px,"+e+"px,0)":"translate("+d+"px,"+e+"px)";I=!0,H=c,h(u,"webkitTransform",f),h(u,"mozTransform",f),h(u,"msTransform",f),h(u,"transform",f),b.preventDefault()}},_appendGhost:function(){if(!u){var a,b=s.getBoundingClientRect(),c=h(s),d=this.options;u=s.cloneNode(!0),g(u,d.ghostClass,!1),g(u,d.fallbackClass,!0),h(u,"top",b.top-O(c.marginTop,10)),h(u,"left",b.left-O(c.marginLeft,10)),h(u,"width",b.width),h(u,"height",b.height),h(u,"opacity","0.8"),h(u,"position","fixed"),h(u,"zIndex","100000"),h(u,"pointerEvents","none"),d.fallbackOnBody&&N.body.appendChild(u)||w.appendChild(u),a=u.getBoundingClientRect(),h(u,"width",2*b.width-a.width),h(u,"height",2*b.height-a.height)}},_onDragStart:function(a,b){var c=a.dataTransfer,d=this.options;this._offUpEvents(),"clone"==F.pull&&(v=s.cloneNode(!0),h(v,"display","none"),w.insertBefore(v,s)),b?("touch"===b?(e(N,"touchmove",this._onTouchMove),e(N,"touchend",this._onDrop),e(N,"touchcancel",this._onDrop)):(e(N,"mousemove",this._onTouchMove),e(N,"mouseup",this._onDrop)),this._loopId=setInterval(this._emulateDragOver,50)):(c&&(c.effectAllowed="move",d.setData&&d.setData.call(this,c,s)),e(N,"drop",this),setTimeout(this._dragStarted,0))},_onDragOver:function(a){var d,e,f,g=this.el,i=this.options,j=i.group,l=j.put,o=F===j,p=i.sort;if(void 0!==a.preventDefault&&(a.preventDefault(),!i.dragoverBubble&&a.stopPropagation()),I=!0,F&&!i.disabled&&(o?p||(f=!w.contains(s)):F.pull&&l&&(F.name===j.name||l.indexOf&&~l.indexOf(F.name)))&&(void 0===a.rootEl||a.rootEl===this.el)){if(U(a,i,this.el),R)return;if(d=c(a.target,i.draggable,g),e=s.getBoundingClientRect(),f)return b(!0),void(v||x?w.insertBefore(s,v||x):p||w.appendChild(s));if(0===g.children.length||g.children[0]===u||g===a.target&&(d=n(g,a))){if(d){if(d.animated)return;r=d.getBoundingClientRect()}b(o),k(w,g,s,e,d,r)!==!1&&(s.contains(g)||(g.appendChild(s),t=g),this._animate(e,s),d&&this._animate(r,d))}else if(d&&!d.animated&&d!==s&&void 0!==d.parentNode[L]){A!==d&&(A=d,B=h(d),C=h(d.parentNode));var q,r=d.getBoundingClientRect(),y=r.right-r.left,z=r.bottom-r.top,D=/left|right|inline/.test(B.cssFloat+B.display)||"flex"==C.display&&0===C["flex-direction"].indexOf("row"),E=d.offsetWidth>s.offsetWidth,G=d.offsetHeight>s.offsetHeight,H=(D?(a.clientX-r.left)/y:(a.clientY-r.top)/z)>.5,J=d.nextElementSibling,K=k(w,g,s,e,d,r);if(K!==!1){if(R=!0,setTimeout(m,30),b(o),1===K||-1===K)q=1===K;else if(D){var M=s.offsetTop,N=d.offsetTop;q=M===N?d.previousElementSibling===s&&!E||H&&E:N>M}else q=J!==s&&!G||H&&G;s.contains(g)||(q&&!J?g.appendChild(s):d.parentNode.insertBefore(s,q?J:d)),t=s.parentNode,this._animate(e,s),this._animate(r,d)}}}},_animate:function(a,b){var c=this.options.animation;if(c){var d=b.getBoundingClientRect();h(b,"transition","none"),h(b,"transform","translate3d("+(a.left-d.left)+"px,"+(a.top-d.top)+"px,0)"),b.offsetWidth,h(b,"transition","all "+c+"ms"),h(b,"transform","translate3d(0,0,0)"),clearTimeout(b.animated),b.animated=setTimeout(function(){h(b,"transition",""),h(b,"transform",""),b.animated=!1},c)}},_offUpEvents:function(){var a=this.el.ownerDocument;f(N,"touchmove",this._onTouchMove),f(a,"mouseup",this._onDrop),f(a,"touchend",this._onDrop),f(a,"touchcancel",this._onDrop)},_onDrop:function(b){var c=this.el,d=this.options;clearInterval(this._loopId),clearInterval(J.pid),clearTimeout(this._dragStartTimer),f(N,"mousemove",this._onTouchMove),this.nativeDraggable&&(f(N,"drop",this),f(c,"dragstart",this._onDragStart)),this._offUpEvents(),b&&(I&&(b.preventDefault(),!d.dropBubble&&b.stopPropagation()),u&&u.parentNode.removeChild(u),s&&(this.nativeDraggable&&f(s,"dragend",this),l(s),g(s,this.options.ghostClass,!1),g(s,this.options.chosenClass,!1),w!==t?(E=p(s),E>=0&&(j(null,t,"sort",s,w,D,E),j(this,w,"sort",s,w,D,E),j(null,t,"add",s,w,D,E),j(this,w,"remove",s,w,D,E))):(v&&v.parentNode.removeChild(v),s.nextSibling!==x&&(E=p(s),E>=0&&(j(this,w,"update",s,w,D,E),j(this,w,"sort",s,w,D,E)))),a.active&&((null===E||-1===E)&&(E=D),j(this,w,"end",s,w,D,E),this.save())),w=s=t=u=x=v=y=z=G=H=I=E=A=B=F=a.active=null)},handleEvent:function(a){var b=a.type;"dragover"===b||"dragenter"===b?s&&(this._onDragOver(a),d(a)):("drop"===b||"dragend"===b)&&this._onDrop(a)},toArray:function(){for(var a,b=[],d=this.el.children,e=0,f=d.length,g=this.options;f>e;e++)a=d[e],c(a,g.draggable,this.el)&&b.push(a.getAttribute(g.dataIdAttr)||o(a));return b},sort:function(a){var b={},d=this.el;this.toArray().forEach(function(a,e){var f=d.children[e];c(f,this.options.draggable,d)&&(b[a]=f)},this),a.forEach(function(a){b[a]&&(d.removeChild(b[a]),d.appendChild(b[a]))})},save:function(){var a=this.options.store;a&&a.set(this)},closest:function(a,b){return c(a,b||this.options.draggable,this.el)},option:function(a,b){var c=this.options;return void 0===b?c[a]:(c[a]=b,void("group"===a&&V(c)))},destroy:function(){var a=this.el;a[L]=null,f(a,"mousedown",this._onTapStart),f(a,"touchstart",this._onTapStart),this.nativeDraggable&&(f(a,"dragover",this),f(a,"dragenter",this)),Array.prototype.forEach.call(a.querySelectorAll("[draggable]"),function(a){a.removeAttribute("draggable")}),T.splice(T.indexOf(this._onDragOver),1),this._onDrop(),this.el=a=null}},a.utils={on:e,off:f,css:h,find:i,is:function(a,b){return!!c(a,b,a)},extend:r,throttle:q,closest:c,toggleClass:g,index:p},a.create=function(b,c){return new a(b,c)},a.version="1.4.2",a});