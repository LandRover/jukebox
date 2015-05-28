/**
 * Isotope v1.5.26
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://isotope.metafizzy.co/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright 2014 Metafizzy
 */
!function(t,i){"use strict";var s,e=t.document,n=e.documentElement,o=t.Modernizr,r=function(t){return t.charAt(0).toUpperCase()+t.slice(1)},a="Moz Webkit O Ms".split(" "),h=function(t){var i,s=n.style;if("string"==typeof s[t])return t;t=r(t);for(var e=0,o=a.length;o>e;e++)if(i=a[e]+t,"string"==typeof s[i])return i},l=h("transform"),u=h("transitionProperty"),c={csstransforms:function(){return!!l},csstransforms3d:function(){var t=!!h("perspective");if(t&&"webkitPerspective"in n.style){var s=i("<style>@media (transform-3d),(-webkit-transform-3d){#modernizr{height:3px}}</style>").appendTo("head"),e=i('<div id="modernizr" />').appendTo("html");t=3===e.height(),e.remove(),s.remove()}return t},csstransitions:function(){return!!u}};if(o)for(s in c)o.hasOwnProperty(s)||o.addTest(s,c[s]);else{o=t.Modernizr={_version:"1.6ish: miniModernizr for Isotope"};var d,f=" ";for(s in c)d=c[s](),o[s]=d,f+=" "+(d?"":"no-")+s;i("html").addClass(f)}if(o.csstransforms){var m=o.csstransforms3d?{translate:function(t){return"translate3d("+t[0]+"px, "+t[1]+"px, 0) "},scale:function(t){return"scale3d("+t+", "+t+", 1) "}}:{translate:function(t){return"translate("+t[0]+"px, "+t[1]+"px) "},scale:function(t){return"scale("+t+") "}},p=function(t,s,e){var n,o,r=i.data(t,"isoTransform")||{},a={},h={};a[s]=e,i.extend(r,a);for(n in r)o=r[n],h[n]=m[n](o);var u=h.translate||"",c=h.scale||"",d=u+c;i.data(t,"isoTransform",r),t.style[l]=d};i.cssNumber.scale=!0,i.cssHooks.scale={set:function(t,i){p(t,"scale",i)},get:function(t){var s=i.data(t,"isoTransform");return s&&s.scale?s.scale:1}},i.fx.step.scale=function(t){i.cssHooks.scale.set(t.elem,t.now+t.unit)},i.cssNumber.translate=!0,i.cssHooks.translate={set:function(t,i){p(t,"translate",i)},get:function(t){var s=i.data(t,"isoTransform");return s&&s.translate?s.translate:[0,0]}}}var y,g;o.csstransitions&&(y={WebkitTransitionProperty:"webkitTransitionEnd",MozTransitionProperty:"transitionend",OTransitionProperty:"oTransitionEnd otransitionend",transitionProperty:"transitionend"}[u],g=h("transitionDuration"));var v,_=i.event,A=i.event.handle?"handle":"dispatch";_.special.smartresize={setup:function(){i(this).bind("resize",_.special.smartresize.handler)},teardown:function(){i(this).unbind("resize",_.special.smartresize.handler)},handler:function(t,i){var s=this,e=arguments;t.type="smartresize",v&&clearTimeout(v),v=setTimeout(function(){_[A].apply(s,e)},"execAsap"===i?0:100)}},i.fn.smartresize=function(t){return t?this.bind("smartresize",t):this.trigger("smartresize",["execAsap"])},i.Isotope=function(t,s,e){this.element=i(s),this._create(t),this._init(e)};var w=["width","height"],C=i(t);i.Isotope.settings={resizable:!0,layoutMode:"masonry",containerClass:"isotope",itemClass:"isotope-item",hiddenClass:"isotope-hidden",hiddenStyle:{opacity:0,scale:.001},visibleStyle:{opacity:1,scale:1},containerStyle:{position:"relative",overflow:"hidden"},animationEngine:"best-available",animationOptions:{queue:!1,duration:800},sortBy:"original-order",sortAscending:!0,resizesContainer:!0,transformsEnabled:!0,itemPositionDataEnabled:!1},i.Isotope.prototype={_create:function(t){this.options=i.extend({},i.Isotope.settings,t),this.styleQueue=[],this.elemCount=0;var s=this.element[0].style;this.originalStyle={};var e=w.slice(0);for(var n in this.options.containerStyle)e.push(n);for(var o=0,r=e.length;r>o;o++)n=e[o],this.originalStyle[n]=s[n]||"";this.element.css(this.options.containerStyle),this._updateAnimationEngine(),this._updateUsingTransforms();var a={"original-order":function(t,i){return i.elemCount++,i.elemCount},random:function(){return Math.random()}};this.options.getSortData=i.extend(this.options.getSortData,a),this.reloadItems(),this.offset={left:parseInt(this.element.css("padding-left")||0,10),top:parseInt(this.element.css("padding-top")||0,10)};var h=this;setTimeout(function(){h.element.addClass(h.options.containerClass)},0),this.options.resizable&&C.bind("smartresize.isotope",function(){h.resize()}),this.element.delegate("."+this.options.hiddenClass,"click",function(){return!1})},_getAtoms:function(t){var i=this.options.itemSelector,s=i?t.filter(i).add(t.find(i)):t,e={position:"absolute"};return s=s.filter(function(t,i){return 1===i.nodeType}),this.usingTransforms&&(e.left=0,e.top=0),s.css(e).addClass(this.options.itemClass),this.updateSortData(s,!0),s},_init:function(t){this.$filteredAtoms=this._filter(this.$allAtoms),this._sort(),this.reLayout(t)},option:function(t){if(i.isPlainObject(t)){this.options=i.extend(!0,this.options,t);var s;for(var e in t)s="_update"+r(e),this[s]&&this[s]()}},_updateAnimationEngine:function(){var t,i=this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,"");switch(i){case"css":case"none":t=!1;break;case"jquery":t=!0;break;default:t=!o.csstransitions}this.isUsingJQueryAnimation=t,this._updateUsingTransforms()},_updateTransformsEnabled:function(){this._updateUsingTransforms()},_updateUsingTransforms:function(){var t=this.usingTransforms=this.options.transformsEnabled&&o.csstransforms&&o.csstransitions&&!this.isUsingJQueryAnimation;t||(delete this.options.hiddenStyle.scale,delete this.options.visibleStyle.scale),this.getPositionStyles=t?this._translate:this._positionAbs},_filter:function(t){var i=""===this.options.filter?"*":this.options.filter;if(!i)return t;var s=this.options.hiddenClass,e="."+s,n=t.filter(e),o=n;if("*"!==i){o=n.filter(i);var r=t.not(e).not(i).addClass(s);this.styleQueue.push({$el:r,style:this.options.hiddenStyle})}return this.styleQueue.push({$el:o,style:this.options.visibleStyle}),o.removeClass(s),t.filter(i)},updateSortData:function(t,s){var e,n,o=this,r=this.options.getSortData;t.each(function(){e=i(this),n={};for(var t in r)n[t]=s||"original-order"!==t?r[t](e,o):i.data(this,"isotope-sort-data")[t];i.data(this,"isotope-sort-data",n)})},_sort:function(){var t=this.options.sortBy,i=this._getSorter,s=this.options.sortAscending?1:-1,e=function(e,n){var o=i(e,t),r=i(n,t);return o===r&&"original-order"!==t&&(o=i(e,"original-order"),r=i(n,"original-order")),(o>r?1:r>o?-1:0)*s};this.$filteredAtoms.sort(e)},_getSorter:function(t,s){return i.data(t,"isotope-sort-data")[s]},_translate:function(t,i){return{translate:[t,i]}},_positionAbs:function(t,i){return{left:t,top:i}},_pushPosition:function(t,i,s){i=Math.round(i+this.offset.left),s=Math.round(s+this.offset.top);var e=this.getPositionStyles(i,s);this.styleQueue.push({$el:t,style:e}),this.options.itemPositionDataEnabled&&t.data("isotope-item-position",{x:i,y:s})},layout:function(t,i){var s=this.options.layoutMode;if(this["_"+s+"Layout"](t),this.options.resizesContainer){var e=this["_"+s+"GetContainerSize"]();this.styleQueue.push({$el:this.element,style:e})}this._processStyleQueue(t,i),this.isLaidOut=!0},_processStyleQueue:function(t,s){var e,n,r,a,h=this.isLaidOut?this.isUsingJQueryAnimation?"animate":"css":"css",l=this.options.animationOptions,u=this.options.onLayout;if(n=function(t,i){i.$el[h](i.style,l)},this._isInserting&&this.isUsingJQueryAnimation)n=function(t,i){e=i.$el.hasClass("no-transition")?"css":h,i.$el[e](i.style,l)};else if(s||u||l.complete){var c=!1,d=[s,u,l.complete],f=this;if(r=!0,a=function(){if(!c){for(var i,s=0,e=d.length;e>s;s++)i=d[s],"function"==typeof i&&i.call(f.element,t,f);c=!0}},this.isUsingJQueryAnimation&&"animate"===h)l.complete=a,r=!1;else if(o.csstransitions){for(var m,p=0,v=this.styleQueue[0],_=v&&v.$el;!_||!_.length;){if(m=this.styleQueue[p++],!m)return;_=m.$el}var A=parseFloat(getComputedStyle(_[0])[g]);A>0&&(n=function(t,i){i.$el[h](i.style,l).one(y,a)},r=!1)}}i.each(this.styleQueue,n),r&&a(),this.styleQueue=[]},resize:function(){this["_"+this.options.layoutMode+"ResizeChanged"]()&&this.reLayout()},reLayout:function(t){this["_"+this.options.layoutMode+"Reset"](),this.layout(this.$filteredAtoms,t)},addItems:function(t,i){var s=this._getAtoms(t);this.$allAtoms=this.$allAtoms.add(s),i&&i(s)},insert:function(t,i){this.element.append(t);var s=this;this.addItems(t,function(t){var e=s._filter(t);s._addHideAppended(e),s._sort(),s.reLayout(),s._revealAppended(e,i)})},appended:function(t,i){var s=this;this.addItems(t,function(t){s._addHideAppended(t),s.layout(t),s._revealAppended(t,i)})},_addHideAppended:function(t){this.$filteredAtoms=this.$filteredAtoms.add(t),t.addClass("no-transition"),this._isInserting=!0,this.styleQueue.push({$el:t,style:this.options.hiddenStyle})},_revealAppended:function(t,i){var s=this;setTimeout(function(){t.removeClass("no-transition"),s.styleQueue.push({$el:t,style:s.options.visibleStyle}),s._isInserting=!1,s._processStyleQueue(t,i)},10)},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children())},remove:function(t,i){this.$allAtoms=this.$allAtoms.not(t),this.$filteredAtoms=this.$filteredAtoms.not(t);var s=this,e=function(){t.remove(),i&&i.call(s.element)};t.filter(":not(."+this.options.hiddenClass+")").length?(this.styleQueue.push({$el:t,style:this.options.hiddenStyle}),this._sort(),this.reLayout(e)):e()},shuffle:function(t){this.updateSortData(this.$allAtoms),this.options.sortBy="random",this._sort(),this.reLayout(t)},destroy:function(){var t=this.usingTransforms,i=this.options;this.$allAtoms.removeClass(i.hiddenClass+" "+i.itemClass).each(function(){var i=this.style;i.position="",i.top="",i.left="",i.opacity="",t&&(i[l]="")});var s=this.element[0].style;for(var e in this.originalStyle)s[e]=this.originalStyle[e];this.element.unbind(".isotope").undelegate("."+i.hiddenClass,"click").removeClass(i.containerClass).removeData("isotope"),C.unbind(".isotope")},_getSegments:function(t){var i,s=this.options.layoutMode,e=t?"rowHeight":"columnWidth",n=t?"height":"width",o=t?"rows":"cols",a=this.element[n](),h=this.options[s]&&this.options[s][e]||this.$filteredAtoms["outer"+r(n)](!0)||a;i=Math.floor(a/h),i=Math.max(i,1),this[s][o]=i,this[s][e]=h},_checkIfSegmentsChanged:function(t){var i=this.options.layoutMode,s=t?"rows":"cols",e=this[i][s];return this._getSegments(t),this[i][s]!==e},_masonryReset:function(){this.masonry={},this._getSegments();var t=this.masonry.cols;for(this.masonry.colYs=[];t--;)this.masonry.colYs.push(0)},_masonryLayout:function(t){var s=this,e=s.masonry;t.each(function(){var t=i(this),n=Math.ceil(t.outerWidth(!0)/e.columnWidth);if(n=Math.min(n,e.cols),1===n)s._masonryPlaceBrick(t,e.colYs);else{var o,r,a=e.cols+1-n,h=[];for(r=0;a>r;r++)o=e.colYs.slice(r,r+n),h[r]=Math.max.apply(Math,o);s._masonryPlaceBrick(t,h)}})},_masonryPlaceBrick:function(t,i){for(var s=Math.min.apply(Math,i),e=0,n=0,o=i.length;o>n;n++)if(i[n]===s){e=n;break}var r=this.masonry.columnWidth*e,a=s;this._pushPosition(t,r,a);var h=s+t.outerHeight(!0),l=this.masonry.cols+1-o;for(n=0;l>n;n++)this.masonry.colYs[e+n]=h},_masonryGetContainerSize:function(){var t=Math.max.apply(Math,this.masonry.colYs);return{height:t}},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged()},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0}},_fitRowsLayout:function(t){var s=this,e=this.element.width(),n=this.fitRows;t.each(function(){var t=i(this),o=t.outerWidth(!0),r=t.outerHeight(!0);0!==n.x&&o+n.x>e&&(n.x=0,n.y=n.height),s._pushPosition(t,n.x,n.y),n.height=Math.max(n.y+r,n.height),n.x+=o})},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height}},_fitRowsResizeChanged:function(){return!0},_cellsByRowReset:function(){this.cellsByRow={index:0},this._getSegments(),this._getSegments(!0)},_cellsByRowLayout:function(t){var s=this,e=this.cellsByRow;t.each(function(){var t=i(this),n=e.index%e.cols,o=Math.floor(e.index/e.cols),r=(n+.5)*e.columnWidth-t.outerWidth(!0)/2,a=(o+.5)*e.rowHeight-t.outerHeight(!0)/2;s._pushPosition(t,r,a),e.index++})},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top}},_cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged()},_straightDownReset:function(){this.straightDown={y:0}},_straightDownLayout:function(t){var s=this;t.each(function(){var t=i(this);s._pushPosition(t,0,s.straightDown.y),s.straightDown.y+=t.outerHeight(!0)})},_straightDownGetContainerSize:function(){return{height:this.straightDown.y}},_straightDownResizeChanged:function(){return!0},_masonryHorizontalReset:function(){this.masonryHorizontal={},this._getSegments(!0);var t=this.masonryHorizontal.rows;for(this.masonryHorizontal.rowXs=[];t--;)this.masonryHorizontal.rowXs.push(0)},_masonryHorizontalLayout:function(t){var s=this,e=s.masonryHorizontal;t.each(function(){var t=i(this),n=Math.ceil(t.outerHeight(!0)/e.rowHeight);if(n=Math.min(n,e.rows),1===n)s._masonryHorizontalPlaceBrick(t,e.rowXs);else{var o,r,a=e.rows+1-n,h=[];for(r=0;a>r;r++)o=e.rowXs.slice(r,r+n),h[r]=Math.max.apply(Math,o);s._masonryHorizontalPlaceBrick(t,h)}})},_masonryHorizontalPlaceBrick:function(t,i){for(var s=Math.min.apply(Math,i),e=0,n=0,o=i.length;o>n;n++)if(i[n]===s){e=n;break}var r=s,a=this.masonryHorizontal.rowHeight*e;this._pushPosition(t,r,a);var h=s+t.outerWidth(!0),l=this.masonryHorizontal.rows+1-o;for(n=0;l>n;n++)this.masonryHorizontal.rowXs[e+n]=h},_masonryHorizontalGetContainerSize:function(){var t=Math.max.apply(Math,this.masonryHorizontal.rowXs);return{width:t}},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0}},_fitColumnsLayout:function(t){var s=this,e=this.element.height(),n=this.fitColumns;t.each(function(){var t=i(this),o=t.outerWidth(!0),r=t.outerHeight(!0);0!==n.y&&r+n.y>e&&(n.x=n.width,n.y=0),s._pushPosition(t,n.x,n.y),n.width=Math.max(n.x+o,n.width),n.y+=r})},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width}},_fitColumnsResizeChanged:function(){return!0},_cellsByColumnReset:function(){this.cellsByColumn={index:0},this._getSegments(),this._getSegments(!0)},_cellsByColumnLayout:function(t){var s=this,e=this.cellsByColumn;t.each(function(){var t=i(this),n=Math.floor(e.index/e.rows),o=e.index%e.rows,r=(n+.5)*e.columnWidth-t.outerWidth(!0)/2,a=(o+.5)*e.rowHeight-t.outerHeight(!0)/2;s._pushPosition(t,r,a),e.index++})},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth}},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_straightAcrossReset:function(){this.straightAcross={x:0}},_straightAcrossLayout:function(t){var s=this;t.each(function(){var t=i(this);s._pushPosition(t,s.straightAcross.x,0),s.straightAcross.x+=t.outerWidth(!0)})},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x}},_straightAcrossResizeChanged:function(){return!0}},i.fn.imagesLoaded=function(t){function s(){t.call(n,o)}function e(t){var n=t.target;n.src!==a&&-1===i.inArray(n,h)&&(h.push(n),--r<=0&&(setTimeout(s),o.unbind(".imagesLoaded",e)))}var n=this,o=n.find("img").add(n.filter("img")),r=o.length,a="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",h=[];return r||s(),o.bind("load.imagesLoaded error.imagesLoaded",e).each(function(){var t=this.src;this.src=a,this.src=t}),n};var z=function(i){t.console&&t.console.error(i)};i.fn.isotope=function(t,s){if("string"==typeof t){var e=Array.prototype.slice.call(arguments,1);this.each(function(){var s=i.data(this,"isotope");return s?i.isFunction(s[t])&&"_"!==t.charAt(0)?void s[t].apply(s,e):void z("no such method '"+t+"' for isotope instance"):void z("cannot call methods on isotope prior to initialization; attempted to call method '"+t+"'")})}else this.each(function(){var e=i.data(this,"isotope");e?(e.option(t),e._init(s)):i.data(this,"isotope",new i.Isotope(t,this,s))});return this}}(window,jQuery);

/*!
 * PerfectMasonry extension for Isotope
 *
 * Does similar things as the Isotopes "masonry" layoutmode, except that this one will actually go back and plug the holes
 * left by bigger elements, thus making a perfect brick wall. Profit!
 * 
 * Usage:
 * 	$('#grid').isotope({
 * 		layoutMode: 'perfectMasonry',
 *		perfectMasonry: {
 *			layout: 'horizontal',		// Set layout as vertical/horizontal (default: vertical)
 *			columnWidth: 200,			// Set/Prefer columns to x wide (default: width of first tile)
 *			rowHeight: 200,				// Set/Prefer rows to y high (default: height of first tile)
 * 
 *			liquid: true,				// Set layout as liquid (default: false)
 *			cols: 3,					// Force to have x columns (default: null)
 *			rows: 3,					// Force to have y rows (default: null)
 *			minCols: 3,					// Set min col count (default: 1)
 *			minRows: 3,					// Set min row count (default: 1)
 *			maxCols: 5,					// Set max col count (default: 9999)
 *			maxRows: 4					// Set max row count (default: 9999)
 * 		}
 * 	});
 *
 * 
 * @author Mikko Tikkanen, Zonear Ltd. <contact@zonear.com>
 */
;(function($, undefined) {
	var version = '1.2.1';
	var isotope = null,
		$context = null,
		$container = null;
	
	$.extend($.Isotope.prototype, {
		isFirstRun: true,

		/**
		 * Reset layout properties
		 *
		 * Runs before any layout change
		 * -------------------------------------------------------------------------------------------------------- */
		_perfectMasonryReset: function() {
			this.options.perfectMasonry = this.options.perfectMasonry|| {};
			var isVertical = this.options.perfectMasonry.layout != 'horizontal',
				isLiquid = this.options.perfectMasonry.liquid == true;
			
			// Do things on a first run
			if(this.isFirstRun) {
				this.isFirstRun = false;
				isotope = this;
				$context = $(this.element.context);
				$container = $context.parent();
				
				// Make sure we have min/maxCols & rows
				this.options.perfectMasonry.minCols = this.options.perfectMasonry.minCols || 1; 
				this.options.perfectMasonry.minRows = this.options.perfectMasonry.minRows || 1;
				this.options.perfectMasonry.maxCols = this.options.perfectMasonry.maxCols || 9999; 
				this.options.perfectMasonry.maxRows = this.options.perfectMasonry.maxRows || 9999;
			}
			
			// For liquid layout, replace default resize handler with forced relayout (outside firstRun as Isotope grid can be destroyed and created on the fly)
			if(isLiquid && $.data(window, 'events') && $._data(window, 'events').smartresize) {
				$(window).off('smartresize.isotope');
				$(window).on('resize.isotope.perfectmasonry', function() {
					if(!$context.hasClass('isotope')) { return; }
					$context.isotope('reLayout');
				});
			}
			
			// Setup layout properties ---------------------------------------------------
			var properties = this.perfectMasonry = {};
			
			// Fill properties with columnWidth and rowHeight (true argument)
			this._getSegments();
      		this._getSegments(true);
      		
      		// ...and with cols & rows
			this._perfectMasonryGetSegments();
      		
			// Handle liquid layout (cols, rows & sizes must be calculated on the fly)
			if(isLiquid) {
				var width = $container.width(),
					height = $container.height();
					
				// Make sure we have colwidth & rowheight (get it from the calculated )
				this.options.perfectMasonry.columnWidth = this.options.perfectMasonry.columnWidth || properties.columnWidth;
				this.options.perfectMasonry.rowHeight = this.options.perfectMasonry.rowHeight || properties.rowHeight;
				
				// Figure out how many cols & rows either have been set or can be fit into the container (also make sure we're still between min/max)
				properties.cols = this.options.perfectMasonry.cols || Math.floor(width / this.options.perfectMasonry.columnWidth);
				properties.rows = this.options.perfectMasonry.rows || Math.floor(height / this.options.perfectMasonry.rowHeight);
				properties.cols = Math.min(Math.max(properties.cols, this.options.perfectMasonry.minCols), this.options.perfectMasonry.maxCols);
				properties.rows = Math.min(Math.max(properties.rows, this.options.perfectMasonry.minRows), this.options.perfectMasonry.maxRows);
								
				// Recalculate accurate width/height so that the whole available space is used
				var diff = (isVertical ? properties.columnWidth / (width / properties.cols) : properties.rowHeight / (height / properties.rows));
				properties.columnWidth = Math.floor(properties.columnWidth / diff);
				properties.rowHeight = Math.floor(properties.rowHeight / diff);
			}
			
			// Create top row of the grid
			properties.grid = new Array(this.perfectMasonry.cols);

			// Set container dimensions to 0
			properties.containerHeight = 0;
			properties.containerWidth = 0;
	    },



	    /**
		 * Create layout
		 * -------------------------------------------------------------------------------------------------------- */
		_perfectMasonryLayout: function($elems) {
			var instance = this,
				properties = this.perfectMasonry,
				isVertical = instance.options.perfectMasonry.layout != 'horizontal',
				isLiquid = instance.options.perfectMasonry.liquid == true;
			
			// Create first set of the grid
			properties.grid = new Array(properties[(isVertical ? 'cols' : 'rows')]);
			if(!properties.grid || !properties.grid.length) { return; }
			
			// Loop each element
			$elems.each(function() {
				var $this  = $(this);
				
				// Calculate col & row spans (with liquid layouts, store desired width as element data)
				var colSpan = (isLiquid ? $this.data('colSpan') : Math.ceil($this.outerWidth() / (properties.columnWidth + 1))),
					rowSpan = (isLiquid ? $this.data('rowSpan') : Math.ceil($this.outerHeight() / (properties.rowHeight + 1)));
				
				// For the first run with liquid layout, calculate sizes
				if(!colSpan) {
					colSpan = Math.ceil($this.outerWidth(true) / (properties.columnWidth + 1));
					rowSpan = Math.ceil($this.outerHeight(true) / (properties.rowHeight + 1));
					$this.data('colSpan', colSpan);
					$this.data('rowSpan', rowSpan);
				}
				
				
				/* Do the layout
				 * -------------------------------------------------------------------------------- */
				
				// Set spans
				var aSpan = (isVertical ? colSpan : rowSpan);
				var bSpan = (isVertical ? rowSpan : colSpan);
				
				// Bigger tiles can't fit into the last primary (though keep it still at least as 1)
				var max = Math.max((isVertical ? properties.cols - colSpan : properties.rows - rowSpan) + 1, 1);
								
				// Loop through/create primaries (set hard limit of 10.000 to prevent endless loop)
				var a = -1, x = 0, y = 0;
				while(++a < 10000) {
					properties.grid[a] = properties.grid[a] || [];
					
					// Go through the secondaries in the primary, set secondary and tile
					for (var b = 0; b < max; b++) {
						var tile = properties.grid[a][b];
							
						// If the tile is not free, move to the next one immediately
						if(tile) { continue; }

						// Tiles spanning to multiple rows/columns - Check if it'll fit
						var doesFit = true;
						if(colSpan > 1 || rowSpan > 1) {
							for (var i = 0; i < aSpan; i++) {
								for (var j = 0; j < bSpan; j++) {
									properties.grid[a+j] = properties.grid[a+j] || [];
									if(properties.grid[a+j][b+i]) { doesFit = false; break; }
								}

								// If it doesn't fit, don't waste our time looping
								if(!doesFit) { break; }
							}
						}
						if(!doesFit) { continue }
						

						// Set all the cells as occupied
						for (var i = 0; i < aSpan; i++) {
							for (var j = 0; j < bSpan; j++) {
								properties.grid[a+j][b+i] = true;
							}
						}
						
						// Set x & y values
						var x = a, y = b;
						if(isVertical) { var x = b, y = a; }
						
						// Update container dimensions
						properties.containerWidth = Math.max(properties.containerWidth, (x + aSpan) * properties.columnWidth);
						properties.containerHeight = Math.max(properties.containerHeight, (y + bSpan) * properties.rowHeight);
						
						// In case of liquid layout, set element size full width/height
						if(instance.options.perfectMasonry.liquid == true) {
							$this.css({
								width: properties.columnWidth * colSpan,
								height: properties.rowHeight * rowSpan
							});
						}

						// Set the element location and GTFO
						instance._pushPosition($this, x*properties.columnWidth, y*properties.rowHeight);
						return;
					}
				}
				

				// If we got all the way down to here, the element doesn't fit - Hide it
				instance._pushPosition($this, -9999, -9999);
			});
			
			// Set row & column count to container
			var rows = (isVertical ? properties.grid.length : properties.grid[0] && properties.grid[0].length),
				cols = (isVertical ? properties.grid[0] && properties.grid[0].length : properties.grid.length);
			$(this.element.context).attr('data-isotope-rows', rows).attr('data-isotope-cols', cols);
		},
		
		
		
	    /**
		 * Get container size
		 *
		 * For resizing the container
		 * -------------------------------------------------------------------------------------------------------- */
	    _perfectMasonryGetContainerSize: function() {
			return {
				width: this.perfectMasonry.containerWidth,
				height: this.perfectMasonry.containerHeight
			};
	    },
		
		
		
	    /**
		 * Resize changed
		 *
		 * Figure out if layout changed
		 * -------------------------------------------------------------------------------------------------------- */
	    _perfectMasonryResizeChanged: function() {
	    	var properties = this.perfectMasonry;

	    	// Store old values and calculate new numbers
	    	var oldCols = properties.cols,
	    		oldRows = properties.rows;
	    	this._perfectMasonryGetSegments();
			
			// If new count was different, force layout change
			if(this.options.perfectMasonry.layout == 'horizontal' && oldRows !== properties.rows) { return true; }
			if(oldCols !== properties.cols) { return true; }
			
	    	return false;
	    },
		
		
		
		
	    /**
		 * Private
		 * Do segment calculations by hand
		 * -------------------------------------------------------------------------------------------------------- */
		_perfectMasonryGetSegments: function() {
			var properties = this.perfectMasonry;
			var parent = this.options.perfectMasonry.parent || this.element.parent();
			
			// Calculate columns
			var parentWidth = parent.width();
			properties.cols = Math.floor(parentWidth / properties.columnWidth) || 1;

			// Calculate rows
			var parentHeight = parent.height();
			properties.rows = Math.floor(parentHeight / properties.rowHeight) || 1;
		}
	});
})(jQuery);