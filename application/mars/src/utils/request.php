<?php
namespace mars\utils
{
	use \mars\Object;
	
	/**
	 * Process an incoming request and parse it to get the application
	 * @todo Move of the shared request logic here, like $_GET $_POST params.. currently each object uses it's own parser which is kinda bad.
	 */
	class Request extends Object
	{
		static protected $instance;
		
		/**
		 * The current request is a singleton, obviously
		 * @return \mars\utils\Request
		 */
		static public function create()
		{
			if (is_null(self::$instance))
			{
				self::$instance = parent::create();
			}
			return self::$instance;
		}
		
	}
}