define([
	'jquery',
	'backbone',
	'views/artists/artists_list_item',
	'isotope',
	'jQueryMouseWheel',
	'infiniteScroll'
], function($, Backbone, ArtistsListItemView) {
	var ArtistsListView = Backbone.View.extend({
		page: 1,
		perPage: 15,
		
		tagName: 'ol',
        className: 'artists-list',
		
		model: null,
        
		initialize: function(options) {
			console.log('controllers/ArtistsListView::initialize()');
			_.extend(this, options);
		},
        
        
		render: function () {
			console.log('controllers/ArtistsListView::render()');
			
			for (var i = 0, len = this.model.models.length; i < (this.page * this.perPage); i++) {
				this.addItem(this.model.models[i]);
			}
			
			this.renderItems();
			
			return this;
		},
		
		
		renderItems: function(callback) {
			var itemHTML = '';

			for (var i = ((this.page-1) * this.perPage), len = this.page * this.perPage; i < len; i++) {
				if ('undefined' !== typeof(this.model.models[i])) { // verify something is there..
					itemHTML = this.addItem(this.model.models[i]);
					
					if ('function' === typeof(callback)) {
						callback(itemHTML);
					}
				}
			}
		},
		
		
		renderComplete: function() {
			this._initIsotope();
		},
		
		
        addItem: function(model) {
            var item = new ArtistsListItemView({
		        model: model,
		        parent: this
		    }),
			html = '';
            
            html = item.render().$el;
		    this.$el.append(html);
		    
		    return html;
        },
        
        
        appendNextPage: function() {
			var self = this;
			this.page += 1; 
			
			this.renderItems(function(itemHTML) {
				self.$el.isotope('appended', $(itemHTML));
			});
        },
        
        getPlayer: function() {
        	return this.parent.Player;
        },
        
        
        _initIsotope: function() {
			this.$el.css({
            	height: '100%',
				width: this.$el.width()
			});
            
            this.$el.isotope({
                itemSelector : '.ui-isotope',
				layoutMode: 'perfectMasonry',
				
				perfectMasonry: {
				    layout: 'horizontal',      // Set layout as vertical/horizontal (default: vertical)
				    columnWidth: 200,        // Set/prefer specific column width (liquid layout tries to prefer said width)
				    rowHeight: 200,          // Set/prefer specific row height (liquid layout tries to prefer said height)
				    liquid: true
				}
            });
            
            $(window).resize(this._onResize.bind(this));
            $('#artists-page').mousewheel(this._onMouseWheel);
            $('#artists-page').scroll(this._onScroll.bind(this));
        },
        
        
        _onMouseWheel: function(e, delta) {
        	this.scrollLeft -= (delta * 60);
        	e.preventDefault();
        },
        
        
        _onScroll: function(e) {
        	var triggerPoint = 100, // 100 px from right side.
				el = e.target;
        	
        	if (el.scrollLeft + el.clientWidth + triggerPoint > el.scrollWidth) {
				this.appendNextPage();
        		this._onResize();
        	}
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
        	$('#artists-page').off('scroll', this._onScroll.bind(this));
        }
        
	});
	
	return ArtistsListView;
});