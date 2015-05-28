define([
  'jquery',
  'backbone',
  'text!templates/album/album_songs_list_item.html'
], function($, Backbone, albumSongsListItemTemplate){
	var AlbumSongsListItemController = Backbone.View.extend({
		tagName: 'li',
        className: 'item-wrapper ui-draggable',
		
		events: {
            'click div.actions ul li.add button': 'queueAdd',
            'click div.action button': 'queueAddAndPlay'
		},
		
		initialize: function(options) {
			_.extend(this, options);
			console.log("controllers/AlbumSongsListItemController::initialize()");
			
			this.setMetadata();
		},
        
        
		render: function () {
			this.$el.html(_.template(albumSongsListItemTemplate, {
				song: this.model
			}));
			
			if (this.isRTL(this.model.get('name'))) {
				this.$el.addClass('rtl');
			}

			return this;
		},
        
        
        
		queueAdd: function(e) {
            e.stopPropagation(); //click action must not propagate to prevent row selection.
            
			this.parent.getPlayer().addQueue(this.$el);
		},
		
		
		queueAddAndPlay: function(e) {
			this.queueAdd(e);
            this.parent.getPlayer().playLast();
		},
		

        
        setMetadata: function() {
            this.$el.attr({
                'data-artist': JSON.stringify({'id': this.model.get('artist_id'), 'title': this.model.get('artist')}),
                'data-album': JSON.stringify({'id': this.model.get('album_id'), 'title': this.model.get('albumName')}),
                'data-song': JSON.stringify({'id': this.model.get('id'), 'title': this.model.get('name')}),
                'data-thumb': '/stream/thumbnail/small/album/'+ this.model.get('album_id') +'/'+ this.model.get('artist') +'/'+ this.model.get('name') +'.jpg'
            });
        },
        
        
		// @todo: move to string utils.
		isRTL: function(str) {
			return (str.charCodeAt(0) > 0x590) && (str.charCodeAt(0) < 0x5FF);
		}
	});
	
  	return AlbumSongsListItemController;
});