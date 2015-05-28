define([
  'jquery',
  'backbone',
  'text!templates/layout/footer.html',
  'text!templates/layout/footer.credits.html',
], function($, Backbone, footerTemplate, creditsTemplate) {
var FooterController = Backbone.View.extend({
	footerElement: $('footer#footer'),
	creditsElement: $('div#credits'),
	
	initialize: function() {
		console.log( "controllers/FooterController::initialize()" );
	},
	
	
	render: function () {
		console.log( "controllers/FooterController::render()" );
		
		this.footerElement.html ( footerTemplate );
		this.creditsElement.html ( creditsTemplate );
		
		this.scrollToTop();
	},
	
	scrollToTop: function() {
		$('.scroll-up a').click(function () {
			$('div#page-wrapper div#page-scroll').animate({scrollTop: "0px"}, 500);
		});
	}
});

return FooterController;
});