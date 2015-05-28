<?php
namespace mars\plugins\mp3
{
    use \Id3;
    use \mp3Meta;
    use \mars\MARS;
	use \mars\Object;
	use \mars\Loader;
	use \mars\utils\Config;
    
	// load 3rd party modules for handling id3 tags for mp3 files
	$path = dirname(dirname(__FILE__)).'/lib/id3/id3.php';
	Loader::create()->load($path);
    
    $path = dirname(dirname(__FILE__)).'/lib/binary_file_reader/binary_file_reader.php';
	Loader::create()->load($path);
    
	$path = dirname(dirname(__FILE__)).'/lib/mp3_meta/mp3_meta.php';
	Loader::create()->load($path);

	class Mp3 extends Object
    {
        public $file = null;
        
        /**
         * Constructor, sets the file to be handled.
         * 
         * @param string $file
         */
        public function init($file)
		{
            $this->file = $file;
		}
        
        
        /**
         * Reads the file and returns id3 tag, if detected.
         * 
         * @return array
         */
        public function getInfo()
        {
            $this->assert(!is_null($this->file), 'File not loaded.');
            
            $file = fopen($this->file, 'rb');
            $size = filesize($this->file);
            
            $mp3Meta = new mp3Meta($file, $size);
            $meta = $mp3Meta->get_metadata();
            
            $id3 = new Id3($file);
            $id3->readAllTags();
            
            @fclose($file);

            return array(
                'info' => $id3->getID3Array(),
                'meta' => $mp3Meta->get_metadata()
            );
        }
        
	}
}