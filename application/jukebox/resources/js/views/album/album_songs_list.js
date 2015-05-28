define([
	'jquery',
	'backbone',
	'collections/songs',
	'views/album/album_songs_list_item',
	'text!templates/album/album_songs_list_heading.html'
], function($, Backbone, SongsCollection, AlbumSongsListItemView, albumSongsListHeadingTemplate) {
	var AlbumSongsListView = Backbone.View.extend({
		tagName: 'ol',
        className: 'songs-list drag-container',
		
		model: null,
        
		initialize: function(options) {
			console.log("controllers/AlbumSongsListView::initialize()");
			_.extend(this, options);
		},
        
        
		
		render: function () {
			console.log("controllers/AlbumSongsListView::render()");
			
			this.$el.append(albumSongsListHeadingTemplate);
			
			_.each(this.model.get('songs').models, function(model) {
				this.addItem(model);
			}, this);
			
			return this;
		},
		
		
        addItem: function(model) {
            var item = new AlbumSongsListItemView({
		        model: model,
		        parent: this
		    });
            
		    this.$el.append(item.render().$el);
        },
        
        
        getPlayer: function() {
        	return this.parent.Player;
        }
	});
	
	return AlbumSongsListView;
});