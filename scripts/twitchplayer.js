///////////////TWITCH PLAYER BY GORMAC.NET Michał 'macza' Matczuk (www.webx.pl) michal.matczuk@gmail.com//////////////////////////////


///justin api
var jtv_api=function(){var e={},p=!(!document.all||window.opera),h=function(a,b){for(var d in a)a.hasOwnProperty(d)&&b(d,a[d])},k=function(a,b){for(var d=a.length,c=0;c<d;c++)b(a[c],c)},q=function(a,b){if(a.indexOf)return-1!=a.indexOf(b);for(var d=a.length,c=0;c<d;c++)if(a[c]==b)return!0;return!1},l=function(a,b){var d={};h(a,function(a,g){q(b,a)&&(d[a]=g)});return d},r=function(a){var b=[];h(a,function(a,c){b.push(a+"="+c)});return b.join("&")},n=function(a){var b={};k(a.split("&"),function(a){var a=
    a.split("="),c=a[1];b[a[0]]=-1!=c.indexOf('"')?c.split('"')[1]:c});return b},m=function(a,b){var d={};h(a,function(b,a){d[b]=a});h(b,function(b,a){d[b]=a});return d},s=function(){for(var a=[],b=0;20>b;b++)a.push("abcdefghujklmnopqrstuvwxyz".charAt(26*Math.random()));a=a.join("");return document.getElementById(a)?s():a},j=function(a,b,d){a&&a[b]?a[b].apply(a,Array.prototype.slice.call(arguments).slice(2)):window.setTimeout(function(){j(a,b,d)},10)},t=function(a,b){"undefined"!=typeof a&&null!==a?b(a):
    window.setTimeout(function(){t.apply(this,arguments)},10)},u=function(a,b){a()?b():window.setTimeout(function(){u(a,b)},10)};e.javascript_callbacks=[];var v=function(a){return function(b,d){return a[b](b,d)}},o=function(a){if(p){var b=[],d=document.getElementsByTagName("*");k(d,function(c){c.getAttribute("name")==a&&b.push(c)});return b}return document.getElementsByName(a)},w=function(a,b,d,c,g){var d=r(d),a="string"==typeof a?document.getElementById(a):a,f=m({allowScriptAccess:"always",allowNetworking:"all",
    allowFullscreen:"true"},c),c=null;"id"in g?(c=g.id,delete g.id):c=s();f.flashvars="flashvars"in f?f.flashvars+("&"+d):d;if(p){var e="<object";g.codebase="http://macromedia.com/cabs/swflash.cab#version=6,0,0,0";g.classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";g.type="application/x-shockwave-flash";g.id=c;h(g,function(b,a){e+=" "+b+'="'+a+'"'});e+=" >";f.data=b;f.movie=b;h(f,function(b,a){e+='<param name="'+b+'" value="'+a+'">'});e+="</object>";b=document.createElement("div");a.appendChild(b);b.innerHTML+=
    e;return document.getElementById(c)}var i=document.createElement("embed");i.setAttribute("pluginspage","http://www.macromedia.com/go/getflashplayer");i.setAttribute("src",b);i.setAttribute("type","application/x-shockwave-flash");i.setAttribute("name",c);h(f,function(b,a){i.setAttribute(b,a)});h(g,function(b,a){i.setAttribute(b,a)});a.appendChild(i);return i};e.new_player=function(a,b){var d=null,d=b.custom?"http://www-cdn.jtvnw.net/widgets/live_api_player.swf?channel="+b.channel:"http://www-cdn.jtvnw.net/widgets/live_embed_player.swf?channel="+
    b.channel;b.clip&&(b.custom=!0);var c=m({start_volume:"26",watermark_position:"top_right",auto_play:"false"},l(b,"channel,start_volume,watermark_position,auto_play,namespace,consumer_key,publisher_guard".split(","))),g=m({height:"295",width:"353",bgcolor:"#000000"},l(b,"width,height,id,class,name,title,bgcolor,style".split(",")));b.custom&&(c.enable_javascript=!0,b.events&&(c.javascript_callback_path="jtv_api.javascript_callbacks["+e.javascript_callbacks.length+"]",e.javascript_callbacks.push(v(b.events))));
    var f=w(a,d,c,{},g);b.custom&&("buffer_time"in b&&j(f,"set_buffer_time",b.buffer_time),b.publisher_guard&&j(f,"set_channel_password",b.publisher_guard),b.clip?(t(f,function(){f.play_live=f.play_clip}),b.auto_play&&j(f,"play_clip",b.channel)):b.auto_play&&(b.namespace?j(f,"play_live",b.channel,b.namespace):j(f,"play_live",b.channel)));return f};e.new_broadcaster=function(a,b){var d={javascript_callback_path:"jtv_api.javascript_callbacks["+e.javascript_callbacks.length+"]"};e.javascript_callbacks.push(v(b.events));
    return w(a,"http://www-cdn.jtvnw.net/widgets/live_embed_publisher.swf",l(b,["stream_key","consumer_key","namespace"]),d,m({},l(b,"height,width,bgcolor,id,name,title,style".split(","))))};e.new_chat=function(a,b){var d=["channel","hide_chat","default_chat","tweet_suffix","over18"],c=r(l(b,d)),e=document.createElement("iframe");e.setAttribute("src","http://www.justin.tv/chat/embed?"+c);c={width:"320",height:"450"};h(b,function(a){q(d,a)&&delete b[a]});c=m(c,b);h(c,function(a,b){e.setAttribute(a,b)});
    ("string"==typeof a?document.getElementById(a):a).appendChild(e);return e};(function(a){window.addEventListener?window.addEventListener("DOMContentLoaded",a,!1):document.attchEvent?document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&(a(),document.detachEvent("onreadystatechange",arguments.callee))}):u(function(){try{return document.documentElement.doScroll("left"),document.documentElement.doScroll&&window==window.top}catch(a){return!1}},a)})(function(){k(o("jtv_api.new_player"),
    function(a){var b=n(a.getAttribute("title"));e.new_player(a,b)});k(o("jtv_api.new_chat"),function(a){var b=n(a.getAttribute("title"));e.new_chat(a,b)});k(o("jtv_api.new_broadcaster"),function(a){var b=n(a.getAttribute("title"));e.new_broadcaster(a,b)})});return e}();


///
/*
 jquery.fullscreen 1.1.0
 https://github.com/kayahr/jquery-fullscreen-plugin
 Copyright (C) 2012 Klaus Reimer <k@ailis.de>
 Licensed under the MIT license
 (See http://www.opensource.org/licenses/mit-license)
 */
function d(b){var c,a;if(!this.length)return this;c=this[0];c instanceof Document?(a=c,c=a.documentElement):a=c.ownerDocument;if(null==b){if(!a.cancelFullScreen&&!a.webkitCancelFullScreen&&!a.mozCancelFullScreen)return null;b=!!a.fullScreen||!!a.webkitIsFullScreen||!!a.mozFullScreen;return!b?b:a.fullScreenElement||a.webkitCurrentFullScreenElement||a.mozFullScreenElement||b}b?(b=c.requestFullScreen||c.webkitRequestFullScreen||c.mozRequestFullScreen)&&b.call(c):(b=a.cancelFullScreen||a.webkitCancelFullScreen||
    a.mozCancelFullScreen)&&b.call(a);return this}jQuery.fn.fullScreen=d;jQuery.fn.toggleFullScreen=function(){return d.call(this,!d.call(this))};var e,f,g;e=document;e.webkitCancelFullScreen?(f="webkitfullscreenchange",g="webkitfullscreenerror"):e.mozCancelFullScreen?(f="mozfullscreenchange",g="mozfullscreenerror"):(f="fullscreenchange",g="fullscreenerror");document.addEventListener(f,function(){jQuery(document).trigger(new jQuery.Event("fullscreenchange"))},!0);
document.addEventListener(g,function(){jQuery(document).trigger(new jQuery.Event("fullscreenerror"))},!0);


////////////tp
(function($) {
    $.fn.TwitchPlayer = function(options) {
        console.info("TwitchPlayer");
        var radio = [];
        liczydlo = 0;
        function onClick(event) {
            $this = $(this);

            data = $this.data("TwitchPlayer");
            data.first = !data.first;
            $this.css("background-color",
                data.first ? data.colorSecond : data.colorFirst);
            return true;
        }

        return this.each(function() {
            liczydlo++;

            if (typeof options === 'object' || ! options ){
                var settings = $.extend( {
                    channel: null,
                    width: null,
                    height: null,
                    apikey: null,
                    background: null,
                    autostart: null,
                    volume: null,
                    images: null,
                    playbtn: null
                }, options);

                $this = $(this);
                data = $this.data("TwitchPlayer");
                if(!data)
                {
                    data = $this.data("TwitchPlayer", settings);
                }
                if(settings.channel == null) $.error('TwitchPlayer: set channel name. Error id: 0001'); else
                if(settings.apikey == null) $.error('TwitchPlayer: set apikey. Error id: 0002'); else{
                    if(settings.width == null) settings.width = 600;
                    if(settings.height == null) settings.height = (settings.width/16)*9;
                    if(settings.background == null) settings.background = "#000000";
                    if(settings.autostart == null) settings.autostart = true;
                    if(settings.quality == null) settings.quality = "live";
                    if(settings.volume == null) settings.volume = 50;
                    if(settings.images == null) settings.images = "twitchplayer/images/";
                    if(settings.playbtn == null) settings.playbtn = "twitchplayer/images/play.png";
                    if(settings.offline == null) settings.offline = "twitchplayer/images/offline.fw.png";
                    $this.addClass("twitchplayer").css("background",settings.background);
                    $this.append('<div class="loader"></div>');
                    $loader = $this.children(".loader");
                    $loader.css("background-color",settings.background);

                    $this.css({"width":settings.width+"px","height":settings.height+"px"});
                    $this.append('<object type="application/x-shockwave-flash" height="100%" id="twitchPlayer" width="100%" data="http://www.justin.tv/widgets/live_api_player.swf" bgcolor="'+settings.background+'"><param name="menu" value="false" /><param name="align" value="r" /><param name="salign" value="tr" /><param name="allowFullScreen" value="true" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /><param name="movie" value="http://www.justin.tv/widgets/live_api_player.swf" /><param name="scale" value="noborder"><param name="flashvars" value="enable_javascript=true&javascript_callback_path=radio'+liczydlo+'&consumer_key='+settings.apikey+'" /></object><button id="t3">a</button>');
                    $("#t3").click(function(){
                        $player.resize_player(500, 500);

                    });
                    $player = $this.children("object")[0];
                    h = settings.height+50;//t1
                    w = settings.width;
                    $this.children("object").attr({"width":w+"px","height":h+"px"});
                    $this.css({"width":settings.width+"px","height":settings.height+"px"});
                    pmode = setInterval('if(typeof $player.play_live === "function"){ if('+settings.autostart+' == true){ $player.play_live("'+settings.channel+'", "'+settings.quality+'"); }else{ c = (w - $controls.width()) / 2; $controls.css("left",c); $this.children(".preload").remove(); $loader.css("background","url('+settings.playbtn+') center no-repeat"); } $player.change_volume('+settings.volume+'); $player.resize_player('+w+', '+h+'); clearInterval(pmode); }',1000);
                    $this.append('<div class="controls"></div>');
                    $controls = $this.children(".controls");
                    $controls.animate({opacity:0},0);
                    $controls.append('<div class="vslider"></div><div class="vsliderbg"><div class="bar"><img src="'+settings.images+'barcon.fw.png" width="8" height="11" /></div></div><img src="'+settings.images+'blank.fw.png" class="player pause pp" />');
                    $controls.append('<img src="'+settings.images+'blank.fw.png" class="player volume vol" /><img src="'+settings.images+'blank.fw.png" class="player slider" />');
                    $controls.children(".vslider").slider({
                        'min': 0,
                        'max': 100,
                        'step': 1,
                        'value': settings.volume,
                        change: function (event, ui) {
                            settings.volume = ui.value;
                            $player.change_volume(ui.value);
                            $controls.children(".vsliderbg").children(".bar").css("width", ui.value + "%");
                            if (ui.value == 0) {
                                $player.mute();
                                $controls.children(".vol").removeClass("volume").addClass("novolume");
                            } else {
                                $player.unmute();
                                $controls.children(".vol").removeClass("novolume").addClass("volume");
                            }
                        },
                        slide: function (event, ui) {
                            settings.volume = ui.value;
                            $player.change_volume(ui.value);
                            $controls.children(".vsliderbg").children(".bar").css("width", ui.value + "%");
                            if (ui.value == 0) {
                                $player.mute();
                                $controls.children(".vol").removeClass("volume").addClass("novolume");
                            } else {
                                $player.unmute();
                                $controls.children(".vol").removeClass("novolume").addClass("volume");
                            }
                        }
                    });

                    $controls.append('<img src="'+settings.images+'blank.fw.png" class="player hdon hd" />');
                    $controls.append('<img src="'+settings.images+'blank.fw.png" class="player full" />');
                    if (jQuery.browser.msie) {
                        $controls.children(".full").click(function(){
                            $this.toggleClass("fullscreen");
                            if($this.hasClass("fullscreen") == true){
                                h = $(window).height+50;//t1
                                w = $(window).width();
                                c = (w - $controls.width()) / 2;
                                $this.css({"left":"0px","top":"0px"});
                                $controls.css({"left":c,"bottom":"5%"});
                                $this.children("object").attr({"width":w+"px","height":h+"px"});
                                $this.css({"width":$(window).width()+"px","height":$(window).height()+"px"});
                                $player.resize_player(w, h);
                                $(document).bind('mousemove',function (e) {
                                    hf = $(window).height() * 0.3;
                                    if (e.pageY < hf){ $loader.css("cursor","none"); $controls.css("left","-3000px"); }
                                    else{ $loader.css("cursor","default"); $controls.css("left",c); }
                                });
                            }else{
                                $(document).unbind('mousemove');
                                h = settings.height+50;//t1
                                w = settings.width;
                                c = (w - $controls.width()) / 2;
                                $this.css({"left":"0px","top":"0px"});
                                $controls.css({"left":c,"bottom":"10%"});
                                $this.children("object").attr({"width":w+"px","height":h+"px"});
                                $this.css({"width":settings.width+"px","height":settings.height+"px"});
                                $player.resize_player(w, h);
                            }
                        });
                    }else $controls.children(".full").click(function(){
                        $this.toggleFullScreen();
                    });

                    $this.append('<div class="preload"></div>');
                    $.each(["play1","hdon1","hdoff1","hdon0","hdoff0","full1","novolume1","novolume0","volume1","pause1","pause0","play0"], function(mk,md){
                        $this.children(".preload").append('<img src="'+settings.images+''+md+'.fw.png" />');
                    });


                    $(window).resize(function(){

                        if($this.fullScreen()!=false && $this.fullScreen()!=null){
                            h = $(window).height+50;//t1
                            w = $(window).width();
                            c = (w - $controls.width()) / 2;
                            $controls.css({"left":c,"bottom":"5%"});
                            $this.children("object").attr({"width":w+"px","height":h+"px"});
                            $this.css({"width":$(window).width()+"px","height":$(window).height()+"px"});
                            $player.resize_player(w, h);
                            $(document).bind('mousemove',function (e) {
                                hf = $(window).height() * 0.3;
                                if (e.pageY < hf){ $loader.css("cursor","none"); $controls.css("left","-3000px"); }
                                else{ $loader.css("cursor","default"); $controls.css("left",c); }
                            });
                        }else{
                            $(document).unbind('mousemove');
                            h = settings.height+50;//t1
                            w = settings.width;
                            c = (w - $controls.width()) / 2;
                            $controls.css({"left":c,"bottom":"10%"});
                            $this.children("object").attr({"width":w+"px","height":h+"px"});
                            $this.css({"width":settings.width+"px","height":settings.height+"px"});
                            $player.resize_player(w, h);
                        }
                    });
                    $controls.children(".vol").click(function () {
                        if ($player.get_volume() > 0) voltemp = $player.get_volume();
                        if ($player.get_volume() == 0) {
                            $controls.children(".vol").removeClass("novolume").addClass("volume");
                            $player.unmute();
                            $controls.children(".vsliderbg").children(".bar").css("width", settings.volume + "%");
                            $controls.children(".vslider").slider({
                                "value": voltemp
                            });
                        } else {
                            $controls.children(".vol").removeClass("volume").addClass("novolume");
                            $player.mute();
                            settings.volume = 0;
                            $controls.children(".vsliderbg").children(".bar").css("width", "0%");
                            $controls.children(".vslider").slider({
                                "value": 0
                            });
                        }
                    });

                    $controls.children(".hd").click(function () {
                        if (settings.quality == "live") {
                            settings.quality = "360p";

                            $controls.children(".hd").removeClass("hdon").addClass("hdoff");
                            $player.play_live(settings.channel, settings.quality);
                        } else {
                            settings.quality = "live";
                            $controls.children(".hd").removeClass("hdoff").addClass("hdon");
                            $player.play_live(settings.channel, settings.quality);
                        }
                    });

                    setTimeout('radio'+liczydlo+' = function(e, info){ console.log(e,info); if(e=="started"){ $controls.children(".pp").removeClass("play").addClass("pause"); c = (w - $controls.width()) / 2; $controls.css("left",c); $this.children(".preload").remove(); $loader.fadeTo(1000,0); } if(e=="broadcast_finished" || e=="video_not_found"){ $controls.children(".pp").removeClass("pause").addClass("play");  $loader.css("background","url('+settings.offline+') center no-repeat"); c = (w - $controls.width()) / 2; $controls.css("left",c); $this.children(".preload").remove(); $loader.fadeTo(1000,1); } }',0);

                    $this.hover(function() {
                        $controls
                            .animate({opacity:0},0)
                            .stop()
                            .animate({opacity:1},500);
                    }, function() {
                        $controls
                            .animate({opacity:0},0)
                            .stop()
                            .animate({opacity:0},500);
                    });
                    if (settings.autostart == true) {
                        $controls.children(".pp").removeClass("play").addClass("pause");
                    } else {
                        $loader.bind('click',function(){
                            $player.play_live(settings.channel, settings.quality);
                            $loader.unbind('click').css("cursor","default");
                        }).css("cursor","pointer");
                        $controls.children(".pp").removeClass("pause").addClass("play");
                    }
                    $controls.children(".pp").click(function () {
                        if ($controls.children(".pp").hasClass("play") == true) {
                            $controls.children(".pp").removeClass("play").addClass("pause");
                            $player.play_live(settings.channel, settings.quality);
                        } else {
                            $controls.children(".pp").removeClass("pause").addClass("play");
                            $player.pause_video();
                        }
                    });
                    return;
                }
            }
            else{
                $.error('TwitchPlayer: no method: '+ options);
            }
        });
    }
})(jQuery);
