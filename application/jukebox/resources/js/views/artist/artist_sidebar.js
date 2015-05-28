define([
	'jquery',
	'backbone',
    'text!templates/artist/artist_sidebar.html'
], function($, Backbone, ArtistSidebarTemplate) {
	var ArtistSidebarView = Backbone.View.extend({
        tagName: 'div',
        id: 'album-sidebar',
        model: null,
		
		initialize: function(options) {
			_.extend(this, options);
			console.log("controllers/ArtistSidebarView::initialize()");
		},
		
		
		render: function () {
			var tpl = _.template(ArtistSidebarTemplate, {'artist': this.model.artist});
			$(tpl).appendTo(this.$el);
			
			return this;
		}
	});
	
	return ArtistSidebarView;
});