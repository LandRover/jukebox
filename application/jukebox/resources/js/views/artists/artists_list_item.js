define([
  'jquery',
  'backbone',
  'text!templates/artists/artists_list_item.html'
], function($, Backbone, artistsListItemTemplate){
	var ArtistsListItemView = Backbone.View.extend({
		tagName: 'li',
		className: 'ui-isotope',
		
		model: null,

		initialize: function(options) {
			_.extend(this, options);
			console.log('controllers/ArtistsListItemView::initialize()');
		},
        
        
		render: function () {
			this.isotopeProperties();
			
			this.$el.html(_.template(artistsListItemTemplate, {
				artist: this.model
			}));
			
			if (this.isRTL(this.model.get('name'))) {
				this.$el.addClass('rtl');
			}

			return this;
		},
		
		
		isotopeProperties: function() {
			var size = null;
			if (this.model.get('count_albums') > 10)
				size = 'big';
			else
			if (this.model.get('count_albums') > 5) 
				size = 'medium';
				
			if (null !== size)
				this.$el.addClass(size);
			
			return;
		},
		
		
		// @todo: move to string utils.
		isRTL: function(str) {
			return (str.charCodeAt(0) > 0x590) && (str.charCodeAt(0) < 0x5FF);
		}
	});
	
  	return ArtistsListItemView;
});