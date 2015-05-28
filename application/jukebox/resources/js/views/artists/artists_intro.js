define([
	'jquery',
	'backbone',
	'text!templates/artists/artists_intro.html'
], function($, Backbone, artistsIntroTemplate) {
	var ArtistsIntroView = Backbone.View.extend({
		tagName: 'div',
        id: 'artists-intro',
		
		model: null,
        
		initialize: function(options) {
			console.log("controllers/ArtistsIntroView::initialize()");
			_.extend(this, options);
		},
		
		render: function () {
			console.log("controllers/ArtistsIntroView::render()");
			
			this.$el.html(_.template(artistsIntroTemplate, {
				artists: this.model
			}));
			
			return this;
		}
	});
	
	return ArtistsIntroView;
});