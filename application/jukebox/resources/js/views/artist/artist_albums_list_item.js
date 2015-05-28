define([
  'jquery',
  'backbone',
  'models/album',
  'text!templates/artist/artist_albums_list_item.html'
], function($, Backbone, AlbumModel, artistAlbumsListItemTemplate){
	var ArtistAlbumsListItemView = Backbone.View.extend({
		tagName: 'li',
        className: 'item-wrapper ui-draggable',
		
		model: null,
		
		events: {
			'click button.btn-play': 'queueAlbumAndPlay'
		},
		
		
		initialize: function(options) {
			_.extend(this, options);
			console.log("controllers/ArtistAlbumsListItemView::initialize()");
			
			this.setMetadata();
		},
        
        
		render: function () {
			this.$el.html(_.template(artistAlbumsListItemTemplate, {
				album: this.model
			}));
			
			if (this.isRTL(this.model.get('name'))) {
				this.$el.addClass('rtl');
			}

			return this;
		},
        
        
        setMetadata: function() {
            this.$el.attr({
            	'data-date': this.model.get('date_created'),
                'data-artist': JSON.stringify({'id': this.model.get('artist_id'), 'title': this.model.get('artist_title')}),
                'data-album': JSON.stringify({'id': this.model.get('id'), 'title': this.model.get('name')}),
                'data-song': JSON.stringify({'id': 0, 'title': ''}),
                'data-thumb': '/stream/thumbnail/small/album/'+ this.model.get('album_id') +'/'+ this.model.get('artist') +'/'+ this.model.get('name') +'.jpg'
            });
        },
        
        
		queueAlbumAndPlay: function(e) {
			var item = $(e.target).closest('li'),
				songs = [],
				self = this,
				AlbumModelModel = new AlbumModel();
				
			AlbumModelModel.artistName = this.model.get('artist_title');
			AlbumModelModel.albumName = this.model.get('name');
			
			$.when(AlbumModelModel.fetch()).then(function (response) {
				songs = response[0]['songs'] || response['songs'];
				self.parent.getPlayer().addQueueList(songs.toJSON());
			}, function() { console.log('err'); });
		},
		
		
		// @todo: move to string utils.
		isRTL: function(str) {
			return (str.charCodeAt(0) > 0x590) && (str.charCodeAt(0) < 0x5FF);
		}
	});
	
  	return ArtistAlbumsListItemView;
});