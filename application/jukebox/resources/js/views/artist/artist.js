define([
	'jquery',
	'backbone',
	'collections/albums',
	'views/artist/artist_albums_list',
	'views/artist/artist_toolbar',
	'views/artist/artist_intro',
	'text!templates/artist/artist.html',
	'views/layout/player',
	'isotope',
	'jQueryMouseWheel'
], function($, Backbone, AlbumsCollection, ArtistAlbumsListView, ArtistToolbarView, ArtistIntroView, artistTemplate, PlayerView) {
	var ArtistView = Backbone.View.extend({
		tagName: 'div',
		id: 'artist-albums-list',
		
		ArtistAlbumsList: null,
		Player: new PlayerView(),
		AlbumCollection: null,
        
        notifyOnReady: null,
		
		initialize: function(options) {
			var self = this;
			_.extend(this, options);
			
			console.log('controllers/ArtistView::initialize()');

			this.AlbumCollection = new AlbumsCollection().setArtist(this.artist);
			
			$.when(this.AlbumCollection.fetch()).then(function () {
				self.render();
				self.Player.rebind();
                
                if (null !== self.notifyOnReady && 'function' === typeof(self.notifyOnReady)) {
                    self.notifyOnReady();
                }
			}, function() { console.log('err'); });
		},
		
		
		render: function () {
			console.log('controllers/ArtistView::render()');
            
			var data = {
			        model: this.AlbumCollection,
			        parent: this
			    };

		    var ArtistAlbumsList = new ArtistAlbumsListView(data),
				ArtistToolbar = new ArtistToolbarView(data),
				ArtistIntro = new ArtistIntroView(data);
			
            this.ArtistAlbumsList = ArtistAlbumsList;
            
			$('#main').html(artistTemplate);
            
			$(ArtistToolbar.render().$el).appendTo(this.$el);
			$(ArtistAlbumsList.render().$el).appendTo(this.$el);
			$(ArtistIntro.render().$el).appendTo('#artist-intro-content');
			
			$(this.$el).appendTo('#artist-content');
            
            this.ArtistAlbumsList.renderComplete();
		},
        
        
		destruct: function() {
			this.ArtistAlbumsList.destruct();
		},
        

        notifyOnReady: function(callback) {
            this.notifyOnReady = callback;
        }
	});
	
	return ArtistView;
});