define([
	'jquery',
	'backbone',
	'md5',
	'models/login',
	'text!templates/login/login.layout.html'
], function($, Backbone, md5, LoginModel, indexTemplate) {
	var LoginView = Backbone.View.extend({
		el: $('body'),
		model: new LoginModel(),
		
		events: {
			'submit form': 'onSubmit'
		},
		
		
		initialize: function() {
			console.log( "controllers/LoginController::initialize()" );
		},
		
		
		render: function () {
			console.log( "controllers/LoginView::render()" );
			console.log( indexTemplate );
			
			this.$el.html ( indexTemplate );
		},
		
		
		onSubmit: function (ev) {
			ev.preventDefault();
			
			var form = ev.currentTarget,
				params = {},
				self = this;
			
			$(form).find('input.send').each(function() {
				params[$(this).attr('name')] = ('password' === $(this).attr('type')) ? md5($(this).val()) : $(this).val();
			});
			
			console.log(params);
			
			this.model.save(params, {
				success: function (e, repsonse) {
					console.log( "got response" );
					console.log(repsonse);
					
					if (true === repsonse.status) {
						self.loginComplete();
					} else {
						self.loginFailed(repsonse.description);
					}
				}
			});
			
			return false;
		},
		
		
		loginFailed: function(text) {
			$('.login .onError em').html(text);
			$('.login .onError').slideDown();
			$('.login input[name="password"]').val('');
		},
		
		
		loginComplete: function() {
			return location.href = '/';
		}
	});
	
	return LoginView;
});