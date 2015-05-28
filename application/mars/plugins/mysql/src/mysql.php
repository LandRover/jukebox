<?php
namespace mars\plugins\mysql
{
    use \R;
    use \RedBean_ModelHelper;
    use \mars\MARS;
    use \mars\Object;
    use \mars\Loader;
    use \mars\utils\Config;
    use \mars\plugins\mysql\utils\QueryLogger;
    use \mars\plugins\mysql\utils\NamespaceFormatter;
    
    // load redbeam library
    $path = dirname(dirname(__FILE__)).'/lib/redbeam/rb.php';
    Loader::create()->load($path);
    
    /**
     * Mysql plugin is a wrapper over the connection for MySQL
     * 
     * Used as a wrapper over the RedBeam library, in theory should make it easier to replace to a difrrent module.
     * The application DB is rather simple, no complex queries needed at this moment so structure should allow
     * also an easy transfer to a NOSQL DB, mongo maybe.
     * 
     * @todo all over the code still direct access to R:: exists, encapsulation is required
     */
    class Mysql extends Object
    {
        static protected $instance;
        private $config = null;
        
        /**
         * Creation function, implementes singleton as a single focal point for mysql access.
         * 
         * @return \mars\plugins\mysql\Mysql
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
         * Cosntructor function, creates the connection to the DB and sets model format.
         * Connection is esstablished via RedBeam 
         */
        public function init()
        {
            $this->config = Config::create();
            $mysql = $this->config->read('mysql');
            
            R::setup(
                'mysql:host='. $mysql['host'] .'; dbname='. $mysql['dbname'],
                $mysql['user'],
                $mysql['pass']
            );
            
            //$this->queryLogger();
            //$this->setDebugMode();
            $this->setModelFormat();
            //R::freeze(true);
        }
        
        
        /**
         * Model format is created and returned
         * 
         * @return object ModelFormat (RedBean_ModelHelper) 
         */
        private function setModelFormat()
        {
            return RedBean_ModelHelper::setModelFormatter(NamespaceFormatter::create());
        }
        
        
        /**
         * Sets the debug mode, prints out all queries
         * Param is controlled via the config
         */
        private function setDebugMode()
        {
            return R::debug($this->config->read('debug'));
        }
        
        
        /**
         * Adds querylogger ability
         * 
         * @return object RedBean_Plugin_QueryLogger
         */
        private function queryLogger()
        {
            $queryLogger = \RedBean_Plugin_QueryLogger::getInstanceAndAttach(
                R::getDatabaseAdapter()
            );
            
            $databaseAdapter = R::getDatabaseAdapter();
            
            $databaseAdapter->addEventListener('sql_exec', new QueryLogger);
            
            return $queryLogger;
        }
    }
}