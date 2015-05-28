define([
	'jquery',
	'backbone',
	'text!templates/artists/artists_toolbar.html'
], function($, Backbone, artistsToolbarTemplate) {
	var ArtistsToolbarView = Backbone.View.extend({
		tagName: 'div',
        id: 'artists-toolbar',
		
		model: null,
		
		initialize: function(options) {
			console.log("controllers/ArtistsToolbarView::initialize()");
			_.extend(this, options);
		},
		
		render: function () {
			console.log("controllers/ArtistsToolbarView::render()");
			this.$el.html(artistsToolbarTemplate);
			
			return this;
		}
	});
	
	return ArtistsToolbarView;
});