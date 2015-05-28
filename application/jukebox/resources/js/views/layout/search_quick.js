define([
	'jquery',
	'backbone',
	'collections/search_quick',
	'views/layout/search_quick_item',
	'views/layout/search_quick_heading',
	'text!templates/layout/nav_search_quick.html',
	'views/layout/player'
], function($, Backbone, SearchQuickCollection, QuickSearchItem, QuickSearchHeading, searchQuickTemplate, PlayerView){
	var SearchQuickController = Backbone.View.extend({
		searchContainer: '#searchQuick',
		tagName: 'ul',
		className: 'autocomplete drag-container',
		itemView: QuickSearchItem,
		itemHeadingView: QuickSearchHeading,
		inputField: '#searchQuick input[type="text"]',
		searchCollection: new SearchQuickCollection(),
		player: new PlayerView(),
		
		delay: 300,
		minLength: 2,
		currentQuery: '',
		
		lastAddedNamespace: null,
		
		
		initialize: function(options) {
			_.extend(this, options);
			this.filter = _.debounce(this.filter, this.delay);
			_.bindAll(this, 'hide');
		},
		
		
		render: function () {
			var self = this;
			console.log("controllers/SearchQuickController::render()");
			$(this.searchContainer).html(_.template(searchQuickTemplate));
			
			this.getInput()
				.keyup(this.keyup.bind(this))
				.keydown(this.keydown.bind(this));
			
			$(this.$el).appendTo(this.searchContainer);
			
			this.getInput().on('click', function(e) {
				e.stopPropagation();
			});
			
			this.getInput().focus(function() { 
				self.show();
			});
			
			// prevents the menu from closing due to the global listener on the body closing it.
			$(this.$el).on('click', function(e) {
				e.stopPropagation();
			});
		},
		
		
		keydown: function(e) {
			if (e.keyCode == 38) return this.move(-1);
			if (e.keyCode == 40) return this.move(+1);
			if (e.keyCode == 13) return this.onEnter();
			if (e.keyCode == 27) return this.hide();
		},
		
		
		keyup: function(e) {
		    var keyword = this.getInput().val();
		    if (this.isChanged(keyword)) {
		        if (this.isValid(keyword)) {
		            this.filter(keyword);
		        } else {
		            this.hide();
		        }
		    }
		},
		
		
		filter: function (keyword) {
			var keyword = keyword.toLowerCase();
			
	        this.searchCollection
				.setQuery(keyword)
				.fetch({
		            success: function () {
		                this.loadResult(this.searchCollection, keyword);
						
						//init search draggable option.
						$('.autocomplete')
		                    .find('.item-wrapper')
		                    .draggable({
		                        cursorAt: {
		                            left: 0,
		                            top: 0
		                        },
		                        
								appendTo: document.body,
		                        containment: 'window',
		                        tolerance: 'pointer',
		                        zIndex: '200',
		                        
		                        helper: this.player.getViewDragHelper(), // Custom UI object of the draggable tooltip
		                        connectToSortable: $('#queueList')
		                    });
		                    
		            }.bind(this)
		        });
		},
		
		
		isValid: function (keyword) {
		    return keyword.length > this.minLength;
		},
		
		
		isChanged: function (keyword) {
		    return this.currentQuery != keyword;
		},
		
		
		move: function (position) {
		    var current = this.$el.children('.active'),
		        siblings = this.$el.children(),
		        index = current.index() + position;
			
		    if (siblings.eq(index).length) {
		        current.removeClass('active');
		        siblings.eq(index).addClass('active');
		    }
		    
		    return false;
		},
		
		
		onEnter: function () {
		    this.$el.children('.active').click();
		    return false;
		},
		
		
		loadResult: function (collections, keyword) {
		    var collectionsList = {
					artists: collections.artists,
					albums: collections.albums,
					songs: collections.songs
		    	}, 
				isNotEmpty = false;
		    
			this.currentQuery = keyword;
		    this.reset();
		    
			_.each(collectionsList, function(collection, namespace) {
				if (0 < collectionsList[namespace].length && isNotEmpty === false)
					isNotEmpty = true;
				
				_.each(collectionsList[namespace].models, function(model, key) {
					this.addItem(model, namespace);
				}, this);
    		}, this);
			
    		if (isNotEmpty) {
		        this.show();
		    } else {
		        this.hide();
		    }
		},
		
		
		addItem: function (model, namespace) {
			if (this.lastAddedNamespace !== namespace) {
				this.lastAddedNamespace = namespace;
				
			    this.$el.append(new this.itemHeadingView({
			        parent: this,
			        namespace: namespace
			    }).render().$el);
			}
			
		    this.$el.append(new this.itemView({
		        model: model.toJSON(),
		        parent: this,
		        namespace: namespace
		    }).render().$el);
		    
		    
		},
		
		
		select: function (model) {
		    var label = model.name;
		    this.getInput().val(label);
		    this.currentQuery = label;
		    this.onSelect(model);
		},
		
		
		reset: function () {
		    this.$el.empty();
		    return this;
		},
		
		
		hide: function () {
		    var self = this;
			this.$el.fadeOut('fast');
		    
			$('body').off('click', this.hide);
			
		    return this;
		},
		
		
		show: function () {
			if (0 >= $(this.$el).find('li').size()) return;
			
			var self = this;
		    this.$el.fadeIn('fast');
		    
		    $('body').on('click', this.hide);
		    
		    return this;
		},
		
		
		// callback definitions
		onSelect: function () {},
		
		
		getInput: function() {
			return $(this.inputField);
		}
	});
	
	return SearchQuickController;
});