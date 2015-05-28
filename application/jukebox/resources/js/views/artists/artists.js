define([
	'jquery',
	'backbone',
	'collections/artists',
	'views/artists/artists_list',
	'views/artists/artists_toolbar',
	'views/artists/artists_intro',
	'text!templates/artists/artists.html',
	'views/layout/player'
], function($, Backbone, ArtistsCollection, ArtistsListView, ArtistsToolbarView, ArtistsIntroView, artistsTemplate, PlayerView) {
	var ArtistsView = Backbone.View.extend({
		tagName: 'div',
		id: 'artists-list',
		
		
		events: {
			'scroll #artists-page': 'onScroll' 
		},
		
		ArtistsList: null,
		Player: new PlayerView(),
		ArtistsCollection: null,
        
        notifyOnReady: null,
		
		initialize: function(options) {
			var self = this;
			_.extend(this, options);
			
			console.log("controllers/ArtistsView::initialize()");

			this.ArtistsCollection = new ArtistsCollection();
			
			$.when(this.ArtistsCollection.fetch()).then(function () {
				self.render();
				self.Player.rebind();
                
                if (null !== self.notifyOnReady && 'function' === typeof(self.notifyOnReady)) {
                    self.notifyOnReady();
                }
			}, function() { console.log('err'); });
		},
		
		
		render: function () {
			console.log("controllers/ArtistsView::render()");
            
			var data = {
			        model: this.ArtistsCollection,
			        parent: this
			    };

		    var ArtistsList = new ArtistsListView(data),
				ArtistsToolbar = new ArtistsToolbarView(data),
				ArtistsIntro = new ArtistsIntroView(data);
			
			this.ArtistsList = ArtistsList;
			
			$('#main').html(artistsTemplate);
            
			$(ArtistsToolbar.render().$el).appendTo(this.$el);
			$(ArtistsList.render().$el).appendTo(this.$el);
			$(ArtistsIntro.render().$el).appendTo('#artists-intro-content');
			
			$(this.$el).appendTo('#artists-content');
			
			this.ArtistsList.renderComplete();
		},
		
        
		destruct: function() {
			this.ArtistsList.destruct();
		},
        

        notifyOnReady: function(callback) {
            this.notifyOnReady = callback;
        }
	});
	
	return ArtistsView;
});