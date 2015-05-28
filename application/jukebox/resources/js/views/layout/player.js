define([
	'jquery',
	'backbone',
	'views/playlists/playlist_menu',
	'jqueryUI',
	'groovyPlayer',
	'jQueryMouseWheel',
	'mCustomScrollbar',
	'playlistQueue'
], function($, Backbone, PlaylistMenu){
  var PlayerController = Backbone.View.extend({
    initialize: function() {
    	console.log("controllers/PlayerController::initialize()");
    },
    
    
	ids: {
		pageWrapper: '#page-wrapper',
		draggable: '.drag-container',
		playerID: '#now-streaming',
		player: '#now-streaming'
	},
	
    
    render: function() {
        this._playerInit();
        return this;
    },
    
    
    rebind: function () {
		$(this.ids.draggable).playlistQueue('jQueryRebindDragListener');
		return this;
    },
    
    
    addQueue: function(list) {
    	$(this.ids.draggable).playlistQueue('addQueue', list);
    	return this;
    },
    
    
    getQueueSongIDs: function(list) {
    	return $(this.ids.draggable).playlistQueue('getQueueSongIDs');
    },
    
    
	getViewDragHelper: function(list) {
    	return $(this.ids.draggable).playlistQueue('getViewDragHelper');
    },
    
    
    addQueueList: function(list) {
    	var elementsList = [],
			el = '';
    	
    	$.each(list, function(key, item) {
    		el = $('<li/>', {
    			'class': 'item-wrapper ui-draggable',
				'data-artist': JSON.stringify({id: item.artist_id, title: item.artist}),
    			'data-album': JSON.stringify({id: item.album_id, title: item.name}),
    			'data-song': JSON.stringify({id: item.id, title: item.name}),
    			'data-thumb': '/stream/thumbnail/small/album/'+ item.album_id +'/'+ item.artist +'/'+ item.name +'.jpg'
    		});

			elementsList.push(el);
    	});
    	
    	this.addQueue(elementsList);
    },
    
    playLast: function() {
    	$(this.ids.draggable).playlistQueue('playLast');
    	return this;
    },
    
    
    _playerInit: function() {
		var self = this;
		$(this.ids.draggable).playlistQueue({
	    	onPlay: function(item) {
	    		var artist = item.data('artist'),
					album = item.data('album'),
					song = item.data('song');
	    		
	    		var artistLink = '<a href="#/artist/'+ artist.title +'">'+ artist.title +'</a>',
					albumThumbnailUrl = '/stream/thumbnail/small/album/'+ album.id +'/'+ artist.title +'/'+ album.title +'/'+ song.title +'.jpg',
					mp3Url = '/stream/play/'+ song.id +'/'+ artist.title +'/'+ album.title +'/'+ song.title +'.mp3',
					waveformUrl = '/stream/waveform/'+ song.id +'/';
	    		
	    		
				$(self.ids.player).GroovyPlayer('channelAdd', {
					type: 'mp3',
					artist: artistLink,
					song: song.title,
					file: mp3Url,
					thumbnail: albumThumbnailUrl,
					scrub: {
						bg: waveformUrl +'active.png',
						progress: waveformUrl +'progress.png'
					}
				});
				
				
				
	    		//$(self.ids.player).GroovyJplayerWrapper('setSongMeta', artistLink, song.title, albumThumbnailUrl);
	    	},
	    	
	    	
	    	onPause: function() {
	    		$(self.ids.player).GroovyPlayer('pause');
	   		},
	   		
	   		
	   		onMedium: function() {
	   			$(self.ids.pageWrapper).removeClass('small-height').addClass('medium-height');
	   		},
	   		
	   		
	   		onSmall: function() {
	   			$(self.ids.pageWrapper).removeClass('medium-height').addClass('small-height');
	   		},
	   		
	   		
	   		onPlaylistMenu: function() {
	   			PlaylistMenu.setPlayer(self).render();
	   		}
	    });
	    
	    
	    $(this.ids.player).GroovyPlayer({
	    	onPlay: function() {
	    		$(self.ids.draggable).playlistQueue('play');
	    	},
	    	
	    	
	    	onPause: function() {
	    		$(self.ids.draggable).playlistQueue('playPauseIcon', 'pause');
	    	},
	    	
	    	
	    	onNext: function() {
	    		$(self.ids.draggable).playlistQueue('setNext');
	    	},
	    	
	    	
	    	onPrevious: function() {
	    		$(self.ids.draggable).playlistQueue('setPrevious');
	    	},
	    	
	    	onEnd: function() {
	    		$(self.ids.draggable).playlistQueue('setNext');
	    	}
	    });
    }

  });
  
  // singleton
  var instance = null;
  
  return function() {
	if (null === instance) {
  		instance = new PlayerController();
  	}
  	
  	return instance;
  };
  
});