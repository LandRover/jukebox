define([
	'jquery',
	'backbone',
	'text!templates/album/album_songs_toolbar.html'
], function($, Backbone, albumSongsListToolbarTemplate) {
	var AlbumSongsToolbarView = Backbone.View.extend({
		tagName: 'div',
        id: 'songs-list-toolbar',
		
		model: null,
		
		events: {
			'click button#btn_queue-all': 'queueAll'
		},
        
		initialize: function(options) {
			console.log("controllers/AlbumSongsToolbarView::initialize()");
			_.extend(this, options);
		},
		
		render: function () {
			console.log("controllers/AlbumSongsToolbarView::render()");
			this.$el.html(albumSongsListToolbarTemplate);
			
			return this;
		},
		
		
		queueAll: function() {
			this.parent.Player.addQueue($('.songs-list').find('.item-wrapper'));
		}
	});
	
	return AlbumSongsToolbarView;
});