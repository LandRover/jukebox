define([
  'jquery',
  'backbone',
  'text!templates/playlists/playlist_item.html',
  'views/layout/player'
], function($, Backbone, PlaylistsListItemTemplate, PlayerView){
	var PlaylistItemController = Backbone.View.extend({
		tagName: 'li',
        className: 'item-wrapper ui-draggable',
        
        player: new PlayerView(),
		
		events: {
            'click div.action button': 'queueAddAndPlay',
            'click li.remove button': 'onRemoveClick',
            'click span.artist-name': 'artistClick',
            'click span.album-name': 'albumClick',
            'click': 'onRowClick'
		},
        
		initialize: function(options) {
			console.log("controllers/PlaylistItemController::render()");
			
			_.extend(this, options);

            this.song.bind('change', this.change, this);
            this.song.bind('remove', this.remove, this);
            
            this.setMetadata();
		},
        
		render: function () {
		  
			this.$el.html(_.template(PlaylistsListItemTemplate, {
				song: this.song
			}));

			return this;
		},
        
        
		queueAddAndPlay: function(e) {
            e.stopPropagation(); //click action must not propagate to prevent row selection.
			var item = $($(e.target).parent().parent().parent()).hasClass('ui-draggable') ? $(e.target).parent().parent().parent() : $(e.target).parent().parent().parent().parent();
			
			this.player.addQueue(item);
			this.player.playLast();
		},
        
        
        setMetadata: function() {
            this.$el.attr({
                'data-artist': JSON.stringify({"id": this.song.get('artist_id'), "title": this.song.get('artist')}),
                'data-album': JSON.stringify({"id": this.song.get('album_id'), "title": this.song.get('albumName')}),
                'data-song': JSON.stringify({"id": this.song.get('id'), "title": this.song.get('name')}),
                'data-thumb': '/stream/thumbnail/small/album/'+ this.song.get('album_id') +'/'+ this.song.get('artist') +'/'+ this.song.get('name') +'.jpg'
            });
            
            //data-artist='{"id": <%- album.get('artist_id') %>, "title": "<%- artist %>"}' data-album='{"id": <%- album.get('id') %>, "title": "<%- album.get('name') %>"}' data-song='{"id": <%- song.id %>, "title": "<%- song.name %>"}' data-thumb="/stream/thumbnail/small/album/<%- album.get('path') %>.jpg"
        },
        
        
        onRowClick: function() {
            if (!this.isSelected()) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
            
            this.song.set('selected', this.isSelected());
            
            return this;
        },
        
        
        isSelected: function() {
            return this.$el.hasClass('selected');
        },
        
        
        hide: function() {
            return this.$el.addClass('hide');
        },
        
        
        show: function() {
            return this.$el.removeClass('hide');
        },
        
        
        artistClick: function(e) {
            e.stopPropagation(); //click action must not propagate to prevent row selection.
            window.location.href = '#/artist/'+ this.song.get('artist');
        },
        
        
        albumClick: function(e) {
            e.stopPropagation(); //click action must not propagate to prevent row selection.
            window.location.href = '#/album/'+ this.song.get('artist') +'/'+ this.song.get('albumName');
        },
        
        
        onRemoveClick: function(e) {
            e.stopPropagation(); //click action must not propagate to prevent row selection.
            this.parent.childModelRemoved([this.song]);
        },
        
        
        change: function() {
            var setFilter = (false === this.song.get('isMatchingFilter')) ? this.hide() : this.show();
            
            this.parent.childModelChanged(this.song);
        },
        
        remove: function() {
            this.el.remove();
        }
	});
	
  	return PlaylistItemController;
});