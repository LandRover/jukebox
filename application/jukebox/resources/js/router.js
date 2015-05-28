define([
	'jquery',
	'lodash',
	'backbone',
	'vm'
], function ($, _, Backbone, Vm) {
	var AppRouter = Backbone.Router.extend({
		
		routes: {
			'create': 'create',
			'albums': 'albums',
			'artists': 'artists',
			'artist/:artist': 'artist',
			'album/:artist/:album': 'album',
			
			'playlists': 'playlists',
            'playlist/:id/:name': 'playlist',
			
			// Default - catch all
			'*actions': 'default'
		},
		
		instance: null,
		
		lastActive: null
	});
	
	
	var initialize = function(options) {
		var appView = options.appView,
			router = new AppRouter(options),
			setup = function() {
				spinnerShow();
			},
			tearDown = function(view) {
				cleanUp(view);
                
                view.notifyOnReady(function() {
                    spinnerHide();
                });
			},
			cleanUp = function(view) {
				if (null !== router.lastActive) {
					if (typeof(router.lastActive.destruct) === 'function') {
						console.log('Found destruct function, cleaning up.');
						router.lastActive.destruct();
					}
				}
				
				router.lastActive = view;
			},
			spinnerShow = function() {
				$('div#loader_overlay').slideDown();
			},
			spinnerHide = function() {
				$('div#loader_overlay').slideUp();
			};
		
		
		
		router.on('route:artist', function (artist) {
			require(['views/artist/artist'], function (ArtistView) {
				console.log( "router::artist" );
				
				setup();
				
				var data = {
					'artist': artist
				};
				
				var artistView = Vm.create(appView, 'ArtistView', ArtistView, data);
				appView.scrollToTop();
				
				tearDown(artistView);
			});
		});
		
		
		router.on('route:playlist', function (playlistID, playlistName) {
			require(['views/playlists/playlist'], function (PlaylistView) {
				console.log( "router::playlist" );
				
				setup();
				
				var data = {
					'playlistID': playlistID,
					'playlistName': playlistName
				};
                
				var PlaylistView = Vm.create(appView, 'PlaylistView', PlaylistView, data);
				appView.scrollToTop();
				
				tearDown(PlaylistView);
			});
		});
        
        
		router.on('route:playlists', function () {
			require(['views/playlists/playlists_list'], function (PlaylistsListView) {
				console.log( "router::playlistsList" );
				
				setup();
				
				var PlaylistsListView = Vm.create(appView, 'PlaylistsListView', PlaylistsListView);
				appView.scrollToTop();
				
				tearDown(PlaylistsListView);
			});
		});
		
		
		router.on('route:albums', function () {
			require(['views/artists/albums_list'], function (AlbumsListView) {
				console.log( "router::albumsList" );
				
				setup();
				
				var AlbumsListView = Vm.create(appView, 'AlbumsListView', AlbumsListView);
				appView.scrollToTop();
				
				tearDown(AlbumsListView);
			});
		});
		
		
		router.on('route:artists', function () {
			require(['views/artists/artists'], function (ArtistsView) {
				console.log( "router::artists" );
				
				setup();
				
				var ArtistsView = Vm.create(appView, 'ArtistsView', ArtistsView);
				appView.scrollToTop();
				
				tearDown(ArtistsView);
			});
		});
		
		
		router.on('route:album', function (artist, album) {
			console.log(arguments);
			require(['views/album/album'], function (AlbumView) {
				console.log("router::album");
				
				setup();
				
				var data = {
					'artist': artist,
					'album': album
				};
				
				var albumView = Vm.create(appView, 'AlbumView', AlbumView, data);
				appView.scrollToTop();
				
				tearDown(albumView);
			});
		});
		
		
		router.on('route:default', function (actions) {
			require(['views/index/index'], function (IndexView) {
				console.log( "router::default" );
				
				setup();
				
				var indexView = Vm.create(appView, 'IndexView', IndexView);
				appView.scrollToTop();
				
				tearDown(indexView);
			});
		});
		
		
		// @deperecated
		router.on('route:create', function () {
		    require(['views/create'], function (CreateView) {
				console.log( "router::create" );
				
				setup();
				
				var createView = Vm.create(appView, 'CreateView', CreateView);
				createView.render();
				appView.scrollToTop();
				
				tearDown(createView);
		    });
		});
		
		AppRouter.instance = router;
		
		Backbone.history.start();
	};
		
	return {
		initialize: initialize,
		AppRouter: AppRouter
	};
});