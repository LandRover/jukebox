<?php
namespace mars\plugins\thumbnail
{
	use \mars\Object;
    use \mars\utils\File;
    use \mars\utils\Config;
	use \mars\Loader;
    
    /**
     * Thumbnail generatore
     * 
     * Responsible for generating all the images in the application.
     * Resize is done by width and height passed externally. Max limit is set here but should move the config for better care.
     * 
     * Currently uses timthumb library but this wrapper also makes it easy to plug-in diffrrent 3rd party module.
     * 
     * @todo encapsulate sizes here rather than allowing direct access to the genrating function - should be direct size by name
     *       for example: tiny (200x200)
     *                    large (500x500) 
     *                    etc..
     *       currently all over the application the access to the display is direct and all over the place with many sizes.
     */
	class Thumbnail extends Object
	{
		private $config = null;
        
		private $mimeTypes = array(
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'png' => 'image/png'
        );
        
        
        /**
         * Displays an image by path, resized and centerd.
         * 
         * @param string $unixImagePath
         * @param int $width
         * @param int $height
         * @todo add property for center-crop and overall resize flags. 
         */
		public function display($unixImagePath, $width = 250, $height = 250)
		{
			$config = Config::create();
			
            //path for passing params to timbthumb emulating a request params. ugly i know.
            $_GET['src'] = $unixImagePath;
            $_GET['w'] = $width;
            $_GET['h'] = $height;
            
            //@todo move width and height max to the config rather than hardcoded value.
            //define ('DEBUG_ON', true);
            define('FILE_CACHE_DIRECTORY', $config->read('thumbnail.cache'));
            define('MAX_WIDTH', 600);
            define('MAX_HEIGHT', 600);
            define('ALLOW_EXTERNAL', false); //should remain blocked here rather than config.
            define('ALLOW_ALL_EXTERNAL_SITES', false);

            //load timthumb 3rd party lib.
			$path = dirname(dirname(__FILE__)).'/lib/timthumb.php';
			Loader::create()->load($path);
		}
	}
}