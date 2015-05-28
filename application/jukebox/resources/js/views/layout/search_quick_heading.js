define([
  'jquery',
  'backbone',
  'text!templates/layout/nav_search_quick-heading.html'
], function($, Backbone, searchQuickHeadingTemplate){
	
	var SearchQuickHeadingController = Backbone.View.extend({
		tagName: 'li',
		className: 'heading',
		namespace: null,
		
		initialize: function(options) {
			_.extend(this, options);
		},
		
		events: {
			'click': 'select'
		},
		
		
		render: function () {
			$(this.$el).addClass(this.namespace);
			
			this.$el.html(_.template(searchQuickHeadingTemplate, {
				namespace: this.namespace
			}));
			
			return this;
		},
		
		
		select: function(e) {
			//this.parent.hide().select(this.model);
			return false;
		}
	});

  	return SearchQuickHeadingController;
});