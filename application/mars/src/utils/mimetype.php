<?php
namespace mars\utils
{
    use \mars\Object;

    /**
     * A class to convert file ext to mime type, limit list - only these used in the project.
     */
    class Mimetype extends Object
    {
        static protected $instance; //SINGLETON
        
        private $mimetype = array(
            'log' => 'text/plain',
            'txt' => 'text/plain',
            'css' => 'text/css',
            'gif' => 'image/gif',
            'html' => 'text/html',
            'json' => 'application/json',
            'ico' => 'image/x-ico',
            'jpe' => 'image/jpeg',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'js' => 'application/x-javascript',
            'mp3' => 'audio/mp3',
            'png' => 'image/png',
            'wav' => 'audio/wav',
            'xml' => 'text/xml',
        );
        
        
        /**
         * The current request is a singleton, obviously
         * 
         * @return \mars\utils\Mimetype
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
         * Converts between file ext to mimetype
         * 
         * @param string $ext
         * @return string
         */
        public function getType($ext)
        {
            return (array_key_exists($ext, $this->mimetype) ? $this->mimetype[$ext] : 'unknown');
        }

    }
}