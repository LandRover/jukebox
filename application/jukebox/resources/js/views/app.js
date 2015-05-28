define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'events',
  'text!templates/layout/layout.html'
], function($, _, Backbone, Vm, Events, layoutTemplate){
	var AppView = Backbone.View.extend({
	    el: 'body',
	
	    initialize: function () {},
	
	    render: function () {
			console.log( "app::render()" );
			var self = this;
		
			this.$el.html(layoutTemplate);
			
			require(['views/layout/nav'], function (NavView) {
				var nav = Vm.create(self, 'NavView', NavView);
				nav.render();
			});
			
			require(['views/layout/search_quick'], function (SearchQuickView) {
				var searchQuick = Vm.create(self, 'SearchQuickView', SearchQuickView);
				searchQuick.render();
			});
			
			require(['views/layout/sidebar'], function (SiderbarView) {
				var sidebar = Vm.create(self, 'SiderbarView', SiderbarView);
				sidebar.render();
			});
			
			require(['views/layout/player'], function (PlayerView) {
				var player = Vm.create(self, 'PlayerView', PlayerView);
				player.render();
			});
		},
		
		
		scrollToTop: function() {
			$('div#page-wrapper div#page-scroll').animate({scrollTop: '0px'}, 250);
		}
	});
	
	return AppView;
});
