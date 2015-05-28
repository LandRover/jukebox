define([
	'lodash',
	'backbone'
], function(_, Backbone) {
	var SongModel = Backbone.Model.extend({
	    defaults: {
			id: '',
			date_created: '',
			date_changed: '',
			path: '',
			track_id: '',
			artist: '',
			name: '',
			id3_year: '',
			id3_track: '',
			id3_genre: '',
			id3_bitrate: '',
			id3_length: '',
			count_plays: '',
			count_plays_complete: '',
			count_plays_skip: '',
			date_recently_played: '',
			is_featured: '',
			album_id: '',
			artist_id: ''
		},
	
	    initialize: function(){
	    	console.log('SongModel init...');
	    }
	});
	
	return SongModel;
});
