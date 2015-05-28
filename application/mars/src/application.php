<?php 
namespace mars
{
	use \Exception;
	use \mars\Object;
	use \mars\controller\AuthenticationController;
	use \mars\utils\Config;
	use \mars\plugins\slim\SlimWrapper;
	
	/**
	 * The Application class is the base class for the concrete applications (and possibly plugins?). The class encapsulates all of the Application
	 * specific configurations & settings. It also acts as a request dispatcher within the domain of the application (i.e. the app's controllers)
	 *
	 */
	abstract class Application extends Object
	{
		private $controller;
		
		/**
		 * Handles the request. This method delegates the request to the relevant controller
		 */
		public function start()
		{
			//error_reporting($this->getConfig('error_reporting'));
			SlimWrapper::create();
			$this->addRoutes();
		}
		
        /**
         * Stores the routes convention for Slim CRUD.
         * A generic method for accessing the backend via CRUD.
         */
		private function addRoutes() {
			$slim = SlimWrapper::create()->getSlimInstance();
			$authenticated = AuthenticationController::create();
			
			$me = $this;
			
			$slim->get('/(:controller)(/:action)(/:params+)', function($controller = 'index', $action = 'start', $params = array()) use ($slim, $me, $authenticated) {
			    $args = func_get_args();
			    
				$className = '\\'.strtolower(MARS::$APP_NAME);
				$className .= '\\controller\\'.ucfirst($controller) . 'Controller';
				
   				if (class_exists($className, true))
				{
					$isAuthenticated = $authenticated->verifyAuthentication($className);
					if (true !== $isAuthenticated)
					{
						// not logged in.
						$action = 'start';
						$className = '\\'.strtolower(MARS::$APP_NAME).'\\controller\\LoginController';
					}
					
					$controller = $className::create($me);
					$controller->invoke($action, $params);
				}
				else
				{
					throw new Exception('Error: controller NOT found.');
				}
			});
			
			$slim->put('/:controller/:action(/:params+)', function($controller = '', $action = 'update', $params = array()) use ($slim, $me, $authenticated) {
			    $args = func_get_args();
			    
				$className = '\\'.strtolower(MARS::$APP_NAME);
				$className .= '\\controller\\'.ucfirst($controller) . 'Controller';
				
   				if (class_exists($className, true))
				{
					$isAdmin = $authenticated->isAdmin();
					if (true !== $isAdmin)
					{
						throw new Exception('Error: Not Admin');
					}
					
					$action = 'update';
					$controller = $className::create($me);
					$controller->invoke($action, $params);
				}
				else
				{
					throw new Exception('Error: controller NOT found.');
				}
			});
			
			$slim->post('/:controller/:action', function($controller = '', $action = '') use ($slim, $me, $authenticated) {
			    $args = func_get_args();
			    
				$className = '\\'.strtolower(MARS::$APP_NAME);
				$className .= '\\controller\\'.ucfirst($controller) . 'Controller';
				
   				if (class_exists($className, true))
				{
					$isAuthenticated = $authenticated->verifyAuthentication($className);
					if (true !== $isAuthenticated)
					{
						// not logged in.
						$action = 'start';
						$className = '\\'.strtolower(MARS::$APP_NAME).'\\controller\\LoginController';
					}
					
					$controller = $className::create($me);
					$controller->invoke($action);
				}
				else
				{
					throw new Exception('Error: controller NOT found.');
				}
			});
			
			$slim->delete('/:controller/:action(/:params+)', function($controller = '', $action = 'update', $params = array()) use ($slim, $me, $authenticated) {
			    $args = func_get_args();
			    
				$className = '\\'.strtolower(MARS::$APP_NAME);
				$className .= '\\controller\\'.ucfirst($controller) . 'Controller';
				
   				if (class_exists($className, true))
				{
					$isAdmin = $authenticated->isAdmin();
					if (true !== $isAdmin)
					{
						throw new Exception('Error: Not Admin');
					}
					
					$controller = $className::create($me);
					$controller->invoke($action, $params);
				}
				else
				{
					throw new Exception('Error: controller NOT found.');
				}
			});
			
			$slim->run();
		}
	}
}