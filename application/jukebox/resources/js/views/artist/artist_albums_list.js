define([
	'jquery',
	'backbone',
	'views/artist/artist_albums_list_item'
], function($, Backbone, ArtistAlbumsListItemView) {
	var ArtistAlbumsListView = Backbone.View.extend({
		tagName: 'ol',
        className: 'albums-list drag-container',
		
		model: null,
        
		initialize: function(options) {
			console.log("controllers/ArtistAlbumsListView::initialize()");
			_.extend(this, options);
		},
        
        
		render: function () {
			console.log("controllers/ArtistAlbumsListView::render()");
            //@todo..
			//change referance to internals of an artist.get('albums').models
			_.each(this.model.models, function(model) {
				this.addItem(model);
			}, this);
			
			
			return this;
		},
		
		
		renderComplete: function() {
			this._initIsotope();
		},
		
		
        addItem: function(model) {
            var item = new ArtistAlbumsListItemView({
		        model: model,
		        parent: this
		    });
            
		    this.$el.append(item.render().$el);
        },
        
        _initIsotope: function() {
            $('ol.albums-list').css({
            	height: '100%',
				width: $('ol.albums-list').width()
			});
            
            $('ol.albums-list').isotope({
                itemSelector : '.ui-draggable',
				layoutMode: 'perfectMasonry',
				
				perfectMasonry: {
				    layout: 'horizontal',      // Set layout as vertical/horizontal (default: vertical)
				    columnWidth: 200,        // Set/prefer specific column width (liquid layout tries to prefer said width)
				    rowHeight: 200,          // Set/prefer specific row height (liquid layout tries to prefer said height)
				    liquid: true
				},
				getSortData: {
					year: function(el) {
						return el.find('.year').text();
					},
					countSongs: function(el) {
						return el.find('.count_songs').text();
					}
				},
				sortBy: 'year',
				sortAscending: false
            });
            
            $(window).resize(this._onResize.bind(this));
            $('#artist-page').mousewheel(this._onMouseWheel);
        },
        
        
        _onMouseWheel: function(e, delta) {
        	this.scrollLeft -= (delta * 60);
        	e.preventDefault();
        },
        
        
		_onResize: function() {
        	var self = this;
			setTimeout(function() {
        		self.$el.isotope('reLayout');
        	}, 320);
        },
        
        
        destruct: function() {
        	this.$el.isotope('destroy');
        	$(window).off('resize', this._onResize.bind(this));
        },
        
        
        getPlayer: function() {
        	return this.parent.Player;
        }
	});
	
	return ArtistAlbumsListView;
});