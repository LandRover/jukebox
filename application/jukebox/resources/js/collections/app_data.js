define([
	'lodash',
	'backbone',
	'models/user',
	'collections/playlists'
], function(_, Backbone, UserModel, PlaylistsCollection) {
	var AppDataCollection = Backbone.Collection.extend({
	    userModel: null,
	    playlistsCollection: null,
	    
	    initialize: function() {
			this._setUser(window.app.user);
			this._setPlaylists(window.app.playlists);
			
	    	console.log("AppCollection init...");
	    },
	    
	    
	    _setUser: function(user) {
	    	this.userModel = new UserModel(user);
	    	
	    	return this;
	    },
	    
	    
	    getUser: function() {
	    	return this.userModel;
	    },
	    
	    
	    _setPlaylists: function(playlistsList) {
	    	this.playlistCollection = new PlaylistsCollection(playlistsList);
	    	
	    	return this;
	    },
	    
	    
	    getPlaylists: function() {
	    	return this.playlistsCollection;
	    }
	});
	
	return new AppDataCollection();
});