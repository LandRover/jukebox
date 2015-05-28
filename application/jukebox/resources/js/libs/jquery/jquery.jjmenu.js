/* jjmenu - context menu jquery plugin
 * http://jursza.net/dev/jjmenu/
 *  
 * @author Jacek Jursza (okhan.pl@gmail.com)
 * @version 1.1.1
 * @date 2010-01-04
 * @category jQuery plugin
 * @copyright (c) 2009 Jacek Jursza (http://jursza.net/)
 * @licence MIT [http://www.opensource.org/licenses/mit-license.php]    
 */

(function($){  
   
	$.fn.jjmenu = function(clickEvent, param, myReplaces, effect) {  

		var global = this; 
		var acceptEvent = false;
		

		if ('rightClick' === clickEvent || 'both' === clickEvent)
		{
			global.mousedown(function(e) {
					if (e.button == 2 && ('rightClick' === clickEvent || 'both' === clickEvent)) { // right click
					    global.pageX = e.pageX;
                        global.pageY = e.pageY;
						e.preventDefault();
						e.stopPropagation();
						var mmain = new menu('main', param, myReplaces, this, effect);
						
						$(this)[0].oncontextmenu = function() {
							return false;
						}
						
          				$(this).unbind('mouseup');
          				$(this).blur();
          				return false;			
				    }
			});
			
    		document.body.oncontextmenu = function() {
                if ($('div[id^=jjmenu_main]').length)
					return false;
            }			
		}
		
		if ('click' === clickEvent || 'both' === clickEvent)
		{
			global.click( 
                    function(e) {
                        if (this == e.target) {
                            global.pageX = e.pageX;
                            global.pageY = e.pageY;
        					e.preventDefault();
        					e.stopPropagation();
        					var mmain = new menu('main', param, myReplaces, this, effect);
        					$(this).blur();
        					return false;			
    					}
	           		});
		}

		$(document).click(function(e) {
			if (2 != e.button)
				$('div[id^=jjmenu]').remove(); 
		});
		
        /* Menu obeject */
		function menu(id, param, myReplaces, el, effect) {
		
			var effect = getEffect(id, effect);
			
			if ('main' === id) window.triggerElement = el;
			$('div[id^=jjmenu_'+ id +']').remove();
            
            if ('sub' === id.substring(id.length - 3, id.length))
            	$(el).addClass('jj_menu_item_parent');
			
            var m  = document.createElement('div');
			var ms = document.createElement('span');
			$(m).append(ms);
			
			m.className = 'jjmenu';
			m.id = 'jjmenu_'+ id;
			$(m).css({display:'none'});
			$(document.body).append(m);
			
			positionMenu();	

			var dynamicItems = false;
			
			if  ('function' === typeof(param)) {
				param = param();
			}
			
			for (var i in param) {
				if (param[i].get) {
					dynamicItems = true;
					$.getJSON(uReplace(param[i].get), function(data) {
						for (var ii in data) {
							putItem(data[ii]);
						}
						checkPosition();
					})
					$(this).ajaxError( function() {
						checkPosition();
					});
				}
				else
				if (param[i].getByFunction) {
					
					if  ('function' === typeof(param[i].getByFunction)) {
						var uF = param[i].getByFunction;
					}
					
					var uItems = uF(myReplaces);
					for (var ii in uItems) {
						putItem(uItems[ii]);
					}
					checkPosition();
				}
				else {
					putItem(param[i]);
				}
			}
			
			if (!dynamicItems) checkPosition();
			showMenu();
			
			/* first position menu */
			function positionMenu() {
			
				var pos = $(el).offset();
				
				var t = pos.top;
				
				if ('left' === effect.xposition) {
					 var l = pos.left;
				}
				else {
					 var l = pos.left+$(el).width()+10;
				}
				
				if ('mouse' === effect.xposition) {
                    l = global.pageX;
                }
                if ('mouse' === effect.yposition) {
                    t = global.pageY;
                }

				$(m).css({position: 'absolute',top: t+'px',left: l+'px'});	         
			}
			
			/* correct menu position */
			function checkPosition() {

				var isHidden = 'none' === $(m).css('display') ? true : false; 
				var noAuto = false;
				
				if ('top' === effect.orientation || 'bottom' === effect.orientation) {
					noAuto = true;
				}
			
				if (isHidden) $(m).show();
				    var positionTop = $(m).offset().top;
				    var positionLeft = $(m).offset().left;
				if (isHidden) $(m).hide(); 
			
				var xPos = positionTop - $(window).scrollTop();
	            
                $(m).css({left: '0px'});
                    var menuHeight = $(m).outerHeight();
                    var menuWidth = $(m).outerWidth();
				$(m).css({left: positionLeft+'px'});
                
                var nleft = positionLeft;
				if ( positionLeft + menuWidth > $(window).width() ) {
                    nleft = $(window).width() - menuWidth;
                }
                				
				var spaceBottom = true;
				if ('auto' === effect.yposition && 'left' === effect.xposition) {
                    if (xPos + menuHeight + $(el).outerHeight() > $(window).height()) {
					    spaceBottom = false;
				    }				
				}				
				else {
                    if (xPos + menuHeight  > $(window).height()) {
    					spaceBottom = false;
    				}                
                }				

				var spaceTop = true;
				if (positionTop - menuHeight <  0) {
					spaceTop = false;
				}
				
				if ('bottom' === effect.yposition) {
					positionTop = positionTop + $(el).outerHeight();
				 }
				
				if (('auto' === effect.orientation && false === spaceBottom && true === spaceTop) || 'top' === effect.orientation) {
					// top orientation
					var ntop = parseInt(positionTop,10) - parseInt(menuHeight,10);
					$(m).addClass('topOriented');
				} else {
					// bottom orientation
					$(m).addClass('bottomOriented');
					if ('auto' === effect.yposition && 'left' === effect.xposition) {
						positionTop = positionTop + $(el).outerHeight();
					}
					
					var ntop = parseInt(positionTop,10);
				}
				
				$(m).css({'top': ntop+'px', 'left': nleft+'px'});
			}
			
			/* show menu depends to effect.show */
			function showMenu() {
				 if (!effect || 'default' === effect.show) {
					$(m).show();
					return false;
				 }
				 
				 var speed = parseInt(effect.speed);
				 speed = isNaN(speed) ? 500 : speed;
				   
				 switch (effect.show) 
				 {
					  case 'fadeIn': 
						$(m).fadeIn(speed); 
					  break;
					  
					  case 'slideDown': 
						$(m).slideDown(speed); 
					  break;
					  
					  default:
						$(m).show();
					  break;
				 }
			}
			
			/* put item to menu */
			function putItem(n) {
				
				var item = document.createElement('div'),
					itemSelector = null;
				
				itemSelector = $(item);
				
				$('<span class="more"></span>').appendTo(item);
				
				itemSelector.hover(
					function() {
						$(this).addClass('jj_menu_item_hover');
						if ($('.jj_menu_item_parent').length) {
						    var e = itemSelector.parent().parent().attr('id');
						    $('#' + e + ' .jj_menu_item_parent').removeClass('jj_menu_item_parent');
						}
					},
					
					function() {
						$(this).removeClass('jj_menu_item_hover')
					}
	  			);
	  			
				itemSelector.click(function(e) {
					e.stopPropagation();
					doAction(n.action);	
				});	
				
				var span = document.createElement('span');
				itemSelector.append(span);

				switch (n.type)
				{
					case 'sub':
						item.className = 'jj_menu_item jj_menu_item_more';
						itemSelector.mouseenter(function() {	 	
							var sub = new menu(id +'_sub', n.src, myReplaces, this, effect);
						});
					break;
					
					default:
						itemSelector.hover(function() { 
							$('div[id^=jjmenu_'+ id +'_sub]').remove(); 
						});
						item.className = 'jj_menu_item';
					break;
				}
				
				
				if (n.customClass && 0 < n.customClass.length) {
                    itemSelector.addClass(n.customClass);
                }
				
				$(span).html(uReplace(n.title));
				$(ms).append(item);
			}
			
			/* do action on menu item */
			function doAction(act) {
				if (act) {
					
					switch (act.type) {
						
						case 'gourl':
							if (act.target) {
								var newWindow = window.open(uReplace(act.url), act.target);
								newWindow.focus();
								return false;
							}
							else {
								document.location.href=uReplace(act.url);
							}
						break;
						
						case 'ajax':
							$.getJSON(uReplace(act.url), function(data) {
							
								var cb = act.callback;
								if ('function' === typeof(cb)) {
									cb(data);
								}
							
							});
						break;
						
						case 'fn':
								var cb = act.callback;
                                
								if ('function' === typeof(cb)) {
									cb(myReplaces);
								} 					
						break;
					}
				}
			}
			
			/* replace string with user parameters */
			function uReplace(str) {
				if (myReplaces) {
					for (var u in myReplaces) {
						str = str.replace('#'+ u +'#', eval('myReplaces.'+ u));
					}
				}
				return str;
			}

            /* get effect opbject */
			function getEffect(id, effect) {
			
				var defEffect = {
				  show: 'default',
				  xposition: 'right',
				  yposition: 'auto',
				  orientation: 'auto'
				};

				if (!effect) { return defEffect;  }      

				if (!effect.show)
					effect.show = 'default';
						  
				var show = effect.show;

				if (!effect.xposition) effect.xposition = 'right';
				if (!effect.yposition) effect.yposition = 'auto';
				if (!effect.orientation) effect.orientation = 'auto';

				if ('main' !== id) {
					var subeffect = defEffect;
					subeffect.show = show;
				}
				
				return ('main' === id) ? effect : subeffect;
			}
		} // !menu
	};  
   
 })(jQuery);