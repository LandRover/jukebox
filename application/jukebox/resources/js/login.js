// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-min',
    lodash: 'libs/lodash/lodash-min',
    md5: 'libs/md5/md5-min',
    backbone: 'libs/backbone/backbone-min',

    // Require.js plugins
    text: 'libs/require/text',

    // Just a short cut so we can put our html outside the js dir
    templates: '../html'
  },
  
  shim: {
    lodash: {
        exports: '_'
    },
    
    backbone: {
        deps: ['lodash', 'jquery'],
        exports: 'Backbone'
    }
  }
});

// Let's kick off the application

require([
	'views/login',
	'vm'
], function(AppView, Vm) {
	var appView = Vm.create({}, 'AppView', AppView);
	appView.render();
});