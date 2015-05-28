define([
	'jquery',
	'backbone',
	'text!templates/index/index_toolbar.html'
], function($, Backbone, indexToolbarTemplate) {
	var IndexToolbarView = Backbone.View.extend({
		tagName: 'div',
        id: 'index-toolbar',
		
		model: null,
		
		initialize: function(options) {
			console.log('controllers/IndexToolbarView::initialize()');
			_.extend(this, options);
		},
		
		render: function () {
			console.log('controllers/IndexToolbarView::render()');
			this.$el.html(indexToolbarTemplate);
			
			return this;
		}
	});
	
	return IndexToolbarView;
});