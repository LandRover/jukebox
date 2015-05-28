define([
  'jquery',
  'backbone',
  'models/album',
  'text!templates/index/index_list_item_artist.html',
  'text!templates/index/index_list_item_album.html',
  'text!templates/index/index_list_item_song.html'
], function($, Backbone, AlbumModel, indexListItemArtistTemplate, indexListItemAlbumTemplate, indexListItemSongTemplate){
	var IndexListItemView = Backbone.View.extend({
		tagName: 'li',
		className: 'ui-isotope',
		
		model: null,

		events: {
            'click div.song div.actions button.btn-play': 'queueAddAndPlaySong',
            'click div.album div.actions button.btn-play': 'queueAddAndPlayAlbum'
		},

		initialize: function(options) {
			_.extend(this, options);
			console.log("controllers/IndexListItemView::initialize()");
		},
        
        
		render: function () {
			var isotopeSize = this.isotopeSize();
			
			this.$el.html(_.template(this._getTpl(), {
				model: this.model,
				type: this.itemType.slice(0, -1), // trim last char.. 
				category: this.itemCategory,
				isotopeSize: isotopeSize,
				thumbnailSize: this.getThumbnailSize()
			}));
			
			
			if (this.isRTL(this.model.get('name'))) {
				this.$el.addClass('rtl');
			}
			
			this.setMetadata();

			return this;
		},
		
		
		queueAddAndPlayAlbum: function(e) {
			var item = $(e.target).closest('li'),
				songs = [],
				self = this,
				AlbumModelModel = new AlbumModel();
				
			AlbumModelModel.artistName = this.model.get('artist');
			AlbumModelModel.albumName = this.model.get('name');
			
			$.when(AlbumModelModel.fetch()).then(function (response) {
				songs = response[0]['songs'] || response['songs'];
				self.parent.getPlayer().addQueueList(songs.toJSON());
			}, function() { console.log('err'); });
		},
		
		
		_getTpl: function() {
			switch (this.itemType) {
				case 'artists':
					return indexListItemArtistTemplate;
				
				case 'albums':
					return indexListItemAlbumTemplate;
					
				case 'songs':
					return indexListItemSongTemplate;
			}
		},
		
		
		isotopeSize: function() {
			var size = null;
			
			switch (this.itemType) {
				case 'artists':
					if (this.model.get('count_albums') > 10 || 0 < this.model.get('is_featured'))
						size = 'big';
					else
					if (this.model.get('count_albums') > 5) 
						size = 'medium';
						
					if (null !== size)
						this.$el.addClass(size);
					
					break;
				
				case 'albums':
					if (this.model.get('count_songs') > 50 || 0 < this.model.get('is_featured'))
						size = 'big';
					else
					if (this.model.get('count_songs') > 40) 
						size = 'medium';
						
					if (null !== size)
						this.$el.addClass(size);
					
					break;
					
				case 'songs':
					if (0 < this.model.get('is_featured'))
						size = 'big';
					
					break;
			}

			return size;
		},
		
        setMetadata: function() {
			this.$el.attr({
		        'data-date': this.model.get('date_created')
		    });
		    
        	switch (this.itemType) {
				case 'artists':
					return this.$el.attr({
						'data-artist': JSON.stringify({'id': this.model.get('id'), 'title': this.model.get('name')}),
				        'data-album': JSON.stringify({'id': 0, 'title': ''}),
				        'data-song': JSON.stringify({'id': 0, 'title': ''}),
				        'data-thumb': '/stream/thumbnail/'+ this.getThumbnailSize() +'/artist/'+ this.model.get('name') +'.jpg'
				    });
				case 'albums':
					return this.$el.attr({
				        'data-artist': JSON.stringify({'id': this.model.get('artist_id'), 'title': this.model.get('artist')}),
				        'data-album': JSON.stringify({'id': this.model.get('id'), 'title': this.model.get('name')}),
				        'data-song': JSON.stringify({'id': 0, 'title': ''}),
				        'data-thumb': '/stream/thumbnail/'+ this.getThumbnailSize() +'/album/'+ this.model.get('id') +'/'+ this.model.get('artist') +'/'+ this.model.get('name') +'.jpg'
				    });
				    
				case 'songs':
		            return this.$el.attr({
		                'data-artist': JSON.stringify({'id': this.model.get('artist_id'), 'title': this.model.get('artist')}),
		                'data-album': JSON.stringify({'id': this.model.get('album_id'), 'title': this.model.get('albumName')}),
		                'data-song': JSON.stringify({'id': this.model.get('id'), 'title': this.model.get('name')}),
		                'data-thumb': '/stream/thumbnail/'+ this.getThumbnailSize() +'/album/'+ this.model.get('album_id') +'/'+ this.model.get('artist') +'/'+ this.model.get('name') +'.jpg'
		            });
	       }
        },
        
        
        getThumbnailSize: function() {
        	return (this.isLargeThumbnail()) ? 'large' : 'small';
        },
        
        
        isLargeThumbnail: function() {
        	return this.$el.hasClass('big') || this.$el.hasClass('medium');
        },
        
        
		// @todo: move to string utils.
		isRTL: function(str) {
			return (str.charCodeAt(0) > 0x590) && (str.charCodeAt(0) < 0x5FF);
		}
	});
	
  	return IndexListItemView;
});