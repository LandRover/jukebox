// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-min',
    jqueryUI: 'libs/jquery/jquery.ui-min',
    groovyPlayer: 'libs/jquery/jquery.groovy_player',
    jQueryMouseWheel: 'libs/jquery/jquery.mousewheel',
    playlistQueue: 'libs/jquery/jquery.playlist_queue',
    mCustomScrollbar: 'libs/jquery/jquery.m_custom_scrollbar-min',
    isotope: 'libs/jquery/jquery.isotope-min',
    jjmenu: 'libs/jquery/jquery.jjmenu',
    
    //flexslider: 'libs/jquery/jquery.flexslider',
    infiniteScroll: 'libs/jquery/jquery.infinitescroll-min',
    
    lodash: 'libs/lodash/lodash-min', // alternative to underscore
    bootstrap: 'libs/bootstrap/bootstrap-min',
    backbone: 'libs/backbone/backbone-min',
    
    modal: 'libs/backbone/plugins/modal',

    // Require.js plugins
    text: 'libs/require/text',

    // Just a short cut so we can put our html outside the js dir
    templates: '../html'
  },
  
  shim: {
    jqueryUI: {
        deps: ['jquery']
    },
    
    lodash: {
        exports: '_'
    },
    
    backbone: {
        deps: ['lodash', 'jquery'],
        exports: 'Backbone'
    }
  },
  
  urlArgs: 'bust=' + (new Date()).getTime() //dev cache purging.
});

// Let's kick off the application
require([
	'views/app',
	'router',
	'vm'
], function(AppView, Router, Vm){
	var appView = Vm.create({}, 'AppView', AppView);
	appView.render();
	Router.initialize({appView: appView});  // The router now has a copy of all main appview
});