define([
  'lodash',
  'backbone',
  'models/artist'
], function(_, Backbone, ArtistModel) {
	var SlidesCollection = Backbone.Collection.extend({
	    defaults: {
			slides: []
	    },
	    
	    model: ArtistModel,
	
	    url: function() {
	    	return '/artists/featured';
	    },
	
	    initialize: function(){
	    	console.log("SlidesCollection init...");
	    }
	});
	
	return SlidesCollection;
});
