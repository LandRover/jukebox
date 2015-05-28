define([
	'jquery',
	'backbone',
	'text!templates/artist/artist_toolbar.html'
], function($, Backbone, artistToolbarTemplate) {
	var ArtistToolbarView = Backbone.View.extend({
		tagName: 'div',
        id: 'artist-toolbar',
		
		model: null,
		
		initialize: function(options) {
			console.log("controllers/ArtistToolbarView::initialize()");
			_.extend(this, options);
		},
		
		render: function () {
			console.log("controllers/ArtistToolbarView::render()");
			this.$el.html(artistToolbarTemplate);
			
			return this;
		}
	});
	
	return ArtistToolbarView;
});