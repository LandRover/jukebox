<?php
namespace mars\utils
{
    use \mars\Object;
    use \mars\utils\String;
    
    /**
     * A class to work on strings
     */
    class String extends Object
    {
        private $string = '';
        private $output = '';
        
        /**
         * Create a new String object with the input data
         *   
         * @see mars.Object::init()
         * @return String
         */
        public function init($string)
        {
            $this->string = $string;

            return $this;
        }

        /**
         * Return the output of the stringify
         *  
         * @return string
         */
        public function output()
        {
            return $this->output;
        }

        /**
         * Duplicate output()
         * 
         * @return string
         */
        public function toString()
        {
            return $this->output();
        }
        
        
        /**
         * Converts the 'true' and 'false' strings to their boolean representation
         * 
         * @returns bool (or NULL if such a conversion isn't possible)
         */
        public function toBool()
        {
            if ('true' == $this->string)
            {
                return true;
            } else
            if ('false' == $this->string)
            {
                return false;
            }
            
            return null;
        }
        
        /**
         * Check if the input string ends with the param value
         * 
         * @param string $string
         * @return boolean 
         */
        public function endsWith($string)
        {
            if ($string == substr($this->string, strlen($string) * -1))
            {
                return true;
            }
            return false;
        }
        
        
        /**
         * Check for non-alphanumeric characters
         * 
         * @return string 
         */
        public function nonAlphanumeric()
        {
            return preg_match('/^[א-תa-z\pL]*\z/ui', $this->string);
        }
 
        
        /**
         * Stringify the string attribute and store it in output attribute
         * 
         * @param bool $cleanWhitespace
         * @return String
         */
        public function stringify($cleanWhitespace = false)
        {
            $s = '';
            
            if (is_array($this->string) || is_object($this->string))
            {
                foreach ($this->string as $n => $v)
                {
                    $string = String::create($v);
                    
                    $s .= (empty($s) ? '' : ', ') . $n . ': ' . $string->stringify()->output();
                }
                if (is_array($this->string))
                {
                    $this->output = '[ ' . $s . ' ]';
                }
                else
                {
                    $this->output = '{ ' . $s . ' }';
                }
            } else
            if (is_bool($this->string))
            {
                $this->output = ($this->string ? 'true' : 'false');
            } else
            if (is_null($this->string))
            {
                $this->output = 'null';
            } else
            if ($cleanWhitespace)
            {
                $this->output = preg_replace('{[ \n\t]+}', ' ', $this->string);
            } else {
                $this->output = $this->string;
            }
            
            return $this;
        }
        
        
        /**
         * Makes a float shorter, defaults at 2 after the dot.
         * 
         * @param int $pre
         * @return int
         */
        public function shortenFloat($pre = 2)
        {
            return (int) ($this->string * pow(10, $pre)) / pow(10, $pre);
        }
        
        
        /**
         * Gets the first char of the string.
         * @return string
         */
        public function firstChar()
        {
            return substr($this->string, 0, 1);
        }
        
        
        /**
         * Verifies string is UTF8 type
         * 
         * @return bool
         */
        public function isUTF8()
        {
            return ('UTF-8' === mb_detect_encoding($this->string, 'UTF-8', true));
        }
    }
}