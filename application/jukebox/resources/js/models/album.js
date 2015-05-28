define([
	'lodash',
	'backbone',
	'collections/songs'
], function(_, Backbone, SongsCollection) {
	var AlbumModel = Backbone.Model.extend({
	    defaults: {
			artist_id: '',
			count_plays_album: '',
			count_songs: 0,
			count_views: 0,
			date_changed: '',
			date_created: '',
			is_featured: false,
			name: '',
			path: '',
			year: '',
			songs: []
	    },
	    
	    url: function() {
	    	return '/album/getAlbums/'+ this.artistName + '/' + this.albumName;
	    },
	    
	    
	    initialize: function(){
	    	console.log('AlbumModel init...');
	    },
	    
	    
	    isFeatured: function() {
	    	return (1 === Number(this.get('is_featured')) ? true : false);
	    },
	    
	    
	    getBitrate: function() {
	    	if (0 === this.get('songs').length) {
	    		return '';
	    	}
	    	
	    	return this.get('songs')[0].id3_bitrate;
	    },
	    
	    
	    getGenre: function() {
	    	if (0 === this.get('songs').length) {
	    		return '';
	    	}
	    	
	    	return this.get('songs')[0].id3_genre;
	    },
	    
	    
	    toggleFeatured: function(callback) {
	    	this.set('is_featured', !this.isFeatured());
	    	
	    	this._store(callback);
	    	
	    	return this;
	    },
	    
	    
	    _store: function (callback) {
	    	this.save(this.toJSON(), {
	    		success: callback,
	    		
	    		error: function() {
	    			console.log('save failed.');
	    		}
	    	});
	    },
	    
	    
	    parse: function(response) {
	    	response = response[0] || response;

	    	// handle songs if exists.
			if (_.has(response, 'songs')) {
	    		response.songs = new SongsCollection(response.songs);
	    	}
	    	
	    	return response;
	    }
	});
	
	return AlbumModel;
});