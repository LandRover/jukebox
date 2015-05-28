define([
	'lodash',
	'backbone'
], function(_, Backbone) {
	var UserModel = Backbone.Model.extend({
	    defaults: {
			id: 0,
			username: '',
			access_level: 0
		},
	
	    initialize: function(){
	    	console.log('UserModel init...');
	    },
	    
	    
	    isAdmin: function() {
	    	var obj = this.toJSON();
	    	
	    	if (5 < Number(obj.access_level)) {
	    		return true;
	    	}
	    	
	    	return false;
	    }
	});
	
	return UserModel;
});