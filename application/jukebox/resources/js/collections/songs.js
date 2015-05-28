define([
  'lodash',
  'backbone',
  'models/song'
], function(_, Backbone, SongModel) {
	var SongsCollection = Backbone.Collection.extend({
	    defaults: {
	      songs: []
	    },
	    
	    model: SongModel,
	
	
	    url: function() {
	    	return '/album/getSongs';
	    },
	    
	    
	    initialize: function(){
	    	console.log("SongsCollection init...");
	    }
	});
	
	return SongsCollection;
});