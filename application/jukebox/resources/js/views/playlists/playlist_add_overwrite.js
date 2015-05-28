define([
	'jquery',
	'backbone',
	'collections/playlists',
	'models/playlist',
	'text!templates/playlists/playlist_add.html',
    'text!templates/playlists/playlist_append.html',
    'text!templates/playlists/playlist_overwrite.html',
    'bootstrap',
    'modal'
], function($, Backbone, PlaylistsCollection, PlaylistModel, PlaylistsAddTemplate, PlaylistsAppendTemplate, PlaylistsOverwriteTemplate) {
	var PlaylistAddOverwrite = Backbone.View.extend({
        model: null,
        songsList: null,
		collection: new PlaylistsCollection(),
        
		initialize: function(options) {
            _.extend(this, options);
            
            this.model = this.model || new PlaylistModel();
            
            var self = this,
				modalWindow = new Backbone.BootstrapModal({
	                  animate: true,
	                  enterTriggersOk: true,
	                  okCloses: false,
	                  okText: 'Save',
	                  content: this
	            }).open();
            
            modalWindow.on('ok', function() { 
            	return self.okClick(modalWindow);
			});
        },
        
        
        render: function() {
            var tpl = PlaylistsAddTemplate;
            
            if (this.isOverwrite())
                tpl = PlaylistsOverwriteTemplate;
                
            if (this.isAppend())
                tpl = PlaylistsAppendTemplate;
            
            this.$el.html(_.template(tpl, {
            	name: this.getName()
            }));
          
            return this;
        },
        
        
        getName: function() {
        	return (this.isAdd()) ? $('#playlist_list_name').val() : this.model.get('name');
        },
        
        
        okClick: function(modalWindow) {
			var self = this;
			
			this.model.set({
				'name': this.getName(),
                'songs_list': this.songsList
			});
            
			this.model.save({
		         isAdd: self.isAdd(),
                 isOverwrite: self.isOverwrite(),
                 isAppend: self.isAppend()
            }, {
				error: function() {
					console.log('errrrrrrrrrrrrrr, not stored.');
				},
				success: function(model, response) {
                    if (self.isAdd()) {
					   self.collection.add(self.model);
                    }
                    
					modalWindow.close();
				}
			});
        },
        
        isOverwrite: function() {
            return true === this.overwrite;
        },
        
        isAdd: function() {
            return true === this.add;
        },
        
        isAppend: function() {
            return true === this.append;
        }
	});
	
	return PlaylistAddOverwrite;
});