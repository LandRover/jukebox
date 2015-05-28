define([
	'lodash',
	'backbone',
	'collections/artists',
	'collections/albums',
	'collections/songs',
], function(_, Backbone, ArtistsCollection, AlbumsCollection, SongsCollection) {
	var SearchQuickCollection = Backbone.Collection.extend({
	    defaults: {
	    	
	    },
	    query: null,
	    
	    
		albums: null,
		songs: null,
		artists: null,
	    
	    
	    url: function() {
	    	return '/search/quick/'+this.getQuery();
	    },
	    
	    
	    initialize: function(){
	    	console.log("SearchQuickCollection init...");
	    },
	    
	    
	    getQuery: function() {
	    	return this.query;
	    },
	    
	    
	    setQuery: function(query) {
	    	this.query = query;
	    	
	    	return this;
	    },
	    
	    
	    parse: function(response) {
	    	var self = this;
	    	
	    	var mapCollections = {
				artists: ArtistsCollection,
				albums: AlbumsCollection,
				songs: SongsCollection,
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
	    		if (this[namespace]) {
	    			this[namespace].reset(response[namespace]);
	    		} else {
	    			this[namespace] = new collection(response[namespace]);
	    		}
	    		
	    		delete response[namespace];
	    	}
	    	
	    	return response;
	    }

	});
	
	return SearchQuickCollection;
});