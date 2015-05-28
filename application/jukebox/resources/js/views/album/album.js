define([
	'jquery',
	'backbone',
	'collections/app_data',
	'models/album',
	'views/album/album_songs_list',
	'views/album/album_songs_toolbar',
	'views/album/album_intro',
	'views/artist/artist_sidebar',
	'text!templates/album/album.html',
	'views/layout/player'
], function($, Backbone, AppDataCollection, AlbumModel, AlbumSongsListView, AlbumSongsToolbarView, AlbumIntroView, ArtistSidebarView, albumTemplate, PlayerView) {
	var AlbumView = Backbone.View.extend({
		tagName: 'div',
		id: 'album-song-list',
		
		Player: new PlayerView(),
		AlbumModel: null,
        notifyOnReady: null,
		
		initialize: function(options) {
			var self = this;
			_.extend(this, options);
			
			console.log("controllers/AlbumView::initialize()");

			this.AlbumModel = new AlbumModel();
			this.AlbumModel.artistName = this.artist;
			this.AlbumModel.albumName = this.album;
			
			//this.allAlbumsModel = new AlbumsCollection({'artist': this.getArtist()}); // all albums by same artist.
			
			$.when(this.AlbumModel.fetch()).then(function () {
				self.render();
				self.Player.rebind();
                
                if (null !== self.notifyOnReady && 'function' === typeof(self.notifyOnReady)) {
                    self.notifyOnReady();
                }
			}, function() { console.log('err'); });
		},
		
		
		render: function () {
			console.log("controllers/AlbumView::render()");
			var data = {
			        model: this.AlbumModel,
			        parent: this
			    };

		    var AlbumSongsList = new AlbumSongsListView(data),
				AlbumSongsToolbar = new AlbumSongsToolbarView(data),
				ArtistSidebar = new ArtistSidebarView(data),
				AlbumIntro = new AlbumIntroView(data);
			
			$('#main').html(albumTemplate);
			
			$(AlbumSongsToolbar.render().$el).appendTo(this.$el);
			$(AlbumSongsList.render().$el).appendTo(this.$el);
			$(ArtistSidebar.render().$el).appendTo('#main');
			$(AlbumIntro.render().$el).appendTo('#album-intro-content');
			
			$(this.$el).appendTo('#album-content');
		},
        

        notifyOnReady: function(callback) {
            this.notifyOnReady = callback;
        }
	});
	
	return AlbumView;
});