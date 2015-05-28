<?php
namespace jukebox\controller {
    use \Exception;

    use \mars\utils\File;
    use \mars\utils\String;
    use \mars\utils\Config;
    use \mars\controller\Controller;
    use \mars\plugins\mysql\Mysql;
    use \mars\plugins\mp3\Mp3;
    use \R;

    /**
     * Imports data by convenstion to the DB.
     */
    class ImportController extends Controller
    {
        public static $MINIMUM_ACCESS_LEVEL = 0; // TODO: change - CLI should be access level 99 be default, after the change remove this var..
        
        private $config = null;
        private $counterSongs = 0;
        private $invalidChars = array(
            '´',
            'ë',
            ''); //@TODO: LOG INVALID NAMES!

        private $prefixList = array(
            'hidden' => array(
                '@'
            ),
            'special' => array(
                '#'
            )
        );
            
        
        public function init($application)
        {
            parent::init($application);
            $sql = Mysql::create();
            
            ob_implicit_flush(true);
            ob_end_clean();
            set_time_limit(0);
            
            ob_start();
        }


        /**
         * 
         */
        public function artists()
        {
            //R::nuke();
            //R::debug(true);
            $this->output('-', 'Artists Scan Begins');

            $dir = File::create($this->getPathList());
            foreach ($dir->readdir() as $artistName)
            {
                $this->output('-', 'Artist: "'. $artistName .'" Scan Begins');
                // structure artist and 2 albums
                $artist = R::findOne('artist', ' name = :name', array(':name' => $artistName));

                //artist not found - add new.
                if (is_null($artist))
                {
                    $this->output('X', 'Artist: "'. $artistName .'". Adding.');
                    
                    $artist = R::dispense('artist');
                    $artist->name = $artistName;
                    $artist->votes = 0;
                    $artist->is_featured = false;
                } else {
                    $this->output('V', 'Artist: "'. $artistName .'". Updating.');
                }

                R::store($artist);

                $this->albumsForArtist($artist);
            }
        }


        /**
         * 
         */
        private function albumsForArtist($artist)
        {
            $albumsDir = File::create($this->getPathList($artist->name));
            $albumsList = $albumsDir->readdir();
            
            $this->output('-', 'Scanning albums for "'. $artist->name .'"...');
            
            $albumsAdd = array();
            foreach ($albumsList as $albumDirName) {
                $firstChar = String::create($albumDirName);
                if (in_array($firstChar->firstChar(), $this->prefixList['hidden'])) {
                    $this->output('SKIP', $albumDirName .' Matched an invalid array for prefix.');
                    continue;
                }
                
                $this->output('-', $artist->name.' Scanning album "'. $albumDirName .'"...');
                
                $dirInfo = $this->_parseAlbumName($albumDirName);

                $album = R::findOne('album', ' name = :name AND artist_id = :artist_id', array(':name' =>
                        $dirInfo['name'], ':artist_id' => $artist->id));

                // album not found - ADD.
                if (is_null($album))
                {
                    $this->output('X', $artist->name.' Album: "'. $dirInfo['name'] .'". Adding.');
                    
                    $album = R::dispense('album');
                    $album->path = $artist->name .'/'. $albumDirName;
                    $album->name = $dirInfo['name'];
                    $album->year = $dirInfo['year'];
                    $album->is_featured = false;
                    $album->count_views = 0;
                    $album->count_plays_album = 0;
                    //$artist->link($album);
                } else {
                    $this->output('V', $artist->name.' Album: "'. $albumDirName .'". Updating.');
                }

                $albumsAdd[] = $album;
            }

            //store detected albums to artist.
            $artist->count_albums = sizeof($albumsAdd);
            $artist->ownAlbums = $albumsAdd;

            R::store($artist);

            $this->songsForAlbum($artist);
        }


        /**
         * 
         */
        private function songsForAlbum($artist)
        {
            $albumsDir = File::create($this->getPathList($artist->name));
            
            foreach ($albumsDir->readdir() as $albumDirName) {
                $firstChar = String::create($albumDirName);
                if (in_array($firstChar->firstChar(), $this->prefixList['hidden'])) {
                    $this->output('SKIP', $albumDirName .' Matched an invalid array for prefix.');
                    continue;
                }
                
                $album = R::findOne('album', ' path = :path AND artist_id = :artist_id', array(':path' =>
                        $artist->name . '/' . $albumDirName, ':artist_id' => $artist->id));

                $this->assert(!is_null($album), 'Album not found!!');

                $songsDir = File::create($this->getPathList($album->path) . '/');
                $songsList = $songsDir->findByExt('mp3');

                $songsAdd = array();
                foreach ($songsList as $songFileName) {
                    
                    //$this->output('DEBUG', $albumDirName.', Song: "'. $songFileName .'". DEBUG.');
                    $fileInfo = $this->_parseSongName($songFileName);

                    $song = R::findOne('song',
                        ' name = :name AND artist_id = :artist_id AND album_id = :album_id', array(
                        ':name' => $fileInfo['name'],
                        ':artist_id' => $artist->id,
                        ':album_id' => $album->id));

                    if (is_null($song)) {
                        $song = R::dispense('song');
                        $song->path = (string )$album->path . '/' . $songFileName;
                        $song->trackID = $fileInfo['trackID'];
                        $song->artist = $artist->name;
                        $song->name = $fileInfo['name'];
                        
                        $this->output('X', $albumDirName.', Song: "'. $song->path .'/". Adding.');

                        $mp3File = Mp3::create($this->getPathList($song->path));
                        $id3Info = $mp3File->getInfo();

                        $song->id3_year = $id3Info['info']['year'];
                        $song->id3_track = $id3Info['info']['track'];
                        $song->id3_genre = $id3Info['info']['genre'];

                        $song->id3_bitrate = $id3Info['meta']['bitrate'];
                        $song->id3_length = $id3Info['meta']['length_sec'];

                        $song->count_plays = 0;
                        $song->count_plays_complete = 0;
                        $song->count_plays_skip = 0;
                        $song->date_recently_played = 0;

                        $song->is_featured = false;
                        $song->album_id = $album->id;
                        $song->artist_id = $artist->id;
                    } else {
                        $this->output('V', $albumDirName.' Song: "'. $song->path .'". Updating.');
                    }

                    $songsAdd[] = $song;

                    $this->counterSongs++;
                }

                $album->count_songs = sizeof($songsAdd);
                $album->ownSongs = $songsAdd;
                R::store($album);
            }


        }


        /**
         * 
         */
        private function _parseAlbumName($dirName)
        {
            $params = preg_split('/\s+(?=\S*$)/', $dirName);
            $name = $params[0];
            $year = (isset($params[1])) ? (int) str_replace(array('(', ')'), '', $params[1]) : 0;

            // year is 0, means it's not a valid value therefor will use the original supplied version.
            // if triggered might be good idea to log and fix the dir name back to convention.
            if (0 === $year || 4 !== strlen($year)) {
                $name = $dirName;
                $year = 0;
            }
            
            return array('name' => $name, 'year' => $year);
        }


        /**
         * 
         */
        private function _parseSongName($fileName)
        {
            list($trackID, $songName) = explode(' - ', $fileName, 2);
            
            $file = File::create($songName);

            return array('trackID' => (int)$trackID, 'name' => $file->removeExt());
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
         * 
         */
        private function output($flag, $text)
        {
            echo '['.$flag.'] '.$text. "\n";
            ob_flush();
        }
    }
}
