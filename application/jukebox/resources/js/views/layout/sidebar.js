define([
  'jquery',
  'backbone',
  'text!templates/layout/sidebar.html',
], function($, Backbone, sidebarTemplate) {
var SidebarController = Backbone.View.extend({
	sidebarElement: $('aside#sidebar'),
	
	initialize: function() {
		console.log( "controllers/SidebarController::initialize()" );
	},
	
	
	render: function () {
		console.log( "controllers/SidebarController::render()" );
		
		this.sidebarElement.html(sidebarTemplate);
		
		/* Sidebar Interaction */
			var $body = $('body');
			
			var touchM = "ontouchstart" in window;
		
			var mobile = ($(document).width() < 640 ? true : false);
			var smaller = ($(document).width() < 360 ? true : false);
			var $sidebar = $('#sidebar');
			var $content = $('#main');
			var $close = $('#close');
		
			if($body.hasClass('page-template-template-slideshow-php') && $body.hasClass('Stick')) $.topBoss = 'opened';
		
			if($body.hasClass('Stick'))
				$body.addClass('topBoss');
		
			var sidebarOpened = false;
			$close.click(function(){
				if(!mobile){
					if(sidebarOpened){
						closeSidebar();
						$.topBoss = 'closed';
						$body.removeClass('topBoss');
					} else {
						openSidebar();
						$.topBoss = 'opened';
						$body.addClass('topBoss');
					}
				} else {
					if(!$sidebar.hasClass('mobileSidebar')){
						$sidebar.addClass('mobileSidebar');
					} else {
						$sidebar.removeClass('mobileSidebar');
					}
				}
				return false;
			});
		
			if(!sidebarOpened) {
				//if($.cookie('sidebar_cookie_2') == 'opened' || $.cookie('sidebar_cookie_2') == 'null')
					//initSidebar('opened');
				//else if($.cookie('sidebar_cookie_2') == 'closed')
					initSidebar('closed');
			}
		
			function initSidebar(type){
				if(type == 'opened' && !mobile){
					$sidebar.css('marginLeft', 0);
					$content.css('marginLeft', 280);
				} else if(type =='closed' && !mobile){
					$sidebar.css('marginLeft', -270);
					$content.css('marginLeft', 0);
				}
			}
		
			function closeSidebar(){
				//$.cookie('sidebar_cookie_2', 'closed', {expires:7, path: '/'});
				$close.addClass('openIcon');
				if(!mobile){
					$sidebar.stop().animate({'marginLeft': -270}, 600, 'swing');
					$content.stop().animate({'marginLeft': 0}, 600, 'swing');
				} else {
					if(smaller)
						$sidebar.css('marginTop', '-90px !important');
					else
						$sidebar.css('marginTop', '-40px !important');
				}
				setTimeout(function(){
					sidebarOpened = false;
				}, 600);
			}
			function openSidebar(){
				$close.removeClass('openIcon');
				//$.cookie('sidebar_cookie_2', 'opened', {expires:7, path: '/'});
				if(!mobile){
					$sidebar.stop().animate({'marginLeft': 0}, 600, 'swing');
					$content.stop().animate({'marginLeft': 280}, 600, 'swing');
				} else {
					$sidebar.css('marginTop', '0 !important');
				}
				setTimeout(function(){
					sidebarOpened = true;
				}, 600);
			}
		
		
			var autoCloseI;
		
			var autoCloseSidebar = $body.hasClass('Stick') ? false : true;
			autoCloseSidebar = false;
		
			//if(!autoCloseSidebar && !mobile) $fSlide.css('left', 280);
		
			if(autoCloseSidebar) {
				$(document).mousemove(function(event){
					//$.cookie('mouse_cookie', event.pageX, {path: '/'});
					if($(document).width() > 640)
						if(event.pageX < 40 && !sidebarOpened){
							clearTimeout(autoCloseI);
							openSidebar();
						} else if(event.pageX > 300 && sidebarOpened){
							clearTimeout(autoCloseI);
							closeSidebar();
						}
				});
		
				autoCloseI = setTimeout(function(){
					//if(parseInt($.cookie('mouse_cookie')) > 280)
						closeSidebar();
				}, 1000);
		
			}
			
			if(mobile){
				$('.footer').children('div').children('div').each(function(){
					$(this).css({'paddingLeft': '50%', 'marginLeft': -$(this).width()/2})
				});
			} else {
				$('#main').each(function(){
					$(this).css({'paddingLeft': 'auto', 'marginLeft': 'auto'})
				});
			}
	}
	
	

});

return SidebarController;
});