<?php 
namespace mars
{
	use \mars\exception\AssertionException;
	
    /**
     * Python like ::create method object, all classes extand this Object.
     * Prevents 'new' creationg method and enforces only the creation of one way via static method
     * ::create();
     * 
     * Makes it much easier to let the classes to decide on how should they be created.
     * Very clean and elegant
     */
	class Object
	{
		/**
		 * Final, Private constructor.
         * Prevents creating object intrally with a new operator.
         * 
         * All object must be created with a ::create via this static method.
		 */
		final private function __construct() {}
		
		
		/**
		 * Artificial __construct
         * Will be running as the contructor when ::create is used.
         * @override (if needed)
		 */
		protected function init() {}
		
		
		/**
		 * Asserts that a certain condition is met. If not, will throw AssertionException
         * 
		 * @param bool $condition
		 * @param Exception $error
		 * @return $this current object, for chaining
		 * @throws Exception
		 */
		public function assert($condition, $error = null)
		{
			if (true !== $condition)
			{
				if (!($error instanceof Exception))
				{
					$error = new AssertionException($error);
				}
                
				throw $error;
			}
            
			return $this;
		}
		
		
		/**
		 * Returns the current class, with the namespace - full className
         * 
		 * @return string
		 */
		static public function getClassName()
		{
			return get_called_class();
		}
        
        
		/**
		 * Serialize the object to json string
         * 
		 * @return string
		 */
		public function json()
		{
			return json_encode($this);
		}
        
        
		/**
		 * Returns the string representation of this, current object instance
         * 
		 * @return string
		 */
		public function __toString()
		{
			return $this->json();
		}
		
		
		/**
		 * The main create function, staticly called for allowing the objects to create themself
         * and invoke the init method which is used as a contructor.
		 */
		static public function create()
		{
			$instance = new static();
			call_user_func_array(array($instance, 'init'), func_get_args());
            
			return $instance;
		}
	}
}