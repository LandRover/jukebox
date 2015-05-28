define([
	'jquery',
	'backbone',
	'text!templates/artist/artist_intro.html'
], function($, Backbone, artistIntroTemplate) {
	var ArtistIntroView = Backbone.View.extend({
		tagName: 'div',
        id: 'artist-intro',
		
		model: null,
        
		initialize: function(options) {
			console.log("controllers/AlbumIntroView::initialize()");
			_.extend(this, options);
		},
		
		render: function () {
			console.log("controllers/AlbumIntroView::render()");
			
			this.$el.html(_.template(artistIntroTemplate, {
				artist: this.model
			}));
			
			return this;
		}
	});
	
	return ArtistIntroView;
});