define([
  'jquery',
  'backbone',
  'text!templates/playlists/playlist_toolbar.html'
], function($, Backbone, PlaylistsToolbarTemplate){
	var PlaylistToolbarController = Backbone.View.extend({
		tagName: 'div',
        id: 'playlist-toolbar',
		
        events: {
            'keyup input#playlist-filter': 'filter',
            'click input#playlist-filter': 'filterClick',
            
            'click li.play-all button': 'onPlayAll',
            'click li.remove-selected button': 'onRemove'
        },
        
		initialize: function(options) {
			_.extend(this, options);
		},
        
        
        onPlayAll: function() {
            var selectedModels = this.playlist.getSelectedModels(),
                filterMatchingModels = this.playlist.getMatchingFilterModels(),
                list = [];
            
            list = filterMatchingModels;
            
            if (0 < _.size(selectedModels)) {
                list = selectedModels;
            }
            
            this.parent.playAll(list);
        },
        
        
        onRemove: function() { 
            this.parent.childModelRemoved(this.playlist.getSelectedModels());
        },
        
        
        filter: function(e) {
            return this.parent.filter($(e.target).val());
        },
        
        
        filterClick: function(e) {
            return ('' === $(e.target).val()) ? this.filter(e) : null;
        },
        
        
        change: function() {
            var selectedModels = _.size(this.playlist.getSelectedModels());
            
            return this.syncButtonNumbers(selectedModels);
        },
        
        
        syncButtonNumbers: function(selectedModelsCount) {
            this.$el.find('em span').html(selectedModelsCount);

            if (0 < selectedModelsCount) {
                this.$el.find('li.play-all em').removeClass('hide');
                this.$el.find('li.remove-selected').removeClass('hide');
            } else {
                this.$el.find('li.play-all em').addClass('hide');
                this.$el.find('li.remove-selected').addClass('hide');
            }
        },
        
        
		render: function () {
			this.$el.html(_.template(PlaylistsToolbarTemplate, {
				playlist: this.playlist
			}));

			return this;
		}
	});
	
  	return PlaylistToolbarController;
});