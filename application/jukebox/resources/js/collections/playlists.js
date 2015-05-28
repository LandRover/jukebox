define([
  'lodash',
  'backbone',
  'models/playlist'
], function(_, Backbone, PlaylistModel) {
	var PlaylistsCollection = Backbone.Collection.extend({
	    defaults: {
			slides: []
	    },
	    
	    
	    model: PlaylistModel,
	    
	    
	    url: function() {
	    	return '/playlist/getMyPlaylists';
	    },
	    
	    
	    initialize: function(){
	    	console.log("PlaylistsCollection init...");
	    },
	    
	    // fetch once.
	    fetch: function(options) {
	    	if (true === this.loaded) return this;
			this.loaded = true;
			
	    	return Backbone.Collection.prototype.fetch.call(this, options);
	    }
	});
	
	// singleton
	var instance = null;
	
	return function() {
		if (null === instance) {
			instance = new PlaylistsCollection();
		}
		
		return instance;
	};
	
});
