<?php
namespace jukebox\controller {
    use \Exception;

    use \mars\utils\Config;
    use \mars\utils\File;
    use \mars\utils\String;
    use \mars\controller\Controller;
    use \mars\plugins\mysql\Mysql;
    use \mars\plugins\thumbnail\Thumbnail;
    use \mars\plugins\spectrum\Spectrum;
    use \R;
    
    
    /**
     * 
     */
    class StreamController extends Controller
    {
        public static $mineType = 'audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3';
        
        /**
         * 
         */
        public function init($application)
        {
            parent::init($application);
        }
        
        
        public function play($param)
        {
            $sql = Mysql::create();
            
            $song = (isset($param[0]) ? R::load('song', $param[0]) : null);
            $this->assert(!is_null($song), 'SongID is invalid.');
            $this->assert($song->artist === $param[1], 'Artist Name is invalid. '. $param[1] . ' '. $song->artist);
            
            $path = $this->getPathList($song->path);
            $songFile = File::create($path); 
            
            if ($songFile->exists())
            {
                $this->stream($path);
            } else
                header('HTTP/1.0 404 Not Found');
        }
        
        
        public function waveform($param) {
            $sql = Mysql::create();
            
            $song = (isset($param[0]) ? R::load('song', $param[0]) : null);
            $type = (isset($param[1]) ? str_replace('.png', '', $param[1]) : null);
            $this->assert(!is_null($song), 'SongID is invalid.');
            $this->assert(!is_null($type), 'Type is invalid');
            
            $path = $this->getPathList($song->path);
            $songFile = File::create($path); 
            
            if (!$songFile->exists())
            {
                header('HTTP/1.0 404 Not Found');
            }
            
            $waveform = Spectrum::create()->waveform($song->id, $path, $type);
            
            header('Content-Type: image/png');
            echo $waveform;
            
            exit;
        }
        
        
        public function thumbnail($param)
        {
            $thumb = Thumbnail::create();
            $size = (isset($param[0]) ? $param[0] : null);
            $type = (isset($param[1]) ? $param[1] : null);
            $this->assert(!is_null($size) && !is_null($type), 'Not enought info for thumbnail '. $param[0] .', '. $param[1]);
            
            $path = '';
            
            switch($type) {
                
                case 'artist':
                    
                    $artistImage = File::create($param[2]);
                    $artistDir = $artistImage->removeExt();
                    
                    $path = $this->getPathList($artistDir .'/'. $artistDir .'.jpg');
                    
                    break;
                    
                case 'album':
                    $artistDir = $param[2];
                    
                    if (is_numeric($artistDir)) {
                        $sql = Mysql::create();
                        $album = R::load('album', $artistDir);
                        $albumDir = $album->path;
                    } else {
                        $albumImage = File::create($param[3]);
                        $albumDir = $artistDir .'/'. $albumImage->removeExt();
                    }

                    $path = $this->getPathList($albumDir .'/cover.jpg');
                    
                    break;
                    

                case 'playlist':
                    $playlistID = $param[2];
                    
                    $albumDir = '';
                    
                    if (is_numeric($playlistID))
                    {
                        $sql = Mysql::create();
                        $playlist = R::load('playlist', $playlistID);
                        
                        if ($playlist)
                        {
                            $song = R::load('song', $playlist->getFirstSongID());

                            if (0 < $song->id) {
                                $pathInfo = pathinfo($song->path); //todo: move to File CLASS.
                                $albumDir = $pathInfo['dirname'];
                            }
                        }
                    }
                    
                    if ('' !== $albumDir) {
                        $path = $this->getPathList($albumDir .'/cover.jpg');
                    } else {
                        $path = Config::create()->read('resources.images') . 'silhouette/album_not_found_200x200.jpg';
                    }

                    break;
            }
            
            $dimenstions = array(
                'x' => 250,
                'y' => 250
            );
            
            switch ($size) {
                case 'large':
                    $dimenstions = array(
                        'x' => 500,
                        'y' => 500
                    );
                    
                    break;
            }
        
            $thumb->display($path, $dimenstions['x'], $dimenstions['y']);
        }
        
        
        /**
         * 
         */
        private function getPathList($internalPath = '')
        {
            $config = Config::create();

            return $config->read('mp3.path') . $internalPath;
        }
        
        
        /**
         * Streamable file handler
         *
         * @param String $file_location
         * @param String $file_name
         * @param Header|String $content_type
         * @param Bool $force_download
         * @return content
         */
        private function stream($file, $contenttype = 'application/octet-stream') {
        
            // Avoid sending unexpected errors to the client - we should be serving a file,
            // we don't want to corrupt the data we send
            @error_reporting(0);
        
            // Make sure the files exists, otherwise we are wasting our time
            if (!file_exists($file)) {
              header("HTTP/1.1 404 Not Found");
              exit;
            }
        
            // Get the 'Range' header if one was sent
            if (isset($_SERVER['HTTP_RANGE'])) $range = $_SERVER['HTTP_RANGE']; // IIS/Some Apache versions
            else if ($apache = \apache_request_headers()) { // Try Apache again
              $headers = array();
              foreach ($apache as $header => $val) $headers[strtolower($header)] = $val;
              if (isset($headers['range'])) $range = $headers['range'];
              else $range = FALSE; // We can't get the header/there isn't one set
            } else $range = FALSE; // We can't get the header/there isn't one set
        
            // Get the data range requested (if any)
            $filesize = filesize($file);
            if ($range) {
              $partial = true;
              list($param,$range) = explode('=',$range);
              if (strtolower(trim($param)) != 'bytes') { // Bad request - range unit is not 'bytes'
                header("HTTP/1.1 400 Invalid Request");
                exit;
              }
              $range = explode(',',$range);
              $range = explode('-',$range[0]); // We only deal with the first requested range
              if (count($range) != 2) { // Bad request - 'bytes' parameter is not valid
                header("HTTP/1.1 400 Invalid Request");
                exit;
              }
              if ($range[0] === '') { // First number missing, return last $range[1] bytes
                $end = $filesize - 1;
                $start = $end - intval($range[0]);
              } else if ($range[1] === '') { // Second number missing, return from byte $range[0] to end
                $start = intval($range[0]);
                $end = $filesize - 1;
              } else { // Both numbers present, return specific range
                $start = intval($range[0]);
                $end = intval($range[1]);
                if ($end >= $filesize || (!$start && (!$end || $end == ($filesize - 1)))) $partial = false; // Invalid range/whole file specified, return whole file
              }      
              $length = $end - $start + 1;
            } else $partial = false; // No range requested
        
            // Send standard headers
            header("Content-Type: $contenttype");
            header("Content-Length: $filesize");
            header('Content-Disposition: attachment; filename="'.basename($file).'"');
            header('Accept-Ranges: bytes');
        
            // if requested, send extra headers and part of file...
            if ($partial) {
              header('HTTP/1.1 206 Partial Content'); 
              header("Content-Range: bytes $start-$end/$filesize"); 
              if (!$fp = fopen($file, 'r')) { // Error out if we can't read the file
                header("HTTP/1.1 500 Internal Server Error");
                exit;
              }
              if ($start) fseek($fp,$start);
              while ($length) { // Read in blocks of 8KB so we don't chew up memory on the server
                $read = ($length > 8192) ? 8192 : $length;
                $length -= $read;
                print(fread($fp,$read));
              }
              fclose($fp);
            } else readfile($file); // ...otherwise just send the whole file
        
            // Exit here to avoid accidentally sending extra content on the end of the file
            exit;
          }
    }
}
