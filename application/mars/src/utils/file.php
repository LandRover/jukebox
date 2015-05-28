<?php
namespace mars\utils
{
    use \Phar;
    use \Exception;
    use \mars\Object;
    use \mars\utils\File;
    use \mars\utils\Mimetype;
    use \DirectoryIterator;
    use \RecursiveIteratorIterator;
    use \RecursiveDirectoryIterator;
    use \FilesystemIterator;
    use \mars\utils\spl\SortedIterator;
    
    
    /**
     * This class handles a file in file system
     */
    class File extends Object
    {
        public static $ONLY_DIRS = 1;
        public static $ONLY_FILES = 2;
        public static $ONLY_LINKS = 3;
       
        private $path;
        private $exclude = '/(\/GIT\/|\/CVS\/|\/SVN\/|Thumbs\.db)/';
        

        /**
         * Constructor, sets current path of the file.
         */     
        public function init($path)
        {
            $this->path = $path;
        }
        
        
        /**
         * Return $path
         *
         * @return string
         */
        public function path()
        {
            return $this->path;
        }
        
        
        /**
         * Find a file according to patern.
         * Returns an array of files found.
         * 
         * @param string $pattern
         * @param boolean $recursive
         * @return array
         */
        public function find($pattern, $recursive = true, $only = null, $isSorted = false)
        {
            $this->assert(File::create($this->path())->exists() && is_dir($this->path()), 'Unable to find(). Path not found or not a directory: '.$this->path());
            
            $dir = $this->path();
            if (String::create($dir)->endsWith('/')) 
            {
                $dir = substr($dir, 0, -1);
            }
            
            $files = array();
            $list = ($recursive) ? new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::FOLLOW_SYMLINKS), FilesystemIterator::KEY_AS_PATHNAME | FilesystemIterator::CURRENT_AS_FILEINFO | FilesystemIterator::SKIP_DOTS) : new DirectoryIterator($dir);
            //$list = (true === $isSorted) ? new SortedIterator($list) : $list;
            
            foreach($list as $file)
            {
                if (!is_null($only) && (
                        ($only === self::$ONLY_DIRS && !$file->isDir()) ||
                        ($only === self::$ONLY_FILES && !$file->isFile()) ||
                        ($only === self::$ONLY_LINKS && !$file->isLink())
                    )) continue;
             
                $fileName = $file->getPathname();

             
                if (preg_match('/'.$pattern.'/', $fileName) && !preg_match($this->exclude, $fileName))
                {
                    $res = str_replace($dir.'/', '', $fileName);
                    if (($res === '.') || ($res === '..')) continue;
                    
                    $files[] = $res;
           
                }
            }
            
            return $files;
        }
        
        
        public function findByExt($ext, $recursive=false)
        {
            return $this->find('\.'.$ext, $recursive, File::$ONLY_FILES);
        }
        
        
        /**
         * Copy recursively $path to $dst path.
         * 
         * @param string $dst
         * @param string $patternIgnore
         * @return bool
         */
        public function copy($dst, $patternIgnore = null)
        {
            if (is_dir($this->path()))
            {
                $dir = opendir($this->path());
                
                if (!File::create($dst)->exists())
                {
                    mkdir($dst, 0777, true);
                }
                
                while (false !== ($file = readdir($dir)))
                {
                    if (($file == '.') || ($file == '..') || ($file == 'CVS'))
                    {
                        continue;
                    }
                    
                    if ($patternIgnore != null && preg_match("/$patternIgnore/", $file))
                    {
                        continue;
                    }
                    
                    $fileHandle = File::create($this->path() . '/' . $file);
                    $fileHandle->copy($dst . '/' . $file, $patternIgnore);
                }
                
                closedir($dir);
            }
            else
            {
                return copy($this->path(), $dst);
            }
        }
        
        
        /**
         * Remove recursively $path.
         * 
         * @return bool
         */
        public function rm()
        {
            $dir = $this->path();
            
            if (is_dir($dir))
            {
                $objects = scandir($dir);
                foreach ($objects AS $object)
                {
                    if (($object == '.') || ($object == '..'))
                    {
                        continue;
                    }
                    
                    $dirHandle = File::create($dir . '/' . $object);
                    $dirHandle->rm();
                }
                
                reset($objects);
                rmdir($dir);
            } else
            if (File::create($this->path())->exists())
            {
                return unlink($this->path());
            }
        }
        
        
        /**
         * Read the current $path directory
         *
         * @return array
         */
        public function readdir()
        {
            $pattern = '(.*)';
            
            return $this->find($pattern, false, File::$ONLY_DIRS);
        }
        
        
        /**
         * Read file
         * 
         * @return string
         */
        public function read()
        {
            return file_get_contents($this->path());
        }
        
        
        /**
         * Read file
         * 
         * @param $data string
         * @return int
         */
        public function write($data)
        {
            return file_put_contents($this->path(), $data);
        }
        
        
        /**
         * Recursively create a directory
         * 
         * @throws Exception
         */
        public function mkdir()
        {
            if (File::create($this->path())->exists())
            {
                if (is_dir($this->path())) 
                {
                    return; // already created
                }
                else
                {
                    throw new Exception('Path at '.$this->path().' already exists and is not a directory');
                }
            }
            
            // recursively create the parent directory
            if ($dir = dirname($this->path()))
            {
                File::create($dir)->mkdir();
            }
            
            // physically create the current directory
            mkdir($this->path());
        }
        
        
        /**
         * Get current path file extenstion, afterh the last dot.
         * 
         * @return string
         */
        public function getExt()
        {
            if (!File::create($this->path())->exists())
            {
                throw new Exception('File not found, '.$this->path());
            }
            
            return substr(strrchr($this->path(), '.'), 1);
        }
        
        
        /**
         * Strips the ext from the path
         * 
         * @return string
         */
        public function removeExt()
        {
            return substr($this->path(), 0, -4);
        }
        
        
        /**
         * Checks if the path exists
         * 
         * @return bool
         */
        public function exists()
        {
            return file_exists($this->path());
        }
        
        
        /**
         * Reads the path - file only.
         * 
         * @return string
         */
        public function readfile()
        {
            return readfile($this->path());
        }
        
        
        /**
         * Checks the filesize
         * 
         * @return string
         */
        public function fileSize()
        {
            return filesize($this->path());
        }
        
        
        /**
         * Returns the mimetype of the path
         * 
         * @return string
         */
        public function getMimetype()
        {
            $ext = File::create($this->path())->getExt();
            return Mimetype::create()->getType($ext);
        }
        
        
        /**
         * Checksum of the file, sha1, can be changed here.
         * 
         * @return string
         */
        public function checksum()
        {
            return sha1_file($this->path());
        }
    }
}