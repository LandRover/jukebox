<?php
namespace mars
{
    // include the base object and loader
    error_reporting(E_ALL); //@todo move error reporting level to config.
    $baseDir = realpath(dirname(__FILE__).'/../');
    
    require_once $baseDir.'/src/object.php';
    require_once $baseDir.'/src/loader.php';

    use \mars\Object;
    use \mars\utils\Event;
    use \mars\utils\File;
    use \mars\utils\Config;
    use \mars\utils\Request;
    
    
    /**
     * Main framework gateway
     *
     */
    class MARS extends Object
    {
        public static $APP_NAME = 'jukebox'; //app name, ugly - should be elsewhere
        protected static $instance; //singleton
        
        private $baseDir;
        
        protected static $creating;
        
        /**
         * Self invoking
         * Prevents the framework from running over and over.
         * 
         * @param string $baseDir
         * @return object of MARS
         */
        static public function create($baseDir = null)
        {
            if (self::$creating)
            {
                throw new Exception('Mars instanciation is in progress. Cannot create it again.');
            } else
            if (is_null(self::$instance))
            {
                self::$creating = true;
                self::$instance = parent::create($baseDir);
                self::$creating = false;
            }
            
            return self::$instance;
        }
        
        
        /**
         * Constructor, used to initialize the whole MARS framework
         * 
         */
        protected function init($baseDir)
        {
            $this->setBaseDir($baseDir);
            $this->bootstrap();
        }
        
        /**
         * Bootstraps the namespaces, adds lookups and subscribes to events.
         */
        public function bootstrap()
        {
            // Fix headers, PUT is set as GET, related tu FASTCGI
            $_SERVER['REQUEST_METHOD'] = (isset($_SERVER['REDIRECT_REDIRECT_REQUEST_METHOD']) ? $_SERVER['REDIRECT_REDIRECT_REQUEST_METHOD'] : $_SERVER['REQUEST_METHOD']);
            
            $baseDir = $this->getBaseDir();
            $loader = Loader::create();
            $loader->addLookup('mars', $baseDir.'/src/');
            
            // @todo: patch, should be added dynamicly from else where to lookup
            $appName = MARS::$APP_NAME;
            
            $loader->addLookup($appName, $baseDir.'/../'.$appName.'/src/');
            $loader->addLookup($appName.'\\config', $baseDir.'/../'.$appName.'/config/');
            
            // start the plugins & apps
            $dir = File::create($baseDir.'/plugins');
            foreach ($dir->readdir() as $plugin)
            {
                $ns = 'mars\\plugins\\'.$plugin;
                $loader->addLookup($ns, $baseDir."/plugins/$plugin/src/");
                $pluginClass = "\\$ns\\".ucfirst($plugin).'Plugin';

                //check namespace exists
                if (class_exists($pluginClass, true))
                {
                    // allows events to subscribe
                    $pluginClass::create();
                }
            }
            
            Event::fire('bootstrap');
        }
        
        /**
         * Start runs the application
         * Triggers the whole start process.
         * 
         * @todo Proper error handling rather than die method. 
         */
        public function start()
        {
            // @todo: patch, should be added dynamicly from else where to lookup
            $appName = MARS::$APP_NAME;
            $classAppName = strtolower($appName).'\\'.ucfirst($appName) . 'Application';
            $this->application = $classAppName::create();
            
            //make sure application exists before calling it
            if (class_exists($classAppName, true))
            {
                //call the application.
                $this->application = $classAppName::create();
                $this->application->start();
            } else {
                //@todo: proper caring for error handling.
                die('errr, not found.');
            }
        }


        /**
         * Returns base dir for the application.
         * 
         * @return string
         */
        public function getBaseDir()
        {
            return $this->baseDir;
        }


        /**
         * Sets the base dir of the project.
         * 
         * @param string $baseDir
         * @return MARS
         */
        public function setBaseDir($baseDir)
        {
            $this->baseDir = $baseDir;
            
            return $this;
        }

    }
    
    MARS::create($baseDir)->start();
}