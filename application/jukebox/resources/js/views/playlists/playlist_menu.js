define([
	'jquery',
	'backbone',
    'collections/songs',
	'collections/playlists',
    'views/playlists/playlist_add_overwrite',
	'jjmenu'
], function($, Backbone, SongsCollection, PlaylistsCollection, PlaylistAddOverwrite) {
	var PlaylistMenu = Backbone.View.extend({
		el: 'body',
		id: 'jjmenu-container',

		player: null,
		collection: new PlaylistsCollection(),
		
		initialize: function(player) {
			console.log("controllers/PlaylistMenu::initialize()");
			this.player = player;
		},
		
		setPlayer: function(player) {
			this.player = player;
			
			return this;
		},
		
		render: function () {
			var self = this;
			console.log("controllers/PlaylistMenu::render()");
			
			$.when(this.collection.fetch()).then(function () {
				self.initJJMenu();
			}, function() { console.log('err'); });
		},
		
		initJJMenu: function() {
			var self = this;
			
			$('li.playlist-menu button').jjmenu('click', function() { return self.generateList(); }, {}, {
				'show': 'fadeIn',
				'xposition': 'left',
				'yposition': 'top',
				'orientation': 'top'
			});
			
			$('li.playlist-menu button').click(); //manual click after object init.
		},
		
		
		generateList: function() {
			var self = this;
			var addNewPlaylist = [{
	                title: 'New Playlist',
	                customClass: 'jj_menu_divider',
	                action: {
	                    type: 'fn',
	                    callback: function() { new PlaylistAddOverwrite({songsList: self.getSongsList(), add: true}); }
	                }
	            }];
            
            var options1 = [{
			        title: 'Load Playlist',
			        type: 'sub',
			        src: this._getPlaylistsList(function(model) { return self.loadPlaylist(model); })
			    },
			    {
			        title: 'Save Playlist',
			        type: 'sub',
			        src: [
			            {
			                title: 'Save As Playlist',
			                type: 'sub',
			                src: addNewPlaylist.concat(this._getPlaylistsList(function(model) { return new PlaylistAddOverwrite({songsList: self.getSongsList(), model: model, overwrite: true}); }))
			            },
			            {
			                title: 'Add to Playlist',
			                type: 'sub',
			                src: addNewPlaylist.concat(this._getPlaylistsList(function(model) { return new PlaylistAddOverwrite({songsList: self.getSongsList(), model: model, append: true}); }))
			            }
			        ]
			    }];
			    
			    return options1;
		},
        
        _getPlaylistsList: function(callback) {
            var playlistList = [];

            _.each(this.collection.models, function(model) {
                playlistList.push({
                    title: model.get('name'),
                    action: {
                        type: 'fn',
                        callback: function(model) { return function() { callback(model); }; }(model)
                    }
                });
            });
            
            return playlistList;
        },
        
        
        loadPlaylist: function(playlist) {
			var self = this;
            
            playlist.setPlaylistID(playlist.id); //@todo: consider disabling.. 
        	
        	//consider adding cache if model already fetched before.
			$.when(playlist.fetch()).then(function () {
				var songsCollection = new SongsCollection(),
					songs = [];
				
				_.each(playlist.get('songs_list'), function(songModel) {
					songsCollection.add(songModel);
				});
				
				playlist.set('songs_list', songsCollection); //rebind collection back to original model with songsCollection
                
                _.each(playlist.get('songs_list').models, function(song) {
	                songs.push(song.toJSON());
	            });
	            
	            self.player.addQueueList(songs);
				
			}, function() { console.log('err'); });
        },
        
        
        getSongsList: function() {
			return this.player.getQueueSongIDs();
        }
	});
	
	return new PlaylistMenu;
});