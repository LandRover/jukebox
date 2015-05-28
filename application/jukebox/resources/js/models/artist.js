define([
	'lodash',
	'backbone'
], function(_, Backbone) {
	var ArtistModel = Backbone.Model.extend({
	    defaults: {
			id: '',
			date_created: '',
			date_changed: '',
			name: '',
			votes: '',
			is_featured: '',
			count_albums: ''
		},
	
	    initialize: function(){
	    	console.log("ArtistModel init...");
	    }
	});
	
	return ArtistModel;
});
