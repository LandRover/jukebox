define([
  'lodash',
  'backbone',
  'models/artist'
], function(_, Backbone, ArtistModel) {
	var ArtistsCollection = Backbone.Collection.extend({
	    defaults: {
	      artists: []
	    },
	    
	    model: ArtistModel,
	
	    url: function() {
	    	return '/artists/all';
	    },
	
	    initialize: function(){
	    	console.log("ArtistsCollection init...");
	    }
	});
	
	return ArtistsCollection;
});
