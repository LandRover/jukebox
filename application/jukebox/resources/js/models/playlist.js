define([
	'lodash',
	'backbone'
], function(_, Backbone) {
	var PlaylistModel = Backbone.Model.extend({
	    idAttribute: 'id',
	    
		defaults: {
			date_created: '',
			date_changed: '',
			name: '',
			user_id: 0,
			songs_list: [],
			songs_count: 0,
			is_public: false,
			is_featured: false
		},
        
        methodToURL: function(method) {
			switch (method) {
       			case 'create':
       				return '/playlist/add';
				
        		case 'update':
				case 'read':
        			return '/playlist/getPlaylist/'+this.get('id');
       			
       			case 'update':
       				return '/playlist/update/'+this.get('id');
      			
       			case 'delete':
       				return '/playlist/delete/'+this.get('id');
        	}
        	
        	return false;
        },
        
        
	    initialize: function() {
	    	console.log('PlaylistModel init...');
	    },
        
        
        resetFilterOnSongs: function(matchedList) {
            _.each(this.get('songs_list').models, function(model) {
                if ('undefined' === typeof(matchedList[model.id])) {
                    model.set('isMatchingFilter', false);
                } else {
                    model.set('isMatchingFilter', true);
                }
            });
        },
        
        
        setPlaylistID: function(playlistID) {
        	this.playlistID = playlistID;
			return this;
        },
        
        
        getPlaylistID: function() {
        	return this.playlistID;
        },
        
        
        getSelectedModels: function() {
            var modelsList = [];
            
            _.each(this.get('songs_list').models, function(model) {
                if (true === model.get('selected') && false !== model.get('isMatchingFilter'))
                    modelsList.push(model);
            });
            
            return modelsList;
        },
        
        
        getMatchingFilterModels: function() {
            var modelsList = [];
            
            _.each(this.get('songs_list').models, function(model) {
                if (false !== model.get('isMatchingFilter'))
                    modelsList.push(model);
            });
            
            return modelsList;
        },
        
        
        sync: function(method, model, options) {
        	options || (options = {});
        	options.url = model.methodToURL(method.toLowerCase());
        	
        	return Backbone.sync.apply(this, arguments);
        }
	});
	
	return PlaylistModel;
});