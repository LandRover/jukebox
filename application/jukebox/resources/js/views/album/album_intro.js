define([
	'jquery',
	'backbone',
	'text!templates/album/album_intro.html'
], function($, Backbone, albumIntroTemplate) {
	var AlbumIntroView = Backbone.View.extend({
		tagName: 'div',
        id: 'album-intro',
		
		model: null,
        
		initialize: function(options) {
			console.log("controllers/AlbumIntroView::initialize()");
			_.extend(this, options);
		},
		
		render: function () {
			console.log("controllers/AlbumIntroView::render()");
			
			this.$el.html(_.template(albumIntroTemplate, {
				album: this.model
			}));
			
			return this;
		}
	});
	
	return AlbumIntroView;
});