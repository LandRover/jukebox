<?php 
namespace mars\plugins\mysql\utils
{
    use \RedBean_Plugin_QueryLogger;
    
    /**
     * Querylog wrapper for RedBeam query plugin.
     * 
     * Makes a good entry point for Redbeam, adding events and between the RedBeam and actually query execution.
     */
    class QueryLogger extends RedBean_Plugin_QueryLogger
    {
        public static function getInstanceAndAttach(RedBean_Observable $adapter)
        {
            $queryLog = new QueryLogger;
            $adapter->addEventListener('sql_exec', $queryLog);
            return $queryLog;
        }
        
        
        private function __construct() {}
        
        
        /*
        public function onEvent($eventName, $adapter)
        {
            if ($eventName == "sql_exec")
            {
                $sql = $adapter->getSQL();
                $this->logs[] = $sql;
            }
        }
        */
        
        public function getQueriesCount()
        {
            return count($this->getLogs());
        }
        
        
        public function getDuplicateQueriesCount()
        {
            $existingLogs = array();
            $duplicateCount = 0;
            
            foreach ($this->getLogs() as $log)
            {
                if (in_array($log, $existingLogs))
                {
                    $duplicateCount++;
                } else {
                    $existingLogs[] = $log;
                }
            }
            
            return $duplicateCount;
        }
        
    
        public function getDuplicateQueriesData()
        {
            $existingLogs = array();
            $duplicateData = array();
            
            foreach ($this->getLogs() as $log)
            {
                if (in_array($log, $existingLogs))
                {
                    if (isset($duplicateData[$log]))
                    {
                        $duplicateData[$log] ++;
                    } else {
                        $duplicateData[$log] = 1;
                    }
                } else {
                    $existingLogs[] = $log;
                }
            }
            
            return $duplicateData;
        }
    }
}