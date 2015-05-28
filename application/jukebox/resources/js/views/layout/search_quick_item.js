define([
	'jquery',
	'backbone',
	'models/album',
	'text!templates/layout/nav_search_quick-artists.html',
	'text!templates/layout/nav_search_quick-albums.html',
	'text!templates/layout/nav_search_quick-songs.html',
	'views/layout/player'
], function($, Backbone, AlbumModel, searchQuickArtistsTemplate, searchQuickAlbumsTemplate, searchQuickSongsTemplate, PlayerView){
	
	var SearchQuickItemController = Backbone.View.extend({
		tagName: 'li',
		className: 'single',
		namespace: null,
		player: new PlayerView(),
		templatesList: {
			artists: searchQuickArtistsTemplate,
			albums: searchQuickAlbumsTemplate,
			songs: searchQuickSongsTemplate,
		},
		
		
		initialize: function(options) {
			_.extend(this, options);
		},
		
		
		events: {
			'click .play': 'onPlay',
			'click h4': 'onTitle',
			'click img': 'onImg',
			'click strong': 'onTitleSub'
		},
		
		
		render: function () {
			this.$el.addClass(this.namespace);
			
			if ('artists' !== this.namespace) {
				this.$el.addClass('item-wrapper ui-draggable');
			}
			
			var tpl = this.templatesList[this.namespace];
			
			if ('undefined' !== typeof(tpl)) {
				this.$el.html(_.template(tpl, {
					model: this.model,
					el: this.$el,
					namespace: this.namespace
				}));
			}
			
			return this;
		},
		
		
	    queueSong: function(e) {
			var item = $(e.target).parent().clone();
			item.attr({'class': 'item-wrapper'}); // generic ui of a li in the player.
			
			this.player.addQueue(item).playLast();
	    },
	    
		
		queueAlbumAndPlay: function(e) {
			var item = $(e.target).closest('li'),
				songs = [],
				self = this,
				AlbumModelModel = new AlbumModel();
				
			AlbumModelModel.artistName = item.data('artist').title;
			AlbumModelModel.albumName = item.data('album').title;
			
			$.when(AlbumModelModel.fetch()).then(function (response) {
				songs = response[0]['songs'] || response['songs'];
				self.player.addQueueList(songs.toJSON());
			}, function() { console.log('err'); });
		},
		
		
		onPlay: function(e) {
			switch(this.namespace) {
				case 'albums':
					this.queueAlbumAndPlay(e);
					break;
					
				case 'songs':
					this.queueSong(e);
					break;
			}
			
			
			return false;
		},
		
		
		onImg: function(e) {
			this.onTitleRedirect($(e.target).parent().parent().parent());
		},
		
		onTitle: function(e) {
			this.onTitleRedirect($(e.target).parent());
		},
		
		
		onTitleRedirect: function(item) {
			switch(this.namespace) {
				case 'artists':
					location.href = '#/artist/'+ item.data('artist').title;
					break;
				
				case 'songs':
				case 'albums':
					location.href = '#/album/'+ item.data('artist').title +'/'+ item.data('album').title;
					break;
			}
			
			this.select();
				
			return false;
		},
		
		
		onTitleSub: function(e) {
			var item = $(e.target).parent();
			
			switch(this.namespace) {
				case 'albums':
					location.href = '#/artist/'+ item.data('artist').title;
					break;
					
				case 'songs':
					location.href = '#/album/'+ item.data('artist').title +'/'+ item.data('album').title;
					break;
			}
			
			this.select();
			
			return false;
		},
		
		
		select: function() {
			this.parent.hide().select(this.model);
			return false;
		}
	});
	
  	return SearchQuickItemController;
});