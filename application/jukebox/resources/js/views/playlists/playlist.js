define([
	'jquery',
	'backbone',
	'collections/songs',
    'models/playlist',
    'views/playlists/playlist_item',
    'views/playlists/playlist_toolbar',
	'text!templates/playlists/playlist.html',
    'text!templates/playlists/playlist_list_heading.html',
	'views/layout/player'
], function($, Backbone, SongsCollection, PlaylistsModel, PlaylistItem, PlaylistToolbar, playlistTemplate, playlistListHeading, PlayerView) {
	var PlaylistView = Backbone.View.extend({
		tagName: 'ol',
        className: 'draggable-container',
        player: new PlayerView(),
		
		model: null,
        
        itemsList: [],
        toolbar: null,
        
        notifyOnReady: null,
        
		initialize: function(params) {
			var self = this;
			
			this.playlistID = params.playlistID,
			this.playlistName = params.playlistName;
			
			this.model = new PlaylistsModel();
            this.model.set('id', this.playlistID);
			
			$.when(this.model.fetch()).then(function () {
				self.model.set('songs_list', new SongsCollection(self.model.get('songs_list'))); //rebind collection back to original model with songsCollection
                self.render();
				
                self._rebindPlayer();
				
                if (null !== self.notifyOnReady && 'function' === typeof(self.notifyOnReady)) {
                    self.notifyOnReady();
                }
			}, function() { console.log('err'); });
		},
        
        
        filter: function(search) {
            var list,
                visibleList = {};
            
            if (search) {
                list = this._filterMoveFromHereFunction(this.model.get('songs_list').models, search); // on nothing found returns empty array [].
            }
            
            list = ('undefined' === typeof(list)) ? this.model.get('songs_list').models : list; // uses full list only when filter is empty.
            
            // verifies list of detected as matched objects.
            _.each(list, function(item) {
                visibleList[item.id] = true;
            });
            
            this.model.resetFilterOnSongs(visibleList); //set all filter to TRUE.
        },
		
		
		render: function () {
			console.log("controllers/PlaylistView::render()");
			$('#main').html(_.template(playlistTemplate, {
				'playlistID': this.playlistID,
				'playlistName': this.playlistName
			}));
            
            this.renderToolbar();
            this.renderList();
            
            this.initDroppable();
            
            return this;
		},
        
        
        //@todo: find better way to drag and drop.. also known bug about not being able to drag and drop to the player menu.
        initDroppable: function() {
			$('#playlist-content ol')
                .disableSelection()
                .sortable({
                    distance: '30',
                    tolerance: 'pointer',
                    cursorAt: {
                        left: 0,
                        top: 0
                    },
                    containment: 'parent',
                    handle: '.widget-item',
                    placeholder: 'drop-indicator cancel',
                    appendTo: document.body,
                    containment: 'window',
                    cancel: '.cancel',

                    helper: this.player.getViewDragHelper() // Custom UI object of the draggable tooltip
                });
        },
        
        renderList: function() {
            $(this.$el).appendTo('#playlist-page-data');
            
            this.$el.append(playlistListHeading);
            
            _.each(this.model.get('songs_list').models, function(model) {
				this.addItem(model);
			}, this);
        },
        
        
        renderToolbar: function() {
		    this.toolbar = new PlaylistToolbar({
		        playlist: this.model,
		        parent: this
		    });
            
            $(this.toolbar.render().$el).appendTo('#playlist-page-data');
        },
        
        
        addItem: function(song) {
            var item = new PlaylistItem({
		        song: song,
		        parent: this
		    });
            
            this.itemsList.push(item);
		    this.$el.append(item.render().$el);
        },                        
        
        
	    _rebindPlayer: function()
		{
			this.player.rebind();
	    },
        
        
        playAll: function(list) {
            var songs = [];
            
            _.each(list, function(song) {
                songs.push(song.toJSON());
            });
            
            this.player.addQueueList(songs);
        },
        
        
        childModelChanged: function() {
            this.toolbar.change();
        },
        
        
        childModelRemoved: function(modelsList) {
            var self = this;
            
            _.each(modelsList, function(model) {
                self.model.get('songs_list').remove(model);
            });
            
            this.childModelChanged();
            this.model.save();
        },
        
        
        _filterMoveFromHereFunction: function(collection, filterValue) {
            if ('' === filterValue) return [];
            filterValue = filterValue.toLowerCase();
            
            return collection.filter(function(data) {
                return _.some(_.values(data.toJSON()), function(value) {
                    value = (!isNaN(value) ? value.toString() : value.toLowerCase());
                    return 0 <= value.indexOf(filterValue);
                });
            });
		},
        

        notifyOnReady: function(callback) {
            this.notifyOnReady = callback;
        }
	});
	
	return PlaylistView;
});