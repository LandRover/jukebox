<?php
namespace mars\utils
{
    use \mars\Object;
    use \mars\MARS;
    
    /**
     * Config is a singleton holding all configuration  <br/>
     * API : read(), write(), delete() - each can be used with array, or simple params. 
     */
    class Config extends Object
    {
        /**
         *  The instance of the singleton object .
         * @var \mars\utils\Config
         */
        static protected $instance;
        static protected $configurationTree;
        static protected $environment = null;
        
        
        /**
         * This function will find the environment and create EnvironmentClass accordingly.
         * @return \mars\utils\Config
         */
        public static function create()
        {
            
            if (__CLASS__ !== static::getClassName())
            {
                return parent::create();
            }
            if (is_null(self::$instance))
            {
                
                $class = '\\'.MARS::$APP_NAME.'\\config\\Base';
                
                self::$instance = $class::create();
                self::$instance->setEnvironment(self::$environment);
            }
            
            return self::$instance;
        }
        
        
        /**
         * For factoring/testing - you can enter environment with this function <br/>
         * Live - the Environment will be taken from environment.json file
         * @param $env
         */
        public static function setEnvironment($env)
        {
            self::$environment = $env;
        }
        
        
        /**
         * This function check if the object exist in the configuratonTree , and return it if it is set.
         * if the object is not set - the function will return the defaultValue.
         * @param $key
         * @param $defaultValue 
         * @return array 
         */
        public function read($key, $defaultValue=null)
        {           
            if ( strpos($key, '.') === false )
            {
                if ( !isset($this->configurationTree[$key]) )
                    return $defaultValue;
                return $this->configurationTree[$key];
            }else{
                // explode and return the key!
                $routeToKey = explode('.', $key);
                $myCurrentPos = &$this->configurationTree;
                
                for ($count = 0; $count < sizeof($routeToKey) -1; $count++)
                {
                    if ( !isset($myCurrentPos[$routeToKey[$count]]) || !is_array($myCurrentPos[$routeToKey[$count]]) )
                    {
                        return $defaultValue;
                    }
                    
                    $myCurrentPos = &$myCurrentPos[$routeToKey[$count]]; 
                }
                
                if ( isset($myCurrentPos[$routeToKey[sizeof($routeToKey)-1]]) )
                {
                    return ($myCurrentPos[$routeToKey[sizeof($routeToKey)-1]]);
                }
                else
                {
                    return $defaultValue;
                }
            }
        }
        
        
        /**
         * This function writes the key=>value to the configuratonTree.
         * @param $key
         * @param $value
         */
        public function write($key, $value)
        {
            // if we got key=>value - we push it into array , because we want to process array always!
            if (!is_array($key))
            {
                $key = array($key => $value);
            }
            
            foreach ($key as $myKey => $myValue)
            {
                if (strpos($myKey, '.') === false)
                {                   
                    // check if we add array or regular key value
                    if (is_array($myValue))
                    {
                        foreach ($myValue as $ar_key => $ar_val)
                        {
                            $this->configurationTree[$myKey][$ar_key] = $ar_val;
                        }
                    }
                    else
                    {
                        // regular key value - just save to configuration Tree.
                        $this->configurationTree[$myKey] = $myValue;
                    }
                }
                else 
                {
                    $routeToKey = explode('.', $myKey);
                    $myCurrentPos = &$this->configurationTree;
                    for ( $count = 0; $count < sizeof($routeToKey)-1; $count++)
                    {
                        if ( $myCurrentPos != null && array_key_exists($routeToKey[$count], $myCurrentPos) && !is_array($myCurrentPos[$routeToKey[$count]]) )
                        {
                            $myCurrentPos[$routeToKey[$count]] = array();
                        }
                        $myCurrentPos = &$myCurrentPos[$routeToKey[$count]]; 
                    }
                    /* check if we add array or regular key value  */
                    if ( is_array($myValue) )
                    {
                        foreach ( $myValue as $ar_key => $ar_val )
                        {
                            $myCurrentPos[$routeToKey[sizeof($routeToKey)-1]][$ar_key] = $ar_val;
                        }
                    }
                    else
                    {
                        $myCurrentPos[$routeToKey[sizeof($routeToKey)-1]] = $myValue;
                    }
                }
            }
        }
        
        
        /**
         * This function will remove the key with all his tree from configurationTree.
         * @param $key
         */
        public function delete($key)
        {
            if (false === strpos($key, '.'))
            {
                /* remove key from head */
                unset($this->configurationTree[$key]);
            }
            else
            {
                $routeToKey = explode('.',$key);                
                $myCurrentPos = &$this->configurationTree;
                
                for ($count = 0; $count < sizeof($routeToKey) -1; $count++)
                {
                    $myCurrentPos = &$myCurrentPos[$routeToKey[$count]]; 
                }
                
                unset($myCurrentPos[$routeToKey[count($routeToKey)-1]]);                
            }
        }
        
        
        public function getConfigurationTree()
        {
            return $this->configurationTree;
        }
    }
}