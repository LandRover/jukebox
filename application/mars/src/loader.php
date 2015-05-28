<?php 
namespace mars
{
	use \mars\Object;

    /**
     * Loader util, able to load files also implements SPL autoload
     * Autoloaded files mapped by convevtion
     * 
     * All namespaces mapped to the same structure in the filesystem and loaded accordingly
     */

	class Loader extends Object
	{
		static protected $instance; // Contains the singleton instanse 
		protected $lookup = array(); // lookup array
		
		
		/**
		 * Initialize Loader
		 * @see mars.Object::init()
		 */
		protected function init()
		{
			// setup SPL autoload
			spl_autoload_register(array($this, 'autoload'));
		}
		
		
		/**
		 * Manually load a file
         * 
		 * @param string $path
		 */
		public function load($path) 
		{
			if (file_exists($path))
			{
				require $path;
				return true; 
			}
            
			return false; //false if none found.
		}
		
		
		/**
		 * Automatically loads Class by full namesspace\className
         * 
		 * @param string $className
		 */
		public function autoload($className)
		{
			/**
			 * PHP for some reason has difference between envs
			 * therefore we remove the first \ in order to match the difference.
			 */
			if (substr($className, 0, 1) == '\\')
			{
				$className = substr($className, 1);
			}

			foreach ($this->lookup as $ns => $base)
			{
				if (!(substr($className, 0, strlen($ns)) == $ns))
				{
					continue;
				}
				
				$parts = explode("\\", substr($className, strlen($ns) + 1));
				$class = array_pop($parts);
				$dir = '';
				if (count($parts))
				{
					$dir = '/'.implode('/', $parts);
				}
                
                 // @todo make better regex
				$file = strtolower(preg_replace('/([^A-Z\\\])([A-Z])/', '$1_$2', $class));
				$pathConvention = $this->lookup[$ns].$dir."/$file.php";
				$pathByClass = $this->lookup[$ns].$dir."/$class.php";
				
				//echo "DEBUG PATH: $pathConvention // $pathByClass<br />\n\n";
				if ($this->load($pathConvention) || $this->load($pathByClass))
				{ 
					return true; 
				}
			}
            
			return false;
		}
		
		
		/**
		 * Adds paths to the lookup tree, makes search more efficent, list remains short
         * 
		 * @param string $path
		 * @param string $ns (the namespace of this path)
         * 
		 * @return mars\Loader
		 */
		public function addLookup($ns, $path)
		{
			// remove last slash
			if ('/' === substr($path, -1)) {
				$path = substr($path, 0, strlen($path) - 1);
			}
			
			// add the path to the lookup list
			$this->lookup[$ns] = $path;
            
			return $this;
		}
		
		
		/**
		 * Creates and returns the Loader singleton instance
         * 
		 * @return mars\Loader 
		 */
		static public function create()
		{
			// create singleton
			if (is_null(self::$instance))
			{
				self::$instance = parent::create();
			}
			
			return self::$instance;
		}
	}
}