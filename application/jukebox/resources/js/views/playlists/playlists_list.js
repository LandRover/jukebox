define([
	'jquery',
	'backbone',
	'collections/playlists',
    'views/playlists/playlists_list_item',
	'text!templates/playlists/playlists_list.html',
	'views/layout/player'
], function($, Backbone, PlaylistsCollection, PlaylistsListItem, playlistsListTemplate, PlayerView) {
	var PlaylistsListView = Backbone.View.extend({
		tagName: 'ol',
        player: new PlayerView(),
		
		collection: new PlaylistsCollection(),
        
        notifyOnReady: null,
		
		initialize: function() {
			var self = this;
			
			$.when(this.collection.fetch()).then(function () {
				self.collection.bind('add', self.onAdd, self);
				self.collection.bind('remove', self.onRemove, self);
                self.collection.bind('change', self.onChange, self);
                
				self.render();
				self._rebindPlayer();
                
                if (null !== self.notifyOnReady && 'function' === typeof(self.notifyOnReady)) {
                    self.notifyOnReady();
                }
			}, function() { console.log('err'); });
		},
		
		
		render: function () {
			console.log("controllers/PlaylistsListView::render()");
			
			$('#main').html(_.template(playlistsListTemplate));
            
            $(this.$el).appendTo('#playlists-list');
            
            this.addItemsFromCollection();
		},
        
        
        addItem: function(playlist) {
		    this.$el.append(new PlaylistsListItem({
		        playlist: playlist,
		        parent: this
		    }).render().$el);
        },
		
		
	    _rebindPlayer: function()
		{
			this.player.rebind();
	    },
	    
	    
		addItemsFromCollection: function() {
            var self = this;
            
            $(this.$el).find('li').remove();
			_.each(this.collection.models, function(model, key) {
				self.addItem(model);
			}, this);
		},
		
		
		onChange: function() {
			console.log("controllers/PlaylistsListView::onChange()");
            return this.addItemsFromCollection();
		},
		
		
		onAdd: function() {
			this.onChange();
		},
		
		
		onRemove: function(model) {
			this.onChange();
		},
		
		
		onRemoveClick: function(model) {
			this.collection.remove(model);
			model.destroy();
		},
        
        
        notifyOnReady: function(callback) {
            this.notifyOnReady = callback;
        }
	});
	
	return PlaylistsListView;
});