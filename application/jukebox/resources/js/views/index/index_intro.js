define([
	'jquery',
	'backbone',
	'text!templates/index/index_intro.html'
], function($, Backbone, indexIntroTemplate) {
	var IndexIntroView = Backbone.View.extend({
		tagName: 'div',
        id: 'index-intro',
		
		model: null,
        
		initialize: function(options) {
			console.log("controllers/IndexIntroView::initialize()");
			_.extend(this, options);
		},
		
		render: function () {
			console.log("controllers/IndexIntroView::render()");
			
			this.$el.html(_.template(indexIntroTemplate, {
				artists: this.model
			}));
			
			return this;
		}
	});
	
	return IndexIntroView;
});