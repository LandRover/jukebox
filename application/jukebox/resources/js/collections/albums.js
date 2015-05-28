define([
	'lodash',
	'backbone',
	'models/album'
], function(_, Backbone, AlbumModel) {
	var AlbumsCollection = Backbone.Collection.extend({
	    baseURL: '/album/getAlbums',
		
		artistName: null,
		albumName: null,
	    
	    model: AlbumModel,
	    
	    
	    url: function() {
	    	return this.baseURL+this.getArtist('/');
	    },
	    
	    initialize: function() {
	    	console.log("AlbumsCollection init...");
	    },
	    
	    
	    setArtist: function(artist) {
	    	this.artistName = artist;
	    	
	    	return this;
	    },
	    
	    
	    getArtist: function(prefix) {
	    	prefix = prefix || '';
	    	
	    	return ('undefined' !== typeof(this.artistName) && null !== this.artistName) ? prefix+this.artistName : '';
	    }
	});
	
	return AlbumsCollection;
});