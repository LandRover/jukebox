define([
  'lodash',
  'backbone'
], function(_, Backbone) {
	var loginModel = Backbone.Model.extend({
	    defaults: {
	      username: '',
	      password: '',
	      remember_me: 1
	    },
	    url: "/login/doLogin",
	
	    initialize: function(){
	    	console.log("Login model init...");
	    }
	});
	
	return loginModel;
});
