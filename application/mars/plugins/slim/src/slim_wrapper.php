<?php
namespace mars\plugins\slim
{
	use \mars\MARS;
	use \mars\Object;
	use \mars\Loader;
	use \mars\utils\Config;
	use \mars\controller\SessionController;	
	
	
	use \slim\Log;
	use \slim\Slim;
	use \slim\Extras\Views\Smarty;
	use \slim\Extras\Log\DateTimeFileWriter;
	
	/**
     * Slim wrapper prevents direct access to the slim framework and makes it much easier
     * to access via a middleware such as this.
     * 
     * Hooks can be added here, also uses SPL autoload.
     */
	class SlimWrapper extends Object
	{
		static protected $instance; //singleton
		private $slim = null;
		private $config = null;
		
        
		/**
		 * Create function for this object
         * Implemented as a singleton.
         * 
		 * @return \mars\plugins\slim\SlimWrapper
		 */
		static public function create()
		{
			if (is_null(self::$instance))
			{
				self::$instance = parent::create();
			}
			return self::$instance;
		}
		
		
        /**
         * Constructor function, initiates the session createion and adds SPL autoload to the lookup of the Loader.
         * Also init Slim itself and Smarty.
         */
		public function init()
		{
			$this->config = Config::create();
			
			SessionController::create()
				->setConfig($this->config->read('session'))
				->start();
			
			//add seek for slim stuff
			$loader = Loader::create();
			$loader->addLookup('slim', dirname(__FILE__) . '/../lib/slim/Slim/'); //adds Slim to autoloading
			
			$this->initSlim();
			$this->initSmarty();
		}
		
		
        /**
         * Executes slim autoload and adds internal logger.
         * 
         * @todo add better logger, log4php or something else.
         */
		private function initSlim()
		{
			Slim::registerAutoloader();
			
			$this->setSlim(new Slim(
				array_merge(
					array(
						'view' => new Smarty(),
						'log.writer' => new DateTimeFileWriter($this->config->read('logWriterSettings'))
					),
					
					$this->config->read('slim')
				)
			));
			
			//$this->getSlim()->add(new \Slim\Middleware\SessionCookie());
			
			$log = $this->getSlim()->getLog();
		}
		
		
        /**
         * Returns the stored referance for Slim object.
         * 
         * @return object Slim
         */
		public function getSlim()
		{
			return $this->slim;
		}
		
        
        /**
         * Stores the slim object referance on the wrapper.
         * 
         * @return object SlimWrapper
         */
		public function setSlim($slim)
		{
			$this->slim = $slim;
            
			return $this;
		}
		
		
        /**
         * Gets the Slim instance to access the created Slim running Instance
         * Extracted from the Slim object.
         * 
         * @return object SlimInstance
         */
		public function getSlimInstance()
        {
			return $this->getSlim()->getInstance();
		}
		
		
        /**
         * Executes Smarty templating lib
         * 
         * @todo move to an own wrapper. For smarty.. also consider swtiching off smarty.
         */
		private function initSmarty()
		{
			Smarty::$smartyDirectory = dirname(__FILE__) . '/../lib/smarty/libs/';
			Smarty::$smartyTemplatesDirectory = $this->config->read('smarty.templates');
			Smarty::$smartyCompileDirectory = $this->config->read('smarty.compile');
			Smarty::$smartyCacheDirectory = $this->config->read('smarty.cache');
			
			$smarty = Smarty::getInstance();
			$smarty->debugging = $this->config->read('smarty.debugging');
			$smarty->compile_check = $this->config->read('smarty.compile_check');
		}
	}
}