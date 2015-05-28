define([
	'jquery',
	'backbone',
	'views/index/index_list_item',
	'isotope',
	'jQueryMouseWheel',
	'infiniteScroll'
], function($, Backbone, IndexListItemView) {
	var IndexListView = Backbone.View.extend({
		page: 1,
		perPage: 5,
		
		tagName: 'ol',
        className: 'index-list',
		
		model: null,
        
		initialize: function(options) {
			console.log('controllers/IndexListView::initialize()');
			_.extend(this, options);
		},
        
        
		render: function () {
			console.log('controllers/IndexListView::render()');
			
			this.renderItems();
			
			return this;
		},
		
		
		renderItems: function(callback) {
			var itemHTML = '';
			
			_.each(this.model.collections, function(collectionData, namespace) {
				for (var i = ((this.page-1) * this.perPage), len = this.page * this.perPage; i < len; i++) {
					if ('undefined' !== typeof(collectionData.models[i])) { // verify something is there..
						itemHTML = this.addItem(collectionData.models[i], namespace);
						
						if ('function' === typeof(callback)) {
							callback(itemHTML);
						}
					}
				}
			}, this);
		},
		
		
		renderComplete: function() {
			this._initIsotope();
		},
		
		
        addItem: function(model, namespace) {
        	//swtich between item templates.
            var item = new IndexListItemView({
		        model: model,
		        itemType: namespace.split('_')[0],
		        itemCategory: namespace.split('_')[1],
		        namespace: namespace,
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
				},
				
				getSortData: {
					date: function(el) {
						var dateStr = el.data('date');
							dateBits = [];
						
						dateBits = dateStr.split('-');
						
						return new Date(dateBits[0], dateBits[1], dateBits[2]);
					}
				},
				
				sortBy: 'date'
            });
            
            $(window).resize(this._onResize.bind(this));
            $('#index-page').mousewheel(this._onMouseWheel);
            $('#index-page').scroll(this._onScroll.bind(this));
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
        	$('#index-page').off('scroll', this._onScroll.bind(this));
        }
        
	});
	
	return IndexListView;
});