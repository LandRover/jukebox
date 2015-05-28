define([
  'jquery',
  'backbone',
  'collections/songs',
  'models/playlist',
  'text!templates/playlists/playlists_list_items.box.html'
], function($, Backbone, SongsCollection, PlaylistsModel, PlaylistsListItemTemplate){
	
	var PlaylistsListItemController = Backbone.View.extend({
		tagName: 'li',
		namespace: null,
		
		model: null,
		
		events: {
			'click .play': 'onPlay',
			'click .remove': 'onRemoveClick',
            'click img': 'goToPlaylist',
            'click .details': 'goToPlaylist'
		},
        
        
		initialize: function(options) {
            console.log('PlaylistsListItemController init.');
			_.extend(this, options);
		},
        
		
        onPlay: function() {
        	var self = this;
        	
			this.playlist.setPlaylistID(this.playlist.id); //@todo: consider disabling.. 
        	
        	//consider adding cache if model already fetched before.
			$.when(this.playlist.fetch()).then(function () {
				var songs = [];
				self.playlist.set('songs_list', new SongsCollection(self.playlist.get('songs_list'))); //rebind collection back to original model with songsCollection
                
                _.each(self.playlist.get('songs_list').models, function(song) {
	                songs.push(song.toJSON());
	            });
	            
	            self.parent.player.addQueueList(songs);
				
			}, function() { console.log('err'); });
        },
        
        
        onRemoveClick: function() {
            this.parent.onRemoveClick(this.playlist);
        },
        
        
        goToPlaylist: function() {
            location.href = '/#/playlist/'+ this.playlist.get('id') +'/'+ this.playlist.get('name');
        },
        
		
		render: function () {
			this.$el.html(_.template(PlaylistsListItemTemplate, {
				playlist: this.playlist,
				el: this.$el
			}));

			return this;
		}
	});
	
  	return PlaylistsListItemController;
});