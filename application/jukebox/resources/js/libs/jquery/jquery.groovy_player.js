/*!
	Groovy Player
	@name jquery.groovy_player.js
	@author Oleg Glozman (oleg.glozman@gmail.com)
	@version v0.2
	@date 26/02/2014
	@category jQuery plugin
	@copyright (c) 2013 Oleg Glozman
	@license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
;
(function ($) {
    var GroovyPlayer,
        defaults = {},
        __bind;

    /**
     * Context switcher, used for public API exposure.
     *
     * @param {function} func - Desired function for content switching.
     * @param {Object} context - Dsired context to bind the function to.
     * @return {function} - Bind referance function with this context switched
     */
    __bind = function (func, context) {
        return function () {
            return func.apply(context, arguments);
        };
    };


    /**
     * laylistQueue default options
     *
     * @namespace
     * @name defaults
     */
    defaults = {
        skin: 'orange',
        namespace: 'groovy',
        
		debug: true,
        
        target: {
            container: '#now-streaming'
        },
        
        ids: {
            guiPlayerID: 'groovy-player',
            groovyInspectorID: 'groovy-inspector'
        },
        
        /* callback events */
        onPlay: function(e) {},
        onPause: function(e) {},
		onEnd: function(e) {},
        onNext: function(e) {},
        onPrevious: function(e) {},
        
        onShuffle: function(isShuffle) {},
        onRepeat: function(isRepeat) {},
        onCrossfade: function(isCrossfade) {}
    };


    //GroovyPlayer: Object
    GroovyPlayer = function (el, options) {
        var instance = $(el),
            api = $.extend({}, defaults, options),
            touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
            methods = {};

        // Store a reference to the GroovyPlayer instance
        $.data(el, 'instanceRef', instance);
        
        // is device ios.. etc.
        var isDevice = {
		os: {
			iOS: (/iP(hone|od|ad)/i).test(navigator.userAgent.toLowerCase()),
        		android: (/android/i).test(navigator.userAgent.toLowerCase())
        	},
        	browser: {
        		firefox: (/firefox/i).test(navigator.userAgent.toLowerCase()),
        		chrome: (/chrome/i).test(navigator.userAgent.toLowerCase())  && (/google/i).test(navigator.vendor.toLowerCase()),
        		safari: (/safari/i).test(navigator.userAgent.toLowerCase()) && (/apple/i).test(navigator.vendor.toLowerCase()),
        		opera: (/opera/i).test(navigator.userAgent.toLowerCase()),
        	},
        	
        	mobile: function() {
        		return this.os.iOS || this.os.android
        	}
        };

		//view object class.
		var groovyView = function(options) {
			$.extend(this, options);//extend options with this.
		};
		
		groovyView.prototype = {
	        canvasReferances: null,
	        
			/**
	         * View object, contains the plugin HTML structure.
	         *
	         * @namespace
	         * @name view
	         */
	        layout: {
	            /**
	             * HTML structure of the droppable/sortable zone. Contains also the placeholder for the
	             * mediaplayer which can be triggered and controlling the widget.
	             *
	             * @return {string} HTML
	             */
	            jPlayerSkinLayout: function () {
	                var html = [
	                    '<div id="'+ api.ids.guiPlayerID +'" class="'+ api.namespace +'-gui">',
	                        '<ul class="'+ api.namespace +'-skin">',
	                			'<li class="'+ api.namespace +'-controls">',
	                				'<ul>',
	                				    '<li class="'+ api.namespace +'-icons '+ api.namespace +'-previous"><em><em>previous</em></em></li>',
	                                    '<li class="'+ api.namespace +'-icons '+ api.namespace +'-play"><em><em>play</em></em></li>',
	                                    '<li class="'+ api.namespace +'-icons '+ api.namespace +'-pause"><em><em>pause</em></em></li>',
	                                    '<li class="'+ api.namespace +'-icons '+ api.namespace +'-next"><em><em>next</em></em></li>',
	                			     '</ul>',
	                            '</li>',
	                            
	                            '<li class="'+ api.namespace +'-thumbnail"><figure><img src="about:blank" alt="" /></figure></li>',

	                    		'<li class="'+ api.namespace +'-info-minimal '+ api.namespace +'-calc-ignore">',
	                                '<em class="'+ api.namespace +'-song-name">Song Name</em>',
                                    '<strong class="'+ api.namespace +'-song-artist">Artist</strong>',
	                            '</li>',

	                    		'<li class="'+ api.namespace +'-info '+ api.namespace +'-calc-ignore">',
	                                '<span class="'+ api.namespace +'-song-info"><strong class="'+ api.namespace +'-song-artist">Artist</strong> - <em class="'+ api.namespace +'-song-name">Song Name</em></span>',
	                                '<div class="'+ api.namespace +'-song-meta">',
	                                    '<span class="'+ api.namespace +'-current-time">&nbsp;</span>',
	                                    '<div class="'+ api.namespace +'-progress-bar">',
	                                        '<div class="'+ api.namespace +'-seek-bar"><div class="'+ api.namespace +'-play-bar"></div></div>',
	                                    '</div>',
	                                    '<span class="'+ api.namespace +'-duration">&nbsp;</span>',
	                                '</div>',
	                            '</li>',
	                            
	                    		'<li class="'+ api.namespace +'-interactive '+ api.namespace +'-scrabber '+ api.namespace +'-calc-ignore">',
	                                
									'<div class="'+ api.namespace +'-scrubber">',
	                                	'<div class="'+ api.namespace +'-scrubber-active">',
	                                    	'<span class="'+ api.namespace +'-scrubber-bg"><img class="'+ api.namespace +'-scrabber" src="about:blank" alt=""/></span>',
	                                    	'<span class="'+ api.namespace +'-scrubber-progress"><img class="'+ api.namespace +'-scrabber" src="about:blank" alt=""/></span>',
                                 		'</div>',
	                                	'<div class="'+ api.namespace +'-scrubber-reflect">',
	                                    	'<span class="'+ api.namespace +'-scrubber-bg"><img class="'+ api.namespace +'-scrabber" src="about:blank" alt=""/></span>',
	                                    	'<span class="'+ api.namespace +'-scrubber-progress"><img class="'+ api.namespace +'-scrabber" src="about:blank" alt=""/></span>',
                                 		'</div>',
	                                '</div>',
	                                
	                                
	                                '<div class="'+ api.namespace +'-spectrum">',
		                                '<div class="'+ api.namespace +'-spectrum-active">',
		                                    '<span class="'+ api.namespace +'-spectrum-bg"><canvas class="'+ api.namespace +'-scrabber spectrum-scrub-bg"></canvas></span>',
		                                    '<span class="'+ api.namespace +'-spectrum-progress"><canvas class="'+ api.namespace +'-scrabber spectrum-scrub-prog"></canvas></span>',
		                                '</div>',
		                                '<div class="'+ api.namespace +'-spectrum-reflect">',
		                                    '<span class="'+ api.namespace +'-spectrum-bg"><canvas class="'+ api.namespace +'-scrabber spectrum-scrub-bg-reflect"></canvas></span>',
		                                    '<span class="'+ api.namespace +'-spectrum-progress"><canvas class="'+ api.namespace +'-scrabber spectrum-scrub-prog-reflect"></canvas></span>',
		                                '</div>',
									'</div>',
									
									'<div class="'+ api.namespace +'-scrubber-hover">',
									'</div>',
									
									'<span class="'+ api.namespace +'-current-time">&nbsp;</span>',
									'<span class="'+ api.namespace +'-duration">&nbsp;</span>',
	                            '</li>',
	                            
	                            '<li class="'+ api.namespace +'-volume">',
	                                '<ul>',
	                                    '<li class="'+ api.namespace +'-icons '+ api.namespace +'-mute"><em><em>mute</em></em></li>',
	                                    '<li class="'+ api.namespace +'-icons '+ api.namespace +'-unmute"><em><em>unmute</em></em></li>',
	                                    '<li class="'+ api.namespace +'-volume-progress">',
	                                        '<div class="'+ api.namespace +'-volume-progress-bg"><div class="'+ api.namespace +'-volume-bar-value"></div></div>',
	                                    '</li>',
	                                    '<li class="'+ api.namespace +'-icons '+ api.namespace +'-volume-max"><em><em>volume max</em></em></li>',
	                                '</ul>',
	                                
	                                '<div class="'+ api.namespace +'-options">',
	                                    '<ul>',
	                                        '<li class="'+ api.namespace +'-icons '+ api.namespace +'-shuffle"><em><em>shuffle</em></em></li>',
	                                        '<li class="'+ api.namespace +'-icons '+ api.namespace +'-repeat"><em><em>repeat</em></em></li>',
	                                        '<li class="'+ api.namespace +'-icons '+ api.namespace +'-crossfade"><em><em>crossfade</em></em></li>',
	                                    '</ul>',
	                                '</div>',
	                                
	                            '</li>',
	                    	'</ul>',
	                        
	                        '<div class="clear"></div>',
	                    '</div>'
	                ];
	
	                return $(html.join(' '));
	            }
			},
	        
	        
	        subscribeEvents: function() {
				$('.'+api.namespace +'-play').on('click', $.proxy(function(e) {
					this.parent._onPlay(e);
				}, this));
				
				$('.'+api.namespace +'-pause').on('click', $.proxy(function(e) {
					this.parent._onPause(e);
				}, this));
				
				$('.'+api.namespace +'-previous').on('click', $.proxy(function(e) {
					this.parent._onPrevious(e);
				}, this));
				
				$('.'+api.namespace +'-next').on('click', $.proxy(function(e) {
					this.parent._onNext(e);
				}, this));
				
				return this;
	        },
	        
	        
            /**
             * Appends layout to the body
             */
            draw: function () {
                this._appender(this.layout.jPlayerSkinLayout(), api.target.container);
                this.subscribeEvents();
                
                this.shuffleStateToggle();
                this.repeatStateToggle();
                this.crossfadeStateToggle();
            },
            
            
            getCanvasReferances: function() {
            	if (null !== this.canvasReferances) return this.canvasReferances;
            	
            	this.canvasReferances = {
            		el: {
            			active: {
            				background: $('.spectrum-scrub-bg').get(0),
            				progress: $('.spectrum-scrub-prog').get(0)
            			},
            			
            			reflect: {
            				background: $('.spectrum-scrub-bg-reflect').get(0),
            				progress: $('.spectrum-scrub-prog-reflect').get(0)
            			}
            		}
            	};
            	
            	this.canvasReferances.context = {
        			active: {
        				background: this.canvasReferances.el.active.background.getContext('2d'),
        				progress: this.canvasReferances.el.active.progress.getContext('2d')
        			},
        			
        			reflect: {
        				background: this.canvasReferances.el.reflect.background.getContext('2d'),
        				progress: this.canvasReferances.el.reflect.progress.getContext('2d')
        			}
            	};
            	
            	return this.canvasReferances;
            },
            
            
            getScrubberWidth: function() {
            	return $('.groovy-interactive').width();
            },
            
            
            getGroovyWidth: function() {
            	return $('#' + api.ids.guiPlayerID).width();
            },
            
            
            getScrubberWidthMinimal: function() {
            	return $('.groovy-seek-bar').width();
            },
            

            setScrubber: function(scrub) {
            	$('.groovy-scrubber-bg img').attr({src: scrub.bg});
            	$('.groovy-scrubber-progress img').attr({src: scrub.progress});
            	
            	return this;
            },
            
            
            setVolumeBar: function() {
                var volumeObj = $('.groovy-volume'),
                    volume = this.parent.getVolume(),
                    isMute = this.parent.isMute();
                
                // @todo: convert to percent instead of clear pixels width.
                volumeObj.find('.groovy-volume-bar-value').css({
                    width: volumeObj.find('.groovy-volume-progress-bg').width() * volume
                });
                
                this._toggleIf(!isMute, $('.groovy-mute'));
                this._toggleIf(isMute, $('.groovy-unmute'));
                
            	return this;
            },
            
            
            shuffleStateToggle: function() {
            	var isShuffle = this.parent.isShuffle(),
            		el = $('.groovy-shuffle');
           		
            	el.removeClass('active');
				if (true === isShuffle)
            		el.addClass('active');
            },
            
            
            repeatStateToggle: function() {
            	var isRepeat = this.parent.isRepeat(),
            		el = $('.groovy-repeat');
            	
            	el.removeClass('active');
				if (true === isRepeat)
            		el.addClass('active');

            	return this;
            },
            
            
            crossfadeStateToggle: function() {
            	var isCrossfade = this.parent.isCrossfade(),
					el = $('.groovy-crossfade');
				
            	el.removeClass('active');
				if (true === isCrossfade)
            		el.addClass('active');
            	
            	return this;
            },
            
            
            playPauseButtonToggle: function() {
                var isPlaying = this.parent.isPlaying();
                
                this._toggleIf(!isPlaying, $('.groovy-play'));
                this._toggleIf(isPlaying, $('.groovy-pause'));
                
                return this;
            },
            
            
            syncViewComponents: function() {
                var options = this.parent.options,
                    width = this.getGroovyWidth(),
                    className = api.namespace +'-gui',
                    elSize = '';
                
                // toggle view based on options.
                //this._toggleIf(true === options.waveform.enabled || true === options.spectrum.enabled, $('.groovy-interactive'));
                
                //toggle features based on condition
                this._toggleIf(true === options.waveform.enabled, $('.groovy-scrubber'));
                this._toggleIf(true === options.spectrum.enabled, $('.groovy-spectrum'));
                
                if (900 <= width) {
                    elSize += api.namespace + '-size-lg';
                } else
                if (700 <= width) {
                    elSize += api.namespace + '-size-md';
                } else
                if (600 <= width) {
                    elSize += api.namespace + '-size-sm';
                } else
                if (400 <= width) {
                    elSize += api.namespace + '-size-xs';
                } else {
                    elSize += api.namespace + '-size-xxs';
                }
                
                $('#' + api.ids.guiPlayerID).attr({'class': className + ' ' + elSize});
                
                this.setDynamicElementsWidth(elSize);
            },
            
            
            getStaticElementsWidth: function() {
            	var els = $('ul.groovy-skin').children(':visible').not('.groovy-calc-ignore'),
					width = 0;
            	
            	els.each(function(idx, el) {
            		width += $(el).outerWidth(true);
            	});
            	
            	return width;
            },
            
            
            setDynamicElementsWidth: function(elSize) {
            	var staticWidth = this.getStaticElementsWidth(),
					width = this.getGroovyWidth(),
					ratio = this.parent.options.style.interactiveRatio,
					availableWidth = 0,
					dimenstions = {},
					canvas = this.parent.view.getCanvasReferances().el,
					minimalInfoProgressBarOffset = 80,
					progressBarSaftyOffset = 3;
            	
				availableWidth = width - staticWidth;
            	
            	dimenstions = {
            		info: availableWidth - this.getWidthMargin('li.groovy-info') - progressBarSaftyOffset,
            		interactive: availableWidth * (1 - ratio) - progressBarSaftyOffset,
            		infoMinimal: availableWidth * ratio - this.getWidthMargin('li.groovy-info-minimal'),
            	};
            	
            	// xss small, diffrent layout option.
            	if (api.namespace + '-size-xxs' === elSize) {
            		dimenstions.infoMinimal = availableWidth - this.getWidthMargin('li.groovy-info-minimal');
            	}
            	
            	// info elemnt dynamic sizing.
            	$('li.groovy-info').width(dimenstions.info);
            	$('li.groovy-info div.groovy-progress-bar').width(dimenstions.info - minimalInfoProgressBarOffset);
            	
            	$('.groovy-scrabber').width(dimenstions.interactive);
            	
				if (null !== canvas) {
            		canvas.active.background.width = dimenstions.interactive;
            		canvas.active.progress.width = dimenstions.interactive;
            		
            		canvas.reflect.background.width = dimenstions.interactive;
            		canvas.reflect.progress.width = dimenstions.interactive;
            	}
            	
            	$('li.groovy-info-minimal').width(dimenstions.infoMinimal);
            	
            	return this;
            },
            
            
            getWidthMargin: function(el) {
				var left = parseInt($(el).css('margin-left')) || 0,
					right = parseInt($(el).css('margin-right')) || 0;
				
				return left + right;
            },
            
            
            _toggleIf: function(condition, el) {
                if (condition) { 
                    el.show(); 
                } else {
                    el.hide();
                }
                
                return this;
            },
            
            
            _appender: function (source, target) {
                return $(source).appendTo(target);
            }
		};
		
		var channel = function(options) {
			$.extend(this, options);//extend options with this.
		};
		
		channel.prototype = {
                fileMeta: null,
				parent: null,
				audioCtx: null,
				lasttime_inseconds: 0,
				audioBuffer: null,
				frequencyByteData: [],
				webAudioSource: null,
				javascriptNode: null,
				loaded: false,
				playing: false,
				audioEl: undefined,
				isReadyInterval: null,
				channelEndTriggered: false,
				
				
				mediaStop: function() {
                    if (this.audioEl) {
                        if (this.audioEl.pause != undefined){
                            this.audioEl.pause();
                        }
                    }
                    
                    this.setPlaying(false);
				},
				
				
	            mediaPause: function(pargs) {
	                var margs = {
	                    'audioapi_setlasttime' : true
	                };
	                
	                if (pargs) {
	                    margs = $.extend(margs, pargs);
	                }
	                
                    if (this.audioBuffer != null){
                        //console.log(this.audioCtx.currentTime, audioBuffer.duration);
                        //console.log(lasttime_inseconds);
                        ///==== on safari we need to wait a little for the sound to load
                        if (this.audioBuffer != 'placeholder') {
                            if (margs.audioapi_setlasttime == true) {
                                this.lasttime_inseconds = this.audioCtx.currentTime;
                            }
                            //console.log('trebuie doar la pauza', this.lasttime_inseconds);
                            
                            this.webAudioSource.stop(0);
                            this.setPlaying(false);
                        }
                    } else {
                        this.mediaStop();
                    }
	            },
				
				
                mediaPlay: function(time) {
					time || (time = 0);
					
					this._mediaSetup();
					if (this.audioBuffer != null) {
                        ///==== on safari we need to wait a little for the sound to load
                        if (this.audioBuffer != 'placeholder') {
                            this.webAudioSource = this.audioCtx.createBufferSource();
                            this.webAudioSource.buffer = this.audioBuffer;
                            //this.javascriptNode.connect(this.audioCtx.destination);
                            this.webAudioSource.connect(this.audioCtx.destination);

                            this.webAudioSource.connect(this.analyser);
                            //this.analyser.connect(this.audioCtx.destination);
                            //console.log("play ctx", this.lasttime_inseconds);
                            this.webAudioSource.start(0, this.lasttime_inseconds);
                            
	                        this.lasttime_inseconds = time;
	                        this.audioCtx.currentTime = this.lasttime_inseconds;
	                        //console.info(this.lasttime_inseconds);
	                        this.mediaPause({
	                        	'audioapi_setlasttime': false
							});
                         } else {
                            return;
                        }
					} else {
     					if (this.audioEl) {
                            if ('undefined' !== typeof(this.audioEl.play)) {
                            	
                            	if (true === isDevice.os.iOS) {
									this.audioEl.play(); // attpemt to play for ios.
								}
                            	
								try {
                            		//alert(this.audioEl.seekable.length);
                            		// ios fix                            		                            		
                          			if (!this.audioEl.seekable || 'object' === typeof(this.audioEl.seekable) && 0 < this.audioEl.seekable.length) {
	                                	this.audioEl.currentTime = time;
										this.audioEl.play();
									} else {
										throw 1;
									}
								} catch(e) {
									this.isReadyInterval = setTimeout($.proxy(function() {
										this.mediaPlay(time);
									}, this), 250);
								}
                            }
                        }
					}
					
					this.setPlaying(true);
                },
                
                
                isPlaying: function() {
                	return this.playing;
                },
                
                
				setPlaying: function(isPlaying) {
					this.playing = isPlaying;
					this.parent.startedPlaying();
					return this;
				},
				
                /*
	            seekToPercent: function(percent) {
	            	var totalTime = this.getActiveAudio().duration;
	                return this.mediaPlay(percent * totalTime);
	            },
				*/
                
                
	            loop: function() {
					if ('undefined' === typeof(this.audioEl)) return;
	            	
					var timeTotal = this.audioEl.duration,
						timeCurr = this.audioEl.currentTime;
					
					//console.log(timeCurr, timeTotal);
					if (true === this.parent.isCrossfade()) {
						if (0 < timeTotal && timeCurr >= (timeTotal - this.parent.options.crossfade.onBeforeEnd)) {
							if (true !== this.channelEndTriggered) {
			                	console.log('CROSSFADE END TRIGGERED.', timeTotal);
			                    this.channelEndTriggered = true;
								this.parent._onEnd(true);
							}
						}
					}
	            },
	            
	            
	            //xhr used only for iphone igger loading.
                loadSound: function(url) {
                    var request = new XMLHttpRequest();
					
                    request.open('GET', url, true);
                    request.responseType = 'arraybuffer';
                    
                    // . . . step 3 code above this line, step 4 code below
                    request.onload = $.proxy(function() {
                        //console.info('sound load');
                        this.audioCtx.decodeAudioData(request.response, $.proxy(function(buffer) {
							this.audioBuffer = buffer;
							
                            this.webAudioSource = this.audioCtx.createBufferSource();
                            this.webAudioSource.buffer = buffer;
                            
                            this.webAudioSource.connect(this.analyser);
                            this.analyser.connect(this.audioCtx.destination);
                            
							// Start playing the buffer.
                            this.webAudioSource.connect(this.audioCtx.destination);
                            //this.webAudioSource.start(0);
                        }, this), function() {
                        	console.log('err loading..');
                        });
                    }, this);
                    
                    request.send();
                },
                
                
				_initLoaded: function() {
					this.audioCtx = null;
					
					if (true === this.parent.options.spectrum.enabled) {
						this.audioCtx = this.parent.getCtx();
						
		                if (this.audioCtx) {
		                    if ('undefined' !== typeof(this.audioCtx.createJavaScriptNode)) {
		                        this.javascriptNode = this.audioCtx.createJavaScriptNode(2048, 1, 1);
		                    }
		                    
		                    if ('undefined' !== typeof(this.audioCtx.createScriptProcessor)) {
		                        this.javascriptNode = this.audioCtx.createScriptProcessor(2048, 1, 1);
		                    }
		                    
		                    if ('undefined' !== typeof(this.audioCtx.createScriptProcessor) || 'undefined' !== typeof(this.audioCtx.createScriptProcessor)) {
		                        this.javascriptNode.connect(this.audioCtx.destination);
		                        
		                        // setup a analyzer
		                        this.analyser = this.audioCtx.createAnalyser();
		                        this.analyser.smoothingTimeConstant = 0.3;
		                        this.analyser.fftSize = 512;
		                        
		                        // create a buffer source node
		                        //Steps 3 and 4
		                        //console.log('hmm');
		                        
		                        /*
								if (isDevice.mobile() && (isDevice.browser.safari || isDevice.os.iOS)) {
		                            this.loadSound(this.fileMeta.file);
		                            this.audioBuffer = 'placeholder';
		                        }
		                        */
		                        
		                        if (isDevice.browser.chrome || isDevice.browser.firefox) {
		                            this.webAudioSource = this.audioCtx.createMediaElementSource(this.audioEl);
		                            this.webAudioSource.connect(this.analyser);
		                            this.analyser.connect(this.audioCtx.destination);
		                        }
		                        
		                        this.javascriptNode.onaudioprocess = $.proxy(function() {
		                            // get the average for the first channel
		                            var frequencyByteData = new Uint8Array(this.analyser.frequencyBinCount);
		                            this.analyser.getByteFrequencyData(frequencyByteData);
		                            
		                            this.frequencyByteData = frequencyByteData;
		                        }, this);
		                    }
		                }
					}
	                
	                this.loaded = true;
	                this.mediaPlay();
				},
				
				
				_mediaSetup: function() {
					if (true === this.loaded) {
	                    return;
	                }
	                
	                var self = this;
					var eventsList = {
						'timeupdate': '',
						'durationchange': '',
						'play': '',
						'playing': '',
						'pause': '',
						'waiting': '',
						'seeking': '',
						'seeked': '',
						'volumechange': '',
						'ratechange': '',
						'suspend': '',
						'ended': function(e) {
							self.audioEl.currentTime = 0;
							
							if (true !== self.channelEndTriggered) {
								self.parent._onEnd(false);
								self.channelEndTriggered = false;
							}
						}
					};
	                
	                this.audioEl = document.createElement('audio');
	                this.audioEl.src = this.fileMeta.file;
                    this.setVolume();
                   
                    $.each(eventsList, $.proxy(function(id, callback) {
		                if ('function' === typeof(callback)) {
							this.audioEl.addEventListener(id, callback, false);
						}
                    }, this));
                    
	                this._initLoaded();
				},
				

                setVolume: function() {
                    var volume = this.parent.getVolume();
                    
                    this.audioEl.volume = volume;
                    
                    return this;
                },
                
                
                destory: function() {
					this.mediaStop();
                    this.audioEl = null;
					delete this.audioEl;
                }
		};

		
        /**
         * Private GroovyPlayer methods
         *
         * @namespace
         * @name methods
         */
        methods = {
        	/* private */
			volume: 1,
            
            
            /* private */
            mute: false,
            
            /* private */
            playing: false,
            
            /* private */
            options: {
        		reflection: true,
        		timerDynamic: true,
                waveform: {
                    enabled: true
                },
                spectrum: {
                    enabled: true,
                    color: {
                        bg: '4f4848',
                        progress: 'ae1818'
                    }
                },
                crossfade: {
                	enabled: true,
                	onBeforeEnd: 3
                },
                repeat: {
                	enabled: false
                },
                shuffle: {
                	enabled: false
                },
                style: {
                	interactiveSelectOffset: 0,
                	interactiveRatio: 0.3
                }
        	},
        	
        	
            /* private */
			song: [],
			
			
            /* private */
			view: null,
            
            
            /* private */
            channels: [],
            
            
            /* private */
            audioCtx: null,
            
            
            
			/**
             * Init function to draw layout and reset
             */
            bootstrap: function () {
                this.view = new groovyView({parent: this});
				this.view.draw();  // Apply layout
				
				this.addListeners();
				
                $(window).bind('resize', $.proxy(function() {
    				this.handleResize();
                }, this));
                
				this.loop();
				this.handleResize();
				
				return this;
            },
            
            
            addListeners: function() {
                var self = this;
                var el = {
                        interactive: $('.groovy-interactive'),
                        volume: $('.groovy-volume'),
                        options: $('.groovy-options')
                    },
                    notify = {
                        scrubber: function(e) {
                            self.mouseScrubbar(e);
                        },
                        
                        volume: function(e) {
                            self.mouseVolumeControl(e);
                        },
                        
                        mute: function(e) {
                            self.setVolume(0);
                        },
                        
                        unmute: function(e) {
                            //instead of sending 1 as the volume, a @todo: keep the value before the MUTE state and retrive it.
                            self.setVolume(1);
                        },
                        
                        shuffle: function(e) {
                            self.toggleShuffle();
                        },
                        
                        repeat: function(e) {
                        	self.toggleRepeat();
                        },
                        
                        crossfade: function(e) {
                        	self.toggleCrossfade();
                        }
                    };
					
				
				el.interactive.bind('mousemove', notify.scrubber);
                el.interactive.bind('mouseleave', notify.scrubber);
                el.interactive.bind('click', notify.scrubber);
                
                el.volume.find('.groovy-volume-progress-bg').bind('click', notify.volume);
                
                el.volume.find('.groovy-mute').bind('click', notify.mute);
                el.volume.find('.groovy-unmute').bind('click', notify.unmute);
                el.volume.find('.groovy-volume-max').bind('click', notify.unmute);
                
                el.options.find('.groovy-shuffle').bind('click', notify.shuffle);
                el.options.find('.groovy-repeat').bind('click', notify.repeat);
                el.options.find('.groovy-crossfade').bind('click', notify.crossfade);

                return this;
            },
            
            
            getActiveChannel: function() {
            	return this.channels[0]; //channel 0 is the active.. 1 is usually created only while crossfading and even then.. 0 is the active.
            },
            
            
            getActiveAudio: function() {
				return this.getActiveChannel().audioEl;
			},
            
            
            toggleRepeat: function() {
            	this.options.repeat.enabled = !this.isRepeat();
            	this.view.repeatStateToggle();
            	api.onRepeat(this.isRepeat());
            	
				return this;
            },
            
            
            isRepeat: function() {
            	return this.options.repeat.enabled;
            },
            
            
            toggleShuffle: function() {
            	this.options.shuffle.enabled = !this.isShuffle();
            	this.view.shuffleStateToggle();
            	api.onShuffle(this.isShuffle());
            	
				return this;
            },
            
            
            isShuffle: function() {
            	return this.options.shuffle.enabled;
            },
            
            
            toggleCrossfade: function() {
            	this.options.crossfade.enabled = !this.isCrossfade();
            	this.view.crossfadeStateToggle();
            	api.onCrossfade(this.isCrossfade());
            	
				return this;
            },
            
            
            isCrossfade: function() {
            	return this.options.crossfade.enabled;
            },
            
            
            isMute: function() {
                return this.mute;
            },
            
            
            getVolume: function() {
                return this.volume;
            },
            
            
            setVolume: function(volume) {
                this.volume = (1 <= volume) ? 1 : volume; // can not be greater than 1
                this.mute = (0 >= volume) ? true : false;
                
                //update view.
                this.view.setVolumeBar();

                //updates the channel with volume value.
                for (var i = 0, len = this.channels.length; i < len; i++) {
                	if ('undefined' !== typeof(this.channels[i]))
						this.channels[i].setVolume();
                } 
                
				/*
                var interactiveObj = $('.groovy-interactive');
				interactiveObj.find('.groovy-scrubber').find('img').eq(0).css({
                    transform: 'scaleY('+arg+')'
                });
                
                if(arg == 0){
                    cthis.find('.scrub-bg-img-reflect').fadeOut('slow');
                } else {
                    cthis.find('.scrub-bg-img-reflect').fadeIn('slow');
                }

                last_vol = arg;
				*/
            },
            
            
            mouseVolumeControl: function(e) {
                var mouseX = e.pageX,
					volumeObj = $('.groovy-volume'),
					volume = 0;
                
                switch(e.type) {
                	case 'mousemove':
                	case 'mouseleave':
                		break;
               		
               		case 'click': 
	                    volume = (mouseX - (volumeObj.find('.groovy-volume-progress-bg').offset().left)) / (volumeObj.find('.groovy-volume-progress-bg').width());
	                    this.setVolume(volume);
	                    muted = false;
	                    
	                    break;
                }
            },
            
            
            
            mouseScrubbar: function(e) {
                var mouseX = e.pageX,
					interactiveObj = $('.groovy-interactive'),
					scrubberWidth = this.view.getScrubberWidth();
                
                switch(e.type) {
                	case 'mousemove':
	                    interactiveObj.children('.groovy-scrubber-hover').css({
	                        left: (mouseX - interactiveObj.offset().left)
	                    });
	                    
                		break;
               		
               		case 'click': 
						var timeTotal = this.getActiveAudio().duration;
	                    var position = ((e.pageX - (interactiveObj.offset().left)) / scrubberWidth * timeTotal);
	                    this.getActiveChannel().mediaPlay(position);
	                    
	                    if (true !== this.isPlaying()) {
	                        this.getActiveChannel().mediaPlay();
	                    }
	                    
	                    break;
                }
            },
            
            
            loop: function() {
                // verify everything needed for the loop exists. Run loop only when playing.
                if ('undefined' === typeof(this.getActiveChannel()) || !this.isPlaying()) {
					return this._runLoop();
				}
                
                var scrubberWidth = this.view.getScrubberWidth(),
					currentTime = $('.groovy-current-time'),
					duration = $('.groovy-duration'),
					scrubberOffset = 0,
					scrubberOffsetPercent = 0,
					scrubberOffsetPixels = 0,
					timeTotal = this.getActiveAudio().duration,
					timeCurr = this.getActiveAudio().currentTime,
					timeOffset = 3;
                
                /*
                // might not work.. audiobuffer is per channel.. odd location for referances, check!.
				if (this.audioBuffer && 'placeholder' !== this.audioBuffer) {
                    timeTotal = this.audioBuffer.duration;
                    timeCurr = this.audioCtx.currentTime;
                    //console.log(this.audioBuffer.currentTime);
                }*/
                
				scrubberOffset = ((timeCurr - this.options.style.interactiveSelectOffset) / timeTotal);
				scrubberOffsetPercent = scrubberOffset * 100;
				
				// console.log(_scrubbar.children('.scrub-prog'), scrubberOffsetPercent, timeTotal, '-timecurr ', timeCurr, scrubberWidth);
                if (null == this.audioBuffer) {
					$('body').find('.groovy-spectrum-progress').css({
                        width: scrubberOffsetPercent + '%'
                    });
                    
					$('body').find('.groovy-scrubber-progress').css({
                        width: scrubberOffsetPercent + '%'
                    });
                    
					$('body').find('.groovy-play-bar').css({
                        width: scrubberOffsetPercent + '%'
                    });
                }

                if (true === this.options.spectrum.enabled)
                	this.drawSpectrum();
               	
                if (true === this.options.timerDynamic) {
                	scrubberOffsetPixels = scrubberOffset * scrubberWidth;
                	
					currentTime.css({
                        left: scrubberOffsetPercent + '%'
                    });
                    
                    if (scrubberOffsetPixels > scrubberWidth - 30) {
                        currentTime.css({
                            opacity: 1 - (((scrubberOffsetPixels - (scrubberWidth - 30)) / 30))
                        });
                    } else {
                        if (1 !== Number(currentTime.css('opacity'))) {
                            currentTime.css({
                                opacity: 1
                            });
                        }
                    };
                };
                
                //console.info(_currTime, timeCurr, this.formatTime(timeCurr))
                currentTime.text(this.formatTime(timeCurr));
                duration.text(this.formatTime(timeTotal));
                
                // notify channel
                for (var i = 0, len = this.channels.length; i < len; i++) {
                	if ('undefined' !== typeof(this.channels[i])) {
						this.channels[i].loop();
					} else {
						console.log(['DEBUG', this.channels, i]);
					}
                }
                
                this._runLoop();
            },
            
            
			_onPlay: function(e) {
				this.activeChannelCleanup();
				
				api.onPlay(e);
				
				return this;
			},
			
			
			_onNext: function(e) {
				this.activeChannelCleanup();
				
				api.onNext(e);
				
				return this;
			},
			
			
			_onPrevious: function(e) {
				this.activeChannelCleanup();
								
				api.onPrevious(e);
				
				return this;
			},
			
			
			_onPause: function(e) {
				this.pause();
				api.onPause(e);
				
				return this;
			},
			
			
            _onEnd: function(crossfade) {
				if (true === crossfade) {
					setTimeout($.proxy(function() {
						this.activeChannelCleanup();
					}, this), this.options.crossfade.onBeforeEnd * 1000);
				} else {
					this.activeChannelCleanup();
				}
				
				api.onEnd();
            },
            
            
            _runLoop: function() {
				requestAnimFrame($.proxy(function() {
                	this.loop();
                }, this));
                
                return this;
            },
            
            
            activeChannelCleanup: function() {
				if ('undefined' !== typeof(this.getActiveChannel())) {
					this.getActiveChannel().destory();
					console.log(this.channels);
					this.channels.shift();
				}

				return this;
            },
            
            
            pause: function() {
				this.activeChannelCleanup();
            	
            	return this;
            },
            
            
            getCtx: function() {
            	if (null === this.audioCtx) {
            		this.audioCtx = new window.AudioContext;
            	}
            	
            	return this.audioCtx;
            },
            
            
            /**
             * Based on a Fiddle I wrote: http://jsfiddle.net/Fc8Jr/
            **/
            drawSpectrum: function() {
            	var frequencyByteData = this.getActiveChannel().frequencyByteData,
					canvas = this.view.getCanvasReferances();
            	
            	var width = canvas.el.active.background.width,
            		height = canvas.el.active.background.height;
            	
            	var BAR_WIDTH = 3,
					SPACER_WIDTH = 1;
            	
            	/* test.. disabled.
				var gradient = canvas.context.active.background.createLinearGradient(0, 0, width, height);
				gradient.addColorStop(1,'#000000');
				gradient.addColorStop(0.75,'#ff0000');
				gradient.addColorStop(0.25,'#ffff00');
				gradient.addColorStop(0,'#ffffff');
				*/
			    
			    //canvas.el.active.background.width = width;
			    canvas.context.active.background.clearRect(0, 0, width, height);
			    canvas.context.active.background.fillStyle = '#'+ this.options.spectrum.color.bg;
			    
		        canvas.context.active.progress.clearRect(0, 0, width, height);
		        canvas.context.active.progress.fillStyle = '#'+ this.options.spectrum.color.progress;

			    for (var i = 0, magnitude = 0, len = frequencyByteData.length; i < len; i++) {
			        magnitude = Math.ceil(frequencyByteData[i] * height / 256);
			        if (2 > magnitude) magnitude = 2;
			        
           			canvas.context.active.background.fillRect(i * (SPACER_WIDTH + BAR_WIDTH), height, BAR_WIDTH, -magnitude);
			        canvas.context.active.progress.fillRect(i * (SPACER_WIDTH + BAR_WIDTH), height, BAR_WIDTH, -magnitude);
			        
			        //canvas.context.active.background.fillRect(i/256 * width, height, width/len, -magnitude);
			        //canvas.context.active.progress.fillRect(i/256 * width, height, width/len, -magnitude);
			    }
			    
			    if (true === this.options.reflection) {
			    	canvas.context.reflect.background.clearRect(0, 0, width, height);
			    	canvas.context.reflect.background.drawImage(canvas.el.active.background, 0, 0);
			    	
			    	canvas.context.reflect.progress.clearRect(0, 0, width, height);
			    	canvas.context.reflect.progress.drawImage(canvas.el.active.progress, 0, 0);
			    }
            },
	        
	        	        
	        handleResize: function() {
	           this.view.syncViewComponents();
               
               return this;
	        },
            
            
            isPlaying: function() {
                for (var i = 0, len = this.channels.length; i < len; i++) {
                	if ('undefined' !== typeof(this.channels[i]) && true === this.channels[i].isPlaying())
						return true;
                }

                return false;
            },
            
            
            startedPlaying: function() {
            	this.view.playPauseButtonToggle();
            },
            
            
            channelAdd: function (songMeta) {
				var channelNew = new channel({
					parent: this,
					fileMeta: songMeta,
				});
				
				$('.'+ api.namespace +'-song-artist').html(songMeta.artist);
            	$('.'+ api.namespace +'-song-name').html(songMeta.song);
            	$('.'+ api.namespace +'-thumbnail img').attr({src: songMeta.thumbnail});
            	
				this.channels.push(channelNew);
				
            	this.view.setScrubber(songMeta.scrub);
            	channelNew.mediaPlay();
                
                return this;
            },
            
            
            channelRemove: function(index) {
            	return this;
            },
            
            
            formatTime: function(time) {
                //formats the time
                var s = Math.round(time),
            		m = 0;
            
                if (0 < s) {
                    while (59 < s) {
                        m++;
                        s -= 60;
                    }
                    
                    return String((10 > m ? '0' : '') + m + ':' + (10 > s ? '0' : '') + s);
                }
                
            	return '00:00';
            }
        };

        //GroovyPlayer: Initialize
        methods.bootstrap();


        // public API
        $.extend(instance, {
			/**
             * TODO: rename to PLAY.. this is what it does..
             */
            channelAdd: __bind(function(songMeta) {
                return this.channelAdd(songMeta);
            }, methods),
            
            
            /**
             * 
             */
            pause: __bind(function() {
                return this.pause();
            }, methods)
        });
        
        return instance;
    };


    //GroovyPlayer: Plugin Function
    /**
     *
     */
    $.fn.GroovyPlayer = function(options) {
        // Helper strings to quickly perform functions on the draggable queue object.
        var args = Array.prototype.slice.call(arguments).slice(1), //Convert it to a real Array object.
            $GroovyPlayer = $(this).data('instanceRef');

        if ('undefined' === typeof($GroovyPlayer)) {
            this.each(function () {
                if ('undefined' === typeof($(this).data('instanceRef'))) {
                    $GroovyPlayer = new GroovyPlayer(this, options || {});
                }
            });
        }

        if ('object' !== typeof (options)) {
            return $GroovyPlayer[options].apply(this, args);
        }
    };

})(jQuery);
/*
window.onerror = function(msg, url, line) {
   // You can view the information in an alert to see things working
   // like so:
   console.info("Error: " + msg + "\nurl: " + url + "\nline #: " + line);

   // TODO: Report this error via ajax so you can keep track
   //       of what pages have JS issues

   return true;
};
*/
window.AudioContext = window.AudioContext || window.webkitAudioContext;

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback, el) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function isInt(n) {
	return typeof(n) === 'number' && Math.round(n) % 1 == 0;
}

function isValid(n) {
	return typeof(n) !== 'undefined' && n!='';
}