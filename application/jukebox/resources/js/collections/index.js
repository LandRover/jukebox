define([
	'lodash',
	'backbone',
	'collections/artists',
	'collections/albums',
	'collections/songs',
], function(_, Backbone, ArtistsCollection, AlbumsCollection, SongsCollection) {
	var IndexCollection = Backbone.Collection.extend({
	    defaults: {
			artists_featured: [],
			artists_new: [],
			
			albums_featured: [],
			albums_new: [],
			albums_hot: [],
			
			songs_featured: [],
			songs_new: [],
			songs_hot: [],
	    },
	    
	    collections: {
			artists_featured: null,
			artists_new: null,
			
			albums_featured: null,
			albums_new: null,
			albums_hot: null,
			
			songs_featured: null,
			songs_new: null,
			songs_hot: null,
	    },
	    
	    
	    url: function() {
	    	return '/index/api';
	    },
	    
	    
	    initialize: function(){
	    	console.log("IndexCollection init...");
	    },
	    
	    
	    parse: function(response) {
	    	var self = this;
	    	
	    	var mapCollections = {
				artists_featured: ArtistsCollection,
				artists_new: ArtistsCollection,
				
				albums_featured: AlbumsCollection,
				albums_new: AlbumsCollection,
				albums_hot: AlbumsCollection,
				
				songs_featured: SongsCollection,
				songs_new: SongsCollection,
				songs_hot: SongsCollection
	    	};
	    	
	    	_.each(mapCollections, function(collection, namespace) {
	    		response = self._initCollection(response, collection, namespace);
	    	});
	    	
	    	return response;
	    },
	    
	    
	    _initCollection: function(response, collection, namespace)
		{
	    	// handle collection if exists and set
			if (_.has(response, namespace)) {
	    		if (this.collections[namespace]) {
	    			this.collections[namespace].reset(response[namespace]);
	    		} else {
	    			this.collections[namespace] = new collection(response[namespace]);
	    		}
	    		
	    		delete response[namespace];
	    	}

	    	return response;
	    }
	});
	
	return IndexCollection;
});