<?php
namespace mars\utils
{
	use \mars\Object;

	class Event extends Object
	{
		static private $callbacks = array();
		protected $name;
		protected $args = array();
		
		
		/**
		 * Returns the array of arguments of this Event
         * 
		 * @return array
		 */
		public function getArgs()
		{
			return $this->args;
		}
		
		
		/**
		 * Returns the name of this Event
         * 
		 * @return array
		 */
		public function getName()
		{
			return $this->name;
		}
		
		
		/**
		 * Constructor
         * 
		 * @see mars.Object::init()
		 */
		protected function init($name, array $args = array())
		{
			$this->name = $name;
			$this->args = $args;
		}
		
		
		/**
		 * Triggers a new event to all of the listeners
		 * Returns an array of the data that was returned by all of the invoked listeners
         * 
		 * @param string $name
		 * @param array $args
		 * @return array
		 */
		static public function fire($name, $args = array())
		{
			if (!isset(self::$callbacks[$name]))
			{
				return false;
			}
            
			$results = array();
            $ev = static::create($name, $args);
            
			foreach (self::$callbacks[$name] as $callback)
			{
				$results[] = call_user_func_array($callback, array($ev));
			}
            
			return $results;
		}
		
		
		/**
		 * Subscribe to an Event with a callback
         * 
		 * @param string $name
		 * @param mixed $callback (PHP-callable structure) (Usually STDCallback)
		 */
		static public function listen($name, $callback)
		{
			if (!isset(self::$callbacks[$name]))
			{
				self::$callbacks[$name] = array();
			}
            
			self::$callbacks[$name][] = $callback;
		}
	}
}