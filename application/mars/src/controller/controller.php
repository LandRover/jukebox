<?php
namespace mars\controller
{
	use \Exception;
	use \mars\Object;
	use \mars\Application;
	use \mars\plugins\slim\SlimWrapper;
	use \mars\exception\MethodNotFoundException;
	
	
	/**
     * Base controller is extened by all the other controllers within the framework.
     * 
     * Controller, in theory should encapsulate and contain explicit request processing. Such as a directly
     * accessed controller from within the framework or an externally exposed controller that is accesed via a request (or cli).
     * 
     * Each public method in a controller is exposed via url or cli on the 'action' param.
     * 
     * @todo Consider making another controller for exterally exposed API rather than all extanding Controller. 
 	 */
	abstract class Controller extends Object
	{
		protected $application;
		protected $persistence;
		public static $MINIMUM_ACCESS_LEVEL = 5; // regular authed user.
		
		/**
		 * Controller's constructor
		 * @param Application $application
		 */
		public function init(Application $application)
		{
			$this->application = $application;
		}
		
		
		/**
		 * Returns the controller's parent Application
		 * @return Application
		 */
		public function getApplication()
		{
			return $this->application;
		}
		
		
		/**
		 * Root action dispather. All external requests arrive eventually to this method which, in turn, dispatches the request to the 
		 * relevant action method.
		 * @param string $action
		 * @return mixed (the action's return value)
		 */
		public function invoke($action = null, $params = array())
		{
			if (method_exists($this, $action))
			{
				$result = $this->$action($params);
				
				return $result;
			}
			else
			{
				throw new MethodNotFoundException('Controller method not found');
			}
		}
		
		
        /**
         * Render is printing out a specific template and returns the view.
         * Usually the last function called before the request ends.
         * 
         * @param string $template
         * @param array $params
         * @return string html
         */
		protected function render($template, $params = array()) {
			$slim = SlimWrapper::create()->getSlimInstance();
			
			return $slim->render($template.'.html', $params);
		}
	}
}