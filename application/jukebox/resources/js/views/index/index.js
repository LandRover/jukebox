define([
	'jquery',
	'backbone',
	'collections/index',
	'views/index/index_list',
	'views/index/index_toolbar',
	'views/index/index_intro',
	'text!templates/index/index.html',
	'views/layout/player'
], function($, Backbone, IndexCollection, IndexListView, IndexToolbarView, IndexIntroView, indexTemplate, PlayerView) {
	var IndexView = Backbone.View.extend({
		tagName: 'div',
		id: 'index-list',
		
		IndexList: null,
		IndexCollection: null,
		Player: new PlayerView(),
        
        notifyOnReady: null,
		
		initialize: function(options) {
			var self = this;
			_.extend(this, options);
			
			console.log('controllers/IndexView::initialize()');

			this.IndexCollection = new IndexCollection();
			
			$.when(this.IndexCollection.fetch()).then(function () {
				self.render();
				self.Player.rebind();
                
                if (null !== self.notifyOnReady && 'function' === typeof(self.notifyOnReady)) {
                    self.notifyOnReady();
                }
			}, function() { console.log('err'); });
		},
		
		
		render: function () {
			console.log('controllers/IndexView::render()');
            
			var data = {
			        model: this.IndexCollection,
			        parent: this
			    };

		    var IndexList = new IndexListView(data),
				IndexToolbar = new IndexToolbarView(data),
				IndexIntro = new IndexIntroView(data);
			
			this.IndexList = IndexList;
			
			$('#main').html(indexTemplate);
            
			$(IndexToolbar.render().$el).appendTo(this.$el);
			$(IndexList.render().$el).appendTo(this.$el);
			$(IndexIntro.render().$el).appendTo('#index-intro-content');
			
			$(this.$el).appendTo('#index-content');
			
			this.IndexList.renderComplete();
		},
		
        
		destruct: function() {
			this.IndexList.destruct();
		},
        

        notifyOnReady: function(callback) {
            this.notifyOnReady = callback;
        }
	});
	
	return IndexView;
});